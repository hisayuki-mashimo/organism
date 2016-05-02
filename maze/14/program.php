<?php

require_once '/home/zhen-xia/public_html/sanbou/sanbou.php';

class Labyrinth
{
    /* 外部制御用変数群 ----------------------------------------------------------------------------------------------------*/

    public $rgon_ver;               // 管区の縦数(最小値: 2)
    public $rgon_nex;               // 管区の横数(最小値: 2)
    public $rgon_side;              // 管区の一辺(最小値: 3)
    public $mete_side;              // 境界の幅(最小値: 1)
    public $room_count;             // 部屋の数(最小値: 2)
    public $room_side_max;          // 部屋の一辺の最大値(最小値: 1)
    public $room_area_disp;         // 部屋の面積の分布(面積 => 設定確率)(最低要素: (1 => 1))
    public $room_pdng_min;          // 部屋の管区に対するパディングの最小値(最小値: 0)
    public $room_pdng_max;          // 部屋の管区に対するパディングの最小値(最小値: (管区の一辺 / 4))




    /* 内部処理用変数群 ----------------------------------------------------------------------------------------------------*/

    private $_rgon_tiles = array(); // 管区集合データ
    private $_room_tiles = array(); // 部屋集合データ
    private $_room_chain = array(); // 部屋連鎖データ
    private $_road_tiles = array(); // 通路集合データ
    private $_gate_tiles = array(); // 接点集合データ
    private $_gate_chain = array(); // 接点連鎖データ
    private $_gate_untie = array(); // 未接続接点群
    private $_sect_tiles = array(); // 区画集合データ
    private $_type_wall  = 0;       // タイプ: 壁面
    private $_type_room  = 2;       // タイプ: 部屋
    private $_type_gate  = 3;       // タイプ: 接点
    private $_type_road  = 4;       // タイプ: 通路




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
        $this->mete_side = (isset($params['mete_side'])) ? (int)$params['mete_side'] : 3;
        if($this->rgon_side % 2 == 0){ $this->rgon_side += 1; }
        if($this->mete_side % 2 == 0){ $this->mete_side += 1; }
        if($this->rgon_side < 3){ $this->rgon_side = 3; }
        if($this->mete_side < 3){ $this->mete_side = 3; }

        $this->room_count = (isset($params['room_count'])) ? (int)$params['room_count'] : 2;
        if($this->room_count < 2){ $this->room_count = 2; }

        $this->room_side_max  = (isset($params['room_side_max']))  ? (int)$params['room_side_max'] : 1;
        $this->room_area_disp = (isset($params['room_area_disp'])) ? (array)$params['room_area_disp'] : array(1 => 1);
        if(! isset($this->room_area_disp[1])){ $this->room_area_disp[1] = 1; }

