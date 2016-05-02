<?php

class Labyrinth
{
    /* 外部制御用変数群 ----------------------------------------------------------------------------------------------------*/

    public $rgon_ver;                   // 管区の縦数(最小値: 2)
    public $rgon_nex;                   // 管区の横数(最小値: 2)
    public $rgon_side;                  // 管区の一辺(最小値: 3)
    public $room_count;                 // 部屋の数(最小値: 2)
    public $room_side_max;              // 部屋の一辺の最大値(最小値: 1)
    public $room_area_disp;             // 部屋の面積の分布(面積 => 設定確率)(最低要素: (1 => 1))
    public $room_pdng_min;              // 部屋の管区に対するパディングの最小値(最小値: 0)
    public $room_pdng_max;              // 部屋の管区に対するパディングの最小値(最小値: (管区の一辺 / 4))




    /* 内部処理用変数群 ----------------------------------------------------------------------------------------------------*/

    protected $_sect_tiles = array();   // 区画集合データ
    protected $_rgon_tiles = array();   // 管区集合データ
    protected $_room_tiles = array();   // 部屋集合データ
    protected $_room_chain = array();   // 部屋連鎖データ
    protected $_road_tiles = array();   // 通路集合データ
    protected $_gate_tiles = array();   // 接点集合データ
    protected $_gate_tasks = array();   // 部屋に設置する接点の個数群
    protected $_gate_cands = array();   // 部屋が接点を設置できる地点群
    protected $_type_wall  = 0;         // タイプ: 壁面
    protected $_type_road  = 1;         // タイプ: 通路
    protected $_type_room  = 2;         // タイプ: 部屋
    protected $_type_gate  = 3;         // タイプ: 接点




    /* 外部制御用関数群 ----------------------------------------------------------------------------------------------------*/

    /**
     * コンストラクタ
     *
     */
    public function __construct()
    {
        
    }


    /**
     * 設定
     *
     * @param   array   $params
     */
    public function init($params = array())
    {
        $this->rgon_ver = (isset($params['rgon_ver'])) ? (int)$params['rgon_ver'] : 2;
        $this->rgon_nex = (isset($params['rgon_nex'])) ? (int)$params['rgon_nex'] : 2;
        if($this->rgon_ver < 2){ $this->rgon_ver = 2; }
        if($this->rgon_nex < 2){ $this->rgon_nex = 2; }

        $this->rgon_side = (isset($params['rgon_side'])) ? (int)$params['rgon_side'] : 3;
        if($this->rgon_side < 3){ $this->rgon_side = 3; }

        $this->room_count = (isset($params['room_count'])) ? (int)$params['room_count'] : 2;
        if($this->room_count < 2){ $this->room_count = 2; }

        $this->room_side_max  = (isset($params['room_side_max']))  ? (int)$params['room_side_max'] : 1;
        $this->room_area_disp = (isset($params['room_area_disp'])) ? (array)$params['room_area_disp'] : array(1 => 1);
        if(! isset($this->room_area_disp[1])){ $this->room_area_disp[1] = 1; }

        $this->room_pdng_min = (isset($params['room_pdng_min'])) ? (int)$params['room_pdng_min'] : 3;
        $this->room_pdng_max = (isset($params['room_pdng_max'])) ? (int)$params['room_pdng_max'] : floor($this->rgon_side / 4);
    }


    /**
     * 構築
     *
     */
    public function build()
    {
        // 管区集合データの構築
        for($v = 0; $v < $this->rgon_ver; $v ++){
            for($n = 0; $n < $this->rgon_nex; $n ++){
                $this->_rgon_tiles["${v}_${n}"] = array('type' => $this->_type_wall, 'room' => null, 'tieds' => array());
            }
        }

        // 区画集合データの構築
        foreach(range(0, (($this->rgon_side * $this->rgon_ver) - 1)) as $v){
            foreach(range(0, (($this->rgon_side * $this->rgon_nex) - 1)) as $n){
                $this->_sect_tiles["${v}_${n}"] = array('type' => $this->_type_wall);
            }
        }

        // 部屋の定義
        $room_seeds = $this->_collectRoomSeeds();
        foreach($room_seeds as $chain_id => $coord){
            $this->_rgon_tiles[$coord]['type'] = $this->_type_room;
            $this->_rgon_tiles[$coord]['room'] = $coord;
            $this->_room_tiles[$coord]    = array('chain' => $chain_id, 'rgon_edges' => array(), 'sect_pdngs' => array(), 'inited' => false);
            $this->_room_chain[$chain_id] = array($coord => true);
        }

        // 部屋の拡張
        foreach($this->_room_tiles as $coord => $param){
            $this->_extendRoomOut($coord);
        }

        // 部屋の設定
        $axis_ver = rand(0, ($this->rgon_ver - 1));
        $axis_nex = rand(0, ($this->rgon_nex - 1));
        for($range_ver = 0; $range_ver < $this->rgon_ver; $range_ver ++){
            for($range_nex = 0; $range_nex < $this->rgon_nex; $range_nex ++){
                $rand_vect_ver = array(-1, 1); shuffle($rand_vect_ver);
                $rand_vect_nex = array(-1, 1); shuffle($rand_vect_nex);
                foreach($rand_vect_ver as $vect_ver){
                    foreach($rand_vect_nex as $vect_nex){
                        $ver = ($axis_ver + ($range_ver * $vect_ver));
                        $nex = ($axis_nex + ($range_nex * $vect_nex));
                        $rgon_coord = $ver . '_' . $nex;

                        if(isset($this->_rgon_tiles[$rgon_coord])){
                            if($this->_rgon_tiles[$rgon_coord]['type'] == $this->_type_room){
                                $room_coord = $this->_rgon_tiles[$rgon_coord]['room'];
                                if($this->_room_tiles[$room_coord]['inited'] == false){
                                    $this->_extendRoomIn($room_coord);
                                    $this->_setGates($room_coord);
                                    $this->_reflectRoom($room_coord);
                                    $this->_room_tiles[$room_coord]['inited'] = true;
                                }
                            }
                        }

                        if($range_nex == 0){ break; }
                    }

                    if($range_ver == 0){ break; }
                }
            }
        }

        // 部屋の連結
        for($i = 0; $i < ($this->rgon_ver * $this->rgon_nex); $i ++){
            $strt_gate = $this->_specifyStartGate();
            $trgt_room = $this->_specifyTargetRoom($strt_gate);
            $this->_tieRgon($strt_gate, $trgt_room);

            if((count($this->_room_chain) <= 1) && empty($this->_gate_tasks)){
                break;
            }
        }
        $this->_l('結果: ' . count($this->_room_chain), $this->_gate_tasks);

        // 通路の整備
        foreach($this->_road_tiles as $road_coord => $params){
            $this->_maintainRoad($road_coord);
        }
    }


