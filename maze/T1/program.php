<?php

require_once '/home/zhen-xia/public_html/sanbou/sanbou.php';

class Road
{
    public  $rgon_side;
    public  $path;

    private $_sect_tiles = array();
    private $_gate_tiles = array();
    private $_type_wall  = 0;
    private $_type_gate  = 3;
    private $_type_road  = 4;
    private $_log        = '';


    public function __construct($params)
    {
        $this->rgon_side = $params['side'];
        $this->path = $params['path'];

        for($v = 0; $v < $this->rgon_side; $v ++){
            for($n = 0; $n < $this->rgon_side; $n ++){
                $this->_sect_tiles["${v}_${n}"] = array('type' => $this->_type_wall);
            }
        }

        $this->_setGates();
        $this->_tieGates();
    }


    private function _setGates()
    {
        $veres = array();
        $nexes = array();
        $aims  = $this->_getAims(true);
        list($ver_top, $ver_btm) = array(0, ($this->rgon_side - 1));
        list($nex_lft, $nex_rgt) = array(0, ($this->rgon_side - 1));

        for($i = 0; $i < $this->path; $i ++){
            $tiles = $this->_sect_tiles;
            $aim = $aims[$i];
            switch($aim){
                case 'top':
                    $adjt_rgt = ($ver_top + 1) . '_' . $nex_rgt;
                    $adjt_lft = ($ver_top + 1) . '_' . $nex_lft;

                    $nex_max = $this->rgon_side - (($tiles[$adjt_rgt]['type'] == $this->_type_gate) ? 3 : 2);
                    $nex_min = ($tiles[$adjt_lft]['type'] == $this->_type_gate) ? 2 : 1;
                    list($v, $n) = array(0, rand($nex_min, $nex_max));
                    $nexes[] = $n;
                    break;
                case 'rgt':
                    $adjt_top = $ver_top . '_' . ($nex_rgt - 1);
                    $adjt_btm = $ver_btm . '_' . ($nex_rgt - 1);

                    $ver_min = ($tiles[$adjt_top]['type'] == $this->_type_gate) ? 2 : 1;
                    $ver_max = $this->rgon_side - (($tiles[$adjt_btm]['type'] == $this->_type_gate) ? 3 : 2);
                    list($v, $n) = array(rand($ver_min, $ver_max), ($nex_rgt));
                    $veres[] = $v;
                    break;
                case 'btm':
                    $adjt_lft = ($ver_btm - 1) . '_' . $nex_lft;
                    $adjt_rgt = ($ver_btm - 1) . '_' . $nex_rgt;

                    $nex_min = ($tiles[$adjt_lft]['type'] == $this->_type_gate) ? 2 : 1;
                    $nex_max = $this->rgon_side - (($tiles[$adjt_rgt]['type'] == $this->_type_gate) ? 3 : 2);
                    list($v, $n) = array(($ver_btm), rand($nex_min, $nex_max));
                    $nexes[] = $n;
                    break;
                case 'lft':
                    $adjt_btm = $ver_btm . '_' . ($nex_lft + 1);
                    $adjt_top = $ver_top . '_' . ($nex_lft + 1);

                    $ver_max = $this->rgon_side - (($tiles[$adjt_btm]['type'] == $this->_type_gate) ? 3 : 2);
                    $ver_min = ($tiles[$adjt_top]['type'] == $this->_type_gate) ? 2 : 1;
                    list($v, $n) = array(rand($ver_min, $ver_max), 0);
                    $veres[] = $v;
            }
            $this->_gate_tiles[$aim] = array('coord' => "${v}_${n}");
            $this->_sect_tiles["${v}_${n}"]['type'] = $this->_type_gate;
            $this->_sect_tiles["${v}_${n}"]['aim']  = $aim;
        }

        $d_top = 1;
        $d_lft = 1;
        $d_btm = $this->rgon_side - 2;
        $d_rgt = $this->rgon_side - 2;
        $gates = $this->_gate_tiles;
        if(isset($gates['top'])){ list($t_ver, $t_nex) = explode('_', $gates['top']['coord']); $paturn  = 'T'; } else{ $paturn  = ' '; }
        if(isset($gates['rgt'])){ list($r_ver, $r_nex) = explode('_', $gates['rgt']['coord']); $paturn .= 'R'; } else{ $paturn .= ' '; }
        if(isset($gates['btm'])){ list($b_ver, $b_nex) = explode('_', $gates['btm']['coord']); $paturn .= 'B'; } else{ $paturn .= ' '; }
        if(isset($gates['lft'])){ list($l_ver, $l_nex) = explode('_', $gates['lft']['coord']); $paturn .= 'L'; } else{ $paturn .= ' '; }
        switch($paturn){
            case 'TRBL': $veres = array($r_ver, $l_ver); $nexes = array($t_nex, $b_nex); break;
            case ' RBL': $veres = array($r_ver, $l_ver); $nexes = array($d_rgt, $d_lft); break;
            case 'T BL': $veres = array($d_top, $d_btm); $nexes = array($t_nex, $b_nex); break;
            case 'TR L': $veres = array($r_ver, $l_ver); $nexes = array($d_rgt, $d_lft); break;
            case 'TRB ': $veres = array($d_top, $d_btm); $nexes = array($t_nex, $b_nex); break;
            case '  BL': $veres = array($l_ver, $d_btm); $nexes = array($b_nex, $d_lft); break;
            case 'T  L': $veres = array($l_ver, $d_top); $nexes = array($t_nex, $d_lft); break;
            case 'TR  ': $veres = array($r_ver, $d_top); $nexes = array($t_nex, $d_rgt); break;
            case ' RB ': $veres = array($r_ver, $d_btm); $nexes = array($b_nex, $d_rgt); break;
            case ' R L': $veres = array($r_ver, $l_ver); $nexes = array($d_rgt, $d_lft); break;
            case 'T B ': $veres = array($d_top, $d_btm); $nexes = array($t_nex, $b_nex);
        }
        $axis_ver = rand(min($veres), max($veres));
        $axis_nex = rand(min($nexes), max($nexes));
        $this->_gate_tiles['mdl'] = array('coord' => "${axis_ver}_${axis_nex}");
        $this->_sect_tiles["${axis_ver}_${axis_nex}"]['type'] = $this->_type_gate;
        $this->_sect_tiles["${axis_ver}_${axis_nex}"]['aim']  = 'mdl';
        $this->_log .= '中心座標:' . $this->_gate_tiles['mdl']['coord'] . '<br />';
    }


