<?php
/**
 * オブジェクト共通クラス
 * 
 * @package     Dungeon
 * @subpackage  Maze
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 * @version     $Id: 5bf7cd2d889121510d2b3cc8482a719f35c9ebec $
 */
class Dungeon_Maze_Object
{
    /**
     * 種類
     *
     * @access  public
     * @var     string
     */
    public $type;

    /**
     * x座標
     *
     * @access  public
     * @var     int
     */
    public $x = 0;

    /**
     * y座標
     *
     * @access  public
     * @var     int
     */
    public $y = 0;

    /**
     * maze
     *
     * @access  public
     * @var     object  Dungeon_Maze
     */
    public $maze;

    /**
     * matrix
     *
     * @access  public
     * @var     object  Dungeon_Maze_Matrix
     */
    public $matrix;


    /**
     * コンストラクタ
     *
     * @access  public
     */
    public function __construct()
    {
        
    }



    /**
     * mazeをセット
     *
     * @access  public
     * @param  object  $maze   Dungeon_Maze
     */
    public function setMaze(Dungeon_Maze $maze)
    {
        $this->maze = $maze;
    }

    /**
     * matrixをセット
     *
     * @access  public
     * @param   object  $matrix Dungeon_Maze_Matrix
     */
    public function setMatrix(Dungeon_Maze_Matrix $matrix)
    {
        $this->matrix = $matrix;
    }


    /**
     * 位置情報セット
     *
     * @access  public
     */
    public function setCoordinate($x, $y)
    {
        $this->x = $x;
        $this->y = $y;
    }

    /**
     * 位置情報を返却(文字列で)
     *
     * @access  public
     * @return  string
     */
    public function getCoordinate()
    {
        return sprintf('%d,%d', $this->x, $this->y);
    }





    /**
     * 方向から隣のオブジェクトを取得する
     *
     * @access  public
     * @param   int     $direction
     * @return  object  Dungeon_Maze_Object
     */
    public function getObjectByDirection($direction = NULL)
    {
        if(!$direction){
            return $this;
        } else {
            switch($direction){
            case Dungeon::MAZE_DIRECTION_UP:
                $x = $this->x;
                $y = $this->y - 1;
                break;
            case Dungeon::MAZE_DIRECTION_RIGHT:
                $x = $this->x + 1;
                $y = $this->y;
                break;
            case Dungeon::MAZE_DIRECTION_DOWN:
                $x = $this->x;
                $y = $this->y + 1;
                break;
            case Dungeon::MAZE_DIRECTION_LEFT:
                $x = $this->x - 1;
                $y = $this->y;
                break;
            default:
                throw new Dungeon_Exception('Invalid direction.');
                break;
            }
            return $this->maze->getObject($x, $y);
        }
    }


    /**
     * 周りのオブジェクトを返却
     *
     * @access  public
     * @return  array
     */
    public function getAround()
    {
        return array(
            'up'    => $this->getObjectByDirection(Dungeon::MAZE_DIRECTION_UP),
            'right' => $this->getObjectByDirection(Dungeon::MAZE_DIRECTION_RIGHT),
            'down'  => $this->getObjectByDirection(Dungeon::MAZE_DIRECTION_DOWN),
            'left'  => $this->getObjectByDirection(Dungeon::MAZE_DIRECTION_LEFT)
        );
    }





    /**
     * 同じオブジェクトかどうか(種類が、というわけではない)
     *
     * @access  public
     * @param   object  $object Dungeon_Maze_Object
     * @return  boolean
     */
    public function isSame($object)
    {
        return $this === $object;
    }


    /**
     * 壁かどうか
     *
     * @access  public
     * @return  boolean
     */
    public function isWall()
    {
        return $this->type == Dungeon::MAZE_OBJECT_WALL;
    }

    /**
     * 道路かどうか
     *
     * @access  public
     * @return  boolean
     */
    public function isRoad()
    {
        return $this->type == Dungeon::MAZE_OBJECT_ROAD;
    }

    /**
     * 部屋かどうか
     *
     * @access  public
     * @return  boolean
     */
    public function isRoom()
    {
        return $this->type == Dungeon::MAZE_OBJECT_ROOM;
    }

    /**
     * 階段かどうか
     *
     * @access  public
     * @return  boolean
     */
    public function isStairs()
    {
        return $this->type == Dungeon::MAZE_OBJECT_STAIRS;
    }

    /**
     * 宝箱かどうか
     *
     * @access  public
     * @return  boolean
     */
    public function isTreasureBox()
    {
        return $this->type == Dungeon::MAZE_OBJECT_TREASUREBOX;
    }


    /**
     * 開かれているかどうか
     *
     * @access  public
     * @return  boolean
     */
    public function isOpened()
    {
        return false;
    }


    /**
     * 上を歩けるかどうか
     *
     * @access  public
     * @return  boolean
     */
    public function enableMoveOn()
    {
        return false;
    }
}