    /**
     * 区画データの文字列出力
     *
     * @return  string  全区画の数値化された改行区切り文字列データ
     */
    public function export()
    {
        $lines = array();

        $params  = $this->_sect_tiles;
        $ver_max = $this->rgon_side * $this->rgon_ver - 1;
        $nex_max = $this->rgon_side * $this->rgon_nex - 1;
        foreach(range(0, $ver_max) as $ver){
            $line = '';
            foreach(range(0, $nex_max) as $nex){
                $line .= $params[($ver . '_' . $nex)]['type'];
            }
            $lines[] = $line;
        }

        return implode("\n", $lines);
    }




    /* 内部処理用関数群 ----------------------------------------------------------------------------------------------------*/

    /**
     * 部屋の核座標の収集
     *
     * @return  array   管区の座標群
     */
    protected function _collectRoomSeeds()
    {
        $room_seeds = array();
        $room_cands = $this->_rgon_tiles;

        // 一対の対角に必ず部屋を設置する。
        $rgon_corner_pairs = array(
            array('0_0', ($this->rgon_ver - 1) . '_' . ($this->rgon_nex - 1)),
            array('0_' . ($this->rgon_nex - 1), ($this->rgon_ver - 1) . '_0')
        );
        $rgon_corner_pair = $rgon_corner_pairs[array_rand($rgon_corner_pairs)];
        foreach($rgon_corner_pair as $coord){
            unset($room_cands[$coord]);
            $room_seeds[] = $coord;
        }

        // 規定の個数に必要な残数分を無作為に抽出する。
        $rest_count = $this->room_count - count($room_seeds);
        if($rest_count > 0){
            $room_cands = array_keys($room_cands);
            shuffle($room_cands);
            $room_seeds = array_merge($room_seeds, array_splice($room_cands, 0, $rest_count));
        }

        return $room_seeds;
    }


    /**
     * 部屋の外部拡張
     *
     * @param   int $room_coord 部屋集合データ主席座標
     */
    protected function _extendRoomOut($room_coord)
    {
        list($ver, $nex) = explode('_', $room_coord);
        $edges = array('top' => $ver, 'rgt' => $nex, 'btm' => $ver, 'lft' => $nex);
        $extend_cands = array(1 => array(0 => $edges));
        $this->_tryExtendRoomOut($edges, $extend_cands);

        $area_probs = array();
        foreach($extend_cands as $area => $extend){
            for($i = 0; $i < $this->room_area_disp[$area]; $i ++){
                $area_probs[] = $area;
            }
        }

        $area  = $area_probs[array_rand($area_probs)];
        $edges = $extend_cands[$area][array_rand($extend_cands[$area])];
        $this->_room_tiles[$room_coord]['rgon_edges'] = $edges;

        for($v = $edges['top']; $v <= $edges['btm']; $v ++){
            for($n = $edges['lft']; $n <= $edges['rgt']; $n ++){
                $this->_rgon_tiles["${v}_${n}"]['type'] = $this->_type_room;
                $this->_rgon_tiles["${v}_${n}"]['room'] = $room_coord;
            }
        }
    }


    /**
     * 部屋の四方への拡大可否確認
     *
     * @param   array   $edges          拡張処理の基礎データとなる部屋連鎖データ
     * @param   array   $edges_cands    拡張候補の部屋連鎖データ群
     * @return  array                   各方向について、拡大が可能な場合は対象域の座標群を返却する。
     */
    protected function _tryExtendRoomOut($edges, &$edges_cands)
    {
        $room_ver   = $edges['btm'] - $edges['top'] + 1;
        $room_nex   = $edges['rgt'] - $edges['lft'] + 1;
        $room_area  = $room_ver * $room_nex;
        $aim_coords = array();
        $aim_params = array(
            'top' => array('edge' => ($ed = $edges['top'] - 1), 'coord' => "${ed}_%s", 'from' => $edges['lft'], 'to' => $edges['rgt']),
            'rgt' => array('edge' => ($ed = $edges['rgt'] + 1), 'coord' => "%s_${ed}", 'from' => $edges['top'], 'to' => $edges['btm']),
            'btm' => array('edge' => ($ed = $edges['btm'] + 1), 'coord' => "${ed}_%s", 'from' => $edges['lft'], 'to' => $edges['rgt']),
            'lft' => array('edge' => ($ed = $edges['lft'] - 1), 'coord' => "%s_${ed}", 'from' => $edges['top'], 'to' => $edges['btm'])
        );

        foreach($aim_params as $aim => $param){
            $aim_coords[$aim] = array('edge' => $param['edge'], 'coords' => array());
            for($var = $param['from']; $var <= $param['to']; $var ++){
                $coord = sprintf($param['coord'], $var);
                switch(true){
                    case (! isset($this->_rgon_tiles[$coord])):
                    case ($this->_rgon_tiles[$coord]['type'] == $this->_type_room):
                    case ((($aim == 'top') || ($aim == 'btm')) && (($room_ver + 1) > $this->room_side_max)):
                    case ((($aim == 'rgt') || ($aim == 'lft')) && (($room_nex + 1) > $this->room_side_max)):
                        unset($aim_coords[$aim]);
                        break;
                }

                $aim_coords[$aim]['coords'][$coord] = true;
            }

            if(! isset($aim_coords[$aim])){
                continue;
            }

            $pred_edges = $edges;
            $pred_edges[$aim] = $aim_params[$aim]['edge'];
            $area = $room_area + count($aim_coords[$aim]['coords']);
            if(isset($this->room_area_disp[$area])){
                if(! isset($edges_cands[$area])){
                    $edges_cands[$area] = array();
                }
                $edges_cands[$area][] = $pred_edges;
            }

            $area = $room_area + count($aim_coords[$aim]['coords']);
            $area_max = max(array_keys($this->room_area_disp));
            if($area < $area_max){
                $this->_tryExtendRoomOut($pred_edges, $edges_cands);
            }
        }

        return $aim_coords;
    }


