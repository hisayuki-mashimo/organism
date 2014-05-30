/**
 * 正八面体
 *
 */
var Octahedron_Theta = function()
{
};


Octahedron_Theta.prototype = {
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

        var TX_A00 = Math.asin(LX_A00 / LX_A04);

        var TY_A00 = 0;

        var reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00}
        };

        for (var i in reles_base) {
            var base_R = reles_base[i].R;
            var base_X = reles_base[i].X;
            var base_Y = reles_base[i].Y;

            for (var n = 0; n < 3; n ++) {
                this.reles[i + n + 'AO'] = {R: base_R};
                this.reles[i + n + 'SR'] = {R: base_R};

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((pai * 2 / 3) * n);
                this.reles[i + n + 'SR'].X = base_X + pai;
                this.reles[i + n + 'SR'].Y = (base_Y + ((pai * 2 / 3) * n)) * -1;
            }
        }

        this.surfaces = {
            A0_A: ['A00AO', 'A01AO', 'A02AO'],
            A0_R: ['A00SR', 'A01SR', 'A02SR'],
            B0_A: ['A00AO', 'A01SR', 'A01AO'],
            B1_A: ['A01AO', 'A00SR', 'A02AO'],
            B2_A: ['A02AO', 'A02SR', 'A00AO'],
            B0_R: ['A00SR', 'A01AO', 'A01SR'],
            B1_R: ['A01SR', 'A00AO', 'A02SR'],
            B2_R: ['A02SR', 'A02AO', 'A00SR']
        };
    }
};
