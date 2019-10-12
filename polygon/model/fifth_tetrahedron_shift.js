/**
 * 5つの正四面体
 *
 */
class Fifth_Tetrahedron_Shift {
    configure = () => {
        // 正三角形比率
        const RA_A00 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2
        };

        // 五芒星比率
        const RA_A01 = {
            A: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2)) - 2,
            B: 1,
            C: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2)) - 1,
            D: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2))
        };

        const LX_A00 = 1;
        const RA_X00 = this.basis.geometry_calculator.finalizeRatioByPytha({
            A: null,
            B: (RA_A01.D / RA_A01.B) + 1,
            C: (RA_A00.B / RA_A00.A) * (RA_A01.D / RA_A01.C)
        });
        const LX_A01 = LX_A00 * 2;
        const LX_A02 = LX_A01 * (RA_X00.C / RA_X00.A) / 2;
        const LX_A03 = LX_A02 * (RA_A01.C / RA_A01.D);
        const LX_A04 = LX_A03 * 2;
        const LX_A05 = this.basis.geometry_calculator.getLengthByPytha(LX_A04, LX_A02, null);
        const LX_A06 = LX_A05 * 2;
        const LX_A07 = LX_A06 * (RA_A01.C / (RA_A01.A + RA_A01.C));
        const LX_A08 = LX_A02 * (RA_A01.D / RA_A01.C);
        const LX_A09 = this.basis.geometry_calculator.getLengthByPytha(null, LX_A03, LX_A08);

        const LX_C00 = this.basis.geometry_calculator.getLengthByPytha(LX_A09, LX_A07, null);
        const LX_C01 = LX_C00 * 2;
        const LX_C02 = LX_C01 * (RA_A01.B / RA_A01.D);
        const LX_C03 = LX_C02 * (RA_A01.B / RA_A01.C);
        const LX_C04 = LX_C00 - LX_C03;

        const LX_D00 = LX_C02 * (RA_A01.B / RA_A01.D);
        const RA_X01 = {
            A: LX_D00,
            B: LX_C01 - LX_D00,
            C: LX_C01
        };
        const LX_D01 = LX_C01 * (RA_X01.B / RA_X01.C);
        const LX_D02 = LX_D01 - LX_C00;
        const LX_D03 = this.basis.geometry_calculator.getLengthByPytha(LX_A07, LX_A03, null);
        const LX_D04 = LX_A07 - LX_A05;
        const LX_D05 = LX_D03 - LX_D04;
        const LX_D06 = LX_D05 * (RA_X01.A / RA_X01.C);
        const LX_D07 = LX_D04 + LX_D06;
        const LX_D08 = this.basis.geometry_calculator.getLengthByPytha(null, LX_D02, LX_D07);

        const LX_E00 = LX_A02 * (RA_A01.D / RA_A01.C);
        const LX_E01 = LX_E00 * (RA_A01.B / RA_A01.D);
        const LX_E02 = LX_A07 / 2;
        const LX_E03 = LX_A07 + LX_E02;
        const LX_E04 = LX_E03 * (RA_A01.C / RA_A01.D);
        const LX_E05 = LX_E04 - LX_E02;
        const LX_E06 = this.basis.geometry_calculator.getLengthByPytha(null, LX_E01, LX_E05);

        const LX_G00 = LX_A03 * (RA_A01.B / RA_A01.D);
        const LX_G01 = LX_A07 - LX_D03;
        const LX_G02 = LX_G01 * (RA_A01.C / RA_A01.D);
        const LX_G03 = LX_D03 + LX_G02;
        const LX_G04 = LX_C00 * 2;
        const LX_G05 = LX_G04 * (RA_A01.C / RA_A01.D);
        const LX_G06 = LX_G05 - LX_C00;

        const LX_H00 = LX_C01 * (RA_A01.A / RA_A01.D);
        const LX_H01 = LX_H00 * (RA_A01.C / RA_A01.D);
        const LX_H02 = LX_H00 / 2;
        const LX_H03 = LX_H01 - LX_H02;
        const LX_H04 = this.basis.geometry_calculator.getLengthByPytha(null, LX_A07, LX_H03);

        const LT_A00 = this.alpha;
        const LT_C00 = this.alpha * LX_C04 / LX_A09;
        const LT_D00 = this.alpha * LX_D08 / LX_A09;
        const LT_H00 = this.alpha * LX_H04 / LX_A09;

        const TX_A00 = Math.asin(LX_A07 / LX_A09);
        const TX_B00 = Math.asin(LX_A07 / LX_A09) + (Math.asin(LX_A03 / LX_A09) * 2);
        const TX_C00 = 0;
        const TX_D00 = Math.asin(LX_D07 / LX_D08);
        const TX_E00 = Math.asin(LX_E06 / LX_D08);
        const TX_F00 = Math.atan(LX_D03 / LX_C00) * -2 + Math.PI;
        const TX_G00 = Math.acos(LX_G06 / LX_D08);
        const TX_H00 = Math.asin(LX_H03 / LX_H04) + (Math.PI / 2);

        const TY_A00 = 0;
        const TY_E00 = Math.asin(LX_E01 / LX_E06);
        const TY_G00 = Math.asin(LX_A02 / LX_A07) - Math.atan(LX_G00 / LX_G03)

        const reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            B0: {R: LT_A00, X: TX_B00, Y: TY_A00},
            C0: {R: LT_C00, X: TX_C00, Y: TY_A00},
            D0: {R: LT_D00, X: TX_D00, Y: TY_A00},
            E0: {R: LT_D00, X: TX_E00, Y: TY_E00},
            F0: {R: LT_C00, X: TX_F00, Y: TY_A00},
            G0: {R: LT_D00, X: TX_G00, Y: TY_G00},
            H0: {R: LT_H00, X: TX_H00, Y: TY_A00}
        };

        for (let i in reles_base) {
            const base_R = reles_base[i].R;
            const base_X = reles_base[i].X;
            const base_Y = reles_base[i].Y;

            for (let n = 0; n < 5; n ++) {
                this.reles[i + n + 'AO'] = {R: base_R};
                this.reles[i + n + 'AR'] = {R: base_R};
                this.reles[i + n + 'SO'] = {R: base_R};
                this.reles[i + n + 'SR'] = {R: base_R};

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((Math.PI * 2 / 5) * n);
                this.reles[i + n + 'AR'].X = base_X + Math.PI;
                this.reles[i + n + 'AR'].Y = base_Y + ((Math.PI * 2 / 5) * n);
                this.reles[i + n + 'SO'].X = base_X;
                this.reles[i + n + 'SO'].Y = (base_Y + ((Math.PI * 2 / 5) * n)) * -1;
                this.reles[i + n + 'SR'].X = base_X + Math.PI;
                this.reles[i + n + 'SR'].Y = (base_Y + ((Math.PI * 2 / 5) * n)) * -1;
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
}
