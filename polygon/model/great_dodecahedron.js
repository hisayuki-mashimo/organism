/**
 * 大十二面体
 */
class Great_Dodecahedron {
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
        // [Z軸に垂直な[多面体の頂点から構成される最大の正五角形]]A11_A12_A13_A14_A15
        // [五角形A11_A12_A13_A14_A15]を含む面]A
        // [Z軸・面Aの交点]A00
        const A00_A11 = 1;
        // [A12_A14・A13_A15の交点]A21
        // [A13_A15・A14_A11の交点]A22
        // [A14_A11・A15_A12の交点]A23
        // [A15_A12・A11_A13の交点]A24
        // [A11_A13・A12_A14の交点]A25
        // [A13_A14の中点]A31
        // [A12_A15の中点]A41
        const A00_A31 = A00_A11 * RA_02;
        const A11_A31 = A00_A11 + A00_A31;
        const A00_A13 = A00_A11;
        const A13_A31 = getLengthByPytha(A00_A13, A00_A31, null);
        const A12_A41 = A13_A31 * RA_00;
        // (01) A11_A12 // A15_A21
        // (02) A11_A15 // A12_A21
        // (03) (01)(02)より 四角形A11_A12_A21_A15は平行四辺形
        // (04) (03)より A11_A41 = A21_A41
        // (05) (03)より A12_A21 = A11_A15 = A13_A14
        const A12_A21 = A13_A31 * 2;
        const A21_A41 = getLengthByPytha(A12_A21, A12_A41, null);
        const A11_A41 = A21_A41;
        const A00_A41 = A00_A11 - A11_A41;
        const A00_A21 = (A21_A41 * 2) - A00_A11;
        const a00_B00 = getLengthByPytha(A11_A31, A00_A31, null);
        const A00_B00 = getLengthByPytha(A11_A41, A00_A41, null);
        const O00_A00 = (a00_B00 - A00_B00) / 2;
        const O00_A11 = getLengthByPytha(null, O00_A00, A00_A11);
        const O00_A21 = getLengthByPytha(null, O00_A00, A00_A21);


        // [a11_B00・A13_a15の交点]C11
        // [Z軸に垂直な[C11を含む面]]C
        // [面C・Z軸の交点]C00
        // (06) △a00_a11_B00 ∽ △C00_C11_B00
        // (07) B00_C11 = B00_a11 / 五芒星比率
        // (08) (06)(07)より B00_C00 = a00_B00 / 五芒星比率
        // (09) (06)(07)より C00_C11 = a00_a11 / 五芒星比率
        const B00_C00 = a00_B00 / RA_00;
        const O00_B00 = O00_A00;
        const O00_C00 = O00_B00 - B00_C00;
        const C00_C11 = A00_A11 / RA_00;


        const TX_O00 = 0;
        const TX_A10 = Math.asin(A00_A11 / O00_A11);
        const TX_A20 = Math.asin(A00_A21 / O00_A21);
        const TX_C10 = Math.asin(C00_C11 / O00_A21);

        const TY_A10 = 0;
        const TY_A20 = Math.PI;

        const reles_base = [
            { code: "A1", index: 1, R: O00_A11, X: TX_A10, Y: TY_A10 },
            { code: "A2", index: 1, R: O00_A21, X: TX_A20, Y: TY_A20 },
            { code: "B0", index: 0, R: O00_A11, X: TX_O00, Y: TY_A10 },
            { code: "C1", index: 1, R: O00_A21, X: TX_C10, Y: TY_A20 },
        ];

        reles_base.forEach((rel_base) => {
            for (let n = 0; n < 5; n++) {
                const rel_code = `${rel_base.code}${rel_base.index + n}`;
                const rel = {
                    R: rel_base.R / O00_A11 * this.alpha,
                    X: rel_base.X,
                    Y: rel_base.Y + (Math.PI * 2 / 5 * n),
                };

                this.reles[rel_code] = { ...rel };
                this.reles[rel_code.toLowerCase()] = { ...rel, X: rel_base.X + Math.PI };
            }
        });

        this.surfaces = {
            A11_A12_A24: ["A11", "A12", "A24"], A12_A13_A25: ["A12", "A13", "A25"], A13_A14_A21: ["A13", "A14", "A21"], A14_A15_A22: ["A14", "A15", "A22"], A15_A11_A23: ["A15", "A11", "A23"],
            a11_a12_a24: ["a11", "a12", "a24"], a12_a13_a25: ["a12", "a13", "a25"], a13_a14_a21: ["a13", "a14", "a21"], a14_a15_a22: ["a14", "a15", "a22"], a15_a11_a23: ["a15", "a11", "a23"],

            A11_A23_B00: ["A11", "A23", "B00"], A12_A24_B00: ["A12", "A24", "B00"], A13_A25_B00: ["A13", "A25", "B00"], A14_A21_B00: ["A14", "A21", "B00"], A15_A22_B00: ["A15", "A22", "B00"],
            A11_A24_B00: ["A11", "A24", "B00"], A12_A25_B00: ["A12", "A25", "B00"], A13_A21_B00: ["A13", "A21", "B00"], A14_A22_B00: ["A14", "A22", "B00"], A15_A23_B00: ["A15", "A23", "B00"],
            a11_A23_b00: ["a11", "a23", "b00"], a12_a24_b00: ["a12", "a24", "b00"], a13_a25_b00: ["a13", "a25", "b00"], a14_a21_b00: ["a14", "a21", "b00"], a15_a22_b00: ["a15", "a22", "b00"],
            a11_A24_b00: ["a11", "a24", "b00"], a12_a25_b00: ["a12", "a25", "b00"], a13_a21_b00: ["a13", "a21", "b00"], a14_a22_b00: ["a14", "a22", "b00"], a15_a23_b00: ["a15", "a23", "b00"],

            A11_A12_C14: ["A11", "A12", "C14"], A12_A13_C15: ["A12", "A13", "C15"], A13_A14_C11: ["A13", "A14", "C11"], A14_A15_C12: ["A14", "A15", "C12"], A15_A11_C13: ["A15", "A11", "C13"],
            a11_a12_c14: ["a11", "a12", "c14"], a12_a13_c15: ["a12", "a13", "c15"], a13_a14_c11: ["a13", "a14", "c11"], a14_a15_c12: ["a14", "a15", "c12"], a15_a11_c13: ["a15", "a11", "c13"],

            A11_a13_C13: ["A11", "a13", "C13"], A12_a14_C14: ["A12", "a14", "C14"], A13_a15_C15: ["A13", "a15", "C15"], A14_a11_C11: ["A14", "a11", "C11"], A15_a12_C12: ["A15", "a12", "C12"],
            A11_a14_C14: ["A11", "a14", "C14"], A12_a15_C15: ["A12", "a15", "C15"], A13_a11_C11: ["A13", "a11", "C11"], A14_a12_C12: ["A14", "a12", "C12"], A15_a13_C13: ["A15", "a13", "C13"],
            a11_A13_c13: ["a11", "A13", "c13"], a12_A14_c14: ["a12", "A14", "c14"], a13_A15_c15: ["a13", "A15", "c15"], a14_A11_c11: ["a14", "A11", "c11"], a15_A12_c12: ["a15", "A12", "c12"],
            a11_A14_c14: ["a11", "A14", "c14"], a12_A15_c15: ["a12", "A15", "c15"], a13_A11_c11: ["a13", "A11", "c11"], a14_A12_c12: ["a14", "A12", "c12"], a15_A13_c13: ["a15", "A13", "c13"],
        };
    }
}
