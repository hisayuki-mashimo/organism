<?php

require_once '/home/zhen-xia/public_html/sanbou/sanbou.php';

class Labyrinth
{
    /* 設定用変数群 ----------------------------------------------------------------------------------------------------*/

    public $rgon_ver      = 4;      // 管区の縦数(最小値: 2 乃至)
    public $rgon_nex      = 4;      // 管区の横数(最小値: 2)
    public $rgon_side     = 5;      // 管区の一辺(最小値: 3)
    public $mete_side     = 3;      // 境界の幅(最小値: 3)
    public $room_count    = 2;      // 部屋の数(最小値: 2 乃至 その他の設定値による制約された値)
    public $room_area_max = 3;      // 部屋が連鎖できる最大値(最小値: 1 乃至 その他の設定値による制約された値)


    /* 内部処理用変数群 ----------------------------------------------------------------------------------------------------*/

    private $_sect_mass  = array(); // 区画集合データ
    private $_rgon_mass  = array(); // 管区集合データ
    private $_room_chain = array(); // 部屋連鎖データ
    private $_gate_chain = array(); // 接点連鎖データ
    private $_type_wall  = 0;       // タイプ: 壁面
    private $_type_mete  = 1;       // タイプ: 境界
    private $_type_room  = 2;       // タイプ: 部屋
    private $_type_gate  = 3;       // タイプ: 接点
    private $_type_road  = 4;       // タイプ: 通路
    private $_log        = '';      // 検証ログ




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
        if(isset($params['rgon_ver']))      { $this->rgon_ver      = $params['rgon_ver']; }
        if(isset($params['rgon_nex']))      { $this->rgon_nex      = $params['rgon_nex']; }
        if(isset($params['rgon_side']))     { $this->rgon_side     = $params['rgon_side']; }
        if(isset($params['mete_side']))     { $this->mete_side     = $params['mete_side']; }
        if(isset($params['room_count']))    { $this->room_count    = $params['room_count']; }
        if(isset($params['room_area_max'])) { $this->room_area_max = $params['room_area_max']; }
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
        $room_cands = array_keys($this->_rgon_mass);
        shuffle($room_cands);
        for($chain_id = 0; $chain_id < $this->room_count; $chain_id ++){
            $room_coord = array_shift($room_cands);
            list($ver, $nex) = explode('_', $room_coord);
            $this->_rgon_mass[$room_coord]['type'] = $this->_type_room;
            $this->_rgon_mass[$room_coord]['room'] = $chain_id;
            $this->_room_chain[$chain_id] = array('top' => $ver, 'rgt' => $nex, 'btm' => $ver, 'lft' => $nex);
            $this->_gate_chain[$chain_id] = array();
        }

