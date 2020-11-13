/**
 * 5つの正四面体
 *
 */
class Fifth_Tetrahedron {
    configure = () => {
        const {
            getLengthByPytha,
            finalizeRatioByPytha,
        } = this.basis.geometry_calculator;

        // 正三角形比率
        const RA00 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2
        };

        // 五芒星比率
        const coefficient = 4 * Math.pow(Math.cos(Math.PI  / 5), 2);
        const RA01 = {
            A: coefficient - 2,
            B: 1,
            C: coefficient - 1,
            D: coefficient,
        };

        // 中心点O
        // 正四面体ABCD・鏡面abcd・重心O
        // 正五角形dEAHF
        // 正五角形dFBIG
        // 正五角形dGCJE
        // AHの中点K
        // EF・dKの交点L
        // 面ABC・Ddの交点M
        // 面EFG・Ddの交点N
        const _EN = 1;
        // (01) △EFGは正三角形
        // (02) (01)より LN = EN * 正三角形比率A / C
        const _LN = _EN * (RA00.A / RA00.C);
        // (03) dK = dL * 五芒星比率D / C
        // (04) (03)より MK = LN * 五芒星比率D / B
        const _MK = _LN * (RA01.D / RA01.B);
        // (05) (01)より EL = EN * 正三角形比率B / C
        const _EL = _EN * (RA00.B / RA00.C);
        // (06) AK = EL * 五芒星比率C / D;
        const _AK = _EL * (RA01.C / RA01.D);
        const _AM = getLengthByPytha(null, _MK, _AK);
        console.log(`_LN:${_LN}\n_MK:${_MK}\n_EL:${_EL}`);
        // (07) AH = dE
        const _dN = getLengthByPytha((_AK * 2), _EN, null);

        const AM = 1;
        // BCの中点P
        // ADの中点Q
        // (07) AM = BM
        // (08) MP = BM * 正三角形比率A / C
        const MP = AM * (RA00.A / RA00.C);
        // (09) AP = DP
        const DM = getLengthByPytha((AM + MP), MP, null);
        // (10) BP = BM * 正三角形比率B / C
        const BP = AM * (RA00.B / RA00.C);
        // (11) ADM ∽ DOQ
        // (12) (11)より OD = AD * (DQ / DM)
        // (13) BP = DQ
        // (14) (11)(12)(13)より OD = (BP * 2) * (BP / DM)
        const OD = (BP * 2) * (BP / DM);
        // (15) OA = OD = OE

        const EN = _EN * AM / _AM;
        const dN = _dN * AM / _AM;
        const ON = OD - dN;
        const OE = getLengthByPytha(null, EN, ON);
        console.log(`OE:${OE}\nOD:${OD}`);
        const EL = _EL * AM / _AM;

        // 面ABC・EQの交点R
        // (16) 面EFG // 面ABC // 面hij
        // (17) 五角形BFHGjは正五角形
        // (18) (16)(17)より ER = EQ * 五芒星比率B / D
        // (19) 面ABICは平面
        // (20) 面AcIEは平面
        // ((19)(20)より) AI・cEの交点T
        // (21) 面EFG // 面ABH
        // BH・Fcの交点U
        // (21) 五角形BFHcjは正五角形
        // (21)(22)より ET : TQ = 五芒星比率B : C

        const LT_A00 = this.alpha;
        // console.log(`OD:${OD}\nBP:${BP}\nDM:${DM}`);

        const TX_O00 = 0;
        const TX_A00 = Math.asin(AM / OD);
        const TX_B00 = Math.asin(EN / OD);

        const TY_A00 = 0;
        const TY_A10 = Math.acos(_MK / _AM) * 2;
        console.log(`_MK:${_MK}\n_AM:${_AM}`);
        // AJの中点S
        // (15) AS = EL
        const TY_B00 = Math.asin(EL / AM) * -1;

        const reles_base = {
            O0: { R: LT_A00, X: TX_O00, Y: TY_A00 },
            A0: { R: LT_A00, X: TX_A00, Y: TY_A00 },
            A1: { R: LT_A00, X: TX_A00, Y: TY_A10 },
            B0: { R: LT_A00, X: TX_B00, Y: TY_B00 },
        };

