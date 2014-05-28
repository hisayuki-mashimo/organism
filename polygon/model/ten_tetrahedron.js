/**
 * 10個の正四面体
 *
 */
var TenTetrahedron = function()
{
};


TenTetrahedron.prototype = {
    // 外部設定値
    //fill_style:     'rgba(160, 255, 120, 0.8)',
    //stroke_style:   'rgb(112, 184, 64)',
    fill_style:     'rgba(224, 128, 176, 0.8)',
    //fill_style:     'rgba(0, 0, 0, 1.0)',
    stroke_style:   'rgba(160, 64, 88, 0.2)',
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

        var LA0Y = this.alpha;
        var LA1Y = LA0Y * (RA01.A / RA01.C);
        var LA1X = LA0Y * (RA01.B / RA01.C);

        var XA00 = LA0Y * (RA00.A / RA00.D) / 2;
        var XA01 = LA0Y * (RA00.C / RA00.D);
        var XA02 = this.getLengthByPytha(null, LA1X, XA00);
        var RX00 = {
            A: XA00,
            B: LA1X,
            C: XA02
        };
        var XA03 = XA01 * (RX00.A / RX00.C) * 2;
        var XA04 = XA02 - XA03;
        var RX01 = {
            A: XA03,
            B: XA04,
            C: XA02
        };
        var LB0X = (RX01.B / RX01.C) * (LA1X * (RA00.B / RA00.D));
        var LB0Y = (RX01.B / RX01.C) * (LA1Y * (1 + (RA00.C / RA00.D)));
        var LB1X = (RX01.B / RX01.C) * (LA1X * (RA00.C / RA00.D));
        var LB1Y = (RX01.B / RX01.C) * (LA1Y * (1 + (RA00.B / RA00.D)));
        var LB2X = (RX01.B / RX01.C) * LA1X;
        var LB2Y = (RX01.B / RX01.C) * XA00;

        var LC0X = LB2X;
        var LC0Y = LB2Y + XA01;
        var LC1X = (XA01 * (RA01.B / RA01.C)) - LB0X;
        var LC1Y = (XA01 * (RA01.A / RA01.C)) + LB0Y;
        var LC2X = LB1X + (XA01 * (RA01.B / RA01.C));
        var LC2Y = LB1Y - (XA01 * (RA01.A / RA01.C));

        var RX02 = {
            A: 1,
            B: 2 * Math.pow(2, 1 / 2),
            C: 3
        };
        var XB00 = LA1Y * (RX02.B / RX02.A);
        var LA0Z = XB00 / 4;
        var LD0Z = XB00 * 3 / 4;
        var LB0Z = LA0Z + ((XB00 / 2) * (RA00.C / RA00.D));

        var LF00 = (1 / 2) * (LA1X * (RA00.C / RA00.D));
        var LF01 = (1 / 2) * (((LA0Y + LA1Y) * (RA00.B / RA00.D)) - LA1Y);
        var LF02 = (1 / 2) * (LA1X * ((2 * (RA00.C / RA00.D)) - 1));
        var LF03 = (1 / 2) * LA1Y;
        var LF04 = (1 / 2) * (LA1X * (RA00.B / RA00.D));
        var LF05 = (1 / 2) * (((LA0Y + LA1Y) * (RA00.C / RA00.D)) - LA1Y);

        var LG00 = LB0X * (RA00.C / RA00.D);
        var LG01 = ((LB0Y + LA0Y) * (RA00.C / RA00.D)) - LA0Y;
        var LG02 = ((LB1X + LA1X) * (RA00.B / RA00.D)) - LB1X;
        var LG03 = ((LB1Y + LA1Y) * (RA00.C / RA00.D)) - LA1Y;
        var LG04 = ((LB2X + LA1X) * (RA00.C / RA00.D)) - LA1X;
        var LG05 = ((LB2Y + LA1Y) * (RA00.B / RA00.D)) - LB2Y;
        var LG06 = ((LB0Z - LA0Z) * (RA00.C / RA00.D)) + LA0Z;

        var LE00 = LA0Y * (RA00.B / RA00.D);
        var LE01 = LE00 * (RA01.A / RA01.C);
        var LE02 = LE00 * (RA01.B / RA01.C);
        var LE0Z = (XB00 * (RA00.C / RA00.D)) - LA0Z;
        var LO00 = (1 / 2) * LE02;
        var LO01 = ((1 / 2) * (LA0Y + LE01)) - LE01;
        var LO02 = ((1 / 2) * (LA1X + LE02)) - LE02;
        var LO03 = ((1 / 2) * (LA1Y - LE01)) + LE01;
        var LO04 = (1 / 2) * LA1X;
        var LO05 = ((1 / 2) * (LA1Y + LE00)) - LE00;
        var LO06 = ((1 / 2) * (LA0Z + LE0Z)) - LA0Z;

        var XC00 = (XA04 / 2) * (RA00.B / RA00.C);
        var RX03 = {
            A: XA04,
            B: (XA04 + XC00) * 2,
            C: XA04 + ((XA04 + XC00) * 2)
        };
        var MC0Y = LA0Y * (RX03.A / RX03.C);
        var MC1X = MC0Y * (RA01.B / RA01.C);
        var MC1Y = MC0Y * (RA01.A / RA01.C);
        var MC3X = LC0X * (RX03.A / RX03.C);
        var MC3Y = LC0Y * (RX03.A / RX03.C);
        var MC4X = LC1X * (RX03.A / RX03.C);
        var MC4Y = LC1Y * (RX03.A / RX03.C);
        var MC5X = LC2X * (RX03.A / RX03.C);
        var MC5Y = LC2Y * (RX03.A / RX03.C);
        var MC0Z = ((LA0Z + LD0Z) * (RX03.B / RX03.C)) - LA0Z;

        var MD0X = ((LA1X + LB2X) * (RX03.B / RX03.C)) - LB2X;
        var MD0Y = ((LA1Y + LB2Y) * (RX03.B / RX03.C)) - LB2Y;
        var MD1X = LB0X * (RX03.A / RX03.C);
        var MD1Y = ((LA0Y + LB0Y) * (RX03.B / RX03.C)) - LB0Y;
        var MD2X = ((LA1X + LB1X) * (RX03.B / RX03.C)) - LB1X;
        var MD2Y = ((LA1Y + LB1Y) * (RX03.B / RX03.C)) - LB1Y;
        var MD3X = ((LB1X + LC1X) * (RX03.B / RX03.C)) - LB1X;
        var MD3Y = ((LB1Y + LC1Y) * (RX03.B / RX03.C)) - LB1Y;
        var MD4X = ((LB2X + LC2X) * (RX03.B / RX03.C)) - LB2X;
        var MD4Y = ((LC2Y - LB2Y) * (RX03.B / RX03.C)) + LB2Y;
        var MD5X = ((LB0X + LC0X) * (RX03.B / RX03.C)) - LB0X;
        var MD5Y = ((LB0Y + LC0Y) * (RX03.B / RX03.C)) - LB0Y;
        var MD0Z = ((LA0Z - LB0Z) * (RX03.B / RX03.C)) + LB0Z;

        var ME0X = LA1X * (RX03.B / RX03.C);
        var ME0Y = ((LA0Y + LA1Y) * (RX03.B / RX03.C)) - LA0Y;
        var ME1X = LA1X * (RX03.A / RX03.C);
        var ME1Y = ((LA0Y + LA1Y) * (RX03.B / RX03.C)) - LA1Y;
        var ME2X = LA1X * ((2 * (RX03.B / RX03.C)) - 1);
        var ME2Y = LA1Y;
        var ME6X = ((LC1X + LC2X) * (RX03.A / RX03.C)) - LC1X;
        var ME6Y = ((LC1Y + LC2Y) * (RX03.B / RX03.C)) - LC2Y;
        var ME7X = ((LC0X + LC2X) * (RX03.B / RX03.C)) - LC0X;
        var ME7Y = ((LC0Y - LC2Y) * (RX03.A / RX03.C)) + LC2Y;
        var ME8X = ((LC0X - LC1X) * (RX03.B / RX03.C)) + LC1X;
        var ME8Y = ((LC0Y + LC1Y) * (RX03.B / RX03.C)) - LC1Y;
        var ME0Z = LA0Z;

        var MF0Y = LA0Y * (RX03.B / RX03.C);
        var MF1X = MF0Y * (RA01.B / RA01.C);
        var MF1Y = MF0Y * (RA01.A / RA01.C);
        var MF3X = LC0X * (RX03.B / RX03.C);
        var MF3Y = LC0Y * (RX03.B / RX03.C);
        var MF4X = LC1X * (RX03.B / RX03.C);
        var MF4Y = LC1Y * (RX03.B / RX03.C);
        var MF5X = LC2X * (RX03.B / RX03.C);
        var MF5Y = LC2Y * (RX03.B / RX03.C);
        var MF0Z = ((LA0Z + LD0Z) * (RX03.A / RX03.C)) - LA0Z;

        var MG0Z = LA0Z * ((2 * (RX03.B / RX03.C)) - 1);

        var RX04 = {
            A: LB0X,
            B: LA1X - LB0X,
            C: LA1X
        };
        var XD00 = MC0Y * (RX04.B / RX04.C);
        var XD01 = LA0Y * (RA00.B / RA00.D);
        var XD02 = ((LA0Y - XD01) * (RX04.B / RX04.C)) + XD01;
        var XD03 = XD02 - XD00;
        var RX05 = {
            A: XD03,
            B: (MC0Y + XD03) * 2 - XD03,
            C: (MC0Y + XD03) * 2
        };
        var NA0X = LB0X * ((2 * (RX05.B / RX05.C)) - 1);
        var NA0Y = LB0Y * ((2 * (RX05.B / RX05.C)) - 1);
        var NA1X = LB1X * ((2 * (RX05.B / RX05.C)) - 1);
        var NA1Y = LB1Y * ((2 * (RX05.B / RX05.C)) - 1);
        var NA2X = LB2X * ((2 * (RX05.B / RX05.C)) - 1);
        var NA2Y = LB2Y * ((2 * (RX05.B / RX05.C)) - 1);
        var NA0Z = ((LB0Z - MG0Z) * (RX05.B / RX05.C)) + MG0Z;

        var NB0X = ((LA1X + ME0X) * (RX05.B / RX05.C)) - ME0X;
        var NB0Y = ((LA1Y - ME0Y) * (RX05.B / RX05.C)) + ME0Y;
        var NB1X = ME2X * (RX05.A / RX05.C);
        var NB1Y = ((LA0Y + ME2Y) * (RX05.B / RX05.C)) - ME2Y;
        var NB2X = ((LA1X + ME1X) * (RX05.B / RX05.C)) - ME1X;
        var NB2Y = ((LA1Y + ME1Y) * (RX05.B / RX05.C)) - ME1Y;
        var NB0Z = ((LA0Z - ME0Z) * (RX05.B / RX05.C)) + ME0Z;

        var NC0X = 0;//((LC1X + ME7X) * (RX05.B / RX05.C)) - ME7X;
        var NC0Y = ((LC1Y + ME7Y) * (RX05.B / RX05.C)) - ME7Y;
        var NC1X = ((LC2X + ME8X) * (RX05.B / RX05.C)) - ME8X;
        var NC1Y = ((ME8Y - LC2Y) * (RX05.A / RX05.C)) + LC2Y;
        var NC2X = ((LC0X + ME6X) * (RX05.B / RX05.C)) - ME6X;
        var NC2Y = ((LC0Y + ME6Y) * (RX05.B / RX05.C)) - ME6Y;

        var ND0X = LA1X * (RX05.B / RX05.C);
        var ND0Y = ((LA1Y + MF0Y) * (RX05.B / RX05.C)) - MF0Y;
        var ND1X = MF1X * (RX05.A / RX05.C);
        var ND1Y = ((LA0Y + MF1Y) * (RX05.B / RX05.C)) - MF1Y;
        var ND2X = ((LA1X + MF1X) * (RX05.B / RX05.C)) - MF1X;
        var ND2Y = ((LA1Y - MF1Y) * (RX05.B / RX05.C)) + MF1Y;
        var ND0Z = ((LA0Z + MF0Z) * (RX05.B / RX05.C)) - MF0Z;

        var NE0X = ((LC0X - MC4X) * (RX05.B / RX05.C)) + MC4X;
        var NE0Y = ((LC0Y + MC4Y) * (RX05.B / RX05.C)) - MC4Y;
        var NE1X = ((LC1X + MC5X) * (RX05.B / RX05.C)) - MC5X;
        var NE1Y = ((LC1Y + MC5Y) * (RX05.B / RX05.C)) - MC5Y;
        var NE2X = ((LC2X + MC3X) * (RX05.B / RX05.C)) - MC3X;
        var NE2Y = ((LC2Y - MC3Y) * (RX05.B / RX05.C)) + MC3Y;
        var NE0Z = ((MC0Z + LA0Z) * (RX05.A / RX05.C)) - LA0Z;

        this.reles.SA00 = {X: 0,            Y: LA0Y * -1,   Z: LA0Z};
        this.reles.SA01 = {X: LA1X,         Y: LA1Y,        Z: LA0Z};
        this.reles.SA02 = {X: LA1X * -1,    Y: LA1Y,        Z: LA0Z};
        this.reles.SB00 = {X: LB0X,         Y: LB0Y * -1,   Z: LB0Z * -1};
        this.reles.SB01 = {X: LB1X,         Y: LB1Y,        Z: LB0Z * -1};
        this.reles.SB02 = {X: LB2X * -1,    Y: LB2Y,        Z: LB0Z * -1};
        this.reles.SC00 = {X: LC0X,         Y: LC0Y * -1,   Z: LA0Z};
        this.reles.SC01 = {X: LC1X,         Y: LC1Y,        Z: LA0Z};
        this.reles.SC02 = {X: LC2X * -1,    Y: LC2Y * -1,   Z: LA0Z};
        this.reles.SD00 = {X: 0,            Y: 0,           Z: LD0Z * -1};
        this.reles.SF00 = {X: LF00,         Y: LF01 * -1,   Z: LA0Z * -1};
        this.reles.SF01 = {X: LF02 * -1,    Y: LF03,        Z: LA0Z * -1};
        this.reles.SF02 = {X: LF04 * -1,    Y: LF05 * -1,   Z: LA0Z * -1};
        this.reles.SO00 = {X: LO00,         Y: LO01 * -1,   Z: LO06 * -1};
        this.reles.SO01 = {X: LO02,         Y: LO03,        Z: LO06 * -1};
        this.reles.SO02 = {X: LO04 * -1,    Y: LO05,        Z: LO06 * -1};
        this.reles.TC00 = {X: 0,            Y: MC0Y * -1,   Z: MC0Z * -1};
        this.reles.TC01 = {X: MC1X,         Y: MC1Y,        Z: MC0Z * -1};
        this.reles.TC02 = {X: MC1X * -1,    Y: MC1Y,        Z: MC0Z * -1};
        this.reles.TC03 = {X: MC3X,         Y: MC3Y * -1,   Z: MC0Z * -1};
        this.reles.TC04 = {X: MC4X,         Y: MC4Y,        Z: MC0Z * -1};
        this.reles.TC05 = {X: MC5X * -1,    Y: MC5Y * -1,   Z: MC0Z * -1};
        this.reles.TD00 = {X: MD0X,         Y: MD0Y * -1,   Z: MD0Z * -1};
        this.reles.TD01 = {X: MD1X,         Y: MD1Y,        Z: MD0Z * -1};
        this.reles.TD02 = {X: MD2X * -1,    Y: MD2Y * -1,   Z: MD0Z * -1};
        this.reles.TD03 = {X: MD3X * -1,    Y: MD3Y * -1,   Z: MD0Z * -1};
        this.reles.TD04 = {X: MD4X,         Y: MD4Y,        Z: MD0Z * -1};
        this.reles.TD05 = {X: MD5X * -1,    Y: MD5Y,        Z: MD0Z * -1};
        this.reles.TE00 = {X: ME0X,         Y: ME0Y * -1,   Z: ME0Z * -1};
        this.reles.TE01 = {X: ME1X * -1,    Y: ME1Y,        Z: ME0Z * -1};
        this.reles.TE02 = {X: ME2X * -1,    Y: ME2Y * -1,   Z: ME0Z * -1};
        this.reles.TE03 = {X: ME2X,         Y: ME2Y * -1,   Z: ME0Z * -1};
        this.reles.TE04 = {X: ME1X,         Y: ME1Y,        Z: ME0Z * -1};
        this.reles.TE05 = {X: ME0X * -1,    Y: ME0Y * -1,   Z: ME0Z * -1};
        this.reles.TE06 = {X: ME6X,         Y: ME6Y * -1,   Z: ME0Z * -1};
        this.reles.TE07 = {X: ME7X,         Y: ME7Y,        Z: ME0Z * -1};
        this.reles.TE08 = {X: ME8X * -1,    Y: ME8Y,        Z: ME0Z * -1};
        this.reles.TF00 = {X: 0,            Y: MF0Y * -1,   Z: MF0Z * -1};
        this.reles.TF01 = {X: MF1X,         Y: MF1Y,        Z: MF0Z * -1};
        this.reles.TF02 = {X: MF1X * -1,    Y: MF1Y,        Z: MF0Z * -1};
        this.reles.TF03 = {X: MF3X,         Y: MF3Y * -1,   Z: MF0Z * -1};
        this.reles.TF04 = {X: MF4X,         Y: MF4Y,        Z: MF0Z * -1};
        this.reles.TF05 = {X: MF5X * -1,    Y: MF5Y * -1,   Z: MF0Z * -1};
        this.reles.TG00 = {X: LB2X,         Y: LB2Y * -1,   Z: MG0Z * -1};
        this.reles.TG01 = {X: LB0X * -1,    Y: LB0Y,        Z: MG0Z * -1};
        this.reles.TG02 = {X: LB1X * -1,    Y: LB1Y * -1,   Z: MG0Z * -1};
        this.reles.CA00 = {X: NA0X,         Y: NA0Y * -1,   Z: NA0Z * -1};
        this.reles.CA01 = {X: NA1X,         Y: NA1Y,        Z: NA0Z * -1};
        this.reles.CA02 = {X: NA2X * -1,    Y: NA2Y,        Z: NA0Z * -1};
        this.reles.CB00 = {X: NB0X,         Y: NB0Y * -1,   Z: NB0Z * -1};
        this.reles.CB01 = {X: NB1X,         Y: NB1Y,        Z: NB0Z * -1};
        this.reles.CB02 = {X: NB2X * -1,    Y: NB2Y * -1,   Z: NB0Z * -1};
        this.reles.CC00 = {X: NC0X * -1,    Y: NC0Y * -1,   Z: NB0Z * -1};
        this.reles.CC01 = {X: NC1X,         Y: NC1Y,        Z: NB0Z * -1};
        this.reles.CC02 = {X: NC2X * -1,    Y: NC2Y,        Z: NB0Z * -1};
        this.reles.CD00 = {X: ND0X,         Y: ND0Y * -1,   Z: ND0Z * -1};
        this.reles.CD01 = {X: ND1X * -1,    Y: ND1Y,        Z: ND0Z * -1};
        this.reles.CD02 = {X: ND2X * -1,    Y: ND2Y * -1,   Z: ND0Z * -1};
        this.reles.CE00 = {X: NE0X,         Y: NE0Y * -1,   Z: NE0Z * -1};
        this.reles.CE01 = {X: NE1X,         Y: NE1Y,        Z: NE0Z * -1};
        this.reles.CE02 = {X: NE2X * -1,    Y: NE2Y * -1,   Z: NE0Z * -1};

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
            S00A:   [this.reles.SD00,   this.reles.TC00,    this.reles.SB00,    this.reles.SF02],
            S01A:   [this.reles.SD00,   this.reles.TC01,    this.reles.SB01,    this.reles.SF00],
            S02A:   [this.reles.SD00,   this.reles.TC02,    this.reles.SB02,    this.reles.SF01],
            S03A:   [this.reles.SD00,   this.reles.TC03,    this.reles.SB00,    this.reles.SF00],
            S04A:   [this.reles.SD00,   this.reles.TC04,    this.reles.SB01,    this.reles.SF01],
            S05A:   [this.reles.SD00,   this.reles.TC05,    this.reles.SB02,    this.reles.SF02],
            S00R:   [this.reles.SD00R,  this.reles.TC00R,   this.reles.SB00R,   this.reles.SF02R],
            S01R:   [this.reles.SD00R,  this.reles.TC01R,   this.reles.SB01R,   this.reles.SF00R],
            S02R:   [this.reles.SD00R,  this.reles.TC02R,   this.reles.SB02R,   this.reles.SF01R],
            S03R:   [this.reles.SD00R,  this.reles.TC03R,   this.reles.SB00R,   this.reles.SF00R],
            S04R:   [this.reles.SD00R,  this.reles.TC04R,   this.reles.SB01R,   this.reles.SF01R],
            S05R:   [this.reles.SD00R,  this.reles.TC05R,   this.reles.SB02R,   this.reles.SF02R],

            S06A:   [this.reles.SB00,   this.reles.TD00,    this.reles.SA02R,   this.reles.SF00],
            S07A:   [this.reles.SB01,   this.reles.TD01,    this.reles.SA00R,   this.reles.SF01],
            S08A:   [this.reles.SB02,   this.reles.TD02,    this.reles.SA01R,   this.reles.SF02],
            S09A:   [this.reles.SB00,   this.reles.TD03,    this.reles.SC01R,   this.reles.SF02],
            S10A:   [this.reles.SB01,   this.reles.TD04,    this.reles.SC02R,   this.reles.SF00],
            S11A:   [this.reles.SB02,   this.reles.TD05,    this.reles.SC00R,   this.reles.SF01],
            S06R:   [this.reles.SB00R,  this.reles.TD00R,   this.reles.SA02,    this.reles.SF00R],
            S07R:   [this.reles.SB01R,  this.reles.TD01R,   this.reles.SA00,    this.reles.SF01R],
            S08R:   [this.reles.SB02R,  this.reles.TD02R,   this.reles.SA01,    this.reles.SF02R],
            S09R:   [this.reles.SB00R,  this.reles.TD03R,   this.reles.SC01,    this.reles.SF02R],
            S10R:   [this.reles.SB01R,  this.reles.TD04R,   this.reles.SC02,    this.reles.SF00R],
            S11R:   [this.reles.SB02R,  this.reles.TD05R,   this.reles.SC00,    this.reles.SF01R],

            S12A:   [this.reles.SA02R,  this.reles.SF00,    this.reles.SC02R,   this.reles.TE00],
            S13A:   [this.reles.SA00R,  this.reles.SF01,    this.reles.SC00R,   this.reles.TE01],
            S14A:   [this.reles.SA01R,  this.reles.SF02,    this.reles.SC01R,   this.reles.TE02],
            S12R:   [this.reles.SA02,   this.reles.SF00R,   this.reles.SC02,    this.reles.TE00R],
            S13R:   [this.reles.SA00,   this.reles.SF01R,   this.reles.SC00,    this.reles.TE01R],
            S14R:   [this.reles.SA01,   this.reles.SF02R,   this.reles.SC01,    this.reles.TE02R],

            S15A:   [this.reles.SA02R,  this.reles.SO00,    this.reles.SB00,    this.reles.TE03],
            S16A:   [this.reles.SA00R,  this.reles.SO01,    this.reles.SB01,    this.reles.TE04],
            S17A:   [this.reles.SA01R,  this.reles.SO02,    this.reles.SB02,    this.reles.TE05],
            S15R:   [this.reles.SA02,   this.reles.SO00R,   this.reles.SB00R,   this.reles.TE03R],
            S16R:   [this.reles.SA00,   this.reles.SO01R,   this.reles.SB01R,   this.reles.TE04R],
            S17R:   [this.reles.SA01,   this.reles.SO02R,   this.reles.SB02R,   this.reles.TE05R],

            S18A:   [this.reles.SB00,   this.reles.SO00,    this.reles.SC01R,   this.reles.TE06],
            S19A:   [this.reles.SB01,   this.reles.SO01,    this.reles.SC02R,   this.reles.TE07],
            S20A:   [this.reles.SB02,   this.reles.SO02,    this.reles.SC00R,   this.reles.TE08],
            S18R:   [this.reles.SB00R,  this.reles.SO00R,   this.reles.SC01,    this.reles.TE06R],
            S19R:   [this.reles.SB01R,  this.reles.SO01R,   this.reles.SC02,    this.reles.TE07R],
            S20R:   [this.reles.SB02R,  this.reles.SO02R,   this.reles.SC00,    this.reles.TE08R],

            S21A:   [this.reles.SA00,   this.reles.SO00,    this.reles.SC01R,   this.reles.TF00],
            S22A:   [this.reles.SA01,   this.reles.SO01,    this.reles.SC02R,   this.reles.TF01],
            S23A:   [this.reles.SA02,   this.reles.SO02,    this.reles.SC00R,   this.reles.TF02],
            S24A:   [this.reles.SA02R,  this.reles.SO00,    this.reles.SC00,    this.reles.TF03],
            S25A:   [this.reles.SA00R,  this.reles.SO01,    this.reles.SC01,    this.reles.TF04],
            S26A:   [this.reles.SA01R,  this.reles.SO02,    this.reles.SC02,    this.reles.TF05],
            S21R:   [this.reles.SA00R,  this.reles.SO00R,   this.reles.SC01,    this.reles.TF00R],
            S22R:   [this.reles.SA01R,  this.reles.SO01R,   this.reles.SC02,    this.reles.TF01R],
            S23R:   [this.reles.SA02R,  this.reles.SO02R,   this.reles.SC00,    this.reles.TF02R],
            S24R:   [this.reles.SA02,   this.reles.SO00R,   this.reles.SC00R,   this.reles.TF03R],
            S25R:   [this.reles.SA00,   this.reles.SO01R,   this.reles.SC01R,   this.reles.TF04R],
            S26R:   [this.reles.SA01,   this.reles.SO02R,   this.reles.SC02R,   this.reles.TF05R],

            S27A:   [this.reles.SA02R,  this.reles.SO02R,   this.reles.SC02R,   this.reles.TG00],
            S28A:   [this.reles.SA00R,  this.reles.SO00R,   this.reles.SC00R,   this.reles.TG01],
            S29A:   [this.reles.SA01R,  this.reles.SO01R,   this.reles.SC01R,   this.reles.TG02],
            S27R:   [this.reles.SA02,   this.reles.SO02,    this.reles.SC02,    this.reles.TG00R],
            S28R:   [this.reles.SA00,   this.reles.SO00,    this.reles.SC00,    this.reles.TG01R],
            S29R:   [this.reles.SA01,   this.reles.SO01,    this.reles.SC01,    this.reles.TG02R],

            C00A:   [this.reles.SD00,   this.reles.TC00,    this.reles.CA00],
            C01A:   [this.reles.SD00,   this.reles.TC01,    this.reles.CA01],
            C02A:   [this.reles.SD00,   this.reles.TC02,    this.reles.CA02],
            C03A:   [this.reles.SD00,   this.reles.TC03,    this.reles.CA00],
            C04A:   [this.reles.SD00,   this.reles.TC04,    this.reles.CA01],
            C05A:   [this.reles.SD00,   this.reles.TC05,    this.reles.CA02],
            C00R:   [this.reles.SD00R,  this.reles.TC00R,   this.reles.CA00R],
            C01R:   [this.reles.SD00R,  this.reles.TC01R,   this.reles.CA01R],
            C02R:   [this.reles.SD00R,  this.reles.TC02R,   this.reles.CA02R],
            C03R:   [this.reles.SD00R,  this.reles.TC03R,   this.reles.CA00R],
            C04R:   [this.reles.SD00R,  this.reles.TC04R,   this.reles.CA01R],
            C05R:   [this.reles.SD00R,  this.reles.TC05R,   this.reles.CA02R],

            C06A:   [this.reles.SB00,   this.reles.TC00,    this.reles.CA00],
            C07A:   [this.reles.SB01,   this.reles.TC01,    this.reles.CA01],
            C08A:   [this.reles.SB02,   this.reles.TC02,    this.reles.CA02],
            C09A:   [this.reles.SB00,   this.reles.TC03,    this.reles.CA00],
            C10A:   [this.reles.SB01,   this.reles.TC04,    this.reles.CA01],
            C11A:   [this.reles.SB02,   this.reles.TC05,    this.reles.CA02],
            C06R:   [this.reles.SB00R,  this.reles.TC00R,   this.reles.CA00R],
            C07R:   [this.reles.SB01R,  this.reles.TC01R,   this.reles.CA01R],
            C08R:   [this.reles.SB02R,  this.reles.TC02R,   this.reles.CA02R],
            C09R:   [this.reles.SB00R,  this.reles.TC03R,   this.reles.CA00R],
            C10R:   [this.reles.SB01R,  this.reles.TC04R,   this.reles.CA01R],
            C11R:   [this.reles.SB02R,  this.reles.TC05R,   this.reles.CA02R],

            C12A:   [this.reles.SA02R,  this.reles.TE03,    this.reles.CB00],
            C13A:   [this.reles.SA00R,  this.reles.TE04,    this.reles.CB01],
            C14A:   [this.reles.SA01R,  this.reles.TE05,    this.reles.CB02],
            C15A:   [this.reles.SA02R,  this.reles.TD00,    this.reles.CB00],
            C16A:   [this.reles.SA00R,  this.reles.TD01,    this.reles.CB01],
            C17A:   [this.reles.SA01R,  this.reles.TD02,    this.reles.CB02],
            C12R:   [this.reles.SA02,   this.reles.TE03R,   this.reles.CB00R],
            C13R:   [this.reles.SA00,   this.reles.TE04R,   this.reles.CB01R],
            C14R:   [this.reles.SA01,   this.reles.TE05R,   this.reles.CB02R],
            C15R:   [this.reles.SA02,   this.reles.TD00R,   this.reles.CB00R],
            C16R:   [this.reles.SA00,   this.reles.TD01R,   this.reles.CB01R],
            C17R:   [this.reles.SA01,   this.reles.TD02R,   this.reles.CB02R],

            C18A:   [this.reles.SB00,   this.reles.TE03,    this.reles.CB00],
            C19A:   [this.reles.SB01,   this.reles.TE04,    this.reles.CB01],
            C20A:   [this.reles.SB02,   this.reles.TE05,    this.reles.CB02],
            C21A:   [this.reles.SB00,   this.reles.TD00,    this.reles.CB00],
            C22A:   [this.reles.SB01,   this.reles.TD01,    this.reles.CB01],
            C23A:   [this.reles.SB02,   this.reles.TD02,    this.reles.CB02],
            C18R:   [this.reles.SB00R,  this.reles.TE03R,   this.reles.CB00R],
            C19R:   [this.reles.SB01R,  this.reles.TE04R,   this.reles.CB01R],
            C20R:   [this.reles.SB02R,  this.reles.TE05R,   this.reles.CB02R],
            C21R:   [this.reles.SB00R,  this.reles.TD00R,   this.reles.CB00R],
            C22R:   [this.reles.SB01R,  this.reles.TD01R,   this.reles.CB01R],
            C23R:   [this.reles.SB02R,  this.reles.TD02R,   this.reles.CB02R],

            C24A:   [this.reles.SC01R,  this.reles.TE06,    this.reles.CC00],
            C25A:   [this.reles.SC02R,  this.reles.TE07,    this.reles.CC01],
            C26A:   [this.reles.SC00R,  this.reles.TE08,    this.reles.CC02],
            C27A:   [this.reles.SC01R,  this.reles.TD03,    this.reles.CC00],
            C28A:   [this.reles.SC02R,  this.reles.TD04,    this.reles.CC01],
            C29A:   [this.reles.SC00R,  this.reles.TD05,    this.reles.CC02],
            C24R:   [this.reles.SC01,   this.reles.TE06R,   this.reles.CC00R],
            C25R:   [this.reles.SC02,   this.reles.TE07R,   this.reles.CC01R],
            C26R:   [this.reles.SC00,   this.reles.TE08R,   this.reles.CC02R],
            C27R:   [this.reles.SC01,   this.reles.TD03R,   this.reles.CC00R],
            C28R:   [this.reles.SC02,   this.reles.TD04R,   this.reles.CC01R],
            C29R:   [this.reles.SC00,   this.reles.TD05R,   this.reles.CC02R],

            C30A:   [this.reles.SB00,   this.reles.TE06,    this.reles.CC00],
            C31A:   [this.reles.SB01,   this.reles.TE07,    this.reles.CC01],
            C32A:   [this.reles.SB02,   this.reles.TE08,    this.reles.CC02],
            C33A:   [this.reles.SB00,   this.reles.TD03,    this.reles.CC00],
            C34A:   [this.reles.SB01,   this.reles.TD04,    this.reles.CC01],
            C35A:   [this.reles.SB02,   this.reles.TD05,    this.reles.CC02],
            C30R:   [this.reles.SB00R,  this.reles.TE06R,   this.reles.CC00R],
            C31R:   [this.reles.SB01R,  this.reles.TE07R,   this.reles.CC01R],
            C32R:   [this.reles.SB02R,  this.reles.TE08R,   this.reles.CC02R],
            C33R:   [this.reles.SB00R,  this.reles.TD03R,   this.reles.CC00R],
            C34R:   [this.reles.SB01R,  this.reles.TD04R,   this.reles.CC01R],
            C35R:   [this.reles.SB02R,  this.reles.TD05R,   this.reles.CC02R],

            C36A:   [this.reles.SA02R,  this.reles.TG00,    this.reles.CD00],
            C37A:   [this.reles.SA00R,  this.reles.TG01,    this.reles.CD01],
            C38A:   [this.reles.SA01R,  this.reles.TG02,    this.reles.CD02],
            C39A:   [this.reles.SA02R,  this.reles.TE00,    this.reles.CD00],
            C40A:   [this.reles.SA00R,  this.reles.TE01,    this.reles.CD01],
            C41A:   [this.reles.SA01R,  this.reles.TE02,    this.reles.CD02],
            C36R:   [this.reles.SA02,   this.reles.TG00R,   this.reles.CD00R],
            C37R:   [this.reles.SA00,   this.reles.TG01R,   this.reles.CD01R],
            C38R:   [this.reles.SA01,   this.reles.TG02R,   this.reles.CD02R],
            C39R:   [this.reles.SA02,   this.reles.TE00R,   this.reles.CD00R],
            C40R:   [this.reles.SA00,   this.reles.TE01R,   this.reles.CD01R],
            C41R:   [this.reles.SA01,   this.reles.TE02R,   this.reles.CD02R],

            C42A:   [this.reles.SC02R,  this.reles.TG00,    this.reles.CD00],
            C43A:   [this.reles.SC00R,  this.reles.TG01,    this.reles.CD01],
            C44A:   [this.reles.SC01R,  this.reles.TG02,    this.reles.CD02],
            C45A:   [this.reles.SC02R,  this.reles.TE00,    this.reles.CD00],
            C46A:   [this.reles.SC00R,  this.reles.TE01,    this.reles.CD01],
            C47A:   [this.reles.SC01R,  this.reles.TE02,    this.reles.CD02],
            C42R:   [this.reles.SC02,   this.reles.TG00R,   this.reles.CD00R],
            C43R:   [this.reles.SC00,   this.reles.TG01R,   this.reles.CD01R],
            C44R:   [this.reles.SC01,   this.reles.TG02R,   this.reles.CD02R],
            C45R:   [this.reles.SC02,   this.reles.TE00R,   this.reles.CD00R],
            C46R:   [this.reles.SC00,   this.reles.TE01R,   this.reles.CD01R],
            C47R:   [this.reles.SC01,   this.reles.TE02R,   this.reles.CD02R],

            C48A:   [this.reles.SC00,   this.reles.TF03,    this.reles.CE00],
            C49A:   [this.reles.SC01,   this.reles.TF04,    this.reles.CE01],
            C50A:   [this.reles.SC02,   this.reles.TF05,    this.reles.CE02],
            C51A:   [this.reles.SC00,   this.reles.TF02R,   this.reles.CE00],
            C52A:   [this.reles.SC01,   this.reles.TF00R,   this.reles.CE01],
            C53A:   [this.reles.SC02,   this.reles.TF01R,   this.reles.CE02],
            C48R:   [this.reles.SC00R,  this.reles.TF03R,   this.reles.CE00R],
            C49R:   [this.reles.SC01R,  this.reles.TF04R,   this.reles.CE01R],
            C50R:   [this.reles.SC02R,  this.reles.TF05R,   this.reles.CE02R],
            C51R:   [this.reles.SC00R,  this.reles.TF02,    this.reles.CE00R],
            C52R:   [this.reles.SC01R,  this.reles.TF00,    this.reles.CE01R],
            C53R:   [this.reles.SC02R,  this.reles.TF01,    this.reles.CE02R],

            C54A:   [this.reles.SA02R,  this.reles.TF03,    this.reles.CE00],
            C55A:   [this.reles.SA00R,  this.reles.TF04,    this.reles.CE01],
            C56A:   [this.reles.SA01R,  this.reles.TF05,    this.reles.CE02],
            C57A:   [this.reles.SA02R,  this.reles.TF02R,   this.reles.CE00],
            C58A:   [this.reles.SA00R,  this.reles.TF00R,   this.reles.CE01],
            C59A:   [this.reles.SA01R,  this.reles.TF01R,   this.reles.CE02],
            C54R:   [this.reles.SA02,   this.reles.TF03R,   this.reles.CE00R],
            C55R:   [this.reles.SA00,   this.reles.TF04R,   this.reles.CE01R],
            C56R:   [this.reles.SA01,   this.reles.TF05R,   this.reles.CE02R],
            C57R:   [this.reles.SA02,   this.reles.TF02,    this.reles.CE00R],
            C58R:   [this.reles.SA00,   this.reles.TF00,    this.reles.CE01R],
            C59R:   [this.reles.SA01,   this.reles.TF01,    this.reles.CE02R],
        };

        this.surfaces3 = {
        };

        this.surfaces2 = {
            T01A:   [this.reles.SD00,   this.reles.SB00,    this.reles.SA02R,   this.reles.SC02R,   this.reles.SB01],
            T02A:   [this.reles.SD00,   this.reles.SB01,    this.reles.SA00R,   this.reles.SC00R,   this.reles.SB02],
            T03A:   [this.reles.SD00,   this.reles.SB02,    this.reles.SA01R,   this.reles.SC01R,   this.reles.SB00],
            T01R:   [this.reles.SD00R,  this.reles.SB00R,   this.reles.SA02,    this.reles.SC02,    this.reles.SB01R],
            T02R:   [this.reles.SD00R,  this.reles.SB01R,   this.reles.SA00,    this.reles.SC00,    this.reles.SB02R],
            T03R:   [this.reles.SD00R,  this.reles.SB02R,   this.reles.SA01,    this.reles.SC01,    this.reles.SB00R],

            T04A:   [this.reles.SB00,   this.reles.SC01R,   this.reles.SA00,    this.reles.SC00,    this.reles.SA02R],
            T05A:   [this.reles.SB01,   this.reles.SC02R,   this.reles.SA01,    this.reles.SC01,    this.reles.SA00R],
            T06A:   [this.reles.SB02,   this.reles.SC00R,   this.reles.SA02,    this.reles.SC02,    this.reles.SA01R],
            T04R:   [this.reles.SB00R,  this.reles.SC01,    this.reles.SA00R,   this.reles.SC00R,   this.reles.SA02],
            T05R:   [this.reles.SB01R,  this.reles.SC02,    this.reles.SA01R,   this.reles.SC01R,   this.reles.SA00],
            T06R:   [this.reles.SB02R,  this.reles.SC00,    this.reles.SA02R,   this.reles.SC02R,   this.reles.SA01],
        };
    },
/*output: function(x, y, z)
{
    this.canvas_context.setTransform(1, 0, 0, 1, 0, 0);
    this.canvas_context.clearRect(0, 0, this.size, this.size);
    //this._output(this.surfaces2, this.fill_style2,   this.stroke_style2, x, y, z);
    //this._output(this.surfaces3, this.fill_style3,   this.stroke_style3, x, y, z);
    this._output(this.surfaces,  this.fill_style,    this.stroke_style,  x, y, z);

    this.lockOn('SF00', x, y, z);
},*/

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
