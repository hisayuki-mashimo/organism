/**
 * 
 *
 */
var Uni_Subordinate = function()
{
};


Uni_Subordinate.prototype = {
    object_key:     new String('Uni_Subordinate'),
    image_key:      new String('uni_subordinate'),
    image_group:    new Array('m', 's'),


    speed:          new Number(12),
    mobility:       new Number(0.08),
    might:          new Number(52),


    hp:             new Number(100),


    image_W:        new Number(41),
    image_H:        new Number(33),
    image_opacity:  {
        M: new Number(1.0),
        S: new Number(0.5)
    },


    basis:          null,
    sub_count:      new Number(),
    sub_sita:       new Number(),




    /**
     * 初期化
     *
     */
    init: function()
    {
        if(this.op_cond == null){
            this.op_cond = {
                radius:             new Number(20),
                rotate:             new Number(0),
                phase:              1,
                phase_change_limit: new Number(0)
            };
        }
    },


    /**
     * フェーズ内処理実行
     *
     */
    turn: function()
    {
        switch(this.op_cond.phase){
            case 1: this.turn01(); break;
            case 2: this.turn02(); break;
            case 3: this.turn03(); break;
        }
    },


    /**
     * フェーズ内処理実行
     *
     */
    turn01: function()
    {
        var sita = this.basis.pos.S + this.sub_sita;
        this.pos.X = this.basis.pos.X + (this.op_cond.radius * Math.sin(sita));
        this.pos.Y = this.basis.pos.Y - (this.op_cond.radius * Math.cos(sita));
        this.pos.S = sita;

        if(this.op_cond.phase_change_limit == this.ego_time){
            this.op_cond.phase = 2;
            this.op_cond.phase_change_limit = this.ego_time + 15;
            this.op_cond.rotate = this.pos.S;
        }
    },


    /**
     * フェーズ内処理実行
     *
     */
    turn02: function()
    {
        this.pos.X += this.speed * Math.sin(this.pos.S);
        this.pos.Y -= this.speed * Math.cos(this.pos.S);
        this.pos.S  = this.op_cond.rotate;
        this.op_cond.rotate += 0.05;

        if(this.op_cond.phase_change_limit == this.ego_time){
            this.op_cond.phase = 3;
        }
    },


    /**
     * フェーズ内処理実行
     *
     */
    turn03: function()
    {
        this.pos.X += this.speed * Math.sin(this.op_cond.rotate);
        this.pos.Y -= this.speed * Math.cos(this.op_cond.rotate);
        this.pos.S  = this.op_cond.rotate;

        if((this.ego_time % 2) == 0){
            var relation = this.calcRelation();
            switch(true){
                case (relation.S > 0): this.op_cond.rotate += this.mobility; break;
                case (relation.S < 0): this.op_cond.rotate -= this.mobility; break;
            }
        }
    },


    /**
     * @override
     */
    initPos :function()
    {
        this.sub_sita = ((Math.PI * 2) / this.basis.subordinate.count) * (this.sub_count - 1);
        var sita = this.basis.pos.S + this.sub_sita;
        this.pos = {
            X: this.basis.pos.X + (20 * Math.sin(sita)),
            Y: this.basis.pos.Y - (20 * Math.cos(sita)),
            S: sita
        };
    }
};

