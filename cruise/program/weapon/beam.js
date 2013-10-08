/**
 * ビーム実体
 *
 */
var Beam = function()
{
};


Beam.prototype = {
    type:           new String('launcher'),
    object_key:     new String('Beam'),
    image_key:      new String('beam'),
    image_group:    new Array('m', 's'),
    title:          new String('機銃'),


    speed:          new Number(12),
    limit_max:      new Number(2),
    pass_max:       new Number(50),
    might:          new Number(10),


    image_W:        new Number(1),
    image_H:        new Number(15),
    image_opacity:  {
        M: new Number(1.0),
        S: new Number(0.4)
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
            case (this.player.rotate_process >=  3): var X_coefficient =  0; break;
            case (this.player.rotate_process >   0): var X_coefficient = -2; break;
            case (this.player.rotate_process ==  0): var X_coefficient = -3; break;
            case (this.player.rotate_process >  -3): var X_coefficient = -1; break;
            case (this.player.rotate_process <= -3): var X_coefficient = -1; break;
        }
        pos_Y += Math.sin(this.player.pos.S) * X_coefficient + Math.cos(this.player.pos.S) * -20;
        pos_X += Math.cos(this.player.pos.S) * X_coefficient - Math.sin(this.player.pos.S) * -20;

        this.pos.X = pos_X;
        this.pos.Y = pos_Y;
        this.pos.S = pos_S;
    }
};




/**
 * ビーム放出体実体
 *
 */
var BeamEntity = function()
{
};


BeamEntity.prototype = {
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
        if(this.passed == null){
            this.passed = 0;
        }
    }
};
