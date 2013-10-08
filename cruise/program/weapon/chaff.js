/**
 * チャフ実体
 *
 */
var Chaff = function()
{
};


Chaff.prototype = {
    type:           new String('launcher'),
    object_key:     new String('Chaff'),
    image_key:      new String('chaff'),
    image_group:    new Array('m', 's'),
    title:          new String('チャフ'),


    speed:          new Number(-4),
    limit_max:      new Number(12),
    pass_max:       new Number(30),
    might:          new Number(25),
    chain:          new Number(4),
    chain_pass:     null,
    launched_count: new Number(0),


    image_W:    new Number(20),
    image_H:    new Number(34),
    image_opacity: {
        M: new Number(0.8),
        S: new Number(0.4)
    },




    /**
     * 初期化
     *
     * @param   object  params
     */
    init: function()
    {
        if(this.chain_pass == null){
            this.chain_pass = 0;
        }
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
        pos_Y += Math.sin(this.player.pos.S) + Math.cos(this.player.pos.S) * 30;
        pos_X += Math.cos(this.player.pos.S) - Math.sin(this.player.pos.S) * 30;
        var sita_base   = 1.8;
        var sita_alpha  = (sita_base / 2 * -1) + (this.chain_pass * (sita_base / (this.chain - 1)));
        pos_S += sita_alpha;

        this.pos.X = pos_X;
        this.pos.Y = pos_Y;
        this.pos.S = pos_S;
    },


    /**
     * 発射
     *
     * @return  object
     */
    launch: function()
    {
        this.chain_pass ++;
        if(this.chain_pass >= this.chain){
            this.chain_pass = 0;
        }

        return this.basis.launch(this);
    }
};




/**
 * ビーム放出体実体
 *
 */
var ChaffEntity = function()
{
};


ChaffEntity.prototype = {
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
