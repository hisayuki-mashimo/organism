/**
 * 大十二面体
 */
class Great_Dodecahedron_Shift {
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
            C: 2
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
        // [Z軸に垂直な[多面体の頂点から構成される最小の正三角形]]A11_A12_A13
        // [△A11_A12_A13]を含む面]A
        // [Z軸・面Aの交点]A00
        // [A11・a12・a13を含む正五角形]A11_B12_a12_a13_B13
        // [Z軸に垂直な[B12・B13を含む正三角形]]B1_B2_B3
        // [△B11_B12_B13を含む面]B
        // [Z軸・面Bの交点]B00
        // [五角形A11_B12_a12_a13_B13の重心]C11
        // [Z軸に垂直な[C11を含む面]]C
        // [Z軸・面Cの交点]C00
        const A11_C11 = 1;
        // [a12_a13の中点]a21
        const a21_C11 = A11_C11 * RA_02;
        const A11_a21 = A11_C11 + a21_C11;
        const a12_C11 = A11_C11;
        const a12_a21 = getLengthByPytha(a12_C11, a21_C11, null);
        const a00_a21 = a12_a21 * (RA_01.A / RA_01.B);
        const a00_a11 = a12_a21 * (RA_01.C / RA_01.B);
        const A00_A11 = a00_a11;
        const A00_a00 = getLengthByPytha(A11_a21, a00_a21, null);
        const O00_A00 = A00_a00 / 2;
        const O00_A11 = getLengthByPytha(null, O00_A00, A00_A11);
        // [A11_a21・B12_B13の交点]B21
        const B12_B21 = a12_a21 * RA_00;
        const B00_B12 = B12_B21 * (RA_01.C / RA_01.B);
        const B00_B11 = B00_B12;
        const B00_B21 = B12_B21 * (RA_01.A / RA_01.B);
        const A11_A12 = a12_a21 * 2;
        const A11_B21 = getLengthByPytha(A11_A12, B12_B21, null);
        const A00_B00 = A00_a00 * (A11_B21 / A11_a21);

        // [A11_B11・A12_B12の交点]C00
        // (01) 五角形A11_B12_b13_B11_A12は正五角形
        // (02) (01)より A11_C00 = A11_B11 / (1 + 五芒星比率)
        // (03) (02)より A00_C00 = A00_B00 / (1 + 五芒星比率)
        const A00_C00 = A00_B00 / (1 + RA_00);
        const O00_C00 = O00_A00 - A00_C00;

        // [A11_B11・A12_b12の交点]D11
        // [Z軸に垂直な[D11を含む面]]D
        // [Z軸・面Dの交点]D00
        // (04) (01)より A11_D11 = A11_B11 / 五芒星比率
        // (05) (04)より A00_D00 = A00_B00 / 五芒星比率
        const ZA11_ZB11 = A00_A11 + B00_B11;
        const ZA11_ZD11 = ZA11_ZB11 / RA_00;
        const D00_D11 = ZA11_ZD11 - A00_A11;
        const O00_B00 = getLengthByPytha(O00_A11, B00_B11, null);
        const A00_D00 = (O00_A00 + O00_B00) / RA_00;
        const O00_D00 = O00_A00 - A00_D00;

        // [A12_a13・B11_B13の交点]B31
        // [B21からのB00_B11への垂線・B00_B11との交点]B41
        // (06) 五角形A12_B11_a11_a13_B13は正五角形
        // (07) (06)より B11_B31 = B11_B13 / 五芒星比率
        // (08) (07)より B11_B41 = B11_B21 / 五芒星比率
        const B11_B21 = B00_B11 + B00_B21;
        const B11_B41 = B11_B21 / RA_00;
        const B00_B41 = B11_B41 - B00_B11;
        const B31_B41 = a12_a21;
        const B00_B31 = getLengthByPytha(null, B00_B41, B31_B41);

        const TX_A10 = Math.asin(A00_A11 / O00_A11);
        const TX_B10 = Math.asin(B00_B11 / O00_A11);
        const TX_B30 = Math.asin(B00_B31 / O00_C00);
        const TX_C00 = 0;
        const TX_D10 = Math.asin(D00_D11 / O00_C00);

        const TY_A10 = 0;
        const TY_B10 = Math.PI;
        const TY_B30 = Math.PI - Math.asin(B31_B41 / B00_B31);
        const TY_B33 = Math.PI + Math.asin(B31_B41 / B00_B31);

