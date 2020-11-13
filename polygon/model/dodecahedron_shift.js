/**
 * 正十二面体
 */
class Dodecahedron_Shift {
    configure = () => {
        const { getLengthByPytha } = this.basis.geometry_calculator;

        // 正三角形比率
        const RA00 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2,
        };

        // 五芒星比率
        const RA01 = {
            A: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2)) - 2,
            B: 1,
            C: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2)) - 1,
            D: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2))
        };

        // 正五角形ABCDE
        // 正五角形AEFGH
        // 正五角形AHIJB
        // AF・BEの交点G
        // 五角形ABCDEの重心K
        // AK・CDの交点L
        // 直線AK・CDの交点M
        // AC・BEの交点N
        // AD・BEの交点P
        // BD・CEの交点Q
        const AK = 1;
        const CK = AK;
        const DK = AK;
        // (01) △CDK ∽ △PNK
        // (02) 四角形BPDCは平行四辺形
        // (03) (02)より BP = CD
        // (04) (03)より NP = CD * 五芒星比率A / C
        const KQ = DK * (RA01.A / RA01.C);
        const AQ = AK + KQ;
        // (05) AB = BQ
        // (06) (02)(05)より 四角形BPDCは菱形
        const AL = AQ / 2;
        const AM = AL * (RA01.D / RA01.B);
        const KM = AM - AK;
        const CM = getLengthByPytha(CK, KM, null);
        const BL = CM * (RA01.D / RA01.C);
        // △BEHの重心R
        // (07) △BEHは正三角形
        // (08) (07)より BM = BL * 正三角形比率C / B
        const BR = BL * (RA00.C / RA00.B);
        const AB = CM * 2;
        const AR = getLengthByPytha(AB, BR, null);
        // △CFJの重心S
        const LR = BL * (RA00.A / RA00.B);
        const MS = LR * (RA01.D / RA01.B);
        const AS = getLengthByPytha(AM, MS, null);
        const CS = getLengthByPytha(null, MS, CM);
        // (09) 面BEH // 面CFGJ // 面cfgj
        // (10) (09)より Ss = RS * 五芒星比率C / B
        const RS = AS - AR;
        const Ss = RS * (RA01.C / RA01.B);
        const OS = Ss / 2;
        const OA = AS + OS;

        const LT_A00 = this.alpha;

        const TX_O00 = 0;
        const TX_A00 = Math.asin(BR / OA);
        const TX_B00 = Math.asin(CS / OA);

        const TY_A00 = 0;
        const TY_B00 = Math.asin(BL / CS);
        const TY_B10 = Math.asin(BL / CS) * -1;

        const reles_base = {
            O0: {R: LT_A00, X: TX_O00, Y: TY_A00},
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            B0: {R: LT_A00, X: TX_B00, Y: TY_B00},
            B1: {R: LT_A00, X: TX_B00, Y: TY_B10},
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
                this.reles[i + n + 'SR'].Y = base_Y + ((Math.PI * 2 / 3) * n);
            }
        }

        this.surfaces = {
            A0_A: ['O00AO', 'A00AO', 'B00AO', 'B11AO', 'A01AO'],
            A1_A: ['O00AO', 'A01AO', 'B01AO', 'B12AO', 'A02AO'],
            A2_A: ['O00AO', 'A02AO', 'B02AO', 'B10AO', 'A00AO'],
            A0_R: ['O00SR', 'A00SR', 'B00SR', 'B11SR', 'A01SR'],
            A1_R: ['O00SR', 'A01SR', 'B01SR', 'B12SR', 'A02SR'],
            A2_R: ['O00SR', 'A02SR', 'B02SR', 'B10SR', 'A00SR'],

            B0_A: ['A00AO', 'B00AO', 'B12SR', 'B01SR', 'B10AO'],
            B1_A: ['A01AO', 'B01AO', 'B10SR', 'B02SR', 'B11AO'],
            B2_A: ['A02AO', 'B02AO', 'B11SR', 'B00SR', 'B12AO'],
            B0_R: ['A00SR', 'B00SR', 'B12AO', 'B01AO', 'B10SR'],
            B1_R: ['A01SR', 'B01SR', 'B10AO', 'B02AO', 'B11SR'],
            B2_R: ['A02SR', 'B02SR', 'B11AO', 'B00AO', 'B12SR'],
        };
    }
}
