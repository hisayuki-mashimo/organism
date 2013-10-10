/**
 * 
 *
 */
var Avatar_Kurage = function()
{
};


Avatar_Kurage.prototype = {
    embody_code:    new String('Kurage'),


    image_W:        new Number(91),
    image_H:        new Number(91),


    pos_relative:   {
        X: 0,
        Y: 50,
        S: 0
    },


    /**
     * 位置調整
     */
    adjustPos: function()
    {
        /*switch (this.owner.direction) {
            case 'L': this.pos_relative.S -= 0.2; break;
            case 'R': this.pos_relative.S += 0.2; break;
        }*/
    }
};
