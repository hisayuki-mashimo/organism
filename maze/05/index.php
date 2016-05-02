<?php

require_once '/home/zhen-xia/public_html/sanbou/sanbou.php';

class SectionsMaker
{
    /** 設定用変数 **/
    private $rooms_count    = 0;        // 部屋の数
    private $room_scale_max = 1;        // 部屋の規模の最大値
    private $ver            = 16;       // 区画の縦数
    private $nex            = 16;       // 区画の横数

    /** 内部処理用変数 **/
    private $sections   = array();
    private $gates      = array();
    private $type_wall  = 0;         // 区画タイプ: 壁
    private $type_gate  = 1;         // 区画タイプ: ゲート
    private $type_road  = 2;         // 区画タイプ: 道
    private $type_room  = 3;         // 区画タイプ: 部屋
    private $log        = '';
    private $chan_rooms = array();


    public function __construct($params = array())
    {
        // 無限ループ対策
        set_time_limit(10);

        // パラメータ設定
        if(isset($params['ver'])){ $this->ver = $params['ver']; }
        if(isset($params['nex'])){ $this->nex = $params['nex']; }

        if(isset($params['rooms_count'])){
            $this->rooms_count = $params['rooms_count'];
        }
        else{
            $this->rooms_count = floor(($this->ver + $this->nex) / 2);
        }
    }


    public function build()
    {
        $_room_cands = array();

        // 区画データ構成
        for($v = 0; $v < $this->ver; $v ++){
            for($n = 0; $n < $this->nex; $n ++){
                $this->sections["${v}_${n}"] = array(
                    'type' => $this->type_wall,
                    'room' => null,
                    'cond' => 1111
                );
                if($v % 2 == 0 && $n % 2 == 0){
                    $_room_cands[] = "${v}_${n}";
                }
            }
        }

        // 部屋構成
        shuffle($_room_cands);
        for($id = 0; $id < $this->rooms_count; $id ++){
            $coord = $_room_cands[$id];
            $this->sections[$coord]['type']  = $this->type_room;
            $this->sections[$coord]['room']  = $coord;
            $this->sections[$coord]['chain'] = $id;
            $this->chain_rooms[$id] = array($coord => true);

            // 接続する道の設定
            $aim_cands  = array();
            list($v, $n) = explode('_', $coord);
            if(isset($this->sections[$_coord = ($v - 1) . "_${n}"])){ $aim_cands[] = array('room_cond' => 1000, 'road_cond' =>   10, 'road_coord' => $_coord); } // 上
            if(isset($this->sections[$_coord = "${v}_" . ($n + 1)])){ $aim_cands[] = array('room_cond' =>  100, 'road_cond' =>    1, 'road_coord' => $_coord); } // 右
            if(isset($this->sections[$_coord = ($v + 1) . "_${n}"])){ $aim_cands[] = array('room_cond' =>   10, 'road_cond' => 1000, 'road_coord' => $_coord); } // 下
            if(isset($this->sections[$_coord = "${v}_" . ($n - 1)])){ $aim_cands[] = array('room_cond' =>    1, 'road_cond' =>  100, 'road_coord' => $_coord); } // 左
            shuffle($aim_cands);
            foreach($aim_cands as $j => $cand){
                if(($j == 0) || (rand(0, 1) == 1)){
                    $this->gates[$cand['road_coord']] = $coord;
                    $this->sections[$coord]['cond'] += $cand['room_cond'];
                    $this->sections[$cand['road_coord']]['type'] = $this->type_gate;
                    $this->sections[$cand['road_coord']]['cond'] += $cand['road_cond'];
                    $this->sections[$cand['road_coord']]['room'] = $coord;
                }
            }
        }

        // ゲート同士の連結
        //while(count($this->gates) > 1){
        for($k = 0; $k < 100; $k ++){// 無限ループ防止
            $this->log .= '<hr />[[' . implode('|', array_keys($this->gates)) . ']]<br />';
            if(empty($this->gates)){ break; }
            $this->tieGate();
        }
    }


