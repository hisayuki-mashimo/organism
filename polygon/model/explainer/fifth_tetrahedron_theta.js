/**
 * 5つの正四面体
 *
 */
var Fifth_Tetrahedron_Theta_Explain = function()
{
};


Fifth_Tetrahedron_Theta_Explain.prototype = {
    /**
     * 初期化
     *
     */
    configure: function()
    {
        var getLengthByPytha        = this.basis.operator_basis.geometry_calculator.getLengthByPytha;
        var finalizeRatioByPytha    = this.basis.operator_basis.geometry_calculator.finalizeRatioByPytha;

        var pai         = Math.PI;
        var theta060    = pai / 3;
        var sin060      = Math.sin(theta060);
        var cos060      = Math.cos(theta060);
        var theta072    = pai * 2 / 5;
        var theta036    = pai * 2 / 10;
        var sin072      = Math.sin(theta072);
        var cos072      = Math.cos(theta072);
        var sin036      = Math.sin(theta036);
        var cos036      = Math.cos(theta036);

        // 正三角形比率
        var RA_A00 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2
        };

        // 五芒星比率
        var RA_A01 = {
            A: (4 * Math.pow(cos036, 2)) - 2,
            B: 1,
            C: (4 * Math.pow(cos036, 2)) - 1,
            D: (4 * Math.pow(cos036, 2))
        };

        var reles_aid = {};

        var LX_A00 = this.object_basis.alpha;
        var LX_A01 = LX_A00 * (RA_A00.B / RA_A00.C);
        var LX_A02 = LX_A00 * (RA_A00.A / RA_A00.C);
        var LX_A03 = LX_A00 + LX_A02;
        var LX_A04 = getLengthByPytha(LX_A03, LX_A02, null); // Oからの△ABCへの垂線
        var RA_X00 = {
            A: LX_A04,
            B: LX_A03
        };
        var LX_A05 = LX_A00 * (RA_X00.B / RA_X00.A);
        var RA_X01 = finalizeRatioByPytha({
            A: null,
            B: (RA_A01.D / RA_A01.B) + 1,
            C: (RA_A00.B / RA_A00.A) * (RA_A01.D / RA_A01.C)
        });
        var LX_A06 = LX_A00 * 2;
        var LX_A07 = LX_A06 * (RA_X01.B / RA_X01.A);
        var LX_A08 = LX_A07 * (RA_A01.B / (RA_A01.D + RA_A01.B));
        var LX_A09 = LX_A08 * (RA_A01.C / RA_A01.D) / 2;

        var LX_B00 = LX_A06 * (RA_X01.C / RA_X01.A) / 2;
        var RA_X02 = finalizeRatioByPytha({
            A: null,
            B: 2 + (RA_A01.B / RA_A01.C),
            C: 1
        });
        var LX_B03 = LX_A05 * (RA_X02.C / RA_X02.A);

        var LX_C00 = LX_B00 * (RA_A01.C / RA_A01.D);
        var LX_C01 = LX_C00 * (RA_A00.A / RA_A00.B);
        var LX_C02 = LX_C01 * (RA_A01.C / RA_A01.D);
        var LX_C03 = LX_A07 + LX_C02;
        var LX_C04 = LX_C03 * (RA_A01.C / RA_A01.D);
        var LX_C05 = LX_C04 - (LX_A07 / 2);
        var LX_C06 = LX_A05 * 2 / 3;
        var LX_C07 = LX_C06 / 2;
        var LX_C08 = getLengthByPytha(null, LX_C05, LX_C07);

        var LX_D00 = getLengthByPytha(LX_A05, LX_A01, null);
        var LX_D01 = LX_A01 * 2;
        var LX_D02 = LX_D01 * (RA_A01.A / RA_A01.D) / 2;
        var LX_D03 = getLengthByPytha(null, LX_D00, LX_D02);

        var LX_F00 = LX_B00 - LX_C00;
        var LX_F01 = LX_F00 * (RA_A01.C / RA_A01.D);
        var LX_F02 = LX_C00 + LX_F01;
        var LX_F03 = getLengthByPytha(null, LX_C00, LX_F02);

        var LX_G00 = LX_A04 - LX_A05;
        var LX_G01 = getLengthByPytha(null, LX_D02, LX_G00);
        var LX_G02 = getLengthByPytha(null, LX_A02, LX_G01);
        var LX_G03 = getLengthByPytha(null, LX_A02, LX_D02);

        var LX_H00 = getLengthByPytha(null, LX_G03, LX_G00);

        var LX_I00 = LX_A07 * (RA_A01.A / RA_A01.D) / 2;
        var LX_I01 = getLengthByPytha(null, LX_B00, LX_I00);
        var LX_I02 = LX_G00 * (RA_A01.A / RA_A01.D);
        var LX_I03 = getLengthByPytha(null, LX_I00, LX_I02);
        var LX_I04 = getLengthByPytha(null, LX_B00, LX_I03);

        var LX_J00 = LX_C00 * (RA_A01.C / RA_A01.D);

        var YX_A00 = getLengthByPytha(null, LX_A02, LX_G00);
        //var YX_A01 = getLengthByPytha(LX_A05, LX_A01, null);
        var YX_A01 = LX_G00;

        var TX_A00 = Math.atan(LX_A02 / LX_G00);
        var TX_X00 = Math.asin(LX_A00 / LX_A05) - pai;

        var TY_A00 = (pai * 2 / 3 * 0);
        var TY_A01 = (pai * 2 / 3 * 1);
        var TY_A02 = (pai * 2 / 3 * 2);
        var TY_A10 = (pai * 2 / 3 * 0) + pai;
        var TY_A11 = (pai * 2 / 3 * 1) + pai;
        var TY_A12 = (pai * 2 / 3 * 2) + pai;
        //var TY_A10 = Math.asin(LX_A09 / LX_A00) * 2;
        //var TY_B00 = Math.asin(LX_B00 / LX_A00);
        /*var LT_A00 = LX_A05;
        var LT_C00 = LX_C08;
        var LT_D00 = LX_D03;
        var LT_F00 = LX_F03;
        var LT_G00 = LX_G02;
        var LT_H00 = LX_H00;
        var LT_I00 = LX_I04;

        var TX_A00 = Math.asin(LX_A00 / LX_A05);
        var TX_A01 = Math.asin(LX_A00 / LX_A05) + pai;
        var TX_B00 = Math.asin(LX_B03 / LX_A05) * 2;
        var TX_C00 = Math.asin(LX_C05 / LX_C08) + pai;
        var TX_D00 = Math.asin(LX_A01 / LX_A05) - Math.asin(LX_D02 / LX_D03) + pai;
        var TX_E00 = Math.asin(LX_A01 / LX_A05) + Math.asin(LX_D02 / LX_D03);
        var TX_F00 = Math.asin(LX_C00 / LX_F03) - Math.asin(LX_C00 / LX_A05) + pai;
        var TX_G00 = Math.asin(LX_G03 / LX_G02) + pai;
        var TX_H00 = Math.asin(LX_G03 / LX_H00);
        var TX_I00 = Math.asin(LX_I01 / LX_I04) + pai;
        var TX_J00 = Math.asin(LX_C05 / LX_C08) + (Math.asin(LX_J00 / LX_C08) * 2) - pai;
        var TX_Z00 = 0;

        var TY_C00 = TY_B00 + pai;
        var TY_D00 = TY_A00 + pai;
        var TY_G00 = Math.asin(LX_D02 / LX_G03) + pai;
        var TY_H00 = Math.asin(LX_A01 / LX_A00) - Math.asin(LX_D02 / LX_G03);
        var TY_I00 = Math.asin(LX_A09 / LX_A00) - Math.asin(LX_I00 / LX_I01);
        var TY_Z00 = 0;

        /*var reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            B0: {R: LT_A00, X: TX_B00, Y: TY_B00},
            C0: {R: LT_C00, X: TX_C00, Y: TY_C00},
            D0: {R: LT_D00, X: TX_D00, Y: TY_D00},
            E0: {R: LT_D00, X: TX_E00, Y: TY_D00},
            F0: {R: LT_F00, X: TX_F00, Y: TY_C00},
            G0: {R: LT_G00, X: TX_G00, Y: TY_G00},
            H0: {R: LT_H00, X: TX_H00, Y: TY_H00},
            I0: {R: LT_I00, X: TX_I00, Y: TY_I00},
            J0: {R: LT_C00, X: TX_J00, Y: TY_C00},
            Z0: {R: LT_A00, X: TX_Z00, Y: TY_Z00}
        };*/

        reles_aid.X00 = {R: LX_G00, X: 0,      Y: TY_A00};
        reles_aid.X01 = {R: YX_A00, X: TX_A00, Y: TY_A10};
        reles_aid.X02 = {R: YX_A00, X: TX_A00, Y: TY_A11};
        reles_aid.X03 = {R: YX_A01, X: TX_X00, Y: TY_A00};

        for (var i in reles_aid) {
            this.object_basis.reles[i] = reles_aid[i];
        }
        
        
        this.proofs[0] = {
            lines:       [
                {code: 'A00', poses: ['A00AO', 'X00'], color: [255, 128, 128]},
                {code: 'A01', poses: ['A00AO', 'A01AO', 'A02AO'], color: [255, 128, 128]}
            ],
            theta:       {R: 0, V: 0, L: 0},
            texts:       [
                ['(A01) ', {T: 'lin', P: ['A00AO', 'X00'], C: [255, 128, 128]}, 'を定義'],
                ['(A02) ', {T: 'lin', P: ['A00AO', 'X00'], C: [255, 128, 128]}, 'を半径とする正三角形', {T: 'tre', P: ['A00AO', 'A01AO', 'A02AO'], C: [255, 128, 128]}, 'を定義']
            ]
        };
        this.proofs[1] = {
            lines:       [
                {code: 'A02', poses: ['X00', 'X01'],     color: [255, 128, 128]},
                {code: 'A03', poses: ['A00AO', 'A02AO'], color: [128, 128, 255]},
                {code: 'A04', poses: ['A01AO', 'A02AO'], color: [255,   0, 255]},
                {code: 'A05', poses: ['A01AO', 'X02'],   color: [128, 255, 128]}
            ],
            reset_lines: ['A01'],
            theta:       {R: 0, V: 0, L: 0},
            texts:       [
                ['(A03) ', {T: 'lin', P: ['A00AO', 'X00'], C: [255, 128, 128]}, 'と', {T: 'lin', P: ['A01AO', 'A02AO'], C: [255,   0, 255]}, 'の交点をX01とする。'],
                ['(A04) ', {T: 'lin', P: ['A01AO', 'X00'], C: [128, 255, 128]}, 'と', {T: 'lin', P: ['A00AO', 'A02AO'], C: [128, 128, 255]}, 'の交点をX02とする。'],
                ['(A05) ∴(A02)(A03) ', {T: 'lin', P: ['A00AO', 'X01'], C: [255, 128, 128]}, '⊥', {T: 'lin', P: ['A01AO', 'A02AO'], C: [255,   0, 255]}],
                ['(A06) ∴(A02)(A04) ', {T: 'lin', P: ['A01AO', 'X02'], C: [128, 255, 128]}, '⊥', {T: 'lin', P: ['A00AO', 'A02AO'], C: [128, 128, 255]}],
                ['(A07) ∴(A02)(A05) 直角三角形の合同条件により、', {T: 'tre', P: ['A00AO', 'A01AO', 'X01'], C: [160, 160, 160]}, '≡', {T: 'tre', P: ['A00AO', 'A02AO', 'X01'], C: [160, 160, 160]}],
                ['(A08) ∴(A02)(A06) 直角三角形の合同条件により、', {T: 'tre', P: ['A01AO', 'A02AO', 'X02'], C: [160, 160, 160]}, '≡', {T: 'tre', P: ['A01AO', 'A00AO', 'X02'], C: [160, 160, 160]}],
                ['(A09) ∴(A07) ', {T: 'lin', P: ['A01AO', 'X01'], C: [255,   0, 255]}, '=', {T: 'lin', P: ['A02AO', 'X01'], C: [255,   0, 255]}],
                ['(A10) ∴(A08) ', {T: 'lin', P: ['A00AO', 'X02'], C: [128, 128, 255]}, '=', {T: 'lin', P: ['A02AO', 'X02'], C: [128, 128, 255]}],
                ['(A11) ∴(A02)(A09) ', {T: 'lin', P: ['A02AO', 'X01'], C: [255, 0, 255]}, '=', {T: 'lin', P: ['A00AO', 'A02AO'], C: [128, 128, 255]}, '× 1 / 2'],
                ['(A12) ∴(A05)(A11) 三平方の定理により、', {T: 'lin', P: ['A00AO', 'X01'], C: [255, 128, 128]}, '=', {T: 'lin', P: ['A00AO', 'A02AO'], C: [128, 128, 255]}, '× √(3) / 2'],
                ['(A13) ∴(A11)(A12) ', '比率定義[RA00]: {A:', {T: 'lin', P: ['A02AO', 'X01'], C: [255,   0, 255]}, ', B:', {T: 'lin', P: ['A00AO', 'X01'], C: [255, 128, 128]}, ', C:', {T: 'lin', P: ['A00AO', 'A02AO'], C: [128, 128, 255]}],
                ['(A14) ', {T: 'cor', P: ['A02AO', 'A00AO', 'X01'], C: [160, 160, 160]}, '=', {T: 'cor', P: ['X00', 'A00AO', 'X02'], C: [160, 160, 160]}],
                ['(A15) ∴(A05)(A06)(A14) 三角形の相似条件により、', {T: 'tre', P: ['A00AO', 'A02AO', 'X01'], C: [160, 160, 160]}, '∽', {T: 'tre', P: ['A00AO', 'X00', 'X02'], C: [160, 160, 160]}],
                ['(A16) ∴(A13)(A15) ', {T: 'lin', P: ['A00AO', 'X02'], C: [128, 128, 255]}, '=', {T: 'lin', P: ['A00AO', 'X00'], C: [255, 128, 128]}, '×([RA00.B] / [RA00.C])'],
                ['(A17) ∴(A13)(A15) ', {T: 'lin', P: ['X00',   'X02'], C: [128, 255, 128]}, '=', {T: 'lin', P: ['A00AO', 'X00'], C: [255, 128, 128]}, '×([RA00.A] / [RA00.C])']
            ]
        };
        this.proofs[2] = {
            lines:       [
                {code: 'A06', poses: ['X00',   'O'],     color: [128, 128, 255]},
                {code: 'A07', poses: ['O',     'Z00AR'], color: [128, 128, 255]},
                {code: 'A08', poses: ['X01',   'Z00AR'], color: [255, 128, 128]},
                {code: 'A09', poses: ['A00AO', 'X03'],   color: [128, 255, 128]},
                {code: 'A10', poses: ['A00AO', 'X01'],   color: [255, 128, 128]}
            ],
            reset_lines: ['A00', 'A01', 'A02', 'A03', 'A05'],
            //theta:       {X: pai / 2, Y: 0, Z: 0},
            theta:       {R: 0, V: 0, L: 0},
            texts:       [
                ['(B01) ', {T: 'tre', P: ['Z00AO', 'A01AO', 'A02AO'], C: [255, 128, 128]}, 'の中心点X03を定義'],
                ['(B02) ', {T: 'lin', P: ['A00AO', 'X03'], C: [128, 255, 128]}, 'と', {T: 'lin', P: ['Z00AO', 'X00'], C: [128, 128, 255]}, 'の交点をOとする。'],
                ['(B03) ', {T: 'tre', P: ['A00AO', 'A01AO', 'A02AO'], C: [160, 160, 160]}, '≡', {T: 'tre', P: ['Z00AO', 'A01AO', 'A02AO'], C: [160, 160, 160]}],
                ['(B04) ∴(B03) ', {T: 'tre', P: ['A00AO', 'A01AO', 'A02AO'], C: [160, 160, 160]}, '≡', {T: 'tre', P: ['Z00AO', 'A01AO', 'A02AO'], C: [160, 160, 160]}],
            ]
        };

        /*
        var LX_A00 = this.object_basis.alpha;
        var LX_A01 = LX_A00 * (RA_A00.B / RA_A00.C);
        var LX_A02 = LX_A00 * (RA_A00.A / RA_A00.C);
        var LX_A03 = LX_A00 + LX_A02;
        var LX_A04 = this.getLengthByPytha(LX_A03, LX_A02, null); // Oからの△ABCへの垂線
        var RA_X00 = {
            A: LX_A04,
            B: LX_A03
        };
        var LX_A05 = LX_A00 * (RA_X00.B / RA_X00.A);
        var RA_X01 = finalizeRatioByPytha({
            A: null,
            B: (RA_A01.D / RA_A01.B) + 1,
            C: (RA_A00.B / RA_A00.A) * (RA_A01.D / RA_A01.C)
        });
        var LX_A06 = LX_A00 * 2;
        var LX_A07 = LX_A06 * (RA_X01.B / RA_X01.A);
        var LX_A08 = LX_A07 * (RA_A01.B / (RA_A01.D + RA_A01.B));
        var LX_A09 = LX_A08 * (RA_A01.C / RA_A01.D) / 2;
        */




        /*

        var reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            B0: {R: LT_A00, X: TX_B00, Y: TY_B00},
            C0: {R: LT_C00, X: TX_C00, Y: TY_C00},
            D0: {R: LT_D00, X: TX_D00, Y: TY_D00},
            E0: {R: LT_D00, X: TX_E00, Y: TY_D00},
            F0: {R: LT_F00, X: TX_F00, Y: TY_C00},
            G0: {R: LT_G00, X: TX_G00, Y: TY_G00},
            H0: {R: LT_H00, X: TX_H00, Y: TY_H00},
            I0: {R: LT_I00, X: TX_I00, Y: TY_I00},
            J0: {R: LT_C00, X: TX_J00, Y: TY_C00},
            Z0: {R: LT_A00, X: TX_Z00, Y: TY_Z00}
        };*/
    }
};
