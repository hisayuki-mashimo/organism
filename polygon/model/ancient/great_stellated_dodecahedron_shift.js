/**
 * 大星型十二面体
 *
 */
var GreatStellatedDodecahedronShift = function()
{
};


GreatStellatedDodecahedronShift.prototype = {
    // 外部設定値
    fill_style:     'rgba(224, 156, 184, 0.8)',
    stroke_style:   'rgba(176, 116, 148, 1.0)',




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

        var XA00 = this.alpha;
        var XA01 = XA00 * sin072;
        var XA02 = XA01 * (RA00.A / RA00.D);
        var LA00 = XA02 * (RA01.C / RA01.B);
        var LA01 = XA02 * (RA01.A / RA01.B);
        var LA02 = XA02;

        var XB00 = XA01 * (RA00.B / RA00.C);
        var LB00 = XB00 * (RA01.C / RA01.B);
        var LB01 = XB00 * (RA01.A / RA01.B);
        var LB02 = XB00;

        var LC00 = ((XA01 + LA02) * (RA01.A / RA01.C)) - LA02;
        var LC01 = ((XA01 + LA02) * (RA01.B / RA01.C)) - LA01;
        var LC02 = (XA01 + LA02) * (RA01.A / RA01.C);
        var LC03 = ((XA01 + LA02) * (RA01.B / RA01.C)) - LA00;
        var LC04 = XA01;
        var LC05 = LA01;

        var LD00 = LB00 * (RA00.C / RA00.D);
        var LD01 = LD00 * (RA01.A / RA01.C);
        var LD02 = LD00 * (RA01.B / RA01.C);

        var XC00 = getLengthByPytha((XA01 - LA02), LA00, null);
        var XC01 = getLengthByPytha((XA01 + LA02), LD00, null);
        var LD03 = getLengthByPytha(LA02, LD01, null);
        var LE00 = XC01 - LD03;
        var LA03 = LE00 - XC00;
        var LB03 = XC00 + LD03;

        this.reles.A00 = {X: 0,         Y: LA00 * -1,   Z: LA03 * -1};
        this.reles.A01 = {X: LA02,      Y: LA01,        Z: LA03 * -1};
        this.reles.A02 = {X: LA02 * -1, Y: LA01,        Z: LA03 * -1};
        this.reles.B00 = {X: 0,         Y: LB00 * -1,   Z: LB03};
        this.reles.B01 = {X: LB02,      Y: LB01,        Z: LB03};
        this.reles.B02 = {X: LB02 * -1, Y: LB01,        Z: LB03};
        this.reles.C00 = {X: LC00,      Y: LC01 * -1,   Z: LA03 * -1};
        this.reles.C01 = {X: LC02,      Y: LC03,        Z: LA03 * -1};
        this.reles.C02 = {X: LC04 * -1, Y: LC05,        Z: LA03 * -1};
        this.reles.C03 = {X: LC00 * -1, Y: LC01 * -1,   Z: LA03 * -1};
        this.reles.C04 = {X: LC04,      Y: LC05,        Z: LA03 * -1};
        this.reles.C05 = {X: LC02 * -1, Y: LC03,        Z: LA03 * -1};
        this.reles.D00 = {X: 0,         Y: LD00 * -1,   Z: LD03};
        this.reles.D01 = {X: LD02,      Y: LD01,        Z: LD03};
        this.reles.D02 = {X: LD02 * -1, Y: LD01,        Z: LD03};
        this.reles.E00 = {X: 0,         Y: 0,           Z: LE00 * -1};

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
            S00A:   [this.reles.A00,    this.reles.A01,     this.reles.E00],
            S01A:   [this.reles.A01,    this.reles.A02,     this.reles.E00],
            S02A:   [this.reles.A02,    this.reles.A00,     this.reles.E00],
            S00R:   [this.reles.A00R,   this.reles.A01R,    this.reles.E00R],
            S01R:   [this.reles.A01R,   this.reles.A02R,    this.reles.E00R],
            S02R:   [this.reles.A02R,   this.reles.A00R,    this.reles.E00R],

            S03A:   [this.reles.B00R,   this.reles.A02,     this.reles.A01],
            S04A:   [this.reles.B01R,   this.reles.A00,     this.reles.A02],
            S05A:   [this.reles.B02R,   this.reles.A01,     this.reles.A00],
            S03R:   [this.reles.B00,    this.reles.A02R,    this.reles.A01R],
            S04R:   [this.reles.B01,    this.reles.A00R,    this.reles.A02R],
            S05R:   [this.reles.B02,    this.reles.A01R,    this.reles.A00R],

            S06A:   [this.reles.A00,    this.reles.D00,     this.reles.C00],
            S07A:   [this.reles.A01,    this.reles.D01,     this.reles.C01],
            S08A:   [this.reles.A02,    this.reles.D02,     this.reles.C02],
            S09A:   [this.reles.A00,    this.reles.D00,     this.reles.C03],
            S10A:   [this.reles.A01,    this.reles.D01,     this.reles.C04],
            S11A:   [this.reles.A02,    this.reles.D02,     this.reles.C05],
            S06R:   [this.reles.A00R,   this.reles.D00R,    this.reles.C00R],
            S07R:   [this.reles.A01R,   this.reles.D01R,    this.reles.C01R],
            S08R:   [this.reles.A02R,   this.reles.D02R,    this.reles.C02R],
            S09R:   [this.reles.A00R,   this.reles.D00R,    this.reles.C03R],
            S10R:   [this.reles.A01R,   this.reles.D01R,    this.reles.C04R],
            S11R:   [this.reles.A02R,   this.reles.D02R,    this.reles.C05R],

            S12A:   [this.reles.D00,    this.reles.A02R,    this.reles.B00],
            S13A:   [this.reles.D01,    this.reles.A00R,    this.reles.B01],
            S14A:   [this.reles.D02,    this.reles.A01R,    this.reles.B02],
            S15A:   [this.reles.D00,    this.reles.A01R,    this.reles.B00],
            S16A:   [this.reles.D01,    this.reles.A02R,    this.reles.B01],
            S17A:   [this.reles.D02,    this.reles.A00R,    this.reles.B02],
            S12R:   [this.reles.D00R,   this.reles.A02,     this.reles.B00R],
            S13R:   [this.reles.D01R,   this.reles.A00,     this.reles.B01R],
            S14R:   [this.reles.D02R,   this.reles.A01,     this.reles.B02R],
            S15R:   [this.reles.D00R,   this.reles.A01,     this.reles.B00R],
            S16R:   [this.reles.D01R,   this.reles.A02,     this.reles.B01R],
            S17R:   [this.reles.D02R,   this.reles.A00,     this.reles.B02R],

            S18A:   [this.reles.A00,    this.reles.D02R,    this.reles.C00],
            S19A:   [this.reles.A01,    this.reles.D00R,    this.reles.C01],
            S20A:   [this.reles.A02,    this.reles.D01R,    this.reles.C02],
            S21A:   [this.reles.A00,    this.reles.D01R,    this.reles.C03],
            S22A:   [this.reles.A01,    this.reles.D02R,    this.reles.C04],
            S23A:   [this.reles.A02,    this.reles.D00R,    this.reles.C05],
            S18R:   [this.reles.A00R,   this.reles.D02,     this.reles.C00R],
            S19R:   [this.reles.A01R,   this.reles.D00,     this.reles.C01R],
            S20R:   [this.reles.A02R,   this.reles.D01,     this.reles.C02R],
            S21R:   [this.reles.A00R,   this.reles.D01,     this.reles.C03R],
            S22R:   [this.reles.A01R,   this.reles.D02,     this.reles.C04R],
            S23R:   [this.reles.A02R,   this.reles.D00,     this.reles.C05R],

            S24A:   [this.reles.D00,    this.reles.D02R,    this.reles.C05R],
            S25A:   [this.reles.D01,    this.reles.D00R,    this.reles.C03R],
            S26A:   [this.reles.D02,    this.reles.D01R,    this.reles.C04R],
            S27A:   [this.reles.D00,    this.reles.D01R,    this.reles.C01R],
            S28A:   [this.reles.D01,    this.reles.D02R,    this.reles.C02R],
            S29A:   [this.reles.D02,    this.reles.D00R,    this.reles.C00R],
            S24R:   [this.reles.D00R,   this.reles.D02,     this.reles.C05],
            S25R:   [this.reles.D01R,   this.reles.D00,     this.reles.C03],
            S26R:   [this.reles.D02R,   this.reles.D01,     this.reles.C04],
            S27R:   [this.reles.D00R,   this.reles.D01,     this.reles.C01],
            S28R:   [this.reles.D01R,   this.reles.D02,     this.reles.C02],
            S29R:   [this.reles.D02R,   this.reles.D00,     this.reles.C00],
        };
    }
};
