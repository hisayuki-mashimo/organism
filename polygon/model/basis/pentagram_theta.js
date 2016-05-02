/**
 * 五芒星
 *
 */
var Pentagram_Theta = function()
{
};


Pentagram_Theta.prototype = {
    /**
     * 初期化
     *
     */
    configure: function()
    {
        // 五芒星比率
        var RA_A01 = {
            A: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2)) - 2,
            B: 1,
            C: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2)) - 1,
            D: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2))
        };

        var LX_A00 = this.alpha;
        var LX_A01 = LX_A00 * (RA_A01.A / RA_A01.C);

        var LT_A00 = LX_A00;
        var LT_B00 = LX_A01;

        var TX_A00 = Math.PI / 2;

        var TY_A00 = 0;
        var TY_B00 = Math.PI;

        var reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            B0: {R: LT_B00, X: TX_A00, Y: TY_B00}
        };

        for (var i in reles_base) {
            var base_R = reles_base[i].R;
            var base_X = reles_base[i].X;
            var base_Y = reles_base[i].Y;

            for (var n = 0; n < 5; n ++) {
                this.reles[i + n + 'AO'] = {R: base_R};

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((Math.PI * 2 / 5) * n);
            }
        }

        this.surfaces = {
            A0_A: ['B00AO', 'B01AO', 'B02AO', 'B03AO', 'B04AO'],
            B0_A: ['A00AO', 'A01AO', 'B03AO'],
            B1_A: ['A01AO', 'A02AO', 'B04AO'],
            B2_A: ['A02AO', 'A03AO', 'B00AO'],
            B3_A: ['A03AO', 'A04AO', 'B01AO'],
            B4_A: ['A04AO', 'A00AO', 'B02AO'],
            C0_A: ['A00AO', 'B02AO', 'B03AO'],
            C1_A: ['A01AO', 'B03AO', 'B04AO'],
            C2_A: ['A02AO', 'B04AO', 'B00AO'],
            C3_A: ['A03AO', 'B00AO', 'B01AO'],
            C4_A: ['A04AO', 'B01AO', 'B02AO']
        };
    }
};