    private function _tieGates()
    {
        list($ver, $nex) = explode('_', $this->_gate_tiles['mdl']['coord']);
        $road_tiles_ver = array($ver => array($nex => true));
        $road_tiles_nex = array($nex => array($ver => true));

        foreach($this->_getAims(true) as $edge_aim){
            if(! isset($this->_gate_tiles[$edge_aim])){
                continue;
            }

            $this->_log .= '<hr />[' . $edge_aim . ']<br />';

            switch($edge_aim){
                case 'top':
                case 'btm':
                    $aspect = 'ver';
                    list($edge_prmy, $edge_scdy) = explode('_', $this->_gate_tiles[$edge_aim]['coord']);
                    list($base_prmy, $base_scdy) = explode('_', $this->_gate_tiles['mdl']['coord']);
                    $road_tiles = $road_tiles_ver;
                    break;
                case 'rgt':
                case 'lft':
                    $aspect = 'nex';
                    list($edge_scdy, $edge_prmy) = explode('_', $this->_gate_tiles[$edge_aim]['coord']);
                    list($base_scdy, $base_prmy) = explode('_', $this->_gate_tiles['mdl']['coord']);
                    $road_tiles = $road_tiles_nex;
            }

            $strt_cands = array();
            $ranges     = array();
            $trgt_coord = $this->_gate_tiles[$edge_aim]['coord'];

            $aims = $this->_getAims();
            foreach($aims as $n => $aim){
                $adjt_coord = $this->_getCoord($this->_gate_tiles[$edge_aim]['coord'], $aim);
                if(isset($this->_sect_tiles[$adjt_coord]) && ($this->_sect_tiles[$adjt_coord]['type'] != $this->_type_wall)){
                    continue 2;
                }

                $sltg_aim = ($n == 3) ? $aims[0] : $aims[$n + 1];
                $sltg_coord = $this->_getCoord($adjt_coord, $sltg_aim);
                list($sltg_ver, $sltg_nex) = explode('_', $sltg_coord);
                if(isset($road_tiles_ver[$sltg_ver][$sltg_nex])){
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
                        if(isset($road_tiles[$prmy])){
                            foreach($road_tiles[$prmy] as $scdy => $true){
                                switch($aspect){
                                    case 'ver': $prev_coord = "${prmy}_${scdy}"; break;
                                    case 'nex': $prev_coord = "${scdy}_${prmy}";
                                }
                                $this->_log .= '候補位置関係:' . $prev_coord . '|'. json_encode($this->_getCoordRelation($prev_coord, $trgt_coord)) . '<br />';
                                foreach($this->_getCoordRelation($prev_coord, $trgt_coord) as $aim => $value){
                                    $next_coord = $this->_getCoord($prev_coord, $aim);
                                    if($this->_sect_tiles[$next_coord]['type'] == $this->_type_wall){
                                        $zhou_coords = $this->_getEnableAdvanceAims($prev_coord);
                                        //$this->_log .= '----[' . implode('][', $zhou_coords) . ']----<br />';
                                        if(in_array($next_coord, $zhou_coords)){
                                            $strt_cands[] = $next_coord;
                                            $ranges[]     = $this->_getCoordRange($next_coord, $trgt_coord);
                                        }
                                    }
                                }
                            }
                        }

                        if($range == 0){
                            break;
                        }
                    }
                }
            }

            $this->_log .= '開始:[' . implode('|', $strt_cands) . '] 目標:[' . $trgt_coord . ']<br />';
            list($trgt_ver, $trgt_nex) = explode('_', $trgt_coord);

            array_multisort($ranges, SORT_ASC, $strt_cands);
            foreach($strt_cands as $pres_coord){
                try{
                    $_sect_tiles     = $this->_sect_tiles;
                    $_road_tiles_ver = $road_tiles_ver;
                    $_road_tiles_nex = $road_tiles_nex;

                    for($limit = ($this->rgon_side * $this->rgon_side); $limit > 0; $limit --){
                        $this->_sect_tiles[$pres_coord]['type'] = $this->_type_road;
                        $this->_sect_tiles[$pres_coord]['aim']  = $edge_aim;
                        list($ver, $nex) = explode('_', $pres_coord);
                        if(! isset($road_tiles_ver[$ver])){ $road_tiles_ver[$ver] = array(); } $road_tiles_ver[$ver][$nex] = true;
                        if(! isset($road_tiles_nex[$nex])){ $road_tiles_nex[$nex] = array(); } $road_tiles_nex[$nex][$ver] = true;

                        $pres_coord = $this->_specifyRoadCoord($pres_coord, $trgt_coord);
                        //$this->_log .= '[' . $pres_coord . ']';

                        $range = abs($trgt_ver - $ver) + abs($trgt_nex - $nex);
                        if($range <= 1){
                            break 2;
                        }
                    }

                    break;
                }
                catch(Exception $e){
                    $this->_log = '<div style="background-color: FFAAAA;">再開</div><br />' . $this->_log;
                    $this->_sect_tiles = $_sect_tiles;
                    $road_tiles_ver    = $_road_tiles_ver;
                    $road_tiles_nex    = $_road_tiles_nex;
                }
            }

            if(! isset($road_tiles_ver[$trgt_ver])){ $road_tiles_ver[$trgt_ver] = array(); } $road_tiles_ver[$trgt_ver][$trgt_nex] = true;
            if(! isset($road_tiles_nex[$trgt_nex])){ $road_tiles_nex[$trgt_nex] = array(); } $road_tiles_nex[$trgt_nex][$trgt_ver] = true;
        }

