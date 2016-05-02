/**
 * ³“ρ\–Κ‘Μ
 *
 */
var Icosahedron_Shift_Theta = function()
{
};


Icosahedron_Shift_Theta.prototype = {
    /**
     * ‰ϊ‰»
     *
     */
    configure: function()
    {
        // ³Op`”δ—¦
        var RA_A00 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2
        };

        // άδ―”δ—¦
        var RA_A01 = {
            A: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2)) - 2,
            B: 1,
            C: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2)) - 1,
            D: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2))
        };

        var LX_A00 = this.alpha;
        var LX_A01 = LX_A00 * (RA_A00.B / RA_A00.C);
        var LX_A02 = LX_A01 * (RA_A01.D / RA_A01.C);
        var LX_A03 = LX_A01 * 2;
        var LX_A04 = this.basis.geometry_calculator.getLengthByPytha(LX_A03, LX_A02, null);
        var LX_A05 = LX_A04 * (RA_A01.D / RA_A01.B);
        var LX_A06 = LX_A05 - LX_A04;
        var LX_A07 = this.basis.geometry_calculator.getLengthByPytha(LX_A04, LX_A01, null);
        var LX_A08 = LX_A01 + LX_A07;
        var LX_A09 = this.basis.geometry_calculator.getLengthByPytha(null, LX_A01, LX_A08);

        var LT_A00 = LX_A09;

        var TX_A00 = Math.asin(LX_A01 / LX_A09) * 2;
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

            for (var n = 0; n < 5; n ++) {
                this.reles[i + n + 'AO'] = {R: base_R};
                this.reles[i + n + 'SR'] = {R: base_R};

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((Math.PI * 2 / 5) * n);
                this.reles[i + n + 'SR'].X = base_X + Math.PI;
                this.reles[i + n + 'SR'].Y = (base_Y + ((Math.PI * 2 / 5) * n)) * -1;
            }
        }

        this.surfaces = {
            A0_A: ['Z00AO', 'A00AO', 'A01AO'],
            A1_A: ['Z00AO', 'A01AO', 'A02AO'],
            A2_A: ['Z00AO', 'A02AO', 'A03AO'],
            A3_A: ['Z00AO', 'A03AO', 'A04AO'],
            A4_A: ['Z00AO', 'A04AO', 'A00AO'],
            A0_R: ['Z00SR', 'A00SR', 'A01SR'],
            A1_R: ['Z00SR', 'A01SR', 'A02SR'],
            A2_R: ['Z00SR', 'A02SR', 'A03SR'],
            A3_R: ['Z00SR', 'A03SR', 'A04SR'],
            A4_R: ['Z00SR', 'A04SR', 'A00SR'],
            B0_A: ['A00AO', 'A01AO', 'A02SR'],
            B1_A: ['A01AO', 'A02AO', 'A01SR'],
            B2_A: ['A02AO', 'A03AO', 'A00SR'],
            B3_A: ['A03AO', 'A04AO', 'A04SR'],
            B4_A: ['A04AO', 'A00AO', 'A03SR'],
            B0_R: ['A00SR', 'A01SR', 'A02AO'],
            B1_R: ['A01SR', 'A02SR', 'A01AO'],
            B2_R: ['A02SR', 'A03SR', 'A00AO'],
            B3_R: ['A03SR', 'A04SR', 'A04AO'],
            B4_R: ['A04SR', 'A00SR', 'A03AO']
        };
    }
};
