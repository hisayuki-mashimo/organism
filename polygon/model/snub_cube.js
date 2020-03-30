/**
 * 変形立方体
 */
class Snub_Cube {
    configure = () => {
        /*
       ┌ Y = A(X + N)
       └ 0 = X
       → Y = AN
       → [0 , AN]
 
       ┌ (Y + N) = AX
       └ Y = X
       → X + N = AX
       → N = AX - X
       → N = (A - 1)X
       → X = N / (A - 1)
       → [(N / (A - 1)) , (N / (A - 1))]
 
       ┌ AN = Q
       ├ N / (A - 1) = P(N / (A - 1)) + Q
       └ P = -(1 / A)
       ┌ N / (A - 1) = P(N / (A - 1)) + AN
       └ P = -(1 / A)
       → N / (A - 1) = (-(1 / A) * (N / (A - 1))) + AN
       → N = (-(1 / A) * N) + AN(A - 1)
       → 1 = -(1 / A) + A(A - 1)
       → 1 = -(1 / A) + AA - A
       → A = -1 + AAA - AA
       → AAA - AA - A - 1 = 0
 
       E = (-27 * A * A * D) + ((9 * A * B * C) - (2 *  B * B * B);
       F = (3 * A * C) - (B * B);
       P = Math.pow(Math.pow((E * E) + (4 * F * F * F), 1 / 2) + E, 1 / 3);
       H = Math.pow(2, 1 / 3);
       X = (P / (3 * A * H)) - (H * F / (3 * A * P)) - (B / (3 * A));
 
       ---
 
       ┌ Y = (-1 / A)X + AN
       └ Y = A(X - N)
       → A(X - N) = (-1 / A)X + AN
       → AX - AN = (-1 / A)X + AN
       → AAX - AAN = -X + AAN
       → AAX + X = 2AAN
       → (AA + 1)X = 2AAN
       → X = 2AAN / (AA + 1)
       → [(2AAN / (AA + 1)) , ((2AAAN / (AA + 1)) - AN)]
        */
        const LX_A01 = Math.pow(Math.pow(1188, 1 / 2) + 38, 1 / 3);
        const LX_A02 = Math.pow(2, 1 / 3);
        const LX_A03 = (LX_A01 / (3 * LX_A02)) + (4 * LX_A02 / (3 * LX_A01)) + (1 / 3);

        const RA_A00 = this.basis.geometry_calculator.finalizeRatioByPytha({
            A: null,
            B: LX_A03,
            C: 1
        });

        const LX_A04 = LX_A03 * (RA_A00.B / RA_A00.A);
        const LX_A05 = this.basis.geometry_calculator.getLengthByPytha(null, LX_A04, 1);

        const LX_B00 = 1 / (LX_A03 - 1) * Math.pow(2, 1 / 2);
        const LX_B01 = 1 / Math.pow(2, 1 / 2);
        const LX_B03 = this.basis.geometry_calculator.getLengthByPytha(LX_B01 * 2, LX_B01, null);
        const LX_B04 = LX_B00 - LX_B01;
        const LX_B05 = this.basis.geometry_calculator.getLengthByPytha(LX_B03, LX_B04, null);
        const LX_B06 = LX_A04 - LX_B05;
        const LX_B07 = this.basis.geometry_calculator.getLengthByPytha(null, LX_B00, LX_B06);

        const LX_C00 = LX_A03 - 1;
        const LX_C01 = Math.pow(2, 1 / 2);
        const LX_C02 = this.basis.geometry_calculator.getLengthByPytha(LX_C01, LX_C00, null);
        const LX_C03 = LX_A04 - LX_C02;
        const LX_C04 = this.basis.geometry_calculator.getLengthByPytha(null, LX_A03, LX_C03);

        const LT_A00 = this.alpha;
        const LT_B00 = this.alpha / LX_A05 * LX_B07;
        const LT_C00 = this.alpha / LX_A05 * LX_C04;

        const TX_A00 = Math.asin(1 / LX_A05);
        const TX_B00 = Math.asin(LX_B00 / LX_B07);
        const TX_C00 = Math.asin(LX_A03 / LX_C04);

        const TY_A00 = 0;
        const TY_B00 = Math.PI / 4;
        const TY_R00 = Math.acos(LX_A04 / LX_A03) * 2;

        const reles_base = {
            A0: { R: LT_A00, X: TX_A00, Y: TY_A00 },
            B0: { R: LT_B00, X: TX_B00, Y: TY_B00 },
            C0: { R: LT_C00, X: TX_C00, Y: TY_A00 }
        };

        for (let i in reles_base) {
            const base_R = reles_base[i].R;
            const base_X = reles_base[i].X;
            const base_Y = reles_base[i].Y;

            for (let n = 0; n < 4; n++) {
                this.reles[i + n + 'AO'] = { R: base_R };
                this.reles[i + n + 'SR'] = { R: base_R };

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((Math.PI / 2) * n);
                this.reles[i + n + 'SR'].X = base_X + Math.PI;
                this.reles[i + n + 'SR'].Y = base_Y + ((Math.PI / 2) * n) + TY_R00;
            }
        }

        this.surfaces = {
            A0_A: ['A00AO', 'A01AO', 'A02AO', 'A03AO'],
            B0_A: ['A00AO', 'B00AO', 'A01AO'],
            B1_A: ['A01AO', 'B01AO', 'A02AO'],
            B2_A: ['A02AO', 'B02AO', 'A03AO'],
            B3_A: ['A03AO', 'B03AO', 'A00AO'],
            C0_A: ['A00AO', 'B00AO', 'C00AO'],
            C1_A: ['A01AO', 'B01AO', 'C01AO'],
            C2_A: ['A02AO', 'B02AO', 'C02AO'],
            C3_A: ['A03AO', 'B03AO', 'C03AO'],
            C4_A: ['A00AO', 'B03AO', 'C00AO'],
            C5_A: ['A01AO', 'B00AO', 'C01AO'],
            C6_A: ['A02AO', 'B01AO', 'C02AO'],
            C7_A: ['A03AO', 'B02AO', 'C03AO'],
            A0_R: ['A00SR', 'A01SR', 'A02SR', 'A03SR'],
            B0_R: ['A00SR', 'B00SR', 'A01SR'],
            B1_R: ['A01SR', 'B01SR', 'A02SR'],
            B2_R: ['A02SR', 'B02SR', 'A03SR'],
            B3_R: ['A03SR', 'B03SR', 'A00SR'],
            C0_R: ['A00SR', 'B00SR', 'C00SR'],
            C1_R: ['A01SR', 'B01SR', 'C01SR'],
            C2_R: ['A02SR', 'B02SR', 'C02SR'],
            C3_R: ['A03SR', 'B03SR', 'C03SR'],
            C4_R: ['A00SR', 'B03SR', 'C00SR'],
            C5_R: ['A01SR', 'B00SR', 'C01SR'],
            C6_R: ['A02SR', 'B01SR', 'C02SR'],
            C7_R: ['A03SR', 'B02SR', 'C03SR'],
            D0_M: ['C00AO', 'B00AO', 'C02SR', 'B01SR'],
            D1_M: ['C01AO', 'B01AO', 'C03SR', 'B02SR'],
            D2_M: ['C02AO', 'B02AO', 'C00SR', 'B03SR'],
            D3_M: ['C03AO', 'B03AO', 'C01SR', 'B00SR'],
            E0_M: ['C00AO', 'B03AO', 'C01SR'],
            E1_M: ['C01AO', 'B00AO', 'C02SR'],
            E2_M: ['C02AO', 'B01AO', 'C03SR'],
            E3_M: ['C03AO', 'B02AO', 'C00SR'],
            E4_M: ['C00AO', 'B01SR', 'C01SR'],
            E5_M: ['C01AO', 'B02SR', 'C02SR'],
            E6_M: ['C02AO', 'B03SR', 'C03SR'],
            E7_M: ['C03AO', 'B00SR', 'C00SR']
        };
    }
}
