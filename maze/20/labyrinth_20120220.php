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

    protected $_rgon_tiles = array();   // 管区集合データ
    protected $_rgon_links = array();   // 管区接続データ
    protected $_room_tiles = array();   // 部屋集合データ
    protected $_room_chain = array();   // 部屋連鎖データ
    protected $_road_tiles = array();   // 通路集合データ
    protected $_gate_tiles = array();   // 接点集合データ
    protected $_gate_tasks = array();   // 部屋に設置する接点の個数群
    protected $_gate_cands = array();   // 部屋が接点を設置できる地点群
    protected $_sect_tiles = array();   // 区画集合データ
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
        $this->rgon_scales['Y'] = (int)$params['rgon_Y'];
        $this->rgon_scales['X'] = (int)$params['rgon_X'];

        $this->rgon_side = (int)$params['rgon_side'];

        $this->room_count = isset($params['room_count']) ? (int)$params['room_count'] : 2;

        $this->room_side_max  = isset($params['room_side_max'])  ? (int)$params['room_side_max'] : 1;
        $this->room_area_disp = isset($params['room_area_disp']) ? (array)$params['room_area_disp'] : array(1 => 1);
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
            $this->_rgon_tiles[$Y] = array();
            for($X = 0; $X < $this->rgon_scales['X']; $X ++){
                $this->_rgon_tiles[$Y][$X] = $this->_makeRgon($Y, $X);
            }
        }

        // 区画集合データの構築
        foreach(range(0, $this->rgon_side * $this->rgon_scales['Y']) as $Y){
            $this->_sect_tiles[$Y] = array();
            foreach(range(0, $this->rgon_side * $this->rgon_scales['X']) as $X){
                $this->_sect_tiles[$Y][$X] = $this->_type_wall;
            }
        }

        // 部屋の定義
        $room_seeds = $this->_collectRoomSeeds();
        foreach($room_seeds as $room_chain_id => $pos){
            $rgon = $this->_getRgon($pos['Y'], $pos['X']);
            $this->_setRoom($rgon, $room_chain_id);
        }

        // 部屋の領域確定・ゲート設定
        foreach($this->_room_tiles as $room){
            $this->_setRoomTerritory($room);
            $this->_setGates($room);
        }

        // 部屋の設定
        $vect_envs = array(
            array('P' => 'Y', 'S' => 'X', 'vects_P' => array('T', 'B'), 'vects_S' => array('R', 'L')),
            array('P' => 'X', 'S' => 'Y', 'vects_P' => array('R', 'L'), 'vects_S' => array('T', 'B'))
        );
        foreach($vect_envs as $turn => $env){
            $axis_Y = rand(0, ($this->rgon_scales['Y'] - 1));
            $axis_X = rand(0, ($this->rgon_scales['X'] - 1));
            foreach(range(0, $this->rgon_scales[$env['P']]) as $range_P){
                foreach(range(0, $this->rgon_scales[$env['S']]) as $range_S){
                    shuffle($env['vects_P']);
                    shuffle($env['vects_S']);
                    foreach($env['vects_P'] as $pn => $aim_P){
                        foreach($env['vects_S'] as $sn => $aim_S){
                            list($rgon_Y, $rgon_X) = $this->_slide($axis_Y, $axis_X, $aim_S, $range_S);
                            list($rgon_Y, $rgon_X) = $this->_slide($rgon_Y, $rgon_X, $aim_P, $range_P);
                            if($rgon = $this->_getRgon($rgon_Y, $rgon_X)){
                                if($rgon->type == $this->_type_room){
                                    $this->_setRoomMete($rgon->room, $rgon, $env['vects_P'][abs($pn - 1)]);
                                    $this->_setRoomMete($rgon->room, $rgon, $env['vects_P'][$pn]);
                                }
                            }
                        }
                    }
                }
            }
        }

        // 部屋の設定の反映
        foreach($this->_room_tiles as $room){
            for($Y = $room->sect_edges['T']; $Y <= $room->sect_edges['B']; $Y ++){
                for($X = $room->sect_edges['L']; $X <= $room->sect_edges['R']; $X ++){
                    $this->_sect_tiles[$Y][$X] = $this->_type_room;
                }
            }
        }

        // 部屋の連結
        foreach(range(0, ($this->rgon_scales['Y'] * $this->rgon_scales['X'])) as $i){
            $strt_gate = $this->_specifyStartGate();
            $trgt_room = $this->_specifyTargetRoom($strt_gate);
            $this->_tieRgon($strt_gate, $trgt_room);

            if((count($this->_room_chain) <= 1) && empty($this->_gate_tasks)){
                break;
            }
        }

        // 通路の開通
        foreach($this->_rgon_links as $link){
            $this->_paveRoad($link[0], $link[1]);
        }

        // 通路の整備
        foreach($this->_road_tiles as $road){
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
        $room = $this->_getRoom(array_rand($this->_room_tiles));
        $sect_Y = rand($room->sect_edges['T'], $room->sect_edges['B']);
        $sect_X = rand($room->sect_edges['L'], $room->sect_edges['R']);
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
        // 一対の対角に必ず部屋を設置する。
        list($min_Y, $max_Y) = array(0, ($this->rgon_scales['Y'] - 1));
        list($min_X, $max_X) = array(0, ($this->rgon_scales['X'] - 1));
        $rgon_corner_pairs = array(
            0 => array(0 => array('Y' => $min_Y, 'X' => $min_X), 1 => array('Y' => $max_Y, 'X' => $max_X)),
            1 => array(0 => array('Y' => $min_Y, 'X' => $max_X), 1 => array('Y' => $max_Y, 'X' => $min_X))
        );
        $room_seeds = $rgon_corner_pairs[rand(0, 1)];

        $room_cands = array();
        for($Y = 0; $Y < $this->rgon_scales['Y']; $Y ++){
            for($X = 0; $X < $this->rgon_scales['X']; $X ++){
                if($Y != $room_seeds[0]['Y'] && $Y != $room_seeds[1]['Y'] && $X != $room_seeds[0]['X'] && $X != $room_seeds[1]['X']){
                    $room_cands[] = array('Y' => $Y, 'X' => $X);
                }
            }
        }

        // 規定の個数に必要な残数分の無作為抽出
        if($this->room_count > 2){
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
        list($Y, $X) = array($room->base_rgon->pos['Y'], $room->base_rgon->pos['X']);
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

        foreach(range($edges['T'], $edges['B']) as $_Y){
            foreach(range($edges['L'], $edges['R']) as $_X){
                $rgon = $this->_getRgon($_Y, $_X);
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
        $ranges     = array('Y' => $edges['B'] - $edges['T'] + 1, 'X' => $edges['R'] - $edges['L'] + 1);
        $room_area  = $ranges['Y'] * $ranges['X'];
        $area_max   = max(array_keys($this->room_area_disp));
        $aim_params = array(
            'T' => array('P' => ($edges['T'] - 1), 'S_1' => $edges['L'], 'S_2' => $edges['R']),
            'R' => array('P' => ($edges['R'] + 1), 'S_1' => $edges['B'], 'S_2' => $edges['T']),
            'B' => array('P' => ($edges['B'] + 1), 'S_1' => $edges['R'], 'S_2' => $edges['L']),
            'L' => array('P' => ($edges['L'] - 1), 'S_1' => $edges['T'], 'S_2' => $edges['B'])
        );

        foreach($aim_params as $aim => $param){
            foreach(range($param['S_1'], $param['S_2']) as $S){
                $ego_envs = $this->_getEgoEnvs($aim);
                $pos = array($ego_envs['P'] => $param['P'], $ego_envs['S'] => $S);
                switch(true){
                    case (($rgon = $this->_getRgon($pos['Y'], $pos['X'])) === null):
                    case ($rgon->type == $this->_type_room):
                    case ($ranges[$ego_envs['P']] >= $this->room_side_max):
                        continue 3;
                        break;
                }
                $room_area ++;
            }

            $pred_edges = $edges;
            $pred_edges[$aim] = $param['P'];
            if(isset($this->room_area_disp[$room_area])){
                $edges_cands[$room_area] = array_merge(array($pred_edges), (isset($edges_cands[$room_area]) ? $edges_cands[$room_area] : array()));
            }

            if($room_area < $area_max){
                $this->_tryExtendRoomTerritory($pred_edges, $edges_cands);
            }
        }
    }


    /**
     * 部屋の境界確定
     *
     * @access  protected
     * @param   object      $room       部屋集合データ
     * @param   object      $rgon       対象管区集合データ
     * @param   string      $edge_aim   方向
     */
    protected function _setRoomMete($room, $rgon, $edge_aim)
    {
        if($room->sect_edges[$edge_aim] === null){
            $ego_envs = $this->_getEgoEnvs($edge_aim);
            $ego_aims = $this->_getEgoAims($edge_aim);
            $edges = $room->rgon_edges;
            if($rgon->pos[$ego_envs['P']] == $edges[$edge_aim]){
                $mete_terms = array('min' => array(0), 'max' => array($this->rgon_side - 3));
                if($edges[$edge_aim] == $edges[$ego_aims['D']]){
                    if($room->sect_edges[$ego_aims['D']] !== null){
                        $mete_terms['max'][] = $this->rgon_side - 3 - $room->sect_pdngs[$ego_aims['D']];
                    }
                }
                foreach(range($edges[$ego_aims['R']], $edges[$ego_aims['L']]) as $scdy){
                    $pos = array($ego_envs['P'] => $edges[$edge_aim], $ego_envs['S'] => $scdy);
                    list($agst_Y, $agst_X) = $this->_slide($pos['Y'], $pos['X'], $edge_aim);
                    if($agst_rgon = $this->_getRgon($agst_Y, $agst_X)){
                        if($agst_rgon->type == $this->_type_room){
                            if($agst_rgon->room->sect_edges[$ego_aims['D']] !== null){
                                $mete_terms['min'][] = 3 - $agst_rgon->room->sect_pdngs[$ego_aims['D']];
                            }
                        }
                    }
                }

                $side_aims = array(array('R', 'L'), array('L', 'R'));
                foreach($side_aims as $aims){
                    $pos = array($ego_envs['P'] => $edges[$edge_aim], $ego_envs['S'] => $edges[$ego_aims[$aims[0]]]);
                    list($adst_Y, $adst_X) = $this->_slide($pos['Y'], $pos['X'], $edge_aim);
                    list($adst_Y, $adst_X) = $this->_slide($adst_Y, $adst_X, $ego_aims[$aims[0]]);
                    list($far_Y,  $far_X)  = $this->_slide($adst_Y, $adst_X, $ego_aims[$aims[0]]);
                    if($ajst_rgon = $this->_getRgon($adst_Y, $adst_X)){
                        switch(true){
                            case ($this->_getGate($ajst_rgon, $ego_aims['D'])      == null):
                            case ($this->_getGate($ajst_rgon, $ego_aims[$aims[1]]) == null):
                            case ($ajst_rgon->room->sect_edges[$ego_aims['D']]      === null):
                            case ($ajst_rgon->room->sect_edges[$ego_aims[$aims[1]]] === null):
                                break;
                            default:
                                $mete_terms['min'][] = 2 - $ajst_rgon->room->sect_pdngs[$ego_aims['D']];
                        }
                    }
                    if($far_rgon = $this->_getRgon($far_Y, $far_X)){
                        switch(true){
                            case ($this->_getGate($far_rgon, $ego_aims['D'])  == null):
                            case ($far_rgon->room->sect_edges[$ego_aims['D']] === null):
                                break;
                            default:
                                $mete_terms['min'][] = 1 - $far_rgon->room->sect_pdngs[$ego_aims['D']];
                        }
                    }
                }

                $room->sect_pdngs[$edge_aim] = rand(
                    max($mete_terms['min']),
                    min($mete_terms['max'])
                );
                $room->sect_edges[$edge_aim] = $this->_getRgonEdge($rgon, $edge_aim, $room->sect_pdngs[$edge_aim]);
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
        $this->_gate_cands[$room->id] = array();
        foreach($this->_getAims() as $aim){
            $ego_envs = $this->_getEgoEnvs($aim);
            $ego_aims = $this->_getEgoAims($aim);
            $edges = $room->rgon_edges;
            $P = $edges[$aim];
            foreach(range($edges[$ego_aims['R']], $edges[$ego_aims['L']]) as $S){
                $pos = array($ego_envs['P'] => $P, $ego_envs['S'] => $S);
                $gate_rgon = $this->_getRgon($pos['Y'], $pos['X']);
                list($rgon_Y, $rgon_X) = $this->_slide($pos['Y'], $pos['X'], $aim);
                if($rgon = $this->_getRgon($rgon_Y, $rgon_X)){
                    $this->_setGate($gate_rgon, $aim);
                }
            }
        }

        // 接点個数の設定
        $zhou = count($this->_gate_cands[$room->id]);
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

        $this->_gate_tasks[$room->id] = array_rand($count_cands);
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
        foreach($this->_gate_tasks as $room_id => $count){
            $room = $this->_getRoom($room_id);
            $scale = count($this->_room_chain[$room->chain]);
            if(empty($gate_cands) || ($scale < $gate_cands['scale'])){
                $gate_cands = array('scale' => $scale, 'gates' => $this->_gate_cands[$room_id]);
            }
            elseif($scale == $gate_cands['scale']){
                $gate_cands['gates'] = array_merge($gate_cands['gates'], $this->_gate_cands[$room_id]);
            }
        }
        if(empty($gate_cands)){
            $gate_cands = array('gates' => $this->_gate_cands[array_rand($this->_gate_cands)]);
        }
        $gate = $gate_cands['gates'][array_rand($gate_cands['gates'])];

        $room_id = $gate->rgon->room->id;
        if(isset($this->_gate_tasks[$room_id])){
            if($gate->rgon->tieds[$gate->aim] === null){
                $this->_gate_tasks[$room_id] --;
                if($this->_gate_tasks[$room_id] <= 0){
                    unset($this->_gate_tasks[$room_id]);
                }
            }
        }

        return $gate;
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

        foreach($this->_gate_tasks as $room_id => $count){
            if($room_id != $strt_room->id){
                if(count($this->_room_chain) > 1){
                    $room = $this->_getRoom($room_id);
                    if($room->chain != $strt_room->chain){
                        $room_cands[$room_id] = true;
                    }
                    continue;
                }
                $room_cands_spare[$room_id] = true;
            }
        }
        if(empty($room_cands)){
            $room_cands = $room_cands_spare;
        }
        if(empty($room_cands)){
            foreach($this->_room_tiles as $room_id => $room){
                if($room !== $strt_room){
                    if(count($this->_room_chain) > 1){
                        if($room->chain != $strt_room->chain){
                            $room_cands[$room_id] = true;
                        }
                        continue;
                    }
                    $room_cands_spare[$room_id] = true;
                }
            }
        }
        if(empty($room_cands)){
            $room_cands = $room_cands_spare;
        }

        $room_cands_class = array();
        foreach($room_cands as $room_id => $bool){
            $room = $this->_getRoom($room_id);
            $point = $this->_measureByGateRadar($strt_gate, $room);
            if(! isset($room_cands_class[$point])){
                $room_cands_class[$point] = array();
            }
            $room_cands_class[$point][] = $room;
        }

        $points_disp = array();
        foreach($room_cands_class as $point => $params){
            for($i = 0; $i < ($point + 1); $i ++){
                $points_disp[] = $point;
            }
        }

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
        $base_rgon = $base_gate->rgon;
        $trgt_rgon = $trgt_room->base_rgon;
        $relation = $this->_getRelation($base_rgon->pos['Y'], $base_rgon->pos['X'], $trgt_rgon->pos['Y'], $trgt_rgon->pos['X']);

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
//$this->_lb("TIERGON >>> {$strt_gate->id} >>> {$trgt_room->base_rgon->pos['Y']}_{$trgt_room->base_rgon->pos['X']}");
        $strt_room = $strt_gate->rgon->room;
        $prev_rgon = $strt_gate->rgon;
        $prev_aim  = $strt_gate->aim;

        foreach(range(0, ($this->rgon_scales['Y'] * $this->rgon_scales['X'])) as $i){
            list($pres_Y, $pres_X) = $this->_slide($prev_rgon->pos['Y'], $prev_rgon->pos['X'], $prev_aim);
//$this->_lb("({$prev_aim}>{$pres_Y}_{$pres_X})");
            $pres_rgon = $this->_getRgon($pres_Y, $pres_X);
            $ego_aims = $this->_getEgoAims($prev_aim);
            switch($pres_rgon->type){
                case $this->_type_room:
                    switch($prev_rgon->type){
                        case $this->_type_room:
                            if($pres_rgon->room === $prev_rgon->room){
                                continue 2;
                            }
                            break;
                        case $this->_type_road:
                            $prev_rgon->road->gates[$prev_aim] = false;
                            break;
                    }
                    if($prev_rgon->tieds[$prev_aim] === null){
                        $this->_rgon_links[] = array($prev_rgon, $pres_rgon);
                        $prev_rgon->tieds[$ego_aims['F']] = 0;
                        $pres_rgon->tieds[$ego_aims['D']] = 0;
                    }
//$this->_lb("CRD[{$prev_rgon->pos['Y']}_{$prev_rgon->pos['X']}|{$pres_rgon->pos['Y']}_{$pres_rgon->pos['X']}]");
                    switch(true){
                        case (count($this->_room_chain) == 1):
                        case ($pres_rgon->room->chain != $strt_room->chain):
                        case ($pres_rgon->room === $trgt_room):
                            $trgt_room = $pres_rgon->room;
                            break 3;
                    }
                    break;
                case $this->_type_wall:
                    $this->_setRoad($pres_rgon, $strt_room);
                case $this->_type_road:
                    $pres_rgon->road->rooms[] = $strt_room;
                    $pres_rgon->road->gates[$ego_aims['D']] = false;
                    switch($prev_rgon->type){
                        case $this->_type_room:
//$this->_lb("CRS[{$prev_rgon->pos['Y']}_{$prev_rgon->pos['X']}|{$pres_rgon->pos['Y']}_{$pres_rgon->pos['X']}]");
                            break;
                        case $this->_type_road:
                            $prev_rgon->road->gates[$prev_aim] = false;
//$this->_lb("CRA[{$prev_rgon->pos['Y']}_{$prev_rgon->pos['X']}|{$pres_rgon->pos['Y']}_{$pres_rgon->pos['X']}]");
                            break;
                    }
                    if($prev_rgon->tieds[$prev_aim] === null){
                        $this->_rgon_links[] = array($prev_rgon, $pres_rgon);
                        $prev_rgon->tieds[$ego_aims['F']] = 0;
                        $pres_rgon->tieds[$ego_aims['D']] = 0;
                    }

                    if(count($this->_room_chain) == 1){
                        if(count($pres_rgon->road->gates) >= 2){
                            $trgt_room = null;
                            break 2;
                        }
                    }
                    foreach($pres_rgon->road->rooms as $room){
                        if($room->chain != $strt_room->chain){
                            $trgt_room = $room;
                            break 3;
                        }
                    }
                    break;
            }

            $next_cands = array();
            foreach($this->_getAims() as $aim){
                list($next_Y, $next_X) = $this->_slide($pres_Y, $pres_X, $aim);
                list($trgt_Y, $trgt_X) = array($trgt_room->base_rgon->pos['Y'], $trgt_room->base_rgon->pos['X']);
                if($rgon = $this->_getRgon($next_Y, $next_X)){
                    if(($next_Y != $prev_rgon->pos['Y']) || ($next_X != $prev_rgon->pos['X'])){
                        $relation = $this->_getRelation($trgt_Y, $trgt_X, $next_Y, $next_X);
                        $range = abs($relation['Y']) + abs($relation['X']);
                        if(empty($next_cands) || $range < $next_cands['range']){
                            $next_cands = array('range' => $range, 'aims' => array($aim => true));
                        }
                        elseif($range == $next_cands['range']){
                            $next_cands['aims'][$aim] = true;
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
     *
     *
     * @access  protected
     * @param   object      $strt_rgon
     * @param   object      $trgt_rgon
     */
    protected function _paveRoad($strt_rgon, $trgt_rgon)
    {
        $relation = $this->_getRelation(
            $strt_rgon->pos['Y'], $strt_rgon->pos['X'],
            $trgt_rgon->pos['Y'], $trgt_rgon->pos['X']
        );
        switch(true){
            case ($relation['Y'] > 0): list($strt_aim, $trgt_aim) = array('B', 'T'); break;
            case ($relation['Y'] < 0): list($strt_aim, $trgt_aim) = array('T', 'B'); break;
            case ($relation['X'] > 0): list($strt_aim, $trgt_aim) = array('R', 'L'); break;
            case ($relation['X'] < 0): list($strt_aim, $trgt_aim) = array('L', 'R'); break;
        }

        $strt_poses = $this->_specifyGateCands($strt_rgon, $strt_aim);
        $trgt_poses = $this->_specifyGateCands($trgt_rgon, $trgt_aim);
        $strt_pos = $strt_poses[array_rand($strt_poses)];
        $trgt_pos = $trgt_poses[array_rand($trgt_poses)];

        $relation = $this->_getRelation($strt_pos['Y'], $strt_pos['X'], $trgt_pos['Y'], $trgt_pos['X']);
        $ego_envs = $this->_getEgoEnvs($strt_aim);
        $range_prmy = abs($relation[$ego_envs['P']]);
        $range_scdy = abs($relation[$ego_envs['S']]);
        switch($strt_aim){
            case 'T': $turn_aim = ($relation['X'] > 0) ? 'R' : 'L'; break;
            case 'R': $turn_aim = ($relation['Y'] > 0) ? 'B' : 'T'; break;
            case 'B': $turn_aim = ($relation['X'] > 0) ? 'R' : 'L'; break;
            case 'L': $turn_aim = ($relation['Y'] > 0) ? 'B' : 'T'; break;
        }

        $turn_prmy_min = ($strt_rgon->type == $this->_type_room) ? 2 : 0;
        $turn_prmy_max = $range_prmy - (($trgt_rgon->type == $this->_type_room) ? 2 : 0);
        $turn_prmy = rand($turn_prmy_min, $turn_prmy_max);
        $turn_params = array(
            array('aim' => $strt_aim, 'limit' => $turn_prmy),
            array('aim' => $turn_aim, 'limit' => $range_scdy),
            array('aim' => $strt_aim, 'limit' => ($range_prmy - $turn_prmy))
        );
//$this->_lb('PARAMS: ', $params);

        list($pres_Y, $pres_X) = array($strt_pos['Y'], $strt_pos['X']);
        foreach($turn_params as $i => $turn_param){
            list($goal_Y, $goal_X) = $this->_slide($pres_Y, $pres_X, $turn_param['aim'], $turn_param['limit']);
            for($n = 0; $n < $turn_param['limit']; $n ++){
                $pres_rgon = $this->_getRgonBySect($pres_Y, $pres_X);
                if($this->_sect_tiles[$pres_Y][$pres_X] == $this->_type_wall){
                    $this->_sect_tiles[$pres_Y][$pres_X] = $this->_type_road;
                    if($strt_rgon->type == $this->_type_road){ $this->_registerToRoad($strt_rgon->road, $pres_Y, $pres_X); }
                    if($trgt_rgon->type == $this->_type_road){ $this->_registerToRoad($trgt_rgon->road, $pres_Y, $pres_X); }
                }

                list($next_Y, $next_X) = $this->_slide($pres_Y, $pres_X, $turn_param['aim']);
//$this->_l(">{$next_Y}_{$next_X}");
                if(($pres_Y == $trgt_pos['Y']) && ($pres_X == $trgt_pos['X'])){ break 2; }
                if(($next_Y == $trgt_pos['Y']) && ($next_X == $trgt_pos['X'])){ continue; }

                list($pres_Y, $pres_X) = array($next_Y, $next_X);
            }
        }

        if($strt_rgon->type == $this->_type_road){ $this->_registerToRoad($strt_rgon->road, $trgt_pos['Y'], $trgt_pos['X']); }
        if($trgt_rgon->type == $this->_type_road){ $this->_registerToRoad($trgt_rgon->road, $trgt_pos['Y'], $trgt_pos['X']); }

        $strt_rgon->tieds[$strt_aim] = 1;
        $trgt_rgon->tieds[$trgt_aim] = 1;
//$this->_lb("PAVED >> {$strt_rgon->pos['Y']}_{$strt_rgon->pos['X']}:{$strt_aim}");
//$this->_lb("PAVED >> {$trgt_params['rgon']->pos['Y']}_{$trgt_params['rgon']->pos['X']}:{$trgt_params['aim']}");
    }


    /**
     * 部屋の接点の候補の抽出
     *
     * @access  protected
     * @param   object      $rgon
     * @param   string      $trgt_aim
     * @return  array
     */
    protected function _specifyGateCands($rgon, $trgt_aim)
    {
        $pos_cands = array();
        $ego_envs = $this->_getEgoEnvs($trgt_aim);
        $ego_aims = $this->_getEgoAims($trgt_aim);

        switch($rgon->type){
            case $this->_type_room:
                $pdng_F = $rgon->room->sect_pdngs[$ego_aims['F']];
                $pdng_R = ($rgon->room->rgon_edges[$ego_aims['R']] == $rgon->pos[$ego_envs['S']]) ? $rgon->room->sect_pdngs[$ego_aims['R']] : 0;
                $pdng_L = ($rgon->room->rgon_edges[$ego_aims['L']] == $rgon->pos[$ego_envs['S']]) ? $rgon->room->sect_pdngs[$ego_aims['L']] : 0;

                $P   = $this->_getRgonEdge($rgon, $ego_aims['F'], $pdng_F);
                $S_R = $this->_getRgonEdge($rgon, $ego_aims['R'], $pdng_R + 1);
                $S_L = $this->_getRgonEdge($rgon, $ego_aims['L'], $pdng_L + 1);
                $S_edges = array(
                    $this->_getRgonEdge($rgon, $ego_aims['R'], 1),
                    $this->_getRgonEdge($rgon, $ego_aims['L'], 1)
                );
                list($S_min, $S_max) = array(min($S_edges), max($S_edges));
                foreach(range($S_R, $S_L) as $S){
                    if($S >= $S_min && $S <= $S_max){
                        $pos = array($ego_envs['P'] => $P, $ego_envs['S'] => $S);
                        $pos_cands[] = array('Y' => $pos['Y'], 'X' => $pos['X']);
                    }
                }
                break;
            case $this->_type_road:
                $road = $rgon->road;
                $limit_edges = array();
                foreach($this->_getAims() as $aim){
                    $limit_edges[$aim] = $this->_getRgonEdge($rgon, $aim, 1);
                }
                $limit_edges_P = array($limit_edges[$ego_aims['F']], $limit_edges[$ego_aims['D']]);
                $limit_edges_S = array($limit_edges[$ego_aims['R']], $limit_edges[$ego_aims['L']]);
                list($P_min, $P_max) = array(min($limit_edges_P), max($limit_edges_P));
                list($S_min, $S_max) = array(min($limit_edges_S), max($limit_edges_S));

                $scdys = $road->roads[$ego_envs['S']];
                switch($ego_envs['sort_S']){
                    case 'ASC': ksort($scdys);  break;
                    case 'DSC': krsort($scdys); break;
                }
//$this->_lb("INJUCT >>>> {$rgon->pos['Y']}_{$rgon->pos['X']}|{$trgt_aim} ROAD >> ", $road->roads);
//$this->_lb('SCDY', $scdys);
                foreach($scdys as $S => $prmys){
                    if($S < $S_min || $S > $S_max){
                        continue;
                    }
                    switch($ego_envs['sort_P']){
                        case 'ASC': ksort($prmys);  break;
                        case 'DSC': krsort($prmys); break;
                    }
//$this->_lb('PRMY', $prmys);
                    $side_exists = array('R' => 0, 'L' => 0);
                    foreach($prmys as $P => $bool){
                        if($P < $P_min || $P > $P_max){
                            continue;
                        }
                        $pos = array($ego_envs['P'] => $P, $ego_envs['S'] => $S);
                        $side_rgon = $this->_getRgonBySect($pos['Y'], $pos['X']);
                        if($side_rgon === $rgon){
                            $pos_cands[] = array('Y' => $pos['Y'], 'X' => $pos['X']);
                            foreach($side_exists as $aim => $flag){
                                if($flag == 0){
                                    list($side_Y, $side_X) = $this->_slide($pos['Y'], $pos['X'], $ego_aims[$aim]);
                                    if(isset($this->_sect_tiles[$side_Y][$side_X])){
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
                break;
        }

        return $pos_cands;
    }


    /**
     *
     *
     * @access  protected
     * @param   object      $road
     * @param   int         $sect_Y
     * @param   int         $sect_X
     */
    protected function _registerToRoad($road, $sect_Y, $sect_X)
    {
        if(! isset($road->roads['Y'][$sect_Y])){ $road->roads['Y'][$sect_Y] = array(); }
        if(! isset($road->roads['X'][$sect_X])){ $road->roads['X'][$sect_X] = array(); }
        $road->roads['Y'][$sect_Y][$sect_X] = true;
        $road->roads['X'][$sect_X][$sect_Y] = true;
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
            foreach($this->_room_chain[$strt_chain_id] as $room_id => $param){
                $room = $this->_getRoom($room_id);
                $room->chain = $trgt_chain_id;
                $this->_room_chain[$trgt_chain_id][$room_id] = $param;
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
        list($road_sect_Y, $road_sect_X) = array($road->inter['Y'], $road->inter['X']);
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

        /*$aims = $this->_getAims();
        shuffle($aims);
        foreach($aims as $aim){
            $ego_aims = $this->_getEgoAims($aim);
            $ego_envs = $this->_getEgoEnvs($aim);
            $P_range = range($this->_getRgonEdge($road->rgon, $ego_aims['F']), $this->_getRgonEdge($road->rgon, $ego_aims['D']));
            $S_range = range($this->_getRgonEdge($road->rgon, $ego_aims['R']), $this->_getRgonEdge($road->rgon, $ego_aims['L']));
            foreach($P_range as $P){
                foreach($S_range as $S){
                    $pos = array($ego_envs['P'] => $P, $ego_envs['S'] => $S);
                    if($this->_sect_tiles[$pos['Y']][$pos['X']] == $this->_type_road){
                        $conds = array();
                        foreach(array('F', 'R', 'D', 'L') as $ego_zhou_aim){
                            $ego_zhou_aims = $this->_getEgoAims($ego_aims[$ego_zhou_aim]);
                            list($Y_1, $X_1) = $this->_slide($pos['Y'], $pos['X'], $ego_zhou_aims['F']);
                            list($Y_2, $X_2) = $this->_slide($Y_1, $X_1, $ego_zhou_aims['R']);
                            $conds[] = isset($this->_sect_tiles[$Y_1][$X_1]) && ($this->_sect_tiles[$Y_1][$X_1] != $this->_type_wall) ? 1 : 0;
                            $conds[] = isset($this->_sect_tiles[$Y_2][$X_2]) && ($this->_sect_tiles[$Y_2][$X_2] != $this->_type_wall) ? 2 : 0;
                        }

                        if(preg_match('/(^1.*12$|^21.*1$|121)/', implode('', $conds))){
//$this->_lb("{$pos['Y']}_{$pos['X']}::{$conds}");
                            switch(true){
                                case (preg_match('/^02121212$/', implode('', $conds))):
                                //case (preg_match('/^((0+)?2121[20](0+)?|1[20]000212|121[20]0002|1[20]000212)$/', implode('', $conds))):
                                //case (preg_match('/^((0+)?[20]1212(0+)?|12000[20]12|1210000[20]|10000[20]12)$/', implode('', $conds))):
                                case (preg_match('/(000|^0.*00$|^00.*0$)/', implode('', $conds))):
                                    $this->_sect_tiles[$pos['Y']][$pos['X']] = $this->_type_wall;
                                    break;
                            }
                        }
                        elseif(array_sum($conds) === 1){
                            $this->_sect_tiles[$pos['Y']][$pos['X']] = $this->_type_wall;
                        }
                    }
                }
            }
        }*/
        $aims = $this->_getAims();
        shuffle($aims);
        foreach($aims as $aim){
            $ego_aims = $this->_getEgoAims($aim);
            $ego_envs = $this->_getEgoEnvs($aim);
            $P_range = range($this->_getRgonEdge($road->rgon, $ego_aims['F']), $this->_getRgonEdge($road->rgon, $ego_aims['D']));
            $S_range = range($this->_getRgonEdge($road->rgon, $ego_aims['R']), $this->_getRgonEdge($road->rgon, $ego_aims['L']));
            foreach($P_range as $P){
                foreach($S_range as $S){
                    $pos = array($ego_envs['P'] => $P, $ego_envs['S'] => $S);
                    if($this->_sect_tiles[$pos['Y']][$pos['X']] == $this->_type_road){
                        $conds = array();
                        foreach(array('F', 'R', 'D', 'L') as $ego_zhou_aim){
                            $ego_zhou_aims = $this->_getEgoAims($ego_aims[$ego_zhou_aim]);
                            list($Y_1, $X_1) = $this->_slide($pos['Y'], $pos['X'], $ego_zhou_aims['F']);
                            list($Y_2, $X_2) = $this->_slide($Y_1, $X_1, $ego_zhou_aims['R']);
                            $conds[] = isset($this->_sect_tiles[$Y_1][$X_1]) && ($this->_sect_tiles[$Y_1][$X_1] != $this->_type_wall) ? 'I' : 'O';
                            $conds[] = isset($this->_sect_tiles[$Y_2][$X_2]) && ($this->_sect_tiles[$Y_2][$X_2] != $this->_type_wall) ? 'i' : 'o';
                        }

                        if(preg_match('/(^I.*Ii$|^iI.*I$|IiI)/', implode('', $conds))){
$this->_lb("{$pos['Y']}_{$pos['X']}::" . implode($conds));
                            switch(true){
                                case (preg_match('/^OiIiIiIi$/', implode('', $conds))):
                                case (preg_match('/(OoO|^O.*Oo$|^Oo.*O$)/', implode('', $conds))):
                                    $this->_sect_tiles[$pos['Y']][$pos['X']] = $this->_type_wall;
                                    break;
                            }
                        }
                        elseif(preg_match('/(OoOoO|^O.*OoOo$|^OoO.*Oo$)/', implode('', $conds))){
                            $this->_sect_tiles[$pos['Y']][$pos['X']] = $this->_type_wall;
                        }
                    }
                }
            }
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
    protected function _makeRgon($Y, $X)
    {
        $rgon = new stdClass();
        $rgon->pos   = array('Y' => $Y, 'X' => $X);
        $rgon->type  = $this->_type_wall;
        $rgon->room  = null;
        $rgon->road  = null;
        $rgon->tieds = array('T' => null, 'R' => null, 'B' => null, 'L' => null);

        return $rgon;
    }


    /**
     * 
     *
     * @access  protected
     * @param   object      $rgon       部屋集合データ
     * @param   int         $chain_id   部屋連鎖ID
     */
    protected function _setRoom($rgon, $chain_id)
    {
        $room_id = count($this->_room_tiles);
        $room = new stdClass();
        $this->_room_tiles[$room_id] = $room;

        $room->id         = $room_id;
        $room->base_rgon  = $rgon;
        $room->chain      = $chain_id;
        $room->rgon_edges = array();
        $room->sect_pdngs = array('T' => null, 'R' => null, 'B' => null, 'L' => null);
        $room->sect_edges = array('T' => null, 'R' => null, 'B' => null, 'L' => null);

        $rgon->type = $this->_type_room;
        $rgon->room = $this->_room_tiles[$room_id];

        $this->_room_chain[$chain_id] = array($room_id => true);
    }


    /**
     * 
     *
     * @access  protected
     * @param
     * @param
     */
    protected function _setRoad($rgon, $room)
    {
        $road_id = count($this->_road_tiles);
        $road = new stdClass();
        $this->_road_tiles[$road_id] = $road;

        $road->rgon  = $rgon;
        $road->rooms = array($room);
        $road->roads = array('Y' => array(), 'X' => array());
        $road->gates = array();
        $this->_specifyIntersection($road);

        $rgon->type = $this->_type_road;
        $rgon->road = $road;
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

        $road->inter = array('Y' => $mdl_Y, 'X' => $mdl_X);
        $road->roads['Y'] = array($mdl_Y => array($mdl_X => true));
        $road->roads['X'] = array($mdl_X => array($mdl_Y => true));

        $this->_sect_tiles[$mdl_Y][$mdl_X] = $this->_type_road;
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
        $gate_id = $this->_argsToGateId($rgon, $aim);
        $gate = new stdClass();
        $this->_gate_tiles[$gate_id] = $gate;

        $gate->id   = $gate_id;
        $gate->rgon = $rgon;
        $gate->aim  = $aim;

        $this->_gate_cands[$rgon->room->id][$gate->id] = $gate;
    }


    /**
     * 
     *
     * @access  protected
     * @param   int         $Y
     * @param   int         $X
     * @return
     */
    protected function _getRgon($Y, $X)
    {
        return isset($this->_rgon_tiles[$Y][$X]) ? $this->_rgon_tiles[$Y][$X] : null;
    }


    /**
     * 
     *
     * @access  protected
     * @param   int         $Y
     * @param   int         $X
     * @return
     */
    protected function _getRgonBySect($Y, $X)
    {
        return $this->_getRgon(floor($Y / $this->rgon_side), floor($X / $this->rgon_side));
    }


    /**
     * 
     *
     * @access  protected
     * @param
     * @return
     */
    protected function _getRoom($id)
    {
        return isset($this->_room_tiles[$id]) ? $this->_room_tiles[$id] : null;
    }


    /**
     * 
     *
     * @access  protected
     * @param   object      $rgon   管区集合データ
     * @param   string      $aim    方向
     */
    protected function _getGate($rgon, $aim)
    {
        $gate_id = $this->_argsToGateId($rgon, $aim);

        return isset($this->_gate_tiles[$gate_id]) ? $this->_gate_tiles[$gate_id] : null;
    }


    /**
     * 数値の座標への変換
     *
     * @access  protected
     * @param   object      
     * @param   string      
     * @return  string
     */
    protected function _argsToGateId($rgon, $aim)
    {
        return sprintf('%d_%d:%s', $rgon->pos['Y'], $rgon->pos['X'], $aim);
    }


    /**
     * 
     *
     * @access  protected
     * @param   object      $rgon
     * @param   string      $aim    方向
     * @param   int         $pdng   
     * @return  int
     */
    protected function _getRgonEdge($rgon, $aim, $pdng = 0)
    {
        switch($aim){
            case 'T': return $this->rgon_side * $rgon->pos['Y'] + $pdng; break;
            case 'R': return $this->rgon_side * ($rgon->pos['X'] + 1) - ($pdng + 1); break;
            case 'B': return $this->rgon_side * ($rgon->pos['Y'] + 1) - ($pdng + 1); break;
            case 'L': return $this->rgon_side * $rgon->pos['X'] + $pdng; break;
        }
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
     * @return  array
     */
    protected function _getAims()
    {
        return array('T', 'R', 'B', 'L');
    }


    /**
     * 
     *
     * @access  protected
     * @param   string      $aim    指定方向
     * @return  array
     */
    protected function _getEgoAims($aim)
    {
        switch($aim){
            case 'T': return array('F' => 'T', 'R' => 'R', 'D' => 'B', 'L' => 'L'); break;
            case 'R': return array('F' => 'R', 'R' => 'B', 'D' => 'L', 'L' => 'T'); break;
            case 'B': return array('F' => 'B', 'R' => 'L', 'D' => 'T', 'L' => 'R'); break;
            case 'L': return array('F' => 'L', 'R' => 'T', 'D' => 'R', 'L' => 'B'); break;
        }
    }


    /**
     * 
     *
     * @access  protected
     * @param   string      $aim    指定方向
     * @return  array
     */
    protected function _getEgoEnvs($aim)
    {
        switch($aim){
            case 'T': return array('P' => 'Y', 'S' => 'X', 'sort_P' => 'ASC', 'sort_S' => 'ASC'); break;
            case 'R': return array('P' => 'X', 'S' => 'Y', 'sort_P' => 'DSC', 'sort_S' => 'ASC'); break;
            case 'B': return array('P' => 'Y', 'S' => 'X', 'sort_P' => 'DSC', 'sort_S' => 'DSC'); break;
            case 'L': return array('P' => 'X', 'S' => 'Y', 'sort_P' => 'ASC', 'sort_S' => 'DSC'); break;
        }
    }


    /**
     * 座標間の位置関係情報の取得
     *
     * @access  protected
     * @param   int
     * @param   int
     * @param   int
     * @param   int
     * @return  array
     */
    protected function _getRelation($base_Y, $base_X, $trgt_Y, $trgt_X)
    {
        return array('Y' => ($trgt_Y - $base_Y), 'X' => ($trgt_X - $base_X));
    }
}
