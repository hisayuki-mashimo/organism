/**
 * 正六面体
 */
class Hexahedron {
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

        const TX_A00 = Math.asin(LX_A00 / LX_A03);

        const TY_A00 = 0;

        const reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00}
        };

        for (let i in reles_base) {
            const base_R = reles_base[i].R;
            const base_X = reles_base[i].X;
            const base_Y = reles_base[i].Y;

            for (let n = 0; n < 4; n ++) {
                this.reles[i + n + 'AO'] = {R: base_R};
                this.reles[i + n + 'SR'] = {R: base_R};

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((Math.PI / 2) * n);
                this.reles[i + n + 'SR'].X = base_X + Math.PI;
                this.reles[i + n + 'SR'].Y = (base_Y + ((Math.PI / 2) * n)) * -1;
            }
        }

        this.surfaces = {
            A0_A: ['A00AO', 'A01AO', 'A02AO', 'A03AO'],
            A0_R: ['A00SR', 'A01SR', 'A02SR', 'A03SR'],
            B0_A: ['A00AO', 'A01AO', 'A01SR', 'A02SR'],
            B1_A: ['A02AO', 'A03AO', 'A03SR', 'A00SR'],
            B0_B: ['A00SR', 'A01SR', 'A01AO', 'A02AO'],
            B1_B: ['A02SR', 'A03SR', 'A03AO', 'A00AO']
        };
    }
}
