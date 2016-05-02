<?php
/**
 * 迷路: オブジェクト: 階段
 * 
 * @package     Dungeon
 * @subpackage  Maze
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 * @version     $Id: a33dd3a0f520a9e1ac8b129a9716c5b1d64029d4 $
 */
class Dungeon_Maze_Object_Stairs extends Dungeon_Maze_Object_Road
{
    /**
     * コンストラクタ
     *
     * @access  public
     */
    public function __construct()
    {
        $this->type = Dungeon::MAZE_OBJECT_STAIRS;
    }
}

