<?php

class Labyrinth_Test extends Labyrinth
{
    /* 検証処理用機能群 ----------------------------------------------------------------------------------------------------*/

    protected $_log = ''; // 検証ログ


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
