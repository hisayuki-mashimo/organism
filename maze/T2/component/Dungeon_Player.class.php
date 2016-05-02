<?php
/**
 * Player実体
 * 
 * @package     Dungeon
 * @subpackage  Player
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 * @version     $Id: f0c8557a56b0eaafc37013587a453d3ca2141821 $
 */
class Dungeon_Player extends Dungeon_Embody
{
    /**
     * x座標(ダンジョン用)
     *
     * @access  public
     * @var     int
     */
    public $x = 0;
    
    /**
     * y座標(ダンジョン用)
     *
     * @access  public
     * @var     int
     */
    public $y = 0;

    /**
     * ユーザー実体
     *
     * @access  public
     * @var     object  Dungeon_User
     */
    public $user;
    
    /**
     * ユーザー実体
     *
     * @access  public
     * @var     object  stdClass
     */
    public $socialUser;
    
    /**
     * バッグ
     *
     * @access  public
     * @var     object Dungeon_Player_Bag 
     */
    public $bag;

    /**
     * ステータスレコード
     *
     * @access  public
     * @var     object  ActiveGatewayRecord
     */
    public $record_status;

    /**
     * バトル
     *
     * @access  public
     * @var     object  ActiveGatewayRecord
     */
    public $battle_param;
    
    /**
     * 今階段を降りたか
     *
     * @access  public
     * @var     object  ActiveGatewayRecord
     */
    public $dungeonFloorJustNow;
    

    /**
     * @dependencies
     */
    public $Config;
    public $UserManager;
    public $PlayerManager;
    public $DungeonManager;
    public $ItemManager;
    public $LevelManager;
    public $CollectionManager;
    public $CharacterManager;


    /**
     * コンストラクタ
     *
     * @access  public
     */
    public function __construct($record = NULL)
    {
        parent::__construct($record);
    }


    /**
     * ユーザーをセット
     *
     * @access  public
     * @param   object  $user   Dungeon_User
     */
    public function setUser(Dungeon_User $user)
    {
        $this->user = $user;
    }

    /**
     * ソーシャルユーザーをロード
     *
     * @access  public
     */
    public function loadSocialUser($do_catch = true)
    {
        $SocialAppli = Samurai::getContainer()->getComponent('SocialAppli');
        try{
            $this->socialUser = $SocialAppli->getUser($this->platform_user_id);
        } catch(Exception $E){
            if($do_catch){
                throw $E;
            }
            $this->socialUser = null;
            return;
        }
    }

    /**
     * 保存
     *
     * @access  public
     * @param   mixed   $attributes
     */
    public function save($attributes = array())
    {
        $this->PlayerManager->save($this, $attributes);
    }

    /**
     * ステータスをロードする
     *
     * @access  public
     * @param   boolean $force
     */
    public function loadStatus($force = false)
    {
        if($this->record_status && !$force) return;
        $this->record_status = $this->PlayerManager->getStatus($this);
    }

    /**
     * ステータスを保存する
     *
     * @access  public
     * @param   mixed   $attributes
     */
    public function saveStatus($attributes = array())
    {
        $this->PlayerManager->saveStatus($this, $attributes);
    }

    /**
     * ステータスを初期化する
     *
     * @access  public
     * @param   object  $dungeon    Dungeon_Data_Dungeon
     */
    public function initStatus(Dungeon_Data_Dungeon $dungeon)
    {
        $this->dungeon_id = $dungeon->id;
        $this->now_floor = 1;
        $this->coordinate = '0,0';
        $this->direction = 1;
        $this->map_matrix = '';
        $this->opened_matrix = '';
        $this->matrix_objects = '';
        
        //TODO:値は適当
        $this->hp_max = 10;
        $this->hp = $this->hp_max;
        $this->attack = 5;
        $this->defence = 5;
        $this->lucky = 5;
        $this->hungry = 10000;
        
        
        //1レベルの取得
        $level = $this->LevelManager->getPlayerLevel(1);
        $this->level = $level->level;
        $this->exp_point_prev  = $level->prev;
        $this->exp_point = 0;
        $this->exp_point_next  = $level->next;
        
    }
    
    
    /**
     * バックをロードする
     *
     * @access  public
     * @param   boolean $force
     */
    public function loadBag($force = false)
    {
        if(!$force && $this->bag) return;
        $this->bag = $this->PlayerManager->getBag($this);
    }
 
