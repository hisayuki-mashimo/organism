<?php
/**
 * $squares : 縦*横の枡を格納した配列。[0.0]～[n.n]というキーを持った擬似連想配列の形で構成される。
 * 各々の枡は以下の3種類のプロパティとして分類され、各々が配列として初期配置される。
 *  ①支柱プロパティ
 *      [(偶数).(偶数)]に該当する枡が該当する（0からスタートするため）。値の種類は以下の通り。
 *          'road'      : 壁として定義されていない状態の値。
 *          'wall.(ID)' : 壁として定義された状態の値。(ID)は自身が属している壁のＩＤ。
 *  ②壁／通路可変プロパティ
 *      [(偶数).(奇数)]または[(奇数).(偶数)]に該当する枡が該当する。値の種類は以下の通り。
 *          false：通路である場合。
 *          true ：壁である場合。
 *  ③通路プロパティ
 *      [(奇数).(奇数)]に該当する枡が該当する。①／②以外のプロパティ。値は以下に固定される。
 *          null
 * defineAim : 自身の壁を拡張する方向をランダムで決定する関数
 *          defineAimで決まった方向で対象枡の2枡先にある枡（それは必ず支柱プロパティになる）が、自身と同じBの値を持っている場合、拡張不可をreturnする。
 *
 
 
 
 
 
 
 
 * 迷路作成モデル
 * 
 * 迷路情報を保持するプロパティ
 *  $squares
 *      [0.0]～[v.n]というキーを持った擬似連想配列の形で構成される。
 *      値は個々がSPANノードで表現され、最終的にHTMLに直接出力される方法で迷路を表現する。
 *      個々のプロパティはクラス属性によって以下の3種類に分類される。
 *          ①壁クラス(class='wall')
 *          ②通路クラス(class='road')
 *          ③解法通路クラス(class='solute')
 * 
 * 迷路を形成する過程
 *  Ⅰ __construct
 *      ・迷路の規定値の形成
 *      ・迷路形成の為のプロパティの作成
 *          $squares
 *          $_squares
 *              試作壁の情報を保存する為のプロパティ
 *          $_pillars
 *              迷路の枡の中で、壁の起点となる支柱の情報を格納するプロパティ。$squaresと共通の形のキーを持ち、同一の枡を特定できる。
 *          $__pillars
 *              試作壁の起点の情報を保存する為のプロパティ
 *  Ⅱ build
 *      ・壁の形成
 *      Ⅱ-ⅰ _getTargetPillar
 *          ・支柱プロパティ群($_pillars)から、壁として定義されていない枡をランダムに選ぶ。
 *      Ⅱ-ⅱ _build_prepare
 *          ・
 *          Ⅱ-ⅱ-ⅰ _makeWall
 *              ・
 *  Ⅲ searchSolution
 *      Ⅲ-ⅰ _searchSolution
 *  
 */
