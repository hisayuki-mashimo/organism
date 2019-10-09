/**
 * 大星型十二面体
 *
 */
const Great_Stellated_Dodecahedron_Theta = function () {
};

Great_Stellated_Dodecahedron_Theta.prototype = {
    /**
     * 初期化
     *
     */
    configure: function () {
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

        // 正三角形比率
        const RA01 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2
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
        // AH・GIの交点M
        // (17) BE // GI
        // (18) 五芒星比率より GH = BH * (RA00.A / RA00.C)
        // (19) (17)(18)より HM = HL * (RA00.A / RA00.C)
        // (20) (15)(16)(19)より HM = AL * (RA00.A / RA00.C)
        const HM = AL * (RA00.A / RA00.C);
        // 直線AK・CDの交点N
        // (21) AC = AG * (RA00.D / RA00.C)
        // (22) ∠AMG = ∠ANC = 90°
        // (23) (22)より △AMG ∽ △ANC
        // (24) (21)(23)より AN = AM * (RA00.D / RA00.C)
        const AM = AK + HK - HM;
        const AN = AM * (RA00.D / RA00.C);
        const LN = AN - AL;
        const KL = AK - AL;

        // 五芒星PFBSQTRUEJ
        // QRの中点V
        // AN・ANに対するVからの垂線との交点X
        const LX = KL * (RA00.D / RA00.C);
        const VX = getLengthByPytha(LN, LX, null);
        const O_P = VX * (RA00.D / RA00.C) / 2;
        const O_X = VX - O_P;
        const OA = getLengthByPytha(null, AK, O_X);
        const OH = getLengthByPytha(null, HK, O_X);
        const OK = (O_P + O_X) * (RA00.C / RA00.D) - O_X;


        // const KN = AN - AK;
        // const CN = getLengthByPytha(AK, KN, null);
        // const CD = CN * 2;
        // const _A = CD * (RA01.B / RA01.C);
        // const _B = getLengthByPytha(CD, );
        // const FJ = CD * (RA00.A / RA00.C);
        // const OH = FJ / 2;
        // const OK = getLengthByPytha(OH, HK, null);
        // console.log(`${OH} - ${HK} - ${OK}`);
        // const OA = getLengthByPytha(null, AK, OK);

        // // 五芒星MQBRNSPTEU
        // // OAと∠NMPの2等分線との交点V
        // // (17) ∠OAK = ∠LAV
        // // (18) ∠AVL = ∠AKO = 90°
        // // (19) (17)(18)より △ALV ∽ △AOK
        // // (20) (19)より OK = LV * (AK / AV)
        // // (21) AL = ML
        // // (22) ∠ALV = ∠MLK
        // // (23) ∠AVL = ∠MKL = 90°
        // // (24) (21)(22)(23)より △ALV ≡ △MLK
        // // (25) (24)より LV = LK

        // const KL = AK - AL;
        // const AV = getLengthByPytha(AL, KL, null);
        // const OA = AL * (AK / AV);
        // const OK = OA - AV;
        // const OH = getLengthByPytha(null, HK, OK);

        const LT_A00 = this.alpha;
        // const LT_B00 = this.alpha * (OH / OA);
        const LT_C00 = this.alpha * (OH / OA);
        const TX_O00 = 0;
        const TX_A00 = Math.asin(AK / OA);
        const TX_B00 = Math.acos(O_P / OA);
        const TX_C00 = Math.asin(HK / OH);
        // const TX_C00 = TX_B00 + TX_A00;
        // const TX_O00 = 0;
        const TY_A00 = 0;
        const TY_C00 = Math.PI;

        var reles_base = {
            A0: { R: LT_A00, X: TX_A00, Y: TY_A00 },
            B0: { R: LT_A00, X: TX_B00, Y: TY_A00 },
            C0: { R: LT_C00, X: TX_C00, Y: TY_C00 },
            O0: { R: LT_C00, X: TX_O00, Y: TY_A00 },
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
            A00A: ["A00AO", "C02AO", "C03AO"],
            A01A: ["A01AO", "C03AO", "C04AO"],
            A02A: ["A02AO", "C04AO", "C00AO"],
            A03A: ["A03AO", "C00AO", "C01AO"],
            A04A: ["A04AO", "C01AO", "C02AO"],
            A00R: ["A00SR", "C02SR", "C03SR"],
            A01R: ["A01SR", "C03SR", "C04SR"],
            A02R: ["A02SR", "C04SR", "C00SR"],
            A03R: ["A03SR", "C00SR", "C01SR"],
            A04R: ["A04SR", "C01SR", "C02SR"],

            B00A: ["B00AO", "C02AO", "C03AO"],
            B01A: ["B01AO", "C03AO", "C04AO"],
            B02A: ["B02AO", "C04AO", "C00AO"],
            B03A: ["B03AO", "C00AO", "C01AO"],
            B04A: ["B04AO", "C01AO", "C02AO"],
            B00R: ["B00SR", "C02SR", "C03SR"],
            B01R: ["B01SR", "C03SR", "C04SR"],
            B02R: ["B02SR", "C04SR", "C00SR"],
            B03R: ["B03SR", "C00SR", "C01SR"],
            B04R: ["B04SR", "C01SR", "C02SR"],

            C00A: ["A00AO", "C00SR", "C02AO"],
            C01A: ["A01AO", "C01SR", "C03AO"],
            C02A: ["A02AO", "C02SR", "C04AO"],
            C03A: ["A03AO", "C03SR", "C00AO"],
            C04A: ["A04AO", "C04SR", "C01AO"],
            C05A: ["A00AO", "C00SR", "C03AO"],
            C06A: ["A01AO", "C01SR", "C04AO"],
            C07A: ["A02AO", "C02SR", "C00AO"],
            C08A: ["A03AO", "C03SR", "C01AO"],
            C09A: ["A04AO", "C04SR", "C02AO"],
            C00R: ["A00SR", "C00AO", "C02SR"],
            C01R: ["A01SR", "C01AO", "C03SR"],
            C02R: ["A02SR", "C02AO", "C04SR"],
            C03R: ["A03SR", "C03AO", "C00SR"],
            C04R: ["A04SR", "C04AO", "C01SR"],
            C05R: ["A00SR", "C00AO", "C03SR"],
            C06R: ["A01SR", "C01AO", "C04SR"],
            C07R: ["A02SR", "C02AO", "C00SR"],
            C08R: ["A03SR", "C03AO", "C01SR"],
            C09R: ["A04SR", "C04AO", "C02SR"],

            K00A: ["O00AO", "B00AO", "C02AO"],
            K01A: ["O00AO", "B01AO", "C03AO"],
            K02A: ["O00AO", "B02AO", "C04AO"],
            K03A: ["O00AO", "B03AO", "C00AO"],
            K04A: ["O00AO", "B04AO", "C01AO"],
            K05A: ["O00AO", "B00AO", "C03AO"],
            K06A: ["O00AO", "B01AO", "C04AO"],
            K07A: ["O00AO", "B02AO", "C00AO"],
            K08A: ["O00AO", "B03AO", "C01AO"],
            K09A: ["O00AO", "B04AO", "C02AO"],
            K00R: ["O00SR", "B00SR", "C02SR"],
            K01R: ["O00SR", "B01SR", "C03SR"],
            K02R: ["O00SR", "B02SR", "C04SR"],
            K03R: ["O00SR", "B03SR", "C00SR"],
            K04R: ["O00SR", "B04SR", "C01SR"],
            K05R: ["O00SR", "B00SR", "C03SR"],
            K06R: ["O00SR", "B01SR", "C04SR"],
            K07R: ["O00SR", "B02SR", "C00SR"],
            K08R: ["O00SR", "B03SR", "C01SR"],
            K09R: ["O00SR", "B04SR", "C02SR"],
        };
    }
};
