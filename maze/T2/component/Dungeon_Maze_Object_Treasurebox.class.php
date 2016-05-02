<?php
/**
 * [[機能説明]]
 * 
 * @package     Dungeon
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 * @version     $Id: 3a713f6a132644e0a5f2b86a6767bdfe7bc0c9da $
 */
class Dungeon_Maze_Object_Treasurebox extends Dungeon_Maze_Object
{
    /**
     * 開かれているかどうか
     *
     * @access  private
     * @var     boolean
     */
    private $_opened = false;
    
    
    /**
     * 開いたときに帰るかどうか
     *
     * @access  private
     * @var     boolean
     */
    private $_back_to_dungeon = false;
    
    /**
     * おいてあるアイテム
     *
     * @access  private
     * @var     Dungeon_Data_Item
     */
    private $_item;
    
    
    /**
     * @
     */
    public $ItemManager;
    
    /**
     * コンストラクタ
     *
     * @access  public
     */
    public function __construct()
    {
        $this->type = Dungeon::MAZE_OBJECT_TREASUREBOX;
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
       //TODO どうしようか
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
    

    
    
    /**
     * @override
     */
    public function setBackToDungeon($flg = true)
    {
        $this->_back_to_dungeon = $flg;
    }
    
    /**
     * @override
     */
    public function isBackToDungeon()
    {
        return $this->_back_to_dungeon;
    }
}

