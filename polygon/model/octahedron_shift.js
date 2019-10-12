/**
 * 正八面体
 *
 */
var Octahedron_Shift_Theta = function()
{
};


Octahedron_Shift_Theta.prototype = {
    // 外部設定値
    fill_style:     'rgba(255, 192, 208, 0.5)',
    stroke_style:   'rgba(240, 128, 132, 0.5)',




    /**
     * 初期化
     *
     */
    configure: function()
    {
        var getLengthByPytha = this.basis.geometry_calculator.getLengthByPytha;

        var pai = Math.PI;

        // 正三角形比率
        var RA_A00 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2
        };

        var LX_A00 = this.alpha;
        var LX_A01 = LX_A00 * (RA_A00.B / RA_A00.C);
        var LX_A02 = LX_A00 * (RA_A00.A / RA_A00.C);
        var LX_A03 = LX_A00 + LX_A02;
        var LX_A04 = getLengthByPytha(LX_A03, LX_A01, null);

        var LT_A00 = LX_A04;

        var TX_A00 = Math.PI / 2;
        var TX_Z00 = 0;

        var TY_A00 = 0;

        var reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            Z0: {R: LT_A00, X: TX_Z00, Y: TY_A00}
        };

        for (var i in reles_base) {
            var base_R = reles_base[i].R;
            var base_X = reles_base[i].X;
            var base_Y = reles_base[i].Y;

            for (var n = 0; n < 4; n ++) {
                this.reles[i + n + 'AO'] = {R: base_R};
                this.reles[i + n + 'SR'] = {R: base_R};

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((pai * 2 / 4) * n);
                this.reles[i + n + 'SR'].X = base_X + pai;
                this.reles[i + n + 'SR'].Y = (base_Y + ((pai * 2 / 4) * n)) * -1;
            }
        }

        this.surfaces = {
            A0_A: ['Z00AO', 'A00AO', 'A01AO'],
            A1_A: ['Z00AO', 'A01AO', 'A02AO'],
            A2_A: ['Z00AO', 'A02AO', 'A03AO'],
            A3_A: ['Z00AO', 'A03AO', 'A00AO'],
            A0_R: ['Z00SR', 'A00AO', 'A01AO'],
            A1_R: ['Z00SR', 'A01AO', 'A02AO'],
            A2_R: ['Z00SR', 'A02AO', 'A03AO'],
            A3_R: ['Z00SR', 'A03AO', 'A00AO']
        };
    }
};
