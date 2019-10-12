/**
 * 10個の正四面体
 *
 */
var TenTetrahedronShift = function()
{
};


TenTetrahedronShift.prototype = {
    // 外部設定値
    //fill_style:     'rgba(160, 255, 120, 0.8)',
    //stroke_style:   'rgb(112, 184, 64)',
    fill_style:     'rgba(224, 128, 176, 0.8)',
    //fill_style:     'rgba(0, 0, 0, 1.0)',
    stroke_style:   'rgba(160, 64, 88, 0.5)',
    fill_style3:    'rgba(224, 160, 160, 0.8)',
    stroke_style3:  'rgba(176, 64, 64, 0.5)',
    fill_style2:    'rgba(120, 255, 160, 0.0)',
    stroke_style2:  'rgba(96, 192, 128, 0.2)',




    /**
     * 初期化
     *
     */
    configure: function()
    {
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

        var XA00 = this.alpha;

        var RX00 = (RA01.A / RA01.B) + ((RA01.C / RA01.B) * (RA00.C / RA00.B));
        var XA01 = XA00 / Math.pow((1 + Math.pow(RX00, 2)), 1 / 2);
        var LA0Y = XA01 / sin036;
        var LA1X = LA0Y * sin072;
        var LA1Y = LA0Y * cos072;
        var LA2X = XA01;
        var LA2Y = LA0Y * cos036;

        var RX01 = {
            A: LA2X,
            B: LA1X,
            C: LA1Y + LA2Y
        };
        var LA0Z = LA2Y * (RX01.B / RX01.A);

        var LB0Y = LA0Y * (RA00.C / RA00.B);
        var LB1X = LB0Y * sin072;
        var LB1Y = LB0Y * cos072;
        var LB2X = LB0Y * sin036;
        var LB2Y = LB0Y * cos036;
        var LB0Z = LA2X * (RX01.A / RX01.C);

        var LC00 = (LA1Y * 2) * (RA00.C / RA00.D);
        var LC01 = LC00 * sin072;
        var LC02 = LC00 * cos072;
        var LC03 = LC00 * sin036;
        var LC04 = LC00 * cos036;
        var LC05 = ((LA0Z - LB0Z) * (RA00.C / RA00.D)) + LB0Z;

        var LD00 = LB1X * (RA00.B / RA00.D);
        var LD01 = ((LA0Y + LB1Y) * (RA00.C / RA00.D)) - LB1Y;
        var LD02 = LA1X * (RA00.C / RA00.D);
        var LD03 = ((LA1Y + LB0Y) * (RA00.B / RA00.D)) - LA1Y;
        var LD04 = ((LA2X + LB1X) * (RA00.B / RA00.D)) - LA2X;
        var LD05 = ((LA2Y - LB1Y) * (RA00.C / RA00.D)) + LB1Y;
        var LD06 = ((LB2X - LA2X) * (RA00.B / RA00.D)) + LA2X;
        var LD07 = 0;//((LA2Y + LB2Y) * (RA00.B / RA00.D)) - LA2Y;
        var LD08 = ((LA1X + LB2X) * (RA00.C / RA00.D)) - LB2X;
        var LD09 = ((LB2Y - LA1Y) * (RA00.B / RA00.D)) + LA1Y;
        var LD10 = ((LA0Z + LB0Z) * (RA00.C / RA00.D)) - LB0Z;

        var LE00 = LA2X * (RA00.B / RA00.D);
        var LE01 = (LA0Y - LA2Y) * (RA00.C / RA00.D) + LA2Y;
        var LE02 = (LA1X - LA2X) * (RA00.C / RA00.D) + LA2X;
        var LE03 = (LA2Y - LA1Y) * (RA00.B / RA00.D) + LA1Y;
        var LE04 = (LA1X - LA2X) * (RA00.B / RA00.D) + LA2X;
        var LE05 = (LA2Y - LA1Y) * (RA00.C / RA00.D) + LA1Y;
        var LE06 = LA2X * (RA00.C / RA00.D);
        var LE07 = (LA0Y - LA2Y) * (RA00.B / RA00.D) + LA2Y;
        var LE08 = LA1X;
        var LE09 = LA1Y * ((2 * (RA00.C / RA00.D)) - 1);
        var LE10 = LA0Z * ((2 * (RA00.C / RA00.D)) - 1);

        var LF00 = LA0Y * (RA00.C / RA00.D);
        var LF01 = LF00 * sin072;
        var LF02 = LF00 * cos072;
        var LF03 = LF00 * sin036;
        var LF04 = LF00 * cos036;

        var LG00 = LB0Z * ((2 * (RA00.C / RA00.D)) - 1);
        var LO00 = ((LA0Z - LG00) / 2) + LG00;
        var LF05 = ((LO00 - LG00) * (RA00.B / RA00.D)) + LG00;

        var LH00 = LA2X * (RA00.B / RA00.D);
        var LH01 = ((LA2Y + LB0Y) * (RA00.C / RA00.D)) - LA2Y;
        var LH02 = ((LA2X + LB1X) * (RA00.C / RA00.D)) - LA2X;
        var LH03 = 0;//((LA2Y + LB1Y) * (RA00.C / RA00.D)) - LA2Y;
        var LH04 = ((LA1X + LB2X) * (RA00.C / RA00.D)) - LA1X;
        var LH05 = ((LA1Y + LB2Y) * (RA00.C / RA00.D)) - LA1Y;
        var LH06 = LB2X * (RA00.C / RA00.D);
        var LH07 = ((LA0Y + LB2Y) * (RA00.C / RA00.D)) - LA0Y;
        var LH08 = ((LA1X + LB1X) * (RA00.C / RA00.D)) - LA1X;
        var LH09 = ((LB1Y - LA1Y) * (RA00.C / RA00.D)) + LA1Y;
        var LH10 = ((LA0Z - LB0Z) * (RA00.B / RA00.D)) + LB0Z;

        var LI00 = LA1X * (RA00.B / RA00.D);
        var LI01 = ((LA1Y + LB0Y) * (RA00.C / RA00.D)) - LA1Y;
        var LI02 = LB1X * (RA00.C / RA00.D);
        var LI03 = ((LA0Y + LB1Y) * (RA00.B / RA00.D)) - LB1Y;
        var LI04 = ((LA1X + LB2X) * (RA00.C / RA00.D)) - LA1X;
        var LI05 = ((LB2Y - LA1Y) * (RA00.C / RA00.D)) + LA1Y;
        var LI06 = ((LB2X - LA2X) * (RA00.C / RA00.D)) + LA2X;
        var LI07 = ((LA2Y + LB2Y) * (RA00.C / RA00.D)) - LA2Y;
        var LI08 = ((LA2X + LB1X) * (RA00.C / RA00.D)) - LA2X;
        var LI09 = ((LA2Y - LB1Y) * (RA00.B / RA00.D)) + LB1Y;
        var LI10 = ((LA0Z + LB0Z) * (RA00.C / RA00.D)) - LA0Z;

        var LJ00 = ((LA1X + LB2X) * (RA00.C / RA00.D)) - LA1X;
        var LJ01 = ((LB2Y - LA1Y) * (RA00.C / RA00.D)) + LA1Y;
        var LJ02 = LB1X * (RA00.C / RA00.D);
        var LJ03 = ((LA0Y + LB1Y) * (RA00.B / RA00.D)) - LB1Y;
        var LJ04 = LA1X * (RA00.B / RA00.D);
        var LJ05 = ((LA1Y + LB0Y) * (RA00.C / RA00.D)) - LA1Y;
        var LJ06 = ((LA2X + LB1X) * (RA00.C / RA00.D)) - LA2X;
        var LJ07 = ((LA2Y - LB1Y) * (RA00.B / RA00.D)) + LB1Y;
        var LJ08 = ((LB2X - LA2X) * (RA00.C / RA00.D)) + LA2X;
        var LJ09 = ((LA2Y + LB2Y) * (RA00.C / RA00.D)) - LA2Y;
        var LJ10 = ((LA0Z + LB0Z) * (RA00.C / RA00.D)) - LA0Z;

        var LK00 = LB0Z * ((2 * (RA00.C / RA00.D)) - 1);

        var LL00 = LA2X * (RA00.C / RA00.D);
        var LL01 = ((LA0Y - LA2Y) * (RA00.B / RA00.D)) + LA2Y;
        var LL02 = ((LA1X - LA2X) * (RA00.B / RA00.D)) + LA2X;
        var LL03 = ((LA2Y - LA1Y) * (RA00.C / RA00.D)) + LA1Y;
        var LL04 = ((LA1X - LA2X) * (RA00.C / RA00.D)) + LA2X;
        var LL05 = ((LA2Y - LA1Y) * (RA00.B / RA00.D)) + LA1Y;
        var LL06 = LA2X * (RA00.B / RA00.D);
        var LL07 = ((LA0Y - LA2Y) * (RA00.C / RA00.D)) + LA2Y;
        var LL08 = LA1X;
        var LL09 = LA1Y * ((2 * (RA00.C / RA00.D)) - 1);
        var LL10 = LA0Z * ((2 * (RA00.C / RA00.D)) - 1);

        var RX02 = {
            A: RA00.A,
            B: RA00.C,
            C: RA00.A + RA00.C
        };
        var MA0Y = ((LA2Y + LB1Y) * (RX02.B / RX02.C)) - LB1Y;
        var MA1X = MA0Y * sin072;
        var MA1Y = MA0Y * cos072;
        var MA2X = MA0Y * sin036;
        var MA2Y = MA0Y * cos036;
        var MA0Z = ((LA0Z - LB0Z) * (RX02.B / RX02.C)) + LB0Z;

        var MB0Y = ((LA2Y - LB1Y) * (RX02.B / RX02.C)) + LB1Y;
        var MB1X = MB0Y * sin072;
        var MB1Y = MB0Y * cos072;
        var MB2X = MB0Y * sin036;
        var MB2Y = MB0Y * cos036;
        //var MB0Z = ((LA0Z - LB0Z) * (RX02.B / RX02.C)) + LB0Z;
        var MB0Z = ((LA0Z + LB0Z) * (RX02.B / RX02.C)) - LB0Z;

        var MC0X = LA2X * (RX02.A / RX02.C);
        var MC0Y = ((LA2Y + LB0Y) * (RX02.B / RX02.C)) - LA2Y;
        var MC1X = ((LA2X + LB1X) * (RX02.B / RX02.C)) - LA2X;
        var MC1Y = ((LA2Y + LB1Y) * (RX02.B / RX02.C)) - LA2Y;
        var MC2X = ((LA1X + LB2X) * (RX02.B / RX02.C)) - LA1X;
        var MC2Y = ((LA1Y + LB2Y) * (RX02.B / RX02.C)) - LA1Y;
        var MC3X = LB2X * (RX02.B / RX02.C);
        var MC3Y = ((LA0Y + LB2Y) * (RX02.B / RX02.C)) - LA0Y;
        var MC4X = ((LA1X + LB1X) * (RX02.B / RX02.C)) - LA1X;
        var MC4Y = ((LB1Y - LA1Y) * (RX02.B / RX02.C)) + LA1Y;
        var MC0Z = ((LA0Z - LB0Z) * (RX02.A / RX02.C)) + LB0Z;

        var MD0X = LB1X * (RX02.A / RX02.C);
        var MD0Y = ((LB0Y + LB1Y) * (RX02.B / RX02.C)) - LB1Y;
        var MD1X = LB1X * (RX02.B / RX02.C);
        var MD1Y = ((LB0Y + LB1Y) * (RX02.A / RX02.C)) - LB1Y;
        var MD2X = ((LB1X + LB2X) * (RX02.B / RX02.C)) - LB1X;
        var MD2Y = ((LB2Y - LB1Y) * (RX02.B / RX02.C)) + LB1Y;
        var MD3X = LB2X;
        var MD3Y = LB2Y * ((2 * (RX02.B / RX02.C)) - 1);
        var MD4X = ((LB1X + LB2X) * (RX02.B / RX02.C)) - LB2X;
        var MD4Y = ((LB2Y - LB1Y) * (RX02.A / RX02.C)) + LB1Y;
        var MD0Z = LB0Z * ((2 * (RX02.B / RX02.C)) - 1);

        var XB00 = LB1Y * 2;
        var XB01 = LA0Y + LB0Y;
        var RX03 = {
            A: XB00,
            B: XB01,
            C: XB00 + XB01
        };
        var XB02 = LB2Y - LA1Y;
        var XB03 = (LB2Y * 2) * (RX03.B / RX03.C);
        var RX04 = {
            A: XB02,
            B: XB03,
            C: XB02 + XB03
        };
        var ME0Y = LB0Y * ((2 * (RX04.B / RX04.C)) - 1);
        var ME1X = ME0Y * sin072;
        var ME1Y = ME0Y * cos072;
        var ME2X = ME0Y * sin036;
        var ME2Y = ME0Y * cos036;
        //var ME0Z = ((LB0Z - MD0Z) * (RX04.B / RX04.C)) + MD0Z;
        var ME0Z = ((LA0Z + MD0Z) * (RX04.B / RX04.C)) - MD0Z;

        var MF0X = MC4X * (RX04.A / RX04.C);
        var MF0Y = ((LB0Y + MC4Y) * (RX04.B / RX04.C)) - MC4Y;
        var MF1X = ((LB1X + MC0X) * (RX04.B / RX04.C)) - MC0X;
        var MF1Y = ((LB1Y + MC0Y) * (RX04.B / RX04.C)) - MC0Y;
        var MF2X = ((LB2X + MC1X) * (RX04.B / RX04.C)) - MC1X;
        var MF2Y = ((LB2Y - MC1Y) * (RX04.B / RX04.C)) + MC1Y;
        var MF3X = ((LB2X - MC2X) * (RX04.B / RX04.C)) + MC2X;
        var MF3Y = ((LB2Y + MC2Y) * (RX04.B / RX04.C)) - MC2Y;
        var MF4X = ((LB1X + MC3X) * (RX04.B / RX04.C)) - MC3X;
        var MF4Y = ((MC3Y - LB1Y) * (RX04.A / RX04.C)) + LB1Y;
        var MF0Z = ((LB0Z + MC0Z) * (RX04.B / RX04.C)) - MC0Z;

        var MG0Y = ((LB0Y + MA0Y) * (RX04.B / RX04.C)) - MA0Y;
        var MG1X = MG0Y * sin072;
        var MG1Y = MG0Y * cos072;
        var MG2X = MG0Y * sin036;
        var MG2Y = MG0Y * cos036;
        var MG0Z = ((MA0Z - LB0Z) * (RX04.A / RX04.C)) + LB0Z;

        this.reles.SO00 = {X: 0,            Y: 0,           Z: LO00 * -1};
        this.reles.SA00 = {X: 0,            Y: LA0Y * -1,   Z: LA0Z * -1};
        this.reles.SA01 = {X: LA1X,         Y: LA1Y * -1,   Z: LA0Z * -1};
        this.reles.SA02 = {X: LA2X,         Y: LA2Y,        Z: LA0Z * -1};
        this.reles.SA03 = {X: LA2X * -1,    Y: LA2Y,        Z: LA0Z * -1};
        this.reles.SA04 = {X: LA1X * -1,    Y: LA1Y * -1,   Z: LA0Z * -1};
        this.reles.SB00 = {X: 0,            Y: LB0Y * -1,   Z: LB0Z * -1};
        this.reles.SB01 = {X: LB1X,         Y: LB1Y * -1,   Z: LB0Z * -1};
        this.reles.SB02 = {X: LB2X,         Y: LB2Y,        Z: LB0Z * -1};
        this.reles.SB03 = {X: LB2X * -1,    Y: LB2Y,        Z: LB0Z * -1};
        this.reles.SB04 = {X: LB1X * -1,    Y: LB1Y * -1,   Z: LB0Z * -1};
        this.reles.SC00 = {X: 0,            Y: LC00 * -1,   Z: LC05 * -1};
        this.reles.SC01 = {X: LC01,         Y: LC02 * -1,   Z: LC05 * -1};
        this.reles.SC02 = {X: LC03,         Y: LC04,        Z: LC05 * -1};
        this.reles.SC03 = {X: LC03 * -1,    Y: LC04,        Z: LC05 * -1};
        this.reles.SC04 = {X: LC01 * -1,    Y: LC02 * -1,   Z: LC05 * -1};
        this.reles.SD00 = {X: LD00,         Y: LD01 * -1,   Z: LD10 * -1};
        this.reles.SD01 = {X: LD02,         Y: LD03,        Z: LD10 * -1};
        this.reles.SD02 = {X: LD04 * -1,    Y: LD05,        Z: LD10 * -1};
        this.reles.SD03 = {X: LD06 * -1,    Y: LD07,        Z: LD10 * -1};
        this.reles.SD04 = {X: LD08 * -1,    Y: LD09 * -1,   Z: LD10 * -1};
        this.reles.SE00 = {X: LE00 * -1,    Y: LE01 * -1,   Z: LE10 * -1};
        this.reles.SE01 = {X: LE02,         Y: LE03 * -1,   Z: LE10 * -1};
        this.reles.SE02 = {X: LE04,         Y: LE05,        Z: LE10 * -1};
        this.reles.SE03 = {X: LE06 * -1,    Y: LE07,        Z: LE10 * -1};
        this.reles.SE04 = {X: LE08 * -1,    Y: LE09 * -1,   Z: LE10 * -1};
        this.reles.SF00 = {X: 0,            Y: LF00,        Z: LF05 * -1};
        this.reles.SF01 = {X: LF01 * -1,    Y: LF02,        Z: LF05 * -1};
        this.reles.SF02 = {X: LF03 * -1,    Y: LF04 * -1,   Z: LF05 * -1};
        this.reles.SF03 = {X: LF03,         Y: LF04 * -1,   Z: LF05 * -1};
        this.reles.SF04 = {X: LF01,         Y: LF02,        Z: LF05 * -1};
        this.reles.SG00 = {X: 0,            Y: LA0Y,        Z: LG00 * -1};
        this.reles.SG01 = {X: LA1X * -1,    Y: LA1Y,        Z: LG00 * -1};
        this.reles.SG02 = {X: LA2X * -1,    Y: LA2Y * -1,   Z: LG00 * -1};
        this.reles.SG03 = {X: LA2X,         Y: LA2Y * -1,   Z: LG00 * -1};
        this.reles.SG04 = {X: LA1X,         Y: LA1Y,        Z: LG00 * -1};
        this.reles.SH00 = {X: LH00,         Y: LH01 * -1,   Z: LH05 * -1};
        this.reles.SH01 = {X: LH02,         Y: LH03,        Z: LH05 * -1};
        this.reles.SH02 = {X: LH04,         Y: LH05,        Z: LH05 * -1};
        this.reles.SH03 = {X: LH06 * -1,    Y: LH07,        Z: LH05 * -1};
        this.reles.SH04 = {X: LH08 * -1,    Y: LH09 * -1,   Z: LH05 * -1};
        this.reles.SI00 = {X: LI00,         Y: LI01 * -1,   Z: LI10 * -1};
        this.reles.SI01 = {X: LI02,         Y: LI03,        Z: LI10 * -1};
        this.reles.SI02 = {X: LI04,         Y: LI05,        Z: LI10 * -1};
        this.reles.SI03 = {X: LI06 * -1,    Y: LI07,        Z: LI10 * -1};
        this.reles.SI04 = {X: LI08 * -1,    Y: LI09 * -1,   Z: LI10 * -1};
        this.reles.SJ00 = {X: LJ00,         Y: LJ01 * -1,   Z: LJ10};
        this.reles.SJ01 = {X: LJ02,         Y: LJ03 * -1,   Z: LJ10};
        this.reles.SJ02 = {X: LJ04,         Y: LJ05,        Z: LJ10};
        this.reles.SJ03 = {X: LJ06 * -1,    Y: LJ07,        Z: LJ10};
        this.reles.SJ04 = {X: LJ08 * -1,    Y: LJ09 * -1,   Z: LJ10};
        
        
        
        this.reles.SK00 = {X: 0,            Y: LA0Y * -1,   Z: LK00};
        this.reles.SK01 = {X: LA1X,         Y: LA1Y * -1,   Z: LK00};
        this.reles.SK02 = {X: LA2X,         Y: LA2Y,        Z: LK00};
        this.reles.SK03 = {X: LA2X * -1,    Y: LA2Y,        Z: LK00};
        this.reles.SK04 = {X: LA1X * -1,    Y: LA1Y * -1,   Z: LK00};

        this.reles.SL00 = {X: LL00 * -1,    Y: LL01 * -1,   Z: LL10};
        this.reles.SL01 = {X: LL02,         Y: LL03 * -1,   Z: LL10};
        this.reles.SL02 = {X: LL04,         Y: LL05,        Z: LL10};
        this.reles.SL03 = {X: LL06 * -1,    Y: LL07,        Z: LL10};
        this.reles.SL04 = {X: LL08 * -1,    Y: LL09,        Z: LL10};

        this.reles.SM00 = {X: LH00,         Y: LH01 * -1,   Z: LH05};
        this.reles.SM01 = {X: LH02,         Y: LH03,        Z: LH05};
        this.reles.SM02 = {X: LH04,         Y: LH05,        Z: LH05};
        this.reles.SM03 = {X: LH06 * -1,    Y: LH07,        Z: LH05};
        this.reles.SM04 = {X: LH08 * -1,    Y: LH09 * -1,   Z: LH05};

        this.reles.SN00 = {X: LH00,         Y: LH01 * -1,   Z: LH05};
        this.reles.SN01 = {X: LH02,         Y: LH03,        Z: LH05};
        this.reles.SN02 = {X: LH04,         Y: LH05,        Z: LH05};
        this.reles.SN03 = {X: LH06 * -1,    Y: LH07,        Z: LH05};
        this.reles.SN04 = {X: LH08 * -1,    Y: LH09 * -1,   Z: LH05};
        
        this.reles.SZ00 = {X: LD02,         Y: LD03,        Z: LD10};
        this.reles.SZ01 = {X: LD00,         Y: LD01 * -1,   Z: LD10};
        this.reles.SZ02 = {X: LD08 * -1,    Y: LD09 * -1,   Z: LD10};
        this.reles.SZ03 = {X: LD06 * -1,    Y: LD07,        Z: LD10};
        this.reles.SZ04 = {X: LD04 * -1,    Y: LD05,        Z: LD10};

        this.reles.TA00 = {X: 0,            Y: MA0Y,        Z: MA0Z * -1};
        this.reles.TA01 = {X: MA1X * -1,    Y: MA1Y,        Z: MA0Z * -1};
        this.reles.TA02 = {X: MA2X * -1,    Y: MA2Y * -1,   Z: MA0Z * -1};
        this.reles.TA03 = {X: MA2X,         Y: MA2Y * -1,   Z: MA0Z * -1};
        this.reles.TA04 = {X: MA1X,         Y: MA1Y,        Z: MA0Z * -1};

        this.reles.TB00 = {X: 0,            Y: MB0Y,        Z: MB0Z * -1};
        this.reles.TB01 = {X: MB1X * -1,    Y: MB1Y,        Z: MB0Z * -1};
        this.reles.TB02 = {X: MB2X * -1,    Y: MB2Y * -1,   Z: MB0Z * -1};
        this.reles.TB03 = {X: MB2X,         Y: MB2Y * -1,   Z: MB0Z * -1};
        this.reles.TB04 = {X: MB1X,         Y: MB1Y,        Z: MB0Z * -1};

        this.reles.TC00 = {X: MC0X,         Y: MC0Y * -1,   Z: MC0Z * -1};
        this.reles.TC01 = {X: MC1X,         Y: MC1Y * -1,   Z: MC0Z * -1};
        this.reles.TC02 = {X: MC2X,         Y: MC2Y,        Z: MC0Z * -1};
        this.reles.TC03 = {X: MC3X * -1,    Y: MC3Y,        Z: MC0Z * -1};
        this.reles.TC04 = {X: MC4X * -1,    Y: MC4Y * -1,   Z: MC0Z * -1};
        this.reles.TC05 = {X: MC0X * -1,    Y: MC0Y * -1,   Z: MC0Z * -1};
        this.reles.TC06 = {X: MC4X,         Y: MC4Y * -1,   Z: MC0Z * -1};
        this.reles.TC07 = {X: MC3X,         Y: MC3Y,        Z: MC0Z * -1};
        this.reles.TC08 = {X: MC2X * -1,    Y: MC2Y,        Z: MC0Z * -1};
        this.reles.TC09 = {X: MC1X * -1,    Y: MC1Y * -1,   Z: MC0Z * -1};

        this.reles.TD00 = {X: MD0X,         Y: MD0Y * -1,   Z: MD0Z * -1};
        this.reles.TD01 = {X: MD1X,         Y: MD1Y,        Z: MD0Z * -1};
        this.reles.TD02 = {X: MD2X,         Y: MD2Y,        Z: MD0Z * -1};
        this.reles.TD03 = {X: MD3X * -1,    Y: MD3Y,        Z: MD0Z * -1};
        this.reles.TD04 = {X: MD4X * -1,    Y: MD4Y * -1,   Z: MD0Z * -1};
        this.reles.TD05 = {X: MD0X * -1,    Y: MD0Y * -1,   Z: MD0Z * -1};
        this.reles.TD06 = {X: MD4X,         Y: MD4Y * -1,   Z: MD0Z * -1};
        this.reles.TD07 = {X: MD3X,         Y: MD3Y,        Z: MD0Z * -1};
        this.reles.TD08 = {X: MD2X * -1,    Y: MD2Y,        Z: MD0Z * -1};
        this.reles.TD09 = {X: MD1X * -1,    Y: MD1Y,        Z: MD0Z * -1};

        this.reles.TE00 = {X: 0,            Y: ME0Y,        Z: ME0Z * -1};
        this.reles.TE01 = {X: ME1X * -1,    Y: ME1Y,        Z: ME0Z * -1};
        this.reles.TE02 = {X: ME2X * -1,    Y: ME2Y * -1,   Z: ME0Z * -1};
        this.reles.TE03 = {X: ME2X,         Y: ME2Y * -1,   Z: ME0Z * -1};
        this.reles.TE04 = {X: ME1X,         Y: ME1Y,        Z: ME0Z * -1};

        this.reles.TF00 = {X: MF0X,         Y: MF0Y * -1,   Z: MF0Z * -1};
        this.reles.TF01 = {X: MF1X,         Y: MF1Y * -1,   Z: MF0Z * -1};
        this.reles.TF02 = {X: MF2X,         Y: MF2Y,        Z: MF0Z * -1};
        this.reles.TF03 = {X: MF3X * -1,    Y: MF3Y,        Z: MF0Z * -1};
        this.reles.TF04 = {X: MF4X * -1,    Y: MF4Y * -1,   Z: MF0Z * -1};
        this.reles.TF05 = {X: MF0X * -1,    Y: MF0Y * -1,   Z: MF0Z * -1};
        this.reles.TF06 = {X: MF4X,         Y: MF4Y * -1,   Z: MF0Z * -1};
        this.reles.TF07 = {X: MF3X,         Y: MF3Y,        Z: MF0Z * -1};
        this.reles.TF08 = {X: MF2X * -1,    Y: MF2Y,        Z: MF0Z * -1};
        this.reles.TF09 = {X: MF1X * -1,    Y: MF1Y * -1,   Z: MF0Z * -1};

        this.reles.TG00 = {X: 0,            Y: MG0Y * -1,   Z: MG0Z * -1};
        this.reles.TG01 = {X: MG1X,         Y: MG1Y * -1,   Z: MG0Z * -1};
        this.reles.TG02 = {X: MG2X,         Y: MG2Y,        Z: MG0Z * -1};
        this.reles.TG03 = {X: MG2X * -1,    Y: MG2Y,        Z: MG0Z * -1};
        this.reles.TG04 = {X: MG1X * -1,    Y: MG1Y * -1,   Z: MG0Z * -1};

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
            S00A:   [this.reles.SO00,   this.reles.SA00,    this.reles.TA03,    this.reles.SA01],
            S01A:   [this.reles.SO00,   this.reles.SA01,    this.reles.TA04,    this.reles.SA02],
            S02A:   [this.reles.SO00,   this.reles.SA02,    this.reles.TA00,    this.reles.SA03],
            S03A:   [this.reles.SO00,   this.reles.SA03,    this.reles.TA01,    this.reles.SA04],
            S04A:   [this.reles.SO00,   this.reles.SA04,    this.reles.TA02,    this.reles.SA00],
            S00R:   [this.reles.SO00R,  this.reles.SA00R,   this.reles.TA03R,   this.reles.SA01R],
            S01R:   [this.reles.SO00R,  this.reles.SA01R,   this.reles.TA04R,   this.reles.SA02R],
            S02R:   [this.reles.SO00R,  this.reles.SA02R,   this.reles.TA00R,   this.reles.SA03R],
            S03R:   [this.reles.SO00R,  this.reles.SA03R,   this.reles.TA01R,   this.reles.SA04R],
            S04R:   [this.reles.SO00R,  this.reles.SA04R,   this.reles.TA02R,   this.reles.SA00R],

            S05A:   [this.reles.SA00,   this.reles.SF03,    this.reles.SA01,    this.reles.TB03],
            S06A:   [this.reles.SA01,   this.reles.SF04,    this.reles.SA02,    this.reles.TB04],
            S07A:   [this.reles.SA02,   this.reles.SF00,    this.reles.SA03,    this.reles.TB00],
            S08A:   [this.reles.SA03,   this.reles.SF01,    this.reles.SA04,    this.reles.TB01],
            S09A:   [this.reles.SA04,   this.reles.SF02,    this.reles.SA00,    this.reles.TB02],
            S05R:   [this.reles.SA00R,  this.reles.SF03R,   this.reles.SA01R,   this.reles.TB03R],
            S06R:   [this.reles.SA01R,  this.reles.SF04R,   this.reles.SA02R,   this.reles.TB04R],
            S07R:   [this.reles.SA02R,  this.reles.SF00R,   this.reles.SA03R,   this.reles.TB00R],
            S08R:   [this.reles.SA03R,  this.reles.SF01R,   this.reles.SA04R,   this.reles.TB01R],
            S09R:   [this.reles.SA04R,  this.reles.SF02R,   this.reles.SA00R,   this.reles.TB02R],

            S10A:   [this.reles.SA00,   this.reles.SF03,    this.reles.SB00,    this.reles.TC00],
            S11A:   [this.reles.SA01,   this.reles.SF04,    this.reles.SB01,    this.reles.TC01],
            S12A:   [this.reles.SA02,   this.reles.SF00,    this.reles.SB02,    this.reles.TC02],
            S13A:   [this.reles.SA03,   this.reles.SF01,    this.reles.SB03,    this.reles.TC03],
            S14A:   [this.reles.SA04,   this.reles.SF02,    this.reles.SB04,    this.reles.TC04],
            S15A:   [this.reles.SA00,   this.reles.SF02,    this.reles.SB00,    this.reles.TC05],
            S16A:   [this.reles.SA01,   this.reles.SF03,    this.reles.SB01,    this.reles.TC06],
            S17A:   [this.reles.SA02,   this.reles.SF04,    this.reles.SB02,    this.reles.TC07],
            S18A:   [this.reles.SA03,   this.reles.SF00,    this.reles.SB03,    this.reles.TC08],
            S19A:   [this.reles.SA04,   this.reles.SF01,    this.reles.SB04,    this.reles.TC09],
            S10R:   [this.reles.SA00R,  this.reles.SF03R,   this.reles.SB00R,   this.reles.TC00R],
            S11R:   [this.reles.SA01R,  this.reles.SF04R,   this.reles.SB01R,   this.reles.TC01R],
            S12R:   [this.reles.SA02R,  this.reles.SF00R,   this.reles.SB02R,   this.reles.TC02R],
            S13R:   [this.reles.SA03R,  this.reles.SF01R,   this.reles.SB03R,   this.reles.TC03R],
            S14R:   [this.reles.SA04R,  this.reles.SF02R,   this.reles.SB04R,   this.reles.TC04R],
            S15R:   [this.reles.SA00R,  this.reles.SF02R,   this.reles.SB00R,   this.reles.TC05R],
            S16R:   [this.reles.SA01R,  this.reles.SF03R,   this.reles.SB01R,   this.reles.TC06R],
            S17R:   [this.reles.SA02R,  this.reles.SF04R,   this.reles.SB02R,   this.reles.TC07R],
            S18R:   [this.reles.SA03R,  this.reles.SF00R,   this.reles.SB03R,   this.reles.TC08R],
            S19R:   [this.reles.SA04R,  this.reles.SF01R,   this.reles.SB04R,   this.reles.TC09R],

            S20A:   [this.reles.SB00,   this.reles.SF03,    this.reles.SB03R,   this.reles.TD00],
            S21A:   [this.reles.SB01,   this.reles.SF04,    this.reles.SB04R,   this.reles.TD01],
            S22A:   [this.reles.SB02,   this.reles.SF00,    this.reles.SB00R,   this.reles.TD02],
            S23A:   [this.reles.SB03,   this.reles.SF01,    this.reles.SB01R,   this.reles.TD03],
            S24A:   [this.reles.SB04,   this.reles.SF02,    this.reles.SB02R,   this.reles.TD04],
            S25A:   [this.reles.SB00,   this.reles.SF02,    this.reles.SB02R,   this.reles.TD05],
            S26A:   [this.reles.SB01,   this.reles.SF03,    this.reles.SB03R,   this.reles.TD06],
            S27A:   [this.reles.SB02,   this.reles.SF04,    this.reles.SB04R,   this.reles.TD07],
            S28A:   [this.reles.SB03,   this.reles.SF00,    this.reles.SB00R,   this.reles.TD08],
            S29A:   [this.reles.SB04,   this.reles.SF01,    this.reles.SB01R,   this.reles.TD09],
            S20R:   [this.reles.SB00R,  this.reles.SF03R,   this.reles.SB03,    this.reles.TD00R],
            S21R:   [this.reles.SB01R,  this.reles.SF04R,   this.reles.SB04,    this.reles.TD01R],
            S22R:   [this.reles.SB02R,  this.reles.SF00R,   this.reles.SB00,    this.reles.TD02R],
            S23R:   [this.reles.SB03R,  this.reles.SF01R,   this.reles.SB01,    this.reles.TD03R],
            S24R:   [this.reles.SB04R,  this.reles.SF02R,   this.reles.SB02,    this.reles.TD04R],
            S25R:   [this.reles.SB00R,  this.reles.SF02R,   this.reles.SB02,    this.reles.TD05R],
            S26R:   [this.reles.SB01R,  this.reles.SF03R,   this.reles.SB03,    this.reles.TD06R],
            S27R:   [this.reles.SB02R,  this.reles.SF04R,   this.reles.SB04,    this.reles.TD07R],
            S28R:   [this.reles.SB03R,  this.reles.SF00R,   this.reles.SB00,    this.reles.TD08R],
            S29R:   [this.reles.SB04R,  this.reles.SF01R,   this.reles.SB01,    this.reles.TD09R],

            S30A:   [this.reles.SA00,   this.reles.TA03,    this.reles.TE03],
            S31A:   [this.reles.SA01,   this.reles.TA04,    this.reles.TE04],
            S32A:   [this.reles.SA02,   this.reles.TA00,    this.reles.TE00],
            S33A:   [this.reles.SA03,   this.reles.TA01,    this.reles.TE01],
            S34A:   [this.reles.SA04,   this.reles.TA02,    this.reles.TE02],
            S35A:   [this.reles.SA00,   this.reles.TB03,    this.reles.TE03],
            S36A:   [this.reles.SA01,   this.reles.TB04,    this.reles.TE04],
            S37A:   [this.reles.SA02,   this.reles.TB00,    this.reles.TE00],
            S38A:   [this.reles.SA03,   this.reles.TB01,    this.reles.TE01],
            S39A:   [this.reles.SA04,   this.reles.TB02,    this.reles.TE02],
            S30R:   [this.reles.SA00R,  this.reles.TA03R,   this.reles.TE03R],
            S31R:   [this.reles.SA01R,  this.reles.TA04R,   this.reles.TE04R],
            S32R:   [this.reles.SA02R,  this.reles.TA00R,   this.reles.TE00R],
            S33R:   [this.reles.SA03R,  this.reles.TA01R,   this.reles.TE01R],
            S34R:   [this.reles.SA04R,  this.reles.TA02R,   this.reles.TE02R],
            S35R:   [this.reles.SA00R,  this.reles.TB03R,   this.reles.TE03R],
            S36R:   [this.reles.SA01R,  this.reles.TB04R,   this.reles.TE04R],
            S37R:   [this.reles.SA02R,  this.reles.TB00R,   this.reles.TE00R],
            S38R:   [this.reles.SA03R,  this.reles.TB01R,   this.reles.TE01R],
            S39R:   [this.reles.SA04R,  this.reles.TB02R,   this.reles.TE02R],

            S40A:   [this.reles.SA01,   this.reles.TA03,    this.reles.TE03],
            S41A:   [this.reles.SA02,   this.reles.TA04,    this.reles.TE04],
            S42A:   [this.reles.SA03,   this.reles.TA00,    this.reles.TE00],
            S43A:   [this.reles.SA04,   this.reles.TA01,    this.reles.TE01],
            S44A:   [this.reles.SA00,   this.reles.TA02,    this.reles.TE02],
            S45A:   [this.reles.SA01,   this.reles.TB03,    this.reles.TE03],
            S46A:   [this.reles.SA02,   this.reles.TB04,    this.reles.TE04],
            S47A:   [this.reles.SA03,   this.reles.TB00,    this.reles.TE00],
            S48A:   [this.reles.SA04,   this.reles.TB01,    this.reles.TE01],
            S49A:   [this.reles.SA00,   this.reles.TB02,    this.reles.TE02],
            S40R:   [this.reles.SA01R,  this.reles.TA03R,   this.reles.TE03R],
            S41R:   [this.reles.SA02R,  this.reles.TA04R,   this.reles.TE04R],
            S42R:   [this.reles.SA03R,  this.reles.TA00R,   this.reles.TE00R],
            S43R:   [this.reles.SA04R,  this.reles.TA01R,   this.reles.TE01R],
            S44R:   [this.reles.SA00R,  this.reles.TA02R,   this.reles.TE02R],
            S45R:   [this.reles.SA01R,  this.reles.TB03R,   this.reles.TE03R],
            S46R:   [this.reles.SA02R,  this.reles.TB04R,   this.reles.TE04R],
            S47R:   [this.reles.SA03R,  this.reles.TB00R,   this.reles.TE00R],
            S48R:   [this.reles.SA04R,  this.reles.TB01R,   this.reles.TE01R],
            S49R:   [this.reles.SA00R,  this.reles.TB02R,   this.reles.TE02R],

            S50A:   [this.reles.SB00,   this.reles.TD00,    this.reles.TF00],
            S51A:   [this.reles.SB01,   this.reles.TD01,    this.reles.TF01],
            S52A:   [this.reles.SB02,   this.reles.TD02,    this.reles.TF02],
            S53A:   [this.reles.SB03,   this.reles.TD03,    this.reles.TF03],
            S54A:   [this.reles.SB04,   this.reles.TD04,    this.reles.TF04],
            S55A:   [this.reles.SB00,   this.reles.TD08R,   this.reles.TF00],
            S56A:   [this.reles.SB01,   this.reles.TD09R,   this.reles.TF01],
            S57A:   [this.reles.SB02,   this.reles.TD05R,   this.reles.TF02],
            S58A:   [this.reles.SB03,   this.reles.TD06R,   this.reles.TF03],
            S59A:   [this.reles.SB04,   this.reles.TD07R,   this.reles.TF04],
            S50R:   [this.reles.SB00R,  this.reles.TD00R,   this.reles.TF00R],
            S51R:   [this.reles.SB01R,  this.reles.TD01R,   this.reles.TF01R],
            S52R:   [this.reles.SB02R,  this.reles.TD02R,   this.reles.TF02R],
            S53R:   [this.reles.SB03R,  this.reles.TD03R,   this.reles.TF03R],
            S54R:   [this.reles.SB04R,  this.reles.TD04R,   this.reles.TF04R],
            S55R:   [this.reles.SB00R,  this.reles.TD08,    this.reles.TF00R],
            S56R:   [this.reles.SB01R,  this.reles.TD09,    this.reles.TF01R],
            S57R:   [this.reles.SB02R,  this.reles.TD05,    this.reles.TF02R],
            S58R:   [this.reles.SB03R,  this.reles.TD06,    this.reles.TF03R],
            S59R:   [this.reles.SB04R,  this.reles.TD07,    this.reles.TF04R],

            S60A:   [this.reles.SB00,   this.reles.TD05,    this.reles.TF05],
            S61A:   [this.reles.SB01,   this.reles.TD06,    this.reles.TF06],
            S62A:   [this.reles.SB02,   this.reles.TD07,    this.reles.TF07],
            S63A:   [this.reles.SB03,   this.reles.TD08,    this.reles.TF08],
            S64A:   [this.reles.SB04,   this.reles.TD09,    this.reles.TF09],
            S65A:   [this.reles.SB00,   this.reles.TD02R,   this.reles.TF05],
            S66A:   [this.reles.SB01,   this.reles.TD03R,   this.reles.TF06],
            S67A:   [this.reles.SB02,   this.reles.TD04R,   this.reles.TF07],
            S68A:   [this.reles.SB03,   this.reles.TD00R,   this.reles.TF08],
            S69A:   [this.reles.SB04,   this.reles.TD01R,   this.reles.TF09],
            S60R:   [this.reles.SB00R,  this.reles.TD05R,   this.reles.TF05R],
            S61R:   [this.reles.SB01R,  this.reles.TD06R,   this.reles.TF06R],
            S62R:   [this.reles.SB02R,  this.reles.TD07R,   this.reles.TF07R],
            S63R:   [this.reles.SB03R,  this.reles.TD08R,   this.reles.TF08R],
            S64R:   [this.reles.SB04R,  this.reles.TD09R,   this.reles.TF09R],
            S65R:   [this.reles.SB00R,  this.reles.TD02,    this.reles.TF05R],
            S66R:   [this.reles.SB01R,  this.reles.TD03,    this.reles.TF06R],
            S67R:   [this.reles.SB02R,  this.reles.TD04,    this.reles.TF07R],
            S68R:   [this.reles.SB03R,  this.reles.TD00,    this.reles.TF08R],
            S69R:   [this.reles.SB04R,  this.reles.TD01,    this.reles.TF09R],

            S70A:   [this.reles.SB00,   this.reles.TC00,    this.reles.TG00],
            S71A:   [this.reles.SB01,   this.reles.TC01,    this.reles.TG01],
            S72A:   [this.reles.SB02,   this.reles.TC02,    this.reles.TG02],
            S73A:   [this.reles.SB03,   this.reles.TC03,    this.reles.TG03],
            S74A:   [this.reles.SB04,   this.reles.TC04,    this.reles.TG04],
            S75A:   [this.reles.SB00,   this.reles.TC05,    this.reles.TG00],
            S76A:   [this.reles.SB01,   this.reles.TC06,    this.reles.TG01],
            S77A:   [this.reles.SB02,   this.reles.TC07,    this.reles.TG02],
            S78A:   [this.reles.SB03,   this.reles.TC08,    this.reles.TG03],
            S79A:   [this.reles.SB04,   this.reles.TC09,    this.reles.TG04],
            S70R:   [this.reles.SB00R,  this.reles.TC00R,   this.reles.TG00R],
            S71R:   [this.reles.SB01R,  this.reles.TC01R,   this.reles.TG01R],
            S72R:   [this.reles.SB02R,  this.reles.TC02R,   this.reles.TG02R],
            S73R:   [this.reles.SB03R,  this.reles.TC03R,   this.reles.TG03R],
            S74R:   [this.reles.SB04R,  this.reles.TC04R,   this.reles.TG04R],
            S75R:   [this.reles.SB00R,  this.reles.TC05R,   this.reles.TG00R],
            S76R:   [this.reles.SB01R,  this.reles.TC06R,   this.reles.TG01R],
            S77R:   [this.reles.SB02R,  this.reles.TC07R,   this.reles.TG02R],
            S78R:   [this.reles.SB03R,  this.reles.TC08R,   this.reles.TG03R],
            S79R:   [this.reles.SB04R,  this.reles.TC09R,   this.reles.TG04R],

            S80A:   [this.reles.SA00,   this.reles.TC00,    this.reles.TG00],
            S81A:   [this.reles.SA01,   this.reles.TC01,    this.reles.TG01],
            S82A:   [this.reles.SA02,   this.reles.TC02,    this.reles.TG02],
            S83A:   [this.reles.SA03,   this.reles.TC03,    this.reles.TG03],
            S84A:   [this.reles.SA04,   this.reles.TC04,    this.reles.TG04],
            S85A:   [this.reles.SA00,   this.reles.TC05,    this.reles.TG00],
            S86A:   [this.reles.SA01,   this.reles.TC06,    this.reles.TG01],
            S87A:   [this.reles.SA02,   this.reles.TC07,    this.reles.TG02],
            S88A:   [this.reles.SA03,   this.reles.TC08,    this.reles.TG03],
            S89A:   [this.reles.SA04,   this.reles.TC09,    this.reles.TG04],
            S80R:   [this.reles.SA00R,  this.reles.TC00R,   this.reles.TG00R],
            S81R:   [this.reles.SA01R,  this.reles.TC01R,   this.reles.TG01R],
            S82R:   [this.reles.SA02R,  this.reles.TC02R,   this.reles.TG02R],
            S83R:   [this.reles.SA03R,  this.reles.TC03R,   this.reles.TG03R],
            S84R:   [this.reles.SA04R,  this.reles.TC04R,   this.reles.TG04R],
            S85R:   [this.reles.SA00R,  this.reles.TC05R,   this.reles.TG00R],
            S86R:   [this.reles.SA01R,  this.reles.TC06R,   this.reles.TG01R],
            S87R:   [this.reles.SA02R,  this.reles.TC07R,   this.reles.TG02R],
            S88R:   [this.reles.SA03R,  this.reles.TC08R,   this.reles.TG03R],
            S89R:   [this.reles.SA04R,  this.reles.TC09R,   this.reles.TG04R],
        };

        this.surfaces2 = {
            S00A:   [this.reles.SA00,   this.reles.SA01,    this.reles.SA02,    this.reles.SA03,    this.reles.SA04],
            S00R:   [this.reles.SA00R,  this.reles.SA01R,   this.reles.SA02R,   this.reles.SA03R,   this.reles.SA04R],

            S01A:   [this.reles.SA00,   this.reles.SA01,    this.reles.SB01,    this.reles.SB03R,   this.reles.SB00],
            S02A:   [this.reles.SA01,   this.reles.SA02,    this.reles.SB02,    this.reles.SB04R,   this.reles.SB01],
            S03A:   [this.reles.SA02,   this.reles.SA03,    this.reles.SB03,    this.reles.SB00R,   this.reles.SB02],
            S04A:   [this.reles.SA03,   this.reles.SA04,    this.reles.SB04,    this.reles.SB01R,   this.reles.SB03],
            S05A:   [this.reles.SA04,   this.reles.SA00,    this.reles.SB00,    this.reles.SB02R,   this.reles.SB04],
            S01R:   [this.reles.SA00R,  this.reles.SA01R,   this.reles.SB01R,   this.reles.SB03,    this.reles.SB00R],
            S02R:   [this.reles.SA01R,  this.reles.SA02R,   this.reles.SB02R,   this.reles.SB04,    this.reles.SB01R],
            S03R:   [this.reles.SA02R,  this.reles.SA03R,   this.reles.SB03R,   this.reles.SB00,    this.reles.SB02R],
            S04R:   [this.reles.SA03R,  this.reles.SA04R,   this.reles.SB04R,   this.reles.SB01,    this.reles.SB03R],
            S05R:   [this.reles.SA04R,  this.reles.SA00R,   this.reles.SB00R,   this.reles.SB02,    this.reles.SB04R],
        };
    },
zzzzoutput: function(x, y, z)
{
    this.canvas_context.setTransform(1, 0, 0, 1, 0, 0);
    this.canvas_context.clearRect(0, 0, this.size, this.size);
    //this._output(this.surfaces2, this.fill_style2,   this.stroke_style2, x, y, z);
    this._output(this.surfaces,  this.fill_style,    this.stroke_style,  x, y, z);

    this.lockOn('TC00', x, y, z);
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
