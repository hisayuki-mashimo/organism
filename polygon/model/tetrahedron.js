/**
 * 正四面体
 *
 */
class Tetrahedron {
    configure = () => {
        // 正三角形比率
        const RA_A00 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2,
        };

        const LX_A00 = 1;
        const LX_A02 = LX_A00 * (RA_A00.A / RA_A00.C);
        const LX_A03 = LX_A00 + LX_A02;
        const LX_A04 = this.basis.geometry_calculator.getLengthByPytha(LX_A03, LX_A02, null); // Oからの△ABCへの垂線
        const RA_X00 = {
            A: LX_A04,
            B: LX_A03,
        };
        const LX_A05 = LX_A00 * (RA_X00.B / RA_X00.A);

        const LT_A00 = this.alpha;

        const TX_A00 = Math.asin(LX_A00 / LX_A05);
        const TX_Z00 = Math.PI;

        const TY_A00 = Math.PI * 2 / 3 * 0;
        const TY_A01 = Math.PI * 2 / 3 * 1;
        const TY_A02 = Math.PI * 2 / 3 * 2;
        const TY_Z00 = 0;

        this.reles = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            A1: {R: LT_A00, X: TX_A00, Y: TY_A01},
            A2: {R: LT_A00, X: TX_A00, Y: TY_A02},
            Z0: {R: LT_A00, X: TX_Z00, Y: TY_Z00}
        };

        this.surfaces = {
            A0_A: ['A0', 'A1', 'A0'],
            B0_A: ['A0', 'A1', 'Z0'],
            B1_A: ['A1', 'A2', 'Z0'],
            B2_A: ['A2', 'A0', 'Z0']
        };
    }
}
