/**
 * 星型八面体
 *
 */
class Stella_Octangula {
    configure = () => {
        const { getLengthByPytha } = this.basis.geometry_calculator;

        const pai = Math.PI;

        // 正三角形比率
        const RA_A00 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2
        };

        const LX_A00 = 1;
        const LX_A01 = LX_A00 * (RA_A00.A / RA_A00.C);
        const LX_A02 = LX_A00 * (RA_A00.B / RA_A00.C);
        const LX_A03 = getLengthByPytha(LX_A02, LX_A01, null);
        const LX_A04 = LX_A03 / 2;
        const LX_A05 = LX_A04 * 3;

        const LX_B00 = getLengthByPytha(null, LX_A01, LX_A04);

        const LT_A00 = this.alpha;
        const LT_B00 = this.alpha * LX_B00 / LX_A05;

        const TX_A00 = Math.asin(LX_A00 / LX_A05);
        const TX_B00 = Math.asin(LX_A01 / LX_B00);
        const TX_Z00 = 0;

        const TY_A00 = 0;
        const TY_B00 = pai;
        const TY_Z00 = 0;

        const reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            B0: {R: LT_B00, X: TX_B00, Y: TY_B00},
            Z0: {R: LT_A00, X: TX_Z00, Y: TY_Z00}
        };

        for (let i in reles_base) {
            for (let n = 0; n < 3; n ++) {
                this.reles[i + n + 'AO'] = {R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (pai * 2 / 3 * n)};
                this.reles[i + n + 'SO'] = {R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (pai * 2 / 3 * n)};
                this.reles[i + n + 'AR'] = {R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (pai * 2 / 3 * n)};
                this.reles[i + n + 'SR'] = {R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (pai * 2 / 3 * n)};

                this.reles[i + n + 'SO'].Y *= -1;
                this.reles[i + n + 'SR'].Y *= -1;
                this.reles[i + n + 'SO'].Y += TY_A00 + pai;
                this.reles[i + n + 'SR'].Y += TY_A00 + pai;
                this.reles[i + n + 'AR'].X += pai;
                this.reles[i + n + 'SR'].X += pai;
            }
        }

        this.surfaces = {
            A0_A: ['Z00AO', 'B00AO', 'B01AO'],
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
            D2_S: ['A02AR', 'B01AR', 'B02AO']
        };
    }
}