        for (let i in reles_base) {
            for (let n = 0; n < 3; n ++) {
                this.reles[i + n + 'AO'] = { R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (Math.PI * 2 / 3 * n) };
                this.reles[i + n + 'SR'] = { R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (Math.PI * 2 / 3 * n) };
                this.reles[i + n + 'SR'].X += Math.PI;
            }
        }

        this.surfaces = {
            A00_A: ['O00AO', 'B00AO', 'A00AO', 'A10AO', 'B01AO'],
            A01_A: ['O00AO', 'B01AO', 'A01AO', 'A11AO', 'B02AO'],
            A02_A: ['O00AO', 'B02AO', 'A02AO', 'A12AO', 'B00AO'],
            A00_R: ['O00SR', 'B00SR', 'A00SR', 'A10SR', 'B01SR'],
            A01_R: ['O00SR', 'B01SR', 'A01SR', 'A11SR', 'B02SR'],
            A02_R: ['O00SR', 'B02SR', 'A02SR', 'A12SR', 'B00SR'],

            B00_A: ['A00AO', 'B00AO', 'A12AO', 'A01SR', 'A11SR'],
            B01_A: ['A01AO', 'B01AO', 'A10AO', 'A02SR', 'A12SR'],
            B02_A: ['A02AO', 'B02AO', 'A11AO', 'A00SR', 'A10SR'],
            B00_R: ['A00SR', 'B00SR', 'A12SR', 'A01AO', 'A11AO'],
            B01_R: ['A01SR', 'B01SR', 'A10SR', 'A02AO', 'A12AO'],
            B02_R: ['A02SR', 'B02SR', 'A11SR', 'A00AO', 'A10AO'],
        };

        // // 中心点O
        // // 正四面体ABCD・重心E
        // // △ABCの重心E
        // // △BCDの重心F
        // // 直線AE・BCの中点G
        // const AE = 1;
        // const BG = AE * (RA00.B / RA00.C);
        // const EG = AE * (RA00.A / RA00.C);
        // const AG = AE + EG;
        // // AG = DF
        // // ∠DEA = 90°
        // const DE = getLengthByPytha(AG, EG, null);
        // // △AEO ∽ △DEG
        // const OA = AE * (AG / DE);
        // const RA_X01 = finalizeRatioByPytha({
        //     A: null,
        //     B: (RA01.D / RA01.B) + 1,
        //     C: (RA00.B / RA00.A) * (RA01.D / RA01.C)
        // });
        // const LX_A06 = AE * 2;
        // const LX_A07 = LX_A06 * (RA_X01.B / RA_X01.A);
        // const LX_A08 = LX_A07 * (RA01.B / (RA01.D + RA01.B));
        // const LX_A09 = LX_A08 * (RA01.C / RA01.D) / 2;

        // const LX_B00 = LX_A06 * (RA_X01.C / RA_X01.A) / 2;
        // const RA_X02 = finalizeRatioByPytha({
        //     A: null,
        //     B: 2 + (RA01.B / RA01.C),
        //     C: 1
        // });
        // const LX_B03 = OA * (RA_X02.C / RA_X02.A);

        // const LX_C00 = LX_B00 * (RA01.C / RA01.D);
        // const LX_C01 = LX_C00 * (RA00.A / RA00.B);
        // const LX_C02 = LX_C01 * (RA01.C / RA01.D);
        // const LX_C03 = LX_A07 + LX_C02;
        // const LX_C04 = LX_C03 * (RA01.C / RA01.D);
        // const LX_C05 = LX_C04 - (LX_A07 / 2);
        // const LX_C06 = OA * 2 / 3;
        // const LX_C07 = LX_C06 / 2;
        // const LX_C08 = getLengthByPytha(null, LX_C05, LX_C07);

        // const LX_D00 = getLengthByPytha(OA, BG, null);
        // const LX_D01 = BG * 2;
        // const LX_D02 = LX_D01 * (RA01.A / RA01.D) / 2;
        // const LX_D03 = getLengthByPytha(null, LX_D00, LX_D02);

        // const LX_F00 = LX_B00 - LX_C00;
        // const LX_F01 = LX_F00 * (RA01.C / RA01.D);
        // const LX_F02 = LX_C00 + LX_F01;
        // const LX_F03 = getLengthByPytha(null, LX_C00, LX_F02);

