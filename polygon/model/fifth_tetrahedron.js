/**
 * 5つの正四面体
 *
 */
var FifthTetrahedron = function()
{
};


FifthTetrahedron.prototype = {
    // 外部設定値
    //fill_style:     'rgba(160, 255, 120, 0.8)',
    //stroke_style:   'rgb(112, 184, 64)',
    fill_style:     'rgba(160, 160, 224, 0.8)',
    //fill_style:     'rgba(0, 0, 0, 1.0)',
    stroke_style:   'rgba(64, 64, 176, 0.5)',
    fill_style2:    'rgba(120, 255, 160, 0.0)',
    stroke_style2:  'rgba(96, 192, 128, 0.5)',




    /**
     * 初期化
     *
     */
    configure: function()
    {
        var getLengthByPytha = this.basis.geometry_calculator.getLengthByPytha;

        var pai         = Math.PI;
        var theta072    = pai * 2 / 5;
        var theta036    = pai * 2 / 10;
        var sin072      = Math.sin(theta072);
        var cos072      = Math.cos(theta072);
        var sin036      = Math.sin(theta036);
        var cos036      = Math.cos(theta036);

        // 五芒星比率
        var RA00 = {
            A: (4 * Math.pow(cos036, 2)) - 2,
            B: 1,
            C: (4 * Math.pow(cos036, 2)) - 1,
            D: (4 * Math.pow(cos036, 2))
        };

        // 正三角形比率
        var RA01 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2
        };

        var LA00 = this.alpha;
        var LA01 = LA00 * (RA01.A / RA01.C);
        var LA02 = LA00 * (RA01.B / RA01.C);

        var XA00 = LA00 * (RA00.A / RA00.D) / 2;
        var XA01 = LA00 * (RA00.C / RA00.D);
        var XA02 = getLengthByPytha(null, LA02, XA00);
        var RX00 = {
            A: XA00,
            B: LA02,
            C: XA02
        };
        var XA03 = XA01 * (RX00.A / RX00.C);
        var RX01 = {
            A: XA03 * 2,
            B: XA02 - (XA03 * 2),
            C: XA02
        };
        var LB00 = (RX01.B / RX01.C) * (LA02 * (RA00.B / RA00.D));
        var LB01 = (RX01.B / RX01.C) * (LA01 * (1 + (RA00.C / RA00.D)));
        var LB02 = (RX01.B / RX01.C) * (LA02 * (RA00.C / RA00.D));
        var LB03 = (RX01.B / RX01.C) * (LA01 * (1 + (RA00.B / RA00.D)));
        var LB04 = (RX01.B / RX01.C) * LA02;
        var LB05 = (RX01.B / RX01.C) * XA00;

        var LC00 = LB04;
        var LC01 = LB05 + XA01;
        var LC02 = (XA01 * (RA01.B / RA01.C)) - LB00;
        var LC03 = (XA01 * (RA01.A / RA01.C)) + LB01;
        var LC04 = LB02 + (XA01 * (RA01.B / RA01.C));
        var LC05 = LB03 - (XA01 * (RA01.A / RA01.C));

        var LE00 = LA00 * (RA00.B / RA00.D);
        var LE01 = LE00 * (RA01.A / RA01.C);
        var LE02 = LE00 * (RA01.B / RA01.C);

        var RX02 = {
            A: 1,
            B: 2 * Math.pow(2, 1 / 2),
            C: 3
        };
        var XB00 = LA01 * (RX02.B / RX02.A);
        var LA03 = XB00 / 4;
        var LD00 = XB00 * 3 / 4;
        var LB06 = LA03 + ((XB00 / 2) * (RA00.C / RA00.D));
        var LE03 = (XB00 * (RA00.C / RA00.D)) - LA03;

        var LZ00 = LA02 * (RA00.C / RA00.D);
        var LZ01 = ((LA00 + LA01) * (RA00.B / RA00.D)) - LA01;
        var LZ02 = LA02 * ((2 * (RA00.C / RA00.D)) - 1);
        var LZ03 = LA01;
        var LZ04 = LA02 * (RA00.B / RA00.D);
        var LZ05 = ((LA00 + LA01) * (RA00.C / RA00.D)) - LA01;

        var LF00 = (1 / 2) * LZ00;
        var LF01 = (1 / 2) * LZ01;
        var LF02 = (1 / 2) * LZ02;
        var LF03 = (1 / 2) * LZ03;
        var LF04 = (1 / 2) * LZ04;
        var LF05 = (1 / 2) * LZ05;

        var LG00 = LB00 * (RA00.C / RA00.D);
        var LG01 = ((LB01 + LA00) * (RA00.C / RA00.D)) - LA00;
        var LG02 = ((LB02 + LA02) * (RA00.B / RA00.D)) - LB02;
        var LG03 = ((LB03 + LA01) * (RA00.C / RA00.D)) - LA01;
        var LG04 = ((LB04 + LA02) * (RA00.C / RA00.D)) - LA02;
        var LG05 = ((LB05 + LA01) * (RA00.B / RA00.D)) - LB05;
        var LG06 = ((LB06 - LA03) * (RA00.C / RA00.D)) + LA03;

        var LH00 = ((LC00 - LB02) * (RA00.B / RA00.D)) + LB02;
        var LH01 = ((LC01 + LB03) * (RA00.C / RA00.D)) - LC01;
        var LH02 = ((LC02 + LB04) * (RA00.C / RA00.D)) - LC02;
        var LH03 = ((LC03 - LB05) * (RA00.B / RA00.D)) + LB05;
        var LH04 = ((LC04 + LB00) * (RA00.B / RA00.D)) - LB00;
        var LH05 = ((LB01 - LC05) * (RA00.C / RA00.D)) + LC05;

        var LI00 = ((LB04 - LB00) * (RA00.B / RA00.D)) + LB00;
        var LI01 = ((LB01 - LB05) * (RA00.C / RA00.D)) + LB05;
        var LI02 = ((LB02 + LB00) * (RA00.C / RA00.D)) - LB00;
        var LI03 = ((LB01 - LB03) * (RA00.B / RA00.D)) + LB03;
        var LI04 = ((LB04 - LB02) * (RA00.C / RA00.D)) + LB02;
        var LI05 = ((LB03 + LB05) * (RA00.B / RA00.D)) - LB05;
        var LI06 = LB06 * ((2 * (RA00.C / RA00.D)) - 1);

        var LJ00 = ((LA02 + LB04) * (RA00.C / RA00.D)) - LB04;
        var LJ01 = ((LA01 + LB05) * (RA00.C / RA00.D)) - LB05;
        var LJ02 = LB00 * (RA00.B / RA00.D);
        var LJ03 = ((LA00 + LB01) * (RA00.C / RA00.D)) - LB01;
        var LJ04 = ((LA02 + LB02) * (RA00.C / RA00.D)) - LB02;
        var LJ05 = ((LA01 + LB03) * (RA00.C / RA00.D)) - LB03;
        var LJ06 = ((LB06 - LA03) * (RA00.B / RA00.D)) + LA03;

        var LK00 = ((LC04 + LC00) * (RA00.C / RA00.D)) - LC00;
        var LK01 = ((LC01 - LC05) * (RA00.B / RA00.D)) + LC05;
        var LK02 = ((LC00 - LC02) * (RA00.C / RA00.D)) + LC02;
        var LK03 = ((LC01 + LC03) * (RA00.C / RA00.D)) - LC03;
        var LK04 = ((LC04 + LC02) * (RA00.B / RA00.D)) - LC02;
        var LK05 = ((LC05 + LC03) * (RA00.C / RA00.D)) - LC05;

        var LL00 = ((LC04 + LC02) * (RA00.C / RA00.D)) - LC02;
        var LL01 = ((LC05 + LC03) * (RA00.B / RA00.D)) - LC05;
        var LL02 = ((LC00 + LC04) * (RA00.C / RA00.D)) - LC04;
        var LL03 = ((LC01 - LC05) * (RA00.C / RA00.D)) + LC05;
        var LL04 = ((LC00 - LC02) * (RA00.B / RA00.D)) + LC02;
        var LL05 = ((LC03 + LC01) * (RA00.C / RA00.D)) - LC01;

        var LM00 = ((LA02 - LC02) * (RA00.C / RA00.D)) + LC02;
        var LM01 = ((LA01 + LC03) * (RA00.C / RA00.D)) - LC03;
        var LM02 = LC04 * (RA00.B / RA00.D);
        var LM03 = ((LA00 + LC05) * (RA00.C / RA00.D)) - LC05;
        var LM04 = ((LA02 + LC00) * (RA00.C / RA00.D)) - LC00;
        var LM05 = ((LC01 - LA01) * (RA00.B / RA00.D)) + LA01;
        var LM06 = LA03 * ((2 * (RA00.C / RA00.D)) - 1);

        var LN00 = ((LA02 + LB02) * (RA00.C / RA00.D)) - LB02;
        var LN01 = ((LB03 - LA01) * (RA00.B / RA00.D)) + LA01;
        var LN02 = LB04 * (RA00.B / RA00.D);
        var LN03 = ((LA00 + LB05) * (RA00.C / RA00.D)) - LB05;
        var LN04 = ((LA02 - LB00) * (RA00.C / RA00.D)) + LB00;
        var LN05 = ((LA01 + LB01) * (RA00.C / RA00.D)) - LB01;
        var LN06 = ((LA03 + LB06) * (RA00.C / RA00.D)) - LB06;

        var LO00 = (1 / 2) * LE02;
        var LO01 = ((1 / 2) * (LA00 + LE01)) - LE01;
        var LO02 = ((1 / 2) * (LA02 + LE02)) - LE02;
        var LO03 = ((1 / 2) * (LA01 - LE01)) + LE01;
        var LO04 = (1 / 2) * LA02;
        var LO05 = ((1 / 2) * (LA01 + LE00)) - LE00;
        var LO06 = ((1 / 2) * (LA03 + LE03)) - LA03;

        var LP00 = ((1 / 2) * (LC00 - LI02)) + LI02;
        var LP01 = ((1 / 2) * (LC01 + LI03)) - LI03;
        var LP02 = ((1 / 2) * (LC02 + LI04)) - LC02;
        var LP03 = ((1 / 2) * (LC03 + LI05)) - LI05;
        var LP04 = ((1 / 2) * (LC04 + LI00)) - LI00;
        var LP05 = ((1 / 2) * (LI01 - LC05)) + LC05;
        var LP06 = ((1 / 2) * (LA03 + LI06)) - LI06;

        var MA00 = LA00 * (RA00.C / RA00.D);
        var MA01 = MA00 * (RA01.A / RA01.C);
        var MA02 = MA00 * (RA01.B / RA01.C);
        var MA03 = (XB00 * (RA00.B / RA00.D)) - LA03;

        var MB00 = LC04 * (RA00.C / RA00.D);
        var MB01 = LC05 * (RA00.C / RA00.D);
        var MB02 = LC00 * (RA00.C / RA00.D);
        var MB03 = LC01 * (RA00.C / RA00.D);
        var MB04 = LC02 * (RA00.C / RA00.D);
        var MB05 = LC03 * (RA00.C / RA00.D);





        var LQ00 = ((LB04 - LB00) * (RA00.C / RA00.D)) + LB00;
        var LQ01 = ((LB01 - LB05) * (RA00.B / RA00.D)) + LB05;
        var LQ02 = ((LB02 + LB00) * (RA00.B / RA00.D)) - LB00;
        var LQ03 = ((LB01 - LB03) * (RA00.C / RA00.D)) + LB03;
        var LQ04 = ((LB04 - LB02) * (RA00.B / RA00.D)) + LB02;
        var LQ05 = ((LB03 + LB05) * (RA00.C / RA00.D)) - LB05;
        var LQ06 = LB06 * ((2 * (RA00.C / RA00.D)) - 1);

        var LR00 = ((LC00 - LB02) * (RA00.C / RA00.D)) + LB02;
        var LR01 = ((LB03 + LC01) * (RA00.C / RA00.D)) - LB03;
        var LR02 = ((LB04 + LC02) * (RA00.B / RA00.D)) - LC02;
        var LR03 = ((LC03 - LB05) * (RA00.C / RA00.D)) + LB05;
        var LR04 = ((LB00 + LC04) * (RA00.C / RA00.D)) - LB00;
        var LR05 = ((LB01 - LC05) * (RA00.B / RA00.D)) + LC05;
        var LR06 = ((LB06 + LA03) * (RA00.B / RA00.D)) - LA03;

        var LS00 = LA02 * (RA00.B / RA00.D);
        var LS01 = ((LA00 + LA01) * (RA00.C / RA00.D)) - LA01;
        var LS02 = LA02 * ((2 * (RA00.C / RA00.D)) - 1);
        var LS03 = LA01;
        var LS04 = LA02 * (RA00.C / RA00.D);
        var LS05 = ((LA00 + LA01) * (RA00.B / RA00.D)) - LA01;

        var LT00 = ((LB00 + LC00) * (RA00.C / RA00.D)) - LB00;
        var LT01 = ((LB01 + LC01) * (RA00.C / RA00.D)) - LB01;
        var LT02 = ((LB02 + LC02) * (RA00.C / RA00.D)) - LB02;
        var LT03 = ((LB03 + LC03) * (RA00.C / RA00.D)) - LB03;
        var LT04 = ((LB04 + LC04) * (RA00.C / RA00.D)) - LB04;
        var LT05 = ((LC05 - LB05) * (RA00.C / RA00.D)) + LB05;
        var LT06 = ((LB06 - LA03) * (RA00.B / RA00.D)) + LA03;

        var LU00 = ((LA02 + LC00) * (RA00.C / RA00.D)) - LA02;
        var LU01 = ((LC01 - LA01) * (RA00.C / RA00.D)) + LA01;
        var LU02 = ((LA02 - LC02) * (RA00.B / RA00.D)) + LC02;
        var LU03 = ((LA01 + LC03) * (RA00.C / RA00.D)) - LA01;
        var LU04 = LC04 * (RA00.C / RA00.D);
        var LU05 = ((LA00 + LC05) * (RA00.B / RA00.D)) - LC05;
        var LU06 = LA03 * ((2 * (RA00.C / RA00.D)) - 1);

        var LV00 = ((LA02 + LB02) * (RA00.B / RA00.D)) - LB02;
        var LV01 = ((LB03 - LA01) * (RA00.C / RA00.D)) + LA01;
        var LV02 = LB04 * (RA00.C / RA00.D);
        var LV03 = ((LA00 + LB05) * (RA00.B / RA00.D)) - LB05;
        var LV04 = ((LA02 - LB00) * (RA00.B / RA00.D)) + LB00;
        var LV05 = ((LA01 + LB01) * (RA00.C / RA00.D)) - LA01;
        var LV06 = ((LA03 + LB06) * (RA00.C / RA00.D)) - LA03;

        var LW00 = ((LB04 + LC04) * (RA00.C / RA00.D)) - LC04;
        var LW01 = ((LC05 - LB05) * (RA00.B / RA00.D)) + LB05;
        var LW02 = ((LB00 + LC00) * (RA00.B / RA00.D)) - LB00;
        var LW03 = ((LB01 + LC01) * (RA00.C / RA00.D)) - LC01;
        var LW04 = ((LB02 + LC02) * (RA00.C / RA00.D)) - LC02;
        var LW05 = ((LB03 + LC03) * (RA00.B / RA00.D)) - LB03;

        var LX00 = (1 / 2) * LK00;
        var LX01 = (1 / 2) * LK01;
        var LX02 = (1 / 2) * LK02;
        var LX03 = (1 / 2) * LK03;
        var LX04 = (1 / 2) * LK04;
        var LX05 = (1 / 2) * LK05;

        var LY00 = LC04 * (RA00.B / RA00.D);
        var LY01 = LC05 * (RA00.B / RA00.D);
        var LY02 = LC00 * (RA00.B / RA00.D);
        var LY03 = LC01 * (RA00.B / RA00.D);
        var LY04 = LC02 * (RA00.B / RA00.D);
        var LY05 = LC03 * (RA00.B / RA00.D);

        this.reles.A00 = {X: 0,         Y: LA00 * -1,   Z: LA03};
        this.reles.A01 = {X: LA02,      Y: LA01,        Z: LA03};
        this.reles.A02 = {X: LA02 * -1, Y: LA01,        Z: LA03};
        this.reles.B00 = {X: LB00,      Y: LB01 * -1,   Z: LB06 * -1};
        this.reles.B01 = {X: LB02,      Y: LB03,        Z: LB06 * -1};
        this.reles.B02 = {X: LB04 * -1, Y: LB05,        Z: LB06 * -1};
        this.reles.C00 = {X: LC00,      Y: LC01 * -1,   Z: LA03};
        this.reles.C01 = {X: LC02,      Y: LC03,        Z: LA03};
        this.reles.C02 = {X: LC04 * -1, Y: LC05 * -1,   Z: LA03};
        this.reles.D00 = {X: 0,         Y: 0,           Z: LD00 * -1};
        this.reles.E00 = {X: 0,         Y: LE00 * -1,   Z: LE03 * -1};
        this.reles.E01 = {X: LE02,      Y: LE01,        Z: LE03 * -1};
        this.reles.E02 = {X: LE02 * -1, Y: LE01,        Z: LE03 * -1};
        this.reles.F00 = {X: LF00,      Y: LF01 * -1,   Z: LA03 * -1};
        this.reles.F01 = {X: LF02 * -1, Y: LF03,        Z: LA03 * -1};
        this.reles.F02 = {X: LF04 * -1, Y: LF05 * -1,   Z: LA03 * -1};
        this.reles.G00 = {X: LG00,      Y: LG01 * -1,   Z: LG06 * -1};
        this.reles.G01 = {X: LG02 * -1, Y: LG03,        Z: LG06 * -1};
        this.reles.G02 = {X: LG04 * -1, Y: LG05 * -1,   Z: LG06 * -1};
        this.reles.H00 = {X: LH00,      Y: LH01,        Z: LA03 * -1};
        this.reles.H01 = {X: LH02 * -1, Y: LH03,        Z: LA03 * -1};
        this.reles.H02 = {X: LH04 * -1, Y: LH05 * -1,   Z: LA03 * -1};
        this.reles.I00 = {X: LI00,      Y: LI01 * -1,   Z: LI06 * -1};
        this.reles.I01 = {X: LI02,      Y: LI03,        Z: LI06 * -1};
        this.reles.I02 = {X: LI04 * -1, Y: LI05 * -1,   Z: LI06 * -1};
        this.reles.J00 = {X: LJ00,      Y: LJ01 * -1,   Z: LJ06 * -1};
        this.reles.J01 = {X: LJ02,      Y: LJ03,        Z: LJ06 * -1};
        this.reles.J02 = {X: LJ04 * -1, Y: LJ05 * -1,   Z: LJ06 * -1};
        this.reles.K00 = {X: LK00,      Y: LK01,        Z: LA03 * -1};
        this.reles.K01 = {X: LK02 * -1, Y: LK03,        Z: LA03 * -1};
        this.reles.K02 = {X: LK04,      Y: LK05 * -1,   Z: LA03 * -1};
        this.reles.L00 = {X: LL00,      Y: LL01 * -1,   Z: LA03 * -1};
        this.reles.L01 = {X: LL02 * -1, Y: LL03,        Z: LA03 * -1};
        this.reles.L02 = {X: LL04 * -1, Y: LL05 * -1,   Z: LA03 * -1};
        this.reles.M00 = {X: LM00,      Y: LM01 * -1,   Z: LM06 * -1};
        this.reles.M01 = {X: LM02 * -1, Y: LM03,        Z: LM06 * -1};
        this.reles.M02 = {X: LM04 * -1, Y: LM05 * -1,   Z: LM06 * -1};
        this.reles.N00 = {X: LN00,      Y: LN01 * -1,   Z: LN06 * -1};
        this.reles.N01 = {X: LN02,      Y: LN03,        Z: LN06 * -1};
        this.reles.N02 = {X: LN04 * -1, Y: LN05 * -1,   Z: LN06 * -1};
        this.reles.O00 = {X: LO00,      Y: LO01 * -1,   Z: LO06 * -1};
        this.reles.O01 = {X: LO02,      Y: LO03,        Z: LO06 * -1};
        this.reles.O02 = {X: LO04 * -1, Y: LO05,        Z: LO06 * -1};
        this.reles.P00 = {X: LP00,      Y: LP01 * -1,   Z: LP06};
        this.reles.P01 = {X: LP02 * -1, Y: LP03,        Z: LP06};
        this.reles.P02 = {X: LP04 * -1, Y: LP05 * -1,   Z: LP06};
        this.reles.Q00 = {X: LQ00,      Y: LQ01 * -1,   Z: LQ06};
        this.reles.Q01 = {X: LQ02,      Y: LQ03,        Z: LQ06};
        this.reles.Q02 = {X: LQ04 * -1, Y: LQ05 * -1,   Z: LQ06};
        this.reles.R00 = {X: LR00,      Y: LR01 * -1,   Z: LR06 * -1};
        this.reles.R01 = {X: LR02 * -1, Y: LR03,        Z: LR06 * -1};
        this.reles.R02 = {X: LR04 * -1, Y: LR05 * -1,   Z: LR06 * -1};
        this.reles.MA0 = {X: 0,         Y: MA00 * -1,   Z: MA03 * -1};
        this.reles.MA1 = {X: MA02,      Y: MA01,        Z: MA03 * -1};
        this.reles.MA2 = {X: MA02 * -1, Y: MA01,        Z: MA03 * -1};
        this.reles.MB0 = {X: MB00,      Y: MB01,        Z: MA03};
        this.reles.MB1 = {X: MB02 * -1, Y: MB03,        Z: MA03};
        this.reles.MB2 = {X: MB04 * -1, Y: MB05 * -1,   Z: MA03};






        this.reles.S00 = {X: LS00,      Y: LS01 * -1,   Z: LA03};
        this.reles.S01 = {X: LS02,      Y: LS03,        Z: LA03};
        this.reles.S02 = {X: LS04 * -1, Y: LS05 * -1,   Z: LA03};
        this.reles.S03 = {X: LS00 * -1, Y: LS01 * -1,   Z: LA03};
        this.reles.S04 = {X: LS04,      Y: LS05 * -1,   Z: LA03};
        this.reles.S05 = {X: LS02 * -1, Y: LS03,        Z: LA03};
        this.reles.T00 = {X: LT00,      Y: LT01 * -1,   Z: LT06};
        this.reles.T01 = {X: LT02,      Y: LT03,        Z: LT06};
        this.reles.T02 = {X: LT04 * -1, Y: LT05 * -1,   Z: LT06};
        this.reles.U00 = {X: LU00,      Y: LU01 * -1,   Z: LU06};
        this.reles.U01 = {X: LU02,      Y: LU03,        Z: LU06};
        this.reles.U02 = {X: LU04 * -1, Y: LU05,        Z: LU06};
        this.reles.V00 = {X: LV00,      Y: LV01 * -1,   Z: LV06};
        this.reles.V01 = {X: LV02,      Y: LV03,        Z: LV06};
        this.reles.V02 = {X: LV04 * -1, Y: LV05,        Z: LV06};
        this.reles.W00 = {X: LW00,      Y: LW01 * -1,   Z: LG06};
        this.reles.W01 = {X: LW02,      Y: LW03,        Z: LG06};
        this.reles.W02 = {X: LW04 * -1, Y: LW05,        Z: LG06};
        this.reles.X00 = {X: LX00,      Y: LX01,        Z: LA03};
        this.reles.X01 = {X: LX02 * -1, Y: LX03,        Z: LA03};
        this.reles.X02 = {X: LX04,      Y: LX05 * -1,   Z: LA03};
        this.reles.Y00 = {X: LY00,      Y: LY01,        Z: LE03};
        this.reles.Y01 = {X: LY02 * -1, Y: LY03,        Z: LE03};
        this.reles.Y02 = {X: LY04 * -1, Y: LY05 * -1,   Z: LE03};

        var reles_rear = {};
        for (var i in this.reles) {
            reles_rear[i + 'R'] = {
                X: this.reles[i].X * -1,
                Y: this.reles[i].Y * -1,
                Z: this.reles[i].Z * -1
            };
        }
        for (var i in reles_rear) {
            this.reles[i] = reles_rear[i];
        }

        this.surfaces = {
            S00A:   [this.reles.D00,    this.reles.E00,     this.reles.G00,     this.reles.F00,     this.reles.E01],
            S01A:   [this.reles.D00,    this.reles.E01,     this.reles.G01,     this.reles.F01,     this.reles.E02],
            S02A:   [this.reles.D00,    this.reles.E02,     this.reles.G02,     this.reles.F02,     this.reles.E00],

            S03A:   [this.reles.E01,    this.reles.F00,     this.reles.H00,     this.reles.B01,     this.reles.G01],
            S04A:   [this.reles.E02,    this.reles.F01,     this.reles.H01,     this.reles.B02,     this.reles.G02],
            S05A:   [this.reles.E00,    this.reles.F02,     this.reles.H02,     this.reles.B00,     this.reles.G00],

            S06A:   [this.reles.B00,    this.reles.I00,     this.reles.J00,     this.reles.F00,     this.reles.G00],
            S07A:   [this.reles.B01,    this.reles.I01,     this.reles.J01,     this.reles.F01,     this.reles.G01],
            S08A:   [this.reles.B02,    this.reles.I02,     this.reles.J02,     this.reles.F02,     this.reles.G02],

            S09A:   [this.reles.C02R,   this.reles.K00,     this.reles.H00,     this.reles.F00,     this.reles.L00],
            S10A:   [this.reles.C00R,   this.reles.K01,     this.reles.H01,     this.reles.F01,     this.reles.L01],
            S11A:   [this.reles.C01R,   this.reles.K02,     this.reles.H02,     this.reles.F02,     this.reles.L02],

            S12A:   [this.reles.A02R,   this.reles.M00,     this.reles.L00,     this.reles.F00,     this.reles.J00],
            S13A:   [this.reles.A00R,   this.reles.M01,     this.reles.L01,     this.reles.F01,     this.reles.J01],
            S14A:   [this.reles.A01R,   this.reles.M02,     this.reles.L02,     this.reles.F02,     this.reles.J02],

            S15A:   [this.reles.A02R,   this.reles.J00,     this.reles.I00,     this.reles.O00,     this.reles.N00],
            S16A:   [this.reles.A00R,   this.reles.J01,     this.reles.I01,     this.reles.O01,     this.reles.N01],
            S17A:   [this.reles.A01R,   this.reles.J02,     this.reles.I02,     this.reles.O02,     this.reles.N02],

            S18A:   [this.reles.B00,    this.reles.I00,     this.reles.O00,     this.reles.K02,     this.reles.H02],
            S19A:   [this.reles.B01,    this.reles.I01,     this.reles.O01,     this.reles.K00,     this.reles.H00],
            S20A:   [this.reles.B02,    this.reles.I02,     this.reles.O02,     this.reles.K01,     this.reles.H01],

            S21A:   [this.reles.C00,    this.reles.R00,     this.reles.N00,     this.reles.O00,     this.reles.U00],
            S22A:   [this.reles.C01,    this.reles.R01,     this.reles.N01,     this.reles.O01,     this.reles.U01],
            S23A:   [this.reles.C02,    this.reles.R02,     this.reles.N02,     this.reles.O02,     this.reles.U02],

            S24A:   [this.reles.A00,    this.reles.S00,     this.reles.U00,     this.reles.O00,     this.reles.MA0],
            S25A:   [this.reles.A01,    this.reles.S01,     this.reles.U01,     this.reles.O01,     this.reles.MA1],
            S26A:   [this.reles.A02,    this.reles.S02,     this.reles.U02,     this.reles.O02,     this.reles.MA2],

            S27A:   [this.reles.A00,    this.reles.MA0,     this.reles.MB2,     this.reles.P02,     this.reles.S03],
            S28A:   [this.reles.A01,    this.reles.MA1,     this.reles.MB0,     this.reles.P00,     this.reles.S04],
            S29A:   [this.reles.A02,    this.reles.MA2,     this.reles.MB1,     this.reles.P01,     this.reles.S05],

            S30A:   [this.reles.C00R,   this.reles.MB1,     this.reles.MA2,     this.reles.O02,     this.reles.K01],
            S31A:   [this.reles.C01R,   this.reles.MB2,     this.reles.MA0,     this.reles.O00,     this.reles.K02],
            S32A:   [this.reles.C02R,   this.reles.MB0,     this.reles.MA1,     this.reles.O01,     this.reles.K00],

            S33A:   [this.reles.C00R,   this.reles.L01,     this.reles.M01,     this.reles.P01,     this.reles.MB1],
            S34A:   [this.reles.C01R,   this.reles.L02,     this.reles.M02,     this.reles.P02,     this.reles.MB2],
            S35A:   [this.reles.C02R,   this.reles.L00,     this.reles.M00,     this.reles.P00,     this.reles.MB0],

            S49A:   [this.reles.A02R,   this.reles.M00,     this.reles.P00,     this.reles.R00,     this.reles.N00],
            S50A:   [this.reles.A00R,   this.reles.M01,     this.reles.P01,     this.reles.R01,     this.reles.N01],
            S51A:   [this.reles.A01R,   this.reles.M02,     this.reles.P02,     this.reles.R02,     this.reles.N02],

            S52A:   [this.reles.B02R,   this.reles.V01,     this.reles.S04,     this.reles.P00,     this.reles.Q00],
            S53A:   [this.reles.B00R,   this.reles.V02,     this.reles.S05,     this.reles.P01,     this.reles.Q01],
            S54A:   [this.reles.B01R,   this.reles.V00,     this.reles.S03,     this.reles.P02,     this.reles.Q02],

            S55A:   [this.reles.B02R,   this.reles.W00,     this.reles.X02,     this.reles.T00,     this.reles.Q00],
            S56A:   [this.reles.B00R,   this.reles.W01,     this.reles.X00,     this.reles.T01,     this.reles.Q01],
            S57A:   [this.reles.B01R,   this.reles.W02,     this.reles.X01,     this.reles.T02,     this.reles.Q02],

            S58A:   [this.reles.C00,    this.reles.R00,     this.reles.P00,     this.reles.Q00,     this.reles.T00],
            S59A:   [this.reles.C01,    this.reles.R01,     this.reles.P01,     this.reles.Q01,     this.reles.T01],
            S60A:   [this.reles.C02,    this.reles.R02,     this.reles.P02,     this.reles.Q02,     this.reles.T02],

            S61A:   [this.reles.A00,    this.reles.S00,     this.reles.X02,     this.reles.V00,     this.reles.S03],
            S62A:   [this.reles.A01,    this.reles.S01,     this.reles.X00,     this.reles.V01,     this.reles.S04],
            S63A:   [this.reles.A02,    this.reles.S02,     this.reles.X01,     this.reles.V02,     this.reles.S05],

            S64A:   [this.reles.C00,    this.reles.T00,     this.reles.X02,     this.reles.S00,     this.reles.U00],
            S65A:   [this.reles.C01,    this.reles.T01,     this.reles.X00,     this.reles.S01,     this.reles.U01],
            S66A:   [this.reles.C02,    this.reles.T02,     this.reles.X01,     this.reles.S02,     this.reles.U02],

            S67A:   [this.reles.B01R,   this.reles.V00,     this.reles.X02,     this.reles.Y02,     this.reles.W02],
            S68A:   [this.reles.B02R,   this.reles.V01,     this.reles.X00,     this.reles.Y00,     this.reles.W00],
            S69A:   [this.reles.B00R,   this.reles.V02,     this.reles.X01,     this.reles.Y01,     this.reles.W01],

            S70A:   [this.reles.D00R,   this.reles.Y00,     this.reles.X00,     this.reles.W01,     this.reles.Y01],
            S71A:   [this.reles.D00R,   this.reles.Y01,     this.reles.X01,     this.reles.W02,     this.reles.Y02],
            S72A:   [this.reles.D00R,   this.reles.Y02,     this.reles.X02,     this.reles.W00,     this.reles.Y00],
        };

        this.surfaces2 = {
            T01A:   [this.reles.D00,    this.reles.B00,     this.reles.A02R,    this.reles.C02R,    this.reles.B01],
            T02A:   [this.reles.D00,    this.reles.B01,     this.reles.A00R,    this.reles.C00R,    this.reles.B02],
            T03A:   [this.reles.D00,    this.reles.B02,     this.reles.A01R,    this.reles.C01R,    this.reles.B00],
            T01R:   [this.reles.D00R,   this.reles.B00R,    this.reles.A02,     this.reles.C02,     this.reles.B01R],
            T02R:   [this.reles.D00R,   this.reles.B01R,    this.reles.A00,     this.reles.C00,     this.reles.B02R],
            T03R:   [this.reles.D00R,   this.reles.B02R,    this.reles.A01,     this.reles.C01,     this.reles.B00R],

            T04A:   [this.reles.B00,    this.reles.C01R,    this.reles.A00,     this.reles.C00,     this.reles.A02R],
            T05A:   [this.reles.B01,    this.reles.C02R,    this.reles.A01,     this.reles.C01,     this.reles.A00R],
            T06A:   [this.reles.B02,    this.reles.C00R,    this.reles.A02,     this.reles.C02,     this.reles.A01R],
            T04R:   [this.reles.B00R,   this.reles.C01,     this.reles.A00R,    this.reles.C00R,    this.reles.A02],
            T05R:   [this.reles.B01R,   this.reles.C02,     this.reles.A01R,    this.reles.C01R,    this.reles.A00],
            T06R:   [this.reles.B02R,   this.reles.C00,     this.reles.A02R,    this.reles.C02R,    this.reles.A01],
        };
    },
