<?php
/**
 * ダンジョン: フロア
 * 
 * @package     Dungeon
 * @subpackage  Action.Dungeon
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 * @version     $Id: 259c201741852823331c526212506fe5ab5688d9 $
 */
class Action_Dungeon_Floor extends Dungeon_Action_Dungeon
{
    public
        $around,
        $attack = 0,
        $defence = 0,
        $actor,
        $actor_words;


    /**
     * 実行トリガー
     *
     * @access     public
     */
    public function execute()
    {
        parent::execute();
        
        $this->_initBySession();

        //既に死んでいる場合
        if($this->runner->isDeath()) return 'death';
        
        //バトル処理
        $choice_way = $this->Request->get('choice_way');
        $battle_cmd = $this->Request->get('battle_cmd', $choice_way ? 'move' : 'wait');
        $this->BattleProcessor->setRunner($this->runner);
        $this->BattleProcessor->execute($battle_cmd);
        $this->b_result = $this->BattleProcessor->getResult();
        

        //攻撃力 & 防御力
        $this->attack = $this->runner->getAttack();
        $this->defence = $this->runner->getDefence();
        
        //ダッシュ
        $dash_flg = $this->Request->get('dash');
        
        //移動
        if($dash_flg){
            $this->DungeonProcessor->dash($choice_way);
        }else{
            $this->DungeonProcessor->move($choice_way);
        }
        $this->result = $this->DungeonProcessor->getResult();
        
        //既に死んでいる場合
        if($this->runner->isDeath()) return 'death';
        //間違って戻ってきてしまった場合
        if($this->result->backtodungeon && $this->result->cleared && !$this->result->treasurebox) return 'outcome';

        //台詞部分
        $this->_setCharacterVoice();
        
        //表示用
        $this->items = $this->runner->bag->getItems();
        $this->around = $this->dungeon->floor->around;
        
        return 'success';
    }


    /**
     * キャラクタの台詞などをセット
     *
     * @access  private
     */
    private function _setCharacterVoice()
    {
        //死にかけている場合
        if($this->runner->isDying()){
            //妖精固定
            $this->actor = $this->CharacterManager->getByIdentifier('fairy');
            $this->actor_words = $this->actor->getMessageAtRandom('advice:dying');
        }
    }
}