    private function tieGate()
    {
        // 対象のゲート
        $gate_coords = array_keys($this->gates);
        shuffle($gate_coords);
        $gate_coord = $gate_coords[0];
        $gate_coord_start = $gate_coord;
        $gate = $this->sections[$gate_coord];
        $own_room_coord = $this->gates[$gate_coord];
        list($v_1, $n_1) = explode('_', $gate_coord);

        // ターゲットの部屋
        $room_coords = array();
        reset($this->chain_rooms);
        if(count($this->chain_rooms) == 1){
            $own_chain_id = key($this->chain_rooms);
            $room_coords = $this->chain_rooms[$own_chain_id];
        }
        else{
            foreach($this->chain_rooms as $id => $rooms){
                if(isset($rooms[$own_room_coord])){
                    $own_chain_id = $id;
                }
                else{
                    $room_coords += $rooms;
                }
            }
        }
        $room_coord = array_rand($room_coords);
        list($v_2, $n_2) = explode('_', $room_coord);
        $this->log .= "[${v_1}_${n_1}|${v_2}_${n_2}]: ";

        for($l = 0; $l < 30; $l ++){
            if(($v_1 == $v_2) && ($n_1 == $n_2)){
                break;
            }

            // 進行方向の選定
            $aim_cands  = array();
            list($top, $rgt, $btm, $lft) = str_split($gate['cond']);
            if(($top != 2) && (isset($this->sections[$_c = ($v_1 - 1) . "_${n_1}"]))){ $aim_cands[$_c] = array('gate_cond' => 1000, 'road_cond' =>   10); }
            if(($rgt != 2) && (isset($this->sections[$_c = "${v_1}_" . ($n_1 + 1)]))){ $aim_cands[$_c] = array('gate_cond' =>  100, 'road_cond' =>    1); }
            if(($btm != 2) && (isset($this->sections[$_c = ($v_1 + 1) . "_${n_1}"]))){ $aim_cands[$_c] = array('gate_cond' =>   10, 'road_cond' => 1000); }
            if(($lft != 2) && (isset($this->sections[$_c = "${v_1}_" . ($n_1 - 1)]))){ $aim_cands[$_c] = array('gate_cond' =>    1, 'road_cond' =>  100); }
            $aim_ranges = array();
            foreach($aim_cands as $_coord => $aim){
                list($v, $n) = explode('_', $_coord);
                $aim_ranges[$_coord] = abs($v_2 - $v) + abs($n_2 - $n);
            }
            if(count($aim_ranges) == 1){
                $road_coord = key($aim_ranges);
            }
            else{
                asort($aim_ranges);
                reset($aim_ranges);
                $aim_1 = key($aim_ranges);
                next($aim_ranges);
                $aim_2 = key($aim_ranges);
                if(! isset($aim_ranges[$aim_1])){
                    $this->log .= '********<br />';
                    break;
                }
                if($aim_ranges[$aim_1] == $aim_ranges[$aim_2]){
                    $road_coords = array($aim_1, $aim_2);
                    $road_coord = $road_coords[rand(0, 1)];
                }
                else{
                    $road_coord = $aim_1;
                }
            }
            $aim = $aim_cands[$road_coord];

            $this->sections[$gate_coord]['cond'] += $aim['gate_cond'];
            $this->sections[$road_coord]['cond'] += $aim['road_cond'];
            list($v_1, $n_1) = explode('_', $road_coord);
            $this->log .= "[${v_1}_${n_1}]";
            $gate_coord = $road_coord;
            $gate = $this->sections[$gate_coord];

            if($gate['type'] != $this->type_wall){
                if(isset($room_coords[$gate['room']])){
                    break;
                }
            }
            else{
                $this->sections[$gate_coord]['type'] = $this->type_road;
                $this->sections[$gate_coord]['room'] = $own_room_coord;
            }
        }

        $this->log .= ": [${gate_coord}]<br />";
        $target_chain_id = $this->sections[$gate['room']]['chain'];
        if($own_chain_id != $target_chain_id){
            $this->chain_rooms[$own_chain_id] = $this->chain_rooms[$own_chain_id] + $this->chain_rooms[$target_chain_id];
            unset($this->chain_rooms[$target_chain_id]);
            foreach($this->chain_rooms[$own_chain_id] as $room_coord => $true){
                $this->sections[$room_coord]['chain'] = $own_chain_id;
            }
        }
    }


    public function dump()
    {
        $style_html = '
            <style type="text/css">
                div.section{
                    float:      left;
                    margin:     0px;
                    padding:    0px;
                    width:      15px;
                    height:     15px;
                    font-size:  10px;
                    text-align: center;
                }

                div.sect_1111{ background: url("../resources/04/1111.png") }
                div.sect_1112{ background: url("../resources/04/1112.png") }
                div.sect_1121{ background: url("../resources/04/1121.png") }
                div.sect_1211{ background: url("../resources/04/1211.png") }
                div.sect_2111{ background: url("../resources/04/2111.png") }
                div.sect_1122{ background: url("../resources/04/1122.png") }
                div.sect_1221{ background: url("../resources/04/1221.png") }
                div.sect_2211{ background: url("../resources/04/2211.png") }
                div.sect_2112{ background: url("../resources/04/2112.png") }
                div.sect_1222{ background: url("../resources/04/1222.png") }
                div.sect_2221{ background: url("../resources/04/2221.png") }
                div.sect_2212{ background: url("../resources/04/2212.png") }
                div.sect_2122{ background: url("../resources/04/2122.png") }
                div.sect_1212{ background: url("../resources/04/1212.png") }
                div.sect_2121{ background: url("../resources/04/2121.png") }
                div.sect_2222{ background: url("../resources/04/2222.png") }
                div.sect_0000{ background: url("../resources/04/0000.png") }

                span.room{ color: #FF0088 }
                span.gate{ color: #0088FF }

                div.clear{
                    clear: both;
                }
            </style>
        ';
        $sections_html = '';
        $sections_html .= '<div class="section sect_0000"></div>';
        for($i = 0; $i < $this->nex; $i ++){
            $sections_html .= '<div class="section sect_0000">' . $i . '</div>';
        }
        $sections_html .= '<div class="clear"></div>';
        foreach($this->sections as $coord => $section){
            list($v, $n) = explode('_', $coord);
            if($n == 0){
                $sections_html .= '<div class="section sect_0000">' . $v . '</div>';
            }
            switch($section['type'] ){
                case $this->type_room: $type = '<span class="room">■</span>'; break;
                case $this->type_gate: $type = '<span class="gate">■</span>'; break;
                default:               $type = '';
            }
            $sections_html .= '<div class="section sect_' . $section['cond'] . '">' . $type . '</div>';
            if(($n + 1) % ($this->nex) == 0){
                $sections_html .= '<div class="clear"></div>';
            }
        }

        return $style_html . "\n" . $sections_html . $this->log;
    }
}

$sections_maker = new SectionsMaker(array(
    'ver'         => 9,
    'nex'         => 9,
    'rooms_count' => 3
));
$sections_maker->build();
$sections = $sections_maker->dump();

?>




<html>
    <body>
        <?php echo $sections ?>
    </body>
</html>
