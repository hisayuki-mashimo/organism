/**
 * 正十二面体
 *
 */
class Dodecahedron {
    configure = () => {
        // 五芒星比率
        const RA_A01 = {
            A: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2)) - 2,
            B: 1,
            C: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2)) - 1,
            D: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2))
        };

        const LX_A00 = 1;
        const LX_A01 = LX_A00 * (RA_A01.A / RA_A01.C);
        const LX_A02 = LX_A00 + LX_A01;
        const LX_A03 = LX_A02 / 2;
        const LX_A04 = LX_A03 * (RA_A01.B / RA_A01.C);
        const LX_A05 = LX_A01 + LX_A04;
        const LX_A06 = this.basis.geometry_calculator.getLengthByPytha(LX_A00, LX_A05, null);
        const LX_A07 = LX_A06 * (RA_A01.C / RA_A01.B);
        const LX_A08 = LX_A07 * (RA_A01.D / RA_A01.C);
        const LX_A09 = this.basis.geometry_calculator.getLengthByPytha(LX_A08, LX_A05, null);
        const LX_A10 = this.basis.geometry_calculator.getLengthByPytha(null, LX_A00, LX_A09);

        const LT_A00 = this.alpha;

        const TX_A00 = Math.asin(LX_A00 / LX_A10);
        const TX_B00 = Math.asin(LX_A00 / LX_A10) + (Math.asin(LX_A06 / LX_A10) * 2);

        const TY_A00 = 0;

        const reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            B0: {R: LT_A00, X: TX_B00, Y: TY_A00}
        };

        for (let i in reles_base) {
            const base_R = reles_base[i].R;
            const base_X = reles_base[i].X;
            const base_Y = reles_base[i].Y;

            for (let n = 0; n < 5; n ++) {
                this.reles[i + n + 'AO'] = {R: base_R};
                this.reles[i + n + 'SR'] = {R: base_R};

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((Math.PI * 2 / 5) * n);
                this.reles[i + n + 'SR'].X = base_X + Math.PI;
                this.reles[i + n + 'SR'].Y = (base_Y + ((Math.PI * 2 / 5) * n)) * -1;
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
}
