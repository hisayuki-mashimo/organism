/**
 * ビーム実体
 *
 */
var Flare = function()
{
};


Flare.prototype = {
    type:           new String('launcher'),
    object_key:     new String('Flare'),
    image_key:      new String('flare'),
    image_group:    new Array('m', 's'),
    title:          new String('フレア'),


    speed:          new Number(8),
    limit_max:      new Number(7),
    pass_max:       new Number(35),
    might:          new Number(55),


    image_W:        new Number(20),
    image_H:        new Number(34),
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
        this.pos.X = pos_X;
        this.pos.Y = pos_Y;
        this.pos.S = pos_S;
    }
};




/**
 * ビーム放出体実体
 *
 */
var FlareEntity = function()
{
};


FlareEntity.prototype = {
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
