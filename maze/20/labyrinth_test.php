<?php

require_once '/home/zhen-xia/public_html/sanbou/sanbou.php';
require_once dirname(__FILE__) . '/labyrinth.php';

class Labyrinth_Test extends Labyrinth
{
    /* 検証処理用変数群 ----------------------------------------------------------------------------------------------------*/

    protected $_errored = false;




    /* 外部制御用関数群 ----------------------------------------------------------------------------------------------------*/

    /**
     * コンストラクタ
     *
     * @access  public
     */
    public function __construct()
    {
        parent::__construct();

        session_start();
        $_SESSION['count'] = (isset($_SESSION['count']) ? $_SESSION['count'] : 0) + 1;

        if(isset($this->eee)){
            $this->_log .= sprintf(
                '<div style="border: solid 2px #FF0000" color: #00FF00>エラー' .
                    '(前回エラーから<span id="exe_count">%d</span>回目)' .
                '</div>',
                $_SESSION['count']
            );
        }
        else{
            $this->_log .= sprintf(
                '<div style="border: solid 1px #990044; width: 70px; height: 20px; text-align: center;">' .
                    '<span id="exe_count">%d</span>回目' .
                '</div>',
                $_SESSION['count']
            );
        }
    }


    /**
     * 設定
     *
     * @access  public
     * @param   array   $params
     */
    public function init($params = array())
    {
        parent::init($params);

        $this->_errored = false;
    }




    /* 検証処理用機能群 ----------------------------------------------------------------------------------------------------*/

    protected $_log = ''; // 検証ログ
    protected $_tmp = array(
        'medias' => array()
    );


    /**
     * 検証グラフィック用出力
     *
     * @access  public
     * @return  string
     */
    public function dump()
    {
        $maze_html  = array();
        $range_Y  = range(0, $this->rgon_side * $this->rgon_scales['Y'] - 1);
        $range_X  = range(0, $this->rgon_side * $this->rgon_scales['X'] - 1);
        $gate_conds = array(
            'T' => '31000',
            'R' => '30100',
            'B' => '30010',
            'L' => '30001'
        );
        $inters = array();
        $prevs  = array();
        foreach($this->_road_tiles as $road){
            foreach(range($road->edges['T'], $road->edges['B']) as $Y){
                foreach(range($road->edges['R'], $road->edges['L']) as $X){
                    $prevs[$Y] = isset($prevs[$Y]) ? $prevs[$Y] : array();
                    $prevs[$Y][$X] = true;
                }
            }
        }

        foreach($range_Y as $Y){
            $line_html = sprintf('<div class="s"><div id="sect_%d_l">%d</div></div>', $Y, $Y);
            foreach($range_X as $X){
                $sect_type = $this->_sect_tiles[$Y][$X];
                switch($sect_type){
                    case $this->_type_wall:
                        $is_room_area_Y = ($Y % $this->rgon_side) < $this->rgon_side;
                        $is_room_area_X = ($X % $this->rgon_side) < $this->rgon_side;
                        $cond = ($is_room_area_Y && $is_room_area_X) ? $sect_type : '1';
                        break;
                    case $this->_type_room:
                        $cond = $sect_type;
                        foreach($gate_conds as $aim => $plus_cond){
                            list($trgt_Y, $trgt_X) = $this->_slide($Y, $X, $aim);
                            $trgt_cond = isset($this->_sect_tiles[$trgt_Y][$trgt_X]) ? $this->_sect_tiles[$trgt_Y][$trgt_X] : 0;
                            switch($trgt_cond){
                                case $this->_type_wall:      $cond .= 0;   break;
                                case $this->_type_room:      $cond .= 1;   break;
                                case $this->_type_stir_prev: $cond .= 1;   break;
                                case $this->_type_stir_next: $cond .= 1;   break;
                                case $this->_type_road:      $cond .= 'r'; break;
                            }
                        }
                        break;
                    case $this->_type_road:
                        $cond = $sect_type;
                        foreach($this->_getAims() as $aim){
                            list($trgt_Y, $trgt_X) = $this->_slide($Y, $X, $aim);
                            $trgt_cond = isset($this->_sect_tiles[$trgt_Y][$trgt_X]) ? $this->_sect_tiles[$trgt_Y][$trgt_X] : 0;
                            switch($trgt_cond){
                                case 0:                 $cond .= 0; break;
                                case $this->_type_wall: $cond .= 0; break;
                                case $this->_type_room: $cond .= 1; break;
                                case $this->_type_road: $cond .= 1;
                            }
                        }
                        break;
                    case $this->_type_stir:
                        $cond = 's1111';
                        break;
                }

                switch(true){
                    case isset($inters[$Y][$X]):
                        $text = '★'; break;
                    case isset($this->_tmp['medias'][$Y][$X]):
                        $text = '◆'; break;
                    case isset($prevs[$Y][$X]):
                        $text = '□'; break;
                    default:
                        $text = '　';
                }
                $line_html .= sprintf('<div class="s s%s"><div id="sect_%d_%d">%s</div></div>', $cond, $Y, $X, $text);
            }
            $line_html .= sprintf('<div class="s sxxxxo"><div id="sect_%d_r">%d</div></div><div class="c"></div>', $Y, $Y);
            $maze_html[] = $line_html;
        }

        $line_head_html = '<div class="s"></div>';
        $line_foot_html = '<div class="s"></div>';
        foreach($range_X as $X){
            $line_head_html .= sprintf('<div class="s">'        . '<div id="sect_t_%d">%d</div></div>', $X, $X);
            $line_foot_html .= sprintf('<div class="s sxoxxx">' . '<div id="sect_b_%d">%d</div></div>', $X, $X);
        }
        $line_head_html .= '<div class="c"></div>';
        $line_foot_html .= '<div class="s sxxxxx"></div><div class="c"></div>';

        array_unshift($maze_html, $line_head_html);
        array_push($maze_html, $line_foot_html);
        $maze_html = implode("\n", $maze_html);

        return sprintf('---#|#%s#|#%s#|#%s',
            $maze_html,
            preg_replace('/(<br \/>)+/', '<br />', $this->_log),
            ($this->_errored ? 'T' : 'F')
        );
    }


