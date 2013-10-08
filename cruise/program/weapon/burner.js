/**
 * アフターバーナー機構実体
 *
 */
var Burner = function()
{
};


Burner.prototype = {
    type:           new String('supporter'),
    object_key:     new String('Burner'),
    image_key:      new String('burner'),
    image_group:    new Array(),
    title:          new String('アフターバーナー(加速性能上昇)'),


    speed:          {
        T: new Number(2.5),
        R: new Number(2.5),
        B: new Number(2.5),
        L: new Number(2.5)
    },




    /**
     * 初期化
     *
     */
    init: function()
    {
    },


    /**
     * フェーズ内処理実行
     *
     */
    execute: function()
    {
        this.player.speed_alpha = {
            T: this.speed.T,
            R: this.speed.R,
            B: this.speed.B,
            L: this.speed.L
        };
    }
};
