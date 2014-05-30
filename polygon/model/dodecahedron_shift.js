/**
 * 正十二面体
 *
 */
var DodecahedronShift = function()
{
};


DodecahedronShift.prototype = {
    // 外部設定値
    fill_style:     'rgba(120, 255, 160, 0.0)',
    stroke_style:   'rgb(96, 192, 128)',




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

        var LB00 = LA02;
        var LB01 = (LA00 * (RA00.D / RA00.C)) - LA01;
        var LB02 = LA02 * (RA00.B / RA00.C);
        var LB03 = LA01 * (RA00.D / RA00.B);
        var LB04 = LA02 * (RA00.D / RA00.C);
        var LB05 = ((LA02 * 2) * (RA01.B / RA01.C)) - LB03;

        var LC00 = getLengthByPytha(null, LB04, LB02);
        var RX00 = {
            A: LB02,
            B: LB04,
            C: LC00
        };
        var LB06 = LB02 * (RX00.B / RX00.C);
        var LA03 = ((LC00 - LB06) * (RA00.C / RA00.D)) + LB06;

        this.reles.A00 = {X: 0,         Y: LA00 * -1,   Z: LA03 * -1};
        this.reles.A01 = {X: LA02,      Y: LA01,        Z: LA03 * -1};
        this.reles.A02 = {X: LA02 * -1, Y: LA01,        Z: LA03 * -1};
        this.reles.B00 = {X: LB00,      Y: LB01 * -1,   Z: LB06 * -1};
        this.reles.B01 = {X: LB02,      Y: LB03,        Z: LB06 * -1};
        this.reles.B02 = {X: LB04 * -1, Y: LB05 * -1,   Z: LB06 * -1};
        this.reles.B03 = {X: LB00 * -1, Y: LB01 * -1,   Z: LB06 * -1};
        this.reles.B04 = {X: LB04,      Y: LB05 * -1,   Z: LB06 * -1};
        this.reles.B05 = {X: LB02 * -1, Y: LB03,        Z: LB06 * -1};
        this.reles.C00 = {X: 0,         Y: 0,           Z: LC00 * -1};

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
            S00A:   [this.reles.A00,    this.reles.B00,     this.reles.B04,     this.reles.A01,     this.reles.C00],
            S01A:   [this.reles.A01,    this.reles.B01,     this.reles.B05,     this.reles.A02,     this.reles.C00],
            S02A:   [this.reles.A02,    this.reles.B02,     this.reles.B03,     this.reles.A00,     this.reles.C00],
            S00R:   [this.reles.A00R,   this.reles.B00R,    this.reles.B04R,    this.reles.A01R,    this.reles.C00R],
            S01R:   [this.reles.A01R,   this.reles.B01R,    this.reles.B05R,    this.reles.A02R,    this.reles.C00R],
            S02R:   [this.reles.A02R,   this.reles.B02R,    this.reles.B03R,    this.reles.A00R,    this.reles.C00R],

            S03A:   [this.reles.A00,    this.reles.B03,     this.reles.B01R,    this.reles.B05R,    this.reles.B00],
            S04A:   [this.reles.A01,    this.reles.B04,     this.reles.B02R,    this.reles.B03R,    this.reles.B01],
            S05A:   [this.reles.A02,    this.reles.B05,     this.reles.B00R,    this.reles.B04R,    this.reles.B02],
            S03R:   [this.reles.A00R,   this.reles.B03R,    this.reles.B01,     this.reles.B05,     this.reles.B00R],
            S04R:   [this.reles.A01R,   this.reles.B04R,    this.reles.B02,     this.reles.B03,     this.reles.B01R],
            S05R:   [this.reles.A02R,   this.reles.B05R,    this.reles.B00,     this.reles.B04,     this.reles.B02R],
        };
    }
};
