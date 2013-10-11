/**
 * 
 *
 */
var Kurage = function()
{
};


Kurage.prototype = {
    object_key:     new String('Kurage'),


    direction:      new String(),
    speed:          new Number(),
    might:          new Number(10),


    hp:             new Number(100),




    /**
     * 初期化
     *
     */
    init: function()
    {
        this.direction  = (Math.random() < 0.5) ? 'L' : 'R';
        this.speed      = 1 + (Math.random() * 10 / 2);

        this.body_radius = {
            X: 20,
            Y: 20
        };
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

        var pos_Y = this.map.image_horizon - (Math.random() * 50);

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
        this.basis.execute(this);

        if (this.appeared === true) {
            switch (true) {
                case (this.pos.X < this.body_radius.X * -1):
                case (this.pos.Y < this.body_radius.Y * -1):
                case (this.pos.X > this.map.display_W + this.body_radius.X):
                case (this.pos.Y > this.map.display_H + this.body_radius.Y):
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

        switch (this.map.player.direction) {
            case 'L': this.pos.X += 2; break;
            case 'R': this.pos.X -= 2; break;
        }
    }
};
