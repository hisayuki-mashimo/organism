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
    image_group:    new Array('m'),


    direction:      new String(),
    speed:          new Number(),
    //mobility:       new Number(0.1),
    might:          new Number(10),


    hp:             new Number(100),


    image_W:        new Number(21),
    image_H:        new Number(21),
    image_opacity:  {
        M: new Number(1.0)//,
        //S: new Number(0.5)
    },




    /**
     * 初期化
     *
     */
    init: function()
    {
        /*if(this.op_cond == null){
            this.op_cond = {
                side:   'O',
                rotate: null
            };
        }*/
        this.direction  = (Math.random() < 0.5) ? 'L' : 'R';
        this.speed      = 1 + (Math.random() / 2);
    },


    /**
     * 位置・方向の初期化
     *
     * @param   object  embody
     */
    initPos :function()
    {
        switch (this.direction) {
            case 'L': var pos_X = -20;                      break;
            case 'R': var pos_X = this.map.display_W + 20;  break;
        }

        var pos_Y = this.map.display_H - (Math.random() * 20);

        this.pos = {
            X: pos_X,
            Y: pos_Y
        };
    },


    /**
     *
     *
     *
     */
    execute: function()
    {
        // フェーズ内行動
        this.turn();

        if (this.appeared === true) {
            switch(true){
                case (this.pos.X >= this.body_radius.X * -1):
                case (this.pos.Y >= this.body_radius.Y * -1):
                case (this.pos.X <= this.map.display_W + this.body_radius.X):
                case (this.pos.Y <= this.map.display_H + this.body_radius.Y):
                    break;
                default:
                    this.existed = false;
                    break;
            }
        }
    },


    /**
     * フェーズ内処理実行
     *
     */
    turn: function()
    {
        switch (this.direction) {
            case 'L': this.pos.X += this.speed; break;
            case 'R': this.pos.X -= this.speed; break;
        }
    }
};
