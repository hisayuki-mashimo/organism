<?php
/**
 * ダンジョンクラス
 * 
 * @package     Dungeon
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 * @version     $Id: 96c445485f7c39941415b248e18a969da330c28a $
 */
class Dungeon
{
    /**
     * 定数:武具
     */
    const ARMS_WEAPON = 'weapon';
    const ARMS_ARMOR = 'armor';
    const ARMS_ACCESSORY = 'accessory';

    /**
     * 定数:アイテム
     */
    const ITEM_TYPE_WEAPON = 'weapon';
    const ITEM_TYPE_ARMOR = 'armor';
    const ITEM_TYPE_ACCESSORY = 'accessory';
    const ITEM_TYPE_COLLECTION = 'collection';
    const ITEM_TYPE_CHECKOUT = 'checkout';


    /**
     * 定数:状態
     */
    const CONDITION_POISON = 1;         //どく
    const CONDITION_SLEEP = 2;          //ねむり
    const CONDITION_CONFUSION = 4;      //こんらん
    const CONDITION_PARALYSIS = 8;      //まひ


    /**
     * 定数:ダンジョン関連
     */
    const MAZE_DIRECTION_UP = 1;
    const MAZE_DIRECTION_RIGHT = 2;
    const MAZE_DIRECTION_DOWN = 4;
    const MAZE_DIRECTION_LEFT = 8;
    const MAZE_OBJECT_WALL = '0';
    const MAZE_OBJECT_ROAD = '1';
    const MAZE_OBJECT_ROOM = '2';
    const MAZE_OBJECT_STAIRS = '3';
    const MAZE_OBJECT_TREASUREBOX = '4';


    /**
     * 定数:queue
     */
    const QUEUE_CONDITION_STACK = 'stack';
    const QUEUE_CONDITION_WAIT = 'wait';
    const QUEUE_CONDITION_KEEP = 'keep';
    const QUEUE_CONDITION_SUCCESS = 'success';
    const QUEUE_CONDITION_FAILED = 'failed';


    /**
     * 定数:その他
     */
    const GENDER_MALE = 1;
    const GENDER_FEMALE = 2;
    const GENDER_BOTH = 3;
    const CURRENCY_GAME = 'game';
    const CURRENCY_SOCIAL = 'social';



    /**
     * コンストラクタ
     *
     * @access  private
     */
    private function __construct()
    {
        
    }


    /**
     * すべての定数を返却
     *
     * @access  public
     * @return  array
     */
    public static function getConstants()
    {
        $ref = new ReflectionClass('Dungeon');
        return $ref->getConstants();
    }
}
