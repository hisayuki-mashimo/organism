/**
 * 5つの正四面体
 *
 */
class Fifth_Tetrahedron {
  configure = () => {
    const { getLengthByPytha } = this.basis.geometry_calculator;

    // 五芒星比率
    // import RA_00 from "../module/ratio_five_pointed_star.js";
    const RA_00 = (1 + Math.sqrt(5)) / 2;

    // 正三角形比率
    // import RA_01 from "../module/ratio_equilateral_triangle.js";
    const RA_01 = {
      A: 1,
      B: Math.sqrt(3),
      C: 2,
    };

    // 正五角形比率
    // import RA_02 from "../module/ratio_regular_pentagon.js";
    const RA_02 = (1 + Math.sqrt(5)) / 4;

    // [多面体の中心点]O00
    // [視点からの左右方向の軸]X軸
    // [視点からの上下方向の軸]Y軸
    // [視点からの前後方向の軸]Z軸
    // [点名の規則(原点)](大文字英字)(数字)
    // [点名の規則(原点に対する[多面体の中心点における対称点])](子文字英字)(数字)
    // [各点のX軸面上の透過点]X_(点名)
    // [各点のZ軸面上の透過点]Z_(点名)
    // [Z軸に垂直な[多面体の頂点から構成される最大の正三角形]]A11_A12_A13・A14_A15_A16
    // [A11・A12・A13]を含む面]A
    // [Z軸・面Aの交点]A00
    // [A12_A13の中点]A21
    // [A11_A14の中点]A31
    // [A11・A12・A13と[正四面体を構成する多面体上のもう1つの点]]b00
    const A00_A11 = 1;
    const A12_A21 = A00_A11 * (RA_01.B / RA_01.C);
    const A00_A21 = A00_A11 * (RA_01.A / RA_01.C);
    const A11_A21 = A00_A11 + A00_A21;
    // (01) A11_A21 = A21_b00
    const A21_b00 = A11_A21;
    const A00_b00 = getLengthByPytha(A21_b00, A00_A21, null);
    // [直線O00_A11・A21_b00の交点]X11
    // (02) (01)より △A11_A21_X11 ≡ △b00_A21_A00
    // (03) (02)より ∠A21_A11_X11 = ∠A21_b00_A00
    // (04) (03)より △O00_A00_A11 ∽ △A00_A21_b00
    // (05) (04)より O00_A11 = A00_A11 * (A21_b00 / A00_b00)
    const O00_A11 = A00_A11 * (A21_b00 / A00_b00);
    // [A11・A14・B00を含む正五角形]A11_A14_C12_B00_C11
    // [C11・C12と[正三角形を構成する多面体上のもう1つの点]]C13
    // [C11・C12・C13]を含む面]C
    // [Z軸・面Cの交点]C00
    // [C11_C12の中点]C21
    // [ZO00を中心とする[ZO00_ZA11を半径とする円]]ZO00_ZA11
    // (06) ZA14は円ZO00_ZA11の円周上の点
    // (07) (06)より ∠ZA11_ZA14_Za11 = 90°
    // (08) ZA11_ZA31 = C11_C21 / 五芒星比率
    // (09) ZC00_ZC21 = C11_C21 * (正三角形比率 A / B)
    // (10) ZA31_ZC00 = ZC00_ZC21 * (1 + 五芒星比率)
    // (11) (09)(10)より ZA31_ZC00 = C11_C21 * (正三角形比率 A / B) * (1 + 五芒星比率)
    // (12) (10)(11)より ZA11_ZA31 : ZA31_ZC00 = (1 / 五芒星比率) : ((正三角形比率 A / B) * (1 + 五芒星比率))
    // (13) ZA11_ZA14 = ZA11_ZA31 * 2
    // (14) Za11_ZA14 = ZA31_ZC00 * 2
    // (13) (07)(13)(14)より ZA11_Za11 = √((ZA11_ZA14 * ZA11_ZA14) + (Za11_ZA14 * Za11_ZA14))
    const R_ZA11_ZA14 = 1 / RA_00;
    const R_Za11_ZA14 = (RA_01.A / RA_01.B) * (1 + RA_00);
    const R_ZA11_Za11 = getLengthByPytha(null, R_ZA11_ZA14, R_Za11_ZA14);
    const ZA11_Za11 = A00_A11 * 2;
    const A11_A14 = ZA11_Za11 * (R_ZA11_ZA14 / R_ZA11_Za11);
    const Za11_ZA14 = ZA11_Za11 * (R_Za11_ZA14 / R_ZA11_Za11);
    const ZA31_ZC00 = Za11_ZA14 / 2;
    const A11_A31 = A11_A14 / 2;
    // (14) Zc13はZA11_ZA12・ZA14_ZC11の交点
    // (15) (14)より ZC21_Zc13 = ZA31_ZC21 / 五芒星比率
    // (16) ZA00_ZC21 = ZC21_Zc13
    // (17) (15)(16)より ZA31_ZC00 = ZA00_ZC21 * (2 + (1 / 五芒星比率))
    const ZA00_ZC21 = ZA31_ZC00 / (2 + 1 / RA_00);
    const ZA00_Zc13 = ZA00_ZC21 * 2;
    const C00_C11 = ZA00_Zc13;
    const C11_C21 = A11_A31 * RA_00;
    // [A11_A16の中点]A41
    // [A12_A14の中点]A42
    // [A13_A15の中点]A43
    const a12_a32 = A11_A31;
    const A11_A41 = a12_a32 * RA_00;
    // [A11_A15・A13_A14の交点]A51
    // [A12_A16・A11_A15の交点]A52
    // [A13_A14・A12_A16の交点]A53
    // (18) A11_A15は△A11_A12_A13・△a13_a15_C11の交線
    // (19) A12_A14は△A11_A12_A13・△A14_a12_C13の交線
    // (20) △A11_A31_A51 ∽ △A15_A43_A51
    // (21) A11_A14 = A12_A15 / 五芒星比率
    // (22) (20)(21)より A31_A51 = A31_A43 / (1 + 五芒星比率)
    const A00_A31 = getLengthByPytha(A00_A11, A11_A31, null);
    const A00_A41 = getLengthByPytha(A00_A11, A11_A41, null);
    const A00_A43 = A00_A41;
    const A31_A43 = A00_A31 + A00_A43;
    const A31_A51 = A31_A43 / (1 + RA_00);
    const A00_A51 = A00_A31 - A31_A51;
    const O00_B00 = O00_A11;
    const A00_a00 = (O00_B00 * 2) / 3;
    const O00_A00 = A00_a00 / 2;
    const O00_A51 = getLengthByPytha(null, O00_A00, A00_A51);
    // [A11_A15・A12_A13の交点]A61
    // (23) △A11_A14_A51 ∽ △A15_A13_A51
    // (24) (21)(23)より A13_A51 = A13_A14 / 五芒星比率
    // (25) A12_A15 // A13_A14
    // (26) A11_A15 // A12_A14
    // (27) (25)(26)より 四角形A12_A14_A51_A15は平行四辺形
    // (28) (27)より A12_A15 = A14_A51
    // (29) (25)より △A12_A15_A61 ∽ △A13_A51_A61
    // (30) (29)より A12_A61 : A13_A61 = A12_A15 : A13_A51
    // (31) (28)(30)より A12_A61 : A13_A61 = A14_A51 : A13_A51
    // (32) (23)(24)(31)より A12_A61 = A12_A13 / (1 + 五芒星比率)
    const A12_A13 = A12_A21 * 2;
    const A12_A61 = A12_A13 / (1 + RA_00);
    const A21_A61 = A12_A21 - A12_A61;
    const A00_A61 = getLengthByPytha(null, A00_A21, A21_A61);
    const O00_A61 = getLengthByPytha(null, O00_A00, A00_A61);
    // [A11_A15・a13_C11の交点]A71
    // [ZA11_ZA15・ZA14_ZC11の交点]X21
    // [ZA11_ZA15・Za13_ZA16の交点]X22
    // [ZA11_ZA15・ZC12_Zc12の交点]X23
    // (33) A71_C11 = a13_C11 / (1 + 五芒星比率)
    // (34) ZA14_ZC11 // Za13_ZA16
    // (35) (34)より △ZA71_ZC11_ZX21 ∽ △ZA71_Za13_ZX22
    // (36) (35)より ZA71_ZX21 = ZX21_ZX22 / 五芒星比率
    // (37) ZX21_ZX23 = Zc11_Zc23 = ZA14_ZA42
    // (38) ZX22_ZX23 = Za13_Aa33
    // (39) (37)(38)より ZX21_ZX22 = ZX22_ZX23 / 五芒星比率
    const Za13_Aa33 = A11_A31;
    const ZX22_ZX23 = Za13_Aa33;
    const ZX21_ZX22 = ZX22_ZX23 / RA_00;
    const ZA71_ZX22 = ZX21_ZX22 / RA_00;
    const ZA71_ZX23 = ZA71_ZX22 + ZX22_ZX23;
    // (40) Za13_ZA16 // Za33_ZC23
    // (41) (35)(40)より Za33_ZX23 = Za33_ZC23 / 五芒星比率
    const Za13_ZA16 = Za11_ZA14;
    const ZA00_ZC23 = ZA00_ZC21;
    const A00_A33 = A00_A31;
    const A00_a33 = A00_A31;
    const Za33_ZC23 = Za13_ZA16 - A00_A33 + ZA00_ZC23;
    const Za33_ZX23 = Za33_ZC23 / RA_00;
    const ZA00_ZX23 = A00_a33 - Za33_ZX23;
    const A00_A71 = getLengthByPytha(null, ZA71_ZX23, ZA00_ZX23);
    const O00_A71 = getLengthByPytha(null, O00_A00, A00_A71);
    // [A71からのA00_A11への垂線・A00_A11との交点]X24
    // (42) ∠A00_X23_A11 = 90°
    // (43) (42)より△A00_A11_X23 ∽ △A71_A11_X24
    // (44) A11_X21 = A00_A11 / (1 + 五芒星比率)
    // (48) (34)(39)(40)(44)より A11_X21 = X22_X23
    const A11_X22 = ZX22_ZX23 * (1 + 1 / RA_00);
    const A11_X23 = ZX22_ZX23 * (2 + 1 / RA_00);
    const A11_A71 = A11_X22 - ZA71_ZX22;
    const A00_X23 = getLengthByPytha(A00_A11, A11_X23, null);
    const A71_X24 = A00_X23 * (A11_A71 / A00_A11);
    // [a15_B00・a16_C11の交点]D11
    // [a16_B00・a14_C12の交点]D12
    // [a14_B00・a15_C13の交点]D13
    // [D11・D12・D13]を含む面]D
    // [Z軸・面Dの交点]D00
    // (49) a16_C11は△a13_A15_C11・△a15_a16_B00の交線
    // (50) B00_D11 = A12_A61
    // (51) (50)より B00_D11 = a15_B00 / (1 + 五芒星比率)
    // (52) △a00_a15_B00 ∽ △D00_D11_B00
    // (53) (51)(52)より a00_D00 = a00_B00 / 五芒星比率
    const a00_B00 = A00_b00;
    const a00_D00 = a00_B00 / RA_00;
    const O00_D00 = a00_D00 - O00_A00;
    const O00_D11 = O00_A71;
    const D00_D11 = getLengthByPytha(O00_D11, O00_D00, null);
    // // [D11からのA00_A11への垂線・A00_A11との交点]X31
    // // (54) ZA00_ZA11 // Za15_ZX23
    // // (55) (54)より △ZA00_Za15_ZX23 ∽ △ZD11_ZA00_ZX31
    // // (56) (53)(55)より ZD11_ZX31 = ZA00_ZX23 / (1 + 五芒星比率)
    // const ZD11_ZX31 = ZA00_ZX23 / (1 + RA_00);
    // [a15_B00・A11_a14の交点]E11
    // [a16_B00・A12_a15の交点]E12
    // [a14_B00・A13_a16の交点]E13
    // [E11・E12・E13]を含む面]E
    // [Z軸・面Eの交点]E00
    // (54) A11_a14は△A11_A13_B00・△a14_a15_B00の交線
    // (55) a15_E11 = A12_A61
    // (56) (55)より B00_E11 = a15_B00 / 五芒星比率
    // (57) △a00_a15_B00 ∽ △E00_E11_B00
    // (58) (56)(57)より a00_D00 = a00_B00 / 五芒星比率
    const B00_E00 = a00_B00 / RA_00;
    const O00_E00 = B00_E00 - O00_B00;
    const O00_E11 = O00_A71;
    const E00_E11 = getLengthByPytha(O00_E11, O00_E00, null);
    // [A16_C12・B00_c13の交点]F11
    // [A14_C13・B00_c11の交点]F12
    // [A15_C11・B00_c12の交点]F13
    // [F11・F12・F13]を含む面]F
    // [Z軸・面Fの交点]F00
    // (59) B00_c13は△A16_C12_c13・△a15_a16_B00の交線
    // (60) C12_F11 = A12_A61
    // (61) (30)(60)より C12_F11 = A16_C12 / (1 + 五芒星比率)
    // (62) (61)より A00_F00 = A00_C00 / 五芒星比率
    const O00_C00 = getLengthByPytha(O00_A11, C00_C11, null);
    const A00_C00 = O00_C00 - O00_A00;
    const A00_F00 = A00_C00 / RA_00;
    const O00_F00 = O00_A00 + A00_F00;
    const O00_F11 = O00_A71;
    const F00_F11 = getLengthByPytha(O00_F11, O00_F00, null);
    // [a11_C11・A16_C12の交点]G11
    // [a12_C12・A14_C13の交点]G12
    // [a13_C13・A15_C11の交点]G13
    // [G11・G12・G13]を含む面]G
    // [Z軸・面Gの交点]G00
    // (63) a11_C11は△a11_A16_C12・△A15_C11_c12の交線
    // (64) A16_G11 = A12_A61
    // (65) (30)(64)より A16_G11 = A16_C12 / (1 + 五芒星比率)
    // (66) (65)より A00_G00 = A00_C00 / 五芒星比率
    const A00_G00 = A00_C00 / (1 + RA_00);
    const O00_G00 = O00_A00 + A00_G00;
    const O00_G11 = O00_A71;
    const G00_G11 = getLengthByPytha(O00_G11, O00_G00, null);
    // (67) ZC00_ZC11 // Zc12_ZC13
    // (68) ZC00_ZC13 // ZC11_Zc12
    // (69) (67)(68)より Zc12はZa12_ZC13・ZA13_ZC11の交点
    // (70) (69)より Za12_Zc12 = Za12_ZC13 / (1 + 五芒星比率)
    // (71) (65)(70)より ZG11はZc12_Zc13上の点
    // (72) (71)より △Za12_Zc12_ZG11 ∽ △ZC12_Zc13_ZG11
    // (73) (65)(72)より Zc12_ZG11 = Zc12_Zc13 / (1 + 五芒星比率)
    // (74) (73)より ZG11はZA00_Za12・Zc12_Zc13の交点
    // [A16_a13・C11_c12の交点]H11
    // [A14_a11・C12_c13の交点]H12
    // [A15_a12・C13_c11の交点]H13
    // [H11・H12・H13]を含む面]H
    // [Z軸・面Hの交点]H00
    // (75) A16_a13は△A16_C12_c13・△a13_C11_c12の交線
    // (76) C11_H11 = A12_A61
    // (77) (76)より ZH11はA00_Za12・ZC11_Zc12の交点
    // (78) (77)より ZH00_ZH11 = ZA00_Za12 / 五芒星比率
    const O00_H11 = O00_A71;
    const ZA00_Za12 = A00_A11;
    const H00_H11 = ZA00_Za12 / RA_00;
    // [A14_a12・A11_c11の交点]I11
    // [A15_a13・A12_c12の交点]I12
    // [A16_a11・A13_c13の交点]I13
    // [I11・I12・I13]を含む面]I
    // [Z軸・面Iの交点]I00
    // (75) A11_c11は△A11_A12_b00・△A14_a12_C13の交線
    // (76) A14_I11 = A12_A61

    // // [ZA15_Zc13・ZC12_Zc12の交点]X41
    // // [ZA15_Zc13・ZC13_Zc11の交点]X42
    // // [ZA11_Za11・ZC13_Zc11の交点]X43
    // // (77) ZC12_ZC00 // ZX42_ZX43 // ZA15_Za11
    // // (78) (77)より △Zc13_ZC00_ZX41 ∽ △Xc13_ZC13_ZX42
    // // (79) ZC13_Zc13 = Zc00_Zc13
    // // (80) (78)(79)より ZC13_ZX43 = ZX42_ZX43
    // // (81) (80)より Zc13_Zx43 = ZX42_ZX43
    // // (82) (80)(81)より ZA11_Za11 // ZA15_Zc13

    // // [ZA11_Za11・Za12_Za13]
    // // (83) ZA14_ZC11 // ZC00_ZC12
    // // (84) Za12_Zc13 // ZC00_Zc12
    // // (85) (83)(84)より ZC11・Zc13はZA14_Za12上の点
    // // (86) (77)(81)より ZA11_Za15 = Zc13_Zx43
    // // (87) ZA11_Za15 = ZA14_Zc13 / 五芒星比率
    // // (88) (86)(87)より ZA14_Zc13 = ZC11_Zx43
    // // (89) ZA14_Zc13 = Za12_ZC11

    // // [A14からのA00_A11への垂線・A00_A11との交点]X41
    // // [ZA11_Za11・ZA14_Za12の交点]ZX42
    // // [ZA11_Za11・Za12_Za13の交点]ZX43
    // // [ZA14_ZC12・Za12_Za13の交点]ZX44
    // // (77) △ZA14_ZX41_ZX42 ∽ △Za12_ZX43_ZX42 ∽ △Za12_ZX44_ZA14

    // [ZA00_ZA11・Za12・Za13の交点]X41
    // [ZA15_Zc13・Za12・Za13の交点]X42
    // [ZA1A_ZC12・Za12・Za13の交点]X43
    // (F01) (*) ZA00_ZA11 // ZA15_Zc13 // ZA12_Za13
    // (F02) (*) ZC12・Zc11はZA15_Za13上の点
    // (F03) (*) ZC12はZa16_Zc13上の点
    // (F04) (F02)(F03)より Za13_ZC12 = ZC12_Zc11 / 五芒星比率
    // (F05) (*) ZA15_Zc11 = Za13_ZC12
    // (F06) (*) ZA00_Zc13 // ZA15_Za13
    // (F07) (F04)(F05)(F06)より Za13_ZX43 = ZX42_ZX43 / (1 + 五芒星比率)
    // (F08) (F04)(F05)(F06)より ZX41_ZX42 = ZX42_ZX43 / 五芒星比率
    // (F09) (*) (F07)(F08)より Za13_ZX41 = ZX41_ZX42 + ZX42_ZX43 + Za13_ZX43
    //   = (ZX42_ZX43 / 五芒星比率) + ZX42_ZX43 + (ZX42_ZX43 / (1 + 五芒星比率))
    //   = ZX42_ZX43 * ((1 / 五芒星比率) + 1 + (1 / (1 + 五芒星比率)))
    //   = ZX42_ZX43 * ((1 / ((1 + √5) / 2)) + 1 + (1 / (1 + ((1 + √5) / 2))))
    //   = ZX42_ZX43 * ((2 / (1 + √5)) + 1 + (2 / (2 + (1 + √5))))
    //   = ZX42_ZX43 * ((2 / (1 + √5)) + 1 + (2 / (3 + √5)))
    //   = ZX42_ZX43 * ((2(1 - √5) / (1 + √5)(1 - √5)) + 1 + (2(3 - √5) / (3 + √5)(3 - √5)))
    //   = ZX42_ZX43 * (((2 - 2√5) / (1 - 5)) + 1 + ((6 - 2√5) / (9 - 5)))
    //   = ZX42_ZX43 * (((2 - 2√5) / -4) + 1 + ((6 - 2√5) / 4))
    //   = ZX42_ZX43 * (((2√5 - 2) + 4 + (6 - 2√5)) / 4)
    //   = ZX42_ZX43 * ((2√5 - 2 + 4 + 6 - 2√5) / 4)
    //   = ZX42_ZX43 * (8 / 4)
    //   = ZX42_ZX43 * 2
    //   ∴ Za13_ZX41 = ZX42_ZX43 * 2
    //   ∴ ZX41_ZX43 = ZX41_ZX42 + ZX42_ZX43
    //   = (ZX42_ZX43 / 五芒星比率) + ZX42_ZX43
    //   = ((Za13_ZX41 / 2) / 五芒星比率) + (Za13_ZX41 / 2)
    //   = (Za13_ZX41 / 2) * ((1 / 五芒星比率) + 1)
    //   = (Za13_ZX41 / 2) * ((1 / ((1 + √5) / 2)) + 1)
    //   = (Za13_ZX41 / 2) * ((2 / (1 + √5)) + 1)
    //   = Za13_ZX41 * ((1 / (1 + √5)) + (1 / 2))
    //   = Za13_ZX41 * (((1 - √5) / (1 + √5)(1 - √5)) + (1 / 2))
    //   = Za13_ZX41 * (((1 - √5) / (1 - 5)) + (1 / 2))
    //   = Za13_ZX41 * (((√5 - 1) / 4) + (1 / 2))
    //   = Za13_ZX41 * (((√5 - 1) / 4) + (2 / 4))
    //   = Za13_ZX41 * ((√5 - 1 + 2) / 4)
    //   = Za13_ZX41 * ((1 + √5) / 4)
    //   = Za13_ZX41 * (五芒星比率 / 2)
    const Za13_ZX41 = A12_A21;
    const Za12_ZX41 = Za13_ZX41;
    const ZX41_ZX43 = Za13_ZX41 * (RA_00 / 2);
    const Za12_ZX43 = Za12_ZX41 + ZX41_ZX43;
    // (F10) ZA14_Za12 = ZA15_Za13
    // (F11)六角形ZC11_Zc13_ZC12_Zc11_ZC13_Zc12は正六角形
    // (F12) (*) (F08)(F10)(F11)より ZA14_Za12 = C00_C11 * (五芒星比率 + (1 / 五芒星比率))
    const ZA14_Za12 = C00_C11 * (RA_00 + 1 / RA_00);
    const ZA14_ZX43 = getLengthByPytha(ZA14_Za12, Za12_ZX43, null);
    const X_ZI11 = Za12_ZX43 / RA_00 - Za12_ZX41;
    const ZA00_ZX41 = A00_A21;
    const Y_ZI11 = ZA00_ZX41 + ZA14_ZX43 / RA_00;
    const I00_I11 = getLengthByPytha(null, X_ZI11, Y_ZI11);
    const O00_I11 = O00_A61;

    // [A16_a13・a12_C12の交点]J11
    // [A14_a11・a13_C13の交点]J12
    // [A15_a12・a11_C11の交点]J13
    // // (75) A16_a13は△A16_C12_c13・△a13_C11_c12の交線
    // (G01) a12_C12は△a12_A14_C13・△A16_C12_c13の交線

    // 五芒星比率
    const RA_A01 = {
      A: 4 * Math.pow(Math.cos((Math.PI * 2) / 10), 2) - 2,
      B: 1,
      C: 4 * Math.pow(Math.cos((Math.PI * 2) / 10), 2) - 1,
      D: 4 * Math.pow(Math.cos((Math.PI * 2) / 10), 2),
    };

    // // [ZA11_Za16・Za11_ZA14の交点]ZY11
    // // [ZA12_Za15・Za11_ZA14の交点]ZY12
    // // [ZA12_Za15・ZC13_Zc13の交点]ZY13
    // // [Za12_ZA15・ZC13_Zc13の交点]ZY14
    // // [Za12_ZA15・Za11_ZA14の交点]ZY15
    // // [A11_A16の中点]A41
    // // [A12_A14の中点]A42
    // // [A13_A15の中点]A43
    // // (X01) Za16は円ZO00_ZA11の円周上の点
    // // (X02) (X01)より ∠ZA11_Za16_Za11 = 90°
    // // (X03) ZA11_Zc13 = Za16_ZC12
    // // (X04) ZA11_ZC12 = ZA11_Zc13 * (1 + 五芒星比率)
    // // (X05) (X03)(X04)より ZA11_Za16 = ZA11_Zc13 * (2 + 五芒星比率)
    // // (X06) △ZB00_ZY12_ZY13は正三角形
    // // (X07) ∠ZY13_ZY12_ZY14 = 90°
    // // (X08) (X06)(X07)より ZY12_ZY14 = ZY12_ZY13 * (正三角形比率 B / A)
    // // (X09) ZA11_Za16 // ZA12_Za15 // Za11_ZA16
    // // (X10) Za11_ZA14 // ZC13_Zc13
    // // (X11) (X09)(X10)より Zc13_ZY11 = ZY12_ZY13 = Za11_ZC13
    // // (X12) ZA11_Zc13 = Za11_ZC13
    // // (X13) (X11)(X12)より ZA11_Zc13 = ZY12_ZY13
    // // (X14) (X08)(X13)より ZY12_ZY14 = ZA11_Zc13 * (正三角形比率 B / A)
    // // (X15) ZA12_ZA15 = ZY12_ZY14
    // // (X16) Za11_Za16 = ZA12_ZA15 * 五芒星比率
    // // (X17) (X15)(X16)より Za11_Za16 = ZY12_ZY14 * 五芒星比率
    // // (X18) (X14)(X17)より Za11_Za16 = ZA11_Zc13 * (正三角形比率 B / A) * 五芒星比率
    // // (X19) (X05)(X18)より ZA11_Za16 : Za11_Za16 = (2 + 五芒星比率) : ((正三角形比率 B / A) * 五芒星比率)
    // // (X20) (X02)(X19)より ZA11_Za11 = √((Za11_Za16 * Za11_Za16) + (ZA11_Za16 * ZA11_Za16))
    const R_ZA11_Za16 = 2 + RA_00;
    const R_Za11_Za16 = (RA_01.B / RA_01.A) * RA_00;
    const R_ZA11_Za11_ = getLengthByPytha(null, R_ZA11_Za16, R_Za11_Za16);
    // const ZA11_Za11 = A00_A11 * 2;
    const ZA11_Za16 = ZA11_Za11 * (R_ZA11_Za16 / R_ZA11_Za11_);
    const ZA11_Zc13 = ZA11_Za11 * (1 / R_ZA11_Za11_);
    const Za11_Za16 = ZA11_Za11 * (R_Za11_Za16 / R_ZA11_Za11_);
    const a11_a41 = Za11_Za16 / 2;
    const Za13_ZA14 = ZA11_Zc13 / RA_00;
    const ZA11_Za15 = Za13_ZA14;
    // [A11_a15の中点]O11
    const O11_A11 = ZA11_Za15 / 2;
    // [四角形B00_c11_b00_C11を含む面]W
    // [B00_C11の中点]X21
    // [WX21_Wx21・WA11_WC12の交点]WX22
    // [WA11_Wc13・WA12_Wa15の交点]WX23
    // [Wa16_WC12・WA12_Wa15の交点]WX24
    // (X21) WO00_WA14 = WA11_WX23 / 五芒星比率
    // (X22) WA11_WC11 = WA11_Wa15 / 五芒星比率
    // (X23) (X22)より WX21_WX22 = WO00_WX22 / 五芒星比率
    // (X24) WA11_WX23 = WO00_WX22
    // (X25) (X21)(X23)(X24)より WO00_WA14 = WX21_WX22
    // (X26) WA11_WX22 = WA11_WX23
    // (X27) WC11_WX21 = WA11_WX22 / 五芒星比率
    // (X28) (X21)(X27)より WO00_WA14 = WC11_WX21
    // (X29) (X21)(X28)より WO00_WX21 = WC11_WX21 * (1 + 五芒星比率)
    const R_WC11_WX21 = 1;
    const R_WO00_WX21 = 1 + RA_00;
    const R_WO00_WC11 = getLengthByPytha(null, R_WC11_WX21, R_WO00_WX21);
    const C11_X21 = O00_A11 * (R_WC11_WX21 / R_WO00_WC11);

    const A12_A32 = a11_a41 / RA_00;
    // (X30) 五角形ZO00_ZC12_ZA12_ZA15_ZC13 ≡ 五角形ZO00_Zc12_Za14_Za11_Zc11
    // (X31) (X30)より 直線ZA12_Zc11 = 直線ZA12_ZC13
    // (X32) ZO00_ZC12 // ZA12_ZC13
    // (X33) (X31)(X32)より ∠ZC12_ZO00_Zc11 = ∠ZA12_Zc11_ZA32 = 60°
    // (X34) (X33)より ZA32_Zc11 = A12_A32 * (正三角形比率 A / B)
    const ZA32_Zc11 = A12_A32 * (RA_01.A / RA_01.B);
    const ZA32_Za41 = ZA32_Zc11 / RA_00;
    const ZA32_ZA41 = ZA11_Za16 + ZA32_Za41;
    // [a14_C12・B00_c11の交点]D11
    // (X35) ZA16_ZA41 // Za12_Za32
    // (X36) Za14_ZA16 // Za12_Zc12
    // (X37) (X35)(X36)より ∠Za14_ZA16_ZA41 = ∠Zc12_Za12_Za32
    // (X38) ZA16_ZA41 = Za12_Za32 * 五芒星比率
    // (X39) Za14_ZA16 = Za12_Zc12 * 五芒星比率
    // (X40) (X37)(X38)(X39)より △Za14_ZA16_ZA41 ∽ △Zc12_Za12_Za32
    // (X41) (X40)より Za14_ZA41 // Za32_Zc12
    // (X42) Za32_Zc12 // ZA32_ZC12
    // (X43) (X42)より Za14_ZA41 // ZA32_ZC12
    // (X44) (X43)より △Za14_ZA41_ZD11 ∽ △ZC12_ZA32_ZD11
    // (X45) (X39)(X40)(X44)より Za14_ZA16 = ZA32_ZC12 * 五芒星比率
    // (X46) (X44)(X45)より ZA41_ZD11 = ZA32_ZA41 / 五芒星比率
    const ZA41_ZD11 = ZA32_ZA41 / RA_00;
    const ZA41_ZB00 = ZA11_Za16 / 2;
    const ZD00_ZD11 = ZA41_ZD11 - ZA41_ZB00;
    // const O00_B00 = O00_A11;
    // (Z00) XB00_XC12 = XA14_XC11 / 五芒星比率
    // (Z01) XA14_XC11 = XA16_XC12
    // (Z02) (Z00)(Z01)より XA16_XB00 = XA16_XC12 * 五芒星比率
    // (Z03) XA16_XC12 = XA16_Xa12 / 五芒星比率
    // (X04) (Z02)(Z03)より XA16_XB00 = XA16_Xa12
    // (X05) (X04)より A00_a00 = A00_B00
    // const A00_a00 = O00_B00 * 2 / 3;
    // const O00_A00 = A00_a00 / 2;
    const ZO00_ZD11 = getLengthByPytha(null, ZD00_ZD11, O00_A00);

    const LX_D00 = getLengthByPytha(O00_A11, A12_A21, null);
    const LX_D01 = A12_A21 * 2;
    const LX_D02 = (LX_D01 * (RA_A01.A / RA_A01.D)) / 2;
    const LX_D03 = getLengthByPytha(null, LX_D00, LX_D02);

    const LX_F00 = a11_a41 - A12_A32;
    const LX_F01 = LX_F00 * (RA_A01.C / RA_A01.D);
    const LX_F02 = A12_A32 + LX_F01;
    const LX_F03 = getLengthByPytha(null, A12_A32, LX_F02);

    const LX_G00 = A00_b00 - O00_A11;
    const LX_G01 = getLengthByPytha(null, LX_D02, LX_G00);
    const LX_G02 = getLengthByPytha(null, A00_A21, LX_G01);
    const LX_G03 = getLengthByPytha(null, A00_A21, LX_D02);

    const LX_H00 = getLengthByPytha(null, LX_G03, LX_G00);

    const LX_I00 = (ZA11_Za16 * (RA_A01.A / RA_A01.D)) / 2;
    const LX_I01 = getLengthByPytha(null, a11_a41, LX_I00);
    const LX_I02 = LX_G00 * (RA_A01.A / RA_A01.D);
    const LX_I03 = getLengthByPytha(null, LX_I00, LX_I02);
    const LX_I04 = getLengthByPytha(null, a11_a41, LX_I03);

    const LX_J00 = A12_A32 * (RA_A01.C / RA_A01.D);

    const LT_A00 = this.alpha;
    const LT_C00 = (this.alpha * ZO00_ZD11) / O00_A11;
    const LT_D00 = (this.alpha * LX_D03) / O00_A11;
    const LT_F00 = (this.alpha * LX_F03) / O00_A11;
    const LT_G00 = (this.alpha * LX_G02) / O00_A11;
    const LT_H00 = (this.alpha * LX_H00) / O00_A11;
    const LT_I00 = (this.alpha * LX_I04) / O00_A11;

    const TX_A00 = Math.asin(A00_A11 / O00_A11);
    const TX_B00 = Math.asin(C11_X21 / O00_A11) * 2;
    const TX_C00 = Math.asin(ZD00_ZD11 / ZO00_ZD11) + Math.PI;
    const TX_D00 =
      Math.asin(A12_A21 / O00_A11) - Math.asin(LX_D02 / LX_D03) + Math.PI;
    const TX_E00 = Math.asin(A12_A21 / O00_A11) + Math.asin(LX_D02 / LX_D03);
    const TX_F00 =
      Math.asin(A12_A32 / LX_F03) - Math.asin(A12_A32 / O00_A11) + Math.PI;
    const TX_G00 = Math.asin(LX_G03 / LX_G02) + Math.PI;
    const TX_H00 = Math.asin(LX_G03 / LX_H00);
    const TX_I00 = Math.asin(LX_I01 / LX_I04) + Math.PI;
    const TX_J00 =
      Math.asin(ZD00_ZD11 / ZO00_ZD11) +
      Math.asin(LX_J00 / ZO00_ZD11) * 2 -
      Math.PI;
    const TX_Z00 = 0;

    const TY_A00 = 0;
    const TY_A10 = Math.asin(O11_A11 / A00_A11) * 2;
    const TY_B00 = Math.asin(a11_a41 / A00_A11);
    const TY_C00 = TY_B00 + Math.PI;
    const TY_D00 = TY_A00 + Math.PI;
    const TY_G00 = Math.asin(LX_D02 / LX_G03) + Math.PI;
    const TY_H00 = Math.asin(A12_A21 / A00_A11) - Math.asin(LX_D02 / LX_G03);
    const TY_I00 = Math.asin(O11_A11 / A00_A11) - Math.asin(LX_I00 / LX_I01);
    const TY_Z00 = 0;

    const reles_base = {
      O0: { R: 0, X: 0, Y: 0 },
      A0: { R: LT_A00, X: TX_A00, Y: TY_A00 },
      B0: { R: LT_A00, X: TX_B00, Y: TY_B00 },
      C0: { R: LT_C00, X: TX_C00, Y: TY_C00 },
      D0: { R: LT_D00, X: TX_D00, Y: TY_D00 },
      E0: { R: LT_D00, X: TX_E00, Y: TY_D00 },
      F0: { R: LT_F00, X: TX_F00, Y: TY_C00 },
      G0: { R: LT_G00, X: TX_G00, Y: TY_G00 },
      H0: { R: LT_H00, X: TX_H00, Y: TY_H00 },
      I0: { R: LT_I00, X: TX_I00, Y: TY_I00 },
      J0: { R: LT_C00, X: TX_J00, Y: TY_C00 },
      Z0: { R: LT_A00, X: TX_Z00, Y: TY_Z00 },
    };

    for (let i in reles_base) {
      for (let n = 0; n < 3; n++) {
        this.reles[i + n + "AO"] = {
          R: reles_base[i].R,
          X: reles_base[i].X,
          Y: reles_base[i].Y + ((Math.PI * 2) / 3) * n,
        };
        this.reles[i + n + "SO"] = {
          R: reles_base[i].R,
          X: reles_base[i].X,
          Y: reles_base[i].Y + ((Math.PI * 2) / 3) * n,
        };
        this.reles[i + n + "AR"] = {
          R: reles_base[i].R,
          X: reles_base[i].X,
          Y: reles_base[i].Y + ((Math.PI * 2) / 3) * n,
        };
        this.reles[i + n + "SR"] = {
          R: reles_base[i].R,
          X: reles_base[i].X,
          Y: reles_base[i].Y + ((Math.PI * 2) / 3) * n,
        };

        this.reles[i + n + "SO"].Y *= -1;
        this.reles[i + n + "SR"].Y *= -1;
        this.reles[i + n + "SO"].Y += TY_A10 + Math.PI;
        this.reles[i + n + "SR"].Y += TY_A10 + Math.PI;
        this.reles[i + n + "AR"].X += Math.PI;
        this.reles[i + n + "SR"].X += Math.PI;
      }
    }

    const TX_A11 = Math.asin(A00_A11 / O00_A11);
    const TX_A51 = Math.asin(A00_A51 / O00_A51);
    const TX_A61 = Math.asin(A00_A61 / O00_A61);
    const TX_A71 = Math.asin(A00_A71 / O00_A71);
    const TX_B00_ = 0;
    const TX_C11 = Math.asin(C00_C11 / O00_A11);
    const TX_D11 = Math.asin(D00_D11 / O00_D11);
    const TX_E11 = Math.asin(E00_E11 / O00_E11);
    const TX_F11 = Math.asin(F00_F11 / O00_F11);
    const TX_G11 = Math.asin(G00_G11 / O00_G11);
    const TX_H11 = Math.asin(H00_H11 / O00_H11);
    const TX_I11 = Math.asin(I00_I11 / O00_I11);

    const TY_A11 = 0;
    const TY_A14 = Math.asin(A11_A31 / A00_A11) * 2;
    const TY_A51 = Math.asin(A11_A31 / A00_A11);
    const TY_A61 = Math.PI - Math.asin(A21_A61 / A00_A61);
    const TY_A64 = Math.PI + Math.asin(A21_A61 / A00_A61);
    const TY_A71 = Math.asin(A71_X24 / A00_A71);
    const TY_B00_ = 0;
    const TY_C11 = Math.asin(C11_C21 / A00_A11) * -1;
    const TY_D11 = Math.asin(ZA00_ZX23 / A00_A11) * -2;
    const TY_G11 = Math.asin(A12_A21 / A00_A11) * -1;
    const TY_H11 = Math.asin(A12_A21 / A00_A11) * -1;
    const TY_I11 = Math.asin(X_ZI11 / I00_I11);

    const reles_base_2 = [
      { code: "A1", index: 1, R: O00_A11, X: TX_A11, Y: TY_A11 },
      { code: "A1", index: 4, R: O00_A11, X: TX_A11, Y: TY_A14 },
      { code: "A5", index: 1, R: O00_A51, X: TX_A51, Y: TY_A51 },
      { code: "A6", index: 1, R: O00_A61, X: TX_A61, Y: TY_A61 },
      { code: "A6", index: 4, R: O00_A61, X: TX_A61, Y: TY_A64 },
      { code: "A7", index: 1, R: O00_A71, X: TX_A71, Y: TY_A71 },
      { code: "B0", index: 0, R: O00_A11, X: TX_B00_, Y: TY_B00_ },
      { code: "C1", index: 1, R: O00_A11, X: TX_C11, Y: TY_C11 },
      { code: "D1", index: 1, R: O00_D11, X: TX_D11, Y: TY_D11 },
      { code: "E1", index: 1, R: O00_E11, X: TX_E11, Y: TY_D11 },
      { code: "F1", index: 1, R: O00_F11, X: TX_F11, Y: TY_A51 },
      { code: "G1", index: 1, R: O00_G11, X: TX_G11, Y: TY_G11 },
      { code: "H1", index: 1, R: O00_H11, X: TX_H11, Y: TY_H11 },
      { code: "I1", index: 1, R: O00_I11, X: TX_I11, Y: TY_I11 },
    ];

    reles_base_2.forEach((rel_base) => {
      for (let n = 0; n < 3; n++) {
        const rel_code = `${rel_base.code}${rel_base.index + n}`;
        const rel = {
          R: (rel_base.R / O00_A11) * this.alpha,
          X: rel_base.X,
          Y: rel_base.Y + ((Math.PI * 2) / 3) * n,
        };

        this.reles[rel_code] = { ...rel };
        this.reles[rel_code.toLowerCase()] = {
          ...rel,
          X: rel_base.X + Math.PI,
        };
      }
    });

    this.surfaces = {
      // A0_A: ['Z00AR', 'D00AO', 'C00AO', 'F00AO', 'D01AO'],
      // A1_A: ['Z00AR', 'D01AO', 'C01AO', 'F01AO', 'D02AO'],
      // A2_A: ['Z00AR', 'D02AO', 'C02AO', 'F02AO', 'D00AO'],
      // A0_S: ['Z00SO', 'D00SR', 'C00SR', 'F00SR', 'D01SR'],
      // A1_S: ['Z00SO', 'D01SR', 'C01SR', 'F01SR', 'D02SR'],
      // A2_S: ['Z00SO', 'D02SR', 'C02SR', 'F02SR', 'D00SR'],
      // B0_A: ['A00AO', 'H00AO', 'G00SR', 'C00SR', 'G01AR'],
      // B1_A: ['A01AO', 'H01AO', 'G02SR', 'C02SR', 'G02AR'],
      // B2_A: ['A02AO', 'H02AO', 'G01SR', 'C01SR', 'G00AR'],
      // B0_S: ['A00SR', 'H00SR', 'G00AO', 'C00AO', 'G01SO'],
      // B1_S: ['A01SR', 'H01SR', 'G02AO', 'C02AO', 'G02SO'],
      // B2_S: ['A02SR', 'H02SR', 'G01AO', 'C01AO', 'G00SO'],
      // C0_A: ['B00AO', 'G00SR', 'C00SR', 'D00SR', 'F02SR'],
      // C1_A: ['B01AO', 'G02SR', 'C02SR', 'D02SR', 'F01SR'],
      // C2_A: ['B02AO', 'G01SR', 'C01SR', 'D01SR', 'F00SR'],
      // C0_S: ['B00SR', 'G00AO', 'C00AO', 'D00AO', 'F02AO'],
      // C1_S: ['B01SR', 'G02AO', 'C02AO', 'D02AO', 'F01AO'],
      // C2_S: ['B02SR', 'G01AO', 'C01AO', 'D01AO', 'F00AO'],
      // D0_A: ['B00AO', 'E02AO', 'D02AR', 'C02AR', 'F02AR'],
      // D1_A: ['B01AO', 'E00AO', 'D00AR', 'C00AR', 'F00AR'],
      // D2_A: ['B02AO', 'E01AO', 'D01AR', 'C01AR', 'F01AR'],
      // D0_S: ['B00SR', 'E02SR', 'D02SO', 'C02SO', 'F02SO'],
      // D1_S: ['B01SR', 'E00SR', 'D00SO', 'C00SO', 'F00SO'],
      // D2_S: ['B02SR', 'E01SR', 'D01SO', 'C01SO', 'F01SO'],
      // E0_A: ['A00AO', 'G01AR', 'I00AR', 'J00SR', 'E00AR'],
      // E1_A: ['A01AO', 'G02AR', 'I01AR', 'J02SR', 'E01AR'],
      // E2_A: ['A02AO', 'G00AR', 'I02AR', 'J01SR', 'E02AR'],
      // E0_S: ['A00SR', 'G01SO', 'I00SO', 'J00AO', 'E00SO'],
      // E1_S: ['A01SR', 'G02SO', 'I01SO', 'J02AO', 'E01SO'],
      // E2_S: ['A02SR', 'G00SO', 'I02SO', 'J01AO', 'E02SO'],
      // E0_A: ['A00AR', 'I00SR', 'J00AR', 'E00SR', 'D00SO'],
      // E1_A: ['A01AR', 'I02SR', 'J01AR', 'E02SR', 'D02SO'],
      // E2_A: ['A02AR', 'I01SR', 'J02AR', 'E01SR', 'D01SO'],
      // E0_S: ['A00SO', 'I00AO', 'J00SO', 'E00AO', 'D00AR'],
      // D_Y01_E1_S: ['A01SO', 'I02AO', 'J01SO', 'E02AO', 'D02AR'],
      // E2_S: ['A02SO', 'I01AO', 'J02SO', 'E01AO', 'D01AR'],
      // F0_A: ['A00SO', 'I02AR', 'G00AR', 'C00AR', 'D00AR'],
      // F1_A: ['A01SO', 'I01AR', 'G02AR', 'C02AR', 'D02AR'],
      // F2_A: ['A02SO', 'I00AR', 'G01AR', 'C01AR', 'D01AR'],
      // F0_S: ['A00AR', 'I02SO', 'G00SO', 'C00SO', 'D00SO'],
      // F1_S: ['A01AR', 'I01SO', 'G02SO', 'C02SO', 'D02SO'],
      // F2_S: ['A02AR', 'I00SO', 'G01SO', 'C01SO', 'D01SO'],
      // G0_A: ['A00AO', 'G01AR', 'I00AR', 'J01AR', 'E00AR'],
      // G1_A: ['A01AO', 'G02AR', 'I01AR', 'J02AR', 'E01AR'],
      // G2_A: ['A02AO', 'G00AR', 'I02AR', 'J00AR', 'E02AR'],
      // G0_S: ['A00SR', 'G01SO', 'I00SO', 'J01SO', 'E00SO'],
      // G1_S: ['A01SR', 'G02SO', 'I01SO', 'J02SO', 'E01SO'],
      // G2_S: ['A02SR', 'G00SO', 'I02SO', 'J00SO', 'E02SO'],
      // H0_A: ['A00AO', 'H00AO', 'J00AO', 'E00SO', 'E00AR'],
      // H1_A: ['A01AO', 'H01AO', 'J01AO', 'E02SO', 'E01AR'],
      // H2_A: ['A02AO', 'H02AO', 'J02AO', 'E01SO', 'E02AR'],
      // H0_S: ['A00SR', 'H00SR', 'J00SR', 'E00AR', 'E00SO'],
      // H1_S: ['A01SR', 'H01SR', 'J01SR', 'E02AR', 'E01SO'],
      // H2_S: ['A02SR', 'H02SR', 'J02SR', 'E01AR', 'E02SO'],
      // I0_A: ['A00AR', 'I02SO', 'J00SO', 'I00AO', 'I00SR'],
      // I1_A: ['A02AR', 'I00SO', 'J01SO', 'I02AO', 'I01SR'],
      // I2_A: ['A01AR', 'I01SO', 'J02SO', 'I01AO', 'I02SR'],
      // I0_S: ['A00SO', 'I02AR', 'J00AR', 'I00SR', 'I00AO'],
      // I1_S: ['A02SO', 'I00AR', 'J01AR', 'I02SR', 'I01AO'],
      // I2_S: ['A01SO', 'I01AR', 'J02AR', 'I01SR', 'I02AO'],
      // J0_A: ['B02AO', 'E01AO', 'J02SO', 'H02SO', 'G01SR'],
      // J1_A: ['B00AO', 'E02AO', 'J01SO', 'H01SO', 'G00SR'],
      // J2_A: ['B01AO', 'E00AO', 'J00SO', 'H00SO', 'G02SR'],
      // J0_S: ['B02SR', 'E01SR', 'J02AR', 'H02AR', 'G01AO'],
      // J1_S: ['B00SR', 'E02SR', 'J01AR', 'H01AR', 'G00AO'],
      // J2_S: ['B01SR', 'E00SR', 'J00AR', 'H00AR', 'G02AO'],
      // D_X00_11A: ["Z00AO", "B00AO", "A00AO", "A02SO", "B02AO"],
      // D_X00_12A: ["Z00AO", "B01AO", "A01AO", "A01SO", "B00AO"],
      // D_X00_13A: ["Z00AO", "B02AO", "A02AO", "A00SO", "B01AO"],
      // D_X00_11R: ["Z00SR", "B00SR", "A00SR", "A02AR", "B02SR"],
      // D_X00_12R: ["Z00SR", "B01SR", "A01SR", "A01AR", "B00SR"],
      // D_X00_13R: ["Z00SR", "B02SR", "A02SR", "A00AR", "B01SR"],
      // D_X00_21A: ["B00AO", "A00AO", "A00SR", "A02AR", "A01SO"],
      // D_X00_22A: ["B01AO", "A01AO", "A02SR", "A00AR", "A00SO"],
      // D_X00_23A: ["B02AO", "A02AO", "A01SR", "A01AR", "A02SO"],
      // D_X00_21R: ["B00SR", "A00SR", "A00AO", "A02SO", "A01AR"],
      // D_X00_22R: ["B01SR", "A01SR", "A02AO", "A00SO", "A00AR"],
      // D_X00_23R: ["B02SR", "A02SR", "A01AO", "A01SO", "A02AR"],
      // D_X01_11A: ["A01SO", "B02AO", "B01AR"],
      // D_X01_12A: ["A02SO", "A02AR", "B01AO"],
      // D_Y03_12A: ["B02AO", "A02AR"],
      // D_Y03_13A: ["A01AR", "A01SO"],

      A11_A63_A51_A71_A65: ["A11", "A63", "A51", "A71", "A65"],
      A12_A61_A52_A72_A66: ["A12", "A61", "A52", "A72", "A66"],
      A13_A62_A53_A73_A64: ["A13", "A62", "A53", "A73", "A64"],
      A51_F11_D12_B00_D11: ["A51", "F11", "D12", "B00", "D11"],
      A52_F12_D13_B00_D12: ["A52", "F12", "D13", "B00", "D12"],
      A53_F13_D11_B00_D13: ["A53", "F13", "D11", "B00", "D13"],
      A51_A71_C11_F13_D11: ["A51", "A71", "C11", "F13", "D11"],
      A52_A72_C12_F11_D12: ["A52", "A72", "C12", "F11", "D12"],
      A53_A73_C13_F12_D13: ["A53", "A73", "C13", "F12", "D13"],
      A51_G12_H12_C12_F11: ["A51", "G12", "H12", "C12", "F11"],
      A52_G13_H13_C13_F12: ["A52", "G13", "H13", "C13", "F12"],
      A53_G11_H11_C11_F13: ["A53", "G11", "H11", "C11", "F13"],
      A51_G12_A14_I11_A63: ["A51", "G12", "A14", "I11", "A63"],
      A52_G13_A15_I12_A61: ["A52", "G13", "A15", "I12", "A61"],
      A53_G11_A16_I13_A62: ["A53", "G11", "A16", "I13", "A62"],
      // D_Y02_01: ["A16", "G11", "H11", "i12"],
      // D_Y04_01: ["A14", "a12", "C13"],
      // D_Y04_02: ["A16", "C12", "c13"],
      // D_Y03_01: ["a12", "C12"],
      // D_Y03_02: ["A16", "a13"],
      // D_Y04_01A: ["A16", "C12", "c13"],
      // D_Y04_02A: ["a12", "A14", "C13"],
      // D_Y04_03A: ["A16", "C12", "c13"],
      D_Y01_01: ["A14", "c11", "C13"],
      D_Y01_02: ["A14", "c11", "a13"],
      D_Y01_03: ["a11", "c11", "C13"],
      D_Y01_04: ["A14", "B00", "C13"],
      D_Y02_01: ["A15", "C11", "c12"],
      D_Y02_02: ["A15", "a11", "c12"],
      D_Y02_03: ["a12", "C11", "c12"],
      D_Y02_04: ["A15", "C11", "B00"],
      D_Y03_01: ["B00", "a11"],

      // D_Y04_01A: ["A61", "A62", "A63"],
      // D_Y04_01R: ["A64", "A65", "A66"],
      // D_Y04_02A: ["A71", "A72", "A73"],
      // D_Y04_03A: ["E11", "E12", "E13"],
      // D_Y04_04A: ["F11", "F12", "F13"],
      // D_Y04_05A: ["G11", "G12", "G13"],
      // D_Y04_06A: ["H11", "H12", "H13"],
      // D_Y04_07A: ["I11", "I12", "I13"],
      // D_Y04_07R: ["i11", "i12", "i13"],

      D_Y00_11A: ["A11", "A14", "C12", "B00", "C11"],
      D_Y00_12A: ["A12", "A15", "C13", "B00", "C12"],
      D_Y00_13A: ["A13", "A16", "C11", "B00", "C13"],
      D_Y00_11R: ["a11", "a14", "c12", "b00", "c11"],
      D_Y00_12R: ["a12", "a15", "c13", "b00", "c12"],
      D_Y00_13R: ["a13", "a16", "c11", "b00", "c13"],
      D_Y00_21A: ["A11", "A14", "a13", "c13", "a15"],
      D_Y00_22A: ["A12", "A15", "a11", "c11", "a16"],
      D_Y00_23A: ["A13", "A16", "a12", "c12", "a14"],
      D_Y00_21R: ["a11", "a14", "A13", "C13", "A15"],
      D_Y00_22R: ["a12", "a15", "A11", "C11", "A16"],
      D_Y00_23R: ["a13", "a16", "A12", "C12", "A14"],
    };

    this.debug_stroke_style = {
      X00: "rgba(255, 236, 236, 0.5)",
      X01: "rgba(216, 216, 255, 0.5)",
      Y00: "rgba(200, 255, 200, 0.5)",
      Y01: "rgba(184, 100, 224, 0.8)",
      Y02: "rgba(128, 156, 112, 0.8)",
      Y03: "rgba(184, 100, 224, 0.8)",
      Y04: "rgba(240, 200, 224, 0.5)",
    };

    this.debug_fill_style = {
      Y01: "rgba(200, 160, 216, 0.3)",
      Y02: "rgba(192, 208, 184, 0.3)",
    };
  };
}
