/**
 * 斜方立方八面体
 */
const Rhombicuboctahedron_Theta = function () {
};

Rhombicuboctahedron_Theta.prototype = {
    configure: function () {
        const { getLengthByPytha } = this.basis.geometry_calculator;

        // 四角形ABCD 重心O
        // OA = 1
        const OA = 1;
        // (01) ∠AOB = 90°
        // (02) OA = OB
        // (03) (01)(02)より AB = √(OA * OA * 2)
        const AB = getLengthByPytha(null, OA, OA);
        // ABの中点E
        const AE = AB / 2;
        const ZO = OA + AE;
        const ZA = getLengthByPytha(null, OA, ZO);
        // Aと接する△AFG
        // FGの中点H
        // (04) AF = AG
        // (05) ∠FAG = 90°
        // (06) (04)(05)より
        const OE = OA + AE;
        const _A = getLengthByPytha(null, OE, AE);
        const _B = getLengthByPytha(null, _A, AE);

        const LT_A00 = this.alpha;

        const TX_A00 = Math.asin(OA / ZA);
        // var TX_B00 = Math.PI / 2 - OA;
        const TX_B00 = Math.asin(_A / _B);

        const TY_A00 = 0;
        const TY_B00 = Math.asin(AE / _A);
        const TY_B01 = Math.asin(AE / _A) * -1;

        var reles_base = {
            A0: { R: LT_A00, X: TX_A00, Y: TY_A00 },
            B0: { R: LT_A00, X: TX_B00, Y: TY_B00 },
            B1: { R: LT_A00, X: TX_B00, Y: TY_B01 },
        };

        for (var i in reles_base) {
            var base_R = reles_base[i].R;
            var base_X = reles_base[i].X;
            var base_Y = reles_base[i].Y;

            for (var n = 0; n < 4; n++) {
                this.reles[i + n + 'AO'] = { R: base_R };
                this.reles[i + n + 'SR'] = { R: base_R };

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((Math.PI / 2) * n);
                this.reles[i + n + 'SR'].X = base_X + Math.PI;
                this.reles[i + n + 'SR'].Y = base_Y + ((Math.PI / 2) * n) + TY_A00;
            }
        }

        this.surfaces = {
            A0_A: ['A00AO', 'A01AO', 'A02AO', 'A03AO'],
            A1_A: ['A00AO', 'A01AO', 'B11AO', 'B00AO'],
            A2_A: ['A01AO', 'A02AO', 'B12AO', 'B01AO'],
            A3_A: ['A02AO', 'A03AO', 'B13AO', 'B02AO'],
            A4_A: ['A03AO', 'A00AO', 'B10AO', 'B03AO'],
            B0_A: ['A00AO', 'B00AO', 'B10AO'],
            B1_A: ['A01AO', 'B01AO', 'B11AO'],
            B2_A: ['A02AO', 'B02AO', 'B12AO'],
            B3_A: ['A03AO', 'B03AO', 'B13AO'],
            A0_R: ['A00SR', 'A01SR', 'A02SR', 'A03SR'],
            A1_R: ['A00SR', 'A01SR', 'B11SR', 'B00SR'],
            A2_R: ['A01SR', 'A02SR', 'B12SR', 'B01SR'],
            A3_R: ['A02SR', 'A03SR', 'B13SR', 'B02SR'],
            A4_R: ['A03SR', 'A00SR', 'B10SR', 'B03SR'],
            B0_R: ['A00SR', 'B00SR', 'B10SR'],
            B1_R: ['A01SR', 'B01SR', 'B11SR'],
            B2_R: ['A02SR', 'B02SR', 'B12SR'],
            B3_R: ['A03SR', 'B03SR', 'B13SR'],
            C0_B: ['B00AO', 'B10AO', 'B12SR', 'B02SR'],
            C1_B: ['B01AO', 'B11AO', 'B13SR', 'B03SR'],
            C2_B: ['B02AO', 'B12AO', 'B10SR', 'B00SR'],
            C3_B: ['B03AO', 'B13AO', 'B11SR', 'B01SR'],
            C4_B: ['B03AO', 'B10AO', 'B12SR', 'B01SR'],
            C5_B: ['B00AO', 'B11AO', 'B13SR', 'B02SR'],
            C6_B: ['B01AO', 'B12AO', 'B10SR', 'B03SR'],
            C7_B: ['B02AO', 'B13AO', 'B11SR', 'B00SR'],
        };
    }
};
