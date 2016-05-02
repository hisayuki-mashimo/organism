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




    /* 内部処理用変数群 ----------------------------------------------------------------------------------------------------*/

    private $_sect_mass = array();  // 区画集合データ
    private $_rgon_mass = array();  // 管区集合データ
    private $_room_mass = array();  // 部屋集合データ
    private $_gate_mass = array();  // 接点集合データ
    private $_room_chan = array();  // 部屋連鎖データ
    private $_gate_chan = array();  // 接点連鎖データ
    private $_type_wall = 0;        // タイプ: 壁面
    private $_type_mete = 1;        // タイプ: 境界
    private $_type_room = 2;        // タイプ: 部屋
    private $_type_gate = 3;        // タイプ: 接点
    private $_type_road = 4;        // タイプ: 通路
    private $_log       = '';       // 検証ログ




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

        $this->room_side_max  = (isset($params['room_side_max']))  ? (int)$params['room_side_max']  : 1;
        $this->room_area_disp = (isset($params['room_area_disp'])) ? (array)$params['room_area_disp'] : array(1 => 1);
        if(! isset($this->room_area_disp[1])){ $this->room_area_disp[1] = 1; }
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
                $this->_rgon_mass["${v}_${n}"] = array('type' => $this->_type_wall);
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
                $this->_sect_mass["${v}_${n}"] = array();

                if($is_room_area_ver && $is_room_area_nex){
                    $this->_sect_mass["${v}_${n}"]['type'] = $this->_type_wall;
                }
                else{
                    $this->_sect_mass["${v}_${n}"]['type'] = $this->_type_mete;
                }
            }
        }

        // 部屋の構築
        $room_cands = $this->_rgon_mass;
        for($chan_id = 0; $chan_id < $this->room_count; $chan_id ++){
            $coord = array_rand($room_cands);
            unset($room_cands[$coord]);
            list($ver, $nex) = explode('_', $coord);
            $this->_rgon_mass[$coord]['type'] = $this->_type_room;
            $this->_rgon_mass[$coord]['room'] = $coord;
            $this->_room_mass[$coord] = array('chan' => $chan_id, 'edge' => array('top' => $ver, 'rgt' => $nex, 'btm' => $ver, 'lft' => $nex));
            $this->_room_chan[$chan_id] = array();
            $this->_gate_chan[$chan_id] = array();
        }

        // 部屋の拡張
        foreach($this->_room_mass as $coord => $param){
            $this->_extendRoom($coord);
            $this->_setGates($coord);
            $this->_reflectRoom($coord);
        }

        // 接点の連結
        for($i = 0; $i < count($this->_gate_mass); $i ++){
            $gate_from = $this->_specifyStartGate();
            $gate_to   = $this->_specifyTargetGate($gate_from);
            $this->_tieGate($gate_from, $gate_to);
            if(count($this->_gate_mass) == 0){
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
        foreach($this->_sect_mass as $coord => $sect){
            list($v, $n) = explode('_', $coord);
            $sect_str .= $sect['type'];
            if(($n + 1) % ($sect_nex) == 0){
                $sect_str .= "\n";
            }
        }

        return $sect_str;
    }


    /**
     * 検証出力
     *
     */
    public function dump()
    {
        $sect_html = '<div class="section"></div>';

        $sect_nex = ($this->rgon_side * $this->rgon_nex) + (($this->rgon_nex - 1) * $this->mete_side);
        for($i = 0; $i < $sect_nex; $i ++){
            $sect_html .= '<div class="section">' . $i . '</div>';
        }
        $sect_html .= '<div class="clear"></div>';

        foreach($this->_sect_mass as $coord => $sect){
            list($v, $n) = explode('_', $coord);
            if($n == 0){
                $sect_html .= '<div class="section">' . $v . '</div>';
            }
            $sect_html .= '<div class="section sect_' . $sect['type'] . '"></div>';
            if(($n + 1) % ($sect_nex) == 0){
                $sect_html .= '<div class="clear"></div>';
            }
        }

        return $sect_html . "\n" . $this->_log;
    }




    /* 内部処理用関数群 ----------------------------------------------------------------------------------------------------*/

    /**
     * 部屋の拡張
     *
     * @param   int $coord  部屋集合データ座標
     */
    private function _extendRoom($coord)
    {
        $extend_cands = array(1 => array(0 => $this->_room_mass[$coord]['edge']));
        $this->_tryExtendRoom($this->_room_mass[$coord]['edge'], $extend_cands);

        $area_probs = array();
        foreach($extend_cands as $area => $extend){
            for($i = 0; $i < $this->room_area_disp[$area]; $i ++){
                $area_probs[] = $area;
            }
        }

        $area  = $area_probs[array_rand($area_probs)];
        $edges = $extend_cands[$area][array_rand($extend_cands[$area])];
        $this->_room_mass[$coord]['edge'] = $edges;

        for($v = $edges['top']; $v <= $edges['btm']; $v ++){
            for($n = $edges['lft']; $n <= $edges['rgt']; $n ++){
                $this->_rgon_mass["${v}_${n}"]['type'] = $this->_type_room;
                $this->_rgon_mass["${v}_${n}"]['room'] = $coord;
            }
        }
    }


    /**
     * 接点の構築
     *
     * @param   int $room_coord 部屋集合データ座標
     */
    private function _setGates($room_coord)
    {
        // 接点候補の設定準備
        $edges = $this->_room_mass[$room_coord]['edge'];
        $gate_coords = array();
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
                if(isset($this->_rgon_mass[$this->_getTargetCoord($rgon_coord, $aim)])){
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
                $coord = $this->_initGate($room_coord, sprintf($rgon_coord, $var), $aim);
                $gate_coords[$coord] = true;
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
        $edges = $this->_room_mass[$coord]['edge'];
        $top = $edges['top'] * ($this->rgon_side + $this->mete_side);
        $lft = $edges['lft'] * ($this->rgon_side + $this->mete_side);
        $rgt = $edges['rgt'] * ($this->rgon_side + $this->mete_side) + $this->rgon_side - 1;
        $btm = $edges['btm'] * ($this->rgon_side + $this->mete_side) + $this->rgon_side - 1;

        for($v = $top; $v <= $btm; $v ++){
            for($n = $lft; $n <= $rgt; $n ++){
                $this->_sect_mass["${v}_${n}"]['type'] = $this->_type_room;
                $this->_sect_mass["${v}_${n}"]['room'] = $coord;
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
    private function _tryExtendRoom($edges, &$edges_cands)
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
                if(! isset($this->_rgon_mass[$coord])){
                    unset($aim_coords[$aim]);
                    break;
                }

                if($this->_rgon_mass[$coord]['type'] == $this->_type_room){
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
        $side = $this->rgon_side + $this->mete_side;
        $rgon_cntr = floor($this->rgon_side / 2);
        switch($aim){
            case 'top':
                $gate_coord = (($side * $ver) - 2) . '_' . (($side * $nex) + $rgon_cntr);
                $adhs_coord = (($side * $ver) - 1) . '_' . (($side * $nex) + $rgon_cntr);
                break;
            case 'rgt':
                $gate_coord = (($side * $ver) + $rgon_cntr) . '_' . (($side * $nex) + $this->rgon_side + 1);
                $adhs_coord = (($side * $ver) + $rgon_cntr) . '_' . (($side * $nex) + $this->rgon_side);
                break;
            case 'btm':
                $gate_coord = (($side * $ver) + $this->rgon_side + 1) . '_' . (($side * $nex) + $rgon_cntr);
                $adhs_coord = (($side * $ver) + $this->rgon_side)     . '_' . (($side * $nex) + $rgon_cntr);
                break;
            case 'lft':
                $gate_coord = (($side * $ver) + $rgon_cntr) . '_' . (($side * $nex) - 2);
                $adhs_coord = (($side * $ver) + $rgon_cntr) . '_' . (($side * $nex) - 1);
        }
        if(! isset($this->_sect_mass[$gate_coord])){
            return null;
        }

        $this->_gate_mass[$gate_coord] = array('room' => $room_coord, 'aim' => $aim);
        $this->_gate_chan[$this->_room_mass[$room_coord]['chan']][$gate_coord] = true;
        $this->_sect_mass[$gate_coord]['type'] = $this->_type_gate;
        $this->_sect_mass[$gate_coord]['room'] = $room_coord;
        $this->_sect_mass[$adhs_coord]['type'] = $this->_type_road;
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
        foreach($this->_gate_mass as $coord => $param){
            $room = $this->_room_mass[$param['room']];
            $scale = count($this->_room_chan[$room['chan']]);
            if((! $scale_min) || ($scale < $scale_min)){
                $gate_cands = array();
                $scale_min = $scale;
            }
            $gate_cands[$coord] = true;
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
        $strt_chan_id = $this->_room_mass[$this->_gate_mass[$strt_coord]['room']]['chan'];
        $gate_cands = array();
        foreach($this->_gate_mass as $coord => $param){
            if($strt_chan_id != $this->_room_mass[$param['room']]['chan']){
                $gate_cands[$coord] = $param;
            }
        }
        if(empty($gate_cands)){
            $gate_cands = $this->_gate_mass;
            unset($gate_cands[$strt_coord]);
        }
        if(empty($gate_cands)){
            $gate_cands = $this->_gate_chan[$strt_chan_id];
            unset($gate_cands[$coord]);
        }

        return array_rand($gate_cands);
    }


    /**
     * 接点の連結
     *
     * @param   string  $strt_coord 連結元接点座標
     * @param   string  $trgt_coord 連結先接点座標
     */
    private function _tieGate($strt_coord, $trgt_coord)
    {
        unset($this->_gate_mass[$strt_coord]);
        unset($this->_gate_mass[$trgt_coord]);
    }


    /**
     * 対象座標からの指定方向・指定距離先の座標の取得
     *
     * @param   string  $coord  対象座標
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
            case 'lft': $nex -= $range; break;
        }

        return "${ver}_${nex}";
    }
}




$labyrinth = new Labyrinth();
$labyrinth->init(array(
    'rgon_ver'       => 6,
    'rgon_nex'       => 6,
    'rgon_side'      => 3,
    'mete_side'      => 1,
    'room_count'     => 4,
    'room_side_max'  => 3,
    'room_area_disp' => array(
        1 => 2,
        4 => 2,
        6 => 1
    )
));
$labyrinth->build();
echo $labyrinth->dump();
