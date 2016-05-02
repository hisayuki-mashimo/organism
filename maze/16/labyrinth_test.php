<?php

require_once '/home/zhen-xia/public_html/sanbou/sanbou.php';
require_once dirname(__FILE__) . '/labyrinth.php';

class Labyrinth_Test extends Labyrinth
{
    private $_errored = false;


    public function __construct()
    {
        parent::__construct();

        session_start();
        if(! isset($_SESSION['count'])){
            $_SESSION['count'] = 1;
        }
        else{
            $_SESSION['count'] ++;
        }

        if(isset($this->eee)){
            $this->_log .=
                '<div style="border: solid 2px #FF0000" color: #00FF00>エラー' .
                '(前回エラーから<span id="exe_count">' . $_SESSION['count'] . '</span>回目)' .
                '</div>';
        }
        else{
            $this->_log .=
                '<div style="border: solid 2px #FF0088; width: 70px; height: 20px; text-align: center;">' .
                '<span id="exe_count">' . $_SESSION['count'] . '</span>回目' .
                '</div>';
        }
    }





















    public function build()
    {
        // 管区集合データの構築
        for($v = 0; $v < $this->rgon_ver; $v ++){
            for($n = 0; $n < $this->rgon_nex; $n ++){
                $this->_rgon_tiles["${v}_${n}"] = array('type' => $this->_type_wall, 'room' => null, 'tieds' => array());
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
        $this->_log .= 'first_untie: ' . json_encode($this->_gate_untie) . '<br />';

        // 接点の連結
        $gate_count = count($this->_gate_untie);
        for($i = 0; $i < $gate_count; $i ++){
            $gate_from = $this->_specifyStartGate();
            $gate_to   = $this->_specifyTargetGate($gate_from);
            $this->_tieGate($gate_from, $gate_to);

            if((count($this->_room_chain) <= 1) && (count($this->_gate_untie) == 0)){
                $this->_log .= '(B)<br />';
                break;
            }
        }
        if(count($this->_gate_untie) > 0){
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


    
    
    
    
    
    
    
    
    
    protected function _tieGate($strt_gate_coord, $trgt_gate_coord)
    {
        $this->_log .= '[' . $strt_gate_coord . '|' . $trgt_gate_coord . ']';
        $strt_room_coord = $this->_gate_tiles[$strt_gate_coord]['room'];
        $trgt_room_coord = $this->_gate_tiles[$trgt_gate_coord]['room'];
        $strt_chain_id   = $this->_room_tiles[$strt_room_coord]['chain'];
        $trgt_chain_id   = $this->_room_tiles[$trgt_room_coord]['chain'];

        list($prev_ver, $prev_nex, $prev_aim) = explode('_', $strt_gate_coord);
        list($trgt_ver, $trgt_nex, $trgt_aim) = explode('_', $trgt_gate_coord);
        $prev_coord = "${prev_ver}_${prev_nex}";

        for($i = 0; $i < 20; $i ++){
            $pres_coord = $this->_getCoord($prev_coord, $prev_aim);
            $this->_log .= '+' . $pres_coord;
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
                                $prev_gate_coord = "${prev_coord}_${prev_aim}";
                                if(! isset($this->_gate_tiles[$prev_gate_coord])){ $this->_setGate($prev_coord, $prev_aim); }
                                if(! isset($this->_gate_tiles[$pres_gate_coord])){ $this->_setGate($pres_coord, $agst_aim); }
                                $this->_tieRgon($prev_coord, $pres_coord);
                                unset($this->_gate_untie[$prev_gate_coord]);
                                unset($this->_gate_untie[$pres_gate_coord]);
                                switch(true){
                                    case (count($this->_room_chain) == 1):
                                    case ($pres_chain_id != $strt_chain_id):
                                    case ($pres_gate_coord == $trgt_gate_coord):
                                        $trgt_chain_id   = $pres_chain_id;
                                        $trgt_gate_coord = $pres_gate_coord;
                                        $this->_log .= '#';
                                        break 4;
                                }
                            }
                            break;
                        case $this->_type_road:
                            if(! isset($this->_gate_tiles[$pres_gate_coord])){
                                $this->_setGate($pres_coord, $agst_aim);
                            }
                            $this->_road_tiles[$prev_coord]['gates'][$prev_aim] = false;
                            $this->_tieRgon($prev_coord, $pres_coord);
                            unset($this->_gate_untie[$pres_gate_coord]);
                            switch(true){
                                case (count($this->_room_chain) == 1):
                                    $trgt_chain_id   = $strt_chain_id;
                                    $trgt_gate_coord = $pres_gate_coord;
                                    $this->_log .= '%';
                                    break 4;
                                case (count($this->_room_chain) == 1):
                                case ($pres_chain_id != $strt_chain_id):
                                case ($pres_gate_coord == $trgt_gate_coord):
                                    $trgt_chain_id   = $pres_chain_id;
                                    $trgt_gate_coord = $pres_gate_coord;
                                    $this->_log .= '?';
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
                            $prev_gate_coord = $prev_coord . '_' . $prev_aim;
                            if(! isset($this->_gate_tiles[$prev_gate_coord])){
                                $this->_setGate($prev_coord, $prev_aim);
                            }
                            $this->_tieRgon($prev_coord, $pres_coord);
                            break;
                        case $this->_type_road:
                            $this->_road_tiles[$prev_coord]['gates'][$prev_aim] = false;
                            $this->_tieRgon($prev_coord, $pres_coord);
                    }

                    if(count($this->_room_chain) == 1){
                        if(count($this->_road_tiles[$pres_coord]['gates']) >= 2){
                            $trgt_gate_coord = null;
                            $trgt_chain_id   = $strt_chain_id;
                            $this->_log .= '*';
                            break 2;
                        }
                    }
                    foreach($this->_road_tiles[$pres_coord]['rooms'] as $room_coord => $true){
                        $pres_chain_id = $this->_room_tiles[$room_coord]['chain'];
                        if($pres_chain_id != $strt_chain_id){
                            $trgt_gate_coord = null;
                            $this->_log .= '@';
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
            $this->_log .= '==' . $trgt_gate_coord . '==';
        }
        $this->_log .= /*'<br />' . json_encode($this->_gate_untie) . */'<hr />';
    }



















    /* 検証処理用機能群 ----------------------------------------------------------------------------------------------------*/

    private $_log = ''; // 検証ログ


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

            $sect_html .= '<div class="s s' . $cond . '"><div id="sect_' . $coord . '">　</div></div>';
            if(($n + 1) % ($sect_nex) == 0){
                $sect_html .= '<div class="s sxxxxo">' . $v . '</div><div class="c"></div>';
            }
        }

        $sect_html .= '<div class="s"></div>';
        for($i = 0; $i < $sect_nex; $i ++){
            $sect_html .= '<div class="s sxoxxx">' . $i . '</div>';
        }
        $sect_html .= '<div class="s sxxxxx"></div><div class="c"></div>';

        return $sect_html . '#|#' . preg_replace('/(<br \/>)+/', '<br />', $this->_log) . '#|#' . ($this->_errored ? 'T' : 'F');
    }


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
                    $max_count = $params['rgon_ver'] * $params['rgon_nex'];
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




if(isset($_GET['error'])){
    session_start();
    unset($_SESSION['count']);
}
else{
    $labyrinth = new Labyrinth_Test();
    $labyrinth->init($labyrinth->convertParams());
    $labyrinth->build();
    echo $labyrinth->dump();
}