    /**
     * バックを保存する
     *
     * @access  public
     * @param   mixed   $attributes
     */
    public function saveBag($attributes = array())
    {
        $this->PlayerManager->saveBag($this, $this->bag, $attributes);
    }

    /**
     * バックの中身を更新
     *
     * @access  public
     * @param   mixed   $attributes
     */
    public function reloadBag()
    {
       $this->bag->reloadItems();
    }


    /**
     * DBから値を復元
     *
     * @access  public
     */
    public function restoreByDB()
    {
        $this->loadStatus();
        $this->loadBag();
        list($this->x,$this->y) = explode(',',$this->coordinate);
        $this->battle_param = Spyc::YAMLLoad($this->battle);
        
    }



    /**
     * ダンジョンへ向かう
     *
     * @access  public
     * @param   object  $dungeon    Dungeon_Data_Dungeon
     */
    public function gotoDungeon(Dungeon_Data_Dungeon $dungeon)
    {
        $this->goto_dungeon = $dungeon->toURN();
        $this->initStatus($dungeon);
    }

    /**
     * 座標をセットする
     *
     * @access  public
     * @param   int     $x
     * @param   int     $y
     * @param   int     $direction
     */
    public function setCoordinate($x, $y, $direction = NULL)
    {
        $this->x = $x;
        $this->y = $y;
        $this->coordinate = sprintf('%d,%d', $x, $y);
        if($direction) $this->direction = $direction;
    }


    /**
     * 方向を取得する
     *
     * @access  public
     * @param   string  $key
     * @return  int
     */
    public function getDirection($key)
    {
        switch($this->direction){
        case Dungeon::MAZE_DIRECTION_UP:
            $relation = array(
                'front' => Dungeon::MAZE_DIRECTION_UP,
                'right' => Dungeon::MAZE_DIRECTION_RIGHT,
                'back' => Dungeon::MAZE_DIRECTION_DOWN,
                'left' => Dungeon::MAZE_DIRECTION_LEFT,
            );
            break;
        case Dungeon::MAZE_DIRECTION_RIGHT:
            $relation = array(
                'front' => Dungeon::MAZE_DIRECTION_RIGHT,
                'right' => Dungeon::MAZE_DIRECTION_DOWN,
                'back' => Dungeon::MAZE_DIRECTION_LEFT,
                'left' => Dungeon::MAZE_DIRECTION_UP,
            );
            break;
        case Dungeon::MAZE_DIRECTION_DOWN:
            $relation = array(
                'front' => Dungeon::MAZE_DIRECTION_DOWN,
                'right' => Dungeon::MAZE_DIRECTION_LEFT,
                'back' => Dungeon::MAZE_DIRECTION_UP,
                'left' => Dungeon::MAZE_DIRECTION_RIGHT,
            );
            break;
        case Dungeon::MAZE_DIRECTION_LEFT:
            $relation = array(
                'front' => Dungeon::MAZE_DIRECTION_LEFT,
                'right' => Dungeon::MAZE_DIRECTION_UP,
                'back' => Dungeon::MAZE_DIRECTION_RIGHT,
                'left' => Dungeon::MAZE_DIRECTION_DOWN,
            );
            break;
        }
        return $relation[$key];
    }


    /**
     * お腹が減る
     *
     * @access  public
     * @param   int     $amount
     */
    public function hungry($amount)
    {
    
        //腹が0%になったらHPが減る
        $this->hungry -= $amount;
        if($this->hungry < 0){
            $this->hp -= 1;
            $this->hungry = 0;
        }
    }


    /**
     * フロアを降りる(上る)
     *
     * @access  public
     */
    public function proceedFloor()
    {
        $this->now_floor += 1;
    }


    /**
     * ダンジョンから帰る
     *
     * @access  public
     */
    public function goBackHome()
    {
        $this->goto_dungeon = '';
    }


    /**
     * 装備
     *
     * @access  public
     * @param   object  $item
     */
    public function equip(Dungeon_Data_Item $item)
    {
        if(!$item->isEquip()) throw new Dungeon_Exception('Can not equip.');
        if(!$item->enableEquip($this)) throw new Dungeon_Exception('Can not equip.');

        //現在の装備ははずす
        $now = NULL;
        if($item->isWeapon()){
            $now = $this->bag->getEquipedWeapon();
        } elseif($item->isArmor()){
            $now = $this->bag->getEquipedArmor();
        } elseif($item->isAccessory()){
            $now = $this->bag->getEquipedAccessory();
        }
        if($now){
            $this->unequip($now);
            foreach($now->getMessages() as $message) $item->addMessage($message);
        }

        $item->equip();
    }

