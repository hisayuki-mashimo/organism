<?php

/**
 * ダンジョン空間作成クラス
 *
 */
class Labyrinth
{
    /* 外部制御用変数群 ----------------------------------------------------------------------------------------------------*/

    public $rgon_scales;                // 管区の規模(最小値: 配列('Y' => 2, 'X' => 2))
    public $rgon_side;                  // 管区の一辺(最小値: 6)
    public $room_count;                 // 部屋の数(最小値: 2)
    public $room_side_max;              // 部屋の一辺の最大値(最小値: 1)
    public $room_area_disp;             // 部屋の面積の分布(面積 => 設定確率)(最低要素: 配列(1 => 1))




    /* 内部処理用変数群 ----------------------------------------------------------------------------------------------------*/

    protected $_sect_tiles = array();   // 区画集合データ
    protected $_rgon_tiles = array();   // 管区集合データ
    protected $_rgon_links = array();   // 管区接続データ
    protected $_room_tiles = array();   // 部屋集合データ
    protected $_room_chain = array();   // 部屋連鎖データ
    protected $_road_tiles = array();   // 通路集合データ
    protected $_gate_tiles = array();   // 接点集合データ
    protected $_gate_tasks = array();   // 部屋に設置する接点の個数群
    protected $_gate_cands = array();   // 部屋が接点を設置できる地点群
    protected $_obje_tiles = array();   // オブジェクト集合データ
    protected $_type_wall  = 0;         // タイプ: 壁面
    protected $_type_road  = 1;         // タイプ: 通路
    protected $_type_room  = 2;         // タイプ: 部屋
    protected $_type_stir  = 3;         // タイプ: 階段




    /* 外部制御用関数群 ----------------------------------------------------------------------------------------------------*/

    /**
     * コンストラクタ
     *
     * @access  public
     */
    public function __construct()
    {
        
    }


    /**
     * 設定
     *
     * @access  public
     * @param   array   $params
     */
    public function init($params = array())
    {
        $this->rgon_scales = array();
        $this->rgon_scales['Y'] = isset($params['rgon_Y']) ? $params['rgon_Y'] : 2;
        $this->rgon_scales['X'] = isset($params['rgon_X']) ? $params['rgon_X'] : 2;
        if($this->rgon_scales['Y'] < 2){ $this->rgon_scales['Y'] = 2; }
        if($this->rgon_scales['X'] < 2){ $this->rgon_scales['X'] = 2; }

        $this->rgon_side = isset($params['rgon_side']) ? (int)$params['rgon_side'] : 6;
        if($this->rgon_side < 6){ $this->rgon_side = 6; }

        $this->room_count = isset($params['room_count']) ? (int)$params['room_count'] : 2;
        if($this->room_count < 2){ $this->room_count = 2; }

        $this->room_side_max  = isset($params['room_side_max'])  ? (int)$params['room_side_max'] : 1;
        $this->room_area_disp = isset($params['room_area_disp']) ? (array)$params['room_area_disp'] : array(1 => 1);
        if(! isset($this->room_area_disp[1])){ $this->room_area_disp[1] = 1; }
    }