    /**
     * 
     *
     * @access  protected
     */
    protected function _e()
    {
        $this->_errored = true;
    }


    /**
     * 
     *
     * @access  public
     * @return  array
     */
    public function convertParams()
    {
        $params  = array();
        $request = $_POST;
        $needs   = array(
            'region_y'       => 3,
            'region_x'       => 3,
            'unit_size'      => 5,
            'room_count'     => 3,
            'room_side_max'  => 2,
            'room_pdng_min'  => 0,
            'room_pdng_max'  => 2,
            'room_area_disp' => array(
                1 => 6,
                2 => 3,
                3 => 2,
                4 => 2
            )
        );

        foreach($needs as $name => $default){
            if(isset($request[$name])){
                $value = $request[$name];
                switch($name){
                    case 'room_area_disp':
                        $value = $default;
                        break;
                }
            }else{
                $value = $default;
            }
            $params[$name] = $value;
        }

        return $params;
    }




    /* 検証処理用関数群 ----------------------------------------------------------------------------------------------------*/

    /**
     * 
     *
     * @access  public
     * @param   
     */
    protected function   _l(){ $this->_lp(func_get_args(), '');  }
    protected function  _ll(){ $this->_lp(func_get_args(), '|'); }
    protected function  _lb(){ $this->_lp(func_get_args(), '');  $this->_log .= '<br />'; }
    protected function _llb(){ $this->_lp(func_get_args(), '|'); $this->_log .= '<br />'; }
    protected function _llh(){ $this->_lp(func_get_args(), '|'); $this->_log .= '<hr />'; }
    protected function  _lp($vars, $cutter)
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




if(! isset($_POST['pursuite'])){
    if(isset($_GET['error'])){
        session_start();
        unset($_SESSION['count']);
    }
    else{
        $labyrinth = new Labyrinth_Test();
        $labyrinth->init($labyrinth->convertParams());
        $labyrinth->build();
        //$labyrinth->setStair();
        echo $labyrinth->dump();
    }
}