    /**
     * 装備をはずす
     *
     * @access  public
     * @param   object  $item
     */
    public function unequip(Dungeon_Data_Item $item)
    {
        if(!$item->isEquip()) throw new Dungeon_Exception('Can not equip.');
        if(!$item->isEquiped($this)) throw new Dungeon_Exception('Not equiped.');
        $item->unequip();
    }


    /**
     * 捨てる
     *
     * @access  public
     * @param   object  $item
     */
    public function discard(Dungeon_Data_Item $item)
    {
        //装備の場合はずす
        $now = NULL;
        if($item->isWeapon()){
            $now = $this->bag->getEquipedWeapon();
        } elseif($item->isArmor()){
            $now = $this->bag->getEquipedArmor();
        } elseif($item->isAccessory()){
            $now = $this->bag->getEquipedAccessory();
        }
        if($now && $now->hash == $item->hash){
            $this->unequip($item);
        }

        $this->bag->ejectItem($item->index);
        $item->addMessage(':nameをすてた!', array(':name' => $item->getName()));
    }






    /**
     * HP回復
     *
     * @access  public
     * @param   int     $amount
     */
    public function cureHP($amount)
    {
        $this->loadStatus();
        $this->hp += $amount;
        if($this->hp > $this->hp_max) $this->hp = $this->hp_max;
    }


    /**
     * はらへり回復
     *
     * @access  public
     * @param   int     $amount
     */
    public function cureHungry($amount, $regard_max = true)
    {
        $this->loadStatus();
        if($regard_max && $this->hungry < 10000){
            $this->hungry += $amount;
            if($this->hungry > 10000) $this->hungry = 10000;
        } elseif(!$regard_max && $this->hungry < $amount){
            $this->hungry = $amount;
        }
    }



    
    
    /**
     * battleYAMLをセット
     *
     * @access  public
     * @param   mixed   $attributes
     */
    public function initBattle()
    {
        $param = array('exist'=>false,'monster_id'=>'0','hp'=>'0');
        $this->battle_param = array('front' =>$param,'back' =>$param);
        
        $this->battle = Spyc::YAMLDump($this->battle_param);
    }
    
    
    
    /**
     * モンスターの現在位置を調べる
     *
     * @access  public
     * @param   mixed   $attributes
     */
    public function getMonsterPosition()
    {
        $monster_position = 0;
        foreach($this->battle_param as $key=>$battle){
             
             if($key == 'front' && $battle['exist']){
                  $monster_position += 1;
             }else if($key == 'back' && $battle['exist']){
                  $monster_position += 2;
             }
        }
        return $monster_position;
    }
    
    
    /**
     * バトルにモンスターセット
     *
     * @access  public
     * @param   mixed   $attributes
     */
    public function setBattle(Dungeon_Data_Monster $monster)
    {
        $this->battle_param['front']['exist'] = true;
        $this->battle_param['front']['monster_id'] = $monster->id;
        $this->battle_param['front']['hp'] = $monster->hp;
        
        $this->battle = Spyc::YAMLDump($this->battle_param);
    }
    
    
    /**
     * モンスター消去
     *
     * @access  public
     * @param   front|| back $type
     */
    public function initBattleParam($type)
    {
        $this->battle_param[$type]['exist'] = false;
        $this->battle_param[$type]['monster_id'] = '';
        $this->battle_param[$type]['hp'] = '';
        
        $this->battle = Spyc::YAMLDump($this->battle_param);
    }



    /**
     * アイテムを手に入れる
     *
     * @access  public
     * @param   object  $item   Dungeon_Data_Item
     * @param   int     $amount
     */
    public function gotItem($item, $amount = 1)
    {
        if(! $item instanceof Dungeon_Data_Item){
            $item = $this->ItemManager->get($item);
        }
        if($item->isMedal()){
            $this->medal++;
            $this->save();
        }else if($item->isMoney()){
            $value = rand(5,30);
            $item->param3 = $value;
            $this->gotMoney($value);
            $this->save();
        } else {
            $this->loadBag();
            $this->bag->addItem($item, $amount);
            $this->saveBag();
        }
        return $item;
    }

