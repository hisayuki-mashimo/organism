/**
 * 5つの正四面体
 *
 */
var Fifth_Tetrahedron_Shift_Theta = function()
{
};


Fifth_Tetrahedron_Shift_Theta.prototype = {
    // 外部設定値
    fill_style:     'rgba(160, 160, 224, 0.8)',
    stroke_style:   'rgba(64, 64, 176, 0.5)',




    /**
     * 初期化
     *
     */
    configure: function()
    {
        var getLengthByPytha        = this.basis.geometry_calculator.getLengthByPytha;
        var finalizeRatioByPytha    = this.basis.geometry_calculator.finalizeRatioByPytha;

        var pai         = Math.PI;
        var theta060    = pai / 3;
        var sin060      = Math.sin(theta060);
        var cos060      = Math.cos(theta060);
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
        var RA_X00 = finalizeRatioByPytha({
            A: null,
            B: (RA_A01.D / RA_A01.B) + 1,
            C: (RA_A00.B / RA_A00.A) * (RA_A01.D / RA_A01.C)
        });
        var LX_A01 = LX_A00 * 2;
        var LX_A02 = LX_A01 * (RA_X00.C / RA_X00.A) / 2;
        var LX_A03 = LX_A02 * (RA_A01.C / RA_A01.D);
        var LX_A04 = LX_A03 * 2;
        var LX_A05 = getLengthByPytha(LX_A04, LX_A02, null);
        var LX_A06 = LX_A05 * 2;
        var LX_A07 = LX_A06 * (RA_A01.C / (RA_A01.A + RA_A01.C));
        var LX_A08 = LX_A02 * (RA_A01.D / RA_A01.C);
        var LX_A09 = getLengthByPytha(null, LX_A03, LX_A08);

        var LX_C00 = getLengthByPytha(LX_A09, LX_A07, null);
        var LX_C01 = LX_C00 * 2;
        var LX_C02 = LX_C01 * (RA_A01.B / RA_A01.D);
        var LX_C03 = LX_C02 * (RA_A01.B / RA_A01.C);
        var LX_C04 = LX_C00 - LX_C03;

        var LX_D00 = LX_C02 * (RA_A01.B / RA_A01.D);
        var RA_X01 = {
            A: LX_D00,
            B: LX_C01 - LX_D00,
            C: LX_C01
        };
        var LX_D01 = LX_C01 * (RA_X01.B / RA_X01.C);
        var LX_D02 = LX_D01 - LX_C00;
        var LX_D03 = getLengthByPytha(LX_A07, LX_A03, null);
        var LX_D04 = LX_A07 - LX_A05;
        var LX_D05 = LX_D03 - LX_D04;
        var LX_D06 = LX_D05 * (RA_X01.A / RA_X01.C);
        var LX_D07 = LX_D04 + LX_D06;
        var LX_D08 = getLengthByPytha(null, LX_D02, LX_D07);

        var LX_E00 = LX_A02 * (RA_A01.D / RA_A01.C);
        var LX_E01 = LX_E00 * (RA_A01.B / RA_A01.D);
        var LX_E02 = LX_A07 / 2;
        var LX_E03 = LX_A07 + LX_E02;
        var LX_E04 = LX_E03 * (RA_A01.C / RA_A01.D);
        var LX_E05 = LX_E04 - LX_E02;
        var LX_E06 = getLengthByPytha(null, LX_E01, LX_E05);

        var LX_G00 = LX_A03 * (RA_A01.B / RA_A01.D);
        var LX_G01 = LX_A07 - LX_D03;
        var LX_G02 = LX_G01 * (RA_A01.C / RA_A01.D);
        var LX_G03 = LX_D03 + LX_G02;
        var LX_G04 = LX_C00 * 2;
        var LX_G05 = LX_G04 * (RA_A01.C / RA_A01.D);
        var LX_G06 = LX_G05 - LX_C00;

        var LX_H00 = LX_C01 * (RA_A01.A / RA_A01.D);
        var LX_H01 = LX_H00 * (RA_A01.C / RA_A01.D);
        var LX_H02 = LX_H00 / 2;
        var LX_H03 = LX_H01 - LX_H02;
        var LX_H04 = getLengthByPytha(null, LX_A07, LX_H03);

        var LT_A00 = LX_A09;
        var LT_C00 = LX_C04;
        var LT_D00 = LX_D08;
        var LT_H00 = LX_H04;

        var TX_A00 = Math.asin(LX_A07 / LX_A09);
        var TX_B00 = Math.asin(LX_A07 / LX_A09) + (Math.asin(LX_A03 / LX_A09) * 2);
        var TX_C00 = 0;
        var TX_D00 = Math.asin(LX_D07 / LX_D08);
        var TX_E00 = Math.asin(LX_E06 / LX_D08);
        var TX_F00 = Math.atan(LX_D03 / LX_C00) * -2 + pai;
        var TX_G00 = Math.acos(LX_G06 / LX_D08);
        var TX_H00 = Math.asin(LX_H03 / LX_H04) + (pai / 2);

        var TY_A00 = 0;
        var TY_E00 = Math.asin(LX_E01 / LX_E06);
        var TY_G00 = Math.asin(LX_A02 / LX_A07) - Math.atan(LX_G00 / LX_G03)

        var reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            B0: {R: LT_A00, X: TX_B00, Y: TY_A00},
            C0: {R: LT_C00, X: TX_C00, Y: TY_A00},
            D0: {R: LT_D00, X: TX_D00, Y: TY_A00},
            E0: {R: LT_D00, X: TX_E00, Y: TY_E00},
            F0: {R: LT_C00, X: TX_F00, Y: TY_A00},
            G0: {R: LT_D00, X: TX_G00, Y: TY_G00},
            H0: {R: LT_H00, X: TX_H00, Y: TY_A00}
        };

        for (var i in reles_base) {
            var base_R = reles_base[i].R;
            var base_X = reles_base[i].X;
            var base_Y = reles_base[i].Y;

            for (var n = 0; n < 5; n ++) {
                this.reles[i + n + 'AO'] = {R: base_R};
                this.reles[i + n + 'AR'] = {R: base_R};
                this.reles[i + n + 'SO'] = {R: base_R};
                this.reles[i + n + 'SR'] = {R: base_R};

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((pai * 2 / 5) * n);
                this.reles[i + n + 'AR'].X = base_X + pai;
                this.reles[i + n + 'AR'].Y = base_Y + ((pai * 2 / 5) * n);
                this.reles[i + n + 'SO'].X = base_X;
                this.reles[i + n + 'SO'].Y = (base_Y + ((pai * 2 / 5) * n)) * -1;
                this.reles[i + n + 'SR'].X = base_X + pai;
                this.reles[i + n + 'SR'].Y = (base_Y + ((pai * 2 / 5) * n)) * -1;
            }
        }

        this.surfaces = {
            A0_A: ['A00AO', 'D04AO', 'C00AO', 'D00AO', 'E00AO'],
            A1_A: ['A01AO', 'D00AO', 'C01AO', 'D01AO', 'E01AO'],
            A2_A: ['A02AO', 'D01AO', 'C02AO', 'D02AO', 'E02AO'],
            A3_A: ['A03AO', 'D02AO', 'C03AO', 'D03AO', 'E03AO'],
            A4_A: ['A04AO', 'D03AO', 'C04AO', 'D04AO', 'E04AO'],
            A0_R: ['A00SR', 'D04SR', 'C00SR', 'D00SR', 'E00SR'],
            A1_R: ['A01SR', 'D00SR', 'C01SR', 'D01SR', 'E01SR'],
            A2_R: ['A02SR', 'D01SR', 'C02SR', 'D02SR', 'E02SR'],
            A3_R: ['A03SR', 'D02SR', 'C03SR', 'D03SR', 'E03SR'],
            A4_R: ['A04SR', 'D03SR', 'C04SR', 'D04SR', 'E04SR'],
            B0_A: ['A00AO', 'G04AO', 'F03SR', 'E04AO', 'D04AO'],
            B1_A: ['A01AO', 'G00AO', 'F02SR', 'E00AO', 'D00AO'],
            B2_A: ['A02AO', 'G01AO', 'F01SR', 'E01AO', 'D01AO'],
            B3_A: ['A03AO', 'G02AO', 'F00SR', 'E02AO', 'D02AO'],
            B4_A: ['A04AO', 'G03AO', 'F04SR', 'E03AO', 'D03AO'],
            B0_R: ['A00SR', 'G04SR', 'F03AO', 'E04SR', 'D04SR'],
            B1_R: ['A01SR', 'G00SR', 'F02AO', 'E00SR', 'D00SR'],
            B2_R: ['A02SR', 'G01SR', 'F01AO', 'E01SR', 'D01SR'],
            B3_R: ['A03SR', 'G02SR', 'F00AO', 'E02SR', 'D02SR'],
            B4_R: ['A04SR', 'G03SR', 'F04AO', 'E03SR', 'D03SR'],
            C0_A: ['A00AO', 'E00AO', 'F02SR', 'E04SO', 'G04AO'],
            C1_A: ['A01AO', 'E01AO', 'F01SR', 'E03SO', 'G00AO'],
            C2_A: ['A02AO', 'E02AO', 'F00SR', 'E02SO', 'G01AO'],
            C3_A: ['A03AO', 'E03AO', 'F04SR', 'E01SO', 'G02AO'],
            C4_A: ['A04AO', 'E04AO', 'F03SR', 'E00SO', 'G03AO'],
            C0_R: ['A00SR', 'E00SR', 'F02AO', 'E04AR', 'G04SR'],
            C1_R: ['A01SR', 'E01SR', 'F01AO', 'E03AR', 'G00SR'],
            C2_R: ['A02SR', 'E02SR', 'F00AO', 'E02AR', 'G01SR'],
            C3_R: ['A03SR', 'E03SR', 'F04AO', 'E01AR', 'G02SR'],
            C4_R: ['A04SR', 'E04SR', 'F03AO', 'E00AR', 'G03SR'],
            D0_A: ['B00AO', 'H02AR', 'H00AO', 'F00AO', 'G02AR'],
            D1_A: ['B01AO', 'H03AR', 'H01AO', 'F01AO', 'G03AR'],
            D2_A: ['B02AO', 'H04AR', 'H02AO', 'F02AO', 'G04AR'],
            D3_A: ['B03AO', 'H00AR', 'H03AO', 'F03AO', 'G00AR'],
            D4_A: ['B04AO', 'H01AR', 'H04AO', 'F04AO', 'G01AR'],
            D0_R: ['B00SR', 'H02SO', 'H00SR', 'F00SR', 'G02SO'],
            D1_R: ['B01SR', 'H03SO', 'H01SR', 'F01SR', 'G03SO'],
            D2_R: ['B02SR', 'H04SO', 'H02SR', 'F02SR', 'G04SO'],
            D3_R: ['B03SR', 'H00SO', 'H03SR', 'F03SR', 'G00SO'],
            D4_R: ['B04SR', 'H01SO', 'H04SR', 'F04SR', 'G01SO'],
            E0_A: ['B00AO', 'G02AR', 'G04SO', 'F02SR', 'E04SO'],
            E1_A: ['B01AO', 'G03AR', 'G03SO', 'F01SR', 'E03SO'],
            E2_A: ['B02AO', 'G04AR', 'G02SO', 'F00SR', 'E02SO'],
            E3_A: ['B03AO', 'G00AR', 'G01SO', 'F04SR', 'E01SO'],
            E4_A: ['B04AO', 'G01AR', 'G00SO', 'F03SR', 'E00SO'],
            E0_R: ['B00SR', 'G02SO', 'G04AR', 'F02AO', 'E04AR'],
            E1_R: ['B01SR', 'G03SO', 'G03AR', 'F01AO', 'E03AR'],
            E2_R: ['B02SR', 'G04SO', 'G02AR', 'F00AO', 'E02AR'],
            E3_R: ['B03SR', 'G00SO', 'G01AR', 'F04AO', 'E01AR'],
            E4_R: ['B04SR', 'G01SO', 'G00AR', 'F03AO', 'E00AR'],
            F0_A: ['B00AO', 'H02AR', 'F02AR', 'G04AO', 'E04SO'],
            F1_A: ['B01AO', 'H03AR', 'F03AR', 'G00AO', 'E03SO'],
            F2_A: ['B02AO', 'H04AR', 'F04AR', 'G01AO', 'E02SO'],
            F3_A: ['B03AO', 'H00AR', 'F00AR', 'G02AO', 'E01SO'],
            F4_A: ['B04AO', 'H01AR', 'F01AR', 'G03AO', 'E00SO'],
            F0_R: ['B00SR', 'H02SO', 'F02SO', 'G04SR', 'E04AR'],
            F1_R: ['B01SR', 'H03SO', 'F03SO', 'G00SR', 'E03AR'],
            F2_R: ['B02SR', 'H04SO', 'F04SO', 'G01SR', 'E02AR'],
            F3_R: ['B03SR', 'H00SO', 'F00SO', 'G02SR', 'E01AR'],
            F4_R: ['B04SR', 'H01SO', 'F01SO', 'G03SR', 'E00AR']
        };
    }
};