        // const LX_G00 = DE - OA;
        // const LX_G01 = getLengthByPytha(null, LX_D02, LX_G00);
        // const LX_G02 = getLengthByPytha(null, EG, LX_G01);
        // const LX_G03 = getLengthByPytha(null, EG, LX_D02);

        // const LX_H00 = getLengthByPytha(null, LX_G03, LX_G00);

        // const LX_I00 = LX_A07 * (RA01.A / RA01.D) / 2;
        // const LX_I01 = getLengthByPytha(null, LX_B00, LX_I00);
        // const LX_I02 = LX_G00 * (RA01.A / RA01.D);
        // const LX_I03 = getLengthByPytha(null, LX_I00, LX_I02);
        // const LX_I04 = getLengthByPytha(null, LX_B00, LX_I03);

        // const LX_J00 = LX_C00 * (RA01.C / RA01.D);

        // const LT_A00 = this.alpha;
        // const LT_C00 = this.alpha * LX_C08 / OA;
        // const LT_D00 = this.alpha * LX_D03 / OA;
        // const LT_F00 = this.alpha * LX_F03 / OA;
        // const LT_G00 = this.alpha * LX_G02 / OA;
        // const LT_H00 = this.alpha * LX_H00 / OA;
        // const LT_I00 = this.alpha * LX_I04 / OA;

        // const TX_A00 = Math.asin(AE / OA);
        // const TX_B00 = Math.asin(LX_B03 / OA) * 2;
        // const TX_C00 = Math.asin(LX_C05 / LX_C08) + Math.PI;
        // const TX_D00 = Math.asin(BG / OA) - Math.asin(LX_D02 / LX_D03) + Math.PI;
        // const TX_E00 = Math.asin(BG / OA) + Math.asin(LX_D02 / LX_D03);
        // const TX_F00 = Math.asin(LX_C00 / LX_F03) - Math.asin(LX_C00 / OA) + Math.PI;
        // const TX_G00 = Math.asin(LX_G03 / LX_G02) + Math.PI;
        // const TX_H00 = Math.asin(LX_G03 / LX_H00);
        // const TX_I00 = Math.asin(LX_I01 / LX_I04) + Math.PI;
        // const TX_J00 = Math.asin(LX_C05 / LX_C08) + (Math.asin(LX_J00 / LX_C08) * 2) - Math.PI;
        // const TX_Z00 = 0;

        // const TY_A00 = 0;
        // const TY_A10 = Math.asin(LX_A09 / AE) * 2;
        // const TY_B00 = Math.asin(LX_B00 / AE);
        // const TY_C00 = TY_B00 + Math.PI;
        // const TY_D00 = TY_A00 + Math.PI;
        // const TY_G00 = Math.asin(LX_D02 / LX_G03) + Math.PI;
        // const TY_H00 = Math.asin(BG / AE) - Math.asin(LX_D02 / LX_G03);
        // const TY_I00 = Math.asin(LX_A09 / AE) - Math.asin(LX_I00 / LX_I01);
        // const TY_Z00 = 0;

        // const reles_base = {
        //     A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
        //     B0: {R: LT_A00, X: TX_B00, Y: TY_B00},
        //     C0: {R: LT_C00, X: TX_C00, Y: TY_C00},
        //     D0: {R: LT_D00, X: TX_D00, Y: TY_D00},
        //     E0: {R: LT_D00, X: TX_E00, Y: TY_D00},
        //     F0: {R: LT_F00, X: TX_F00, Y: TY_C00},
        //     G0: {R: LT_G00, X: TX_G00, Y: TY_G00},
        //     H0: {R: LT_H00, X: TX_H00, Y: TY_H00},
        //     I0: {R: LT_I00, X: TX_I00, Y: TY_I00},
        //     J0: {R: LT_C00, X: TX_J00, Y: TY_C00},
        //     Z0: {R: LT_A00, X: TX_Z00, Y: TY_Z00}
        // };

