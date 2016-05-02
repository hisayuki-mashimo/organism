<?php
/**
 * マスタ: ダンジョン: プロセサー
 * 
 * @package     Dungeon
 * @subpackage  Data.Dungeon
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 * @version     $Id: 2fe56e9d2620c5534e185178e86f11f49a7c68e8 $
 */
class Dungeon_Data_Dungeon_Processor
{
    /**
     * ダンジョン
     *
     * @access  public
     * @var     object  Dungeon_Data_Dungeon
     */
    public $dungeon;
     
    /**
     * 実行者
     *
     * @access  public
     * @var     object  Dungeon_Player
     */
    public $runner;
     
    /**
     * 遭遇したモンスター
     *
     * @access  public
     * @var     object  Dungeon_Player
     */
    public $monster;

    /**
     * 結果
     *
     * @access  public
     * @var     object
     */
    public $result;
    
    /**
     * バトル結果
     *
     * @access  public
     * @var     object  Dungeon_Player
     */
    public $b_result;
    

    /**
     * @dependencies
     */
    public $Session;
    public $Config;
    public $PlayerManager;
    public $DungeonManager;
    public $ItemManager;
    public $MonsterManager;
    public $BattleProcessor;
    public $QueueManager;
    public $EventHandler;


    /**
     * コンストラクタ
     *
     * @access  public
     */
    public function __construct()
    {
        
    }


    /**
     * ランナーをセット
     *
     * @access     public
     */
    public function setRunner(Dungeon_Player $player)
    {
        $this->runner = $player;
    }

    /**
     * ランナーを取得
     *
     * @access  public
     * @return  object  Dungeon_Player
     */
    public function getRunner()
    {
        return $this->runner;
    }

    /**
     * ダンジョンをセット
     *
     * @access     public
     */
    public function setDungeon(Dungeon_Data_Dungeon $dungeon)
    {
        $this->dungeon = $dungeon;
    }

    /**
     * ダンジョンを取得
     *
     * @access     public
     */
    public function getDungeon()
    {
        return $this->dungeon;
    }

    /**
     * 遭遇したモンスター
     *
     * @access     public
     */
    public function getMonster()
    {
        return $this->monster;
    }



    /**
     * ダンジョンに入る
     *
     * @access     public
     */
    public function in()
    {
        $this->initSession();
        $this->result = $this->initResultDTO();
        $this->runner->loadStatus();
        $this->runner->loadBag();
        $this->runner->gotoDungeon($this->dungeon);

        if($this->runner->bag->isFree()){
            // 特製パンを持っていなければあげる。
            $bread_id = $this->Config->get('game.params.dungeon.default_item');
            $has_bread = false;
            foreach($this->runner->bag->getItems() as $item){
                if($item->id == $bread_id){
                    $has_bread = true;
                }
            }
            if(! $has_bread){
                $this->runner->gotItem($bread_id);
            }
        }

        // イベントハンドラー
        $this->EventHandler->setPlayer($this->runner);
        $this->EventHandler->onInDungeon($this->dungeon);

        $this->runner->save();
        $this->runner->saveStatus();
        $this->floorBelow();
    }



    /**
     * 階段を降りる
     *
     * @access     public
     */
    public function floorBelow()
    {   
        //階段を下りる
        if($this->result->found_stairs){
            $this->runner->proceedFloor();
        }
            
        //新フロアの生成
        $this->dungeon->initFloor($this->runner->now_floor);
        $pos = $this->dungeon->floor->getStartPosition();
        $this->runner->setCoordinate($pos->x, $pos->y, $this->dungeon->floor->getStartDirection());
        $this->dungeon->floor->maze->open($pos->x, $pos->y);
        $this->runner->matrix_objects = $this->dungeon->floor->getItmePosition();
        $this->runner->map_matrix = $this->dungeon->floor->maze->toString();
        $this->runner->opened_matrix = $this->dungeon->floor->maze->toOpenedString();
        $this->runner->initBattle();
        $this->runner->saveStatus();
        $this->runner->dungeonFloorJustNow = true;

        //キューの挿入
        $queue = $this->QueueManager->getBlank();
        $queue->setSubject($this->dungeon);
        $queue->setInitiator($this->runner);
        $queue->setListener('friend');
        $queue->event = 'dungeonFloorBelow';
        $this->QueueManager->add($queue);

        $this->saveToSession();
    }
 


