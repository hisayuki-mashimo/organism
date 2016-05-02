<?php

require_once '/home/zhen-xia/public_html/sanbou/sanbou.php';
require_once dirname(__FILE__) . '/labyrinth.php';

class Labyrinth_Test extends Labyrinth
{
    protected $_errored = false;


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
                '<div style="border: solid 1px #990044; width: 70px; height: 20px; text-align: center;">' .
                '<span id="exe_count">' . $_SESSION['count'] . '</span>回目' .
                '</div>';
        }
    }




    /* 検証処理用機能群 ----------------------------------------------------------------------------------------------------*/

    protected $_log = ''; // 検証ログ
    protected $_tmp = array(
        'medias' => array()
    );


    public function dump()
    {
        $inters = array();
        foreach($this->_road_tiles as $param){
            $inters[$param['inter']] = true;
        }

        $sect_html = '<div class="s"></div>';

        $sect_nex = $this->rgon_side * $this->rgon_nex;
        for($i = 0; $i < $sect_nex; $i ++){
            $sect_html .= '<div class="s"><div id="sect_t_' . $i . '">' . $i . '</div></div>';
        }
        $sect_html .= '<div class="c"></div>';

        foreach($this->_sect_tiles as $coord => $sect){
            list($v, $n) = explode('_', $coord);
            if($n == 0){
                $sect_html .= '<div class="s"><div id="sect_' . $v . '_l">' . $v . '</div></div>';
            }

            switch($sect['type']){
                case $this->_type_wall:
                    $is_room_area_ver = ($v % $this->rgon_side) < $this->rgon_side;
                    $is_room_area_nex = ($n % $this->rgon_side) < $this->rgon_side;
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

            switch(true){
                case isset($inters[$coord]):
                    $text = '★'; break;
                case isset($this->_tmp['medias'][$coord]):
                    $text = '◆'; break;
                default:
                    $text = '　';
            }
            $sect_html .= '<div class="s s' . $cond . '"><div id="sect_' . $coord . '">' . $text . '</div></div>';
            if(($n + 1) % ($sect_nex) == 0){
                $sect_html .= '<div class="s sxxxxo"><div id="sect_' . $v . '_r">' . $v . '</div></div><div class="c"></div>';
            }
        }

        $sect_html .= '<div class="s"></div>';
        for($i = 0; $i < $sect_nex; $i ++){
            $sect_html .= '<div class="s sxoxxx"><div id="sect_b_' . $i . '">' . $i . '</div></div>';
        }
        $sect_html .= '<div class="s sxxxxx"></div><div class="c"></div>';

        return '---#|#' . $sect_html . '#|#' . preg_replace('/(<br \/>)+/', '<br />', $this->_log) . '#|#' . ($this->_errored ? 'T' : 'F');
    }


    public function convertParams()
    {
        $params  = array();
        $request = $_POST;
        $needs   = array(
            'rgon_ver'       => 3,
            'rgon_nex'       => 3,
            'rgon_side'      => 5,
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
            $params[$name] = $value;
        }

        return $params;
    }


    protected function   _l(){ $this->_lp(func_get_args(), '');  }
    protected function  _ll(){ $this->_lp(func_get_args(), '|'); }
    protected function  _lb(){ $this->_lp(func_get_args(), '');  $this->_log .= '<br />'; }
    protected function _llb(){ $this->_lp(func_get_args(), '|'); $this->_log .= '<br />'; }
    protected function _llh(){ $this->_lp(func_get_args(), '|'); $this->_log .= '<hr />'; }
    protected function  _ln(){ $this->_log .= func_get_arg(); }


    protected function _lp($vars, $cutter)
    {
        foreach($vars as $n => $var){
            if(! is_scalar($var)){
                $vars[$n] = json_encode($var);
            }
            else{
                $vars[$n] = htmlspecialchars($var);
            }
        }
        $this->_log .= implode($cutter, $vars);
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
