/**
 * 星型八面体
 *
 */
var Stella_Octangula_Shift_Theta = function()
{
};


Stella_Octangula_Shift_Theta.prototype = {
    // 外部設定値
    fill_style:     'rgba(128, 240, 255, 0.8)',
    stroke_style:   'rgb(80, 200, 240)',




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
        var LX_A01 = LX_A00 * (RA_A00.A / RA_A00.C);
        var LX_A02 = LX_A00 * (RA_A00.B / RA_A00.C);
        var LX_A03 = LX_A00 + LX_A01;
        var LX_A04 = getLengthByPytha(LX_A03, LX_A02, null) / 2;
        var LX_A05 = getLengthByPytha(null, LX_A02, LX_A04);

        var LX_B00 = LX_A04;

        var LX_C00 = getLengthByPytha(null, LX_A02, LX_A02) / 2;

        var LT_A00 = LX_A05;
        var LT_B00 = LX_B00;
        var LT_C00 = LX_C00;

        var TX_A00 = Math.asin(LX_A02 / LX_A05);
        var TX_C00 = pai / 2;
        var TX_Z00 = 0;

        var TY_A00 = 0;
        var TY_C00 = pai / 4;
        var TY_Z00 = 0;

        var reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            C0: {R: LT_C00, X: TX_C00, Y: TY_C00},
            Z0: {R: LT_B00, X: TX_Z00, Y: TY_Z00}
        };

        for (var i in reles_base) {
            for (var n = 0; n < 4; n ++) {
                this.reles[i + n + 'AO'] = {R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (pai / 2 * n)};
                this.reles[i + n + 'SO'] = {R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (pai / 2 * n)};
                this.reles[i + n + 'AR'] = {R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (pai / 2 * n)};
                this.reles[i + n + 'SR'] = {R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (pai / 2 * n)};

                this.reles[i + n + 'SO'].Y *= -1;
                this.reles[i + n + 'SR'].Y *= -1;
                this.reles[i + n + 'SO'].Y += TY_A00 + pai;
                this.reles[i + n + 'SR'].Y += TY_A00 + pai;
                this.reles[i + n + 'AR'].X += pai;
                this.reles[i + n + 'SR'].X += pai;
            }
        }

        this.surfaces = {
            /*A0_A: ['Z00AO', 'B00AO', 'B01AO'],
            A1_A: ['Z00AO', 'B01AO', 'B02AO'],
            A2_A: ['Z00AO', 'B02AO', 'B00AO'],
            A0_S: ['Z00AR', 'B00AR', 'B01AR'],
            A1_S: ['Z00AR', 'B01AR', 'B02AR'],
            A2_S: ['Z00AR', 'B02AR', 'B00AR'],

            B0_A: ['A00AO', 'B01AO', 'B02AO'],
            B1_A: ['A01AO', 'B02AO', 'B00AO'],
            B2_A: ['A02AO', 'B00AO', 'B01AO'],
            B0_S: ['A00AR', 'B01AR', 'B02AR'],
            B1_S: ['A01AR', 'B02AR', 'B00AR'],
            B2_S: ['A02AR', 'B00AR', 'B01AR'],

            C0_A: ['A00AO', 'B01AO', 'B00AR'],
            C1_A: ['A01AO', 'B02AO', 'B01AR'],
            C2_A: ['A02AO', 'B00AO', 'B02AR'],
            C0_S: ['A00AR', 'B01AR', 'B00AO'],
            C1_S: ['A01AR', 'B02AR', 'B01AO'],
            C2_S: ['A02AR', 'B00AR', 'B02AO'],

            D0_A: ['A00AO', 'B02AO', 'B00AR'],
            D1_A: ['A01AO', 'B00AO', 'B01AR'],
            D2_A: ['A02AO', 'B01AO', 'B02AR'],
            D0_S: ['A00AR', 'B02AR', 'B00AO'],
            D1_S: ['A01AR', 'B00AR', 'B01AO'],
            D2_S: ['A02AR', 'B01AR', 'B02AO']*/
            A0_A: ['Z00AO', 'A00AO', 'C00AO'],
            A1_A: ['Z01AO', 'A01AO', 'C01AO'],
            A2_A: ['Z02AO', 'A02AO', 'C02AO'],
            A3_A: ['Z03AO', 'A03AO', 'C03AO'],
            A4_A: ['Z00AO', 'A00AO', 'C03AO'],
            A5_A: ['Z01AO', 'A01AO', 'C00AO'],
            A6_A: ['Z02AO', 'A02AO', 'C01AO'],
            A7_A: ['Z03AO', 'A03AO', 'C02AO'],
            A0_S: ['Z00AR', 'A00AR', 'C00AR'],
            A1_S: ['Z01AR', 'A01AR', 'C01AR'],
            A2_S: ['Z02AR', 'A02AR', 'C02AR'],
            A3_S: ['Z03AR', 'A03AR', 'C03AR'],
            A4_S: ['Z00AR', 'A00AR', 'C03AR'],
            A5_S: ['Z01AR', 'A01AR', 'C00AR'],
            A6_S: ['Z02AR', 'A02AR', 'C01AR'],
            A7_S: ['Z03AR', 'A03AR', 'C02AR'],

            B0_A: ['A00AO', 'C00AO', 'C03AO'],
            B1_A: ['A01AO', 'C01AO', 'C00AO'],
            B2_A: ['A02AO', 'C02AO', 'C01AO'],
            B3_A: ['A03AO', 'C03AO', 'C02AO'],
            B0_S: ['A00AR', 'C00AR', 'C03AR'],
            B1_S: ['A01AR', 'C01AR', 'C00AR'],
            B2_S: ['A02AR', 'C02AR', 'C01AR'],
            B3_S: ['A03AR', 'C03AR', 'C02AR']
        };
    }
};