    /**
     * アイテムの入手の際に、
     * バッグがいっぱいの場合やダンジョンにいる場合も考慮して処理してくれる
     *
     * @access  public
     * @param   object  $item
     * @param   int     $amount
     */
    public function gotItemOrSendGarage(Dungeon_Data_Item $item, $amount = 1)
    {
        //メダルの場合
        if($item->isMedal()){
            $this->gotMedal($amount);
            $this->save();
            return $item;
        }

        $this->loadBag();
        //ダンジョンに行っている場合
        if($this->isGotoDungeon()){
            //倉庫のみ
            $shop = $this->PlayerManager->getShop($this);
            for($i = 0; $i < $amount; $i++) $shop->putGarage($item);
        }
        //ダンジョンには行っていない場合
        else {
            $this->loadBag();
            $shop = $this->PlayerManager->getShop($this);

            $amount_enable_bag = $this->bag->getEnableAddItemAmount($item);
            $amount_to_bag     = ($amount <= $amount_enable_bag) ? $amount : $amount_enable_bag;
            $amount_to_garage  = $amount - $amount_to_bag;

            if($amount_to_bag > 0){
                $this->bag->addItem($item, $amount_to_bag);
            }

            for($n = 0; $n < $amount_to_garage; $n ++){
                $shop->putGarage($item);
            }
        }
    }


    /**
     * アイテムを失う
     *
     * @access  public
     * @param   object  $item
     * @param   int     $amount
     */
    public function lostItem($item, $amount = 1)
    {
        if(!$this->bag->isIn($item)) throw new Dungeon_Exception('No such item in bag.');
        $this->bag->ejectItem($item->index, $amount);
        $this->saveBag();
    }


    /**
     * アイテムを使用する
     *
     * @access  public
     * @param   object  $item   Dungeon_Data_Item
     * @param   object  $target
     */
    public function useItem(Dungeon_Data_Item $item, $target = NULL)
    {
        if(!$this->bag->isIn($item)) throw new Dungeon_Exception('No such item in bag.');
        if($target && !$this->bag->isIn($target)) throw new Dungeon_Exception('No such item in bag.');
        $res = $item->execute($target ? $target : $this, $this);
        if(!$res == 'maxlevel') $this->lostItem($item);
    }


    /**
     * 複数のアイテムについて、全て追加できるかをシミュレートする
     *  - フリークエスト等で、複数アイテムを同時に受領(乃至納品)したい場合に、事前調査する目的で使用する。
     *
     * @access  public
     * @param   array   $items      array(array('item' => Dungeon_Data_Item, 'amount' => int 追加したい個数), ...)
     * @param   array   $lost_items array(array('item' => Dungeon_Data_Item, 'amount' => int 削除したい個数), ...)
     * @return  array               array(array('item' => Dungeon_Data_Item, 'amount' => int バッグから溢れる個数), ...)
     *                               - 溢れなければ空配列を返す
     */
    public function simulateGotItems($items, $lost_items = array())
    {
        // 溢れるアイテムデータの格納値
        $filled_items = $items;

        // ダンジョンに入っていない場合、可能な限りバッグに格納する
        $this->loadBag();
        if(! $this->isGotoDungeon()){
            $filled_items = $this->bag->simulateAddItems($items, $lost_items);
        }

        // 可能な限り倉庫に追加する
        $shop = $this->PlayerManager->getShop($this);
        $filled_items = $shop->simulatePutGarage($filled_items);

        return $filled_items;
    }


    /**
     * お金を獲得する
     *
     * @access  public
     * @param   int     $price
     * @return  bool
     */
    public function gotMoney($price)
    {
        $this->money += $price;
    }

    /**
     * お金を消費する
     *
     * @access  public
     * @param   int     $price
     * @return  bool
     */
    public function lostMoney($price)
    {
        $this->money -= $price;
    }


    /**
     * メダルを獲得する
     *
     * @access  public
     * @param   int     $amount
     */
    public function gotMedal($amount)
    {
        $this->medal += $amount;
    }

