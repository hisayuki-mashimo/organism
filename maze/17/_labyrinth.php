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

    protected $_rgon_tiles = array();   // 管区集合データ
    protected $_room_tiles = array();   // 部屋集合データ
    protected $_room_chain = array();   // 部屋連鎖データ
    protected $_road_tiles = array();   // 通路集合データ
    protected $_gate_tiles = array();   // 接点集合データ
    protected $_gate_chain = array();   // 接点連鎖データ
    protected $_gate_untie = array();   // 未接続接点群
    protected $_sect_tiles = array();   // 区画集合データ
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
            $this->_gate_chain[$chain_id] = array();
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

        // 接点の連結
        $gate_count = count($this->_gate_untie);
        for($i = 0; $i < $gate_count; $i ++){
            $gate_from = $this->_specifyStartGate();
            $gate_to   = $this->_specifyTargetGate($gate_from);
            $this->_log .= '[' . $gate_from. '|' . $gate_to . ']';
            $this->_tieGate($gate_from, $gate_to);

            if((count($this->_room_chain) <= 1) && (count($this->_gate_untie) == 0)){
                break;
            }
        }
        if(count($this->_room_chain) > 1){
            $this->_log .= ve($this->_room_chain, true);
            $this->_errored = true;
        }

        // 通路の整備
        foreach($this->_road_tiles as $coord => $road_params){
            // 中心ゲートが行き止まりの状態になっている場合、そこ迄の一本道を削除する。
            $road_sect_coord = $road_params['inter'];
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
    }


    /**
     * 区画データの文字列出力
     *
     * @return  string  全区画の数値化された改行区切り文字列データ
     */
    public function export()
    {
        $sect_str = '';

        $sect_nex = $this->rgon_side * $this->rgon_nex;
        foreach($this->_sect_tiles as $coord => $sect){
            list($v, $n) = explode('_', $coord);
            $sect_str .= $sect['type'];
            if((($n + 1) % $sect_nex) == 0){
                $sect_str .= "\n";
            }
        }

        return $sect_str;
    }


    /**
     * 部屋データ群の取得
     *
     * return   array
     */
    public function getRooms()
    {
        $rooms = array();
        $room  = new stdClass();
        $i = 0;
        foreach($this->_room_tiles as $rgon_coord => $param){
            $edges = $param['rgon_edges'];
            $pdngs = $param['sect_pdngs'];
            $room->room_top = $edges['top'];
            $room->room_lft = $edges['lft'];
            $room->room_rgt = $edges['rgt'];
            $room->room_btm = $edges['btm'];
            $room->top      = $edges['top'] * $this->rgon_side + $pdngs['top'];
            $room->lft      = $edges['lft'] * $this->rgon_side + $pdngs['lft'];
            $room->rgt      = $edges['rgt'] * $this->rgon_side + $this->rgon_side - 1 - $pdngs['rgt'];
            $room->btm      = $edges['btm'] * $this->rgon_side + $this->rgon_side - 1 - $pdngs['btm'];
            $room->area     = ($room->btm - $room->top + 1) * ($room->rgt - $room->lft + 1);
            $rooms[$i] = clone $room;

            $i ++;
        }

        return $rooms;
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
        $gate_cands = array();
        foreach($edge_params as $aim => $param){
            $gate_cands[$aim] = array();
            for($var = $param['from']; $var <= $param['to']; $var ++){
                $rgon_coord = sprintf($param['coord'], $var);
                if(isset($this->_rgon_tiles[$this->_getCoord($rgon_coord, $aim)])){
                    $gate_cands[$aim][$rgon_coord] = true;
                }
            }
        }

        // 接点個数の設定
        $gate_count = $this->_specifyGateCount($room_coord);

        // 接点の設置
        $n = 0;
        for($i = 0; $i < $gate_count; $i ++){
            foreach($this->_getAims(true) as $aim){
                if(! empty($gate_cands[$aim])){
                    $rgon_coord = array_rand($gate_cands[$aim]);
                    unset($gate_cands[$aim][$rgon_coord]);
                    $this->_setGate($rgon_coord, $aim);
                    $n ++;
                    if($n >= $gate_count){
                        break 2;
                    }
                }
            }
        }
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
        $gate_coord = "${rgon_coord}_${aim}";

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

        $this->_gate_chain[$this->_room_tiles[$room_coord]['chain']][$gate_coord] = true;
        $this->_gate_tiles[$gate_coord] = array('room' => $room_coord, 'vang' => $vang_coord);
        $this->_gate_untie[$gate_coord] = true;

        $this->_sect_tiles[$root_coord]['type'] = $this->_type_gate;
        $this->_sect_tiles[$agen_coord]['type'] = $this->_type_road;
        $this->_sect_tiles[$vang_coord]['type'] = $this->_type_road;
        $this->_sect_tiles[$vang_coord]['room'] = $room_coord;
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
     * 連結元接点の座標の取得
     *  - 所属する部屋連結データの規模が最も少ない接点から対象を抽出する。
     *
     * @return  string  座標
     */
    protected function _specifyStartGate()
    {
        $gate_cands = array();
        $scale_min = null;
        foreach($this->_gate_untie as $coord => $true){
            $gate = $this->_gate_tiles[$coord];
            $room = $this->_room_tiles[$gate['room']];
            $scale = count($this->_room_chain[$room['chain']]);
            if((! $scale_min) || ($scale < $scale_min)){
                $gate_cands = array($coord => true);
                $scale_min = $scale;
            }
            elseif($scale == $scale_min){
                $gate_cands[$coord] = true;
            }
        }
        if(empty($gate_cands)){
            $gate_cands = $this->_gate_chain[array_rand($this->_gate_chain)];
        }

        return array_rand($gate_cands);
    }


    /**
     * 連結先接点の座標の取得
     *
     * @param   string  $strt_coord 連結元座標
     * @return  string              座標
     */
    protected function _specifyTargetGate($strt_coord)
    {
        // 接点候補の設定
        $strt_gate = $this->_gate_tiles[$strt_coord];
        $strt_room = $this->_room_tiles[$strt_gate['room']];
        $gate_cands = array();
        $gate_cands_spare = array();
        foreach($this->_gate_untie as $coord => $true){
            if($coord != $strt_coord){
                $gate = $this->_gate_tiles[$coord];
                if($strt_room['chain'] != $this->_room_tiles[$gate['room']]['chain']){
                    $gate_cands[$coord] = true;
                }
                elseif(empty($gate_cands)){
                    if($gate['room'] != $strt_gate['room']){
                        $gate_cands_spare[$coord] = true;
                    }
                }
            }
        }
        if(empty($gate_cands)){
            $gate_cands = $gate_cands_spare;
        }
        if(empty($gate_cands)){
            $gate_chain = $this->_gate_chain;
            if(count($gate_chain) > 1){
                unset($gate_chain[$strt_room['chain']]);
            }
            $gate_cands = $gate_chain[array_rand($gate_chain)];
            unset($gate_cands[$strt_coord]);
        }

        $gate_cands_class = array();
        foreach($gate_cands as $coord => $value){
            $point = $this->_calcGateRelation($strt_coord, $coord);
            if(! isset($gate_cands_class[$point])){
                $gate_cands_class[$point] = array();
            }
            $gate_cands_class[$point][] = $coord;
        }

        $points_disp = array();
        foreach($gate_cands_class as $point => $coords){
            for($i = 0; $i < ($point + 1); $i ++){
                $points_disp[] = $point;
            }
        }
        $gate_cands = $gate_cands_class[$points_disp[array_rand($points_disp)]];
        return $gate_cands[array_rand($gate_cands)];
    }


    /**
     * 接点の連結
     *
     * @param   string  $strt_gate_coord 連結元接点座標
     * @param   string  $trgt_gate_coord 連結先接点座標
     */
    protected function _tieGate($strt_gate_coord, $trgt_gate_coord)
    {
        $strt_room_coord = $this->_gate_tiles[$strt_gate_coord]['room'];
        $trgt_room_coord = $this->_gate_tiles[$trgt_gate_coord]['room'];
        $strt_chain_id   = $this->_room_tiles[$strt_room_coord]['chain'];
        $trgt_chain_id   = $this->_room_tiles[$trgt_room_coord]['chain'];

        list($prev_ver, $prev_nex, $prev_aim) = explode('_', $strt_gate_coord);
        list($trgt_ver, $trgt_nex, $trgt_aim) = explode('_', $trgt_gate_coord);
        $prev_coord = "${prev_ver}_${prev_nex}";

        for($i = 0; $i < 20; $i ++){
            $pres_coord = $this->_getCoord($prev_coord, $prev_aim);
            $this->_log .= $pres_coord . ')';
            $pres_rgon  = $this->_rgon_tiles[$pres_coord];
            $prev_rgon  = $this->_rgon_tiles[$prev_coord];
            $agst_aim   = $this->_getAgainstAim($prev_aim);
            switch($pres_rgon['type']){
                case $this->_type_room:
                    $pres_room_coord = $this->_rgon_tiles[$pres_coord]['room'];
                    $pres_chain_id   = $this->_room_tiles[$pres_room_coord]['chain'];
                    $pres_gate_coord = $pres_coord . '_' . $agst_aim;

                    switch($prev_rgon['type']){
                        case $this->_type_room:
                            if($pres_rgon['room'] != $prev_rgon['room']){
                                $this->_tieRgon($prev_coord, $pres_coord);
                                switch(true){
                                    case (count($this->_room_chain) == 1):
                                    case ($pres_chain_id != $strt_chain_id):
                                    case ($pres_gate_coord == $trgt_gate_coord):
                                        $trgt_chain_id   = $pres_chain_id;
                                        $trgt_gate_coord = $pres_gate_coord;
                                    $rhis->_log .= 'O';
                                        break 4;
                                }
                            }
                            break;
                        case $this->_type_road:
                            $this->_road_tiles[$prev_coord]['gates'][$prev_aim] = false;
                            $this->_tieRgon($prev_coord, $pres_coord);
                            switch(true){
                                case (count($this->_room_chain) == 1):
                                    $trgt_chain_id   = $strt_chain_id;
                                    $trgt_gate_coord = $pres_gate_coord;
                                    $rhis->_log .= 'Y';
                                    break 4;
                                case (count($this->_room_chain) == 1):
                                case ($pres_chain_id != $strt_chain_id):
                                case ($pres_gate_coord == $trgt_gate_coord):
                                    $trgt_chain_id   = $pres_chain_id;
                                    $trgt_gate_coord = $pres_gate_coord;
                                    $rhis->_log .= 'S';
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
                            $this->_tieRgon($prev_coord, $pres_coord);
                                    $rhis->_log .= 'L';
                            break;
                        case $this->_type_road:
                            $this->_road_tiles[$prev_coord]['gates'][$prev_aim] = false;
                            $this->_tieRgon($prev_coord, $pres_coord);
                                    $rhis->_log .= 'R';
                    }

                    if(count($this->_room_chain) == 1){
                        if(count($this->_road_tiles[$pres_coord]['gates']) >= 2){
                            $trgt_gate_coord = null;
                            $trgt_chain_id   = $strt_chain_id;
                                    $rhis->_log .= 'I';
                            break 2;
                        }
                    }
                    foreach($this->_road_tiles[$pres_coord]['rooms'] as $room_coord => $true){
                        $pres_chain_id = $this->_room_tiles[$room_coord]['chain'];
                        if($pres_chain_id != $strt_chain_id){
                            $trgt_gate_coord = null;
                            $trgt_chain_id   = $pres_chain_id;
                                    $rhis->_log .= 'T';
                            break 3;
                        }
                    }
            }

            $next_cands = array();
            foreach($this->_getAims() as $aim){
                $coord = $this->_getCoord($pres_coord, $aim);
                if(isset($this->_rgon_tiles[$coord])){
                    if($coord != $prev_coord){
                        $range = $this->_getCoordRange($coord, ($trgt_ver . '_' . $trgt_nex));
                        if(empty($next_cands)){
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
        $this->_log .= '+++' . $strt_chain_id . '|' . $trgt_chain_id . '<br />' . json_encode($this->_room_chain) . '<br />';
    }


    /**
     * 区画の連結
     *
     * @param   string  $strt_coord 連結元区画座標
     * @param   string  $trgt_coord 連結先区画座標
     */
    protected function _tieSect($strt_coord, $trgt_coord)
    {
        $prev_coord = null;
        $pres_coord = $strt_coord;

        for($i = 0; $i < 30; $i ++){
            if($pres_coord == $trgt_coord){
                return;
            }

            $next_cands = array();
            $zhou_coords = $this->_getEnableAdvanceAims($pres_coord);
            foreach($zhou_coords as $aim => $coord){
                if($coord != $prev_coord){
                    $range = $this->_getCoordRange($coord, $trgt_coord);
                    if(empty($next_cands) || ($range < $next_cands['range'])){
                        $next_cands = array('range' => $range, 'aims' => array($aim => $coord));
                    }
                    elseif($range == $next_cands['range']){
                        $next_cands['aims'][$aim] = $coord;
                    }
                }
            }

            $prev_coord = $pres_coord;
            $pres_coord = $next_cands['aims'][array_rand($next_cands['aims'])];
            $this->_sect_tiles[$pres_coord]['type'] = $this->_type_road;
        }
    }


    /**
     * 
     *
     * @param   string  $pres_coord
     * @param   string  $trgt_coord
     */
    protected function _specifyRoadCoord($pres_coord, $trgt_coord)
    {
        list($trgt_ver, $trgt_nex) = explode('_', $trgt_coord);
        $coord_cands = array();

        foreach($this->_getAims() as $aim){
            $zhou_coord = $this->_getCoord($pres_coord, $aim);
            if(! isset($this->_sect_tiles[$zhou_coord])){
                continue;
            }
            list($zhou_ver, $zhou_nex) = explode('_', $zhou_coord);
            if(isset($road_sects_ver[$zhou_ver][$zhou_nex]) && ($this->_sect_tiles[$zhou_coord]['aim'] == $aim)){
                continue;
            }

            $conds = '';
            $priority = 0;
            for($n = 0; $n < 4; $n ++){
                $adjt_coord = $this->_getCoord($zhou_coord, $aim);
                $sltg_coord = $this->_getCoord($adjt_coord, $this->_getAgainstAim($aim, 'rgt'));
                $adjt_cond  = (isset($this->_sect_tiles[$adjt_coord]) && ($this->_sect_tiles[$adjt_coord]['type'] != $this->_type_wall)) ? 1 : 0;
                $sltg_cond  = (isset($this->_sect_tiles[$sltg_coord]) && ($this->_sect_tiles[$sltg_coord]['type'] != $this->_type_wall)) ? 2 : 0;
                if(isset($this->_sect_tiles[$sltg_coord])){
                    list($sltg_ver, $sltg_nex) = explode('_', $sltg_coord);
                    if(isset($road_tiles_ver[$sltg_ver][$sltg_nex]) && ($this->_sect_tiles[$sltg_coord]['aim'] != $this->_sect_tiles[$pres_coord]['aim'])){
                        $priority += 1;
                    }
                }
                $conds .= $adjt_cond . $sltg_cond;
            }

            if(preg_match('/(^1.*12$|^21.*1$|121)/', $conds)){
                continue;
            }

            $range = $this->_getCoordRange($zhou_coord, $trgt_coord);
            if(empty($coord_cands) || ($range < $coord_cands['range'])){
                $coord_cands = array('range' => $range, 'priority' => $priority, 'coords' => array($zhou_coord));
            }
            elseif($range == $coord_cands['range']){
                if($priority < $coord_cands['priority']){
                    $coord_cands = array('range' => $range, 'priority' => $priority, 'coords' => array($zhou_coord));
                }
                elseif($priority == $coord_cands['priority']){
                    $coord_cands['coords'][] = $zhou_coord;
                }
            }
        }

        if(empty($coord_cands)){
            throw new Exception();
        }

        $coords = $coord_cands['coords'];
        return $coords[array_rand($coords)];
    }


    /**
     * 区画の連結
     *
     *
     */
    protected function _tieRgon($strt_rgon_coord, $trgt_rgon_coord)
    {
        if(isset($this->_rgon_tiles[$strt_rgon_coord]['tieds'][$trgt_rgon_coord])){
            return;
        }

        $relation_aim = current(array_keys($this->_getCoordRelation($strt_rgon_coord, $trgt_rgon_coord)));
        $relation_params = array(
            'strt' => array('rgon_coord' => $strt_rgon_coord, 'agst_aim' => $relation_aim),
            'trgt' => array('rgon_coord' => $trgt_rgon_coord, 'agst_aim' => $this->_getAgainstAim($relation_aim))
        );
        $relation_cond = '';

        foreach($relation_params as $role => $param){
            switch($this->_rgon_tiles[$param['rgon_coord']]['type']){
                case $this->_type_room:
                    $gate_coord = $param['rgon_coord'] . '_' . $param['agst_aim'];
                    if(! isset($this->_gate_tiles[$gate_coord])){
                        $this->_setGate($param['rgon_coord'], $param['agst_aim']);
                    }
                    unset($this->_gate_untie[$gate_coord]);
                    $reration_params[$role]['sect_coord'] = $this->_gate_tiles[$gate_coord]['vang'];
                    $relation_cond .= 'G';
                    break;
                case $this->_type_road:
                    $strt_sect_coord = $this->_road_tiles[$param['rgon_coord']]['inter'];
                    $reration_params[$role]['sect_coord'] = $this->_road_tiles[$param['rgon_coord']]['inter'];
                    $relation_cond .= 'R';
            }
        }

        switch($relation_cond){
            case 'GG': $this->_tieSect($reration_params['strt']['sect_coord'], $reration_params['trgt']['sect_coord']); break;
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
        $mdia_coord = $this->_getMediateCoord($strt_road_coord, $trgt_road_coord);
        $this->_sect_tiles[$mdia_coord]['type'] = $this->_type_road;

        $relation_aim_strt = current(array_keys($this->_getCoordRelation($strt_road_coord, $trgt_road_coord)));
        $relation_aim_trgt = $this->_getAgainstAim($relation_aim_strt);

        $this->_paveRoad($strt_road_coord, $relation_aim_strt, $mdia_coord);
        $this->_paveRoad($trgt_road_coord, $relation_aim_trgt, $mdia_coord);
    }


    /**
     *
     *
     */
    protected function _paveRoadToGate($strt_road_coord, $trgt_gate_coord)
    {
        $trgt_gate_params = $this->_gate_tiles[$trgt_gate_coord];
        list($trgt_ver, $trgt_nex, $trgt_aim) = explode('_', $trgt_gate_coord);

        $this->_paveRoad($strt_road_coord, $this->_getAgainstAim($trgt_aim), $trgt_gate_params['vang']);
    }


    /**
     *
     *
     */
    protected function _getMediateCoord($strt_road_coord, $trgt_road_coord)
    {
        $strt_params = $this->_road_tiles[$strt_road_coord];
        $trgt_params = $this->_road_tiles[$trgt_road_coord];
        list($strt_rgon_ver, $strt_rgon_nex) = explode('_', $strt_road_coord);
        list($trgt_rgon_ver, $trgt_rgon_nex) = explode('_', $trgt_road_coord);
        list($strt_intr_ver, $strt_intr_nex) = explode('_', $strt_params['inter']);
        list($trgt_intr_ver, $trgt_intr_nex) = explode('_', $trgt_params['inter']);
        $relation_aim = current(array_keys($this->_getCoordRelation($strt_road_coord, $trgt_road_coord)));
        switch($relation_aim){
            case 'top': list($dnmc, $sttc, $dnmc_1, $dnmc_2, $sttc_1, $sttc_2) = array('nex', 'ver', $strt_intr_nex, $trgt_intr_nex, $trgt_rgon_ver, $strt_rgon_ver); break;
            case 'rgt': list($dnmc, $sttc, $dnmc_1, $dnmc_2, $sttc_1, $sttc_2) = array('ver', 'nex', $strt_intr_ver, $trgt_intr_ver, $strt_rgon_nex, $trgt_rgon_nex); break;
            case 'btm': list($dnmc, $sttc, $dnmc_1, $dnmc_2, $sttc_1, $sttc_2) = array('nex', 'ver', $strt_intr_nex, $trgt_intr_nex, $strt_rgon_ver, $trgt_rgon_ver); break;
            case 'lft': list($dnmc, $sttc, $dnmc_1, $dnmc_2, $sttc_1, $sttc_2) = array('ver', 'nex', $strt_intr_ver, $trgt_intr_ver, $trgt_rgon_nex, $strt_rgon_nex); break;
        }
        $sttc_edge_one = ($this->rgon_side * $sttc_1) + $this->rgon_side + 1;
        $sttc_cands = array($sttc_edge_one, ($sttc_edge_one - 3));
        $dnmc_cands = array($dnmc_1, $dnmc_2);
        ${"mdl_${sttc}"} = rand(min($sttc_cands), max($sttc_cands));
        ${"mdl_${dnmc}"} = rand(min($dnmc_cands), max($dnmc_cands));

        return $mdl_ver . '_' . $mdl_nex;
    }


    /**
     * _paveRoadOrg()簡略型メソッド
     *  - 原型関数の返却値の自由度が相対的に制限される代わりとして単純な通路を生成できる。
     *
     * @param   string  $road_coord
     * @param   string  $trgt_aim
     * @param   string  $trgt_coord
     */
    protected function _paveRoad($road_coord, $trgt_aim, $trgt_coord)
    {
        $road_params = $this->_road_tiles[$road_coord];
        $road_inter     = $road_params['inter'];
        $road_sects_ver = $road_params['roads']['ver'];
        $road_sects_nex = $road_params['roads']['nex'];

        switch($trgt_aim){
            case 'top':
            case 'btm':
                $aspect = 'ver';
                list($edge_prmy, $edge_scdy) = explode('_', $trgt_coord);
                list($base_prmy, $base_scdy) = explode('_', $road_inter);
                $road_sects = $road_sects_ver;
                break;
            case 'rgt':
            case 'lft':
                $aspect = 'nex';
                list($edge_scdy, $edge_prmy) = explode('_', $trgt_coord);
                list($base_scdy, $base_prmy) = explode('_', $road_inter);
                $road_sects = $road_sects_nex;
        }

        $strt_cands = array();
        $ranges     = array();

        foreach($this->_getAims() as $aim){
            $adjt_coord = $this->_getCoord($trgt_coord, $aim);
            list($adjt_ver, $adjt_nex) = explode('_', $adjt_coord);
            if(isset($road_sects_ver[$adjt_ver][$adjt_nex])){
                return;
            }

            $sltg_coord = $this->_getCoord($adjt_coord, $this->_getAgainstAim($aim, 'rgt'));
            list($sltg_ver, $sltg_nex) = explode('_', $sltg_coord);
            if(isset($road_sects_ver[$sltg_ver][$sltg_nex])){
                $strt_cands = array($trgt_coord);
                $ranges     = array($this->_getCoordRange($sltg_coord, $trgt_coord));
                $trgt_coord = $sltg_coord;
                break;
            }
        }

        if(empty($strt_cands)){
            $contrast = ($edge_prmy > $base_prmy) ? 'L' : ($edge_prmy < $base_prmy) ? 'S' : 'M';
            switch($contrast){
                case 'L': $order = array(-1, 1); break;
                case 'S': $order = array(1, -1); break;
                case 'M': $order = array(1, -1); shuffle($order);
            }
            for($range = 0; $range < ($this->rgon_side - 2); $range ++){
                foreach($order as $way){
                    $prmy = $base_prmy + $range * $way;
                    if(isset($road_sects[$prmy])){
                        foreach($road_sects[$prmy] as $scdy => $true){
                            switch($aspect){
                                case 'ver': $prev_coord = "${prmy}_${scdy}"; break;
                                case 'nex': $prev_coord = "${scdy}_${prmy}";
                            }
                            foreach($this->_getCoordRelation($prev_coord, $trgt_coord) as $aim => $value){
                                $next_coord = $this->_getCoord($prev_coord, $aim);
                                if($this->_sect_tiles[$next_coord]['type'] == $this->_type_wall){
                                    $zhou_coords = $this->_getEnableAdvanceAims($prev_coord);
                                    if(in_array($next_coord, $zhou_coords)){
                                        $strt_cands[] = $next_coord;
                                        $ranges[]     = $this->_getCoordRange($next_coord, $trgt_coord);
                                    }
                                }
                            }
                        }
                    }

                    if($range == 0){ break; }
                }
            }
        }

        array_multisort($ranges, SORT_ASC, $strt_cands);
        foreach($strt_cands as $pres_coord){
            try{
                $_sect_tiles     = $this->_sect_tiles;
                $_road_sects_ver = $road_sects_ver;
                $_road_sects_nex = $road_sects_nex;

                for($limit = ($this->rgon_side * $this->rgon_side); $limit > 0; $limit --){
                    $this->_sect_tiles[$pres_coord]['type'] = $this->_type_road;
                    $this->_sect_tiles[$pres_coord]['aim']  = $trgt_aim;
                    list($ver, $nex) = explode('_', $pres_coord);
                    if(! isset($road_sects_ver[$ver])){ $road_sects_ver[$ver] = array(); } $road_sects_ver[$ver][$nex] = true;
                    if(! isset($road_sects_nex[$nex])){ $road_sects_nex[$nex] = array(); } $road_sects_nex[$nex][$ver] = true;

                    if($this->_getCoordRange($pres_coord, $trgt_coord) <= 1){
                        break 2;
                    }

                    $pres_coord = $this->_specifyRoadCoord($pres_coord, $trgt_coord);
                }

                break;
            }
            catch(Exception $e){
                $this->_sect_tiles = $_sect_tiles;
                $road_sects_ver    = $_road_sects_ver;
                $road_sects_nex    = $_road_sects_nex;
            }
        }

        list($trgt_ver, $trgt_nex) = explode('_', $trgt_coord);
        if(! isset($road_sects_ver[$trgt_ver])){ $road_sects_ver[$trgt_ver] = array(); } $road_sects_ver[$trgt_ver][$trgt_nex] = true;
        if(! isset($road_sects_nex[$trgt_nex])){ $road_sects_nex[$trgt_nex] = array(); } $road_sects_nex[$trgt_nex][$trgt_ver] = true;

        $this->_road_tiles[$road_coord]['roads']['ver'] = $road_sects_ver;
        $this->_road_tiles[$road_coord]['roads']['nex'] = $road_sects_nex;
        $this->_road_tiles[$road_coord]['gates'][$trgt_aim] = true;
    }


    /**
     *
     *
     *
     */
    protected function _paveRoadOrg($road_coord, $trgt_aim, $trgt_coord)
    {
        $road_params = $this->_road_tiles[$road_coord];
        $road_inter     = $road_params['inter'];
        $road_sects_ver = $road_params['roads']['ver'];
        $road_sects_nex = $road_params['roads']['nex'];

        switch($trgt_aim){
            case 'top':
            case 'btm':
                $aspect = 'ver';
                list($edge_prmy, $edge_scdy) = explode('_', $trgt_coord);
                list($base_prmy, $base_scdy) = explode('_', $road_inter);
                $road_sects = $road_sects_ver;
                break;
            case 'rgt':
            case 'lft':
                $aspect = 'nex';
                list($edge_scdy, $edge_prmy) = explode('_', $trgt_coord);
                list($base_scdy, $base_prmy) = explode('_', $road_inter);
                $road_sects = $road_sects_nex;
        }

        $strt_cands = array();
        $ranges     = array();

        foreach($this->_getAims() as $aim){
            $adjt_coord = $this->_getCoord($trgt_coord, $aim);
            list($adjt_ver, $adjt_nex) = explode('_', $adjt_coord);
            if(isset($road_sects_ver[$adjt_ver][$adjt_nex])){
                return;
            }

            $sltg_coord = $this->_getCoord($adjt_coord, $this->_getAgainstAim($aim, 'rgt'));
            list($sltg_ver, $sltg_nex) = explode('_', $sltg_coord);
            if(isset($road_sects_ver[$sltg_ver][$sltg_nex])){
                $strt_cands = array($trgt_coord);
                $ranges     = array($this->_getCoordRange($sltg_coord, $trgt_coord));
                $trgt_coord = $sltg_coord;
                break;
            }
        }

        if(empty($strt_cands)){
            $contrast = ($edge_prmy > $base_prmy) ? 'L' : ($edge_prmy < $base_prmy) ? 'S' : 'M';
            switch($contrast){
                case 'L': $order = array(-1, 1); break;
                case 'S': $order = array(1, -1); break;
                case 'M': $order = array(1, -1); shuffle($order);
            }
            for($range = 0; $range < ($this->rgon_side - 2); $range ++){
                foreach($order as $way){
                    $prmy = $base_prmy + $range * $way;
                    if(isset($road_sects[$prmy])){
                        foreach($road_sects[$prmy] as $scdy => $true){
                            switch($aspect){
                                case 'ver': $prev_coord = "${prmy}_${scdy}"; break;
                                case 'nex': $prev_coord = "${scdy}_${prmy}";
                            }
                            foreach($this->_getCoordRelation($prev_coord, $trgt_coord) as $aim => $value){
                                $next_coord = $this->_getCoord($prev_coord, $aim);
                                if($this->_sect_tiles[$next_coord]['type'] == $this->_type_wall){
                                    $zhou_coords = $this->_getEnableAdvanceAims($prev_coord);
                                    if(in_array($next_coord, $zhou_coords)){
                                        $strt_cands[] = $next_coord;
                                        $ranges[]     = $this->_getCoordRange($next_coord, $trgt_coord);
                                    }
                                }
                            }
                        }
                    }

                    if($range == 0){ break; }
                }
            }
        }

        array_multisort($ranges, SORT_ASC, $strt_cands);
        foreach($strt_cands as $pres_coord){
            try{
                $_sect_tiles     = $this->_sect_tiles;
                $_road_sects_ver = $road_sects_ver;
                $_road_sects_nex = $road_sects_nex;

                for($limit = ($this->rgon_side * $this->rgon_side); $limit > 0; $limit --){
                    $this->_sect_tiles[$pres_coord]['type'] = $this->_type_road;
                    $this->_sect_tiles[$pres_coord]['aim']  = $trgt_aim;
                    list($ver, $nex) = explode('_', $pres_coord);
                    if(! isset($road_sects_ver[$ver])){ $road_sects_ver[$ver] = array(); } $road_sects_ver[$ver][$nex] = true;
                    if(! isset($road_sects_nex[$nex])){ $road_sects_nex[$nex] = array(); } $road_sects_nex[$nex][$ver] = true;

                    if($this->_getCoordRange($pres_coord, $trgt_coord) <= 1){
                        break 2;
                    }

                    $pres_coord = $this->_specifyRoadCoord($pres_coord, $trgt_coord);
                }

                break;
            }
            catch(Exception $e){
                $this->_sect_tiles = $_sect_tiles;
                $road_sects_ver    = $_road_sects_ver;
                $road_sects_nex    = $_road_sects_nex;
            }
        }

        list($trgt_ver, $trgt_nex) = explode('_', $trgt_coord);
        if(! isset($road_sects_ver[$trgt_ver])){ $road_sects_ver[$trgt_ver] = array(); } $road_sects_ver[$trgt_ver][$trgt_nex] = true;
        if(! isset($road_sects_nex[$trgt_nex])){ $road_sects_nex[$trgt_nex] = array(); } $road_sects_nex[$trgt_nex][$trgt_ver] = true;

        $this->_road_tiles[$road_coord]['roads']['ver'] = $road_sects_ver;
        $this->_road_tiles[$road_coord]['roads']['nex'] = $road_sects_nex;
        $this->_road_tiles[$road_coord]['gates'][$trgt_aim] = true;
    }


    /**
     * 連結データの統合
     *
     * @param   int $strt_chain_id  連鎖元データID
     * @param   int $trgt_chain_id  連鎖先データID
     */
    protected function _mergeChain($strt_chain_id, $trgt_chain_id)
    {
        if($strt_chain_id == $trgt_chain_id){
            return;
        }

        foreach($this->_room_chain[$strt_chain_id] as $room_coord => $param){
            $this->_room_tiles[$room_coord]['chain'] = $trgt_chain_id;
            $this->_room_chain[$trgt_chain_id][$room_coord] = $param;
        }
        unset($this->_room_chain[$strt_chain_id]);

        foreach($this->_gate_chain[$strt_chain_id] as $gate_coord => $param){
            $this->_gate_tiles[$gate_coord]['chain'] = $trgt_chain_id;
            $this->_gate_chain[$trgt_chain_id][$gate_coord] = $param;
        }
        unset($this->_gate_chain[$strt_chain_id]);
    }


    /**
     * 指定部屋の接点個数の設定
     *
     * @param   string  $room_coord 指定部屋の座標
     * @return  int
     */
    protected function _specifyGateCount($room_coord)
    {
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

        return array_rand($count_cands);
    }


    /**
     * 二者の接点の位置関係・方向から、接続のしやすさを計算する。
     *
     * @param   string  $coord  指定座標
     * @param   string  $coord  対象座標
     * @param   string  $aim    方向
     * @return  int
     */
    protected function _calcGateRelation($pres_coord, $trgt_coord)
    {
        list($pres_ver, $pres_nex, $pres_aim) = explode('_', $pres_coord);
        list($trgt_ver, $trgt_nex, $trgt_aim) = explode('_', $trgt_coord);

        $rlats = array(
            'top' => array('top' => 1, 'rgt' => 1, 'btm' => 1, 'lft' => 1),
            'rgt' => array('top' => 1, 'rgt' => 1, 'btm' => 1, 'lft' => 1),
            'btm' => array('top' => 1, 'rgt' => 1, 'btm' => 1, 'lft' => 1),
            'lft' => array('top' => 1, 'rgt' => 1, 'btm' => 1, 'lft' => 1)
        );

        if($pres_ver < $trgt_ver){
            $rlats['top']['top'] += 2; $rlats['top']['rgt'] += 1; $rlats['top']['btm'] += 0; $rlats['top']['lft'] += 1;
            $rlats['btm']['top'] += 4; $rlats['btm']['rgt'] += 3; $rlats['btm']['btm'] += 2; $rlats['btm']['lft'] += 3;
        }
        if($pres_ver > $trgt_ver){
            $rlats['top']['top'] += 2; $rlats['top']['rgt'] += 3; $rlats['top']['btm'] += 4; $rlats['top']['lft'] += 3;
            $rlats['btm']['top'] += 0; $rlats['btm']['rgt'] += 1; $rlats['btm']['btm'] += 2; $rlats['btm']['lft'] += 1;
        }
        if($pres_nex < $trgt_nex){
            $rlats['rgt']['top'] += 3; $rlats['rgt']['rgt'] += 2; $rlats['rgt']['btm'] += 3; $rlats['rgt']['lft'] += 4;
            $rlats['lft']['top'] += 2; $rlats['lft']['rgt'] += 0; $rlats['lft']['btm'] += 1; $rlats['lft']['lft'] += 2;
        }
        if($pres_nex > $trgt_nex){
            $rlats['rgt']['top'] += 1; $rlats['rgt']['rgt'] += 2; $rlats['rgt']['btm'] += 1; $rlats['rgt']['lft'] += 0;
            $rlats['lft']['top'] += 2; $rlats['lft']['rgt'] += 4; $rlats['lft']['btm'] += 3; $rlats['lft']['lft'] += 2;
        }

        return $rlats[$pres_aim][$trgt_aim];
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
     * 区画において指定座標の周囲にあり進行可能な方向・座標群の取得
     *
     * @param   string  $coord  指定座標
     * @return  array
     */
    protected function _getEnableAdvanceAims($coord)
    {
        $enable_aims = array();
        $tiles = $this->_sect_tiles;

        foreach($this->_getAims() as $cand_aim){
            $trgt_coord = $this->_getCoord($coord, $cand_aim);
            if(isset($tiles[$trgt_coord])){
                $conds = '';
                foreach($this->_getAims() as $adjt_aim){
                    $adjt_coord = $this->_getCoord($trgt_coord, $adjt_aim);
                    $sltg_coord = $this->_getCoord($adjt_coord, $this->_getAgainstAim($adjt_aim, 'rgt'));
                    $adjt_cond = 0;
                    $sltg_cond = 0;
                    if(isset($tiles[$adjt_coord]) && ($tiles[$adjt_coord]['type'] != $this->_type_wall)){ $adjt_cond = 1; }
                    if(isset($tiles[$sltg_coord]) && ($tiles[$sltg_coord]['type'] != $this->_type_wall)){ $sltg_cond = 2; }
                    $conds .= $adjt_cond . $sltg_cond;
                }

                if(! preg_match('/(^1.*12$|^12.*1$|121)/', $conds)){
                    $enable_aims[$cand_aim] = $trgt_coord;
                }
            }
        }

        return $enable_aims;
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
