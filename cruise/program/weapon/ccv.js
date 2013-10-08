/**
 * CCV機構実体
 *
 */
var Ccv = function()
{
};


Ccv.prototype = {
    type:           new String('supporter'),
    object_key:     new String('Ccv'),
    image_key:      new String('ccv'),
    image_group:    new Array(),
    title:          new String('CCV(旋回性能上昇)'),


    mobility:   new Number(0.03),




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
        this.player.mobility_alpha = this.mobility;
    }
};
