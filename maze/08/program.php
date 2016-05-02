<?php
require_once '/home/zhen-xia/public_html/sanbou/sanbou.php';
/**
 * 迷路管理クラス
 * @package     Dungeon
 * @subpackage  Maze
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 * @author      MASHIMO Hisayuki <hisayuki.mashimo@befool.co.jp>
 * @version     $Id: 44e74701ce05d4d9616ce8e471234e7e429f8eac $
 */
class Dungeon_Maze_Manager
{
    /** 設定用変数 **/
    private $room_count     = 0;    // 部屋の数
    private $room_scale_max = 1;    // 部屋の規模の最大値
    private $ver            = 15;   // 区画の縦数
    private $nex            = 15;   // 区画の横数

    /** 内部処理用変数 **/
    private $inner_ver  = 8;
    private $inner_nex  = 8;
    private $sections   = array();  // 区画データ
    private $room_chain = array();  // 連結部屋グループ
    private $gate_chain = array();  // 連結ゲートグループ
    private $type_wall  = 0;        // 区画タイプ: 壁
    private $type_gate  = 1;        // 区画タイプ: ゲート
    private $type_road  = 2;        // 区画タイプ: 道
    private $type_room  = 3;        // 区画タイプ: 部屋
    private $stairs     = '';       // 階段の座標
    public  $log        = '';
    public  $eee        = false;
    public  $count      = 0;

    /**
     * 難易度
     */
    public $difficulty;
    
    /**
     * 最下層
     */
    public $bottom;
    
    
    /**
     * コンストラクタ
     *
     * @access  public
     */
    public function __construct()
    {
        // 試験
        session_start();
        if(! isset($_SESSION['count'])){
            $_SESSION['count'] = 1;
        }
    }



    /**
     * 広さをセット
     *
     * @access  public
     * @param   int     $size
     */
    public function setSize($size)
    {
        $this->ver = $size;
        $this->nex = $size;
        $this->inner_ver = ceil($size / 2);
        $this->inner_nex = ceil($size / 2);
        $this->room_count = floor(($this->inner_ver + $this->inner_nex) / 2);
    }
    
    
    /**
     * 最下層のフラグをセット
     *
     * @access  public
     * @param   int     $size
     */
    public function setBottom($bottom)
    {
        $this->bottom = $bottom;
    }
    
    
    /**
     * 最下層の判定
     *
     * @access  public
     * @param   int     $size
     */
    public function isBottom()
    {
        return $this->bottom ? true : false;
    }


    /**
     * 難易度をセット
     *
     * @access  public
     * @param   int     $difficulty
     */
    public function setDifficulty($difficulty = 1)
    {
        $this->difficulty = $difficulty;
    }
    
    
    /**
     * 再作成
     *
     * @access  public
     * @return  object  Dungeon_Maze
     */
    public function remake($string_matrix){
        
        $maze = new Dungeon_Maze();
        Samurai::getContainer()->injectDependency($maze);
        $maze->init($this->nex, $this->ver);
        
        foreach(explode("\n", $string_matrix) as $y => $line){
            for($x = 0; $x < strlen($line); $x++){
                $maze->setObject($x, $y, $this->getObjectByChar($line[$x]));
            }
        }
        
        return $maze;
    }


    /**
     * 迷路を作成
     *
     * @access  public
     * @return  object  Dungeon_Maze
     */
    public function make()
    {
        //初期化
        $maze = new Dungeon_Maze();
        Samurai::getContainer()->injectDependency($maze);
        $maze->init($this->nex, $this->ver);

        //迷路構成
        $this->build();
        $maze_string = $this->export();
        foreach(explode("\n", $maze_string) as $y => $line){
            for($x = 0; $x < strlen($line); $x++){
                $maze->setObject($x, $y, $this->getObjectByChar($line[$x]));
            }
        }
        
        return $maze;
    }


    /**
     * 文字列からオブジェクトを取得
     *
     * @access  public
     * @param   string  $char
     * @return  object  Dungeon_Maze_Object
     */
    public function getObjectByChar($char)
    {
        switch($char){
        case Dungeon::MAZE_OBJECT_WALL:
            $obj = new Dungeon_Maze_Object_Wall();
            break;
        case Dungeon::MAZE_OBJECT_ROAD:
            $obj = new Dungeon_Maze_Object_Road();
            break;
        case Dungeon::MAZE_OBJECT_STAIRS:
            $obj = new Dungeon_Maze_Object_Stairs();
            break;
        case Dungeon::MAZE_OBJECT_TREASUREBOX:
            $obj = new Dungeon_Maze_Object_Treasurebox();
            break;
        }
        return $obj;
    }