        $this->room_pdng_min = (isset($params['room_pdng_min'])) ? (int)$params['room_pdng_min'] : 0;
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
                $this->_rgon_tiles["${v}_${n}"] = array('type' => $this->_type_wall, 'room' => null);
            }
        }

        // 区画集合データの構築
        $sect_ver = ($this->rgon_side * $this->rgon_ver) + (($this->rgon_ver - 1) * $this->mete_side);
        $sect_nex = ($this->rgon_side * $this->rgon_nex) + (($this->rgon_nex - 1) * $this->mete_side);
        $rgon_unit = $this->rgon_side + $this->mete_side;
        for($v = 0; $v < $sect_ver; $v ++){
            for($n = 0; $n < $sect_nex; $n ++){
                $this->_sect_tiles["${v}_${n}"] = array('type' => $this->_type_wall);
            }
        }

        // 部屋の定義
        $room_seeds = $this->_collectRoomSeeds();
        foreach($room_seeds as $chain_id => $coord){
            $this->_rgon_tiles[$coord]['type'] = $this->_type_room;
            $this->_rgon_tiles[$coord]['room'] = $coord;
            $this->_room_tiles[$coord]    = array('chain' => $chain_id, 'rgon_edges' => array(), 'sect_pdngs' => array());
            $this->_room_chain[$chain_id] = array($coord => true);
            $this->_gate_chain[$chain_id] = array();
        }

        // 部屋の形成
        foreach($this->_room_tiles as $coord => $param){
            $this->_extendRoomOut($coord);
            $this->_extendRoomIn($coord);
            $this->_setGates($coord);
            $this->_reflectRoom($coord);
        }

        // 接点の連結
        $gate_count = count($this->_gate_untie);
        for($i = 0; $i < $gate_count; $i ++){
            $gate_from = $this->_specifyStartGate();
            $gate_to   = $this->_specifyTargetGate($gate_from);
            $this->_tieGate($gate_from, $gate_to);

            if(count($this->_gate_untie) == 0){
                break;
            }
        }

        // 通路の舗装
        foreach($this->_road_tiles as $coord => $params){
            $this->_paveRoad($coord);
        }
    }


    /**
     * 出力
     *
     */
    public function export()
    {
        $sect_str = '';

        $sect_nex = ($this->rgon_side * $this->rgon_nex) + (($this->rgon_nex - 1) * $this->mete_side);
        foreach($this->_sect_tiles as $coord => $sect){
            list($v, $n) = explode('_', $coord);
            $sect_str .= $sect['type'];
            if((($n + 1) % $sect_nex) == 0){
                $sect_str .= "\n";
            }
        }

        return $sect_str;
    }




    /* 内部処理用関数群 ----------------------------------------------------------------------------------------------------*/

    /**
     * 部屋の核座標の収集
     *
     * @return  array   管区の座標群
     */
    private function _collectRoomSeeds()
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

        // 部屋の個数が3以上・管区の縦横の幅がそれぞれ3以上のとき、中心管区に必ず部屋を設置する。
        if(($this->room_count >= 3) && (($this->rgon_ver >= 3) || ($this->rgon_nex >= 3))){
            $rgon_center = (floor($this->rgon_ver / 2)) . '_' . (floor($this->rgon_nex / 2));
            unset($room_cands[$rgon_center]);
            $room_seeds[] = $rgon_center;
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
     * @param   int $coord  部屋集合データ座標
     */
    private function _extendRoomOut($coord)
    {
        list($ver, $nex) = explode('_', $coord);
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
        $this->_room_tiles[$coord]['rgon_edges'] = $edges;

        for($v = $edges['top']; $v <= $edges['btm']; $v ++){
            for($n = $edges['lft']; $n <= $edges['rgt']; $n ++){
                $this->_rgon_tiles["${v}_${n}"]['type'] = $this->_type_room;
                $this->_rgon_tiles["${v}_${n}"]['room'] = $coord;
            }
        }
    }


    /**
     * 部屋の内部拡張
     *
     * @param   int $coord  部屋集合データ座標
     */
    private function _extendRoomIn($coord)
    {
        $this->_room_tiles[$coord]['sect_pdngs'] = array(
            'top' => rand($this->room_pdng_min, $this->room_pdng_max),
            'rgt' => rand($this->room_pdng_min, $this->room_pdng_max),
            'btm' => rand($this->room_pdng_min, $this->room_pdng_max),
            'lft' => rand($this->room_pdng_min, $this->room_pdng_max)
        );
    }


    /**
     * 接点の構築
     *
     * @param   int $room_coord 部屋集合データ座標
     */
    private function _setGates($room_coord)
    {
        // 接点候補の設定準備
        $edges = $this->_room_tiles[$room_coord]['rgon_edges'];
        $edge_params = array(
            'top' => array('edge' => ($edge = $edges['top']), 'coord' => "${edge}_%s", 'from' => $edges['lft'], 'to' => $edges['rgt']),
            'rgt' => array('edge' => ($edge = $edges['rgt']), 'coord' => "%s_${edge}", 'from' => $edges['top'], 'to' => $edges['btm']),
            'btm' => array('edge' => ($edge = $edges['btm']), 'coord' => "${edge}_%s", 'from' => $edges['lft'], 'to' => $edges['rgt']),
            'lft' => array('edge' => ($edge = $edges['lft']), 'coord' => "%s_${edge}", 'from' => $edges['top'], 'to' => $edges['btm'])
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
        $aims = $this->_getAims(true);
        $n = 0;
        for($i = 0; $i < $gate_count; $i ++){
            for($a = 0; $a < 4; $a ++){
                $aim = $aims[$a];
                if(empty($gate_cands[$aim])){
                    continue;
                }
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


    /**
     * 接点の設定
     *
     * @param   string  $rgon_coord 管区集合データ座標
     * @param   string  $aim        方向
     */
    private function _setGate($rgon_coord, $aim)
    {
        $room_coord = $this->_rgon_tiles[$rgon_coord]['room'];
        $gate_coord = "${rgon_coord}_${aim}";

        list($ver, $nex) = explode('_', $rgon_coord);
        $side = $this->rgon_side + $this->mete_side;
        $edges = $this->_room_tiles[$room_coord]['rgon_edges'];
        $pdngs = $this->_room_tiles[$room_coord]['sect_pdngs'];
        switch($aim){
            case 'top': $n = ($side * $nex) + rand(($pdngs['lft'] + 1), ($this->rgon_side - $pdngs['rgt'] - 2)); $v = ($side * $ver) + $pdngs['top']; break;
            case 'lft': $v = ($side * $ver) + rand(($pdngs['top'] + 1), ($this->rgon_side - $pdngs['btm'] - 2)); $n = ($side * $nex) + $pdngs['lft']; break;
            case 'rgt': $v = ($side * $ver) + rand(($pdngs['top'] + 1), ($this->rgon_side - $pdngs['btm'] - 2)); $n = ($side * $nex) + $this->rgon_side - $pdngs['rgt'] - 1; break;
            case 'btm': $n = ($side * $nex) + rand(($pdngs['lft'] + 1), ($this->rgon_side - $pdngs['rgt'] - 2)); $v = ($side * $ver) + $this->rgon_side - $pdngs['btm'] - 1; break;
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
     * @param   int $coord  部屋集合データ座標
     */
    private function _reflectRoom($coord)
    {
        $data  = $this->_room_tiles[$coord];
        $edges = $data['rgon_edges'];
        $pdngs = $data['sect_pdngs'];
        $top = $edges['top'] * ($this->rgon_side + $this->mete_side) + $pdngs['top'];
        $lft = $edges['lft'] * ($this->rgon_side + $this->mete_side) + $pdngs['lft'];
        $rgt = $edges['rgt'] * ($this->rgon_side + $this->mete_side) + $this->rgon_side - 1 - $pdngs['rgt'];
        $btm = $edges['btm'] * ($this->rgon_side + $this->mete_side) + $this->rgon_side - 1 - $pdngs['btm'];

        for($v = $top; $v <= $btm; $v ++){
            for($n = $lft; $n <= $rgt; $n ++){
                if($this->_sect_tiles["${v}_${n}"]['type'] != $this->_type_gate){
                    $this->_sect_tiles["${v}_${n}"]['type'] = $this->_type_room;
                    $this->_sect_tiles["${v}_${n}"]['room'] = $coord;
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
    private function _tryExtendRoomOut($edges, &$edges_cands)
    {
        $room_ver   = $edges['btm'] - $edges['top'] + 1;
        $room_nex   = $edges['rgt'] - $edges['lft'] + 1;
        $room_area  = $room_ver * $room_nex;
        $aim_coords = array();
        $aim_params = array(
            'top' => array('edge' => ($edge = $edges['top'] - 1), 'coord' => "${edge}_%s", 'from' => $edges['lft'], 'to' => $edges['rgt']),
            'rgt' => array('edge' => ($edge = $edges['rgt'] + 1), 'coord' => "%s_${edge}", 'from' => $edges['top'], 'to' => $edges['btm']),
            'btm' => array('edge' => ($edge = $edges['btm'] + 1), 'coord' => "${edge}_%s", 'from' => $edges['lft'], 'to' => $edges['rgt']),
            'lft' => array('edge' => ($edge = $edges['lft'] - 1), 'coord' => "%s_${edge}", 'from' => $edges['top'], 'to' => $edges['btm'])
        );

        foreach($aim_params as $aim => $param){
            $aim_coords[$aim] = array('edge' => $param['edge'], 'coords' => array());
            for($var = $param['from']; $var <= $param['to']; $var ++){
                $coord = sprintf($param['coord'], $var);
                if(! isset($this->_rgon_tiles[$coord])){
                    unset($aim_coords[$aim]);
                    break;
                }

                if($this->_rgon_tiles[$coord]['type'] == $this->_type_room){
                    unset($aim_coords[$aim]);
                    break;
                }

                switch($aim){
                    case 'top': case 'btm': $side = $room_ver + 1; break;
                    case 'rgt': case 'lft': $side = $room_nex + 1;
                }
                if($side > $this->room_side_max){
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
    private function _specifyStartGate()
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

        return array_rand($gate_cands);
    }


    /**
     * 連結先接点の座標の取得
     *
     * @param   string  $strt_coord 連結元座標
     * @return  string              座標
     */
    private function _specifyTargetGate($strt_coord)
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
            $gate_cands = $this->_gate_chain[$strt_room['chain']];
            unset($gate_cands[$coord]);
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
    private function _tieGate($strt_gate_coord, $trgt_gate_coord)
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
            $pres_rgon  = $this->_rgon_tiles[$pres_coord];
            $prev_rgon  = $this->_rgon_tiles[$prev_coord];
            switch($pres_rgon['type']){
                case $this->_type_room:
                    $pres_room_coord = $this->_rgon_tiles[$pres_coord]['room'];
                    $pres_chain_id   = $this->_room_tiles[$pres_room_coord]['chain'];
                    switch($prev_rgon['type']){
                        case $this->_type_room:
                            if($pres_rgon['room'] != $prev_rgon['room']){
                                $agst_aim = $this->_getAgainstAim($prev_aim);
                                $prev_gate_coord = "${prev_coord}_${prev_aim}";
                                $pres_gate_coord = "${pres_coord}_${agst_aim}";
                                if(! isset($this->_gate_tiles[$prev_gate_coord])){ $this->_setGate($prev_coord, $prev_aim); }
                                if(! isset($this->_gate_tiles[$pres_gate_coord])){ $this->_setGate($pres_coord, $agst_aim); }
                                $this->_tieSect(
                                    $this->_gate_tiles[$prev_gate_coord]['vang'],
                                    $this->_gate_tiles[$pres_gate_coord]['vang']
                                );
                                if((count($this->_room_chain) == 1) || ($pres_chain_id != $strt_chain_id)){
                                    $trgt_chain_id   = $pres_chain_id;
                                    $trgt_gate_coord = $pres_gate_coord;
                                    break 3;
                                }
                                unset($this->_gate_untie[$pres_gate_coord]);
                            }
                            break;
                        case $this->_type_road:
                            $agst_aim = $this->_getAgainstAim($prev_aim);
                            $pres_gate_coord = "${pres_coord}_${agst_aim}";
                            if(! isset($this->_gate_tiles[$pres_gate_coord])){
                                $this->_setGate($pres_coord, $agst_aim);
                            }
                            $this->_specifyRoadGate($prev_coord, $prev_aim);
                            $this->_tieSect(
                                $this->_road_tiles[$prev_coord]['vangs'][$prev_aim],
                                $this->_gate_tiles[$pres_gate_coord]['vang']
                            );
                            if(count($this->_room_chain) == 1){
                                $trgt_chain_id   = $strt_chain_id;
                                $trgt_gate_coord = $pres_gate_coord;
                                break 3;
                            }
                            if((count($this->_room_chain) == 1) || ($pres_chain_id != $strt_chain_id)){
                                $trgt_chain_id   = $pres_chain_id;
                                $trgt_gate_coord = $pres_gate_coord;
                                break 3;
                            }
                    }
                    break;
                case $this->_type_wall:
                    $this->_rgon_tiles[$pres_coord]['type'] = $this->_type_road;
                    $this->_road_tiles[$pres_coord] = array(
                        'rooms' => array($strt_room_coord => true),
                        'gates' => array(),
                        'vangs' => array()
                    );
                case $this->_type_road:
                    $agst_aim = $this->_getAgainstAim($prev_aim);
                    $this->_road_tiles[$pres_coord]['rooms'][$strt_room_coord] = true;
                    $this->_specifyRoadGate($pres_coord, $agst_aim);
                    switch($prev_rgon['type']){
                        case $this->_type_room:
                            $prev_gate_coord = "${prev_coord}_${prev_aim}";
                            if(! isset($this->_gate_tiles[$prev_gate_coord])){
                                $this->_setGate($prev_coord, $prev_aim);
                            }
                            $this->_tieSect(
                                $this->_gate_tiles[$prev_gate_coord]['vang'],
                                $this->_road_tiles[$pres_coord]['vangs'][$agst_aim]
                            );
                            break;
                        case $this->_type_road:
                            $this->_specifyRoadGate($prev_coord, $prev_aim);
                            $this->_tieSect(
                                $this->_road_tiles[$prev_coord]['vangs'][$prev_aim],
                                $this->_road_tiles[$pres_coord]['vangs'][$agst_aim]
                            );
                    }

                    if(count($this->_room_chain) == 1){
                        if(count($this->_road_tiles[$pres_coord]['gates']) >= 2){
                            $trgt_gate_coord = null;
                            $trgt_chain_id   = $strt_chain_id;
                            break 2;
                        }
                    }
                    foreach($this->_road_tiles[$pres_coord]['rooms'] as $room_coord => $true){
                        $pres_chain_id = $this->_room_tiles[$room_coord]['chain'];
                        if($pres_chain_id != $strt_chain_id){
                            $trgt_gate_coord = null;
                            $trgt_chain_id   = $pres_chain_id;
                            break 3;
                        }
                    }
            }

            $next_cands = array();
            $range_min = null;
            foreach($this->_getAims() as $aim){
                $coord = $this->_getCoord($pres_coord, $aim);
                if(! isset($this->_rgon_tiles[$coord])){
                    continue;
                }
                if($coord == $prev_coord){
                    continue;
                }
                list($ver, $nex) = explode('_', $coord);
                $range = abs($trgt_ver - $ver) + abs($trgt_nex - $nex);
                if((! isset($range_min)) || ($range < $range_min)){
                    $next_cands = array($aim => $coord);
                    $range_min = $range;
                }
                elseif($range == $range_min){
                    $next_cands[$aim] = $coord;
                }
            }

            $prev_aim = array_rand($next_cands);
            $prev_coord = $pres_coord;
        }

        $this->_mergeChain($strt_chain_id, $trgt_chain_id);

        unset($this->_gate_untie[$strt_gate_coord]);
        if($trgt_gate_coord){
            unset($this->_gate_untie[$trgt_gate_coord]);
        }
    }


    /**
     * 区画の連結
     *
     * @param   string  $strt_coord 連結元区画座標
     * @param   string  $trgt_coord 連結先区画座標
     */
    private function _tieSect($strt_coord, $trgt_coord)
    {
        list($trgt_ver, $trgt_nex) = explode('_', $trgt_coord);
        $prev_coord = null;
        $pres_coord = $strt_coord;

        for($i = 0; $i < 30; $i ++){
            if($pres_coord == $trgt_coord){
                return;
            }

            $next_cands = array();
            $range_min = null;
            $zhou_coords = $this->_getEnableAdvanceAims($pres_coord);
            foreach($zhou_coords as $aim => $coord){
                if($coord == $prev_coord){
                    continue;
                }
                list($ver, $nex) = explode('_', $coord);
                $range = abs($trgt_ver - $ver) + abs($trgt_nex - $nex);
                if((! isset($range_min)) || ($range < $range_min)){
                    $next_cands = array($aim => $coord);
                    $range_min = $range;
                }
                elseif($range == $range_min){
                    $next_cands[$aim] = $coord;
                }
            }
            $prev_coord = $pres_coord;




            if(empty($next_cands)){
                $this->er = true;
                vd($zhou_coords);
                return;
            }




            $pres_coord = $next_cands[array_rand($next_cands)];
            $this->_sect_tiles[$pres_coord]['type'] = $this->_type_road;
        }
    }


    /**
     * 通路の舗装
     *
     * @param   string  $coord  通路集合データ座標
     */
    private function _paveRoad($coord)
    {
        $road = $this->_road_tiles[$coord];
        if(count($road['gates']) == 2){
            $gate_aims = array_keys($road['gates']);
            $this->_tieSect(
                $road['gates'][$gate_aims[0]],
                $road['gates'][$gate_aims[1]]
            );
            if(isset($this->er)){
                $this->_log .="
                    <div style='border: solid 2px #FF0000; color: FF88AA;'>
                        [" . $road['gates'][$gate_aims[0]] . "]
                        [" . $road['gates'][$gate_aims[1]] . "]
                    </div>
                ";
                unset($this->er);
            }
            return;
        }

        $veres = array();
        $nexes = array();
        foreach($road['gates'] as $aim => $coord){
            list($ver, $nex) = explode('_', $coord);
            switch($aim){
                case 'top': case 'btm': $nexes[] = $nex; break;
                case 'rgt': case 'lft': $veres[] = $ver;
            }
        }

        $intr_ver = rand(min($veres), max($veres));
        $intr_nex = rand(min($nexes), max($nexes));
        $intr_coord = "${intr_ver}_${intr_nex}";
        $this->_sect_tiles[$intr_coord]['type'] = $this->_type_road;

        foreach($road['gates'] as $aim => $coord){
            $this->_tieSect($intr_coord, $coord);
            if(isset($this->er)){
                $this->_log .="
                    <div style='border: solid 2px #FF0000; color: FF88AA;'>
                        [${intr_coord}]
                        [${coord}]
                    </div>
                ";
                unset($this->er);
            }
        }
        
        
        
        
        
        
        
        /*$road = $this->_road_tiles[$coord];
        $gates = $road['gates'];
        switch(count($gates)){
            case 2:
                $gate_aims = array_keys($road['gates']);
                $this->_tieSect($gates[$gate_aims[0]], $gates[$gate_aims[1]]);
                if(isset($this->er)){
                    $this->_log .= "<div style='border: solid 2px #FF0000; color: FF88AA;'>[" . $gates[$gate_aims[0]] . "][" . $gates[$gate_aims[1]] . "]</div>";
                    unset($this->er);
                }
                break;
            case 3:
            case 4:
                $veres = array();
                $nexes = array();
                foreach($road['gates'] as $aim => $coord){
                    list($ver, $nex) = explode('_', $coord);
                    switch($aim){
                        case 'top': case 'btm': $nexes[] = $nex; break;
                        case 'rgt': case 'lft': $veres[] = $ver;
                    }
                }
                $aim_pairs = array(
                    'ver' => array('from' => min($veres), 'to' => max($veres)),
                    'nex' => array('from' => min($nexes), 'to' => max($nexes))
                );

                $perforate_cands = array();
                if(count($veres) == 2){ $perforate_cands['ver'] = true; }
                if(count($nexes) == 2){ $perforate_cands['nex'] = true; }
                $perforate = array_rand($perforate_cands);

                switch($perforate){
                    case 'ver':
                        $intrsect_ver_from = rand(
                            ($aim_pairs['nex']['from']
                        );
                }
        }*/
    }


    /**
     * 連結データの統合
     *
     * @param   int $strt_chain_id  連鎖元データID
     * @param   int $trgt_chain_id  連鎖先データID
     */
    private function _mergeChain($strt_chain_id, $trgt_chain_id)
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
    private function _specifyGateCount($room_coord)
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
    private function _calcGateRelation($pres_coord, $trgt_coord)
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
     * 指定通路の指定方向への接点の設定
     *
     * @param   string  $road_coord 指定通路座標
     * @param   string  $aim        指定方向
     */
    private function _specifyRoadGate($road_coord, $aim)
    {
        list($road_ver, $road_nex) = explode('_', $road_coord);
        $side = $this->rgon_side + $this->mete_side;
        switch($aim){
            case 'top':
                $ver = $road_ver * $side;
                $nex_from = $road_nex * $side + 1;
                $nex_to   = $nex_from + $this->rgon_side - 3;
                $nex = rand($nex_from, $nex_to);
                list($ver_from, $ver_to) = array($ver, $ver);
                break;
            case 'rgt':
                $ver_from = $road_ver * $side + 1;
                $ver_to   = $ver_from + $this->rgon_side - 3;
                $ver = rand($ver_from, $ver_to);
                $nex = $road_nex * $side + $this->rgon_side - 1;
                list($nex_from, $nex_to) = array($nex, $nex);
                break;
            case 'btm':
                $ver = $road_ver * $side + $this->rgon_side - 1;
                $nex_from = $road_nex * $side + 1;
                $nex_to   = $nex_from + $this->rgon_side - 3;
                $nex = rand($nex_from, $nex_to);
                list($ver_from, $ver_to) = array($ver, $ver);
                break;
            case 'lft':
                $ver_from = $road_ver * $side + 1;
                $ver_to   = $ver_from + $this->rgon_side - 3;
                $ver = rand($ver_from, $ver_to);
                $nex = $road_nex * $side;
                list($nex_from, $nex_to) = array($nex, $nex);
        }

        $root_cand_coord = "${ver}_${nex}";
        $vang_cand_coord = $this->_getCoord($root_cand_coord, $aim);
        if(($this->rgon_side >= 5) && (rand(0, 1) == 1)){
            $root_coord = $root_cand_coord;
            $agen_coord = $vang_cand_coord;
            $vang_coord = $this->_getCoord($vang_cand_coord, $aim);
        }
        else{
            $root_coord = $this->_getCoord($root_cand_coord, $this->_getAgainstAim($aim));
            $agen_coord = $root_cand_coord;
            $vang_coord = $vang_cand_coord;
        }
        $this->_sect_tiles[$root_coord]['type'] = $this->_type_road;
        $this->_sect_tiles[$agen_coord]['type'] = $this->_type_road;
        $this->_sect_tiles[$vang_coord]['type'] = $this->_type_road;
        $this->_road_tiles[$road_coord]['gates'][$aim] = $root_coord;
        $this->_road_tiles[$road_coord]['vangs'][$aim] = $vang_coord;
    }


    /**
     * 指定座標からの指定方向・指定距離先の座標の取得
     *
     * @param   string  $coord  指定座標
     * @param   string  $aim    方向
     * @param   string  $range  距離
     * @return  string          座標
     */
    private function _getCoord($coord, $aim, $range = 1)
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
    private function _getAims($rand = false)
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
    private function _getAgainstAim($aim)
    {
        switch($aim){
            case 'top': return 'btm'; break;
            case 'rgt': return 'lft'; break;
            case 'btm': return 'top'; break;
            case 'lft': return 'rgt';
        }
    }


    /**
     * 指定座標の周囲にあり進行可能な方向・座標群の取得
     *
     * @param   string  $coord  指定座標
     * @param   string  $type   (管区) | (区画)
     * @return  array
     */
    private function _getEnableAdvanceAims($coord, $type = 'sect')
    {
        $enable_aims = array();
        //$this->_log .= '{{{';

        switch($type){
            case 'rgon': $tiles = $this->_rgon_tiles; break;
            case 'sect': $tiles = $this->_sect_tiles;
        }

        list($ver, $nex) = explode('_', $coord);
        $aims = $this->_getAims();
        foreach($aims as $aim){
            $trgt_coord = $this->_getCoord($coord, $aim);
            if(! isset($tiles[$trgt_coord])){
                continue;
            }

            $conds = '';
            foreach($aims as $n => $adjacent_aim){
                $slanting_aim = ($n == 3) ? $aims[0] : $aims[$n + 1];
                $adjacent_coord = $this->_getCoord($trgt_coord, $adjacent_aim);
                $slanting_coord = $this->_getCoord($adjacent_coord, $slanting_aim);
                if(isset($tiles[$adjacent_coord])){
                    switch($tiles[$adjacent_coord]['type']){
                        case $this->_type_room:
                        case $this->_type_gate:
                        case $this->_type_road:
                            $conds .= 1;
                            break;
                        default:
                            $conds .= 0;
                    }
                }
                else{
                    $conds .= 0;
                }

                if(isset($tiles[$slanting_coord])){
                    switch($tiles[$slanting_coord]['type']){
                        case $this->_type_room:
                        case $this->_type_gate:
                        case $this->_type_road:
                            $conds .= 2;
                            break;
                        default:
                            $conds .= 0;
                    }
                }
                else{
                    $conds .= 0;
                }
            }

            //$this->_log .= "${trgt_coord}(${conds})";
            if(! preg_match('/(^1.*12$|^12.*1$|121)/', $conds)){
                $enable_aims[$aim] = $trgt_coord;
            }
        }
        //$this->_log .= '----' . implode('|', $enable_aims) . '}}}<br />';

        return $enable_aims;
    }




    /* 検証処理用機能群 ----------------------------------------------------------------------------------------------------*/

    private $_log = ''; // 検証ログ


    /**
     * 検証出力
     *
     */
    public function dump()
    {
        $sect_html = '<div class="s"></div>';

        $sect_nex  = ($this->rgon_side * $this->rgon_nex) + (($this->rgon_nex - 1) * $this->mete_side);
        $rgon_unit = $this->rgon_side + $this->mete_side;
        for($i = 0; $i < $sect_nex; $i ++){
            $sect_html .= '<div class="s">' . $i . '</div>';
        }
        $sect_html .= '<div class="c"></div>';

        foreach($this->_sect_tiles as $coord => $sect){
            list($v, $n) = explode('_', $coord);
            if($n == 0){
                $sect_html .= '<div class="s">' . $v . '</div>';
            }

            switch($sect['type']){
                case $this->_type_wall:
                    $is_room_area_ver = ($v % $rgon_unit) < $this->rgon_side;
                    $is_room_area_nex = ($n % $rgon_unit) < $this->rgon_side;
                    $cond = ($is_room_area_ver && $is_room_area_nex) ? $sect['type'] : '1';
                    break;
                case $this->_type_gate:
                    $cond = $sect['type'];
                    $aims = array(
                        'top' => '1000',
                        'rgt' => '0100',
                        'btm' => '0010',
                        'lft' => '0001'
                    );
                    foreach($aims as $aim => $plus_cond){
                        $target_coord = $this->_getCoord($coord, $aim);
                        if(isset($this->_sect_tiles[$target_coord]) && $this->_sect_tiles[$target_coord]['type'] == $this->_type_road){
                            $cond .= $plus_cond;
                            break;
                        }
                    }
                    break;
                case $this->_type_room:
                case $this->_type_road:
                    $cond = $sect['type'];
                    $aims = array('top', 'rgt', 'btm', 'lft');
                    foreach($aims as $aim){
                        $target_coord = $this->_getCoord($coord, $aim);
                        if(! isset($this->_sect_tiles[$target_coord])){
                            $cond .= 0;
                            continue;
                        }
                        switch($this->_sect_tiles[$target_coord]['type']){
                            case $this->_type_wall: $cond .= 0; break;
                            case $this->_type_room: $cond .= 1; break;
                            case $this->_type_gate: $cond .= 1; break;
                            case $this->_type_road: $cond .= 1;
                        }
                    }
            }

            $sect_html .= '<div class="s s' . $cond . '">' . '</div>';
            if(($n + 1) % ($sect_nex) == 0){
                $sect_html .= '<div class="s sxxxxo">' . $v . '</div><div class="c"></div>';
            }
        }

        $sect_html .= '<div class="s"></div>';
        for($i = 0; $i < $sect_nex; $i ++){
            $sect_html .= '<div class="s sxoxxx">' . $i . '</div>';
        }
        $sect_html .= '<div class="s sxxxxx"></div><div class="c"></div>';

        return $sect_html . "\n" . preg_replace('/(<br \/>)+/', '<br />', $this->_log);
    }


    /**
     * リクエスト値の
     *
     */
    public function convertParams()
    {
        $params  = array();
        $request = $_POST;
        $needs   = array(
            'rgon_ver'       => 3,
            'rgon_nex'       => 3,
            'rgon_side'      => 5,
            'mete_side'      => 3,
            'room_count'     => 3,
            'room_side_max'  => 2,
            'room_pdng_min'  => 0,
            'room_pdng_max'  => 2,
            'room_area_disp' => array(
                1 => 8,
                2 => 2
            )
        );

        foreach($needs as $name => $default){
            if(! isset($request[$name])){
                $params[$name] = $default;
                continue;
            }

            $value = $request[$name];
            switch($name){
                case 'rgon_ver':
                case 'rgon_nex':
                    $value = (int)$value;
                    if($value < 2){ $value = 2; }
                    if($value > 4){ $value = 4; }
                    break;
                case 'rgon_side':
                    $value = (int)$value;
                    if($value < 2){ $value = 2; }
                    if($value > 9){ $value = 9; }
                    break;
                case 'mete_side':
                    $value = (int)$value;
                    if($value < 2){ $value = 2; }
                    if($value > 4){ $value = 4; }
                    break;
                case 'room_count':
                    $value = (int)$value;
                    $max_count = floor($params['rgon_ver'] * $params['rgon_nex'] / 2);
                    if($value > $max_count){ $value = $max_count; }
                    if($value < 2)         { $value = 2; }
                    break;
                case 'room_side_max':
                    $value = (int)$value;
                    $max_side = min(array($params['rgon_ver'], $params['rgon_nex']));
                    if($value > $max_side){ $value = $max_side; }
                    if($value < 1)        { $value = 1; }
                    break;
                case 'room_pdng_min':
                case 'room_pdng_max':
                    $value = (int)$value;
                    $max_pdng = floor(($params['rgon_side'] - 3) / 2);
                    if($value > $max_pdng){ $value = $max_pdng; }
                    if($value < 0)        { $value = 0; }
                    break;
                    $value = (int)$value;
                    $max_pdng = floor(($params['rgon_side'] - 3) / 2);
                    if($value > $max_pdng){ $value = $max_pdng; }
                    if($value < 0)        { $value = 0; }
                    break;
                case 'room_area_disp':
                    $value = explode(',', preg_replace('/ /', '', $value));
                    foreach($value as $n => $case){
                        unset($value[$n]);
                        $is_valid = false;

                        $case = explode(':', $case);
                        if(is_array($case)){
                            if(count($case) == 2){
                                list($area, $disp) = $case;
                            }
                        }
                    }
                    $value = array(
                        1 => 8,
                        2 => 2
                    );
            }

            $params[$name] = $value;
        }

        return $params;
    }
}




$labyrinth = new Labyrinth();
$labyrinth->init($labyrinth->convertParams());
/*$labyrinth->init(array(
    'rgon_ver'       => 3,
    'rgon_nex'       => 3,
    'rgon_side'      => 5,
    'mete_side'      => 3,
    'room_count'     => 3,
    'room_side_max'  => 2,
    'room_area_disp' => array(
        1 => 8,
        2 => 2
    )
));*/
$labyrinth->build();
echo $labyrinth->dump();
