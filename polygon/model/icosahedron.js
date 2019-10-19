/**
 * 正二十面体
 *
 */
class Icosahedron {
    configure = () => {
        const RA_A00 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2
        };

        const RA_A01 = {
            A: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2)) - 2,
            B: 1,
            C: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2)) - 1,
            D: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2))
        };

        const LX_A00 = 1;
        const LX_A02 = LX_A00 * (RA_A00.A / RA_A00.C);
        const LX_A03 = LX_A02 * (RA_A01.D / RA_A01.B);
        const LX_A04 = this.basis.geometry_calculator.getLengthByPytha(LX_A03, LX_A02, null);
        const LX_A05 = this.basis.geometry_calculator.getLengthByPytha(null, LX_A00, LX_A04);

        const LX_B00 = LX_A04 * 2;
        const LX_B01 = LX_B00 * (RA_A01.C / RA_A01.D);
        const LX_B02 = LX_B01 - LX_A04;

        const LT_A00 = this.alpha;

        const TX_A00 = Math.asin(LX_A00 / LX_A05);
        const TX_B00 = Math.PI - Math.acos(LX_B02 / LX_A05);

        const TY_A00 = 0;

        const reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            B0: {R: LT_A00, X: TX_B00, Y: TY_A00}
        };

        for (let i in reles_base) {
            const base_R = reles_base[i].R;
            const base_X = reles_base[i].X;
            const base_Y = reles_base[i].Y;

            for (let n = 0; n < 3; n ++) {
                this.reles[i + n + 'AO'] = {R: base_R};
                this.reles[i + n + 'SR'] = {R: base_R};

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((Math.PI * 2 / 3) * n);
                this.reles[i + n + 'SR'].X = base_X + Math.PI;
                this.reles[i + n + 'SR'].Y = (base_Y + ((Math.PI * 2 / 3) * n)) * -1;
            }
        }

        this.surfaces = {
            A0_A: ['A00AO', 'A01AO', 'A02AO'],
            A0_R: ['A00SR', 'A01SR', 'A02SR'],
            B0_A: ['B00AO', 'A01SR', 'A02SR'],
            B1_A: ['B01AO', 'A00SR', 'A01SR'],
            B2_A: ['B02AO', 'A02SR', 'A00SR'],
            B0_R: ['B00SR', 'A01AO', 'A02AO'],
            B1_R: ['B01SR', 'A00AO', 'A01AO'],
            B2_R: ['B02SR', 'A02AO', 'A00AO'],
            C0_A: ['A00AO', 'B00AO', 'B02SR'],
            C1_A: ['A01AO', 'B01AO', 'B01SR'],
            C2_A: ['A02AO', 'B02AO', 'B00SR'],
            C3_A: ['A00AO', 'B00AO', 'B01SR'],
            C4_A: ['A01AO', 'B01AO', 'B00SR'],
            C5_A: ['A02AO', 'B02AO', 'B02SR'],
            C0_R: ['A00SR', 'B00SR', 'B02AO'],
            C1_R: ['A01SR', 'B01SR', 'B01AO'],
            C2_R: ['A02SR', 'B02SR', 'B00AO'],
            C3_R: ['A00SR', 'B00SR', 'B01AO'],
            C4_R: ['A01SR', 'B01SR', 'B00AO'],
            C5_R: ['A02SR', 'B02SR', 'B02AO']
        };
    }
}