    /**
     * 部屋の内部拡張
     *
     * @param   int $room_coord 部屋集合データ主席座標
     */
    protected function _extendRoomIn($room_coord)
    {
        $edges = $this->_room_tiles[$room_coord]['rgon_edges'];
        $edge_params = array(
            'top' => array('coord' => ($edges['top'] . '_%s'), 'from' => $edges['lft'], 'to' => $edges['rgt']),
            'rgt' => array('coord' => ('%s_' . $edges['rgt']), 'from' => $edges['top'], 'to' => $edges['btm']),
            'btm' => array('coord' => ($edges['btm'] . '_%s'), 'from' => $edges['lft'], 'to' => $edges['rgt']),
            'lft' => array('coord' => ('%s_' . $edges['lft']), 'from' => $edges['top'], 'to' => $edges['btm'])
        );

        foreach($this->_getAims(true) as $aim){
            $param = $edge_params[$aim];
            $agst_aim = $this->_getAgainstAim($aim);
            $pdng_min = $this->room_pdng_min;
            $agst_pdng_min = null;
            for($var = $param['from']; $var <= $param['to']; $var ++){
                $edge_rgon_coord = sprintf($param['coord'], $var);
                $agst_rgon_coord = $this->_getCoord($edge_rgon_coord, $aim);
                if(isset($this->_rgon_tiles[$agst_rgon_coord]) && $this->_rgon_tiles[$agst_rgon_coord]['type'] == $this->_type_room){
                    $agst_room_coord = $this->_rgon_tiles[$agst_rgon_coord]['room'];
                    if(! empty($this->_room_tiles[$agst_room_coord]['sect_pdngs'])){
                        $agst_pdng = $this->_room_tiles[$agst_room_coord]['sect_pdngs'][$agst_aim];
                        if(is_null($agst_pdng_min) || ($agst_pdng < $agst_pdng_min)){
                            $agst_pdng_min = $agst_pdng;
                        }
                    }
                }
            }

            if((! is_null($agst_pdng_min)) && ($agst_pdng_min < 3)){
                $pdng_min = 3 - $agst_pdng_min;
            }

            if($pdng_min == 0){
                $enable_zero = true;
                foreach(array(($param['from'] - 1), ($param['to'] + 1)) as $n => $var){
                    $edge_rgon_coord = sprintf($param['coord'], $var);
                    $agst_rgon_coord = $this->_getCoord($edge_rgon_coord, $aim);
                    if(isset($this->_rgon_tiles[$agst_rgon_coord]) && $this->_rgon_tiles[$agst_rgon_coord]['type'] == $this->_type_room){
                        $agst_room_coord = $this->_rgon_tiles[$agst_rgon_coord]['room'];
                        if(! empty($this->_room_tiles[$agst_room_coord]['sect_pdngs'])){
                            $agst_pdng_1 = $this->_room_tiles[$agst_room_coord]['sect_pdngs'][$agst_aim];
                            $agst_pdng_2 = $this->_room_tiles[$agst_room_coord]['sect_pdngs'][$this->_getAgainstAim($agst_aim, (($n == 0) ? 'lft' : 'rgt'))];
                            if($agst_pdng_1 + $agst_pdng_2 == 0){
                                $enable_zero = false;
                                break;
                            }
                        }
                    }
                }
                if($enable_zero == false){
                    $pdng_min = 1;
                }
            }

            $this->_room_tiles[$room_coord]['sect_pdngs'][$aim] = rand($pdng_min, $this->room_pdng_max);
        }
    }


    /**
     * 接点の構築
     *
     * @param   int $room_coord 部屋集合データ座標
     */
    protected function _setGates($room_coord)
    {
        // 接点候補の設定準備
        $edges = $this->_room_tiles[$room_coord]['rgon_edges'];
        $edge_params = array(
            'top' => array('coord' => ($edges['top'] . '_%s'), 'from' => $edges['lft'], 'to' => $edges['rgt']),
            'rgt' => array('coord' => ('%s_' . $edges['rgt']), 'from' => $edges['top'], 'to' => $edges['btm']),
            'btm' => array('coord' => ($edges['btm'] . '_%s'), 'from' => $edges['lft'], 'to' => $edges['rgt']),
            'lft' => array('coord' => ('%s_' . $edges['lft']), 'from' => $edges['top'], 'to' => $edges['btm'])
        );

        // 接点候補の設定
        $this->_gate_cands[$room_coord] = array();
        foreach($edge_params as $aim => $param){
            for($var = $param['from']; $var <= $param['to']; $var ++){
                $rgon_coord = sprintf($param['coord'], $var);
                if(isset($this->_rgon_tiles[$this->_getCoord($rgon_coord, $aim)])){
                    $this->_gate_cands[$room_coord][($rgon_coord . ':' . $aim)] = true;
                }
            }
        }

        // 接点個数の設定
        $edges = $this->_room_tiles[$room_coord]['rgon_edges'];
        $zhou = 0;
        if(isset($this->_rgon_tiles[$this->_getCoord(($edges['top'] . '_' . $edges['lft']), 'top')])){ $zhou += $edges['rgt'] - $edges['lft'] + 1; }
        if(isset($this->_rgon_tiles[$this->_getCoord(($edges['top'] . '_' . $edges['rgt']), 'rgt')])){ $zhou += $edges['btm'] - $edges['top'] + 1; }
        if(isset($this->_rgon_tiles[$this->_getCoord(($edges['btm'] . '_' . $edges['lft']), 'btm')])){ $zhou += $edges['rgt'] - $edges['lft'] + 1; }
        if(isset($this->_rgon_tiles[$this->_getCoord(($edges['top'] . '_' . $edges['lft']), 'lft')])){ $zhou += $edges['btm'] - $edges['top'] + 1; }

        $count_cands = array();
        $size_max = null;
        for($i = 1; $i <= $zhou; $i ++){
            $wid = ceil(cos(deg2rad(($i / $zhou) * 90)) * 100);
            $hgt = ceil(sin(deg2rad(($i / $zhou) * 90)) * 100);
            $size = rand(0, $wid * $hgt);
            if((! isset($size_max)) || ($size > $size_max)){
                $count_cands = array($i => true);
                $size_max = $size;
            }
            elseif($size == $size_max){
                $count_cands[$i] = true;
            }
        }

        $this->_gate_tasks[$room_coord] = array_rand($count_cands);
    }