    /**
     * メダルを消費する
     *
     * @access  public
     * @param   int     $amount
     */
    public function lostMedal($amount)
    {
        $this->medal -= $amount;
    }
    
    
    /**
     * フレンド数を追加する
     *
     * @access  public
     */
    public function gotFriend()
    {
        $this->friend_count ++;
    }
    
    
    /**
     * フレンド数を失う
     *
     * @access  public
     */
    public function lostFriend()
    {
        $this->friend_count --;
    }
    
    
    /**
     * 経験値を獲得する
     *
     * @access  public
     * @param   int     $amount
     */
    public function gotExpPoint($amount)
    {
        //レベルキャップに達している場合は無視する
        if($_cap = $this->Config->get('game.params.level_cap')){
            if($this->level >= $_cap) return;
        }

        $this->exp_point += $amount;
    }
    
    
    /**
     * キャンディーを獲得する
     *
     * @access  public
     * @param   int     $candy
     */
    public function gotCandy($candy)
    {
        $this->candy += $candy;
        if($this->candy > $this->candy_max) $this->candy = $this->candy_max;
    }
    
    
    /**
     * キャンディーを消費する
     *
     * @access  public
     * @param   int     $candy
     */
    public function lostCandy($candy)
    {
        $this->candy -= $candy;
        if($this->candy < 0) $this->candy = 0;
    }
    
    
    
