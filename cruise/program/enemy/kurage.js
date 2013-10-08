/**
 * 
 *
 */
var Kurage = function()
{
};


Kurage.prototype = {
    object_key:     new String('Kurage'),
    image_key:      new String('kurage'),
    image_group:    new Array('m', 's'),


    speed:          new Number(1.5),
    mobility:       new Number(0.1),
    might:          new Number(52),


    hp:             new Number(100),


    image_W:        new Number(75),
    image_H:        new Number(75),
    image_opacity:  {
        M: new Number(1.0),
        S: new Number(0.5)
    },




    /**
     * 初期化
     *
     */
    init: function()
    {
        if(this.op_cond == null){
            this.op_cond = {
                side:   'O',
                rotate: null
            };
        }
    },


    /**
     *
     *
     *
     */
    postSetTarget: function(target)
    {
        if(this.op_cond.rotate == null){
            var relation = this.calcRelation();
            this.op_cond.rotate = relation.S;
        }
    },


    /**
     * フェーズ内処理実行
     *
     */
    turn: function()
    {
        this.pos.X += Math.sin(this.op_cond.rotate) * this.speed;
        this.pos.Y -= Math.cos(this.op_cond.rotate) * this.speed;

        if((this.ego_time % 5) == 0){
            var relation = this.calcRelation();
            var rand_chase = Math.random();
            switch(true){
                case (relation.S > 0): this.op_cond.rotate += this.mobility * ((rand_chase > 0.1) ? 1 : -1); break;
                case (relation.S < 0): this.op_cond.rotate -= this.mobility * ((rand_chase > 0.1) ? 1 : -1); break;
            }
        }

        this.pos.S += 0.5;
    }
};