    /**
     * 接点の設定
     *
     * @param   string  $rgon_coord 管区集合データ座標
     * @param   string  $aim        方向
     */
    protected function _setGate($rgon_coord, $aim)
    {
        $room_coord = $this->_rgon_tiles[$rgon_coord]['room'];
        $gate_coord = $rgon_coord . ':' . $aim;

        list($ver, $nex) = explode('_', $rgon_coord);
        $edges = $this->_room_tiles[$room_coord]['rgon_edges'];
        $pdngs = $this->_room_tiles[$room_coord]['sect_pdngs'];
        switch($aim){
            case 'top': $n = ($this->rgon_side * $nex) + rand(($pdngs['lft'] + 1), ($this->rgon_side - $pdngs['rgt'] - 2)); $v = ($this->rgon_side * $ver) + $pdngs['top']; break;
            case 'lft': $v = ($this->rgon_side * $ver) + rand(($pdngs['top'] + 1), ($this->rgon_side - $pdngs['btm'] - 2)); $n = ($this->rgon_side * $nex) + $pdngs['lft']; break;
            case 'rgt': $v = ($this->rgon_side * $ver) + rand(($pdngs['top'] + 1), ($this->rgon_side - $pdngs['btm'] - 2)); $n = ($this->rgon_side * $nex) + $this->rgon_side - $pdngs['rgt'] - 1; break;
            case 'btm': $n = ($this->rgon_side * $nex) + rand(($pdngs['lft'] + 1), ($this->rgon_side - $pdngs['rgt'] - 2)); $v = ($this->rgon_side * $ver) + $this->rgon_side - $pdngs['btm'] - 1; break;
        }
        $root_coord = "${v}_${n}";
        $agen_coord = $this->_getCoord($root_coord, $aim, 1);
        $vang_coord = $this->_getCoord($root_coord, $aim, 2);

        $this->_gate_tiles[$gate_coord] = array('room' => $room_coord, 'vang' => $vang_coord);
        $this->_sect_tiles[$root_coord]['type'] = $this->_type_gate;
        $this->_sect_tiles[$agen_coord]['type'] = $this->_type_road;
        $this->_sect_tiles[$vang_coord]['type'] = $this->_type_road;
        $this->_sect_tiles[$vang_coord]['room'] = $room_coord;

        unset($this->_gate_cands[$room_coord][$gate_coord]);
        if(isset($this->_gate_tasks[$room_coord])){
            $this->_gate_tasks[$room_coord] --;
            if($this->_gate_tasks[$room_coord] <= 0){
                unset($this->_gate_tasks[$room_coord]);
            }
        }
        if(isset($this->_gate_cands[$room_coord]) && empty($this->_gate_cands[$room_coord])){
            unset($this->_gate_cands[$room_coord]);
        }
    }


    /**
     * 部屋連鎖データの区画集合データへの反映
     *
     * @param   int $room_coord 部屋集合データ座標
     */
    protected function _reflectRoom($room_coord)
    {
        $edges = $this->_room_tiles[$room_coord]['rgon_edges'];
        $pdngs = $this->_room_tiles[$room_coord]['sect_pdngs'];
        $top = $edges['top'] * $this->rgon_side + $pdngs['top'];
        $lft = $edges['lft'] * $this->rgon_side + $pdngs['lft'];
        $rgt = $edges['rgt'] * $this->rgon_side + $this->rgon_side - 1 - $pdngs['rgt'];
        $btm = $edges['btm'] * $this->rgon_side + $this->rgon_side - 1 - $pdngs['btm'];

        for($v = $top; $v <= $btm; $v ++){
            for($n = $lft; $n <= $rgt; $n ++){
                if($this->_sect_tiles["${v}_${n}"]['type'] != $this->_type_gate){
                    $this->_sect_tiles["${v}_${n}"]['type'] = $this->_type_room;
                    $this->_sect_tiles["${v}_${n}"]['room'] = $room_coord;
                }
            }
        }
    }


