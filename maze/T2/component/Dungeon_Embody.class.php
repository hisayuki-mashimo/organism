<?php
/**
 * DUNGEON: 実体
 *
 * @package     DUNGEON
 * @subpackage  Embody
 * @copyright   BEFOOL,Inc.
 * @author      KIUCHI Satoshi <satoshi.kiuchi@befool.co.jp>
 * @license     別紙契約書参照
 * @version     $Id: 22a5dbda2d27da154220315664c8f497256452fa $
 */
class Dungeon_Embody
{
    /**
     * レコード
     *
     * @access  public
     * @var     object  ActiveGatewayRecord
     */
    public $record;

    /**
     * 付加情報
     *
     * @access  public
     * @var     object
     */
    public $append;


    /**
     * コンストラクタ
     *
     * @access  public
     */
    public function __construct($record = NULL)
    {
        if($record) $this->init($record);
    }


    /**
     * 初期化
     *
     * @access  public
     * @param   object  $record ActiveGatewayRecord
     */
    public function init($record)
    {
        $this->record = $record;
    }





    /**
     * マジック：取得
     *
     * @access  public
     */
    public function __get($key)
    {
        if($this->record && property_exists($this->record, $key)){
            return $this->record->$key;
        }
        throw new Dungeon_Exception('No such property. -> ' . $key);
    }

    /**
     * マジック：セット
     *
     * @access  public
     */
    public function __set($key, $value)
    {
        if($this->record && property_exists($this->record, $key)){
            $this->record->$key = $value;
            return;
        }
        throw new Dungeon_Exception('No such property. -> ' . $key);
    }
}
