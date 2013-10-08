/**
 * メーター実体
 *
 * @param   object  meter_node
 */
var Meter = function(frame_node)
{
    this.frame_node = frame_node;
}


Meter.prototype = {
    frame_node: null,
    context: null,
    type: null,


    display_H:  new Number(),
    display_W:  new Number(),
    gauge_W:    new Number(),
    color_MAX:  {R: Number(255),    G: new Number(255), B: new Number(160)},
    color_MIN:  {R: Number(255),    G: new Number(0),   B: new Number(0)},


    /**
     * 依存オブジェクト
     *
     */
    depends: new Array(
        'player'
    ),


    /**
     * 初期化
     *
     * @param   array   params
     */
    init: function(params)
    {
        if(params != undefined){
            for(i in params){
                if(this[1] !== undefined){
                    this[i] = params[i];
                }
            }
        }

        this.context = this.frame_node.getContext('2d');

        this.display_W = Math.floor(new Number($(this.frame_node).css('width').replace(/px/, '')));
        this.display_H = Math.floor(new Number($(this.frame_node).css('height').replace(/px/, '')));
    },


    /**
     *
     *
     */
    execute: function()
    {
        switch(this.type){
            case 'hp':      var values = {now: this.player.hp,      max: this.player.hp_max};       break;
            case 'energy':  var values = {now: this.player.energy,  max: this.player.energy_max};   break;
        }
        var percentage = values.now / values.max;
        var gauge_length = Math.round(percentage * this.display_W);
        if((gauge_length == 0) && (values.now > 0)){
            gauge_length = 1;
        }

        this.gauge_W = gauge_length;

        var clr_R = Math.round(((this.color_MAX.R - this.color_MIN.R) * percentage) + this.color_MIN.R);
        var clr_G = Math.round(((this.color_MAX.G - this.color_MIN.G) * percentage) + this.color_MIN.G);
        var clr_B = Math.round(((this.color_MAX.B - this.color_MIN.B) * percentage) + this.color_MIN.B);

        this.context.clearRect(0, 0, this.display_W, this.display_H);
        this.context.strokeStyle = 'rgb(' + clr_R + ', ' + clr_G + ', ' + clr_B + ')';
        this.context.strokeRect(0, 0, this.gauge_W, this.display_H);
        this.context.fillStyle = 'rgb(' + clr_R + ', ' + clr_G + ', ' + clr_B + ')';
        this.context.fillRect(0, 0, this.gauge_W, this.display_H);
    }
};