output: function(x, y, z)
{
    this.canvas_context.setTransform(1, 0, 0, 1, 0, 0);
    this.canvas_context.clearRect(0, 0, this.size, this.size);
    //this._output(this.surfaces2, this.fill_style2,   this.stroke_style2, x, y, z);
    this._output(this.surfaces,  this.fill_style,    this.stroke_style,  x, y, z);

    //this.lockOn('F02', x, y, z);
},
_output: function(surfaces, fill_style, stroke_style, theta_X, theta_Y, theta_Z)
{
    var sin_X = Math.sin(theta_X);
    var cos_X = Math.cos(theta_X);
    var sin_Y = Math.sin(theta_Y);
    var cos_Y = Math.cos(theta_Y);
    var sin_Z = Math.sin(theta_Z);
    var cos_Z = Math.cos(theta_Z);

    var coordinates =new Array();
    for (var i in surfaces) {
        var poses = new Array();
        var z_index = 0;

        for (var j = 0; j < surfaces[i].length; j ++) {
            var X0 = surfaces[i][j].X;
            var Y0 = surfaces[i][j].Y;
            var Z0 = surfaces[i][j].Z;
            var X1 = (X0 * cos_X) + (Z0 * sin_X);
            var Z1 = (Z0 * cos_X) - (X0 * sin_X);
            var X2 = (X1 * cos_Y) + (Y0 * sin_Y);
            var Y2 = (Y0 * cos_Y) - (X1 * sin_Y);
            var Y3 = (Y2 * cos_Z) - (Z1 * sin_Z);
            var Z3 = (Z1 * cos_Z) + (Y2 * sin_Z);
            var X = parseFloat(X2);
            var Y = parseFloat(Y3);
            var Z = parseFloat(Z3);

            poses.push({X: X, Y: Y, Z: Z});
            z_index += Z;
        }

        z_index = z_index / surfaces[i].length;
        coordinates.push({poses: poses, z_index: z_index});
    }

    coordinates.sort(function(A, B){return B.z_index - A.z_index;});

    for (var i = 0; i < coordinates.length; i ++) {
        this.canvas_context.beginPath();

        for (var j = 0; j < coordinates[i].poses.length; j ++) {
            var pos = coordinates[i].poses[j];
            if (j == 0) {
                this.canvas_context.moveTo(this._center + pos.X, this._center + pos.Y);
            } else {
                this.canvas_context.lineTo(this._center + pos.X, this._center + pos.Y);
            }
        }

        this.canvas_context.closePath();
        this.canvas_context.fillStyle     = fill_style;
        this.canvas_context.fill();
        this.canvas_context.strokeStyle   = stroke_style;
        this.canvas_context.stroke();
    }
}
};
