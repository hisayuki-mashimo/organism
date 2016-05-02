<?php
/**
 * 迷路: マトリクス
 * 
 * @package     Dungeon
 * @subpackage  Maze
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 * @version     $Id: 65ac1d09ef1b44b818c12acb99202d3323ee24e9 $
 */
class Dungeon_Maze_Matrix
{
    /**
     * 横幅
     *
     * @access  public
     * @var     int
     */
    public $width = 0;

    /**
     * 縦幅
     *
     * @access  public
     * @var     int
     */
    public $height = 0;

    /**
     * マトリクス
     *
     * @access  private
     * @var     array
     */
    private $_matrix = array();


    /**
     * コンストラクタ
     *
     * @access  public
     */
    public function __construct($width, $height)
    {
        $this->width = $width;
        $this->height = $height;
    }


    /**
     * オブジェクトを保有しているか
     *
     * @access  public
     * @param   int     $x
     * @param   int     $y
     * @return  boolean
     */
    public function hasObject($x, $y)
    {
        return isset($this->_matrix[$y][$x]);
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
        if($this->hasObject($x, $y)){
            return $this->_matrix[$y][$x];
        } else {
            throw new Dungeon_Exception('Out of range.');
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
        if(!isset($this->_matrix[$y])) $this->_matrix[$y] = array();
        $this->_matrix[$y][$x] = $object;
        $object->setMatrix($this);
        $object->setCoordinate($x, $y);
    }





    /**
     * 配列に変換する
     *
     * @access  public
     * @return  array
     */
    public function toArray()
    {
        return $this->_matrix;
    }
}

