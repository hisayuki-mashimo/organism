<?php
/**
 * 迷路: オブジェクト: 部屋
 * 
 * @package     Dungeon
 * @subpackage  Maze
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 * @version     $Id: ee53292abb87c8417a85787652818930f022cf3f $
 */
class Dungeon_Maze_Object_Room extends Dungeon_Maze_Object
{
    /**
     * 開かれているかどうか
     *
     * @access  private
     * @var     boolean
     */
    private $_opened = false;

    /**
     * 開かれているかどうか
     *
     * @access  private
     * @var     boolean
     */
    private $_room_coordinate;

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
        $this->type = Dungeon::MAZE_OBJECT_ROOM;
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
     * 属する部屋を取得する
     *
     * @access  public
     */
    public function getRoomCoordinate()
    {
        return $this->_room_coordinate;
    }


    /**
     * 属する部屋を指定する
     *
     * @access  public
     */
    public function setRoomCoordinate($x, $y)
    {
        $this->_room_coordinate = $x . '_' . $y;
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
