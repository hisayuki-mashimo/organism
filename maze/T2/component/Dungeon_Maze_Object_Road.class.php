<?php
/**
 * 迷路: オブジェクト: 道
 * 
 * @package     Dungeon
 * @subpackage  Maze
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 * @version     $Id: ee53292abb87c8417a85787652818930f022cf3f $
 */
class Dungeon_Maze_Object_Road extends Dungeon_Maze_Object
{
    /**
     * 開かれているかどうか
     *
     * @access  private
     * @var     boolean
     */
    private $_opened = false;
    
    /**
     * おいてあるアイテム
     *
     * @access  private
     * @var     Dungeon_Data_Item
     */
    private $_item;
    

    /**
     * コンストラクタ
     *
     * @access  public
     */
    public function __construct()
    {
        $this->type = Dungeon::MAZE_OBJECT_ROAD;
    }



    /**
     * オープンする
     *
     * @access  public
     */
    public function open()
    {
        $this->_opened = true;
    }
    


    /**
     * アイテムをセットする
     *
     * @access  public
     */
    public function setItem($item)
    {
       $this->_item = $item;
    }
    


    /**
     * アイテムを取得する
     *
     * @access  public
     */
    public function getItem()
    {
       return $this->_item;
    }
    
    
    /**
     * アイテムを消す
     *
     * @access  public
     */
    public function lostItem()
    {
       $this->_item = NULL;
    }


    /**
     * @override
     */
    public function isOpened()
    {
        return $this->_opened;
    }
    
    

    /**
     * @override
     */
    public function enableMoveOn()
    {
        return true;
    }
}

