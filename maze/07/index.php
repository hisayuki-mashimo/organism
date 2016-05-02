<?php

require_once '/home/zhen-xia/public_html/sanbou/sanbou.php';

class Labyrinth
{
    /** 設定用変数 **/
    private $room_count     = 0;    // 部屋の数
    private $room_scale_max = 1;    // 部屋の規模の最大値
    private $ver            = 16;   // 区画の縦数
    private $nex            = 16;   // 区画の横数

    /** 内部処理用変数 **/
    private $sections   = array();  // 区画データ
    private $room_chain = array();  // 連結部屋グループ
    private $gate_chain = array();  // 連結ゲートグループ
    private $type_wall  = 0;        // 区画タイプ: 壁
    private $type_gate  = 1;        // 区画タイプ: ゲート
    private $type_road  = 2;        // 区画タイプ: 道
    private $type_room  = 3;        // 区画タイプ: 部屋
    private $log        = '';       // ログ


    /**
     * 設定
     *
     * @param   array   $params 設定値
     */
    public function __construct($params = array())
    {
        // パラメータ設定
        if(isset($params['ver'])){ $this->ver = $params['ver']; }
        if(isset($params['nex'])){ $this->nex = $params['nex']; }
        if(isset($params['room_count'])){
            $this->room_count = $params['room_count'];
        }
        else{
            $this->room_count = floor(($this->ver + $this->nex) / 2);
        }
    }


    /**
     * 構築
     *
     */
    public function build()
    {
        // 中心座標(必ず部屋が置かれる。)
        $center = $this->toCoord(
            ($this->ver - ($this->ver % 2)) / 2,
            ($this->nex - ($this->nex % 2)) / 2
        );

        // 区画データ構成
        $room_cands = array();
        for($v = 0; $v < $this->ver; $v ++){
            for($n = 0; $n < $this->nex; $n ++){
                $this->sections[$this->toCoord($v, $n)] = array(
                    'type' => $this->type_wall,
                    'cond' => 1111
                );
                if($v % 4 == 0 && $n % 4 == 0){
                    $coord = $this->toCoord($v, $n);
                    if($coord != $center){
                        $room_cands[] = $coord;
                    }
                }
            }
        }

        // 部屋構成
        shuffle($room_cands);
        array_splice($room_cands, 0, 0, $center);
        $gate_count = 0;
        for($chain_id = 0; $chain_id < $this->room_count; $chain_id ++){
            $room_coord = $room_cands[$chain_id];
            $this->sections[$room_coord]['type']  = $this->type_room;
            $this->sections[$room_coord]['room']  = $room_coord;
            $this->sections[$room_coord]['chain'] = $chain_id;
            $this->room_chain[$chain_id] = array($room_coord => array());
            $this->gate_chain[$chain_id] = array();

            // ゲートの設定
            shuffle(($aims = array('top', 'rgt', 'btm', 'lft')));
            foreach($aims as $aim){
                $gate_coord = $this->getCoord($room_coord, $aim);
                if(! isset($this->sections[$gate_coord])){
                    continue;
                }
                if((count($this->gate_chain[$chain_id]) != 0) && (rand(0, 1) == 0)){
                    break;
                }
                $this->gate_chain[$chain_id][$gate_coord] = true;
                $this->sections[$gate_coord]['room'] = $room_coord;
                $this->sections[$gate_coord]['type'] = $this->type_gate;
                $this->room_chain[$chain_id][$room_coord][$aim] = $gate_coord;
                $this->headAim($this->sections[$gate_coord]['cond'], $aim);
                $this->comeAim($this->sections[$room_coord]['cond'], $aim);
                $gate_count ++;
            }
        }

        // ゲート同士の連結
        for($i = 0; $i < $gate_count; $i ++){
            $this->log .= '<hr />';
            $this->tieGate();
            if((empty($this->gate_chain)) && (count($this->room_chain) < 2)){
                break;
            }
        }
    }


