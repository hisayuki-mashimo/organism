<?php
/**
 * ダンジョンの実体クラス
 *
 * @package     Dungeon
 * @subpackage  Data.Dungeon
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 */
class Dungeon_Data_Dungeon extends Dungeon_Embody
{
    /**
     * 所有者
     *
     * @access  public
     * @var     object  Dungeon_Player
     */
    public $owner;

    /**
     * フロア情報
     *
     * @access  public
     * @var     object  Dungeon_Data_Dungeon_Floor
     */
    public $floor;

    /**
     * 所有者の所有レコード
     *
     * @access  public
     * @var     object  ActiveGatewayRecord
     */
    public $record_owner_has;


    /**
     * @dependencies
     */
    public $Config;
    public $DungeonManager;
    public $PlayerManager;
    public $ItemManager;


    /**
     * コンストラクタ
     *
     * @access     public
     */
    public function __construct($record = NULL)
    {
        parent::__construct($record);
    }



    /**
     * 所有者をセット
     *
     * @access  public
     * @param   object  $owner  DungeonPlayer
     */
    public function setOwner(Dungeon_Player $owner)
    {
        $this->owner = $owner;
    }

    /**
     * 所有者の所有レコードをオーバー(セット)する
     *
     * @access  public
     * @param   object  $record     ActiveGatewayRecord
     */
    public function overOwnerHas(ActiveGatewayRecord $record)
    {
        $this->record_owner_has = $record;
    }

    /**
     * ランナーのレコードを更新する
     *
     * @access  public
     * @param   mixed   $attributes
     */
    public function saveOwnerHas($attributes = array())
    {
        $this->PlayerManager->saveDungeon($this->owner, $this, $attributes);
    }




    /**
     * フロアをセット
     *
     * @access  public
     * @@aram   int     $depth
     */
    public function setFloor($depth)
    {
        $this->floor = $this->DungeonManager->getFloor($this, $depth);
    }

    /**
     * フロアを初期化
     *
     * @access  public
     * @param   int     $depth
     */
    public function initFloor($depth)
    {
        $this->setFloor($depth);
        if($this->depth <= $depth){
            $this->floor->initMaze(true);
        } else {
            $this->floor->initMaze();
        }
    }


    /**
     * フロアの存在確認
     *
     * @access  public
     * @return  boolean
     */
    public function hasFloor()
    {
        return $this->floor ? true : false;
    }

    /**
     * コレクションコンプリートしているか？
     *
     * @access  public
    public function isCollectionComp()
    {
        foreach(explode(',',$this->collection_ids) as $collection_id){
            if($collection){
                $collection->setOwner($this->owner);
                if($collection->isCompleted()){
                    return true;
                }
            }
        }

        return false;

    }


    /**
     * ダンジョンクリア
     *
     * @access  public
     * @return  boolean
     */
    public function clear()
    {
        $this->completed = '1';
        $this->completed_at = time();
    }


    /**
     * 死亡カウントを増やす
     *
     * @access  public
     */
    public function death()
    {
        $this->death_count++;
    }



    /**
     * URNに変換する
     *
     * @access  public
     * @return  string
     */
    public function toURN()
    {
        if($this->floor){
        }
    }





    /**
     * 参照関係解除
     * (セッションに保存される際への対策)
     *
     * @access  public
     */
    public function resolveReference()
    {
        $this->ItemManager = NULL;
        if($this->floor){
           $this->floor->resolveReference();
        }
    }


    /**
     * 参照関係復活
     * (セッションに保存される際への対策)
     *
     * @access  public
     */
    public function revertReference()
    {
        $DI = Samurai::getContainer();
        $this->Config = $DI->getComponent('Config');
        $this->PlayerManager = $DI->getComponent('PlayerManager');
        $this->DungeonManager = $DI->getComponent('DungeonManager');
        $this->ItemManager = $DI->getComponent('ItemManager');
        if($this->floor){
            $this->floor->revertReference();
        }
    }



    /**
     * @override
     */
    public function __get($key)
    {
        try {
            return parent::__get($key);
        } catch(Dungeon_Exception $E){
            if($this->record_owner_has && property_exists($this->record_owner_has, $key)){
                return $this->record_owner_has->$key;
            } else {
                throw $E;
            }
        }
    }

    /**
     * @override
     */
    public function __set($key, $value)
    {
        try {
            return parent::__set($key, $value);
        } catch(Dungeon_Exception $E){
            if($this->record_owner_has && property_exists($this->record_owner_has, $key)){
                return $this->record_owner_has->$key = $value;
            } else {
                throw $E;
            }
        }
    }
}
