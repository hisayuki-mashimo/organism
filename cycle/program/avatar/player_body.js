/**
 * 
 *
 */
var Avatar_Player_Body = function()
{
};


Avatar_Player_Body.prototype = {
    embody_code:    new String('Player_Body'),


    image_paturns:  [
        '1_L',      '2_L',      '3_L',      '4_L',
        '1_L_D',    '2_L_D',    '3_L_D',    '4_L_D',
        '1_R',      '2_R',      '3_R',      '4_R',
        '1_R_D',    '2_R_D',    '3_R_D',    '4_R_D'
    ],


    image_W:        new Number(60),
    image_H:        new Number(70),


    pos_relative:   {
        X: 0,
        Y: -20,
        S: 0
    },


    /**
     * 
     *
     * @return  object
     */
    getImageMaterial :function()
    {
        if (this.owner.op_cond.slide === 'O') {
            var speed_coefficients = {O: 12, A: 3, B: 6, C: 9};
        } else {
            var speed_coefficients = {O:  8, A: 2, B: 4, C: 6};
        }

        var coefficient = this.area.rest_limit % speed_coefficients.O;
        switch (true) {
            case (this.owner.op_cond.jumping === true):
                switch (this.owner.jump_phase) {
                    case 1:
                    case 3: var action_key = 4; break;
                    case 2: var action_key = 3; break;
                }
                break;
            case (coefficient < speed_coefficients.A):  var action_key = 1; break;
            case (coefficient < speed_coefficients.B):  var action_key = 2; break;
            case (coefficient < speed_coefficients.C):  var action_key = 3; break;
            default:                                    var action_key = 2; break;
        }

        var paturn_code = '';

        paturn_code += action_key;
        paturn_code += '_';
        paturn_code += this.owner.direction;
        paturn_code += (this.owner.is_damage === true) ? '_D' : '';

        return this.image_materials[paturn_code];
    }
};
