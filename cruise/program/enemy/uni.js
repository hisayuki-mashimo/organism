/**
 * 
 *
 */
var Uni = function()
{
};


Uni.prototype = {
    object_key:     new String('Uni'),
    image_key:      new String('uni'),
    image_group:    new Array('m', 's'),


    speed:          new Number(2),
    mobility:       new Number(0.2),
    might:          new Number(52),


    hp:             new Number(100),


    image_W:        new Number(31),
    image_H:        new Number(31),
    image_opacity:  {
        M: new Number(1.0),
        S: new Number(0.5)
    },


    subordinate:    {
        object_key: new String('Uni_Subordinate'),
        count:      new Number(5)
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
                rotate:             new Number(0),
                phase:              1,
                phase_change_limit: new Number(0)
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
        this.pos.X += this.speed * Math.sin(this.op_cond.rotate);
        this.pos.Y -= this.speed * Math.cos(this.op_cond.rotate);

        if((this.ego_time % 5) == 0){
            var relation = this.calcRelation();
            var rand_chase = Math.random();
            switch(true){
                case (relation.S > 0): this.op_cond.rotate += this.mobility * ((rand_chase > 0.15) ? 1 : -1); break;
                case (relation.S < 0): this.op_cond.rotate -= this.mobility * ((rand_chase > 0.15) ? 1 : -1); break;
            }

            switch(true){
                case (rand_chase < 0.85):
                case (this.pos.X < 100):
                case (this.pos.Y < 100):
                case (this.pos.X > this.map.display_W - 100):
                case (this.pos.Y > this.map.display_H - 100):
                    break;
                default:
                    for(var i = 0; i < this.sub_entities.length; i ++){
                        var entity = this.sub_entities[i];
                        entity.op_cond.phase_change_limit = entity.ego_time + (0 * entity.sub_count);
                    }
                    this.op_cond.phase = 2;
                    this.op_cond.phase_change_limit = this.ego_time + 15;
                    break;
            }
        }

        this.pos.S += 0.5;
    },


    /**
     * フェーズ内処理実行
     *
     */
    turn02: function()
    {
        this.pos.S += 0.5;

        if(this.ego_time == this.op_cond.phase_change_limit){
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

        if((this.ego_time % 5) == 0){
            var relation = this.calcRelation();
            var rand_chase = Math.random();
            switch(true){
                case (relation.S > 0): this.op_cond.rotate += this.mobility * ((rand_chase > 0.15) ? 1 : -1); break;
                case (relation.S < 0): this.op_cond.rotate -= this.mobility * ((rand_chase > 0.15) ? 1 : -1); break;
            }
        }

        this.pos.S += 0.5;
    }
};
