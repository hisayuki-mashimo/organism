/**
 * 小星型十二面体
 *
 */
class Small_Stellated_Dodecahedron {
    configure = () => {
        const { getLengthByPytha } = this.basis.geometry_calculator;

        // 五芒星比率
        const cos036 = Math.cos(Math.PI / 5);
        const coefficient = Math.pow(cos036, 2) * 4;
        const RA00 = {
            A: coefficient - 2,
            B: 1,
            C: coefficient - 1,
            D: coefficient,
        };

        // 中心点O
        // 五芒星AFBGCIDIEJ 重心K
        const AK = 1;
        // (01) AB // HI
        // (02) (01)より ∠KAB = ∠KHI
        // (03) ∠AKB = ∠HKI
        // (04) (02)(03)より △ABK ∽ △HIK
        // (05) BC // AI
        // (06) (01)(05)より 四角形ABCIは平行四辺形
        // (07) (06)より AB = CI
        // (08) 五芒星比率より HI = EH * (RA00.A / RA00.C)
        // (09) (04)(07)(08)より HK = AK * (RA00.A / RA00.C)
        const HK = AK * (RA00.A / RA00.C);
        // AK・BEの交点L
        // (10) AB = AE
        // (11) (06)(10)より 四角形ABCIは菱形
        // (12) (11)より ∠ABL = ∠HBL
        // (13) ∠ALB = ∠HLB = 90°
        // (14) (12)(13)より △ABL ≡ △HBL
        // (15) (14)より AL = HL
        // (16) (09)(15)より AL = (AK + HK) / 2
        const AL = (AK + HK) / 2;
        // 五芒星MQBRNSPTEU
        // OAと∠NMPの2等分線との交点V
        // (17) ∠OAK = ∠LAV
        // (18) ∠AVL = ∠AKO = 90°
        // (19) (17)(18)より △ALV ∽ △AOK
        // (20) (19)より OK = LV * (AK / AV)
        // (21) AL = ML
        // (22) ∠ALV = ∠MLK
        // (23) ∠AVL = ∠MKL = 90°
        // (24) (21)(22)(23)より △ALV ≡ △MLK
        // (25) (24)より LV = LK

        const KL = AK - AL;
        const AV = getLengthByPytha(AL, KL, null);
        const OA = AL * (AK / AV);
        const OK = OA - AV;
        const OH = getLengthByPytha(null, HK, OK);

        const LT_A00 = this.alpha;
        const LT_B00 = this.alpha * (OH / OA);
        const TX_A00 = Math.asin(AK / OA);
        const TX_B00 = Math.asin(HK / OH);
        const TX_C00 = TX_B00 + TX_A00;
        const TX_O00 = 0;
        const TY_A00 = 0;
        const TY_B00 = Math.PI;

        var reles_base = {
            O0: { R: LT_A00, X: TX_O00, Y: TY_A00 },
            A0: { R: LT_A00, X: TX_A00, Y: TY_A00 },
            B0: { R: LT_B00, X: TX_B00, Y: TY_B00 },
            C0: { R: LT_B00, X: TX_C00, Y: TY_A00 },
        };

        for (var i in reles_base) {
            var base_R = reles_base[i].R;
            var base_X = reles_base[i].X;
            var base_Y = reles_base[i].Y;

            for (var n = 0; n < 5; n++) {
                this.reles[i + n + 'AO'] = { R: base_R };
                this.reles[i + n + 'SR'] = { R: base_R };

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((Math.PI * 2 / 5) * n);
                this.reles[i + n + 'SR'].X = base_X + Math.PI;
                this.reles[i + n + 'SR'].Y = base_Y + ((Math.PI * 2 / 5) * n);
            }
        }

        this.surfaces = {
            O00A: ["O00AO", "B00AO", "B01AO"],
            O01A: ["O00AO", "B01AO", "B02AO"],
            O02A: ["O00AO", "B02AO", "B03AO"],
            O03A: ["O00AO", "B03AO", "B04AO"],
            O04A: ["O00AO", "B04AO", "B00AO"],
            O00R: ["O00SR", "B00SR", "B01SR"],
            O01R: ["O00SR", "B01SR", "B02SR"],
            O02R: ["O00SR", "B02SR", "B03SR"],
            O03R: ["O00SR", "B03SR", "B04SR"],
            O04R: ["O00SR", "B04SR", "B00SR"],

            A00A: ["A00AO", "B02AO", "B03AO"],
            A01A: ["A01AO", "B03AO", "B04AO"],
            A02A: ["A02AO", "B04AO", "B00AO"],
            A03A: ["A03AO", "B00AO", "B01AO"],
            A04A: ["A04AO", "B01AO", "B02AO"],
            A00R: ["A00SR", "B02SR", "B03SR"],
            A01R: ["A01SR", "B03SR", "B04SR"],
            A02R: ["A02SR", "B04SR", "B00SR"],
            A03R: ["A03SR", "B00SR", "B01SR"],
            A04R: ["A04SR", "B01SR", "B02SR"],

            B00A: ["A00AO", "C00AO", "C02SR"],
            B01A: ["A01AO", "C01AO", "C03SR"],
            B02A: ["A02AO", "C02AO", "C04SR"],
            B03A: ["A03AO", "C03AO", "C00SR"],
            B04A: ["A04AO", "C04AO", "C01SR"],
            B10A: ["A00AO", "C00AO", "C03SR"],
            B11A: ["A01AO", "C01AO", "C04SR"],
            B12A: ["A02AO", "C02AO", "C00SR"],
            B13A: ["A03AO", "C03AO", "C01SR"],
            B14A: ["A04AO", "C04AO", "C02SR"],
            B00R: ["A00SR", "C00SR", "C02AO"],
            B01R: ["A01SR", "C01SR", "C03AO"],
            B02R: ["A02SR", "C02SR", "C04AO"],
            B03R: ["A03SR", "C03SR", "C00AO"],
            B04R: ["A04SR", "C04SR", "C01AO"],
            B10R: ["A00SR", "C00SR", "C03AO"],
            B11R: ["A01SR", "C01SR", "C04AO"],
            B12R: ["A02SR", "C02SR", "C00AO"],
            B13R: ["A03SR", "C03SR", "C01AO"],
            B14R: ["A04SR", "C04SR", "C02AO"],

            C00A: ["A00AO", "B02AO", "C02SR"],
            C01A: ["A01AO", "B03AO", "C03SR"],
            C02A: ["A02AO", "B04AO", "C04SR"],
            C03A: ["A03AO", "B00AO", "C00SR"],
            C04A: ["A04AO", "B01AO", "C01SR"],
            C10A: ["A00AO", "B03AO", "C03SR"],
            C11A: ["A01AO", "B04AO", "C04SR"],
            C12A: ["A02AO", "B00AO", "C00SR"],
            C13A: ["A03AO", "B01AO", "C01SR"],
            C14A: ["A04AO", "B02AO", "C02SR"],
            C00R: ["A00SR", "B02SR", "C02AO"],
            C01R: ["A01SR", "B03SR", "C03AO"],
            C02R: ["A02SR", "B04SR", "C04AO"],
            C03R: ["A03SR", "B00SR", "C00AO"],
            C04R: ["A04SR", "B01SR", "C01AO"],
            C10R: ["A00SR", "B03SR", "C03AO"],
            C11R: ["A01SR", "B04SR", "C04AO"],
            C12R: ["A02SR", "B00SR", "C00AO"],
            C13R: ["A03SR", "B01SR", "C01AO"],
            C14R: ["A04SR", "B02SR", "C02AO"],
        }
    }
}
