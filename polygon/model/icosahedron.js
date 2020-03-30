/**
 * 正二十面体
 *
 * (依存: 三角形重心比率係数)
 * (依存: 五芒星比率係数)
 */
class Icosahedron {
    configure = () => {
        const { getLengthByPytha } = this.basis.geometry_calculator;

        // 五芒星比率
        const RA01 = (1 + Math.sqrt(5)) / 2;

        // 中心点O
        // 正三角形ABC
        // 正三角形BCD
        // 正三角形ACE
        // 正三角形ABF
        // △ABCの重心G
        const AG = 1;
        // BCの中点H
        // (01) GH = (AG + GH) / 三角形重心比率係数
        const GH = AG / 2;
        const BG = AG;
        const BH = getLengthByPytha(BG, GH, null);
        // EFの中点I
        // OH・ADの交点J
        // (02) 五角形ABDfEは正五角形
        // (03) (02)より 五角形AHDiIは正五角形
        // (04) (03)より OH = OJ * 五芒星比率
        // (05) (要証明) Jj = Ad
        // Adの中点K
        const AK = BH;
        const OJ = AK;
        const OH = OJ * RA01;
        const OG = getLengthByPytha(OH, GH, null);
        const OA = getLengthByPytha(null, AG, OG);

        const LT_A00 = this.alpha;

        const TX_A00 = Math.asin(AG / OA);
        const TX_B00 = Math.asin(GH / OH) * 2 + TX_A00;

        const TY_A00 = 0;
        const TY_B00 = Math.PI;

        const reles_base = {
            A0: { R: LT_A00, X: TX_A00, Y: TY_A00 },
            B0: { R: LT_A00, X: TX_B00, Y: TY_B00 }
        };

        for (let i in reles_base) {
            const base_R = reles_base[i].R;
            const base_X = reles_base[i].X;
            const base_Y = reles_base[i].Y;

            for (let n = 0; n < 3; n++) {
                this.reles[i + n + 'AO'] = { R: base_R };
                this.reles[i + n + 'SR'] = { R: base_R };

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((Math.PI * 2 / 3) * n);
                this.reles[i + n + 'SR'].X = base_X + Math.PI;
                this.reles[i + n + 'SR'].Y = base_Y + ((Math.PI * 2 / 3) * n);
            }
        }

        this.surfaces = {
            A0_A: ['A00AO', 'A01AO', 'A02AO'],
            A0_R: ['A00SR', 'A01SR', 'A02SR'],

            B0_A: ['B00AO', 'A01AO', 'A02AO'],
            B1_A: ['B01AO', 'A02AO', 'A00AO'],
            B2_A: ['B02AO', 'A00AO', 'A01AO'],
            B0_R: ['B00SR', 'A01SR', 'A02SR'],
            B1_R: ['B01SR', 'A02SR', 'A00SR'],
            B2_R: ['B02SR', 'A00SR', 'A01SR'],

            C0_A: ['A00AO', 'B00SR', 'B01AO'],
            C1_A: ['A01AO', 'B01SR', 'B02AO'],
            C2_A: ['A02AO', 'B02SR', 'B00AO'],
            C3_A: ['A00AO', 'B00SR', 'B02AO'],
            C4_A: ['A01AO', 'B01SR', 'B00AO'],
            C5_A: ['A02AO', 'B02SR', 'B01AO'],
            C0_R: ['A00SR', 'B00AO', 'B01SR'],
            C1_R: ['A01SR', 'B01AO', 'B02SR'],
            C2_R: ['A02SR', 'B02AO', 'B00SR'],
            C3_R: ['A00SR', 'B00AO', 'B02SR'],
            C4_R: ['A01SR', 'B01AO', 'B00SR'],
            C5_R: ['A02SR', 'B02AO', 'B01SR'],
        };
    }
}
