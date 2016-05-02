<?php
/**
 * マスタ: ダンジョン: フロア
 * 
 * @package     Dungeon
 * @subpackage  Data.Dungeon
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 * @version     $Id: 862203d13e4e45aea57281565ba34b55e3e5cd1d $
 */
class Dungeon_Data_Dungeon_Floor extends Dungeon_Embody
{
    /**
     * ダンジョン
     *
     * @access  public
     * @var     object  Dungeon_Data_Dungeon
     */
    public $dungeon;

    /**
     * 迷路
     *
     * @access  public
     * @var     object  Dungeon_Maze
     */
    public $maze;

    /**
     * 現在位置の周囲情報
     *
     * @access  public
     * @var     array
     */
    public $around = array();

    /**
     * 深さ
     *
     * @access  public
     * @var     int
     */
    public $depth = 1;
    
    /**
     * @dependencies
     */
    public $Config;
    public $MazeManager;
    public $ItemManager;
    public $MonsterManager;


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
     * ダンジョンをセット
     *
     * @access  public
     * @param   object  $dungeon    Dungeon_Data_Dungeon
     */
    public function setDungeon(Dungeon_Data_Dungeon $dungeon)
    {
        $this->dungeon = $dungeon;
    }


    /**
     * 迷路を初期化
     *
     * @access  public
     */
    public function initMaze($bottom = false)
    {
        //$this->MazeManager->setSize($this->extent);
        //$this->MazeManager->setDifficulty(1);
        //$this->MazeManager->setBottom($bottom);
        $this->maze = $this->MazeManager->make();
    }
    
    
    /**
     * モンスターと出会う
     *
     * @access  public
     */
    public function getMonster()
    {
        //モンスターピック
        $random = new Dungeon_Math_Randomizer();
        foreach(explode(',',$this->monsters) as $monster){
            list($monster_id,$weight) = explode(':',$monster);
            $random->add($monster_id,$weight);
        }
        
        //TODO 母数
        $random->setParameter(10000);
        
        return $random->pick() ? $this->MonsterManager->get($random->pick()) : false;
        
    }


    /**
     * 周囲情報をセットする
     *
     * @access  public
     * @param   array   $around
     */
    public function setAround($around)
    {
        $this->around = $around;
    }





    /**
     * スタート位置を返却する
     *
     * @access  public
     * @return  object  Dungeon_Maze_Object
     */
    public function getStartPosition()
    {
        //スタート位置は道路(TODO:将来的には部屋)
        $road = $this->maze->getRoadByRandom();
        return $road;
    }

    /**
     * スタート位置での方向を返却する
     *
     * @access  public
     * preturn  int
     */
    public function getStartDirection()
    {
        $rand = new Dungeon_Math_Randomizer();
        $rand->add(Dungeon::MAZE_DIRECTION_UP);
        $rand->add(Dungeon::MAZE_DIRECTION_RIGHT);
        $rand->add(Dungeon::MAZE_DIRECTION_DOWN);
        $rand->add(Dungeon::MAZE_DIRECTION_LEFT);
        return $rand->pick();
    }
    
    /**
     * アイテムを地図におく
     *
     * @access  public
     * @return  yml
     */
    public function getItmePosition()
    {
        
        $yml = array();
        $roads = $this->maze->getRoad();
        $random = new Dungeon_Math_Randomizer();
        
        //通常アイテムばらまき
        foreach($roads as $road){
            $random->add($road,1);
            $item_id = $this->_getDropItem();
            if($item_id){
                $road->setItem($this->ItemManager->get($item_id));
                $coordinate = $road->x. ',' . $road->y;
                $yml[] = array('item'=>array('coordinate'=>$coordinate,'item_id'=>$item_id));
            }
        }
        
        //宝箱に入っているアイテム
        $got_items = array();
        $settings = Spyc::YAMLLoad($this->settings);
        if(isset($settings['collection'])){
            $random_col = new Dungeon_Math_Randomizer();
            foreach($settings['collection'] as $collection_id){
                $random_col->add($collection_id,1);
            }
            $got_items[] = $random_col->pick();
        }
        
        if(count($got_items)){
            //宝箱オブジェクト作成
            $treasurebox = new Dungeon_Maze_Object_Treasurebox();
            $road = $random->pick();
            $this->maze->setObject($road->x, $road->y , $treasurebox);
            //アイテムのセット
            $treasurebox = $this->maze->getObject($road->x, $road->y);
            $coordinate = $treasurebox->x. ',' . $treasurebox->y;
            //開けたら帰る？
            if($settings['backtodungeon']){ 
                $treasurebox->setBackToDungeon();
                $back = 'true';
            }else{
                $back = 'false';
            }
            
            foreach($got_items as $item_id){
                $treasurebox->setItem($this->ItemManager->get($item_id));
                $yml[] = array('treasurebox'=>array('coordinate'=>$coordinate,'item_id'=>$item_id,'backtodungeon'=>$back));
            }
        }
        
        return Spyc::YAMLDump($yml);
    }
    
    
    /**
     * ドロップアイテムさせる
     *
     * @access  private
     * return   Dungeon_Data_Item
     */
    private function _getDropItem()
    {
        $random = new Dungeon_Math_Randomizer();
        
        //通常
        if($this->drop_items){
            foreach(explode(',',$this->drop_items) as $items){
                list($item_id,$weight) = explode(':',$items);
                $random->add($item_id,$weight);
            }
        }
        
        //TODO母数は設定ファイルに持つ？
        $random->setParameter(10000);
        return $random->pick();
    }
    