    /**
     * フロアを移動する
     *
     * @access     public
     */
    public function move($direction = NULL)
    {
        //初期化
        $result = $this->initResultDTO();
        
        //死亡時
        if($this->runner->isDeath()){
            $result->deth = true;
        }

        //現在地などを取得
        $now = $this->dungeon->floor->maze->getObject($this->runner->x, $this->runner->y);
        $next = $now->getObjectByDirection($direction);
        
        
        //移動
        if(!$now->isSame($next) && $next->enableMoveOn()){
            $this->runner->dungeonFloorJustNow = false;
            $this->dungeon->floor->maze->open($next->x, $next->y);
            $this->runner->setCoordinate($next->x, $next->y, $direction);
            $this->runner->opened_matrix = $this->dungeon->floor->maze->toOpenedString();
            
            //腹減り
            $this->runner->hungry($this->dungeon->floor->getHungryPer1Step());
            
            //宝箱処理
            if($next->type == Dungeon::MAZE_OBJECT_TREASUREBOX){
                if(!$next->getItem()){
                    if($next->isBackToDungeon()){
                        $result->backtodungeon = true;
                        $result->cleared = true;
                    }
                    $result->message[1] = '宝箱は空っぽだった・・';
                }else{
                    $result->message[1] = '宝箱を発見した！';
                    //バッグが一杯
                    if(!$this->runner->bag->isFull()){
                        $result->treasurebox = true;
                        $result->got_items[] = $next->getItem();
                        if($next->isBackToDungeon()){
                            $result->backtodungeon = true;
                            $result->cleared = true;
                        }
                    }else{
                        $result->limit_bag = true;
                        $result->message[2] = 'バッグが一杯で開けない。';
                    }
                }
            }
            //アイテムの取得
            else if($next->getItem()){
                $result->drop_item = true;
                try{
                    $result->got_items[] = $this->runner->gotItem($next->getItem());
                    $next->lostItem();
                    $this->runner->matrix_objects = Spyc::YAMLDump($this->dungeon->floor->maze->getMatrixObjects());
                    foreach($result->got_items as $key=>$item){
                        if($item->isMoney()){
                            $result->message[$key+1] = $this->Config->get('game.phrase.money').$item->name . 'を拾った';
                            $result->message[$key+2] = $item->param3.$this->Config->get('game.currency.name').'手に入れた';
                        }else{
                            $result->message[$key+1] = $item->name . 'を手に入れた';
                        }
                    }
                }catch(Dungeon_Exception_BagFull $e){
                    $result->message[1] = $next->getItem()->name . 'を発見した！バッグが一杯で拾えない。';
                    $result->got_items[] = $next->getItem();
                    $result->limit_bag = true;
                }catch(Exception $e){
                    throw new Dungeon_Exception();
                }
            }
            
            //モンスターとの遭遇
            $this->monster = $this->dungeon->floor->getMonster();
        }
        
        
        //TODO:これはなんとかせんといかんね＞＜
        $this->dungeon->floor->setAround($this->dungeon->floor->getAround($this->runner));
        $around = $this->dungeon->floor->around;
        
        if($this->monster && $around['front']->enableMoveOn()){
            $this->runner->setBattle($this->monster);
            $result->battle = true;
            $result->message[0] = $this->monster->name . 'が現れた！';
        }
        
        //既にエンカウントしていたら
        if($this->runner->getMonsterPosition()&1){
            $result->battle = true;
        }         

        //階段発見
        if($next->isStairs() && $direction){
            $result->found_stairs = true;
        }
        
        //目の前が壁の場合
        if(!$around['front']->enableMoveOn()){
            $result->next_wall = true;
        }
        
        
        $this->runner->saveStatus();
        $this->runner->saveBag();
        $this->runner->reloadBag();
        $this->saveToSession();
    }
    
    

    /**
     * 走る
     *
     * @access     public
     */
    public function dash($direction = NULL)
    {
        while(true){
            try{
                $enable_dash = $this->move($direction);
                if($this->result->found_stairs
                   || $this->result->battle
                   || $this->result->treasurebox
                   || $this->result->drop_item
                   || $this->result->deth
                   || $this->result->next_wall
                   || $this->result->limit_bag){
                    break;
                }else{
                    $this->restoreBySession();
                }
            }catch(Exception $e){
                throw new Dungeon_Exception();
            }
        }
    }

    /**
     * 結果を取得
     *
     * @access     public
     */
    public function getResult()
    {
        return $this->result;
    }

    /**
     * 結果DTO初期化
     *
     * @access  public
     */
    public function initResultDTO()
    {
        $result = new stdClass();
        $result->backtodungeon = false;
        $result->treasurebox = false;
        $result->win = false;
        $result->trapeded = false;
        $result->deth = false;
        $result->battle = false;
        $result->found_stairs = false;
        $result->init_dungeon = false;
        $result->limit_bag = false;
        $result->drop_item = false;
        $result->around = array();
        $result->got_items = array();
        $result->got_money = 0;
        $result->message = array();
        $result->first = false;
        $result->cleared = false;
        $result->checkouts = array();
        $result->checkout_price = 0;
        $result->shop_leveluped = false;
        $result->next_wall = false;
        $this->result = $result;
        return $this->result;
    }
    
    /**
     * セッションを初期化
     */
    public function initSession()
    {
        $this->Session->del('dungeon.dungeon');
        $this->Session->del('dungeon.runner');
        $this->Session->del('dungeon.result');
        $this->Session->del('dungeon.battle_result');
    }





    /**
     * セッションに保存
     *
     * @access     public
     */
    public function saveToSession()
    {
        $this->Session->set('dungeon.dungeon', $this->dungeon);
        $this->Session->set('dungeon.runner', $this->runner);
        $this->Session->set('dungeon.result', $this->result);
        $this->dungeon->resolveReference();
        $this->runner->resolveReference();
        $this->runner->bag->resolveReference();
        if($this->monster) $this->monster->resolveReference();
    }

    /**
     * セッションから復元
     *
     * @access     public
     */
    public function restoreBySession()
    {
        $this->dungeon = $this->Session->get('dungeon.dungeon');
        if(!$this->dungeon) throw new Dungeon_Exception_Session();
        $this->runner = $this->Session->get('dungeon.runner');
        if(!$this->runner) throw new Dungeon_Exception_Session();
        $this->result = $this->Session->get('dungeon.result');
        if(!$this->result) throw new Dungeon_Exception_Session();
        $this->dungeon->revertReference();
        $this->runner->revertReference();
        $this->runner->bag->revertReference();
        if($this->monster) $this->monster->revertReference();
    }

    /**
     * フロアがない場合は再度作成
     *
     * @access     public
     */
    public function checkFloor()
    {
        if(!$this->dungeon->hasFloor()){
            
            $this->dungeon->setFloor();
            $this->runner->setDungeon($this->dungeon);
            
            
            //地図を再セット
            $this->dungeon->floor->setDungeon($this->dungeon);
            $this->dungeon->floor->setMaze();
            
            $this->runner->saveDungeon();
            
        }
    }
}

