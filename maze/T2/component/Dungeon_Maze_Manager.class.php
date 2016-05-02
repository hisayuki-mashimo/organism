<?php
/**
 * 迷路管理クラス
 * 
 * @package     Dungeon
 * @subpackage  Maze
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 * @author      MASHIMO Hisayuki <hisayuki.mashimo@befool.co.jp>
 * @version     $Id: da4864d03f5e0647e781d818d7402565044cf8d1 $
 */
class Dungeon_Maze_Manager extends Labyrinth_Test
{
    private $_stairs;   // 階段の座標


    /**
     * 再作成
     *
     * @access  public
     * @return  object  Dungeon_Maze
     */
    public function remake($string_matrix){
        
        $maze = new Dungeon_Maze();
        //Samurai::getContainer()->injectDependency($maze);
        $maze->MazeManager = $this; // 仮
        $maze->init($this->nex, $this->ver);

        foreach(explode("\n", $string_matrix) as $y => $line){
            foreach(str_split($line) as $x){
                $maze->setObject($x, $y, $this->getObjectByChar($x));
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
        //Samurai::getContainer()->injectDependency($maze);
        $maze->MazeManager = $this; // 仮
        $maze->init(
            ($this->rgon_side * $this->rgon_ver),
            ($this->rgon_side * $this->rgon_nex)
        );

        //迷路構成
        $this->build();
        $maze_string = $this->export();
        foreach(explode("\n", $maze_string) as $y => $line){
            foreach(str_split($line) as $x => $type){
                $maze->setObject($x, $y, $this->getObjectByChar($type));
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
        case Dungeon::MAZE_OBJECT_ROOM:
            $obj = new Dungeon_Maze_Object_Room();
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
     * 構築
     *
     */
    public function build()
    {
        parent::build();

        // 階段の設定
        //if(!$this->isBottom()){
            //$chain_stairs = $this->room_chain[array_rand($this->room_chain)];
            //$this->_stairs = array_rand($chain_stairs);
        //}
    }


    public function export()
    {
        $lines = array();

        $sects = $this->_sect_tiles;
        $ver_range = range(0, ($this->rgon_side * $this->rgon_ver - 1));
        $nex_range = range(0, ($this->rgon_side * $this->rgon_nex - 1));

        foreach($ver_range as $ver){
            $line = '';
            foreach($nex_range as $nex){
                switch($sects[($ver . '_' . $nex)]['type']){
                    case $this->_type_wall: $line .= Dungeon::MAZE_OBJECT_WALL; break;
                    case $this->_type_road: $line .= Dungeon::MAZE_OBJECT_ROAD; break;
                    case $this->_type_room: $line .= Dungeon::MAZE_OBJECT_ROOM; break;
                    case $this->_type_gate: $line .= Dungeon::MAZE_OBJECT_ROOM;
                }
            }
            $lines[] = $line;
        }

        return implode("\n", $lines);
    }
}
