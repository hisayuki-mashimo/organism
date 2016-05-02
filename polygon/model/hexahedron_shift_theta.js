var Hexahedron_Shift_Theta = function()
{
};


Hexahedron_Shift_Theta.prototype = {
    /**
     * 初期化
     *
     */
    configure: function()
    {
        // 直角二等辺三角形比率
        var RA_A00 = {
            A: 1,
            B: Math.pow(2, 1 / 2)
        };

        // 正三角形比率
        var RA_A01 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2
        };

        var LX_A00 = this.alpha;
        var LX_A01 = LX_A00 * (RA_A00.B / RA_A00.A);
        var LX_A02 = LX_A01 / 2;
        var LX_A03 = this.basis.geometry_calculator.getLengthByPytha(null, LX_A00, LX_A02);

        var LT_A00 = LX_A03;

        var TX_A00 = Math.acos(LX_A00 / LX_A03) * 2;
        var TX_Z00 = 0;

        var TY_A00 = 0;
        var TY_Z00 = 0;

        var reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            Z0: {R: LT_A00, X: TX_Z00, Y: TX_Z00}
        };

        for (var i in reles_base) {
            var base_R = reles_base[i].R;
            var base_X = reles_base[i].X;
            var base_Y = reles_base[i].Y;

            for (var n = 0; n < 3; n ++) {
                this.reles[i + n + 'AO'] = {R: base_R};
                this.reles[i + n + 'SR'] = {R: base_R};

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((Math.PI * 2 / 3) * n);
                this.reles[i + n + 'SR'].X = base_X + Math.PI;
                this.reles[i + n + 'SR'].Y = (base_Y + ((Math.PI * 2 / 3) * n)) * -1;
            }
        }

        this.surfaces = {
            A0_A: ['Z00AO', 'A00AO', 'A01SR', 'A01AO'],
            A1_A: ['Z00AO', 'A01AO', 'A00SR', 'A02AO'],
            A2_A: ['Z00AO', 'A02AO', 'A02SR', 'A00AO'],
            A0_R: ['Z00SR', 'A00SR', 'A01AO', 'A01SR'],
            A1_R: ['Z00SR', 'A01SR', 'A00AO', 'A02SR'],
            A2_R: ['Z00SR', 'A02SR', 'A02AO', 'A00SR']
        };
    }
};
