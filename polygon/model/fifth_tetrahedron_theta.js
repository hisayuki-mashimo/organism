/**
 * 5つの正四面体
 *
 */
var Fifth_Tetrahedron_Theta = function()
{
};


Fifth_Tetrahedron_Theta.prototype = {
    // 外部設定値
    fill_style:     'rgba(160, 160, 224, 0.8)',
    stroke_style:   'rgba(64, 64, 176, 0.5)',




    /**
     * 初期化
     *
     */
    configure: function()
    {
        var getLengthByPytha = this.basis.geometry_calculator.getLengthByPytha;

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
        var LX_A01 = LX_A00 * (RA_A00.B / RA_A00.C);
        var LX_A02 = LX_A00 * (RA_A00.A / RA_A00.C);
        var LX_A03 = LX_A00 + LX_A02;
        var LX_A04 = getLengthByPytha(LX_A03, LX_A02, null); // Oからの△ABCへの垂線
        var RA_X00 = {
            A: LX_A04,
            B: LX_A03
        };
        var LX_A05 = LX_A00 * (RA_X00.B / RA_X00.A);
        var RA_X01 = finalizeRatioByPytha({
            A: null,
            B: (RA_A01.D / RA_A01.B) + 1,
            C: (RA_A00.B / RA_A00.A) * (RA_A01.D / RA_A01.C)
        });
        var LX_A06 = LX_A00 * 2;
        var LX_A07 = LX_A06 * (RA_X01.B / RA_X01.A);
        var LX_A08 = LX_A07 * (RA_A01.B / (RA_A01.D + RA_A01.B));
        var LX_A09 = LX_A08 * (RA_A01.C / RA_A01.D) / 2;

        var LX_B00 = LX_A06 * (RA_X01.C / RA_X01.A) / 2;
        var RA_X02 = finalizeRatioByPytha({
            A: null,
            B: 2 + (RA_A01.B / RA_A01.C),
            C: 1
        });
        var LX_B03 = LX_A05 * (RA_X02.C / RA_X02.A);

        var LX_C00 = LX_B00 * (RA_A01.C / RA_A01.D);
        var LX_C01 = LX_C00 * (RA_A00.A / RA_A00.B);
        var LX_C02 = LX_C01 * (RA_A01.C / RA_A01.D);
        var LX_C03 = LX_A07 + LX_C02;
        var LX_C04 = LX_C03 * (RA_A01.C / RA_A01.D);
        var LX_C05 = LX_C04 - (LX_A07 / 2);
        var LX_C06 = LX_A05 * 2 / 3;
        var LX_C07 = LX_C06 / 2;
        var LX_C08 = getLengthByPytha(null, LX_C05, LX_C07);

        var LX_D00 = getLengthByPytha(LX_A05, LX_A01, null);
        var LX_D01 = LX_A01 * 2;
        var LX_D02 = LX_D01 * (RA_A01.A / RA_A01.D) / 2;
        var LX_D03 = getLengthByPytha(null, LX_D00, LX_D02);

        var LX_F00 = LX_B00 - LX_C00;
        var LX_F01 = LX_F00 * (RA_A01.C / RA_A01.D);
        var LX_F02 = LX_C00 + LX_F01;
        var LX_F03 = getLengthByPytha(null, LX_C00, LX_F02);

        var LX_G00 = LX_A04 - LX_A05;
        var LX_G01 = getLengthByPytha(null, LX_D02, LX_G00);
        var LX_G02 = getLengthByPytha(null, LX_A02, LX_G01);
        var LX_G03 = getLengthByPytha(null, LX_A02, LX_D02);

        var LX_H00 = getLengthByPytha(null, LX_G03, LX_G00);

        var LX_I00 = LX_A07 * (RA_A01.A / RA_A01.D) / 2;
        var LX_I01 = getLengthByPytha(null, LX_B00, LX_I00);
        var LX_I02 = LX_G00 * (RA_A01.A / RA_A01.D);
        var LX_I03 = getLengthByPytha(null, LX_I00, LX_I02);
        var LX_I04 = getLengthByPytha(null, LX_B00, LX_I03);

        var LX_J00 = LX_C00 * (RA_A01.C / RA_A01.D);

        var LT_A00 = LX_A05;
        var LT_C00 = LX_C08;
        var LT_D00 = LX_D03;
        var LT_F00 = LX_F03;
        var LT_G00 = LX_G02;
        var LT_H00 = LX_H00;
        var LT_I00 = LX_I04;

        var TX_A00 = Math.asin(LX_A00 / LX_A05);
        var TX_A01 = Math.asin(LX_A00 / LX_A05) + pai;
        var TX_B00 = Math.asin(LX_B03 / LX_A05) * 2;
        var TX_C00 = Math.asin(LX_C05 / LX_C08) + pai;
        var TX_D00 = Math.asin(LX_A01 / LX_A05) - Math.asin(LX_D02 / LX_D03) + pai;
        var TX_E00 = Math.asin(LX_A01 / LX_A05) + Math.asin(LX_D02 / LX_D03);
        var TX_F00 = Math.asin(LX_C00 / LX_F03) - Math.asin(LX_C00 / LX_A05) + pai;
        var TX_G00 = Math.asin(LX_G03 / LX_G02) + pai;
        var TX_H00 = Math.asin(LX_G03 / LX_H00);
        var TX_I00 = Math.asin(LX_I01 / LX_I04) + pai;
        var TX_J00 = Math.asin(LX_C05 / LX_C08) + (Math.asin(LX_J00 / LX_C08) * 2) - pai;
        var TX_Z00 = 0;

        var TY_A00 = 0;
        var TY_A10 = Math.asin(LX_A09 / LX_A00) * 2;
        var TY_B00 = Math.asin(LX_B00 / LX_A00);
        var TY_C00 = TY_B00 + pai;
        var TY_D00 = TY_A00 + pai;
        var TY_G00 = Math.asin(LX_D02 / LX_G03) + pai;
        var TY_H00 = Math.asin(LX_A01 / LX_A00) - Math.asin(LX_D02 / LX_G03);
        var TY_I00 = Math.asin(LX_A09 / LX_A00) - Math.asin(LX_I00 / LX_I01);
        var TY_Z00 = 0;

        var reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            B0: {R: LT_A00, X: TX_B00, Y: TY_B00},
            C0: {R: LT_C00, X: TX_C00, Y: TY_C00},
            D0: {R: LT_D00, X: TX_D00, Y: TY_D00},
            E0: {R: LT_D00, X: TX_E00, Y: TY_D00},
            F0: {R: LT_F00, X: TX_F00, Y: TY_C00},
            G0: {R: LT_G00, X: TX_G00, Y: TY_G00},
            H0: {R: LT_H00, X: TX_H00, Y: TY_H00},
            I0: {R: LT_I00, X: TX_I00, Y: TY_I00},
            J0: {R: LT_C00, X: TX_J00, Y: TY_C00},
            Z0: {R: LT_A00, X: TX_Z00, Y: TY_Z00}
        };

        for (var i in reles_base) {
            for (var n = 0; n < 3; n ++) {
                this.reles[i + n + 'AO'] = {R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (pai * 2 / 3 * n)};
                this.reles[i + n + 'SO'] = {R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (pai * 2 / 3 * n)};
                this.reles[i + n + 'AR'] = {R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (pai * 2 / 3 * n)};
                this.reles[i + n + 'SR'] = {R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (pai * 2 / 3 * n)};

                this.reles[i + n + 'SO'].Y *= -1;
                this.reles[i + n + 'SR'].Y *= -1;
                this.reles[i + n + 'SO'].Y += TY_A10 + pai;
                this.reles[i + n + 'SR'].Y += TY_A10 + pai;
                this.reles[i + n + 'AR'].X += pai;
                this.reles[i + n + 'SR'].X += pai;
            }
        }

        this.surfaces = {
            A0_A: ['Z00AR', 'D00AO', 'C00AO', 'F00AO', 'D01AO'],
            A1_A: ['Z00AR', 'D01AO', 'C01AO', 'F01AO', 'D02AO'],
            A2_A: ['Z00AR', 'D02AO', 'C02AO', 'F02AO', 'D00AO'],
            A0_S: ['Z00SO', 'D00SR', 'C00SR', 'F00SR', 'D01SR'],
            A1_S: ['Z00SO', 'D01SR', 'C01SR', 'F01SR', 'D02SR'],
            A2_S: ['Z00SO', 'D02SR', 'C02SR', 'F02SR', 'D00SR'],
            B0_A: ['A00AO', 'H00AO', 'G00SR', 'C00SR', 'G01AR'],
            B1_A: ['A01AO', 'H01AO', 'G02SR', 'C02SR', 'G02AR'],
            B2_A: ['A02AO', 'H02AO', 'G01SR', 'C01SR', 'G00AR'],
            B0_S: ['A00SR', 'H00SR', 'G00AO', 'C00AO', 'G01SO'],
            B1_S: ['A01SR', 'H01SR', 'G02AO', 'C02AO', 'G02SO'],
            B2_S: ['A02SR', 'H02SR', 'G01AO', 'C01AO', 'G00SO'],
            C0_A: ['B00AO', 'G00SR', 'C00SR', 'D00SR', 'F02SR'],
            C1_A: ['B01AO', 'G02SR', 'C02SR', 'D02SR', 'F01SR'],
            C2_A: ['B02AO', 'G01SR', 'C01SR', 'D01SR', 'F00SR'],
            C0_S: ['B00SR', 'G00AO', 'C00AO', 'D00AO', 'F02AO'],
            C1_S: ['B01SR', 'G02AO', 'C02AO', 'D02AO', 'F01AO'],
            C2_S: ['B02SR', 'G01AO', 'C01AO', 'D01AO', 'F00AO'],
            D0_A: ['B00AO', 'E02AO', 'D02AR', 'C02AR', 'F02AR'],
            D1_A: ['B01AO', 'E00AO', 'D00AR', 'C00AR', 'F00AR'],
            D2_A: ['B02AO', 'E01AO', 'D01AR', 'C01AR', 'F01AR'],
            D0_S: ['B00SR', 'E02SR', 'D02SO', 'C02SO', 'F02SO'],
            D1_S: ['B01SR', 'E00SR', 'D00SO', 'C00SO', 'F00SO'],
            D2_S: ['B02SR', 'E01SR', 'D01SO', 'C01SO', 'F01SO'],
            E0_A: ['A00AO', 'G01AR', 'I00AR', 'J00SR', 'E00AR'],
            E1_A: ['A01AO', 'G02AR', 'I01AR', 'J02SR', 'E01AR'],
            E2_A: ['A02AO', 'G00AR', 'I02AR', 'J01SR', 'E02AR'],
            E0_S: ['A00SR', 'G01SO', 'I00SO', 'J00AO', 'E00SO'],
            E1_S: ['A01SR', 'G02SO', 'I01SO', 'J02AO', 'E01SO'],
            E2_S: ['A02SR', 'G00SO', 'I02SO', 'J01AO', 'E02SO'],
            E0_A: ['A00AR', 'I00SR', 'J00AR', 'E00SR', 'D00SO'],
            E1_A: ['A01AR', 'I02SR', 'J01AR', 'E02SR', 'D02SO'],
            E2_A: ['A02AR', 'I01SR', 'J02AR', 'E01SR', 'D01SO'],
            E0_S: ['A00SO', 'I00AO', 'J00SO', 'E00AO', 'D00AR'],
            E1_S: ['A01SO', 'I02AO', 'J01SO', 'E02AO', 'D02AR'],
            E2_S: ['A02SO', 'I01AO', 'J02SO', 'E01AO', 'D01AR'],
            F0_A: ['A00SO', 'I02AR', 'G00AR', 'C00AR', 'D00AR'],
            F1_A: ['A01SO', 'I01AR', 'G02AR', 'C02AR', 'D02AR'],
            F2_A: ['A02SO', 'I00AR', 'G01AR', 'C01AR', 'D01AR'],
            F0_S: ['A00AR', 'I02SO', 'G00SO', 'C00SO', 'D00SO'],
            F1_S: ['A01AR', 'I01SO', 'G02SO', 'C02SO', 'D02SO'],
            F2_S: ['A02AR', 'I00SO', 'G01SO', 'C01SO', 'D01SO'],
            G0_A: ['A00AO', 'G01AR', 'I00AR', 'J01AR', 'E00AR'],
            G1_A: ['A01AO', 'G02AR', 'I01AR', 'J02AR', 'E01AR'],
            G2_A: ['A02AO', 'G00AR', 'I02AR', 'J00AR', 'E02AR'],
            G0_S: ['A00SR', 'G01SO', 'I00SO', 'J01SO', 'E00SO'],
            G1_S: ['A01SR', 'G02SO', 'I01SO', 'J02SO', 'E01SO'],
            G2_S: ['A02SR', 'G00SO', 'I02SO', 'J00SO', 'E02SO'],
            H0_A: ['A00AO', 'H00AO', 'J00AO', 'E00SO', 'E00AR'],
            H1_A: ['A01AO', 'H01AO', 'J01AO', 'E02SO', 'E01AR'],
            H2_A: ['A02AO', 'H02AO', 'J02AO', 'E01SO', 'E02AR'],
            H0_S: ['A00SR', 'H00SR', 'J00SR', 'E00AR', 'E00SO'],
            H1_S: ['A01SR', 'H01SR', 'J01SR', 'E02AR', 'E01SO'],
            H2_S: ['A02SR', 'H02SR', 'J02SR', 'E01AR', 'E02SO'],
            I0_A: ['A00AR', 'I02SO', 'J00SO', 'I00AO', 'I00SR'],
            I1_A: ['A02AR', 'I00SO', 'J01SO', 'I02AO', 'I01SR'],
            I2_A: ['A01AR', 'I01SO', 'J02SO', 'I01AO', 'I02SR'],
            I0_S: ['A00SO', 'I02AR', 'J00AR', 'I00SR', 'I00AO'],
            I1_S: ['A02SO', 'I00AR', 'J01AR', 'I02SR', 'I01AO'],
            I2_S: ['A01SO', 'I01AR', 'J02AR', 'I01SR', 'I02AO'],
            J0_A: ['B02AO', 'E01AO', 'J02SO', 'H02SO', 'G01SR'],
            J1_A: ['B00AO', 'E02AO', 'J01SO', 'H01SO', 'G00SR'],
            J2_A: ['B01AO', 'E00AO', 'J00SO', 'H00SO', 'G02SR'],
            J0_S: ['B02SR', 'E01SR', 'J02AR', 'H02AR', 'G01AO'],
            J1_S: ['B00SR', 'E02SR', 'J01AR', 'H01AR', 'G00AO'],
            J2_S: ['B01SR', 'E00SR', 'J00AR', 'H00AR', 'G02AO']
        };
    }
};