    private function tieGate()
    {
        $strt_coord      = $this->specifyStartGate();
        $trgt_coord      = $this->specifyTargetGate($strt_coord);
        $strt_room_coord = $this->sections[$strt_coord]['room'];
        $trgt_room_coord = $this->sections[$trgt_coord]['room'];
        $strt_chain_id   = $this->sections[$strt_room_coord]['chain'];
        $trgt_chain_id   = $this->sections[$trgt_room_coord]['chain'];
        $crnt_coord      = $strt_coord;
        $prev_coord      = $strt_room_coord;

        $this->log .= "[${strt_coord}|${trgt_coord}]: ";

        for($l = 0; $l < 300; $l ++){
            if($crnt_coord == $trgt_coord){
                $trgt_coord = $crnt_coord;
                break;
            }

            // 進行方向の選定
            $aim_cands = array();
            foreach(array('top', 'rgt', 'btm', 'lft') as $aim){
                $coord = $this->getCoord($crnt_coord, $aim);
                if((isset($this->sections[$coord])) && ($prev_coord != $coord)){
                    $aim_cands[$coord] = $aim;
                }
            }

            list($v_2, $n_2) = explode('_', $trgt_coord);
            $aim_ranges = array();
            foreach($aim_cands as $_coord => $aim){
                list($v, $n) = explode('_', $_coord);
                $aim_ranges[$_coord] = abs($v_2 - $v) + abs($n_2 - $n);

                // ゲート出発直後
                if($l == 0){
                    if($this->sections[$_coord]['type'] == $this->type_road){
                        $aim_ranges[$_coord] += 1;
                    }
                }
            }
            if(count($aim_ranges) == 1){
                $next_coord = key($aim_ranges);
            }
            else{
                asort($aim_ranges);
                reset($aim_ranges);
                $aim_1 = key($aim_ranges);
                next($aim_ranges);
                $aim_2 = key($aim_ranges);
                if($aim_ranges[$aim_1] == $aim_ranges[$aim_2]){
                    $next_coords = array($aim_1, $aim_2);
                    $next_coord = $next_coords[rand(0, 1)];
                }
                else{
                    $next_coord = $aim_1;
                }
            }
            $aim = $aim_cands[$next_coord];

            $this->comeAim($this->sections[$crnt_coord]['cond'], $aim);
            $this->headAim($this->sections[$next_coord]['cond'], $aim);
            $prev_coord = $crnt_coord;
            $crnt_coord = $next_coord;
            $this->log .= "[${crnt_coord}]";
            $section = $this->sections[$crnt_coord];

            if($section['type'] != $this->type_wall){
                if($strt_room_coord == $trgt_room_coord){
                    break;
                }
                $crnt_room_coord = $this->sections[$crnt_coord]['room'];
                $strt_chain_id   = $this->sections[$strt_room_coord]['chain'];
                $crnt_chain_id   = $this->sections[$crnt_room_coord]['chain'];
                if($strt_chain_id != $crnt_chain_id){
                    $trgt_coord      = $crnt_coord;
                    $trgt_room_coord = $crnt_room_coord;
                    $trgt_chain_id   = $crnt_chain_id;
                    break;
                }
                elseif($crnt_chain_id == $trgt_chain_id){
                    $trgt_coord      = $crnt_coord;
                    $trgt_room_coord = $crnt_room_coord;
                    break;
                }
                elseif($this->sections[$crnt_coord]['type'] == $this->type_gate){
                    unset($this->gates[$crnt_chain_id][$crnt_coord]);
                }
            }
            else{
                $this->sections[$crnt_coord]['type'] = $this->type_road;
                $this->sections[$crnt_coord]['room'] = $strt_room_coord;
            }
        }

        $this->log .= ": [${crnt_coord}]";
        unset($this->gate_chain[$strt_chain_id][$strt_coord]);
        unset($this->gate_chain[$trgt_chain_id][$trgt_coord]);
        if($strt_room_coord != $trgt_room_coord){
            foreach($this->room_chain[$strt_chain_id] as $coord => $gates){
                $this->sections[$coord]['chain'] = $trgt_chain_id;
                $this->room_chain[$trgt_chain_id][$coord] = $gates;
            }
            if(isset($this->gate_chain[$trgt_chain_id])){
                $this->room_chain[$trgt_chain_id] += $this->room_chain[$strt_chain_id];
                $this->gate_chain[$trgt_chain_id] += $this->gate_chain[$strt_chain_id];
            }
            elseif(! empty($this->gate_chain)){
                $this->gate_chain[$trgt_chain_id]  = $this->gate_chain[$strt_chain_id];
            }
            if($strt_chain_id != $trgt_chain_id){
                unset($this->room_chain[$strt_chain_id]);
                unset($this->gate_chain[$strt_chain_id]);
            }
        }
        if((! empty($this->gate_chain)) && (empty($this->gate_chain[$trgt_chain_id]))){
            unset($this->gate_chain[$trgt_chain_id]);
        }
    }


