/**
 * 
 *
 */
var Tako_Subordinate = function()
{
};


Tako_Subordinate.prototype = {
    object_key:     new String('Tako_Subordinate'),
    image_key:      new String('tako_subordinate'),
    image_group:    new Array('m', 's'),


    speed:          new Number(1),
    mobility:       new Number(0.0),
    might:          new Number(40),


    hp:             new Number(75),


    image_W:        new Number(11),
    image_H:        new Number(59),
    image_opacity:  {
        M: new Number(1.0),
        S: new Number(0.5)
    },


    basis:          null,
    sub_basis:      null,
    sub_count:      new Number(),
    //sub_sita:       new Number(),




    /**
     * 初期化
     *
     */
    init: function()
    {
        if(this.op_cond == null){
            this.op_cond = {
                rotate: new Number(0),
                phase:  1
            };
        }
        if(this.basis != null){
            if(this.sub_count == 1){
                this.sub_basis = this.basis;
            }
            else{
                this.sub_basis = this.basis.sub_entities[this.basis.sub_entities.length - 1];
            }
        }
    },


    /**
     * 
     *
     */
    initPos :function()
    {
        var bss_tail_X = this.sub_basis.pos.X - (this.sub_basis.image_CY * Math.sin(this.sub_basis.pos.S));
        var bss_tail_Y = this.sub_basis.pos.Y + (this.sub_basis.image_CY * Math.cos(this.sub_basis.pos.S));
        this.pos = {
            X: bss_tail_X,
            Y: bss_tail_Y,
            S: this.sub_basis.pos.S
        };
    },


    /**
     * フェーズ内処理実行
     *
     */
    turn: function()
    {
        switch(true){
            case (this.sub_basis == null):
            case (this.sub_basis.hp <= 0):
                this.op_cond.rotate = this.pos.S;
                this.op_cond.phase = 2;
                break;
        }

        switch(this.op_cond.phase){
            case 1: this.turn01(); break;
            case 2: this.turn02(); break;
        }
    },


    /**
     * フェーズ内処理実行
     *
     */
    turn01: function()
    {
        var bss_tail_X = this.sub_basis.pos.X - ((this.sub_basis.image_CY - 5) * Math.sin(this.sub_basis.pos.S));
        var bss_tail_Y = this.sub_basis.pos.Y + ((this.sub_basis.image_CY - 5) * Math.cos(this.sub_basis.pos.S));
        var own_head_X = this.pos.X + ((this.image_CY - 5) * Math.sin(this.pos.S));
        var own_head_Y = this.pos.Y - ((this.image_CY - 5) * Math.cos(this.pos.S));
        var rel_S = this.sub_basis.pos.S - this.pos.S;
        var rel_D = Math.sqrt(
            Math.pow(Math.abs(bss_tail_X - own_head_X), 2) +
            Math.pow(Math.abs(bss_tail_Y - own_head_Y), 2)
        );

        var rev_S_base = rel_S * 5;
        var rev_S = rev_S_base * (0.01 * rel_D);
        var abs_S = Math.abs(rel_S);
        if(rev_S > abs_S){
            rev_S = abs_S;
        }
        if(rel_S < 0){
            rev_S = Math.abs(rev_S) * -1;
        }

        this.pos.X += bss_tail_X - own_head_X;
        this.pos.Y += bss_tail_Y - own_head_Y;
        this.pos.S += rev_S;
    },


    /**
     * フェーズ内処理実行
     *
     */
    turn02: function()
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
