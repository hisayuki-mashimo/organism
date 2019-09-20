/**
 * 二十・十二面体
 *
 */
class Icosidodecahedron_Theta {
  /**
   * 初期化
   *
   */
  configure() {
    const { getLengthByPytha } = this.basis.geometry_calculator;

    const pai = Math.PI;
    // // const theta072 = pai * 2 / 5;
    const theta036 = pai * 2 / 10;
    // // const cos072 = Math.cos(theta072);
    const cos036 = Math.cos(theta036);

    // 五芒星比率
    // 五角形ABCDE・重心O
    // OAの長さ1
    // OA・BEの交点F
    // 直線OA・ABの交点G
    // AC・BEの交点H
    // AD・BEの交点I
    // (01) ∠AOG = 36°
    // (02) (01)より OG = cos36°
    // (03) (01)より AG = sin36°
    // (04) ∠OGA = ∠BFA = 90°
    // (05) (04)より △OAG ∽ △BAF
    // (06) (05)より BF = OG * (AB / OA)
    // (07) AB = AG * 2
    // (08) (02)(06)(07)より BF = cos36° * sin36° * 2
    // (10) (04)より △OAG ∽ △BHG
    // (11) (10)より BH = OA * (BG / OG)
    // (12) AG = BG
    // (13) (02)(03)(11)(12)より BH = sin36° / cos36°
    // (14) BE = BF * 2
    // (15) (08)(14)より BE = cos36° * sin36° * 4
    // (16) BH = EI
    // (17) (16)より HI = BE - (BH * 2)
    // (18) (13)(15)(17)より HI = (cos36° * sin36° * 4) - (sin36° / cos36° * 2)
    // (19) BI = BH + HI
    // (20) (13)(18)(19)より BI = (sin36° / cos36°) + (cos36° * sin36° * 4) - (sin36° / cos36° * 2)
    // ∴
    // - A(HI): (cos36° * sin36° * 4) - (sin36° / cos36° * 2)
    // - B(BH): sin36° / cos36°
    // - C(BI): (sin36° / cos36°) + (cos36° * sin36° * 4) - (sin36° / cos36° * 2)
    // - D(BE): cos36° * sin36° * 4
    const RA00 = {
      A: Math.pow(cos036, 2) * 4 - 2,
      B: 1,
      C: Math.pow(cos036, 2) * 4 - 1,
      D: Math.pow(cos036, 2) * 4,
    };

    // 五角形ABCDE・重心O
    const OA = 1;
    // 直線OA・CDの交点F
    // 直線OB・DEの交点G
    // AF・CEの交点H
    // BG・CEの交点I
    // OA・BEの交点J
    // (01) AB // CE
    // (02) ∠AOB = ∠HOI
    // (03) (01)より ∠OAB = ∠OHI
    // (04) (01)より ∠OBA = ∠OIH
    // (05) (02)(03)(04)より △OAB ∽ △OHI
    // (06) AB // EH
    // (07) AE // BH
    // (08) (06)(07)より 四角形ABHEは平行四辺形
    // (09) (08)より AB = EH
    // (10) 五芒星比率より HI = EH * (RA00.A / RA00.C)
    // (11) (09)(10)より HI = AB * (RA00.A / RA00.C)
    // (12) (05)(11)より OH = OA * (RA00.A / RA00.C)
    const OH = OA * (RA00.A / RA00.C);
    // (13) AB = AE
    // (14) (08)(13)より 四角形ABHEは菱形
    // (15) (14)より AJ = JH
    const AJ = (OA + OH) / 2;
    // (16) BJ // DF
    // (17) (16)より ∠HBJ = ∠HDF
    // (18) ∠BHJ = ∠DHF
    // (19) (17)(18)より △BHJ ∽ △DHF
    // (20) 五芒星比率より DH = BH * (RA00.B / RA00.C)
    // (21) (19)(20)より FH = JH * (RA00.B / RA00.C)
    const FH = AJ * (RA00.B / RA00.C);
    // (22) OA = OC
    // (23) (22)より CF=√(OA*OA-OF*OF)
    const CF = getLengthByPytha(OA, (OH + FH), null);
    // (24) BC = CD
    // (25) (08)より AI = BC
    // (26) 五芒星比率より AD = AI * (RA00.D / RA00.C)
    // (27) (24)(25)より AI = CD
    // (28) AD = BE
    // (29) (26)(27)(28)より BE = CD * (RA00.D / RA00.C)
    // const BJ = CF * (RA00.D / RA00.C);
    // 五角形ABCDEとAを共有する五角形AKLMN・重心P
    // AP・KNの交点Q
    // // 面ABCDEに対するNからの垂線
    // // // (30) [X = BJ Y = (OF / DF) * X] ∴ Y = (OF / DF) * BJ
    // // CDと接する△KCD
    // // DEと接する△LDE
    // // AEと接する△MAE
    // // ABと接する△NAB
    // // BCと接する△PBC
    // // (30) 五角形ABCDE ∽ 五角形KLMNP
    // // (31) BE = NK
    // // (32) (29)(30)(31)より ON = OA * (RA00.D / RA00.C)
    const ON = OA * (RA00.D / RA00.C);
    // LMの中点R
    // BNと接する五角形BNSTU
    // (33) AF = AR
    // (_34) AF // RZ
    // (_35) AR // FZ
    // (_36) (33)(_34)(_35)より 四角形AFZRは菱形
    // (_37) △AJQ ∽ △AFR
    // (_38) JQ = CD
    const ZA = getLengthByPytha(AJ, CF, null) * (RA00.D / RA00.B) * 2;
    const ZO = getLengthByPytha(ZA, OA, null);
    // CDに接する△CDV
    // (_39) ON = OV
    const _A = ZO * (RA00.C / RA00.D);
    const ZV = getLengthByPytha(null, ON, _A);

    const LT_A00 = this.alpha;

    const TX_A00 = Math.asin(OA / ZA);
    const TX_B00 = Math.asin(ON / ZV);
    const TX_C00 = Math.PI / 2;

    const TY_A00 = 0;
    const TY_B00 = Math.PI;
    const TY_C00 = Math.PI / 2;

    const reles_base = {
      A0: { R: LT_A00, X: TX_A00, Y: TY_A00 },
      B0: { R: LT_A00, X: TX_B00, Y: TY_B00 },
      C0: { R: LT_A00, X: TX_C00, Y: TY_C00 },
    };

    for (let i in reles_base) {
      const base_R = reles_base[i].R;
      const base_X = reles_base[i].X;
      const base_Y = reles_base[i].Y;

      for (let n = 0; n < 5; n++) {
        this.reles[i + n + 'AO'] = { R: base_R };
        this.reles[i + n + 'SR'] = { R: base_R };

        this.reles[i + n + 'AO'].X = base_X;
        this.reles[i + n + 'AO'].Y = base_Y + ((Math.PI * 2 / 5) * n);
        this.reles[i + n + 'SR'].X = base_X + Math.PI;
        this.reles[i + n + 'SR'].Y = base_Y + ((Math.PI * 2 / 5) * n);
      }
    }

    this.surfaces = {
      A0_A: ['A00AO', 'A01AO', 'A02AO', 'A03AO', 'A04AO'],
      A1_A: ['A00AO', 'B02AO', 'C01SR', 'C04AO', 'B03AO'],
      A2_A: ['A01AO', 'B03AO', 'C02SR', 'C00AO', 'B04AO'],
      A3_A: ['A02AO', 'B04AO', 'C03SR', 'C01AO', 'B00AO'],
      A4_A: ['A03AO', 'B00AO', 'C04SR', 'C02AO', 'B01AO'],
      A5_A: ['A04AO', 'B01AO', 'C00SR', 'C03AO', 'B02AO'],
      B0_A: ['B00AO', 'A02AO', 'A03AO'],
      B1_A: ['B01AO', 'A03AO', 'A04AO'],
      B2_A: ['B02AO', 'A04AO', 'A00AO'],
      B3_A: ['B03AO', 'A00AO', 'A01AO'],
      B4_A: ['B04AO', 'A01AO', 'A02AO'],
      B5_A: ['B00AO', 'C01AO', 'C04SR'],
      B6_A: ['B01AO', 'C02AO', 'C00SR'],
      B7_A: ['B02AO', 'C03AO', 'C01SR'],
      B8_A: ['B03AO', 'C04AO', 'C02SR'],
      B9_A: ['B04AO', 'C00AO', 'C03SR'],
      A0_R: ['A00SR', 'A01SR', 'A02SR', 'A03SR', 'A04SR'],
      A1_R: ['A00SR', 'B02SR', 'C01AO', 'C04SR', 'B03SR'],
      A2_R: ['A01SR', 'B03SR', 'C02AO', 'C00SR', 'B04SR'],
      A3_R: ['A02SR', 'B04SR', 'C03AO', 'C01SR', 'B00SR'],
      A4_R: ['A03SR', 'B00SR', 'C04AO', 'C02SR', 'B01SR'],
      A5_R: ['A04SR', 'B01SR', 'C00AO', 'C03SR', 'B02SR'],
      B0_R: ['B00SR', 'A02SR', 'A03SR'],
      B1_R: ['B01SR', 'A03SR', 'A04SR'],
      B2_R: ['B02SR', 'A04SR', 'A00SR'],
      B3_R: ['B03SR', 'A00SR', 'A01SR'],
      B4_R: ['B04SR', 'A01SR', 'A02SR'],
      B5_R: ['B00SR', 'C01SR', 'C04AO'],
      B6_R: ['B01SR', 'C02SR', 'C00AO'],
      B7_R: ['B02SR', 'C03SR', 'C01AO'],
      B8_R: ['B03SR', 'C04SR', 'C02AO'],
      B9_R: ['B04SR', 'C00SR', 'C03AO'],
    };
  }
};
