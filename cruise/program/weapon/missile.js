/**
 * ミサイル実体
 *
 */
var Missile = function()
{
};


Missile.prototype = {
    type:           new String('launcher'),
    object_key:     new String('Missile'),
    image_key:      new String('missile'),
    image_group:    new Array('m', 's'),
    title:          new String('誘導ミサイル'),


    speed:          new Number(8),
    mobility:       new Number(0.05),
    limit_max:      new Number(14),
    pass_max:       new Number(100),
    might:          new Number(50),


    image_W:        new Number(5),
    image_H:        new Number(41),
    image_opacity:  {
        M: new Number(1.0),
        S: new Number(0.1)
    },




    /**
     * 初期化
     *
     */
    init: function()
    {
    },


    /**
     * 
     *
     * @param   number  pos_X
     * @param   number  pos_Y
     * @param   number  pos_S
     */
    setPosition: function(pos_X, pos_Y, pos_S)
    {
        switch(true){
            case (this.player.rotate_process >=  3): var X_coefficient = 12; break;
            case (this.player.rotate_process >   0): var X_coefficient = 14; break;
            case (this.player.rotate_process ==  0): var X_coefficient = 18; break;
            case (this.player.rotate_process >  -3): var X_coefficient = 14; break;
            case (this.player.rotate_process <= -3): var X_coefficient = 12; break;
        }
        pos_Y += Math.sin(this.player.pos.S) * X_coefficient + Math.cos(this.player.pos.S) * 40;
        pos_X += Math.cos(this.player.pos.S) * X_coefficient - Math.sin(this.player.pos.S) * 40;

        this.pos.X = pos_X;
        this.pos.Y = pos_Y;
        this.pos.S = pos_S;
    },


    /**
     * 目標の捕捉
     *
     * @param   object  entity  MissileEntity
     */
    lockOn: function(entity)
    {
        if(entity.target != null){
            if(entity.target.hp > 0){
                return;
            }
        }
        entity.target = null;

        for(var i in this.area.enemies){
            var target = this.area.enemies[i];
            if(target.appeared == true){
                entity.target = target;
                return;
                break;
            }
        }
    }
};




/**
 * ミサイル放出体実体
 *
 */
var MissileEntity = function()
{
};


MissileEntity.prototype = {
    /**
     * 目標
     *
     */
    target: null,




    /**
     * 初期化
     *
     * @param   array   params
     */
    init: function(params)
    {
        if(params != undefined){
            for(var i in params){
                if(this[i] !== undefined){
                    this[i] = params[i];
                }
            }
        }

        if(this.pos == null){
            this.pos = {
                X: this.basis.pos.X,
                Y: this.basis.pos.Y,
                S: this.basis.pos.S
            };
        }
        if(this.op_cond == null){
            this.op_cond = {
                rotate: 'O'
            }
        }
        if(this.passed == null){
            this.passed = 0;
        }
    },


    /**
     * フェーズ内処理実行
     *
     */
    turn: function()
    {
        this.basis.lockOn(this);
        if(this.target){
            this.turnForTarget();
        }
        if(this.enable == false){
            return;
        }
    },


    /**
     * 目標に対しての相対角度の算出
     *
     * @return  @number
     */
    turnForTarget: function()
    {
        this.entity_basis.turnForTarget(this);
        if(this.enable == false){
            return;
        }

        if(this.passed >= 10){
            if(this.target){
                if((this.passed % 2) == 0){
                    var pai = Math.PI;
                    var rel_Y = Math.abs(this.target.pos.Y - this.pos.Y);
                    var rel_X = Math.abs(this.target.pos.X - this.pos.X);
                    if(rel_Y == 0){
                        var abs_S = (pai / 2) * ((rel_X >= 0) ? 1 : -1);
                    }
                    else{
                        var abs_S = Math.atan(rel_X / rel_Y);
                        abs_S = (this.target.pos.Y < this.pos.Y) ? abs_S : (pai - abs_S);
                        abs_S = (this.target.pos.X > this.pos.X) ? abs_S : (abs_S * -1);
                    }

                    var rel_S = (abs_S - this.pos.S) % (pai * 2);
                    if(Math.abs(rel_S) > pai){
                        rel_S = (pai - Math.abs((abs_S - this.pos.S) % pai)) * ((rel_S > 0) ? -1 : 1);
                    }

                    if(Math.abs(rel_S) > 0.01){
                        switch(true){
                            case (rel_S > 0): this.pos.S += ((rel_S > this.basis.mobility) ? this.basis.mobility : rel_S); break;
                            case (rel_S < 0): this.pos.S -= ((rel_S < this.basis.mobility) ? this.basis.mobility : rel_S); break;
                        }
                    }
                }
            }
        }
    }
};
