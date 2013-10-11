/**
 * 
 *
 */
var Avatar_Player_Wheel = function()
{
};


Avatar_Player_Wheel.prototype = {
    embody_code:    new String('Player_Wheel'),


    image_W:        new Number(91),
    image_H:        new Number(91),


    op_cond:        {
        pressure: 0
    },


    /**
     * 相対位置初期化
     */
    initPos: function()
    {
        this.pos_relative = {
            X: 0,
            Y: 68,
            S: 0
        };
    },


    /**
     * 画像の出力
     *
     * @param   object  CTX
     */
    exportImage: function(CTX)
    {
        this.adjustPos();

        var scale = 1;
        if (this.op_cond.pressure > 0) {
            scale = (this.image_H - this.op_cond.pressure) / this.image_H;
        }

        CTX.setTransform(1, 0, 0, 1, 0, 0);
        CTX.translate(this.owner.pos.X,                 this.owner.pos.Y);
        CTX.translate(this.owner.body_radius.X * -1,    this.owner.body_radius.Y * -1);
        CTX.translate(this.pos_relative.X,              this.pos_relative.Y);
        CTX.scale(1, scale);
        CTX.rotate(this.pos_relative.S);
        CTX.translate(this.image_CX * -1, this.image_CY * -1);
        
        /*CTX.setTransform(
            Math.cos(this.pos_relative.S),
            Math.sin(this.pos_relative.S),
           -Math.sin(this.pos_relative.S),
            Math.cos(this.pos_relative.S),
            this.owner.pos.X + this.pos_relative.X,
            this.owner.pos.Y + this.pos_relative.Y
        );*/
        
        
        CTX.globalAlpha = this.image_opacity.M;
        CTX.drawImage(this.getImageMaterial(), 0, 0);
    },


    /**
     * 位置調整
     */
    adjustPos: function()
    {
        if (this.owner.op_cond.slide === 'O') {
            var rotate_coefficient = 0.08;
        } else {
            var rotate_coefficient = 0.14;
        }

        switch (this.owner.direction) {
            case 'L': this.pos_relative.S -= rotate_coefficient; break;
            case 'R': this.pos_relative.S += rotate_coefficient; break;
        }

        this.op_cond.pressure = 0;
        if (this.owner.op_cond.jumping === true) {
            var coefficient = this.owner.pos.Y - this.owner.map.image_horizon;
            if (coefficient > 0) {
                this.op_cond.pressure = coefficient;
            }
        }
    }
};
