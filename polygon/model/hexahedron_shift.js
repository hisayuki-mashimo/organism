/**
 * 正六面体
 */
class Hexahedron_Shift {
    configure = () => {
        // 直角二等辺三角形比率
        const RA_A00 = {
            A: 1,
            B: Math.pow(2, 1 / 2)
        };

        const LX_A00 = 1;
        const LX_A01 = LX_A00 * (RA_A00.B / RA_A00.A);
        const LX_A02 = LX_A01 / 2;
        const LX_A03 = this.basis.geometry_calculator.getLengthByPytha(null, LX_A00, LX_A02);

        const LT_A00 = this.alpha;

        const TX_A00 = Math.acos(LX_A00 / LX_A03) * 2;
        const TX_Z00 = 0;

        const TY_A00 = 0;

        const reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            Z0: {R: LT_A00, X: TX_Z00, Y: TX_Z00}
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
            A0_A: ['Z00AO', 'A00AO', 'A01SR', 'A01AO'],
            A1_A: ['Z00AO', 'A01AO', 'A00SR', 'A02AO'],
            A2_A: ['Z00AO', 'A02AO', 'A02SR', 'A00AO'],
            A0_R: ['Z00SR', 'A00SR', 'A01AO', 'A01SR'],
            A1_R: ['Z00SR', 'A01SR', 'A00AO', 'A02SR'],
            A2_R: ['Z00SR', 'A02SR', 'A02AO', 'A00SR']
        };
    }
}