    /**
     * 連結元接点の座標の取得
     *  - 所属する部屋連結データの規模が最も少ない接点から対象を抽出する。
     *
     * @return  string  座標
     */
    protected function _specifyStartGate()
    {
        $gate_cands = array();
        foreach($this->_gate_tasks as $room_coord => $count){
            $scale = count($this->_room_chain[$this->_room_tiles[$room_coord]['chain']]);
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

        return array_rand($gate_cands['gates']);
    }


    /**
     * 連結先接点の座標の取得
     *
     * @param   string  $strt_coord 連結元座標
     * @return  string              座標
     */
    protected function _specifyTargetRoom($strt_gate_coord)
    {
        list($strt_rgon_coord, $strt_aim) = explode(':', $strt_gate_coord);
        $strt_room_coord = $this->_rgon_tiles[$strt_rgon_coord]['room'];
        $strt_room_chain_id = $this->_room_tiles[$strt_room_coord]['chain'];

        $room_cands = array();
        $room_cands_spare = array();

        foreach($this->_gate_tasks as $room_coord => $count){
            if($room_coord != $strt_room_coord){
                if(count($this->_room_chain) > 1){
                    if($this->_room_tiles[$room_coord]['chain'] != $strt_room_chain_id){
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
            foreach($this->_room_tiles as $room_coord => $param){
                if($room_coord != $strt_room_coord){
                    if(count($this->_room_chain) > 1){
                        if($this->_room_tiles[$room_coord]['chain'] != $strt_room_chain_id){
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
            $point = $this->_measureByGateRadar($strt_gate_coord, $room_coord);
            if(! isset($room_cands_class[$point])){
                $room_cands_class[$point] = array();
            }
            $room_cands_class[$point][] = $room_coord;
        }

        $points_disp = array();
        foreach($room_cands_class as $point => $coords){
            for($i = 0; $i < ($point + 1); $i ++){
                $points_disp[] = $point;
            }
        }
        $room_cands = $room_cands_class[$points_disp[array_rand($points_disp)]];
        return $room_cands[array_rand($room_cands)];
    }


    /**
     * 二者の接点の位置関係・方向から、接続のしやすさを計算する。
     *
     * @param   string  $coord  指定座標
     * @param   string  $coord  対象座標
     * @param   string  $aim    方向
     * @return  int
     */
    protected function _measureByGateRadar($base_gate_coord, $trgt_room_coord)
    {
        list($base_rgon_coord, $base_aim) = explode(':', $base_gate_coord);
        list($trgt_ver, $trgt_nex) = explode('_', $trgt_room_coord);

        $relation = $this->_getCoordRelation($base_rgon_coord, $trgt_room_coord);
        switch(true){
            case isset($relation[$base_aim]):
                return 5; break;
            case isset($relation[$this->_getAgainstAim($base_aim)]):
                switch(true){
                    case isset($relation[$this->_getAgainstAim($base_aim, 'lft')]):
                    case isset($relation[$this->_getAgainstAim($base_aim, 'rgt')]):
                        return 3; break 2;
                    default:
                        return 1;
                }
        }
    }


    /**
     * 接点の連結
     *
     * @param   string  $strt_gate_coord 連結元接点座標
     * @param   string  $trgt_gate_coord 連結先接点座標
     */
    protected function _tieRgon($strt_gate_coord, $trgt_room_coord)
    {
        list($strt_rgon_coord, $strt_aim) = explode(':', $strt_gate_coord);
        $strt_room_coord = $this->_rgon_tiles[$strt_rgon_coord]['room'];
        $strt_chain_id   = $this->_room_tiles[$strt_room_coord]['chain'];
        $trgt_chain_id   = $this->_room_tiles[$trgt_room_coord]['chain'];

        $prev_coord = $strt_rgon_coord;
        $prev_aim   = $strt_aim;

        for($i = 0; $i < ($this->rgon_ver * $this->rgon_nex); $i ++){
            $pres_coord = $this->_getCoord($prev_coord, $prev_aim);
            $pres_rgon  = $this->_rgon_tiles[$pres_coord];
            $prev_rgon  = $this->_rgon_tiles[$prev_coord];
            $agst_aim   = $this->_getAgainstAim($prev_aim);
            switch($pres_rgon['type']){
                case $this->_type_room:
                    $pres_room_coord = $this->_rgon_tiles[$pres_coord]['room'];
                    $pres_chain_id   = $this->_room_tiles[$pres_room_coord]['chain'];
                    $pres_gate_coord = $pres_coord . ':' . $agst_aim;

                    switch($prev_rgon['type']){
                        case $this->_type_room:
                            if($pres_rgon['room'] != $prev_rgon['room']){
                                $this->_connectRgon($prev_coord, $pres_coord);
                                switch(true){
                                    case (count($this->_room_chain) == 1):
                                    case ($pres_chain_id != $strt_chain_id):
                                    case ($pres_room_coord == $trgt_room_coord):
                                        $trgt_chain_id   = $pres_chain_id;
                                        $trgt_room_coord = $pres_room_coord;
                                        break 4;
                                }
                            }
                            break;
                        case $this->_type_road:
                            $this->_road_tiles[$prev_coord]['gates'][$prev_aim] = false;
                            $this->_connectRgon($prev_coord, $pres_coord);
                            switch(true){
                                case (count($this->_room_chain) == 1):
                                    $trgt_chain_id   = $strt_chain_id;
                                    $trgt_room_coord = $pres_room_coord;
                                    break 4;
                                case (count($this->_room_chain) == 1):
                                case ($pres_chain_id != $strt_chain_id):
                                case ($pres_room_coord == $trgt_room_coord):
                                    $trgt_chain_id   = $pres_chain_id;
                                    $trgt_room_coord = $pres_room_coord;
                                    break 4;
                            }
                    }
                    break;
                case $this->_type_wall:
                    $this->_rgon_tiles[$pres_coord]['type'] = $this->_type_road;
                    $this->_road_tiles[$pres_coord] = array(
                        'rooms' => array($strt_room_coord => true),
                        'gates' => array()
                    );

                    $inter = $this->_specifyIntersection($pres_coord);
                    list($intr_ver, $intr_nex) = explode('_', $inter);
                    $this->_road_tiles[$pres_coord]['inter'] = $inter;
                    $this->_road_tiles[$pres_coord]['roads'] = array(
                        'ver' => array($intr_ver => array($intr_nex => true)),
                        'nex' => array($intr_nex => array($intr_ver => true))
                    );
                    $this->_sect_tiles[$inter]['type'] = $this->_type_road;
                    $this->_sect_tiles[$inter]['aim']  = 'mdl';
                case $this->_type_road:
                    $this->_road_tiles[$pres_coord]['rooms'][$strt_room_coord] = true;
                    $this->_road_tiles[$pres_coord]['gates'][$agst_aim] = false;
                    switch($prev_rgon['type']){
                        case $this->_type_room:
                            $this->_connectRgon($prev_coord, $pres_coord);
                            break;
                        case $this->_type_road:
                            $this->_road_tiles[$prev_coord]['gates'][$prev_aim] = false;
                            $this->_connectRgon($prev_coord, $pres_coord);
                    }

                    if(count($this->_room_chain) == 1){
                        if(count($this->_road_tiles[$pres_coord]['gates']) >= 2){
                            $trgt_room_coord = null;
                            $trgt_chain_id   = $strt_chain_id;
                            break 2;
                        }
                    }
                    foreach($this->_road_tiles[$pres_coord]['rooms'] as $room_coord => $true){
                        $pres_chain_id = $this->_room_tiles[$room_coord]['chain'];
                        if($pres_chain_id != $strt_chain_id){
                            $trgt_room_coord = null;
                            $trgt_chain_id   = $pres_chain_id;
                            break 3;
                        }
                    }
            }

            $next_cands = array();
            foreach($this->_getAims() as $aim){
                $coord = $this->_getCoord($pres_coord, $aim);
                if(isset($this->_rgon_tiles[$coord])){
                    if($coord != $prev_coord){
                        $range = $this->_getCoordRange($coord, $trgt_room_coord);
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
            $prev_coord = $pres_coord;
        }

        $this->_mergeChain($strt_chain_id, $trgt_chain_id);
    }


    /**
     * 区画の連結
     *
     *
     */
    protected function _connectRgon($strt_rgon_coord, $trgt_rgon_coord)
    {
        if(isset($this->_rgon_tiles[$strt_rgon_coord]['tieds'][$trgt_rgon_coord])){
            return;
        }

        $relation_aim = current(array_keys($this->_getCoordRelation($strt_rgon_coord, $trgt_rgon_coord)));
        $relation_params = array(
            'strt' => array('rgon' => $strt_rgon_coord, 'agst_aim' => $relation_aim),
            'trgt' => array('rgon' => $trgt_rgon_coord, 'agst_aim' => $this->_getAgainstAim($relation_aim))
        );
        $relation_cond = '';

        foreach($relation_params as $role => $param){
            switch($this->_rgon_tiles[$param['rgon']]['type']){
                case $this->_type_room:
                    $room_coord = $this->_rgon_tiles[$param['rgon']]['room'];
                    $gate_coord = $param['rgon'] . ':' . $param['agst_aim'];
                    if(! isset($this->_gate_tiles[$gate_coord])){
                        $this->_setGate($param['rgon'], $param['agst_aim']);
                    }
                    $relation_params[$role]['gate'] = $gate_coord;
                    $relation_cond .= 'G';
                    break;
                case $this->_type_road:
                    $relation_cond .= 'R';
            }
        }

        switch($relation_cond){
            case 'GG': $this->_paveGateToGate($relation_params['strt']['gate'], $relation_params['trgt']['gate']); break;
            case 'GR': $this->_paveRoadToGate($trgt_rgon_coord, $gate_coord); break;
            case 'RG': $this->_paveRoadToGate($strt_rgon_coord, $gate_coord); break;
            case 'RR': $this->_paveRoadToRoad($strt_rgon_coord, $trgt_rgon_coord);
        }

        $this->_rgon_tiles[$strt_rgon_coord]['tieds'][$trgt_rgon_coord] = true;
        $this->_rgon_tiles[$trgt_rgon_coord]['tieds'][$strt_rgon_coord] = true;
    }


    /**
     * 通路の起点座標の取得
     *
     * @param   string  $rgon_coord 通路の座標
     * @return  string              座標
     */
    protected function _specifyIntersection($road_coord)
    {
        list($rgon_ver, $rgon_nex) = explode('_', $road_coord);
        $mdl_ver = ($this->rgon_side * $rgon_ver) + floor($this->rgon_side / 2);
        $mdl_nex = ($this->rgon_side * $rgon_nex) + floor($this->rgon_side / 2);
        $rand_range = floor((($this->rgon_side / 2) - 1) / (($this->rgon_side > 7) ? 3 : 1));
        $intr_ver = $mdl_ver + rand(($rand_range * (-1)), $rand_range);
        $intr_nex = $mdl_nex + rand(($rand_range * (-1)), $rand_range);

        return $intr_ver . '_' . $intr_nex;
    }


    /**
     *
     *
     */
    protected function _paveRoadToRoad($strt_road_coord, $trgt_road_coord)
    {
        $this->_ll('@[' . $strt_road_coord, $trgt_road_coord . ']');

        $strt_aim = current(array_keys($this->_getCoordRelation($strt_road_coord, $trgt_road_coord)));
        $trgt_aim = $this->_getAgainstAim($strt_aim);
        $aim_vctr = $this->_getAimVector($strt_aim);
        $strt_cands = $this->_specifyJunctionCands($strt_road_coord, $strt_aim);
        $trgt_cands = $this->_specifyJunctionCands($trgt_road_coord, $trgt_aim);

        $this->_paveRoad(
            array('coords' => $strt_cands, 'type' => $this->_type_road, 'road' => $strt_road_coord, 'aim' => $strt_aim),
            array('coords' => $trgt_cands, 'type' => $this->_type_road, 'road' => $trgt_road_coord)
        );
    }


    /**
     *
     *
     * @param   string  $strt_road_coord
     * @param   string  $trgt_gate_coord
     */
    protected function _paveRoadToGate($strt_road_coord, $trgt_gate_coord)
    {
        $this->_ll('_[' . $strt_road_coord, $trgt_gate_coord . ']');

        list($trgt_rgon_coord, $trgt_aim) = explode(':', $trgt_gate_coord);
        $strt_aim   = $this->_getAgainstAim($trgt_aim);
        $strt_cands = $this->_specifyJunctionCands($strt_road_coord, $strt_aim);
        $trgt_cands = array($this->_gate_tiles[$trgt_gate_coord]['vang']);

        $this->_paveRoad(
            array('coords' => $strt_cands, 'type' => $this->_type_road, 'road' => $strt_road_coord, 'aim' => $strt_aim),
            array('coords' => $trgt_cands, 'type' => $this->_type_gate)
        );
    }


    /**
     *
     *
     * @param   string  $strt_road_coord
     * @param   string  $trgt_gate_coord
     */
    protected function _paveGateToGate($strt_gate_coord, $trgt_gate_coord)
    {
        $this->_ll('+[' . $strt_gate_coord, $trgt_gate_coord . ']');

        list($strt_rgon_coord, $strt_aim) = explode(':', $strt_gate_coord);
        list($trgt_rgon_coord, $trgt_aim) = explode(':', $trgt_gate_coord);
        $strt_cands = array($this->_gate_tiles[$strt_gate_coord]['vang']);
        $trgt_cands = array($this->_gate_tiles[$trgt_gate_coord]['vang']);

        $this->_paveRoad(
            array('coords' => $strt_cands, 'type' => $this->_type_gate, 'aim' => $strt_aim),
            array('coords' => $trgt_cands, 'type' => $this->_type_gate)
        );
    }


    /**
     *
     *
     */
    protected function _paveRoad($strt_params, $trgt_params)
    {
        $paved = false;

        $_sect_tiles = $this->_sect_tiles;
        if($strt_params['type'] == $this->_type_road){ $_roads_strt = $this->_road_tiles[$strt_params['road']]['roads']; }
        if($trgt_params['type'] == $this->_type_road){ $_roads_trgt = $this->_road_tiles[$trgt_params['road']]['roads']; }

        foreach($trgt_params['coords'] as $trgt_coord){
            $this->_l('T: ', $trgt_coord);
            list($trgt_ver, $trgt_nex) = explode('_', $trgt_coord);
            foreach($strt_params['coords'] as $strt_coord){
                $this->_l('S: ', $strt_coord);
                list($strt_ver, $strt_nex) = explode('_', $strt_coord);

                try{
                    switch($this->_getAimVector($strt_params['aim'])){
                        case 'ver':
                            $range_prmy = abs($strt_ver - $trgt_ver);
                            $range_scdy = abs($strt_nex - $trgt_nex);
                            $turn_aim   = ($trgt_nex > $strt_nex) ? 'rgt' : 'lft';
                            break;
                        case 'nex':
                            $range_prmy = abs($strt_nex - $trgt_nex);
                            $range_scdy = abs($strt_ver - $trgt_ver);
                            $turn_aim   = ($trgt_ver > $strt_ver) ? 'btm' : 'top';
                    }

                    $turn_prmy_cands = range(0, $range_prmy);
                    shuffle($turn_prmy_cands);
                    foreach($turn_prmy_cands as $turn_prmy){
                        try{
                            $params = array(
                                array('aim' => $strt_params['aim'], 'limit' => $turn_prmy),
                                array('aim' => $turn_aim,           'limit' => $range_scdy),
                                array('aim' => $strt_params['aim'], 'limit' => ($range_prmy - $turn_prmy)),
                            );

                            $pres_coord = $strt_coord;
                            $this->_l('開始: ', $strt_coord, '>>>');
                            foreach($params as $i => $param){
                                $goal_coord = $this->_getCoord($pres_coord, $param['aim'], $param['limit']);
                                for($n = 0; $n < $param['limit']; $n ++){
                                    $this->_sect_tiles[$pres_coord]['type'] = $this->_type_road;
                                    $this->_sect_tiles[$pres_coord]['aim']  = $strt_params['aim'];
                                    if($strt_params['type'] == $this->_type_road){ $this->_registerToRoad($strt_params['road'], $pres_coord); }
                                    if($trgt_params['type'] == $this->_type_road){ $this->_registerToRoad($trgt_params['road'], $pres_coord); }

                                    $next_coord = $this->_getCoord($pres_coord, $param['aim']);
                                    $this->_l('>', $next_coord);

                                    if($pres_coord == $trgt_coord){ break 2; }
                                    if($next_coord == $trgt_coord){ continue; }

                                    if(! in_array($next_coord, $this->_getEnableAdvanceAims($pres_coord))){
                                        $this->_l('D' . $next_coord . '(' . $i . ')');
                                        throw new Exception($i);
                                    }

                                    foreach($this->_getZhouCoords($next_coord) as $aim => $zhou_coord){
                                        switch(true){
                                            case ($zhou_coord == $trgt_coord):
                                            case ($zhou_coord == $goal_coord):
                                            case ($zhou_coord == $pres_coord):
                                            case ($this->_sect_tiles[$zhou_coord]['type'] == $this->_type_wall):
                                                break;
                                            default:
                                                $this->_l('*' . $zhou_coord . '(' . $i . ')');
                                                throw new Exception($i);
                                        }
                                    }

                                    $pres_coord = $next_coord;
                                }
                            }

                            if($strt_params['type'] == $this->_type_road){ $this->_registerToRoad($strt_params['road'], $trgt_coord); }
                            if($trgt_params['type'] == $this->_type_road){ $this->_registerToRoad($trgt_params['road'], $trgt_coord); }

                            $paved = true;
                            break;
                        }
                        catch(Exception $e){
                            $this->_sect_tiles = $_sect_tiles;
                            if($strt_params['type'] == $this->_type_road){ $this->_road_tiles[$strt_params['road']]['roads'] = $_roads_strt; }
                            if($trgt_params['type'] == $this->_type_road){ $this->_road_tiles[$trgt_params['road']]['roads'] = $_roads_trgt; }
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
                    $this->_sect_tiles = $_sect_tiles;
                    if($strt_params['type'] == $this->_type_road){ $this->_road_tiles[$strt_params['road']]['roads'] = $_roads_strt; }
                    if($trgt_params['type'] == $this->_type_road){ $this->_road_tiles[$trgt_params['road']]['roads'] = $_roads_trgt; }
                    $this->_lb('M');
                }
            }
        }
        $this->_lb();
        $this->_ll();
    }


    /**
     * 通路から目的方向へ分岐する候補の抽出
     *
     * @access  private
     * @param   string  $road_coord
     * @param   string  $trgt_aim
     */
    protected function _specifyJunctionCands($road_coord, $trgt_aim)
    {
        list($road_ver, $road_nex) = explode('_', $road_coord);
        $top = $this->rgon_side * $road_ver + 1;
        $lft = $this->rgon_side * $road_nex + 1;
        $rgt = $lft + $this->rgon_side - 3;
        $btm = $top + $this->rgon_side - 3;
        switch($this->_getAimVector($trgt_aim)){
            case 'ver':
                $road_sects = $this->_road_tiles[$road_coord]['roads']['ver'];
                $coord_replacer = 'P_S';
                $prmy_cands = ($trgt_aim == 'top') ? range($top, $btm) : range($btm, $top);
                $scdy_cands = range($lft, $rgt);
                break;
            case 'nex':
                $road_sects = $this->_road_tiles[$road_coord]['roads']['nex'];
                $coord_replacer = 'S_P';
                $prmy_cands = ($trgt_aim == 'lft') ? range($lft, $rgt) : range($rgt, $lft);
                $scdy_cands = range($top, $btm);
        }

        $coord_cands = array($this->_road_tiles[$road_coord]['inter']);
        $this->_l('##', $road_coord, '~', $road_sects, '##');
        shuffle($scdy_cands);
        foreach($scdy_cands as $scdy){
            foreach($prmy_cands as $prmy){
                if(isset($road_sects[$prmy][$scdy])){
                    $coord = str_replace('P', $prmy, $coord_replacer);
                    $coord = str_replace('S', $scdy, $coord);
                    if(in_array($this->_getCoord($coord, $trgt_aim), $this->_getEnableAdvanceAims($coord))){
                        $coord_cands[] = $coord;
                        break;
                    }
                }
            }
        }

        shuffle($coord_cands);
        return $coord_cands;
    }


    /**
     *
     *
     *
     */
    protected function _registerToRoad($road_coord, $sect_coord)
    {
        list($ver, $nex) = explode('_', $sect_coord);
        if(! isset($this->_road_tiles[$road_coord]['roads']['ver'][$ver])){ $this->_road_tiles[$road_coord]['roads']['ver'][$ver] = array(); }
        if(! isset($this->_road_tiles[$road_coord]['roads']['nex'][$nex])){ $this->_road_tiles[$road_coord]['roads']['nex'][$nex] = array(); }
        $this->_road_tiles[$road_coord]['roads']['ver'][$ver][$nex] = true;
        $this->_road_tiles[$road_coord]['roads']['nex'][$nex][$ver] = true;
    }


    /**
     * 連結データの統合
     *
     * @param   int $strt_chain_id  連鎖元データID
     * @param   int $trgt_chain_id  連鎖先データID
     */
    protected function _mergeChain($strt_chain_id, $trgt_chain_id)
    {
        if($strt_chain_id != $trgt_chain_id){
            foreach($this->_room_chain[$strt_chain_id] as $room_coord => $param){
                $this->_room_tiles[$room_coord]['chain'] = $trgt_chain_id;
                $this->_room_chain[$trgt_chain_id][$room_coord] = $param;
            }
            unset($this->_room_chain[$strt_chain_id]);
        }
    }


    /**
     * 通路の整備
     *
     */
    protected function _maintainRoad($road_coord)
    {
        // 中心ゲートが行き止まりの状態になっている場合、そこ迄の一本道を削除する。
        $road_sect_coord = $this->_road_tiles[$road_coord]['inter'];
        for($limit = ($this->rgon_side * 2); $limit > 0; $limit --){
            $zhou_roads_count = 0;
            foreach($this->_getAims() as $aim){
                $zhou_coord = $this->_getCoord($road_sect_coord, $aim);
                if(isset($this->_sect_tiles[$zhou_coord])){
                    $zhou_tile = $this->_sect_tiles[$zhou_coord];
                    if($zhou_tile['type'] != $this->_type_wall){
                        $next_coord = $zhou_coord;
                        $zhou_roads_count ++;
                    }
                }
            }
            if($zhou_roads_count > 1){
                $this->_sect_tiles[$road_sect_coord]['type'] = $this->_type_road;
                break;
            }
            $this->_sect_tiles[$road_sect_coord]['type'] = $this->_type_wall;
            $road_sect_coord = $next_coord;
        }
    }


    /**
     * 指定座標からの指定方向・指定距離先の座標の取得
     *
     * @param   string  $coord  指定座標
     * @param   string  $aim    方向
     * @param   string  $range  距離
     * @return  string          座標
     */
    protected function _getCoord($coord, $aim, $range = 1)
    {
        list($ver, $nex) = explode('_', $coord);
        switch($aim){
            case 'top': $ver -= $range; break;
            case 'rgt': $nex += $range; break;
            case 'btm': $ver += $range; break;
            case 'lft': $nex -= $range;
        }

        return "${ver}_${nex}";
    }


    /**
     * 方向群の取得
     *
     * @param   bool    $rand   順番をランダムで返却するか
     * @return  array
     */
    protected function _getAims($rand = false)
    {
        $aims = array('top', 'rgt', 'btm', 'lft');
        if($rand){
            shuffle($aims);
        }

        return $aims;
    }


    /**
     * 指定方向の対局方向の取得
     *
     * @param   string  $aim    指定方向
     * @return  string          方向
     */
    protected function _getAgainstAim($aim, $relation = 'dis')
    {
        $aim_relations = array(
            'top' => array('rgt' => 'rgt', 'dis' => 'btm', 'lft' => 'lft'),
            'rgt' => array('rgt' => 'btm', 'dis' => 'lft', 'lft' => 'top'),
            'btm' => array('rgt' => 'lft', 'dis' => 'top', 'lft' => 'rgt'),
            'lft' => array('rgt' => 'top', 'dis' => 'rgt', 'lft' => 'btm')
        );

        return $aim_relations[$aim][$relation];
    }


    /**
     * 指定方向の向きの取得
     *
     * @param   string  $aim    指定方向
     * @return  string          向き
     */
    protected function _getAimVector($aim)
    {
        switch($aim){
            case 'top': case 'btm': return 'ver'; break;
            case 'rgt': case 'lft': return 'nex';
        }
    }


    /**
     * 区画において指定座標の周囲にあり進行可能な方向・座標群の取得
     *
     * @param   string  $sect_coord 指定座標
     * @return  array
     */
    protected function _getEnableAdvanceAims($sect_coord)
    {
        $enable_aims = array();

        foreach($this->_getAims() as $cand_aim){
            $trgt_coord = $this->_getCoord($sect_coord, $cand_aim);
            if(isset($this->_sect_tiles[$trgt_coord])){
                $conds = '';
                foreach($this->_getAims() as $adjt_aim){
                    $coord_1 = $this->_getCoord($trgt_coord, $adjt_aim);
                    $coord_2 = $this->_getCoord($coord_1, $this->_getAgainstAim($adjt_aim, 'rgt'));
                    $conds .= (isset($this->_sect_tiles[$coord_1]) && ($this->_sect_tiles[$coord_1]['type'] != $this->_type_wall)) ? 1 : 0;
                    $conds .= (isset($this->_sect_tiles[$coord_2]) && ($this->_sect_tiles[$coord_2]['type'] != $this->_type_wall)) ? 2 : 0;
                }

                if(! preg_match('/(^1.*12$|^21.*1$|121)/', $conds)){
                    $enable_aims[$cand_aim] = $trgt_coord;
                }
            }
        }

        return $enable_aims;
    }


    /**
     * 指定座標の周囲の座標群の取得
     *
     * @param   string  $sect_coord 指定座標
     * @param   bool    $bafang     八方の座標を返すか
     * @return  array
     */
    protected function _getZhouCoords($sect_coord, $bafang = false)
    {
        $zhou_coords = array();

        foreach($this->_getAims() as $zhou_aim){
            $zhou_coord = $this->_getCoord($sect_coord, $zhou_aim);
            if(isset($this->_sect_tiles[$zhou_coord])){
                $zhou_coords[$zhou_aim] = $zhou_coord;

                if($bafang == true){
                    $sltg_coord = $this->_getCoord($sect_coord, $this->_getAgainstAim($zhou_aim, 'rgt'));
                    if(isset($this->_sect_tiles[$sltg_coord])){
                        $zhou_coords[$zhou_aim . '_rgt'] = $sltg_coord;
                    }
                }
            }
        }

        return $zhou_coords;
    }


    /**
     * 座標間の位置関係情報の取得
     *
     * @param   string  $base_coord 指定座標
     * @param   string  $trgt_coord 対象座標
     * @return  array
     */
    protected function _getCoordRelation($base_coord, $trgt_coord)
    {
        $relations = array();

        list($base_ver, $base_nex) = explode('_', $base_coord);
        list($trgt_ver, $trgt_nex) = explode('_', $trgt_coord);
        $rltn_ver = $trgt_ver - $base_ver;
        $rltn_nex = $trgt_nex - $base_nex;
        if($rltn_ver > 0){ $relations['btm'] = abs($rltn_ver); } elseif($rltn_ver < 0){ $relations['top'] = abs($rltn_ver); }
        if($rltn_nex > 0){ $relations['rgt'] = abs($rltn_nex); } elseif($rltn_nex < 0){ $relations['lft'] = abs($rltn_nex); }

        return $relations;
    }


    /**
     * 座標間の距離の取得
     *
     * @param   string  $base_coord 指定座標
     * @param   string  $trgt_coord 対象座標
     * @return  int
     */
    protected function _getCoordRange($base_coord, $trgt_coord)
    {
        list($base_ver, $base_nex) = explode('_', $base_coord);
        list($trgt_ver, $trgt_nex) = explode('_', $trgt_coord);

        return abs($trgt_ver - $base_ver) + abs($trgt_nex - $base_nex);
    }
}