        // 中心ゲートが行き止まりの状態になっている場合、そこ迄の一本道を削除する。
        $road_coord = $this->_gate_tiles['mdl']['coord'];
        $this->_log .= '/////////' . ($this->rgon_side * 2) . '<br />';
        for($limit = ($this->rgon_side * 2); $limit > 0; $limit --){
            $zhou_roads_count = 0;
            foreach($this->_getAims() as $aim){
                $zhou_coord = $this->_getCoord($road_coord, $aim);
                if(isset($this->_sect_tiles[$zhou_coord])){
                    $zhou_tile = $this->_sect_tiles[$zhou_coord];
                    if($zhou_tile['type'] != $this->_type_wall){
                        $next_coord = $zhou_coord;
                        $zhou_roads_count ++;
                    }
                }
            }
            if($zhou_roads_count > 1){
                break;
            }
            $this->_sect_tiles[$road_coord]['type'] = $this->_type_wall;
            $road_coord = $next_coord;
        }
    }


    private function _specifyRoadCoord($pres_coord, $trgt_coord)
    {
        list($trgt_ver, $trgt_nex) = explode('_', $trgt_coord);
        $coord_cands = array();
        $range_min   = null;

        //$this->_log .= '<br />--<br />[' . $pres_coord . ']<br />';
        $aims = $this->_getAims();
        foreach($aims as $aim){
            $zhou_coord = $this->_getCoord($pres_coord, $aim);
            if(! isset($this->_sect_tiles[$zhou_coord])){
                continue;
            }
            if(($this->_sect_tiles[$zhou_coord]['type'] == $this->_type_road) && ($this->_sect_tiles[$zhou_coord]['aim'] == $aim)){
                continue;
            }

            $conds = '';
            $priority = 0;
            for($n = 0; $n < 4; $n ++){
                $adjt_coord = $this->_getCoord($zhou_coord, $aims[$n]);
                $sltg_coord = $this->_getCoord($adjt_coord, $aims[($n + 1) % 4]);
                $adjt_cond  = (isset($this->_sect_tiles[$adjt_coord]) && ($this->_sect_tiles[$adjt_coord]['type'] != $this->_type_wall)) ? 1 : 0;
                $sltg_cond  = (isset($this->_sect_tiles[$sltg_coord]) && ($this->_sect_tiles[$sltg_coord]['type'] != $this->_type_wall)) ? 2 : 0;
                if(isset($this->_sect_tiles[$sltg_coord])){
                    $sect_type = $this->_sect_tiles[$sltg_coord]['type'];
                    if(($sect_type == $this->_type_gate) && ($this->_sect_tiles[$sltg_coord]['aim'] != $this->_sect_tiles[$pres_coord]['aim'])){
                        $priority += 1;
                    }
                    elseif(($sect_type == $this->_type_road) && ($this->_sect_tiles[$sltg_coord]['aim'] != $this->_sect_tiles[$pres_coord]['aim'])){
                        $priority += 1;
                    }
                }
                $conds .= $adjt_cond . $sltg_cond;
            }

            if(preg_match('/(^1.*12$|^21.*1$|121)/', $conds)){
                continue;
            }

            list($ver, $nex) = explode('_', $zhou_coord);
            $range = abs($trgt_ver - $ver) + abs($trgt_nex - $nex);
            if(($range_min == null) || ($range < $range_min)){
                $coord_cands = array('priority_min' => $priority, 'coords' => array($zhou_coord));
                $range_min = $range;
                //$this->_log .= 'R';
            }
            elseif($range == $range_min){
                if($priority < $coord_cands['priority_min']){
                    $coord_cands = array('priority_min' => $priority, 'coords' => array($zhou_coord));
                    $this->_log .= 'S';
                }
                elseif($priority == $coord_cands['priority_min']){
                    $coord_cands['coords'][] = $zhou_coord;
                    //$this->_log .= 'H';
                }
            }
            //$this->_log .= $zhou_coord . '<br />';
        }

        if(empty($coord_cands)){
            throw new Exception();
        }
        //$this->_log .= json_encode($coord_cands) . '<br />';

        $coords = $coord_cands['coords'];
        return $coords[array_rand($coords)];
    }


    private function _getAims($rand = false)
    {
        $aims = array('top', 'rgt', 'btm', 'lft');
        if($rand){
            shuffle($aims);
        }
        return $aims;
    }


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


    private function _getEnableAdvanceAims($coord, $type = 'sect')
    {
        $enable_aims = array();

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
            for($n = 0; $n < 4; $n ++){
                $adjt_coord = $this->_getCoord($trgt_coord, $aims[$n]);
                $sltg_coord = $this->_getCoord($adjt_coord, $aims[($n + 1) % 4]);
                $adjt_cond = 0;
                $sltg_cond = 0;
                if(isset($tiles[$adjt_coord]) && ($tiles[$adjt_coord]['type'] != $this->_type_wall)){ $adjt_cond = 1; }
                if(isset($tiles[$sltg_coord]) && ($tiles[$sltg_coord]['type'] != $this->_type_wall)){ $sltg_cond = 2; }
                $conds .= $adjt_cond . $sltg_cond;
            }

            if(! preg_match('/(^1.*12$|^12.*1$|121)/', $conds)){
                $enable_aims[$aim] = $trgt_coord;
            }
        }

        return $enable_aims;
    }


    private function _getCoordRelation($base_coord, $trgt_coord)
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


    private function _getCoordRange($base_coord, $trgt_coord)
    {
        list($base_ver, $base_nex) = explode('_', $base_coord);
        list($trgt_ver, $trgt_nex) = explode('_', $trgt_coord);

        return abs($trgt_ver - $base_ver) + abs($trgt_nex - $base_nex);
    }


    public function dump()
    {
        $sect_html = '';

        $gates = $this->_gate_tiles;
        if(isset($gates['top'])){ list($v, $top_nex) = explode('_', $gates['top']['coord']); } else{ $top_nex = null; }
        if(isset($gates['rgt'])){ list($rgt_ver, $n) = explode('_', $gates['rgt']['coord']); } else{ $rgt_ver = null; }
        if(isset($gates['btm'])){ list($v, $btm_nex) = explode('_', $gates['btm']['coord']); } else{ $btm_nex = null; }
        if(isset($gates['lft'])){ list($lft_ver, $n) = explode('_', $gates['lft']['coord']); } else{ $lft_ver = null; }

        for($v = 0; $v <= 2; $v ++){
            $sect_html .= '<div class="s"></div><div class="s"></div><div class="s"></div>';
            for($n = 0; $n < $this->rgon_side; $n ++){
                $sect_html .= '<div class="s s' . ((is_scalar($top_nex) && $n == $top_nex) ? '4t' : '10000') . '">';
                $sect_html .= ($v == 2) ? $n : '';
                $sect_html .= '</div>';
            }
            $sect_html .= '<div class="s sxxxxo"></div><div class="s"></div><div class="c"></div>';
        }

        foreach($this->_sect_tiles as $coord => $sect){
            list($v, $n) = explode('_', $coord);
            if($n == 0){
                $class = ($v == $lft_ver) ? '4l' : '10000';
                $sect_html .= '<div class="s s' . $class . '"></div>';
                $sect_html .= '<div class="s s' . $class . '"></div>';
                $sect_html .= '<div class="s s' . $class . '">' . $v . '</div>';
            }

            $cond = $sect['type'];
            if($sect['type'] != $this->_type_wall){
                switch($sect['aim']){
                    case 'top': $cond .= 't'; break;
                    case 'rgt': $cond .= 'r'; break;
                    case 'btm': $cond .= 'b'; break;
                    case 'lft': $cond .= 'l'; break;
                    case 'mdl': $cond .= 'm'; break;
                    case 'fst': $cond .= ''; break;
                    case 'lst': $cond .= '';
                }
            }

            $sect_html .= '<div class="s s' . $cond . '">' . '</div>';
            if(($n + 1) % ($this->rgon_side) == 0){
                $class = ($v == $rgt_ver) ? '4r' : '10000';
                $sect_html .= '<div class="s s' . $class . '">' . $v . '</div>';
                $sect_html .= '<div class="s s' . $class . '"></div>';
                $sect_html .= '<div class="s s' . $class . '"></div>';
                $sect_html .= '<div class="s sxxxxo"></div><div class="c"></div>';
            }
        }

        for($v = 0; $v <= 3; $v ++){
            $sect_html .= '<div class="s' . (($v == 0) ? ' sxoxxx' : '') . '"></div>';
            $sect_html .= '<div class="s' . (($v == 0) ? ' sxoxxx' : '') . '"></div>';
            $sect_html .= '<div class="s' . (($v == 0) ? ' sxoxxx' : '') . '"></div>';
            for($n = 0; $n < $this->rgon_side; $n ++){
                switch($v){
                    case 3:
                        $class = 'xoxxx';
                        break;
                    default:
                        $class = (is_scalar($btm_nex) && ($n == $btm_nex)) ? '4b' : '10000';
                }
                $sect_html .= '<div class="s s' . $class . '">';
                $sect_html .= ($v == 0) ? $n : '';
                $sect_html .= '</div>';
            }
            switch($v){
                case 3:  $class_strt = ' sxxxxx'; $class_pros = '';        $class_last = '';        break;
                case 0:  $class_strt = ' s0';     $class_pros = ' sxoxxx'; $class_last = ' sxxxxx'; break;
                default: $class_strt = ' sxxxxo'; $class_pros = '';        $class_last = '';
            }
            $sect_html .= '<div class="s' . $class_strt . '"></div>';
            $sect_html .= '<div class="s' . $class_pros . '"></div>';
            $sect_html .= '<div class="s' . $class_pros . '"></div>';
            $sect_html .= '<div class="s' . $class_last . '"></div>';
            $sect_html .= '<div class="c"></div>';
        }

        return $sect_html . '#|#' . preg_replace('/(<br \/>)+/', '<br />', $this->_log);
    }
}


$Road = new Road(array(
    'side' => 9,
    'path' => 4
));

echo $Road->dump();
// (568行 2011/05/19)
