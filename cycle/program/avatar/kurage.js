/**
 * 
 *
 */
var Avatar_Kurage = function()
{
};


Avatar_Kurage.prototype = {
    embody_code:    new String('Kurage'),


    image_W:        new Number(39),
    image_H:        new Number(39),


    /**
     * 位置調整
     */
    adjustPos: function()
    {
        switch (this.owner.direction) {
            case 'L': this.pos_relative.S += 0.1; break;
            case 'R': this.pos_relative.S -= 0.1; break;
        }
    }
};
