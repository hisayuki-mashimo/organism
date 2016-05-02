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
    private $sections           = array();
    private $sections_unitary   = array();  // 一元的区画データ
    private $type_wall          = 0;        // 区画タイプ: 壁
    private $type_road          = 1;        // 区画タイプ: 道
    private $type_room          = 2;        // 区画タイプ: 部屋
    private $log                = '';


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
        // 区画データ構成
        for($v = 0; $v < $this->ver; $v ++){
            for($n = 0; $n < $this->nex; $n ++){
                $this->sections_unitary["${v}_${n}"] = array('type' => $this->type_wall);
                if($v % 2 == 0 && $n % 2 == 0){
                    $room_cands["${v}_${n}"] = true;
                }
            }
        }

        // 部屋構成
        $coords = array_keys($room_cands);
        shuffle($coords);
        for($i = 0; $i < $this->rooms_count; $i ++){
            $coord = $coords[$i];
            $this->sections_unitary[$coord] = array('type' => $this->type_room, 'id' => $coord);
            $this->sections[$coord] = array(
                'rooms' => array($coord => true),
                'roads' => array()
            );
        }

        // 部屋同士の連結
        while(count($this->sections) > 1){
            $this->tieRoom();
        }
    }


    private function tieRoom()
    {
        $ids = array_keys($this->sections);
        shuffle($ids);
        $sect_1 = $this->sections[$id_1 = $ids[0]];
        $sect_2 = $this->sections[$id_2 = $ids[1]];
        shuffle($rooms_1 = array_keys($sect_1['rooms']));
        shuffle($rooms_2 = array_keys($sect_2['rooms']));
        list($v_1, $n_1) = explode('_', $rooms_1[0]);
        list($v_2, $n_2) = explode('_', $rooms_2[0]);
        $this->log .= "<hr />${rooms_1[0]}(${id_1}) / ${rooms_2[0]}(${id_2})<br />-----------------------<br />";

        $roads = array();
        for($i = 0; $i < 50; $i ++){
            if(($v_1 == $v_2) && ($n_1 == $n_2)){
                break;
            }
            $coords = array();
            $coords_pre = array();
            if    ($v_1 < $v_2){ $coord = ($v_1 + 2) . "_${n_1}"; $coords[] = $coord; $coords_pre[$coord] = ($v_1 + 1) . "_${n_1}"; }
            elseif($v_1 > $v_2){ $coord = ($v_1 - 2) . "_${n_1}"; $coords[] = $coord; $coords_pre[$coord] = ($v_1 - 1) . "_${n_1}"; }
            if    ($n_1 < $n_2){ $coord = "${v_1}_" . ($n_1 + 2); $coords[] = $coord; $coords_pre[$coord] = "${v_1}_" . ($n_1 + 1); }
            elseif($n_1 > $n_2){ $coord = "${v_1}_" . ($n_1 - 2); $coords[] = $coord; $coords_pre[$coord] = "${v_1}_" . ($n_1 - 1); }
            shuffle($coords);
            $coord = $coords[0];
            $roads[$coords_pre[$coord]] = true;
            $this->log .= "(" . $coord . ")";
            if(isset($sect_1['roads'][$coord])){
                $roads = array();
            }
            elseif(isset($sect_1['rooms'][$coord])){
                //$roads = array();
            }
            elseif($this->sections_unitary[$coord]['type'] == $this->type_road){
                $id_2 = $this->sections_unitary[$coord]['id'];
                $sect_2 = $this->sections[$id_2];
                break;
            }
            elseif($this->sections_unitary[$coord]['type'] == $this->type_room){
                $id_2 = $this->sections_unitary[$coord]['id'];
                $sect_2 = $this->sections[$id_2];
                break;
            }
            $roads[$coord] = true;
            $this->log .= "${coord}<br />";
            list($v_1, $n_1) = explode('_', $coord);
        }

        foreach($roads as $coord => $true){
            $this->sections_unitary[$coord] = array('type' => $this->type_road, 'id' => $id_1);
        }
        foreach($sect_2['rooms'] as $coord => $true){
            $this->sections_unitary[$coord]['id'] = $id_1;
        }
        foreach($sect_2['roads'] as $coord => $true){
            $this->sections_unitary[$coord]['id'] = $id_1;
        }
        $this->sections[$id_1] = array(
            'rooms' => $sect_1['rooms'] + $sect_2['rooms'],
            'roads' => $sect_1['roads'] + $sect_2['roads'] + $roads
        );
        unset($this->sections[$id_2]);
        $this->log .= "[${id_2}＞＞${id_1}]<br />";
    }


    private function shift($coordinate, $aim, $count = 1)
    {
        list($v, $n) = explode('_', $coordinate);
        switch($aim){
            case 'top': $v -= $count; break;
            case 'lft': $n -= $count; break;
            case 'btm': $v += $count; break;
            case 'rgt': $n += $count; break;
        }
        return "${v}_${n}";
    }


    public function dump()
    {
        $sections_html = '';

        $sections_html .= '　 ';
        for($i = 0; $i < $this->ver; $i ++){
            //$sections_html .= mb_convert_kana((string)$i, 'N', 'UTF-8') . ' ';
        }
        $sections_html .= '<br />';

        foreach($this->sections_unitary as $coordinate => $section){
            list($v, $n) = explode('_', $coordinate);

            if($n == 0){
                //$sections_html .= mb_convert_kana((string)$v, 'N', 'UTF-8');
            }

            switch($section['type']){
                case $this->type_wall: $html = '<span class="wall">■</span>'; break;
                case $this->type_road: $html = '<span class="road">■</span>'; break;
                case $this->type_room: $html = '<span class="room">■</span>'; break;
            }
            $sections_html .= $html;
            if(($n + 1) % ($this->nex) == 0){
                $sections_html .= '<br />';
            }
        }

        return $sections_html . $this->log;
    }
}

$sections_maker = new SectionsMaker(array(
    'ver'         => 16,
    'nex'         => 16,
    'rooms_count' => 12
));
$sections_maker->build();
$sections = $sections_maker->dump();

?>




<html>
    <head>
        <style type="text/css">
            span.wall{ color: #000000; }
            span.road{ color: #8888FF; }
            span.room{ color: #FF8888; }
        </style>
    </head>
    <body>
        <?php echo $sections ?>
    </body>
</html>