        // for (let i in reles_base) {
        //     for (let n = 0; n < 3; n ++) {
        //         this.reles[i + n + 'AO'] = {R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (Math.PI * 2 / 3 * n)};
        //         this.reles[i + n + 'SO'] = {R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (Math.PI * 2 / 3 * n)};
        //         this.reles[i + n + 'AR'] = {R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (Math.PI * 2 / 3 * n)};
        //         this.reles[i + n + 'SR'] = {R: reles_base[i].R, X: reles_base[i].X, Y: reles_base[i].Y + (Math.PI * 2 / 3 * n)};

        //         this.reles[i + n + 'SO'].Y *= -1;
        //         this.reles[i + n + 'SR'].Y *= -1;
        //         this.reles[i + n + 'SO'].Y += TY_A10 + Math.PI;
        //         this.reles[i + n + 'SR'].Y += TY_A10 + Math.PI;
        //         this.reles[i + n + 'AR'].X += Math.PI;
        //         this.reles[i + n + 'SR'].X += Math.PI;
        //     }
        // }

        // this.surfaces = {
        //     A0_A: ['Z00AR', 'D00AO', 'C00AO', 'F00AO', 'D01AO'],
        //     A1_A: ['Z00AR', 'D01AO', 'C01AO', 'F01AO', 'D02AO'],
        //     A2_A: ['Z00AR', 'D02AO', 'C02AO', 'F02AO', 'D00AO'],
        //     A0_S: ['Z00SO', 'D00SR', 'C00SR', 'F00SR', 'D01SR'],
        //     A1_S: ['Z00SO', 'D01SR', 'C01SR', 'F01SR', 'D02SR'],
        //     A2_S: ['Z00SO', 'D02SR', 'C02SR', 'F02SR', 'D00SR'],
        //     B0_A: ['A00AO', 'H00AO', 'G00SR', 'C00SR', 'G01AR'],
        //     B1_A: ['A01AO', 'H01AO', 'G02SR', 'C02SR', 'G02AR'],
        //     B2_A: ['A02AO', 'H02AO', 'G01SR', 'C01SR', 'G00AR'],
        //     B0_S: ['A00SR', 'H00SR', 'G00AO', 'C00AO', 'G01SO'],
        //     B1_S: ['A01SR', 'H01SR', 'G02AO', 'C02AO', 'G02SO'],
        //     B2_S: ['A02SR', 'H02SR', 'G01AO', 'C01AO', 'G00SO'],
        //     C0_A: ['B00AO', 'G00SR', 'C00SR', 'D00SR', 'F02SR'],
        //     C1_A: ['B01AO', 'G02SR', 'C02SR', 'D02SR', 'F01SR'],
        //     C2_A: ['B02AO', 'G01SR', 'C01SR', 'D01SR', 'F00SR'],
        //     C0_S: ['B00SR', 'G00AO', 'C00AO', 'D00AO', 'F02AO'],
        //     C1_S: ['B01SR', 'G02AO', 'C02AO', 'D02AO', 'F01AO'],
        //     C2_S: ['B02SR', 'G01AO', 'C01AO', 'D01AO', 'F00AO'],
        //     D0_A: ['B00AO', 'E02AO', 'D02AR', 'C02AR', 'F02AR'],
        //     D1_A: ['B01AO', 'E00AO', 'D00AR', 'C00AR', 'F00AR'],
        //     D2_A: ['B02AO', 'E01AO', 'D01AR', 'C01AR', 'F01AR'],
        //     D0_S: ['B00SR', 'E02SR', 'D02SO', 'C02SO', 'F02SO'],
        //     D1_S: ['B01SR', 'E00SR', 'D00SO', 'C00SO', 'F00SO'],
        //     D2_S: ['B02SR', 'E01SR', 'D01SO', 'C01SO', 'F01SO'],
        //     E0_A: ['A00AO', 'G01AR', 'I00AR', 'J00SR', 'E00AR'],
        //     E1_A: ['A01AO', 'G02AR', 'I01AR', 'J02SR', 'E01AR'],
        //     E2_A: ['A02AO', 'G00AR', 'I02AR', 'J01SR', 'E02AR'],
        //     E0_S: ['A00SR', 'G01SO', 'I00SO', 'J00AO', 'E00SO'],
        //     E1_S: ['A01SR', 'G02SO', 'I01SO', 'J02AO', 'E01SO'],
        //     E2_S: ['A02SR', 'G00SO', 'I02SO', 'J01AO', 'E02SO'],
        //     E0_A: ['A00AR', 'I00SR', 'J00AR', 'E00SR', 'D00SO'],
        //     E1_A: ['A01AR', 'I02SR', 'J01AR', 'E02SR', 'D02SO'],
        //     E2_A: ['A02AR', 'I01SR', 'J02AR', 'E01SR', 'D01SO'],
        //     E0_S: ['A00SO', 'I00AO', 'J00SO', 'E00AO', 'D00AR'],
        //     E1_S: ['A01SO', 'I02AO', 'J01SO', 'E02AO', 'D02AR'],
        //     E2_S: ['A02SO', 'I01AO', 'J02SO', 'E01AO', 'D01AR'],
        //     F0_A: ['A00SO', 'I02AR', 'G00AR', 'C00AR', 'D00AR'],
        //     F1_A: ['A01SO', 'I01AR', 'G02AR', 'C02AR', 'D02AR'],
        //     F2_A: ['A02SO', 'I00AR', 'G01AR', 'C01AR', 'D01AR'],
        //     F0_S: ['A00AR', 'I02SO', 'G00SO', 'C00SO', 'D00SO'],
        //     F1_S: ['A01AR', 'I01SO', 'G02SO', 'C02SO', 'D02SO'],
        //     F2_S: ['A02AR', 'I00SO', 'G01SO', 'C01SO', 'D01SO'],
        //     G0_A: ['A00AO', 'G01AR', 'I00AR', 'J01AR', 'E00AR'],
        //     G1_A: ['A01AO', 'G02AR', 'I01AR', 'J02AR', 'E01AR'],
        //     G2_A: ['A02AO', 'G00AR', 'I02AR', 'J00AR', 'E02AR'],
        //     G0_S: ['A00SR', 'G01SO', 'I00SO', 'J01SO', 'E00SO'],
        //     G1_S: ['A01SR', 'G02SO', 'I01SO', 'J02SO', 'E01SO'],
        //     G2_S: ['A02SR', 'G00SO', 'I02SO', 'J00SO', 'E02SO'],
        //     H0_A: ['A00AO', 'H00AO', 'J00AO', 'E00SO', 'E00AR'],
        //     H1_A: ['A01AO', 'H01AO', 'J01AO', 'E02SO', 'E01AR'],
        //     H2_A: ['A02AO', 'H02AO', 'J02AO', 'E01SO', 'E02AR'],
        //     H0_S: ['A00SR', 'H00SR', 'J00SR', 'E00AR', 'E00SO'],
        //     H1_S: ['A01SR', 'H01SR', 'J01SR', 'E02AR', 'E01SO'],
        //     H2_S: ['A02SR', 'H02SR', 'J02SR', 'E01AR', 'E02SO'],
        //     I0_A: ['A00AR', 'I02SO', 'J00SO', 'I00AO', 'I00SR'],
        //     I1_A: ['A02AR', 'I00SO', 'J01SO', 'I02AO', 'I01SR'],
        //     I2_A: ['A01AR', 'I01SO', 'J02SO', 'I01AO', 'I02SR'],
        //     I0_S: ['A00SO', 'I02AR', 'J00AR', 'I00SR', 'I00AO'],
        //     I1_S: ['A02SO', 'I00AR', 'J01AR', 'I02SR', 'I01AO'],
        //     I2_S: ['A01SO', 'I01AR', 'J02AR', 'I01SR', 'I02AO'],
        //     J0_A: ['B02AO', 'E01AO', 'J02SO', 'H02SO', 'G01SR'],
        //     J1_A: ['B00AO', 'E02AO', 'J01SO', 'H01SO', 'G00SR'],
        //     J2_A: ['B01AO', 'E00AO', 'J00SO', 'H00SO', 'G02SR'],
        //     J0_S: ['B02SR', 'E01SR', 'J02AR', 'H02AR', 'G01AO'],
        //     J1_S: ['B00SR', 'E02SR', 'J01AR', 'H01AR', 'G00AO'],
        //     J2_S: ['B01SR', 'E00SR', 'J00AR', 'H00AR', 'G02AO']
        // };
    }
}
