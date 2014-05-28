/**
 * 正十二面体
 *
 */
var Dodecahedron_Theta = function()
{
};


Dodecahedron_Theta.prototype = {
    // 外部設定値
    fill_style:     'rgba(255, 192, 208, 0.5)',
    stroke_style:   'rgba(240, 128, 132, 0.5)',




    /**
     * 初期化
     *
     */
    configure: function()
    {
        var pai         = Math.PI;
        var theta072    = pai * 2 / 5;
        var theta036    = pai * 2 / 10;
        var sin072      = Math.sin(theta072);
        var cos072      = Math.cos(theta072);
        var sin036      = Math.sin(theta036);
        var cos036      = Math.cos(theta036);

        // 正三角形比率
        var RA_A00 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2
        };

        // 五芒星比率
        var RA_A01 = {
            A: (4 * Math.pow(cos036, 2)) - 2,
            B: 1,
            C: (4 * Math.pow(cos036, 2)) - 1,
            D: (4 * Math.pow(cos036, 2))
        };

        var LX_A00 = this.alpha;
        var RA_X00 = this.finalizeRatioByPytha({
            A: null,
            B: (RA_A01.D / RA_A01.B) + 1,
            C: (RA_A00.B / RA_A00.A) * (RA_A01.D / RA_A01.C)
        });
        var LX_A01 = LX_A00 * 2;
        var LX_A02 = LX_A01 * (RA_X00.C / RA_X00.A) / 2;
        var LX_A03 = LX_A02 * (RA_A01.C / RA_A01.D);
        var LX_A04 = LX_A03 * 2;
        var LX_A05 = this.getLengthByPytha(LX_A04, LX_A02, null);
        var LX_A06 = LX_A05 * 2;
        var LX_A07 = LX_A06 * (RA_A01.C / (RA_A01.A + RA_A01.C));
        var LX_A08 = LX_A02 * (RA_A01.D / RA_A01.C);
        var LX_A09 = this.getLengthByPytha(null, LX_A03, LX_A08);

        var LT_A00 = LX_A09;

        var TX_A00 = Math.asin(LX_A07 / LX_A09);
        var TX_B00 = Math.asin(LX_A07 / LX_A09) + (Math.asin(LX_A03 / LX_A09) * 2);

        var TY_A00 = 0;

        var reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            B0: {R: LT_A00, X: TX_B00, Y: TY_A00}
        };

        for (var i in reles_base) {
            var base_R = reles_base[i].R;
            var base_X = reles_base[i].X;
            var base_Y = reles_base[i].Y;

            for (var n = 0; n < 5; n ++) {
                this.reles[i + n + 'AO'] = {R: base_R};
                this.reles[i + n + 'SR'] = {R: base_R};

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((pai * 2 / 5) * n);
                this.reles[i + n + 'SR'].X = base_X + pai;
                this.reles[i + n + 'SR'].Y = (base_Y + ((pai * 2 / 5) * n)) * -1;
            }
        }

        this.surfaces = {
            A0_A: ['A00AO', 'A01AO', 'A02AO', 'A03AO', 'A04AO'],
            A0_R: ['A00SR', 'A01SR', 'A02SR', 'A03SR', 'A04SR'],
            B0_A: ['A00AO', 'B00AO', 'B02SR', 'B01AO', 'A01AO'],
            B1_A: ['A01AO', 'B01AO', 'B01SR', 'B02AO', 'A02AO'],
            B2_A: ['A02AO', 'B02AO', 'B00SR', 'B03AO', 'A03AO'],
            B3_A: ['A03AO', 'B03AO', 'B04SR', 'B04AO', 'A04AO'],
            B4_A: ['A04AO', 'B04AO', 'B03SR', 'B00AO', 'A00AO'],
            B0_R: ['A00SR', 'B00SR', 'B02AO', 'B01SR', 'A01SR'],
            B1_R: ['A01SR', 'B01SR', 'B01AO', 'B02SR', 'A02SR'],
            B2_R: ['A02SR', 'B02SR', 'B00AO', 'B03SR', 'A03SR'],
            B3_R: ['A03SR', 'B03SR', 'B04AO', 'B04SR', 'A04SR'],
            B4_R: ['A04SR', 'B04SR', 'B03AO', 'B00SR', 'A00SR']
        };
    }
};
