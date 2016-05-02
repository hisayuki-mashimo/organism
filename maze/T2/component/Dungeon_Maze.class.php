<?php
/**
 * 迷路実体
 * 
 * @package     Dungeon
 * @subpackage  Maze
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 * @version     $Id: 383c42aac5e1c324c9b9f9a2c0b2237ca73f1cb1 $
 */
class Dungeon_Maze
{
    /**
     * matrix
     *
     * @access  public
     * @var     object  Dungeon_Maze_Matrix
     */
    public $matrix;

    /**
     * 道路リスト
     *
     * @access  private
     * @var     array
     */
    private $_roads = array();
    //private $_free_roads = array();

    /**
     * 部屋リスト
     *
     * @access  private
     * @var     array
     */
    private $_rooms = array();
    //private $_free_rooms = array();

    /**
     * @dependencies
     */
    public $MazeManager;
    public $ItemManager;


    /**
     * コンストラクタ
     *
     * @access  public
     */
    public function __construct()
    {
        
    }


    /**
     * 初期化(すべて壁で埋める)
     *
     * @access  public
     */
    public function init($width, $height)
    {
        $this->matrix = new Dungeon_Maze_Matrix($width, $height);
        for($y = 0; $y < $height; $y++){
            for($x = 0; $x < $width; $x++){
                $this->matrix->setObject($x, $y, $this->MazeManager->getWallObject());
            }
        }
    }


    /**
     * オブジェクトを取得する
     *
     * @access  public
     * @param   int     $x
     * @param   int     $y
     * @return  object  Dungeon_Maze_Object
     */
    public function getObject($x, $y)
    {
        if($this->matrix->hasObject($x, $y)){
            return $this->matrix->getObject($x, $y);
        } else {
            return $this->MazeManager->getWallObject();
        }
    }


    /**
     * オブジェクトをセットする
     *
     * @access  public
     * @param   int     $x
     * @param   int     $y
     * @param   object  $object Dungeon_Maze_Object
     */
    public function setObject($x, $y, Dungeon_Maze_Object $object)
    {
        $this->matrix->setObject($x, $y, $object);
        $object->setMaze($this);
        if($object->isRoad() || $object->isTreasureBox()){
            $this->_roads[] = $object;
            //$this->_free_roads[] = $object;
        } elseif($object->isRoom()){
            $room_coordinate = $object->getRoomCoordinate();
            if(! isset($this->_rooms[$room_coordinate])){
            //if(! isset($this->_free_rooms[$room_coordinate])){
                $this->_rooms[$room_coordinate] = array();
                //$this->_free_rooms[$room_coordinate] = array();
            }
            $this->_rooms[$room_coordinate][] = $object;
            //$this->_free_rooms[$room_coordinate][] = $object;
        }
    }


    /**
     * 地図上の道のオブジェクトを取得
     *
     * @access  public
     * @param   object  $object Dungeon_Maze_Object_Road
     */
    public function getRoad()
    {
        return $this->_roads;
    }


    /**
     * 道路をランダムに取得
     *
     * @access  public
     * @return  object  Dungeon_Maze_Object_Road
     */
    public function getRoadByRandom()
    {
        return $this->_roads ? $this->_roads[array_rand($this->_roads)] : NULL;
    }


    /**
     * 地図上の部屋のオブジェクトを取得
     *
     * @access  public
     * @param   object  $object Dungeon_Maze_Object_Room
     */
    public function getRoom()
    {
        return $this->_rooms;
    }


    /**
     * 部屋をランダムに取得
     *
     * @access  public
     * @return  object  Dungeon_Maze_Object_Room
     */
    public function getRoomByRandom()
    {
        return $this->_rooms ? $this->_rooms[array_rand($this->_rooms)] : NULL;
    }




    /**
     * マスをオープンする
     *
     * @access  public
     * @param   int     $x
     * @param   int     $y
     */
    public function open($x, $y)
    {
        $object = $this->getObject($x, $y);
        if(!$object->enableMoveOn()) throw new Dungeon_Exception('Unable to move on this object.');
        $object->open();
    }


    /**
     * マスにセットされているオブジェクトを一覧で取得
     *
     * @access  public
     * return StringMatirxsd
     */
    public function getMatrixObjects()
    {
        /*$objects = array();
        $con = 0;

        $matrix_objects = $this->_roads;
        foreach($this->_rooms as $coordinate => $_objects){
            $matrix_objects = array_merge($matrix_objects, $_objects);
        }
        foreach($matrix_objects as $obj){
            if($obj->type == Dungeon::MAZE_OBJECT_ROAD){
                if($item = $obj->getItem()){
                    $objects[$con]['item']['coordinate'] = $obj->getCoordinate();
                    $objects[$con]['item']['item_id'] = $item->id;
                    $con++;
                }
            }else if($obj->type == Dungeon::MAZE_OBJECT_TREASUREBOX){
                if($item = $obj->getItem()){
                    $objects[$con]['treasurebox']['coordinate'] = $obj->getCoordinate();
                    $objects[$con]['treasurebox']['item_id'] = $item->id;
                    $objects[$con]['treasurebox']['backtodungeon'] = $obj->isBackToDungeon() ? 'true' : 'false';
                    $con++;
                }
            }
        }
        return $objects;*/
        return array();
    }


    /**
     * 開かれたマスを復元
     *
     * @access  public
     * return StringMatirxsd
     */
    public function revartOpen($opened_matrix)
    {
        foreach(explode("\n", $opened_matrix) as $y => $line){
            for($x = 0; $x < strlen($line); $x++){
                if($line[$x] && $this->getObject($x, $y)->type){
                    $this->open($x, $y);
                }
            }
        }
    }


    /**
     * アイテムの復元(ﾄﾗｯﾌﾟとかも)
     *
     * @access  public
     * return StringMatirxsd
     */
    public function revartObject($matrix_object)
    {
        foreach($matrix_object as $items){
            //アイテム
            if(isset($items['item'])){
                list($x,$y) = explode(',',$items['item']['coordinate']);
                $obj = $this->matrix->getObject($x, $y);
                $obj->setItem($this->ItemManager->get($items['item']['item_id']));
            }
            //宝箱
            else if(isset($items['treasurebox'])){
                list($x,$y) = explode(',',$items['treasurebox']['coordinate']);
                $obj = $this->matrix->getObject($x, $y);
                //TODO設定ファイル
                if($items['treasurebox']['backtodungeon']) $obj->setBackToDungeon();
                $obj->setItem($this->ItemManager->get($items['treasurebox']['item_id']));
            }
        }
    }




    /**
     * 文字列に変換する
     *
     * @access  public
     * @return  string
     */
    public function toString()
    {
        $lines = array();
        for($y = 0; $y < ($this->matrix->height); $y++){
            $lines[$y] = '';
            for($x = 0; $x < ($this->matrix->width); $x++){
                $lines[$y] .= $this->getObject($x, $y)->type;
            }
        }
        return join("\n", $lines);
    }


    /**
     * 開かれたやつ用の文字列に変換する
     *
     * @access  public
     * @return  string
     */
    public function toOpenedString()
    {
        $lines = array();
        for($y = 0; $y < ($this->matrix->height); $y++){
            $lines[$y] = '';
            for($x = 0; $x < ($this->matrix->width); $x++){
                $lines[$y] .= $this->getObject($x, $y)->isOpened() ? '1' : '0';
            }
        }
        return join("\n", $lines);
    }


    /**
     * 配列に変換する
     *
     * @access  public
     * @return  array
     */
    public function toArray()
    {
        return $this->matrix->toArray();
    }
}