    private function specifyStartGate()
    {
        if(! empty($this->gate_chain)){
            $chain = $this->gate_chain;
        }
        else{
            $chain = $this->room_chain;
        }

        $strt_chain_id = null;
        foreach($chain as $cand_chain_id => $gates){
            if($strt_chain_id === null){
                $strt_chain_id = $cand_chain_id;
            }
            $strt_count = count($this->room_chain[$strt_chain_id]);
            $crnt_count = count($this->room_chain[$cand_chain_id]);
            if($crnt_count < $strt_count){
                $strt_chain_id = $cand_chain_id;
            }
        }

        if(! empty($this->gate_chain)){
            return array_rand($chain[$strt_chain_id]);
        }
        else{
            $gates = $chain[$strt_chain_id];
            return array_rand($gates);
        }
    }


    private function specifyTargetGate($strt_coord)
    {
        if(! isset($this->sections[$strt_coord])){
            vd($strt_coord);exit;
        }
        $strt_room_coord = $this->sections[$strt_coord]['room'];
        $strt_chain_id   = $this->sections[$strt_room_coord]['chain'];
        $strt_room_chain = $this->room_chain[$strt_chain_id][$strt_room_coord];
        $trgt_gate_cands = array();
        foreach($this->room_chain as $chain_id => $rooms){
            if((count($this->room_chain) > 1) && ($chain_id == $strt_chain_id)){
                continue;
            }
            foreach($rooms as $room_coord => $gates){
                if($room_coord != $strt_room_coord){
                    $trgt_gate_cands += $gates;
                }
            }
        }

        shuffle($trgt_gate_cands);
        $trgt_coord_cands = array();
        list($strt_ver, $strt_nex) = explode('_', $strt_coord);
        foreach($trgt_gate_cands as $i => $coord){
            list($top, $rgt, $btm, $lft) = str_split($this->sections[$coord]['cond']);
            list($ver, $nex) = explode('_', $coord);
            if(
                (($top != 2) && ($strt_ver > $ver)) ||
                (($rgt != 2) && ($strt_nex < $nex)) ||
                (($btm != 2) && ($strt_ver > $ver)) ||
                (($lft != 2) && ($strt_nex < $nex))
            ){
                $trgt_coord_cands[$coord] = true;
                unset($gates[$i]);
            }
            if(count($trgt_coord_cands) >= 7){
                break;
            }
        }
        foreach($gates as $coord){
            $trgt_coord_cands[$coord] = true;
            if(count($trgt_coord_cands) >= 10){
                break;
            }
        }
        return array_rand($trgt_coord_cands);
    }


    private function getCoord($coord, $aim = null)
    {
        list($v, $n) = explode('_', $coord);
        return $this->toCoord($v, $n, $aim);
    }


    private function toCoord($v, $n, $aim = null)
    {
        switch($aim){
            case 'top': $v -= 1; break;
            case 'rgt': $n += 1; break;
            case 'btm': $v += 1; break;
            case 'lft': $n -= 1; break;
        }
        return "${v}_${n}";
    }


    private function headAim(&$cond, $aim)
    {
        list($top, $rgt, $btm, $lft) = str_split($cond);
        switch($aim){
            case 'top': $btm = 2; break;
            case 'rgt': $lft = 2; break;
            case 'btm': $top = 2; break;
            case 'lft': $rgt = 2; break;
        }
        $cond = "${top}${rgt}${btm}${lft}";
    }


    private function comeAim(&$cond, $aim)
    {
        list($top, $rgt, $btm, $lft) = str_split($cond);
        switch($aim){
            case 'top': $top = 2; break;
            case 'rgt': $rgt = 2; break;
            case 'btm': $btm = 2; break;
            case 'lft': $lft = 2; break;
        }
        $cond = "${top}${rgt}${btm}${lft}";
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
            switch($section['type']){
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

$labyrinth = new Labyrinth(array(
    'ver'        => 9,
    'nex'        => 9,
    'room_count' => 5
));
$labyrinth->build();
$sections = $labyrinth->dump();

?>




<html>
    <body>
        <?php echo $sections ?>
    </body>
</html>