        const reles_base = [
            { code: "A1", index: 1, R: O00_A11, X: TX_A10, Y: TY_A10 },
            { code: "B1", index: 1, R: O00_A11, X: TX_B10, Y: TY_B10 },
            { code: "B3", index: 1, R: O00_C00, X: TX_B30, Y: TY_B30 },
            { code: "B3", index: 4, R: O00_C00, X: TX_B30, Y: TY_B33 },
            { code: "C0", index: 0, R: O00_C00, X: TX_C00, Y: TY_A10 },
            { code: "D1", index: 1, R: O00_C00, X: TX_D10, Y: TY_B10 },
        ];

        reles_base.forEach((rel_base) => {
            for (let n = 0; n < 3; n++) {
                const rel_code = `${rel_base.code}${rel_base.index + n}`;
                const rel = {
                    R: rel_base.R / O00_A11 * this.alpha,
                    X: rel_base.X,
                    Y: rel_base.Y + (Math.PI * 2 / 3 * n),
                };

                this.reles[rel_code] = { ...rel };
                this.reles[rel_code.toLowerCase()] = { ...rel, X: rel_base.X + Math.PI };
            }
        });

        this.surfaces = {
            A11_A12_C00: ["A11", "A12", "C00"], A12_A13_C00: ["A12", "A13", "C00"], A13_A11_C00: ["A13", "A11", "C00"],
            a11_a12_c00: ["a11", "a12", "c00"], a12_a13_c00: ["a12", "a13", "c00"], a13_a11_c00: ["a13", "a11", "c00"],

            A11_A12_D13: ["A11", "A12", "D13"], A12_A13_D11: ["A12", "A13", "D11"], A13_A11_D12: ["A13", "A11", "D12"],
            a11_a12_d13: ["a11", "a12", "d13"], a12_a13_d11: ["a12", "a13", "d11"], a13_a11_d12: ["a13", "a11", "d12"],

            A11_b11_B35: ["A11", "b11", "B35"], A12_b11_B36: ["A12", "b12", "B36"], A13_b11_B34: ["A13", "b13", "B34"],
            a11_B11_b35: ["a11", "B11", "b35"], a12_B11_b36: ["a12", "B12", "b36"], a13_B11_b34: ["a13", "B13", "b34"],

            A11_B13_D13: ["A11", "B13", "D13"], A12_B11_D11: ["A12", "B11", "D11"], A13_B12_D12: ["A13", "B12", "D12"],
            a11_b13_d13: ["a11", "b13", "d13"], a12_b11_d11: ["a12", "b11", "d11"], a13_b12_d12: ["a13", "b12", "d12"],

            A11_B12_D12: ["A11", "B12", "D12"], A12_B13_D13: ["A12", "B13", "D13"], A13_B11_D11: ["A13", "B11", "D11"],
            a11_b12_d12: ["a11", "b12", "d12"], a12_b13_d13: ["a12", "b13", "d13"], a13_b11_d11: ["a13", "b11", "d11"],

            A11_B12_B33: ["A11", "B12", "B33"], A12_B13_B31: ["A12", "B13", "B31"], A13_B11_B32: ["A13", "B11", "B32"],
            a11_b12_b33: ["a11", "b12", "b33"], a12_b13_b31: ["a12", "b13", "b31"], a13_b11_b32: ["a13", "b11", "b32"],

            A11_B33_b11: ["A11", "B33", "b11"], A12_B31_b12: ["A12", "B31", "b12"], A13_B32_b13: ["A13", "B32", "b13"],
            a11_b33_B11: ["a11", "b33", "B11"], a12_b31_B12: ["a12", "b31", "B12"], a13_b32_B13: ["a13", "b32", "B13"],

            B11_b13_B32: ["B11", "b13", "B32"], B12_b11_B33: ["B12", "b11", "B33"], B13_b12_B31: ["B13", "b12", "B31"],
            b11_B13_b32: ["b11", "B13", "b32"], b12_B11_b33: ["b12", "B11", "b33"], b13_B12_b31: ["b13", "B12", "b31"],

            A11_B13_B35: ["A11", "B13", "B35"], A12_B11_B36: ["A12", "B11", "B36"], A13_B12_B34: ["A13", "B12", "B34"],
            a11_b13_b35: ["a11", "b13", "b35"], a12_b11_b36: ["a12", "b11", "b36"], a13_b12_b34: ["a13", "b12", "b34"],

            B11_b13_b35: ["B11", "b13", "b35"], B12_b11_b36: ["B12", "b11", "b36"], B13_b12_b34: ["B13", "b12", "b34"],
            b11_B13_B35: ["b11", "B13", "B35"], b12_B11_B36: ["b12", "B11", "B36"], b13_B12_B34: ["b13", "B12", "B34"],
        };
    }
}
