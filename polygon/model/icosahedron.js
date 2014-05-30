var Icosahedron = function()
{
};


Icosahedron.prototype = {
    // 外部設定値
    fill_style:     'rgba(192, 192, 255, 0.8)',
    stroke_style:   'rgb(128, 128, 240)',




    /**
     * 初期化
     *
     */
    configure: function()
    {
        var getLengthByPytha = this.basis.geometry_calculator.getLengthByPytha;

        var pai         = Math.PI;
        var theta060    = pai * 2 / 6;
        var theta072    = pai * 2 / 5;
        var theta036    = pai * 2 / 10;
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

        var XA00 = LA02 / sin036;
        var LB00 = LA00 * (RA00.C / RA00.B);
        var LB01 = LB00 * (RA01.A / RA01.C);
        var LB02 = LB00 * (RA01.B / RA01.C);

        var XB01 = XA00 * (1 + cos036);
        var XB01 = getLengthByPytha(XB01, LA01, null);
        var LA03 = XB01 / 2;
        var LB03 = (XB01 * (RA00.C / RA00.D)) - LA03;

        this.reles.A00 = {X: 0,         Y: LA00 * -1,   Z: LA03 * -1};
        this.reles.A01 = {X: LA02,      Y: LA01,        Z: LA03 * -1};
        this.reles.A02 = {X: LA02 * -1, Y: LA01,        Z: LA03 * -1};
        this.reles.B00 = {X: 0,         Y: LB00,        Z: LB03 * -1};
        this.reles.B01 = {X: LB02 * -1, Y: LB01 * -1,   Z: LB03 * -1};
        this.reles.B02 = {X: LB02,      Y: LB01 * -1,   Z: LB03 * -1};

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
            S00A:   [this.reles.A00,    this.reles.A01,     this.reles.A02],
            S00R:   [this.reles.A00R,   this.reles.A01R,    this.reles.A02R],

            S01A:   [this.reles.A00,    this.reles.A01,     this.reles.B02],
            S02A:   [this.reles.A01,    this.reles.A02,     this.reles.B00],
            S03A:   [this.reles.A02,    this.reles.A00,     this.reles.B01],
            S01R:   [this.reles.A00R,   this.reles.A01R,    this.reles.B02R],
            S02R:   [this.reles.A01R,   this.reles.A02R,    this.reles.B00R],
            S03R:   [this.reles.A02R,   this.reles.A00R,    this.reles.B01R],

            S04A:   [this.reles.A00,    this.reles.B00R,    this.reles.B02],
            S05A:   [this.reles.A01,    this.reles.B01R,    this.reles.B00],
            S06A:   [this.reles.A02,    this.reles.B02R,    this.reles.B01],
            S07A:   [this.reles.A00,    this.reles.B00R,    this.reles.B01],
            S08A:   [this.reles.A01,    this.reles.B01R,    this.reles.B02],
            S09A:   [this.reles.A02,    this.reles.B02R,    this.reles.B00],
            S04R:   [this.reles.A00R,   this.reles.B00,     this.reles.B02R],
            S05R:   [this.reles.A01R,   this.reles.B01,     this.reles.B00R],
            S06R:   [this.reles.A02R,   this.reles.B02,     this.reles.B01R],
            S07R:   [this.reles.A00R,   this.reles.B00,     this.reles.B01R],
            S08R:   [this.reles.A01R,   this.reles.B01,     this.reles.B02R],
            S09R:   [this.reles.A02R,   this.reles.B02,     this.reles.B00R]
        };
    }
};