    /**
     * 1歩で減る空腹度を返却
     *
     * @access  public
     * @return  int
     */
    public function getHungryPer1Step()
    {
        //TODO:設定項目を反映
        return 40;
    }


    /**
     * 周りの情報を取得
     *
     * @access  public
     * @param   object  $runner Dungeon_Player
     */
    public function getAround(Dungeon_Player $runner)
    {
        $now = $this->maze->getObject($runner->x, $runner->y);
        $o_around = $now->getAround();
        $around = array();
        $relation = array();
        
        switch($runner->direction){
        case Dungeon::MAZE_DIRECTION_UP:
            $relation = array(
                'up' => 'front',
                'right' => 'right',
                'down' => 'back',
                'left' => 'left',
            );
            break;
        case Dungeon::MAZE_DIRECTION_RIGHT:
            $relation = array(
                'up' => 'left',
                'right' => 'front',
                'down' => 'right',
                'left' => 'back',
            );
            break;
        case Dungeon::MAZE_DIRECTION_DOWN:
            $relation = array(
                'up' => 'back',
                'right' => 'left',
                'down' => 'front',
                'left' => 'right',
            );
            break;
        case Dungeon::MAZE_DIRECTION_LEFT:
            $relation = array(
                'up' => 'right',
                'right' => 'back',
                'down' => 'left',
                'left' => 'front',
            );
            break;
        }
        foreach($relation as $_key => $_val){
            $around[$_val] = $o_around[$_key];
        }
        
        return $around;
        
    }



    /**
     * 画像URLを取得(※廃止予定)
     *
     * @access  public
     */
    public function getURL()
    {
        $imageName = '';
        $imageName .= $this->around['front']->enableMoveOn() ? '1' : '0';
        $imageName .= $this->around['right']->enableMoveOn() ? '1' : '0';
        $imageName .= $this->around['back']->enableMoveOn() ? '1' : '0';
        $imageName .= $this->around['left']->enableMoveOn() ? '1' : '0';
        return sprintf('%s/image/wall/%s.gif', $this->Config->get('url.static'), $imageName);
    }



    /**
     * 参照関係解除
     * (セッションに保存される際への対策)
     *
     * @access  public
     */
    public function resolveReference()
    {
        $this->MazeManager = NULL;
        $this->ItemManager = NULL;
        $this->MonsterManager = NULL;
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
        $this->MazeManager = $DI->getComponent('PlayerManager');
        $this->ItemManager = $DI->getComponent('DungeonManager');
        $this->MonsterManager = $DI->getComponent('MonsterManager');
    }


















    /**
     * Mazeを再設定
     *
     * @access     public
     */
    public function setMaze()
    {
        $this->_setParam();
        
        //ベース作成
        $this->Maze->setBaseMatrix($this->dungeon->map_matrix);
        //ﾕｰｻﾞｰ用作成
        $this->Maze->setRunnerMatrix($this->dungeon->opened_matrix);
        
    }
    
    
    
    
    
    
    /**
     * 移動後の方向を取得
     *
     * @access     public
     */
    private function _getDirection($before_direction)
    {
        switch($this->dungeon->direction){
            case 1:
                switch($before_direction){
                    case 'front': $direction = 1; break;
                    case 'right': $direction = 2; break;
                    case 'back': $direction = 3; break;
                    case 'left': $direction = 4; break;
                }
                break;
            case 2:
                switch($before_direction){
                    case 'front': $direction = 2; break;
                    case 'right': $direction = 3; break;
                    case 'back': $direction = 4; break;
                    case 'left': $direction = 1; break;
                }
                break;
            case 3:
                switch($before_direction){
                    case 'front': $direction = 3; break;
                    case 'right': $direction = 4; break;
                    case 'back': $direction = 1; break;
                    case 'left': $direction = 2; break;
                }
                break;
            case 4:
                switch($before_direction){
                    case 'front': $direction = 4; break;
                    case 'right': $direction = 1; break;
                    case 'back': $direction = 2; break;
                    case 'left': $direction = 3; break;
                }
                break;
        }
        return $direction;
    }
}