        // 部屋の拡張
        foreach($this->_room_chain as $id => $coord_data){
            $this->_extendRoom($id);
            $this->_setGates($id);
            $this->_reflectRoom($id);
        }
    }


    /**
     * 出力
     *
     */
    public function export()
    {
        /*foreach(){
            
        }*/
    }


    /**
     * 検証出力
     *
     */
    public function dump()
    {
        $style_html = '
            <style type="text/css">
                *{
                    color: #FFFFFF;
                }

                div.section{
                    float:      left;
                    margin:     0px;
                    padding:    0px;
                    width:      15px;
                    height:     15px;
                    font-size:  10px;
                    text-align: center;
                }

                div.sect_0{ background: url("../resources/09/0.png") }
                div.sect_1{ background: url("../resources/09/1.png") }
                div.sect_2{ background: url("../resources/09/2.png") }
                div.sect_3{ background: url("../resources/09/3.png") }
                div.sect_4{ background: url("../resources/09/4.png") }

                div.clear{
                    clear: both;
                }
            </style>
        ';

        $sections_html = '<div class="section"></div>';
        $sect_nex = ($this->rgon_side * $this->rgon_nex) + (($this->rgon_nex - 1) * $this->mete_side);
        for($i = 0; $i < $sect_nex; $i ++){
            $sections_html .= '<div class="section">' . $i . '</div>';
        }
        $sections_html .= '<div class="clear"></div>';
        foreach($this->_sect_mass as $coord => $section){
            list($v, $n) = explode('_', $coord);
            if($n == 0){
                $sections_html .= '<div class="section">' . $v . '</div>';
            }
            /*switch($section['type']){
                case $this->type_room: $type = '<span class="room">■</span>'; break;
                case $this->type_gate: $type = '<span class="gate">■</span>'; break;
                default:               $type = '';
            }*/
            $sections_html .= '<div class="section sect_' . $section['type'] . '">'/* . $type*/ . '</div>';
            if(($n + 1) % ($sect_nex) == 0){
                $sections_html .= '<div class="clear"></div>';
            }
        }

        return $style_html . "\n" . $sections_html/* . "\n" . $this->_log*/;
    }




    /* 内部処理用関数群 ----------------------------------------------------------------------------------------------------*/

    /**
     * 部屋の拡張
     *
     * @param   int $chain_id   部屋連鎖データID
     */
    private function _extendRoom($chain_id)
    {
        for($i = 0; $i < $this->room_area_max; $i ++){
            if(! rand(0, 1)){
                break;
            }

            $extend = $this->_tryExtendRoom($this->_room_chain[$chain_id]);
            if(empty($extend)){
                break;
            }

            $aim = array_rand($extend);
            $this->_room_chain[$chain_id][$aim] = $extend[$aim]['edge'];
            foreach($extend[$aim]['coords'] as $coord => $true){
                //$this->_log .= "+${coord}+";
                $this->_rgon_mass[$coord]['type'] = $this->_type_room;
                $this->_rgon_mass[$coord]['room'] = $chain_id;
            }
        }
    }


    /**
     * 接点の構築
     *
     * @param   int $chain_id   部屋連鎖データID
     */
    private function _setGates($chain_id)
    {
        $edges = $this->_room_chain[$chain_id];
        $gate_coords = array();
        $edge_params = array(
            'top' => array('edge' => ($edge = $edges['top']), 'coord' => "${edge}_%s", 'from' => $edges['lft'], 'to' => $edges['rgt']),
            'rgt' => array('edge' => ($edge = $edges['rgt']), 'coord' => "%s_${edge}", 'from' => $edges['top'], 'to' => $edges['btm']),
            'btm' => array('edge' => ($edge = $edges['btm']), 'coord' => "${edge}_%s", 'from' => $edges['lft'], 'to' => $edges['rgt']),
            'lft' => array('edge' => ($edge = $edges['lft']), 'coord' => "%s_${edge}", 'from' => $edges['top'], 'to' => $edges['btm'])
        );

        foreach($edge_params as $aim => $param){
            for($var = $param['from']; $var <= $param['to']; $var ++){
                $coord = $this->_initGate($chain_id, sprintf($param['coord'], $var), $aim);
                $gate_coords[$coord] = true;
            }
        }
    }


    /**
     * 部屋連鎖データの区画集合データへの反映
     *
     * @param   int $chain_id   部屋連鎖データID
     */
    private function _reflectRoom($chain_id)
    {
        $edges = $this->_room_chain[$chain_id];
        $top = $edges['top'] * ($this->rgon_side + $this->mete_side);
        $lft = $edges['lft'] * ($this->rgon_side + $this->mete_side);
        $rgt = $edges['rgt'] * ($this->rgon_side + $this->mete_side) + $this->rgon_side - 1;
        $btm = $edges['btm'] * ($this->rgon_side + $this->mete_side) + $this->rgon_side - 1;

        //$this->_log .= "((${top}_${lft}_${btm}_${rgt}))<br />";
        for($v = $top; $v <= $btm; $v ++){
            for($n = $lft; $n <= $rgt; $n ++){
                $this->_sect_mass["${v}_${n}"]['type'] = $this->_type_room;
                $this->_sect_mass["${v}_${n}"]['room'] = $chain_id;
                //$this->_log .= "[${v}_${n}]";
            }
        }
    }


    /**
     * 部屋の四方への拡大可否確認
     *
     * @param   array   $edges  部屋連鎖データ
     * @return  array           各方向について、拡大が可能な場合は対象域の座標群を返却する。
     */
    private function _tryExtendRoom($edges)
    {
        $room_area  = ($edges['btm'] - $edges['top'] + 1) * ($edges['rgt'] - $edges['lft'] + 1);
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
                $aim_coords[$aim]['coords'][$coord] = true;
            }
            if(! isset($aim_coords[$aim])){
                break;
            }
            if(($room_area + count($aim_coords[$aim]['coords'])) > $this->room_area_max){
                unset($aim_coords[$aim]);
                break;
            }
        }

        return $aim_coords;
    }


    /**
     * 管区から接点を設置して区画集合データに反映させる。
     *
     * @param   string  $chain_id   部屋連鎖データID
     * @param   string  $coord      管区の座標
     * @param   string  $aim        管区から接点を設置する方向
     */
    private function _initGate($chain_id, $coord, $aim)
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
        $this->_gate_chain[$chain_id][$gate_coord] = true;
        $this->_sect_mass[$gate_coord]['type'] = $this->_type_gate;
        $this->_sect_mass[$gate_coord]['room'] = $chain_id;
        $this->_sect_mass[$adhs_coord]['type'] = $this->_type_road;
        //$this->_log .= '-------------<br />' . $gate_coord . '------------<br />';
    }


    /**
     * 座標の連結
     *
     * @param   string  $coord_1    座標
     * @param   string  $coord_2    座標
     * @return  string              座標
     */
    /*private function _glueCoords($coord_1, $coord_2)
    {
        list($ver_1, $nex_1) = explode('_', $coord_1);
        list($ver_2, $nex_2) = explode('_', $coord_2);
        return (($ver_1 + $ver_2) / 2) . '_' . (($nex_1 + $nex_2) / 2);
    }*/
}

$labyrinth = new Labyrinth();
$labyrinth->init(array(
    'rgon_ver'      => 4,
    'rgon_nex'      => 4,
    'rgon_side'     => 7,
    'mete_side'     => 3,
    'room_count'    => 3,
    'room_area_max' => 4
));
$labyrinth->build();
$sections = $labyrinth->dump();

?>




<html>
    <body style="background-color: #000000;">
        <?php echo $sections ?>
    </body>
</html>