    /**
     * 壁オブジェクトを返却
     *
     * @access  public
     * @return  object  Dungeon_Maze_Object_Wall
     */
    public function getWallObject()
    {
        return $this->getObjectByChar(Dungeon::MAZE_OBJECT_WALL);
    }
    
    
    /**
     * 全部０のマトリクス作成
     *
     * @access  public
     */
    public function makeDefaultMaze()
    {
        $defaultMatrix = '';
        
        for($row = 0;  $row < $this->row; $row++){
            for($col = 0; $col < $this->col; $col++){
                $defaultMatrix .= '0';
            }
            $defaultMatrix .= "\n";
        }
        return $defaultMatrix;
    }


    
    /**
     * 設定
     *
     * @param   array   $params 設定値
     */
    public function init($params)
    {
        // パラメータ設定
        if(isset($params['size'])){
            $this->setSize($params['size']);
        }
        if(isset($params['room_count'])){
            $this->room_count = $params['room_count'];
        }
        else{
            $this->room_count = floor(($this->inner_ver + $this->inner_nex) / 2);
        }
    }


    /**
     * 構築
     *
     */
    public function build($params = array())
    {
        if(! empty($params)){
            $this->init($params);
        }

        // 中心座標(必ず部屋が置かれる。)
        $center = $this->toCoord(
            floor($this->inner_ver / 2),
            floor($this->inner_nex / 2)
        );

        // 端座標(必ず一対の対角には必ず置かれる。)
        $edge_pairs = array(
            array($this->toCoord(0, 0), $this->toCoord($this->inner_ver - 1, $this->inner_nex - 1)),
            array($this->toCoord(0, $this->inner_nex - 1), $this->toCoord($this->inner_ver - 1, 0))
        );
        $edge_pair = $edge_pairs[array_rand($edge_pairs)];
        list($edge_1, $edge_2) = $edge_pair;

        // 区画データ構成
        $room_cands = array();
        $interval = ((($this->inner_ver + $this->inner_nex) / 2) >= 6) ? 4 : 2;
        for($v = 0; $v < $this->inner_ver; $v ++){
            for($n = 0; $n < $this->inner_nex; $n ++){
                $this->sections[$this->toCoord($v, $n)] = array(
                    'type' => $this->type_wall,
                    'cond' => 1111
                );
                if($v % $interval == 0 && $n % $interval == 0){
                    $coord = $this->toCoord($v, $n);
                    $room_cands[$coord] = true;
                }
            }
        }

        // 部屋構成
        $room_coords = array(
            0 => $center,
            1 => $edge_1,
            2 => $edge_2
        );
        $aims = array('top', 'rgt', 'btm', 'lft');
        unset($room_cands[$center]);
        unset($room_cands[$edge_1]);
        unset($room_cands[$edge_2]);
        foreach($aims as $aim){ unset($room_cands[$this->getCoord($center, $aim)]); }
        foreach($aims as $aim){ unset($room_cands[$this->getCoord($edge_1, $aim)]); }
        foreach($aims as $aim){ unset($room_cands[$this->getCoord($edge_2, $aim)]); }
        for($chain_id = 3; $chain_id < $this->room_count; $chain_id ++){
            if(empty($room_cands)){
                break;
            }
            $room_coord = array_rand($room_cands);
            $room_coords[$chain_id] = $room_coord;
            unset($room_cands[$room_coord]);
            foreach($aims as $aim){
                unset($room_cands[$this->getCoord($room_coord, $aim)]);
            }
        }
        if(($count = count($room_coords)) < $this->room_count){
            $this->room_count = $count;
        }

        $gate_count = 0;
        foreach($room_coords as $chain_id => $room_coord){
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
                
                
                // 既に他の部屋のゲートとして設定されている場合
                if($this->sections[$gate_coord]['type'] == $this->type_gate){
                    // ゲートチェインの統合
                    $another_room_coord = $this->sections[$gate_coord]['room'];
                    $another_chain_id   = $this->sections[$another_room_coord]['chain'];
                    foreach($this->room_chain[$another_chain_id] as $_room_coord => $gates){
                        $this->sections[$_room_coord]['chain'] = $chain_id;
                    }
                    if($chain_id != $another_chain_id){
                        $this->room_chain[$chain_id] += $this->room_chain[$another_chain_id];
                        $this->gate_chain[$chain_id] += $this->gate_chain[$another_chain_id];
                        unset($this->room_chain[$another_chain_id]);
                        unset($this->gate_chain[$another_chain_id]);
                    }
                }
                else{
                    $this->gate_chain[$chain_id][$gate_coord] = true;
                    $this->sections[$gate_coord]['room'] = $room_coord;
                    $this->sections[$gate_coord]['type'] = $this->type_gate;
                    $gate_count ++;
                }
                $this->room_chain[$chain_id][$room_coord][$aim] = $gate_coord;
                $this->headAim($this->sections[$gate_coord]['cond'], $aim);
                $this->comeAim($this->sections[$room_coord]['cond'], $aim);
            }
        }

