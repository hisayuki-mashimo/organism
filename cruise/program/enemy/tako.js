/**
 * 
 *
 */
var Tako = function()
{
};


Tako.prototype = {
    object_key:     new String('Tako'),
    image_key:      new String('tako'),
    image_group:    new Array('m', 's'),


    speed:          new Number(1),
    mobility:       new Number(0.0),
    might:          new Number(40),


    hp:             new Number(100),


    image_W:        new Number(11),
    image_H:        new Number(61),
    image_opacity:  {
        M: new Number(1.0),
        S: new Number(0.5)
    },


    subordinate:    {
        object_key: new String('Tako_Subordinate'),
        count:      new Number(3)
    },
    sub_entities:   null,




    /**
     * 初期化
     *
     */
    init: function()
    {
        if(this.op_cond == null){
            this.op_cond = {
                rotate: new Number(0)
            };
        }
        if(this.sub_entities == null){
            this.sub_entities = new Array();
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
        this.pos.S = this.op_cond.rotate;
    },


    /**
     * フェーズ内処理実行
     *
     */
    turn: function()
    {
        if((this.ego_time % 3) == 0){
            var rand = Math.random();
            if(rand > 0.2){
                var relation = this.calcRelation();
                var mbl_is_min = (this.mobility < -0.07) ? true : false;
                var mbl_is_max = (this.mobility >  0.07) ? true : false;
                switch(true){
                    case (relation.S > 0): this.mobility += (mbl_is_max ? 0 : 0.01); break;
                    case (relation.S < 0): this.mobility -= (mbl_is_min ? 0 : 0.01); break;
                }
            }
        }
        this.pos.S += this.mobility;
        this.op_cond.rotate = this.pos.S;

        this.pos.X += Math.sin(this.op_cond.rotate) * this.speed;
        this.pos.Y -= Math.cos(this.op_cond.rotate) * this.speed;
    }
};
