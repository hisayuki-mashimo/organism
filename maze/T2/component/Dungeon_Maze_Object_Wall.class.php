<?php
/**
 * 迷路: オブジェクト: 壁
 * 
 * @package     Dungeon
 * @subpackage  Maze
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 * @version     $Id: 724a992cc5fe5d29cea7c3da39a9e4bac75498a5 $
 */
class Dungeon_Maze_Object_Wall extends Dungeon_Maze_Object
{
    /**
     * コンストラクタ
     *
     * @access  public
     */
    public function __construct($value = Dungeon::MAZE_OBJECT_WALL)
    {
        $this->type = Dungeon::MAZE_OBJECT_WALL;
    }
}