        // 階段の設定
        if(!$this->isBottom()){
            $chain_stairs = $this->room_chain[array_rand($this->room_chain)];
            $this->stairs = array_rand($chain_stairs);
        }

        // ゲート同士の連結
        for($i = 0; $i < $gate_count; $i ++){
            $this->tieGate();
            if($this->eee != false){
                $this->log .=
                "<div style='border: solid 2px #FF0000' color: #00FF00>エラー" .
                "(前回エラーから" . $_SESSION['count'] . "回目)" .
                '<br />================================================================<br />' .
                "[strt_coord]: " . $this->eee . '<br />------------------<br />' .
                "[room_chain]: " . ve($this->room_chain, true) . '<br />------------------<br />' .
                "[gate_chain]: " . ve($this->gate_chain, true) . '<br />------------------<br />' .
                '<br />================================================================<br />' .
                "</div>";
                $_SESSION['count'] = 1;
                break;
            }
            if((empty($this->gate_chain)) && (count($this->room_chain) < 2)){
                break;
            }
        }
        $_SESSION['count'] = $_SESSION['count'] + 1;
        $this->count = $_SESSION['count'];
    }


    private function tieGate()
    {
        $strt_coord      = $this->specifyStartGate();
        $trgt_coord      = $this->specifyTargetGate($strt_coord);
        $this->log .= '<br />' . $strt_coord . '|' . $trgt_coord;
        if(! $trgt_coord){
            $this->eee = $strt_coord; return;
        }
        $strt_room_coord = $this->sections[$strt_coord]['room'];
        $trgt_room_coord = $this->sections[$trgt_coord]['room'];
        $strt_chain_id   = $this->sections[$strt_room_coord]['chain'];
        $trgt_chain_id   = $this->sections[$trgt_room_coord]['chain'];
        $crnt_coord      = $strt_coord;
        $prev_coord      = $strt_room_coord;

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

        $this->log .= '----' . $trgt_coord . '(' . $strt_chain_id . '|' . $trgt_chain_id . ')';
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
        $this->log .= preg_replace("/( |\r|\n)/", '', ve($this->gate_chain, true));
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


    /**
     * 連結先ゲートの指定
     *
     * @param   $strt_coord 連結元ゲート座標
     */
    private function specifyTargetGate($strt_coord)
    {
        $strt_room_coord = $this->sections[$strt_coord]['room'];
        $strt_chain_id   = $this->sections[$strt_room_coord]['chain'];
        $strt_room_chain = $this->room_chain[$strt_chain_id][$strt_room_coord];
        $trgt_gate_cands = array();
        $this->log .= '(' . $strt_room_coord . '}{' . $strt_chain_id . ')';
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
                //unset($gates[$i]);
                unset($trgt_gate_cands[$i]);
            }
            if(count($trgt_coord_cands) >= 7){
                break;
            }
        }
        //foreach($gates as $coord){
        foreach($trgt_gate_cands as $coord){
            if($coord == $strt_coord){
                continue;
            }
            $trgt_coord_cands[$coord] = true;
            if(count($trgt_coord_cands) >= 10){
                break;
            }
        }
        if(empty($trgt_coord_cands)){
            $this->log .=
                "<div style='border: solid 2px #00F00' color: #00FF00>エラー" .
                '<br />================================================================<br />' .
                "[trgt_gate_cands]: " . ve($trgt_gate_cands, true) .
                '<br />----------------------------------------------------------------<br />' .
                "[gates]: " . ve($gates, true) .
                '<br />================================================================<br />' .
                "</div>";
        }
        return array_rand($trgt_coord_cands);
    }


    private function getCoord($coord, $aim = null)
    {
        if(!preg_match('/_/', $coord)){
            vd($coord); dbt();
        }
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


    public function export()
    {
        $sections_texts = array();
        foreach($this->sections as $coord => $section){
            list($v, $n) = explode('_', $coord);
            if(! isset($sections_texts[$v * 2])){
                $sections_texts[$v * 2] = '';
                if($v != ($this->inner_ver - 1)){
                    $sections_texts[$v * 2 + 1] = '';
                }
            }
            $cond = $section['cond'];
            list($top, $rgt, $btm, $lft) = str_split($cond);
            if($cond == 1111){
                $sections_texts[$v * 2] .= Dungeon::MAZE_OBJECT_WALL;
            }
            else{
                if($coord == $this->stairs){
                    $sections_texts[$v * 2] .= Dungeon::MAZE_OBJECT_STAIRS;
                }
                else{
                    $sections_texts[$v * 2] .= Dungeon::MAZE_OBJECT_ROAD;
                }
            }
            if($v != ($this->inner_ver - 1)){
                if($btm == 1){
                    $sections_texts[$v * 2 + 1] .= Dungeon::MAZE_OBJECT_WALL;
                }
                else{
                    $sections_texts[$v * 2 + 1] .= Dungeon::MAZE_OBJECT_ROAD;
                }
                if($n != ($this->inner_nex - 1)){
                    $sections_texts[$v * 2 + 1] .= Dungeon::MAZE_OBJECT_WALL;
                }
            }
            if($n != ($this->inner_nex - 1)){
                if($rgt == 1){
                    $sections_texts[$v * 2] .= Dungeon::MAZE_OBJECT_WALL;
                }
                else{
                    $sections_texts[$v * 2] .= Dungeon::MAZE_OBJECT_ROAD;
                }
            }
        }
        ksort($sections_texts);
        return implode("\n", $sections_texts);
    }
    
    
    
    
    /**
     * 文字列マトリクスを配列に変換
     *
     * @access     public
     */
    public function convert2Array($matrixString)
    {
        $matrix = array();
        foreach(preg_split("/[\r\n]+/", $matrixString) as $line){
            
            $temp = preg_split('//', $line, -1, PREG_SPLIT_NO_EMPTY);
            $matrix[] = $temp;
        }
        
        return $matrix;
    }
    
    /**
     * 配列をマトリクスを文字列に変換
     *
     * @access     public
     */
    public function convert2String($matrix)
    {
        $string = "";
        foreach($matrix as $arr){
            foreach($arr as $val){
                $string .= $val->value;
            }
            $string .= "\n";
        }
        print 'convertString!';
        return $string;
    }


    public function dump()
    {
        $str = '';
        $n = 0;
        for($i = 0; $i < 8; $i ++){
            $str .= '<div class="section">' . $i . '</div>';
        }
        $str .= '<div class="clear"></div>';
        foreach($this->sections as $coord => $param){
            if($n == 0){
                
            }
            if($n != 0 && $n % 8 == 0){
                $str .= '<div class="section">' . (floor($n / 8) - 1) . '</div><div class="clear"></div>';
            }
            $str .= '<div class="section sect_' . $param['cond'] . '">';
            if($param['type'] == $this->type_gate){
                $str .= '<sran style="color: #0088FF">◆</span>';
            }
            elseif($param['type'] == $this->type_room){
                $str .= '<sran style="color: #FF8888">◆</span>';
            }
            $str .= '</div>';
            $n ++;
        }

        return $str;
    }
}


class Dungeon
{
    const MAZE_OBJECT_WALL        = 0;
    const MAZE_OBJECT_ROAD        = 1;
    const MAZE_OBJECT_STAIRS      = 2;
    const MAZE_OBJECT_TREASUREBOX = 3;
}


$maze = new Dungeon_Maze_Manager();
$maze->setSize(15, 15);
$maze->build();

?>




<div id="display">
    <div style="border: solid 2px #FF0088; width: 70px; height: 20px; text-align: center;"><?php echo $maze->count; ?>回目</div>
    <div id="labyrinth"><?php echo $maze->dump(); ?></div>
    <div id="export">
        <?php echo nl2br($maze->export()); ?>
    </div>
    <div class="clear"></div>
    <?php echo $maze->log; ?>
</div>
