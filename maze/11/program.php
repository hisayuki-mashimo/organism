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
    private $_sect_tiles = array(); // 区画集合データ
    private $_room_tiles = array(); // 部屋集合データ
    private $_room_chain = array(); // 部屋連鎖データ
    private $_gate_tiles = array(); // 接点集合データ
    private $_gate_chain = array(); // 接点連鎖データ
    private $_gate_untie = array(); // 未接続接点群
    private $_type_wall  = 0;       // タイプ: 壁面
    private $_type_mete  = 1;       // タイプ: 境界
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
        if($this->rgon_ver < 2){ $this->rgon_ver  = 2; }
        if($this->rgon_nex < 2){ $this->rgon_nex  = 2; }

        $this->rgon_side = (isset($params['rgon_side'])) ? (int)$params['rgon_side'] : 3;
        $this->mete_side = (isset($params['mete_side'])) ? (int)$params['mete_side'] : 3;
        if($this->rgon_side % 2 == 0){ $this->rgon_side += 1; }
        if($this->mete_side % 2 == 0){ $this->mete_side += 1; }
        if($this->rgon_side      < 3){ $this->rgon_side  = 3; }
        if($this->mete_side      < 1){ $this->mete_side  = 1; }

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
            $is_room_area_ver = ($v % $rgon_unit) < $this->rgon_side;

            for($n = 0; $n < $sect_nex; $n ++){
                $is_room_area_nex = ($n % $rgon_unit) < $this->rgon_side;
                $this->_sect_tiles["${v}_${n}"] = array();

                if($is_room_area_ver && $is_room_area_nex){
                    $this->_sect_tiles["${v}_${n}"]['type'] = $this->_type_wall;
                }
                else{
                    $this->_sect_tiles["${v}_${n}"]['type'] = $this->_type_mete;
                }
            }
        }

        // 部屋の定義
        $room_seeds = $this->_collectRoomSeeds();
        foreach($room_seeds as $chain_id => $coord){
            $this->_rgon_tiles[$coord]['type'] = $this->_type_room;
            $this->_rgon_tiles[$coord]['room'] = $coord;
            $this->_room_tiles[$coord] = array('chain' => $chain_id, 'rgon_edge' => array(), 'sect_pdng' => array());
            $this->_room_chain[$chain_id] = array();
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
        //for($i = 0; $i < count($this->_gate_untie); $i ++){
        for($v = 0; $v < 1; $v ++){ // 仮
            $gate_from = $this->_specifyStartGate();
            $gate_to   = $this->_specifyTargetGate($gate_from);
            $this->_tieGate($gate_from, $gate_to);
            if(count($this->_gate_untie) == 0){
                break;
            }
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
            if(($n + 1) % ($sect_nex) == 0){
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
        $rgon_tiles   = $this->_rgon_tiles;
        $room_pledges = array();

        // 一対の対角に必ず部屋を設置する。
        $rgon_corner_pairs = array(
            array('0_0', ($this->rgon_ver - 1) . '_' . ($this->rgon_nex - 1)),
            array('0_' . ($this->rgon_ver - 1), ($this->rgon_nex - 1) . '_0')
        );
        $rgon_corner_pair = $rgon_corner_pairs[array_rand($rgon_corner_pairs)];
        foreach($rgon_corner_pair as $coord){
            unset($rgon_tiles[$coord]);
            $room_pledges[] = $coord;
        }

        // 部屋の個数が3以上のとき、中心管区に必ず部屋を設置する。
        if(($this->room_count >= 3) && (($this->rgon_ver >= 3) || ($this->rgon_nex >= 3))){
            $rgon_center = (floor($this->rgon_ver / 2)) . '_' . (floor($this->rgon_nex / 2));
            unset($rgon_tiles[$rgon_center]);
            $room_pledges[] = $rgon_center;
        }

        $rgon_tiles = array_keys($rgon_tiles);
        shuffle($rgon_tiles);

        $room_seeds = array_splice($rgon_tiles, 0, ($this->room_count - count($room_pledges)));
        return array_merge($room_pledges, $room_seeds);
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
        $this->_room_tiles[$coord]['rgon_edge'] = $edges;

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
        $this->_room_tiles[$coord]['sect_pdng'] = array(
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
        $edges = $this->_room_tiles[$room_coord]['rgon_edge'];
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
                if(isset($this->_rgon_tiles[$this->_getTargetcoord($rgon_coord, $aim)])){
                    $gate_cands[$aim][$rgon_coord] = true;
                }
            }
        }

        // 接点個数の設定
        $lap = (($edges['btm'] - $edges['top'] + 1) + ($edges['rgt'] - $edges['lft'] + 1)) * 2;
        $gate_count = $lap / 2; // 暫定
        $aims = array('top', 'rgt', 'btm', 'lft');
        shuffle($aims);
        $n = 0;
        for($i = 0; $i < $gate_count; $i ++){
            for($a = 0; $a < 4; $a ++){
                $aim = $aims[$a];
                if(empty($gate_cands[$aim])){
                    continue;
                }
                $rgon_coord = array_rand($gate_cands[$aim]);
                unset($gate_cands[$aim][$rgon_coord]);
                $this->_initGate($room_coord, sprintf($rgon_coord, $var), $aim);
                $n ++;
                if($n >= $gate_count){
                    break 2;
                }
            }
        }
    }


    /**
     * 部屋連鎖データの区画集合データへの反映
     *
     * @param   int $coord  部屋集合データ座標
     */
    private function _reflectRoom($coord)
    {
        $data  = $this->_room_tiles[$coord];
        $edges = $data['rgon_edge'];
        $pdngs = $data['sect_pdng'];
        $gates = $this->_gate_chain[$data['chain']];
        $top = $edges['top'] * ($this->rgon_side + $this->mete_side) + $pdngs['top'];
        $lft = $edges['lft'] * ($this->rgon_side + $this->mete_side) + $pdngs['lft'];
        $rgt = $edges['rgt'] * ($this->rgon_side + $this->mete_side) + $this->rgon_side - 1 - $pdngs['rgt'];
        $btm = $edges['btm'] * ($this->rgon_side + $this->mete_side) + $this->rgon_side - 1 - $pdngs['btm'];

        for($v = $top; $v <= $btm; $v ++){
            for($n = $lft; $n <= $rgt; $n ++){
                if(! isset($gates["${v}_${n}"])){
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
                $this->_tryExtendRoom($pred_edges, $edges_cands);
            }
        }

        return $aim_coords;
    }


    /**
     * 管区から接点を設置して区画集合データに反映させる。
     *
     * @param   string  $room_coord 部屋集合データ座標
     * @param   string  $coord      管区の座標
     * @param   string  $aim        管区から接点を設置する方向
     */
    private function _initGate($room_coord, $coord, $aim)
    {
        list($ver, $nex) = explode('_', $coord);
        $side  = $this->rgon_side + $this->mete_side;
        $edges = $this->_room_tiles[$room_coord]['rgon_edge'];
        $pdngs = $this->_room_tiles[$room_coord]['sect_pdng'];
        switch($aim){
            case 'top': $n = ($side * $nex) + rand(($pdngs['lft'] + 1), ($this->rgon_side - $pdngs['rgt'] - 2)); $v = ($side * $ver) + $pdngs['top']; break;
            case 'lft': $v = ($side * $ver) + rand(($pdngs['top'] + 1), ($this->rgon_side - $pdngs['btm'] - 2)); $n = ($side * $nex) + $pdngs['lft']; break;
            case 'rgt': $v = ($side * $ver) + rand(($pdngs['top'] + 1), ($this->rgon_side - $pdngs['btm'] - 2)); $n = ($side * $nex) + $this->rgon_side - $pdngs['rgt'] - 1; break;
            case 'btm': $n = ($side * $nex) + rand(($pdngs['lft'] + 1), ($this->rgon_side - $pdngs['rgt'] - 2)); $v = ($side * $ver) + $this->rgon_side - $pdngs['btm'] - 1; break;
        }
        $gate_coord = "${v}_${n}";
        $agen_coord = $this->_getTargetCoord($gate_coord, $aim, 1);
        $vang_coord = $this->_getTargetCoord($gate_coord, $aim, 2);

        $this->_gate_tiles[$gate_coord] = array('room' => $room_coord, 'aim' => $aim);
        $this->_gate_untie[$gate_coord] = true;
        $this->_gate_chain[$this->_room_tiles[$room_coord]['chain']][$gate_coord] = true;
        $this->_sect_tiles[$gate_coord]['type'] = $this->_type_gate;
        $this->_sect_tiles[$agen_coord]['type'] = $this->_type_road;
        $this->_sect_tiles[$vang_coord]['type'] = $this->_type_road;
        $this->_sect_tiles[$gate_coord]['room'] = $room_coord;
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
        $strt_gate = $this->_gate_tiles[$strt_coord];
        $strt_room = $this->_room_tiles[$strt_gate['room']];
        $gate_cands = array();
        foreach($this->_gate_untie as $coord => $true){
            $gate = $this->_gate_tiles[$coord];
            if($strt_room['chain'] != $this->_room_tiles[$gate['room']]['chain']){
                $gate_cands[$coord] = true;
            }
        }
        if(empty($gate_cands)){
            $gate_cands = $this->_gate_untie;
            unset($gate_cands[$strt_coord]);
        }
        if(empty($gate_cands)){
            $gate_cands = $this->_gate_chain[$strt_room['chain']];
            unset($gate_cands[$coord]);
        }

        //$this->_log .= '<br />=================<br />連結元接点座標[' . $strt_coord . ']<br />';
        //$this->_log .= '<hr / >[' . implode('][', array_keys($gate_cands)) . ']';
        $gate_cands_class = array();
        foreach($gate_cands as $coord => $value){
            switch($strt_gate['aim']){
                case 'top': $frt = 'top'; $rgt = 'rgt'; $lft = 'lft'; $bck = 'btm'; break;
                case 'rgt': $frt = 'rgt'; $rgt = 'btm'; $lft = 'top'; $bck = 'lft'; break;
                case 'btm': $frt = 'btm'; $rgt = 'lft'; $lft = 'rgt'; $bck = 'top'; break;
                case 'lft': $frt = 'lft'; $rgt = 'top'; $lft = 'btm'; $bck = 'rgt';
            }
            $point = 1;
            if    ($this->_isExistsByAim($strt_coord, $coord, $frt)){ $point += 3; if($this->_gate_tiles[$coord]['aim'] == $bck){ $point += 3; } }
            elseif($this->_isExistsByAim($strt_coord, $coord, $rgt)){ $point += 1; if($this->_gate_tiles[$coord]['aim'] == $lft){ $point += 3; } }
            elseif($this->_isExistsByAim($strt_coord, $coord, $lft)){ $point += 1; if($this->_gate_tiles[$coord]['aim'] == $rgt){ $point += 3; } }
            if(! isset($gate_cands_class[$point])){
                $gate_cands_class[$point] = array();
            }
            $gate_cands_class[$point][] = $coord;
        }
        //$this->_log .= '<hr />[' . preg_replace("/(\r|\n| )/", '', ve($gate_cands_class, true)) . ']';

        $points_disp = array();
        foreach($gate_cands_class as $point => $coords){
            for($i = 0; $i < $point; $i ++){
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
        $this->_log .= "<br />=================<br />接続元接点座標: [${strt_gate_coord}]<br />接続先接点座標: [${trgt_gate_coord}]<br />";
        $strt_rgon_coord = $this->_getRgonCoord($strt_gate_coord);
        $trgt_rgon_coord = $this->_getRgonCoord($trgt_gate_coord);
        $strt_room_coord = $this->_gate_tiles[$strt_gate_coord]['room'];
        $trgt_room_coord = $this->_gate_tiles[$trgt_gate_coord]['room'];
        $strt_chain_id   = $this->_room_chain[$this->_room_tiles[$strt_room_coord]['chain']];
        $strt_aim = $this->_gate_tiles[$strt_gate_coord]['aim'];
        $trgt_aim = $this->_gate_tiles[$trgt_gate_coord]['aim'];

        $pres_rgon_coord = $this->_getTargetCoord($strt_rgon_coord, $this->_gate_tiles[$strt_gate_coord]['aim']);
        $trgt_rgon_coord = $this->_getTargetCoord($trgt_rgon_coord, $this->_gate_tiles[$trgt_gate_coord]['aim']);
        $this->_rgon_tiles[$pres_rgon_coord]['room'] = $strt_room_coord;
        $this->_rgon_tiles[$trgt_rgon_coord]['room'] = $trgt_room_coord;
        $prev_rgon_coord = $strt_rgon_coord;
        $roads = array($pres_rgon_coord => false);

        // 管区単位の結合
        list($trgt_ver, $trgt_nex) = explode('_', $trgt_rgon_coord);
        for($i = 0; $i < 10; $i ++){
            $next_cands = array();
            $range_min = null;
            foreach(array('top', 'rgt', 'btm', 'lft') as $aim){
                $coord = $this->_getTargetCoord($pres_rgon_coord, $aim);
                if(! isset($this->_rgon_tiles[$coord])){
                    continue;
                }
                if($coord == $prev_rgon_coord){
                    continue;
                }
                list($ver, $nex) = explode('_', $coord);
                $range = abs($trgt_ver - $ver) + abs($trgt_nex - $nex);
                if((! isset($range_min)) || ($range < $range)){
                    $next_cands = array($aim => $coord);
                    $range_min = $range;
                }
                elseif($range == $range_min){
                    $next_cands[$aim] = $coord;
                }
            }
            $aim = array_rand($next_cands);
            $next_rgon_coord = $next_cands[$aim];
            $this->_log .= "[${next_rgon_coord}]";
            $roads[$pres_rgon_coord] = $aim;
            $roads[$next_rgon_coord] = false;

            if($next_rgon_coord == $trgt_rgon_coord){
                break;
            }

            $next_room_coord = $this->_rgon_tiles[$next_rgon_coord]['room'];
            if(isset($next_room_coord)){
                if($next_room_coord != $strt_room_coord){
                    if($this->_room_tiles[$next_room_coord]['chain'] != $strt_chain_id){
                        $trgt_rgon_coord = $next_rgon_coord;
                        break;
                    }
                }
            }

            $this->_rgon_tiles[$next_rgon_coord]['room'] = $strt_room_coord;
            $prev_rgon_coord = $pres_rgon_coord;
            $pres_rgon_coord = $next_rgon_coord;
        }

        // 管区単位の結合結果から、区画単位の結合結果を導出する。
        list($strt_ver, $strt_nex) = explode('_', $this->_getTargetCoord($strt_gate_coord, $strt_aim, 2));
        list($trgt_ver, $trgt_nex) = explode('_', $this->_getTargetCoord($trgt_gate_coord, $trgt_aim, 2));
        $trgt_rgon = implode('|', (array)$this->_getRgonCoord("${trgt_ver}_${trgt_nex}"));

        $prev_goal_ver = $strt_ver;
        $prev_goal_nex = $strt_nex;
        $prev_aim = $strt_aim;
        $side = $this->rgon_side + $this->mete_side;
        foreach($roads as $coord => $pres_aim){
            $trgt_within = false;
            $this->_log .= '<br />///////////////////////////////////<br />';
            list($rgon_ver, $rgon_nex) = explode('_', $coord);
            $top_v = ($side * $rgon_ver); $top_n = ($side * $rgon_nex) + rand(0, ($this->rgon_side - 1));
            $lft_n = ($side * $rgon_nex); $lft_v = ($side * $rgon_ver) + rand(0, ($this->rgon_side - 1));
            $rgt_n = ($side * $rgon_nex) + $this->rgon_side - 1; $rgt_v = ($side * $rgon_ver) + rand(0, ($this->rgon_side - 1));
            $btm_v = ($side * $rgon_ver) + $this->rgon_side - 1; $btm_n = ($side * $rgon_nex) + rand(0, ($this->rgon_side - 1));

            switch($prev_aim){
                case 'top': $pres_strt_ver = $btm_v; $pres_strt_nex = $btm_n; break;
                case 'rgt': $pres_strt_ver = $lft_v; $pres_strt_nex = $lft_n; break;
                case 'btm': $pres_strt_ver = $top_v; $pres_strt_nex = $top_n; break;
                case 'lft': $pres_strt_ver = $rgt_v; $pres_strt_nex = $rgt_n; break;
            }
            $this->_log .= '目標: [' . $pres_strt_ver . '_' . $pres_strt_nex . ']<br />';
            $pres_ver = $prev_goal_ver;
            $pres_nex = $prev_goal_nex;
            for($j = 0; $j < 10; $j ++){
                if(! $trgt_within){
                    $pres_rgon = implode('|', (array)$this->_getRgonCoord("${pres_ver}_${pres_nex}"));
                    if($pres_rgon == $trgt_rgon){
                        $trgt_within == true;
                    }
                }
                if($trgt_within){
                    $coord_cands = array();
                    if    ($pres_ver < $trgt_ver){ $coord_cands[] = array(($pres_ver + 1), $pres_nex); }
                    elseif($pres_ver > $trgt_ver){ $coord_cands[] = array(($pres_ver - 1), $pres_nex); }
                    if    ($pres_nex < $trgt_nex){ $coord_cands[] = array($pres_ver, ($pres_nex + 1)); }
                    elseif($pres_nex > $trgt_nex){ $coord_cands[] = array($pres_ver, ($pres_nex - 1)); }
                    list($pres_ver, $pres_nex) = $coord_cands[array_rand($coord_cands)];
                    $pres_coord = "${pres_ver}_${pres_nex}";
                    $this->_sect_tiles[$pres_coord]['type'] = $this->_type_road;
                    $this->_sect_tiles[$pres_coord]['room'] = $strt_room_coord;
                    $this->_log .= "[${pres_coord}]";
                    if($pres_coord == "${trgt_ver}_${trgt_nex}"){
                        break 2;
                    }
                }
                else{
                    $coord_cands = array();
                    if    ($pres_ver < $pres_strt_ver){ $coord_cands[] = array(($pres_ver + 1), $pres_nex); }
                    elseif($pres_ver > $pres_strt_ver){ $coord_cands[] = array(($pres_ver - 1), $pres_nex); }
                    if    ($pres_nex < $pres_strt_nex){ $coord_cands[] = array($pres_ver, ($pres_nex + 1)); }
                    elseif($pres_nex > $pres_strt_nex){ $coord_cands[] = array($pres_ver, ($pres_nex - 1)); }
                    list($pres_ver, $pres_nex) = $coord_cands[array_rand($coord_cands)];
                    $pres_coord = "${pres_ver}_${pres_nex}";
                    $this->_sect_tiles[$pres_coord]['type'] = $this->_type_road;
                    $this->_sect_tiles[$pres_coord]['room'] = $strt_room_coord;
                    $this->_log .= "[${pres_coord}]";
                    if($pres_coord == "${pres_strt_ver}_${pres_strt_nex}"){
                        break;
                    }
                }
            }

            $this->_log .= '<br />-------------------------<br />';
            switch($pres_aim){
                case 'top': $pres_goal_ver = $top_v; $pres_goal_nex = $top_n; break;
                case 'rgt': $pres_goal_ver = $rgt_v; $pres_goal_nex = $rgt_n; break;
                case 'btm': $pres_goal_ver = $btm_v; $pres_goal_nex = $btm_n; break;
                case 'lft': $pres_goal_ver = $lft_v; $pres_goal_nex = $lft_n; break;
            }
            $this->_log .= '目標: [' . $pres_goal_ver . '_' . $pres_goal_nex . ']<br />';
            
            
            if(! $trgt_within){
                $pres_rgon = implode('|', (array)$this->_getRgonCoord("${pres_ver}_${pres_nex}"));
                if($pres_rgon == $trgt_rgon){
                    $trgt_within == true;
                }
            }
            if($trgt_within){
                for($j = 0; $j < 10; $j ++){
                    $coord_cands = array();
                    if    ($pres_ver < $trgt_ver){ $coord_cands[] = array(($pres_ver + 1), $pres_nex); }
                    elseif($pres_ver > $trgt_ver){ $coord_cands[] = array(($pres_ver - 1), $pres_nex); }
                    if    ($pres_nex < $trgt_nex){ $coord_cands[] = array($pres_ver, ($pres_nex + 1)); }
                    elseif($pres_nex > $trgt_nex){ $coord_cands[] = array($pres_ver, ($pres_nex - 1)); }
                    list($pres_ver, $pres_nex) = $coord_cands[array_rand($coord_cands)];
                    $pres_coord = "${pres_ver}_${pres_nex}";
                    $this->_sect_tiles[$pres_coord]['type'] = $this->_type_road;
                    $this->_sect_tiles[$pres_coord]['room'] = $strt_room_coord;
                    $this->_log .= "[${pres_coord}]";
                    if($pres_coord == "${trgt_ver}_${trgt_nex}"){
                        break 2;
                    }
                }
            }
            else{
                for($j = 0; $j < 10; $j ++){
                    $coord_cands = array();
                    if    ($pres_ver < $pres_goal_ver){ $coord_cands[] = array(($pres_ver + 1), $pres_nex); }
                    elseif($pres_ver > $pres_goal_ver){ $coord_cands[] = array(($pres_ver - 1), $pres_nex); }
                    if    ($pres_nex < $pres_goal_nex){ $coord_cands[] = array($pres_ver, ($pres_nex + 1)); }
                    elseif($pres_nex > $pres_goal_nex){ $coord_cands[] = array($pres_ver, ($pres_nex - 1)); }
                    list($pres_ver, $pres_nex) = $coord_cands[array_rand($coord_cands)];
                    $pres_coord = "${pres_ver}_${pres_nex}";
                    $this->_sect_tiles[$pres_coord]['type'] = $this->_type_road;
                    $this->_sect_tiles[$pres_coord]['room'] = $strt_room_coord;
                    $this->_log .= "[${pres_coord}]";
                    if($pres_coord == "${pres_goal_ver}_${pres_goal_nex}"){
                        break;
                    }
                }

                $prev_aim      = $pres_aim;
                $prev_goal_ver = $pres_goal_ver;
                $prev_goal_nex = $pres_goal_nex;
            }
            break; // 仮
        }

        unset($this->_gate_untie[$strt_gate_coord]);
        unset($this->_gate_untie[$trgt_gate_coord]);
    }


    /**
     * 接点の連結
     *
     * @param   string  $strt_gate_coord 連結元接点座標
     * @param   string  $trgt_gate_coord 連結先接点座標
     */
    private function _tieRgon()
    {
        
    }


    /**
     * 指定座標からの指定方向・指定距離先の座標の取得
     *
     * @param   string  $coord  指定座標
     * @param   string  $aim    方向
     * @param   string  $range  距離
     * @return  string          座標
     */
    private function _getTargetCoord($coord, $aim, $range = 1)
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
     * 指定区画座標が属する管区座標の取得
     *
     * @param   string  $coord  指定区画座標
     * @return  mixed           string  管区座標
     *                          array   隣接する管区座標群(境界上の場合)
     */
    private function _getRgonCoord($coord)
    {
        list($ver, $nex) = explode('_', $coord);
        $side = $this->rgon_side + $this->mete_side;

        $rgon_ver_pred = floor($ver / $side);
        $rgon_nex_pred = floor($nex / $side);

        $rgon_ver = (($ver % $side) >= $this->rgon_side) ? array($rgon_ver_pred, $rgon_ver_pred + 1) : array($rgon_ver_pred);
        $rgon_nex = (($nex % $side) >= $this->rgon_side) ? array($rgon_nex_pred, $rgon_nex_pred + 1) : array($rgon_nex_pred);

        $coords = array();
        foreach($rgon_ver as $v){
            foreach($rgon_nex as $n){
                $coords[] = "${v}_${n}";
            }
        }

        return (count($coords) == 1) ? $coords[0] : $coords;
    }


    /**
     * 指定座標から指定方向に対象座標が存在するかの判別
     *
     * @param   string  $coord  指定座標
     * @param   string  $coord  対象座標
     * @param   string  $aim    方向
     * @return  bool
     */
    private function _isExistsByAim($pres_coord, $trgt_coord, $aim)
    {
        list($pres_ver, $pres_nex) = explode('_', $pres_coord);
        list($trgt_ver, $trgt_nex) = explode('_', $trgt_coord);
        switch($aim){
            case 'top': return $trgt_ver < $pres_ver; break;
            case 'rgt': return $trgt_nex > $pres_nex; break;
            case 'btm': return $trgt_nex > $pres_nex; break;
            case 'lft': return $trgt_ver < $pres_ver;
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

        switch($type){
            case 'rgon': $tiles = $this->_rgon_tiles; break;
            case 'sect': $tiles = $this->_sect_tiles;
        }

        list($ver, $nex) = explode('_', $coord);
        $aims = array('top', 'rgt', 'btm', 'lft');
        foreach($aims as $aim){
            $trgt_coord = $this->_getTargetCoord($coord, $aim);
            if(! isset($tiles[$trgt_coord])){
                continue;
            }

            $conds = '';
            foreach($aims as $ambient_aim){
                $ambient_coord = $this->_getTargetCoord($trgt_coord, $ambient_aim);
                if(! isset($tiles[$ambient_coord])){
                    $conds .= 0;
                }
                else{
                    switch($tiles[$ambient_coord]['type']){
                        case $this->_type_wall:
                        case $this->_type_mete: $conds .= 0; break;
                        case $this->_type_room:
                        case $this->_type_gate:
                        case $this->_type_road: $conds .= 1;
                    }
                }
            }
            if(! preg_match('/(111|1011|1101)/', $conds)){
                $enable_aims[$aim] = $trgt_coord;
            }
        }

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

        $sect_nex = ($this->rgon_side * $this->rgon_nex) + (($this->rgon_nex - 1) * $this->mete_side);
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
                    $cond = $sect['type'];
                    break;
                case $this->_type_mete:
                    $cond = $this->_type_wall;
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
                        $target_coord = $this->_getTargetCoord($coord, $aim);
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
                        $target_coord = $this->_getTargetCoord($coord, $aim);
                        if(! isset($this->_sect_tiles[$target_coord])){
                            $cond .= 0;
                            continue;
                        }
                        switch($this->_sect_tiles[$target_coord]['type']){
                            case $this->_type_wall: $cond .= 0; break;
                            case $this->_type_mete: $cond .= 0; break;
                            case $this->_type_room: $cond .= 1; break;
                            case $this->_type_gate: $cond .= 1; break;
                            case $this->_type_road: $cond .= 1;
                        }
                    }
            }

            $sect_html .= '<div class="s s' . $cond . '">'/* . (($sect['type'] == $this->_type_gate) ? '<span class="g">◆</span>' : '')*/ . '</div>';
            if(($n + 1) % ($sect_nex) == 0){
                $sect_html .= '<div class="c"></div>';
            }
        }

        return $sect_html . "\n" . $this->_log;
    }
}




$labyrinth = new Labyrinth();
$labyrinth->init(array(
    'rgon_ver'       => 3,
    'rgon_nex'       => 3,
    'rgon_side'      => 7,
    'mete_side'      => 3,
    'room_count'     => 4,
    'room_side_max'  => 2,
    'room_area_disp' => array(
        1 => 9,
        2 => 1
    )
));
$labyrinth->build();
echo $labyrinth->dump();