Class maze
{
    public
        $squares = array();
    public
        $ver_count,
        $nex_count;
    public
        $solution = array();
    public
        $wall_value   = "<SPAN class='wall'>■</SPAN>",
        $road_value   = "<SPAN class='road'>■</SPAN>",
        $solute_value = "<SPAN class='solute'>■</SPAN>";
    private
        $_squares  = array(),
        $_pillars  = array(),
        $__pillars = array(),
        $_wall_ids = array(),
        $_wall_id;
    
    
    /**
     * 迷路の初期構成の構築
     */
    public function __construct($ver_count=100, $nex_count=100)
    {
        //縦･横の枡数の設定
        $this->ver_count = $ver_count;
        $this->nex_count = $nex_count;
        //縦の配列を設定する。
        for($ver = 0; $ver <= $this->ver_count; $ver++){
            //横の配列を設定する。
            for($nex = 0; $nex <= $this->nex_count; $nex++){
                if($ver == 0 || $ver == $this->ver_count || $nex == 0 || $nex == $this->nex_count){
                //四方の端を壁にする。
                    $this->squares["{$ver}.{$nex}"] = $this->_buildSquareText('wall', $nex);
                    if($ver%2 == 0 && $nex%2 == 0) $this->_pillars["{$ver}.{$nex}"] = 'wall.0';
                } elseif($ver%2 == 0 && $nex%2 == 0){
                //支柱プロパティを設定する。
                    $this->squares["{$ver}.{$nex}"]  = $this->_buildSquareText('wall');
                    $this->_pillars["{$ver}.{$nex}"] = 'road';
                } else{
                //通路プロパティを設定する。
                    $this->squares["{$ver}.{$nex}"] = $this->_buildSquareText('road');
                }
            }
        }
    }
    
    
    
    
    
    /**
     * 迷路の形成
     */
    public function build()
    {
        $this->_squares  = $this->squares;
        $this->__pillars = $this->_pillars;
        while($target_pillar_key = $this->_getTargetPillar()){
            $this->_build_prepare($target_pillar_key);
        }
    }
    
    
    /**
     * 迷路形成の準備設定
     */
    private function _build_prepare($target_pillar_key)
    {
        $this->_wall_id = 'wall.'.(count($this->_wall_ids)+1);
        $this->_squares[$target_pillar_key]  = $this->_buildSquareText('wall');
        $this->__pillars[$target_pillar_key] = $this->_wall_id;
        while(isset($target_pillar_key)){
            $target_pillar_key = $this->_makeWall($target_pillar_key);
        }
    }
    
    
    /**
     * ランダムに未定義の支柱プロパティを取得する。
     */
    private function _getTargetPillar()
    {
        $target_pillars = array();
        foreach($this->__pillars as $key => $value){
            if($value == 'road') $target_pillars[$key] = true;
        }
        return array_rand($target_pillars);
    }
    
    
    private function _makeWall($target_pillar_key)
    {
        list($ver, $nex) = explode('.', $target_pillar_key);
        if($aim = $this->_getAim($ver, $nex)){
            switch($aim){
                case 'on':
                    $next_wall_key   = ($ver-1).'.'.$nex;
                    $next_pillar_key = ($ver-2).'.'.$nex;
                    break;
                case 'right':
                    $next_wall_key   = $ver.'.'.($nex+1);
                    $next_pillar_key = $ver.'.'.($nex+2);
                    break;
                case 'under':
                    $next_wall_key   = ($ver+1).'.'.$nex;
                    $next_pillar_key = ($ver+2).'.'.$nex;
                    break;
                case 'left':
                    $next_wall_key   = $ver.'.'.($nex-1);
                    $next_pillar_key = $ver.'.'.($nex-2);
                    break;
            }
            $this->_squares[$next_wall_key] = $this->_buildSquareText('wall');
            if($this->__pillars[$next_pillar_key] == 'road'){
            //壁が四方の壁に到達していなければ、壁の形成を続ける。
                $this->__pillars[$next_pillar_key] = $this->_wall_id;
                return $next_pillar_key;
            } else{
                $this->squares  = $this->_squares;
                $this->_pillars = $this->__pillars;
                array_push($this->_wall_ids, $this->_wall_id);
            }
        } else{
        //進行可能な進路がない場合、壁の形成に失敗
            $this->_squares = $this->squares;
            $this->__pillars = $this->_pillars;
        }
    }
    
    
    /**
     * 壁の進行可能方向を探し、ランダムに方向を決定する。
     */
    private function _getAim($ver, $nex)
    {
        $pillar_key_on    = ($ver-2).'.'.$nex;
        $pillar_key_right = $ver.'.'.($nex+2);
        $pillar_key_under = ($ver+2).'.'.$nex;
        $pillar_key_left  = $ver.'.'.($nex-2);
        $aims = array();
        if($this->__pillars[$pillar_key_on]    != $this->_wall_id) $aims['on']    = true;
        if($this->__pillars[$pillar_key_right] != $this->_wall_id) $aims['right'] = true;
        if($this->__pillars[$pillar_key_under] != $this->_wall_id) $aims['under'] = true;
        if($this->__pillars[$pillar_key_left]  != $this->_wall_id) $aims['left']  = true;
        if(!empty($aims)) return array_rand($aims);
    }
    
    
    /**
     * 枡テキストの構築
     */
    private function _buildSquareText($square_value, $nex=null)
    {
        switch($square_value){
            case 'wall': $square_text = $this->wall_value; break;
            case 'road': $square_text = $this->road_value; break;
        }
        if($nex && $nex == $this->nex_count) $square_text = $square_text.'<BR />';
        return $square_text;
    }
    
    
    /**
     * 迷路の出力
     */
    public function output()
    {
        return implode('', $this->squares);
    }
    
    
    
    
    
    /**
     * 解法を探す。
     */
    public function searchSolution($start_ver=null, $start_nex=null, $goal_ver=null, $goal_nex=null, $road_aim='under')
    {
        if(!$start_ver) $start_ver = 1;
        if(!$start_nex) $start_nex = 1;
        if(!$goal_ver)  $goal_ver  = $this->ver_count-1;
        if(!$goal_nex)  $goal_nex  = $this->nex_count-1;
        $is_goal = false;
        while($is_goal == false){
            list($start_ver, $start_nex, $road_aim) = $this->_searchSolution($start_ver, $start_nex, $road_aim);
            if($start_ver == $goal_ver && $start_nex == $goal_nex) $is_goal = true;
        }
        $this->squares["{$goal_ver}.{$goal_nex}"] = $this->solute_value;
    }
    
    
    /**
     *
     */
    private function _searchSolution($start_ver, $start_nex, $road_aim)
    {
        $wall_value   = $this->wall_value;
        $road_value   = $this->road_value;
        $solute_value = $this->solute_value;
        $square_key = "{$start_ver}.{$start_nex}";
        $this->squares[$square_key] = $solute_value;
        if($road_aim == 'under'){
            $square_left  = $start_ver.'.'.($start_nex+1);
            $square_front = ($start_ver+1).'.'.$start_nex;
            $square_right = $start_ver.'.'.($start_nex-1);
            $square_back  = ($start_ver-1).'.'.$start_nex;
            $road_left  = array('ver' => $start_ver,   'nex' => $start_nex+2);
            $road_front = array('ver' => $start_ver+2, 'nex' => $start_nex);
            $road_right = array('ver' => $start_ver,   'nex' => $start_nex-2);
            $road_back  = array('ver' => $start_ver-2, 'nex' => $start_nex);
            $aims = array('left' => 'right', 'front' => 'under', 'right' => 'left', 'back' => 'on');
        } elseif($road_aim == 'left'){
            $square_left  = ($start_ver+1).'.'.$start_nex;
            $square_front = $start_ver.'.'.($start_nex-1);
            $square_right = ($start_ver-1).'.'.$start_nex;
            $square_back  = $start_ver.'.'.($start_nex+1);
            $road_left  = array('ver' => $start_ver+2, 'nex' => $start_nex);
            $road_front = array('ver' => $start_ver,   'nex' => $start_nex-2);
            $road_right = array('ver' => $start_ver-2, 'nex' => $start_nex);
            $road_back  = array('ver' => $start_ver,   'nex' => $start_nex+2);
            $aims = array('left' => 'under', 'front' => 'left', 'right' => 'on', 'back' => 'right');
        } elseif($road_aim == 'on'){
            $square_left  = $start_ver.'.'.($start_nex-1);
            $square_front = ($start_ver-1).'.'.$start_nex;
            $square_right = $start_ver.'.'.($start_nex+1);
            $square_back  = ($start_ver+1).'.'.$start_nex;
            $road_left  = array('ver' => $start_ver,   'nex' => $start_nex-2);
            $road_front = array('ver' => $start_ver-2, 'nex' => $start_nex);
            $road_right = array('ver' => $start_ver,   'nex' => $start_nex+2);
            $road_back  = array('ver' => $start_ver+2, 'nex' => $start_nex);
            $aims = array('left' => 'left', 'front' => 'on', 'right' => 'right', 'back' => 'under');
        } elseif($road_aim == 'right'){
            $square_left  = ($start_ver-1).'.'.$start_nex;
            $square_front = $start_ver.'.'.($start_nex+1);
            $square_right = ($start_ver+1).'.'.$start_nex;
            $square_back  = $start_ver.'.'.($start_nex-1);
            $road_left  = array('ver' => $start_ver-2, 'nex' => $start_nex);
            $road_front = array('ver' => $start_ver,   'nex' => $start_nex+2);
            $road_right = array('ver' => $start_ver+2, 'nex' => $start_nex);
            $road_back  = array('ver' => $start_ver,   'nex' => $start_nex-2);
            $aims = array('left' => 'on', 'front' => 'right', 'right' => 'under', 'back' => 'left');
        }
        if(isset($this->squares[$square_left]) && ($this->squares[$square_left] == $road_value || $this->squares[$square_left] == $solute_value)){
            if($this->squares[$square_left] == $solute_value){
                $this->squares[$square_key]  = $road_value;
                $this->squares[$square_left] = $road_value;
            } else{
                $this->squares[$square_left] = $solute_value;
            }
            return array($road_left['ver'], $road_left['nex'], $aims['left']);
        } elseif(isset($this->squares[$square_front]) && ($this->squares[$square_front] == $road_value || $this->squares[$square_front] == $solute_value)){
            if($this->squares[$square_front] == $solute_value){
                $this->squares[$square_key]   = $road_value;
                $this->squares[$square_front] = $road_value;
            } else{
                $this->squares[$square_front] = $solute_value;
            }
            return array($road_front['ver'], $road_front['nex'], $aims['front']);
        } elseif(isset($this->squares[$square_right]) && ($this->squares[$square_right] == $road_value || $this->squares[$square_right] == $solute_value)){
            if($this->squares[$square_right] == $solute_value){
                $this->squares[$square_key]   = $road_value;
                $this->squares[$square_right] = $road_value;
            } else{
                $this->squares[$square_right] = $solute_value;
            }
            return array($road_right['ver'], $road_right['nex'], $aims['right']);
        } else{
            $this->squares[$square_key]  = $road_value;
            $this->squares[$square_back] = $road_value;
            return array($road_back['ver'], $road_back['nex'], $aims['back']);
        }
    }
}
?>