    /**
     * ダメージを喰らう
     *
     * @access  public
     * @param   int     $damage（負数）
     */
    public function gotDamage($damage)
    {
        $this->hp += $damage;
        $this->last_cured_at = time();
    }
    
    
    /**
     * レベルアップ
     *
     * @access  public
     * @return  boolean
     */
    public function levelup()
    {
        //次のレベルの取得
        $next_level = $this->LevelManager->getPlayerLevel($this->level+1);
        $this->exp_point_prev  = $next_level->need;
        $this->exp_point_next  = $next_level->next;
        $this->level = $next_level->level;
        $this->hp_max += 3;
        $this->hp = $this->hp_max;
        
        $this->attack += 2;
        $this->defence += 2;
        
        //振り分ける
        $rand = new Dungeon_Math_Randomizer();
        $rand->add(1,1);
        $rand->add(0,1);
        if($rand->pick()){
            $this->attack += 1;
        }else{
            $this->defence += 1;
        }
        //TODO運を考慮
        //$this->lucky += 3;
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
     * 攻撃力を取得
     *
     * @access  public
     * @return  boolean
     */
    public function getAttack()
    {
        $attack = $this->attack;
        
        //装備を取得
        $this->loadBag();
        $weapon = $this->bag->getEquipedWeapon();
        if($weapon){
            $attack += $weapon->getAttack();
        }
        $armor = $this->bag->getEquipedArmor();
        if($armor){
            $attack += $armor->getAttack();
        }
        
        return $attack;
    }
    
    
    /**
     * 防御力を取得
     *
     * @access  public
     * @return  boolean
     */
    public function getDefence()
    {
        $defence = $this->defence;
        
        //装備を取得
        $this->loadBag();
        $weapon = $this->bag->getEquipedWeapon();
        if($weapon){
            $defence += $weapon->getDefence();
        }
        $armor = $this->bag->getEquipedArmor();
        if($armor){
            $defence += $armor->getDefence();
        }
        
        return $defence;
    }


    /**
     * 腹減り度を返却
     *
     * @access  public
     * @return  int
     */
    public function getHungry()
    {
        return $this->hungry > 10000 ? 10000 : $this->hungry;
    }


    /**
     * キャラクターを取得
     *
     * @access  public
     * @return  object  Dungeon_Data_Character
     */
    public function getCharacter()
    {
        return $this->CharacterManager->get($this->character_id);
    }



    /**
     * プロフィールページのURLを取得
     *
     * @access  public
     * @return  string
     */
    public function getURL()
    {
        return sprintf('%s/friend/show?friend_id=%d', BASE_URL, $this->id);
    }


    /**
     * 経験値用のゲージ画像URLを取得
     *
     * @access  public
     * @return  string
     */
    public function getExpGuageURL()
    {
        
        if(!$this->record_status){
            $per = 0;
        } else {
            $per = ($this->exp_point - $this->exp_point_prev)  / $this->exp_point_next * 24;
        }
        if($per > 24) $per = 24;
        if($per < 1 && $per > 0) $per = 1;
        return sprintf('%s/image/layout/player/exp.guage.%02d.gif', $this->Config->get('url.static'), floor($per));
    }
    
    
    
    /**
     * URNに変換する
     *
     * @access  public
     * @return  string
     */
    public function toURN()
    {
        return sprintf('urn:dungeon:player:%d', $this->id);
    }






    /**
     * メダルを持っているかどうか
     *
     * @access  public
     * @param   int     $amount
     * @return  boolean
     */
    public function hasMedal($amount = 1)
    {
        return $this->medal - $amount >= 0;
    }


    /**
     * アイテムを受け取れるかどうか
     *
     * @access  public
     * @param   object  $item   Dungeon_Data_Item
     * @param   int     $amount
     * @return  boolean
     */
    public function enableReceiveItem(Dungeon_Data_Item $item = NULL, $amount = 1, $regard_garage = false)
    {
        // バッグに収納できる容量
        if(! $this->isGotoDungeon()){
            $this->loadBag();
            $bag_enable_amount = $this->bag->getEnableAddItemAmount($item);
            if($amount <= $bag_enable_amount){
                return true;
            }
            $amount -= $bag_enable_amount;
        }

        // バッグから溢れる個数を倉庫に収納できるか
        if($regard_garage){
            $shop = $this->PlayerManager->getShop($this);
            return $shop->enableStoreToGarage($amount);
        }

        return false;
    }


    /**
     * ダンジョンへ入っているか
     *
     * @access  public
     * @return  boolean
     */
    public function isGotoDungeon()
    {
        return (boolean)$this->goto_dungeon;
    }


    /**
     * 戦闘不能かどうか
     *
     * @access  public
     * @return  boolean
     */
    public function isDeath()
    {
        if(!$this->record_status) return false;
        return $this->hp <= 0;
    }

    /**
     * 瀕死かどうか
     *
     * @access  public
     * @return  boolean
     */
    public function isDying()
    {
        $this->loadStatus();
        $per = $this->hp / $this->hp_max * 100;
        return $per <= 20;
    }
    





    /**
     * フリークエストを取得
     * @access  public
     */
    public function getQuest($quest_id)
    {
        return $this->PlayerManager->getQuest($this, $quest_id);
    }
    
    
    /**
     * フリークエストを取得(複数)
     * @access  public
     */
    public function getQuests($cond = NULL)
    {
        return $this->PlayerManager->getQuests($this, $cond);
    }
    
    
    /**
     * 完了していないフリークエストを取得
     * @access  public
     */
    /*public function getQuestsUnCompleted($cond = NULL)
    {
        return $this->PlayerManager->getQuestsUnCompleted($this, $cond);
    }*/
    /**
     * 受託可能なフリークエストを取得
     * @access  public
     */
    public function getQuestsEnableContract($cond = NULL)
    {
        return $this->PlayerManager->getQuestsEnableContract($this, $cond);
    }
    
    
    /**
     * 契約中のフリークエストを取得
     * @access  public
     */
    public function getQuestContracted()
    {
        return $this->PlayerManager->getQuestContracted($this);
    }
    
    
    /**
     * クエストを保存
     * @access  public
     */
    public function saveQuest(Dungeon_Data_Quest $quest, $attributes = array())
    {
        $this->PlayerManager->saveQuest($this, $quest, $attributes);
    }





    /**
     * 参照関係解除
     * (セッションに保存される際への対策)
     *
     * @access  public
     */
    public function resolveReference()
    {
        $this->UserManager = NULL;
        $this->PlayerManager = NULL;
        $this->DungeonManager = NULL;
        $this->ItemManager = NULL;
        $this->LevelManager = NULL;
        $this->CollectionManager = NULL;
        $this->user->resolveReference();
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
        $this->UserManager = $DI->getComponent('UserManager');
        $this->PlayerManager = $DI->getComponent('PlayerManager');
        $this->DungeonManager = $DI->getComponent('DungeonManager');
        $this->ItemManager = $DI->getComponent('ItemManager');
        $this->LevelManager = $DI->getComponent('LevelManager');
        $this->CollectionManager = $DI->getComponent('CollectionManager');
        $this->user->revertReference();
    }



    /**
     * @override
     */
    public function __get($key)
    {
        try {
            return parent::__get($key);
        } catch(Dungeon_Exception $E){
            if($this->record_status && property_exists($this->record_status, $key)){
                return $this->record_status->$key;
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
            if($this->record_status && property_exists($this->record_status, $key)){
                return $this->record_status->$key = $value;
            } else {
                throw $E;
            }
        }
    }
}