    /**
     * 構築
     *
     * @access  public
     */
    public function build()
    {
        // 管区集合データの構築
        for($Y = 0; $Y < $this->rgon_scales['Y']; $Y ++){
            for($X = 0; $X < $this->rgon_scales['X']; $X ++){
                $this->_setRgon($Y, $X);
            }
        }

        // 部屋の定義
        $room_seeds = $this->_collectRoomSeeds();
        foreach($room_seeds as $room_chain_id => $rgon_coord){
            $rgon = $this->_getRgon($rgon_coord);
            $this->_setRoom($rgon, $room_chain_id);
        }

        // 部屋の領域確定・ゲート設定
        foreach($this->_room_tiles as $room){
            $this->_setRoomTerritory($room);
            $this->_setGates($room);
        }

        // 部屋の設定
        $vect_paramses = array(
            array('P' => 'Y', 'S' => 'X', 'vects_P' => array('T', 'B'), 'vects_S' => array('R', 'L')),
            array('P' => 'X', 'S' => 'Y', 'vects_P' => array('R', 'L'), 'vects_S' => array('T', 'B'))
        );
        foreach($vect_paramses as $turn => $params){
            $axis_Y = rand(0, ($this->rgon_scales['Y'] - 1));
            $axis_X = rand(0, ($this->rgon_scales['X'] - 1));
            $axis_coord = $this->_numbersToCoord($axis_Y, $axis_X);
            for($range_P = 0; $range_P < $this->rgon_scales[$params['P']]; $range_P ++){
                for($range_S = 0; $range_S < $this->rgon_scales[$params['S']]; $range_S ++){
                    shuffle($params['vects_P']);
                    shuffle($params['vects_S']);
                    foreach($params['vects_P'] as $P){
                        $prmys = array($this->_getEgoAim($P), $P);
                        foreach($params['vects_S'] as $S){
                            list($rgon_Y, $rgon_X) = $this->_slide($axis_Y, $axis_X, $S, $range_S);
                            list($rgon_Y, $rgon_X) = $this->_slide($rgon_Y, $rgon_X, $P, $range_P);
                            if($rgon = $this->_getRgon($rgon_Y, $rgon_X)){
                                if($rgon->type == $this->_type_room){
                                    foreach($prmys as $aim){
                                        $this->_setRoomMete($rgon->room, $rgon->coord, $aim);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // 部屋の設定の反映
        foreach($this->_room_tiles as $room){
            $this->_reflectRoom($room);
        }

        // 部屋の連結
        foreach(range(0, ($this->rgon_scales['Y'] * $this->rgon_scales['X'])) as $i){
            $strt_gate = $this->_specifyStartGate();
            $trgt_room = $this->_specifyTargetRoom($strt_gate);
            $this->_tieRgon($strt_gate, $trgt_room);
            $this->_tieRgon($strt_gate, $trgt_room);

            if((count($this->_room_chain) <= 1) && empty($this->_gate_tasks)){
                break;
            }
        }

        // 通路の設定
        foreach($this->_road_tiles as $road){
            $this->_specifyIntersection($road);
        }

        // 通路の開通
        foreach($this->_rgon_links as $link){
            foreach($link as $role => $param){
                $rgon = $this->_getRgon($param['rgon']->coord);
                switch($rgon->type){
                    case $this->_type_room:
                        $link[$role]['coords'] = $this->_specifyGateCands($param['rgon'], $param['aim']);
                        $link[$role]['type']   = $this->_type_room;
                        break;
                    case $this->_type_road:
                        $road = $this->_getRoad($param['rgon']);
                        $link[$role]['coords'] = $this->_specifyJunctionCands($road, $param['aim']);
                        $link[$role]['type']   = $this->_type_road;
                }
            }

            $this->_paveRoad($link[0], $link[1]);
        }

        // 通路の整備
        foreach($this->_road_tiles as $road_coord => $road){
            $this->_maintainRoad($road);
        }
    }


    /**
     * 階段の設置
     *
     * @access  public
     */
    public function setStair()
    {
        $room_cands = array_keys($this->_room_tiles);
        $room_coord = $room_cands[array_rand($room_cands)];
        $room = $this->_getRoom($room_coord);
        $edges = $room->rgon_edges;
        $pdngs = $room->sect_pdngs;

        $sect_Y = rand(
            $this->rgon_side * $edges['T'] + $pdngs['T'] + 1,
            $this->rgon_side * ($edges['B'] + 1) - $pdngs['B'] - 2
        );
        $sect_X = rand(
            $this->rgon_side * $edges['L'] + $pdngs['L'] + 1,
            $this->rgon_side * ($edges['R'] + 1) - $pdngs['R'] - 2
        );

        $this->_obje_tiles[$sect_Y][$sect_X] = $this->_type_stir;
    }


    /**
     * 区画データの文字列出力
     *
     * @access  public
     * @return  string  全区画の数値化された改行区切り文字列データ
     */
    public function export()
    {
        $lines = array();

        $max_Y = $this->rgon_side * $this->rgon_scales['Y'] - 1;
        $max_X = $this->rgon_side * $this->rgon_scales['X'] - 1;
        for($Y = 0; $Y <= $max_Y; $Y ++){
            $line = '';
            for($X = 0; $X <= $max_X; $X ++){
                $line .= $this->_sect_tiles[$Y][$X];
            }
            $lines[] = $line;
        }

        return implode("\n", $lines);
    }




    /* 内部処理用関数群 ----------------------------------------------------------------------------------------------------*/

    /**
     * 部屋の核座標の収集
     *
     * @access  protected
     * @return  array       管区集合データの座標群
     */
    protected function _collectRoomSeeds()
    {
        $room_seeds = array();
        $room_cands = $this->_rgon_tiles;

        // 一対の対角に必ず部屋を設置する。
        list($min_Y, $max_Y) = array(0, ($this->rgon_scales['Y'] - 1));
        list($min_X, $max_X) = array(0, ($this->rgon_scales['X'] - 1));
        $rgon_corner_pairs = array(
            0 => array(0 => $this->_numbersToCoord($min_Y, $min_X), 1 => $this->_numbersToCoord($max_Y, $max_X)),
            1 => array(0 => $this->_numbersToCoord($min_Y, $max_X), 1 => $this->_numbersToCoord($max_Y, $min_X))
        );
        $room_seeds = $rgon_corner_pairs[rand(0, 1)];
        unset($room_cands[$room_seeds[0]]);
        unset($room_cands[$room_seeds[1]]);

        // 規定の個数に必要な残数分を無作為に抽出する。
        if($this->room_count > 2){
            $room_cands = array_keys($room_cands);
            shuffle($room_cands);
            $room_seeds = array_merge($room_seeds, array_splice($room_cands, 0, ($this->room_count - 2)));
        }

        return $room_seeds;
    }


    /**
     * 部屋の領域確定
     *
     * @access  protected
     * @param   object      $room
     */
    protected function _setRoomTerritory($room)
    {
        list($Y, $X) = explode('_', $room->base_coord);
        $edges = array('T' => $Y, 'R' => $X, 'B' => $Y, 'L' => $X);
        $extend_cands = array(1 => array(0 => $edges));
        $this->_tryExtendRoomTerritory($edges, $extend_cands);

        $area_probs = array();
        foreach($extend_cands as $area => $extend){
            for($i = 0; $i < $this->room_area_disp[$area]; $i ++){
                $area_probs[] = $area;
            }
        }

        $area  = $area_probs[array_rand($area_probs)];
        $edges = $extend_cands[$area][array_rand($extend_cands[$area])];
        $room->rgon_edges = $edges;

        for($v = $edges['T']; $v <= $edges['B']; $v ++){
            for($n = $edges['L']; $n <= $edges['R']; $n ++){
                $rgon = $this->_getRgon($v, $n);
                $rgon->type = $this->_type_room;
                $rgon->room = $room;
            }
        }
    }


    /**
     * 部屋の四方への拡大可否確認
     *
     * @access  protected
     * @param   array       $edges          拡張処理の基礎データとなる部屋連鎖データ
     * @param   array       &$edges_cands   拡張候補の部屋連鎖データ群
     * @return  array                       各方向について、拡大が可能な場合は対象域の座標群を返却する。
     */
    protected function _tryExtendRoomTerritory($edges, &$edges_cands)
    {
        $room_Y     = $edges['B'] - $edges['T'] + 1;
        $room_X     = $edges['R'] - $edges['L'] + 1;
        $room_area  = $room_Y * $room_X;
        $area_max   = max(array_keys($this->room_area_disp));
        $aim_coords = array();
        $aim_params = array(
            'T' => array('edge' => ($edges['T'] - 1), 'coord' => (($edges['T'] - 1) . '_%s'), 'from' => $edges['L'], 'to' => $edges['R']),
            'R' => array('edge' => ($edges['R'] + 1), 'coord' => ('%s_' . ($edges['R'] + 1)), 'from' => $edges['T'], 'to' => $edges['B']),
            'B' => array('edge' => ($edges['B'] + 1), 'coord' => (($edges['B'] + 1) . '_%s'), 'from' => $edges['L'], 'to' => $edges['R']),
            'L' => array('edge' => ($edges['L'] - 1), 'coord' => ('%s_' . ($edges['L'] - 1)), 'from' => $edges['T'], 'to' => $edges['B'])
        );

        foreach($aim_params as $aim => $param){
            $aim_params = array('edge' => $param['edge'], 'coords' => array());
            for($var = $param['from']; $var <= $param['to']; $var ++){
                $coord = sprintf($param['coord'], $var);
                switch(true){
                    case (! ($rgon = $this->_getRgon($coord))):
                    case ($rgon->type == $this->_type_room):
                    case ((($aim == 'T') || ($aim == 'B')) && (($room_Y + 1) > $this->room_side_max)):
                    case ((($aim == 'R') || ($aim == 'L')) && (($room_X + 1) > $this->room_side_max)):
                        continue 3;
                        break;
                }
                $aim_params['coords'][$coord] = true;
            }

            $pred_edges = $edges;
            $pred_edges[$aim] = $aim_params['edge'];
            $area = $room_area + count($aim_params['coords']);
            if(isset($this->room_area_disp[$area])){
                $edges_cands[$area] = array_merge(array($pred_edges), (isset($edges_cands[$area]) ? $edges_cands[$area] : array()));
            }

            if($area < $area_max){
                $this->_tryExtendRoomTerritory($pred_edges, $edges_cands);
            }

            $aim_coords[$aim] = $aim_params;
        }

        return $aim_coords;
    }


    /**
     * 部屋の境界確定
     *
     * @access  protected
     * @param   object      $room       部屋集合データ
     * @param   int         $rgon_coord 対象管区座標
     * @param   string      $edge_aim   方向
     */
    protected function _setRoomMete($room, $rgon_coord, $edge_aim)
    {
        if($room->inited[$edge_aim] == false){
            $aim_env = $this->_getEgoEnv($edge_aim);
            $edges = $room->rgon_edges;
            $rgon = $this->_getRgon($rgon_coord);
            if($rgon->pos[$aim_env['P']] == $edges[$edge_aim]){
                $aim_R = $this->_getEgoAim($edge_aim, 'R');
                $aim_L = $this->_getEgoAim($edge_aim, 'L');
                $mete_terms = array('min' => array(0), 'max' => array($this->rgon_side - 3));
                $agst_aim = $this->_getEgoAim($edge_aim);
                if($edges[$edge_aim] == $edges[$agst_aim]){
                    if($room->inited[$agst_aim] == true){
                        $mete_terms['max'][] = $this->rgon_side - 3 - $room->sect_pdngs[$agst_aim];
                    }
                }
                foreach(range($edges[$aim_R], $edges[$aim_L]) as $scdy){
                    $pos = array($aim_env['P'] => $edges[$edge_aim], $aim_env['S'] => $scdy);
                    list($agst_Y, $agst_X) = $this->_slide($pos['Y'], $pos['X'], $edge_aim);
                    $agst_rgon_coord = $this->_numbersToCoord($agst_Y, $agst_X);
                    if($agst_room = $this->_getRoom($agst_rgon_coord)){
                        if($agst_room->inited[$agst_aim] == true){
                            $agst_pdng = $agst_room->sect_pdngs[$agst_aim];
                            $mete_terms['min'][] = 3 - $agst_pdng;
                        }
                    }
                }

                foreach(array('R', 'L') as $aim){
                    $aim_D  = $this->_getEgoAim($edge_aim, 'D');
                    $aim_S  = $this->_getEgoAim($edge_aim, $aim);
                    $aim_SD = $this->_getEgoAim($aim_S, 'D');
                    $pos = array($aim_env['P'] => $edges[$edge_aim], $aim_env['S'] => $edges[$aim_S]);
                    list($adst_Y, $adst_X) = $this->_slide($pos['Y'], $pos['X'], $edge_aim);
                    list($adst_Y, $adst_X) = $this->_slide($adst_Y, $adst_X, $aim_S);
                    list($far_Y,  $far_X)  = $this->_slide($adst_Y, $adst_X, $aim_S);
                    $ajst_rgon             = $this->_getRgon($adst_Y, $adst_X);
                    $ajst_rgon_far         = $this->_getRgon($far_Y,  $far_X);
//$this->_l('[[', $aim, ']]');
//$this->_l($crnr_rgon_coord, '-');
//$this->_l($ajst_rgon_coord, '=');
//$this->_lb($ajst_rgon_coord_far, '#');
//$this->_lb('(', ($ajst_rgon ? $ajst_rgon->type : 'N'), ')');
                    if($ajst_rgon && $ajst_rgon->type == $this->_type_room){
//$this->_lb($ajst_rgon->pos);
                        switch(true){
                            case ($ajst_rgon->room->rgon_edges[$aim_D]  != $ajst_rgon->pos[$aim_env['P']]):
                            case ($ajst_rgon->room->rgon_edges[$aim_SD] != $ajst_rgon->pos[$aim_env['S']]):
                            case ($ajst_rgon->room->inited[$aim_D]  == false):
                            case ($ajst_rgon->room->inited[$aim_SD] == false):
/*$this->_lb('<#>', $ajst_rgon->room->rgon_edges[$aim_D],  '|', $ajst_rgon->pos[$aim_env['P']], '<#>');
$this->_lb('<#>', $ajst_rgon->room->rgon_edges[$aim_SD], '|', $ajst_rgon->pos[$aim_env['S']], '<#>');
$this->_lb('<$>', $ajst_rgon->room->inited[$aim_D],  '<$>');
$this->_lb('<$>', $ajst_rgon->room->inited[$aim_SD], '<$>');*/
                                break;
                            default:
                                $mete_terms['min'][] = 2 - $ajst_rgon->room->sect_pdngs[$aim_D];
                        }
                    }
//$this->_lb('(', ($ajst_rgon_far ? $ajst_rgon_far->type : 'N'), ')');
                    if($ajst_rgon_far && $ajst_rgon_far->type == $this->_type_room){
//$this->_lb($ajst_rgon_far->pos);
                        switch(true){
                            case ($ajst_rgon_far->room->rgon_edges[$aim_D]  != $ajst_rgon_far->pos[$aim_env['P']]):
                            case ($ajst_rgon_far->room->inited[$aim_D] == false):
//$this->_lb('<#>', $ajst_rgon_far->room->rgon_edges[$aim_D], '|', $ajst_rgon_far->pos[$aim_env['P']], '<#>');
//$this->_lb('<$>', $ajst_rgon_far->room->inited[$aim_D], '<$>');
                                break;
                            default:
                                $mete_terms['min'][] = 1 - $ajst_rgon_far->room->sect_pdngs[$aim_D];
                        }
                    }
                }

                $room->sect_pdngs[$edge_aim] = rand(
                    max($mete_terms['min']),
                    min($mete_terms['max'])
                );
                $room->inited[$edge_aim] = true;
            }
        }
    }


    /**
     * 接点の構築
     *
     * @access  protected
     * @param   object      $room   部屋集合データ
     */
    protected function _setGates($room)
    {
        // 接点候補の設定
        $this->_gate_cands[$room->base_coord] = array();
        foreach($this->_getAims() as $aim){
            $aim_env = $this->_getEgoEnv($aim);
            $P   = $room->rgon_edges[$aim];
            $S_1 = $room->rgon_edges[$this->_getEgoAim($aim, 'R')];
            $S_2 = $room->rgon_edges[$this->_getEgoAim($aim, 'L')];
            foreach(range($S_1, $S_2) as $S){
                $pos = array($aim_env['P'] => $P, $aim_env['S'] => $S);
                $gate_rgon = $this->_getRgon($pos['Y'], $pos['X']);
                list($rgon_Y, $rgon_X) = $this->_slide($pos['Y'], $pos['X'], $aim);
                if($rgon = $this->_getRgon($rgon_Y, $rgon_X)){
                    $gate = $this->_setGate($gate_rgon, $aim);
                    $this->_gate_cands[$room->base_coord][$gate->coord] = $gate;
                }
            }
        }

        // 接点個数の設定
        $zhou = count($this->_gate_cands[$room->base_coord]);
        $count_cands = array('max' => null, 'cands' => array());
        for($i = 1; $i <= $zhou; $i ++){
            $wid = ceil(cos(deg2rad(($i / $zhou) * 90)) * 100);
            $hgt = ceil(sin(deg2rad(($i / $zhou) * 90)) * 100);
            $size = rand(0, $wid * $hgt);
            if((is_null($count_cands['max'])) || ($size > $count_cands['max'])){
                $count_cands = array('max' => $size, 'cands' => array($i => true));
            }
            elseif($size == $count_cands['max']){
                $count_cands['cands'][$i] = true;
            }
        }

        $this->_gate_tasks[$room->base_coord] = array_rand($count_cands);
    }


    /**
     * 部屋連鎖データの区画集合データへの反映
     *
     * @access  protected
     * @param   object  $room   部屋集合データ
     */
    protected function _reflectRoom($room)
    {
        $T = $this->rgon_side * $room->rgon_edges['T'] + $room->sect_pdngs['T'];
        $R = $this->rgon_side * ($room->rgon_edges['R'] + 1) - $room->sect_pdngs['R'] - 1;
        $B = $this->rgon_side * ($room->rgon_edges['B'] + 1) - $room->sect_pdngs['B'] - 1;
        $L = $this->rgon_side * $room->rgon_edges['L'] + $room->sect_pdngs['L'];

        for($Y = $T; $Y <= $B; $Y ++){
            for($X = $L; $X <= $R; $X ++){
                $this->_sect_tiles[$Y][$X] = $this->_type_room;
            }
        }
    }


    /**
     * 連結元接点の座標の取得
     *  - 所属する部屋連結データの規模が最も少ない接点から対象を抽出する。
     *
     * @access  protected
     * @return  string      座標
     */
    protected function _specifyStartGate()
    {
        $gate_cands = array();
        foreach($this->_gate_tasks as $room_coord => $count){
            $room = $this->_getRoom($room_coord);
            $scale = count($this->_room_chain[$room->chain]);
            if(empty($gate_cands) || ($scale < $gate_cands['scale'])){
                $gate_cands = array('scale' => $scale, 'gates' => $this->_gate_cands[$room_coord]);
            }
            elseif($scale == $gate_cands['scale']){
                $gate_cands['gates'] = array_merge($gate_cands['gates'], $this->_gate_cands[$room_coord]);
            }
        }
        if(empty($gate_cands)){
            $gate_cands = array('gates' => $this->_gate_cands[array_rand($this->_gate_cands)]);
        }

        return $gate_cands['gates'][array_rand($gate_cands['gates'])];
    }


    /**
     * 連結先接点の座標の取得
     *
     * @access  protected
     * @param   object      $strt_gate  連結元ゲート集合データ
     * @return  object                  部屋集合データ
     */
    protected function _specifyTargetRoom($strt_gate)
    {
        $strt_room = $strt_gate->rgon->room;
        $room_cands = array();
        $room_cands_spare = array();

        foreach($this->_gate_tasks as $room_coord => $count){
            if($room_coord != $strt_room->base_coord){
                if(count($this->_room_chain) > 1){
                    $room = $this->_getRoom($room_coord);
                    if($room->chain != $strt_room->chain){
                        $room_cands[$room_coord] = true;
                    }
                }
                else{
                    $room_cands_spare[$room_coord] = true;
                }
            }
        }
        if(empty($room_cands)){
            $room_cands = $room_cands_spare;
        }
        if(empty($room_cands)){
            foreach($this->_room_tiles as $room_coord => $room){
                if($room !== $strt_room){
                    if(count($this->_room_chain) > 1){
                        if($room->chain != $strt_room->chain){
                            $room_cands[$room_coord] = true;
                        }
                    }
                    else{
                        $room_cands_spare[$room_coord] = true;
                    }
                }
            }
        }
        if(empty($room_cands)){
            $room_cands = $room_cands_spare;
        }

        $room_cands_class = array();
        foreach($room_cands as $room_coord => $bool){
            $room = $this->_getRoom($room_coord);
            $point = $this->_measureByGateRadar($strt_gate, $room);
            if(! isset($room_cands_class[$point])){
                $room_cands_class[$point] = array();
            }
            $room_cands_class[$point][] = $room;
        }

        $points_disp = array();
        foreach($room_cands_class as $point => $coords){
            for($i = 0; $i < ($point + 1); $i ++){
                $points_disp[] = $point;
            }
        }

if(empty($points_disp)){ vd($room_cands_class, $this->_gate_tasks); }
        $room_cands = $room_cands_class[$points_disp[array_rand($points_disp)]];
        return $room_cands[array_rand($room_cands)];
    }


    /**
     * 二者の接点の位置関係・方向による接続のしやすさの計算
     *
     * @access  protected
     * @param   object      $base_gate
     * @param   object      $trgt_room
     * @return  int
     */
    protected function _measureByGateRadar($base_gate, $trgt_room)
    {
        $relation = $this->_getCoordRelation($base_gate->rgon->coord, $trgt_room->base_coord);

        switch($base_gate->aim){
            case 'T': return ($relation['Y'] < 0) ? (($relation['X'] == 0) ? 10 : 5) : (($relation['X'] == 0) ? 1 : 2); break;
            case 'R': return ($relation['X'] > 0) ? (($relation['Y'] == 0) ? 10 : 5) : (($relation['Y'] == 0) ? 1 : 2); break;
            case 'B': return ($relation['Y'] > 0) ? (($relation['X'] == 0) ? 10 : 5) : (($relation['X'] == 0) ? 1 : 2); break;
            case 'L': return ($relation['X'] < 0) ? (($relation['Y'] == 0) ? 10 : 5) : (($relation['Y'] == 0) ? 1 : 2); break;
        }
    }


    /**
     * 接点の連結
     *
     * @access  protected
     * @param   string      $strt_gate  連結先ゲート集合データ
     * @param   object      $trgt_room  連結先部屋集合データ
     */
    protected function _tieRgon($strt_gate, $trgt_room)
    {
        $this->_lb("TIERGON >>> {$strt_gate->coord} >>> {$trgt_room->base_coord}");
        $strt_room  = $strt_gate->rgon->room;
        $prev_rgon  = $strt_gate->rgon;
        $prev_aim   = $strt_gate->aim;

        foreach(range(0, ($this->rgon_scales['Y'] * $this->rgon_scales['X'])) as $i){
            list($pres_Y, $pres_X) = $this->_slide($prev_rgon->pos['Y'], $prev_rgon->pos['X'], $prev_aim);
//$this->_lb("({$prev_aim}>{$pres_coord})");
            $pres_rgon = $this->_getRgon($pres_Y, $pres_X);
            $agst_aim  = $this->_getEgoAim($prev_aim);
            switch($pres_rgon->type){
                case $this->_type_room:
                    switch($prev_rgon->type){
                        case $this->_type_room:
                            if($pres_rgon->room !== $prev_rgon->room){
                                $this->_connectRgon($prev_rgon, $pres_rgon);
$this->_lb("CRR[{$prev_rgon->coord}|{$pres_rgon->coord}]");
                                switch(true){
                                    case (count($this->_room_chain) == 1):
                                    case ($pres_rgon->room->chain != $strt_room->chain):
                                    case ($pres_rgon->room === $trgt_room):
                                        $trgt_room = $pres_rgon->room;
                                        break 4;
                                }
                            }
                            break;
                        case $this->_type_road:
                            $road = $this->_getRoad($prev_rgon);
                            $road->gates[$prev_aim] = false;
                            $this->_connectRgon($prev_rgon, $pres_rgon);
$this->_lb("CRD[{$prev_rgon->coord}|{$pres_rgon->coord}]");
                            switch(true){
                                case (count($this->_room_chain) == 1):
                                    $trgt_room = $pres_rgon->room;
                                    break 4;
                                case (count($this->_room_chain) == 1):
                                case ($pres_rgon->room->chain != $strt_room->chain):
                                case ($pres_rgon->room === $trgt_room):
                                    $trgt_room = $pres_rgon->room;
                                    break 4;
                            }
                    }
                    break;
                case $this->_type_wall:
                    $pres_road = $this->_setRoad($pres_rgon, $strt_room);
                case $this->_type_road:
                    $pres_road = $this->_getRoad($pres_rgon);
                    $pres_road->rooms[$strt_room->base_coord] = true;
                    $pres_road->gates[$agst_aim] = false;
                    switch($prev_rgon->type){
                        case $this->_type_room:
                            $this->_connectRgon($prev_rgon, $pres_rgon);
$this->_lb("CRS[{$prev_rgon->coord}|{$pres_rgon->coord}]");
                            break;
                        case $this->_type_road:
                            $prev_road = $this->_getRoad($prev_rgon);
                            $prev_road->gates[$prev_aim] = false;
                            $this->_connectRgon($prev_rgon, $pres_rgon);
$this->_lb("CRA[{$prev_rgon->coord}|{$pres_rgon->coord}]");
                    }

                    if(count($this->_room_chain) == 1){
                        if(count($pres_road->gates) >= 2){
                            $trgt_room = null;
                            break 2;
                        }
                    }
                    foreach($pres_road->rooms as $room_coord => $true){
                        $pres_room = $this->_getRoom($room_coord);
                        if($pres_room->chain != $strt_room->chain){
                            $trgt_room = $pres_room;
                            break 3;
                        }
                    }
            }

            $next_cands = array();
            foreach($this->_getAims() as $aim){
                list($Y, $X) = $this->_slide($pres_Y, $pres_X, $aim);
                if($rgon = $this->_getRgon($Y, $X)){
                    if(($Y != $prev_rgon->pos['Y']) || ($X != $prev_rgon->pos['X'])){
                        $coord = $this->_numbersToCoord($Y, $X);
                        $relation = $this->_getCoordRelation($coord, $trgt_room->base_coord);
                        $range = abs($relation['Y']) + abs($relation['X']);
                        if(empty($next_cands) || $range < $next_cands['range']){
                            $next_cands = array('range' => $range, 'aims' => array($aim => $coord));
                        }
                        elseif($range == $next_cands['range']){
                            $next_cands['aims'][$aim] = $coord;
                        }
                    }
                }
            }

            $prev_aim = array_rand($next_cands['aims']);
            $prev_rgon = $pres_rgon;
        }

        if($trgt_room){
            $this->_mergeChain($strt_room->chain, $trgt_room->chain);
        }
    }


    /**
     * 区画の連結
     *
     * @access  protected
     * @param   object      $strt_rgon  連結元管区集合データ
     * @param   object      $trgt_rgon  連結先管区集合データ
     */
    protected function _connectRgon($strt_rgon, $trgt_rgon)
    {
        if(! isset($strt_rgon->tieds[$trgt_rgon->coord])){
            $relation = $this->_getCoordRelation($strt_rgon->coord, $trgt_rgon->coord);
            switch(true){
                case ($relation['Y'] != 0): $relation_aim = ($relation['Y'] > 0) ? 'B' : 'T'; break;
                case ($relation['X'] != 0): $relation_aim = ($relation['X'] > 0) ? 'R' : 'L'; break;
            }

            $this->_rgon_links[] = array(
                array('rgon' => $strt_rgon, 'aim' => $relation_aim),
                array('rgon' => $trgt_rgon, 'aim' => $this->_getEgoAim($relation_aim))
            );

            $strt_rgon->tieds[$trgt_rgon->coord] = 0;
            $trgt_rgon->tieds[$strt_rgon->coord] = 0;
        }
    }


    /**
     * 通路の起点座標の取得
     *
     * @access  protected
     * @param   object      $road   通路集合データ
     * @return  string              座標
     */
    protected function _specifyIntersection($road)
    {
        $mdl_Y = ($this->rgon_side * $road->rgon->pos['Y']) + floor($this->rgon_side / 2);
        $mdl_X = ($this->rgon_side * $road->rgon->pos['X']) + floor($this->rgon_side / 2);

        $road->inter = $this->_numbersToCoord($mdl_Y, $mdl_X);
        $road->roads['Y'] = array($mdl_Y => array($mdl_X => true));
        $road->roads['X'] = array($mdl_X => array($mdl_Y => true));

        $this->_sect_tiles[$mdl_Y][$mdl_X] = $this->_type_road;
    }


    /**
     *
     *
     * @access  protected
     * @param   array       $strt_params
     * @param   array       $trgt_params
     */
    protected function _paveRoad($strt_params, $trgt_params)
    {
        $paved = false;

        $_sect_tiles = array();
        if($strt_road = $this->_getRoad($strt_params['rgon'])){ $_roads_strt = $strt_road->roads; }
        if($trgt_road = $this->_getRoad($trgt_params['rgon'])){ $_roads_trgt = $trgt_road->roads; }

        foreach($trgt_params['coords'] as $trgt_coord){
$this->_lb('T: ', $trgt_coord);
            foreach($strt_params['coords'] as $strt_coord){
                try{
                    $relation = $this->_getCoordRelation($strt_coord, $trgt_coord);
$this->_lb('S: ', $strt_coord);
$this->_lb('REL', $relation);
                    $aim_env = $this->_getEgoEnv($strt_params['aim']);
                    $range_prmy = abs($relation[$aim_env['P']]);
                    $range_scdy = abs($relation[$aim_env['S']]);
                    switch($strt_params['aim']){
                        case 'T': $turn_aim = ($relation['X'] > 0) ? 'R' : 'L'; break;
                        case 'R': $turn_aim = ($relation['Y'] > 0) ? 'B' : 'T'; break;
                        case 'B': $turn_aim = ($relation['X'] > 0) ? 'R' : 'L'; break;
                        case 'L': $turn_aim = ($relation['Y'] > 0) ? 'B' : 'T'; break;
                    }

                    $turn_prmy_cands = range(0, $range_prmy);
                    shuffle($turn_prmy_cands);
                    foreach($turn_prmy_cands as $turn_prmy){
                        try{
                            $params = array(
                                array('aim' => $strt_params['aim'], 'limit' => $turn_prmy),
                                array('aim' => $turn_aim,           'limit' => $range_scdy),
                                array('aim' => $strt_params['aim'], 'limit' => ($range_prmy - $turn_prmy))
                            );

                            $pres_coord = $strt_coord;
$this->_l('開始: ', $strt_coord, '>>>');
                            foreach($params as $i => $param){
                                list($pres_Y, $pres_X) = $this->_coordToNumbers($pres_coord);
                                $goal_coord = $this->_slide($pres_Y, $pres_X, $param['aim'], $param['limit']);
                                for($n = 0; $n < $param['limit']; $n ++){
                                    if($this->_sect_tiles[$pres_Y][$pres_X] == $this->_type_wall){
                                        $_sect_tiles[$pres_coord] = $this->_type_wall;
                                        $this->_sect_tiles[$pres_Y][$pres_X] = $this->_type_road;
                                        if(isset($strt_road)){ $this->_registerToRoad($strt_road, $pres_coord); }
                                        if(isset($trgt_road)){ $this->_registerToRoad($trgt_road, $pres_coord); }
                                    }

                                    list($next_Y, $next_X) = $this->_slide($pres_Y, $pres_X, $param['aim']);
                                    $next_coord = $this->_numbersToCoord($next_Y, $next_X);

$this->_l(">{$next_coord}");
if($pres_coord == $trgt_coord){ $this->_lb('<@>'); }
if($next_coord == $trgt_coord){ $this->_lb('<+>'); }
                                    if($pres_coord == $trgt_coord){ break 2; }
                                    if($next_coord == $trgt_coord){ continue; }

                                    if(! in_array($next_coord, $this->_getEnableAdvanceAims($pres_coord))){
$this->_l("D{$next_coord}({$i})");
                                        throw new Exception($i);
                                    }

                                    $pres_rgon = $this->_getRgonBySect($pres_coord);
                                    foreach($this->_getAims() as $aim){
                                        list($far_Y,  $far_X)  = $this->_slide($next_Y, $next_X, $aim, 3);
                                        if(isset($this->_sect_tiles[$far_Y][$far_X])){
                                            if($this->_sect_tiles[$far_Y][$far_X] == $this->_type_room){
                                                $far_rgon = $this->_getRgonBySect($far_Y, $far_X);
                                                if($far_rgon !== $strt_params['rgon'] && $far_rgon !== $trgt_params['rgon']){
                                                    if(isset($far_rgon->tieds[$pres_rgon->coord])){
                                                        if($far_rgon->tieds[$pres_rgon->coord] == 0){
$this->_lb("::::{$far_rgon->coord}|{$strt_params['rgon']->coord}^{$trgt_params['rgon']->coord}({$far_Y}_{$far_X})");
                                                            throw new Exception($i);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    foreach($this->_getAims() as $aim){
                                        list($zhou_Y, $zhou_X) = $this->_slide($next_Y, $next_X, $aim);
                                        if(isset($this->_sect_tiles[$zhou_Y][$zhou_Y])){
                                            $zhou_coord = $this->_numbersToCoord($zhou_Y, $zhou_X);
                                            switch(true){
                                                case ($zhou_coord == $trgt_coord):
                                                case ($zhou_coord == $goal_coord):
                                                case ($zhou_coord == $pres_coord):
                                                case ($this->_sect_tiles[$zhou_Y][$zhou_X] == $this->_type_wall):
                                                    break;
                                                default:
$this->_l("*{$zhou_coord}({$i})");
                                                    throw new Exception($i);
                                            }
                                        }
                                    }

                                    $pres_coord = $next_coord;
                                    list($pres_Y, $pres_X) = $this->_coordToNumbers($pres_coord);
                                }
                            }

                            if(isset($strt_road)){ $this->_registerToRoad($strt_road, $trgt_coord); }
                            if(isset($trgt_road)){ $this->_registerToRoad($trgt_road, $trgt_coord); }

                            $paved = true;
                            break;
                        }
                        catch(Exception $e){
                            foreach($_sect_tiles as $coord => $type){
                                list($Y, $X) = $this->_coordToNumbers($coord);
                                $this->_sect_tiles[$Y][$X] = $type;
                            }
                            $_sect_tiles = array();
                            if(isset($strt_road)){ $strt_road->roads = $_roads_strt; }
                            if(isset($trgt_road)){ $trgt_road->roads = $_roads_trgt; }
$this->_lb('H');
                        }
                    }
                    if($paved == false){
$this->_lb('R');
                        throw new Exception();
                    }
                    break 2;
                }
                catch(Exception $e){
                    foreach($_sect_tiles as $coord => $type){
                        list($Y, $X) = $this->_coordToNumbers($coord);
                        $this->_sect_tiles[$Y][$X] = $type;
                    }
                    $_sect_tiles = array();
                    if(isset($strt_road)){ $strt_road->roads = $_roads_strt; }
                    if(isset($trgt_road)){ $trgt_road->roads = $_roads_trgt; }
$this->_lb('M');
                }
            }
        }

        $strt_params['rgon']->tieds[$trgt_params['rgon']->coord] = 1;
        $trgt_params['rgon']->tieds[$strt_params['rgon']->coord] = 1;
    }


    /**
     * 通路から目的方向へ分岐する候補の抽出
     *
     * @access  protected
     * @param   object      $road
     * @param   string      $trgt_aim
     */
    protected function _specifyJunctionCands($road, $trgt_aim)
    {
        $aim_env = $this->_getEgoEnv($trgt_aim);
        $road_sects = $road->roads[$aim_env['S']];
        $scdys      = array_keys($road_sects);
        switch($aim_env['sort_S']){
            case 'ASC': sort($scdys);  break;
            case 'DSC': rsort($scdys); break;
        }
$this->_lb("INJUCT >>>> {$road->rgon->coord}|{$trgt_aim} ROAD >> ", $road->roads);
$this->_lb('SCDY', $scdys);
        foreach($scdys as $S){
            $prmys = array_keys($road_sects[$S]);
            switch($aim_env['sort_P']){
                case 'ASC': sort($prmys);  break;
                case 'DSC': rsort($prmys); break;
            }
$this->_lb('PRMY', $prmys);
            $side_exists = array('R' => 0, 'L' => 0);
            foreach($prmys as $P){
                $pos = array($aim_env['P'] => $P, $aim_env['S'] => $S);
                $rgon = $this->_getRgonBySect($pos['Y'], $pos['X']);
                if($rgon === $road->rgon){
                    $coord_cands[] = $this->_numbersToCoord($pos['Y'], $pos['X']);
                    foreach($side_exists as $aim => $flag){
                        if($flag == 0){
                            $ego_aim = $this->_getEgoAim($trgt_aim, $aim);
                            list($side_Y, $side_X) = $this->_slide($pos['Y'], $pos['X'], $ego_aim);
                            if(isset($this->_sect_tiles[$side_Y][$side_X])){
//$this->_lb("{$aim}>->{$side_sect->coord}");
                                if($this->_sect_tiles[$side_Y][$side_X] == $this->_type_road){
                                    $side_exists[$aim] = 1;
                                }
                            }
                        }
                    }
                    if(array_sum($side_exists) == 2){
                        break;
                    }
                }
            }
        }

        shuffle($coord_cands);
        return $coord_cands;
    }


    /**
     * 部屋の接点の候補の抽出
     *
     * @access  protected
     * @param   object      $rgon
     * @param   string      $trgt_aim
     */
    protected function _specifyGateCands($rgon, $trgt_aim)
    {
        $edges   = $rgon->room->rgon_edges;
        $pdngs   = $rgon->room->sect_pdngs;
        $aim_env = $this->_getEgoEnv($trgt_aim);
        $aim_R   = $this->_getEgoAim($trgt_aim, 'R');
        $aim_L   = $this->_getEgoAim($trgt_aim, 'L');
        $pos_P  = $rgon->pos[$aim_env['P']];
        $pos_S  = $rgon->pos[$aim_env['S']];
        $pdng_P = ($edges[$trgt_aim] == $pos_P) ? $pdngs[$trgt_aim] : 0;
        $pdng_R = ($edges[$aim_R]    == $pos_S) ? $pdngs[$aim_R]    : 0;
        $pdng_L = ($edges[$aim_L]    == $pos_S) ? $pdngs[$aim_L]    : 0;

        switch($trgt_aim){
            case 'T':
                $S_min = $this->rgon_side * $pos_S + ($pdng_L) + 1;
                $S_max = $this->rgon_side * ($pos_S + 1) - ($pdng_R) - 2;
                $P     = $this->rgon_side * $pos_P + $pdngs[$trgt_aim];
                break;
            case 'R':
                $S_min = $this->rgon_side * $pos_S + ($pdng_L) + 1;
                $S_max = $this->rgon_side * ($pos_S + 1) - ($pdng_R) - 2;
                $P     = $this->rgon_side * ($pos_P + 1) - $pdngs[$trgt_aim] - 1;
                break;
            case 'B':
                $S_min = $this->rgon_side * $pos_S + ($pdng_R) + 1;
                $S_max = $this->rgon_side * ($pos_S + 1) - ($pdng_L) - 2;
                $P     = $this->rgon_side * ($pos_P + 1) - $pdngs[$trgt_aim] - 1;
                break;
            case 'L':
                $S_min = $this->rgon_side * $pos_S + ($pdng_R) + 1;
                $S_max = $this->rgon_side * ($pos_S + 1) - ($pdng_L) - 2;
                $P     = $this->rgon_side * $pos_P + $pdngs[$trgt_aim];
                break;
        }
        foreach(range($S_min, $S_max) as $S){
            $pos = array($aim_env['P'] => $P, $aim_env['S'] => $S);
            $coord_cands[] = $this->_numbersToCoord($pos['Y'], $pos['X']);
        }

        return $coord_cands;
    }


    /**
     *
     *
     * @access  protected
     * @param   object      $road
     * @param   string      $sect_coord
     */
    protected function _registerToRoad($road, $sect_coord)
    {
        list($Y, $X) = $this->_coordToNumbers($sect_coord);
        if(! isset($road->roads['Y'][$Y])){ $road->roads['Y'][$Y] = array(); }
        if(! isset($road->roads['X'][$X])){ $road->roads['X'][$X] = array(); }
        $road->roads['Y'][$Y][$X] = true;
        $road->roads['X'][$X][$Y] = true;
    }


    /**
     * 連結データの統合
     *
     * @access  protected
     * @param   int         $strt_chain_id  連鎖元データID
     * @param   int         $trgt_chain_id  連鎖先データID
     */
    protected function _mergeChain($strt_chain_id, $trgt_chain_id)
    {
        if($strt_chain_id != $trgt_chain_id){
            foreach($this->_room_chain[$strt_chain_id] as $room_coord => $param){
                $room = $this->_getRoom($room_coord);
                $room->chain = $trgt_chain_id;
                $this->_room_chain[$trgt_chain_id][$room->base_coord] = $param;
            }
            unset($this->_room_chain[$strt_chain_id]);
        }
    }


    /**
     * 通路の整備
     *
     * @access  protected
     * @param   object      $road
     */
    protected function _maintainRoad($road)
    {
        // 中心ゲートが行き止まりの状態になっている場合、そこ迄の一本道を削除する。
        list($road_sect_Y, $road_sect_X) = $this->_coordToNumbers($road->inter);
        for($limit = ($this->rgon_side * 2); $limit > 0; $limit --){
            $zhou_roads_count = 0;
            foreach($this->_getAims() as $aim){
                list($zhou_Y, $zhou_X) = $this->_slide($road_sect_Y, $road_sect_X, $aim);
                if(isset($this->_sect_tiles[$zhou_Y][$zhou_X])){
                    if($this->_sect_tiles[$zhou_Y][$zhou_X] != $this->_type_wall){
                        list($next_Y, $next_X) = array($zhou_Y, $zhou_X);
                        $zhou_roads_count ++;
                    }
                }
            }
            if($zhou_roads_count > 1){
                $this->_sect_tiles[$road_sect_Y][$road_sect_X] = $this->_type_road;
                break;
            }
            $this->_sect_tiles[$road_sect_Y][$road_sect_X] = $this->_type_wall;
            list($road_sect_Y, $road_sect_X) = array($next_Y, $next_X);
        }
    }


    /**
     * 
     *
     * @access  protected
     * @param
     * @param
     * @return
     */
    protected function _setRgon($Y, $X)
    {
        $coord = $this->_numbersToCoord($Y, $X);

        $this->_rgon_tiles[$coord] = new stdClass();
        $this->_rgon_tiles[$coord]->pos   = array('Y' => $Y, 'X' => $X);
        $this->_rgon_tiles[$coord]->coord = $coord;
        $this->_rgon_tiles[$coord]->type  = $this->_type_wall;
        $this->_rgon_tiles[$coord]->room  = null;
        $this->_rgon_tiles[$coord]->tieds = array();

        for($_Y = 0; $_Y < $this->rgon_side; $_Y ++){
            $sect_Y = $this->rgon_side * $Y + $_Y;
            for($_X = 0; $_X < $this->rgon_side; $_X ++){
                $sect_X = $this->rgon_side * $X + $_X;
                $this->_sect_tiles[$sect_Y][$sect_X] = $this->_type_wall;
            }
        }

        return $this->_rgon_tiles[$coord];
    }


    /**
     * 
     *
     * @access  protected
     * @param   object      $rgon       部屋集合データ
     * @param   int         $chain_id   部屋連鎖ID
     * @return
     */
    protected function _setRoom($rgon, $chain_id)
    {
        $this->_room_tiles[$rgon->coord] = new stdClass();
        $this->_room_tiles[$rgon->coord]->base_coord = $rgon->coord;
        $this->_room_tiles[$rgon->coord]->chain      = $chain_id;
        $this->_room_tiles[$rgon->coord]->rgon_edges = array();
        $this->_room_tiles[$rgon->coord]->sect_pdngs = array('T' => 0, 'R' => 0, 'B' => 0, 'L' => 0);
        $this->_room_tiles[$rgon->coord]->inited     = array('T' => false, 'R' => false, 'B' => false, 'L' => false);
        $this->_room_chain[$chain_id] = array($rgon->coord => true);

        $rgon->type = $this->_type_room;
        $rgon->room = $this->_room_tiles[$rgon->coord];

        return $this->_room_tiles[$rgon->coord];
    }


    /**
     * 
     *
     * @access  protected
     * @param
     * @param
     * @return
     */
    protected function _setRoad($rgon, $room)
    {
        $this->_road_tiles[$rgon->coord] = new stdClass();
        $this->_road_tiles[$rgon->coord]->type  = $this->_type_road;
        $this->_road_tiles[$rgon->coord]->rgon  = $rgon;
        $this->_road_tiles[$rgon->coord]->rooms = array($room->base_coord => true);
        $this->_road_tiles[$rgon->coord]->roads = array('Y' => null, 'X' => null);
        $this->_road_tiles[$rgon->coord]->gates = array();
        $this->_road_tiles[$rgon->coord]->inter = null;

        $rgon->type = $this->_type_road;
        $rgon->road = $this->_road_tiles[$rgon->coord];

        return $this->_road_tiles[$rgon->coord];
    }


    /**
     * 接点の設定
     *
     * @access  protected
     * @param   object      $rgon   管区集合データ
     * @param   string      $aim    方向
     */
    protected function _setGate($rgon, $aim)
    {
        $coord = $this->_argsToGateCoord($rgon->coord, $aim);

        $this->_gate_tiles[$coord] = new stdClass();
        $this->_gate_tiles[$coord]->coord = $coord;
        $this->_gate_tiles[$coord]->rgon  = $rgon;
        $this->_gate_tiles[$coord]->aim   = $aim;

        $room_coord = $rgon->room->base_coord;
        unset($this->_gate_cands[$room_coord][$coord]);
        if(isset($this->_gate_tasks[$room_coord])){
            $this->_gate_tasks[$room_coord] --;
            if($this->_gate_tasks[$room_coord] <= 0){
                unset($this->_gate_tasks[$room_coord]);
            }
        }
        if(isset($this->_gate_cands[$room_coord]) && empty($this->_gate_cands[$room_coord])){
            unset($this->_gate_cands[$room_coord]);
        }

        return $this->_gate_tiles[$coord];
    }


    /**
     * 
     *
     * @access  protected
     * @param
     * @param
     * @return
     */
    protected function _getRgon()
    {
        $args = func_get_args();
        $coord = (count($args) == 2) ? $this->_numbersToCoord($args[0], $args[1]) : $args[0];

        return isset($this->_rgon_tiles[$coord]) ? $this->_rgon_tiles[$coord] : null;
    }


    /**
     * 
     *
     * @access  protected
     * @param
     * @param
     * @return
     */
    protected function _getRgonBySect()
    {
        $args = func_get_args();
        switch(count($args)){
            case 2: list($Y, $X) = array($args[0], $args[1]); break;
            case 1: list($Y, $X) = $this->_coordToNumbers($args[0]); break;
        }

        return $this->_getRgon(
            floor($Y / $this->rgon_side),
            floor($X / $this->rgon_side)
        );
    }


    /**
     * 
     *
     * @access  protected
     * @param
     * @param
     * @return
     */
    protected function _getRoom($rgon_coord)
    {
        if($rgon = $this->_getRgon($rgon_coord)){
            if($rgon->type == $this->_type_room){
                return $rgon->room;
            }
        }

        return null;
    }


    /**
     * 
     *
     * @access  protected
     * @param
     * @param
     * @return
     */
    protected function _getRoad()
    {
        $args = func_get_args();
        $coord = (count($args) == 2) ? $this->_numbersToCoord($args[0], $args[1]) : $args[0]->coord;

        return isset($this->_road_tiles[$coord]) ? $this->_road_tiles[$coord] : null;
    }


    /**
     * 数値の座標への変換
     *
     * @access  protected
     * @param   int         $Y  縦座標数値
     * @param   int         $X  横座標数値
     * @return  string
     */
    protected function _numbersToCoord($Y, $X)
    {
        return $Y . '_' . $X;
    }


    /**
     * 数値の座標への変換
     *
     * @access  protected
     * @param   string      
     * @param   string      
     * @return  string
     */
    protected function _argsToGateCoord($rgon_coord, $aim)
    {
        return $rgon_coord . ':' . $aim;
    }


    /**
     * 座標の数値への変換
     *
     * @access  protected
     * @param   string      $coord
     * @return  array
     */
    protected function _coordToNumbers($coord)
    {
        return explode('_', $coord);
    }


    /**
     * 
     *
     * @access  protected
     * @param   int         $Y
     * @param   int         $X
     * @param   string      $aim    方向
     * @param   string      $range  距離
     * @return  array
     */
    protected function _slide($Y, $X, $aim, $range = 1)
    {
        switch($aim){
            case 'T': return array($Y - $range, $X); break;
            case 'R': return array($Y, $X + $range); break;
            case 'B': return array($Y + $range, $X); break;
            case 'L': return array($Y, $X - $range); break;
        }
    }


    /**
     * 方向群の取得
     *
     * @access  protected
     * @param   string      $turn_type  整列順序の指定
     * @return  array
     */
    protected function _getAims($rand = false)
    {
        $aims = array('T', 'R', 'B', 'L');
        if($rand == true){
            shuffle($aims);
        }

        return $aims;
    }


    /**
     * 指定方向視点の指定絶対方向についての相対方向の取得
     *
     * @access  protected
     * @param   string      $aim    指定方向
     * @param   string      
     * @return  string              方向
     */
    protected function _getEgoAim($aim, $relation = 'D')
    {
        $aim_relations = array(
            'T' => array('R' => 'R', 'D' => 'B', 'L' => 'L'),
            'R' => array('R' => 'B', 'D' => 'L', 'L' => 'T'),
            'B' => array('R' => 'L', 'D' => 'T', 'L' => 'R'),
            'L' => array('R' => 'T', 'D' => 'R', 'L' => 'B')
        );

        return $aim_relations[$aim][$relation];
    }


    /**
     * 
     *
     * @access  protected
     * @param   string      $aim    指定方向
     * @return  array
     */
    protected function _getEgoEnv($aim)
    {
        switch($aim){
            case 'T': return array('P' => 'Y', 'S' => 'X', 'sort_P' => 'ASC', 'sort_S' => 'ASC'); break;
            case 'R': return array('P' => 'X', 'S' => 'Y', 'sort_P' => 'DSC', 'sort_S' => 'ASC'); break;
            case 'B': return array('P' => 'Y', 'S' => 'X', 'sort_P' => 'DSC', 'sort_S' => 'DSC'); break;
            case 'L': return array('P' => 'X', 'S' => 'Y', 'sort_P' => 'ASC', 'sort_S' => 'DSC'); break;
        }
    }


    /**
     * 区画において指定座標の周囲にあり進行可能な方向・座標群の取得
     *
     * @access  protected
     * @param   string      $sect_coord 指定座標
     * @return  array
     */
    protected function _getEnableAdvanceAims($sect_coord)
    {
        $enable_aims = array();

        foreach($this->_getAims() as $cand_aim){
            list($sect_Y, $sect_X) = $this->_coordToNumbers($sect_coord);
            list($trgt_Y, $trgt_X) = $this->_slide($sect_Y, $sect_X, $cand_aim);
            if(isset($this->_sect_tiles[$trgt_Y][$trgt_X])){
                $conds = '';
                foreach($this->_getAims() as $adjt_aim){
                    list($Y_1, $X_1) = $this->_slide($trgt_Y, $trgt_X, $adjt_aim);
                    list($Y_2, $X_2) = $this->_slide($Y_1, $X_1, $this->_getEgoAim($adjt_aim, 'R'));
                    $conds .= isset($this->_sect_tiles[$Y_1][$X_1]) && ($this->_sect_tiles[$Y_1][$X_1] != $this->_type_wall) ? 1 : 0;
                    $conds .= isset($this->_sect_tiles[$Y_2][$X_2]) && ($this->_sect_tiles[$Y_2][$X_2] != $this->_type_wall) ? 2 : 0;
                }

                if(! preg_match('/(^1.*12$|^21.*1$|121)/', $conds)){
                    $enable_aims[$cand_aim] = $this->_numbersToCoord($trgt_Y, $trgt_X);
                }
            }
        }

        return $enable_aims;
    }


    /**
     * 座標間の位置関係情報の取得
     *
     * @access  protected
     * @param   string      $base_coord 指定座標
     * @param   string      $trgt_coord 対象座標
     * @return  array
     */
    protected function _getCoordRelation($base_coord, $trgt_coord)
    {
        list($base_Y, $base_X) = $this->_coordToNumbers($base_coord);
        list($trgt_Y, $trgt_X) = $this->_coordToNumbers($trgt_coord);

        return array(
            'Y' => $trgt_Y - $base_Y,
            'X' => $trgt_X - $base_X
        );
    }
}
