/**
 * 試験
 *
 */
var Pointer_Theta = function()
{
};


Pointer_Theta.prototype = {
    // 外部設定値
    fill_style:     'rgba(255, 192, 208, 0.5)',
    stroke_style:   'rgba(240, 128, 132, 0.5)',




    /**
     * 初期化
     *
     */
    configure: function()
    {
        this.reles = {
            O: {R: 0,                                  X: 0,           Y: 0},
            Z: {R: this.alpha * Math.cos(Math.PI / 4), X: 0,           Y: 0},
            A: {R: this.alpha,                         X: Math.PI / 4, Y: 0},
            B: {R: this.alpha,                         X: Math.PI / 4, Y: Math.PI}
        };

        this.surfaces = {
            Z: ['O', 'Z'],
            A: ['A', 'B']
        };
    }
};
