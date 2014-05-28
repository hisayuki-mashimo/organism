/**
 * 星型八面体
 *
 */
var StellaOctangula = function()
{
};


StellaOctangula.prototype = {
    // 外部設定値
    fill_style:     'rgba(128, 240, 255, 0.8)',
    stroke_style:   'rgb(80, 200, 240)',




    /**
     * 初期化
     *
     */
    configure: function()
    {
        // 正三角形比率
        var RA00 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2
        };

        var LA00 = this.alpha;
        var LA01 = LA00 * (RA00.A / RA00.C);
        var LA02 = LA00 * (RA00.B / RA00.C);

        var LB00 = LA01;
        var LB01 = LB00 * (RA00.A / RA00.C);
        var LB02 = LB00 * (RA00.B / RA00.C);

        var XA00 = this.getLengthByPytha((LA02 * 2), LA00, null);
        var LA03 = XA00 / 4;
        var LC00 = XA00 * 3 / 4;

        this.reles.A00 = {X: 0,         Y: LA00 * -1,   Z: LA03 * -1};
        this.reles.A01 = {X: LA02,      Y: LA01,        Z: LA03 * -1};
        this.reles.A02 = {X: LA02 * -1, Y: LA01,        Z: LA03 * -1};
        this.reles.B00 = {X: 0,         Y: LB00,        Z: LA03 * -1};
        this.reles.B01 = {X: LB02 * -1, Y: LB01 * -1,   Z: LA03 * -1};
        this.reles.B02 = {X: LB02,      Y: LB01 * -1,   Z: LA03 * -1};
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
            S00A:   [this.reles.A00,    this.reles.B01,     this.reles.B02],
            S01A:   [this.reles.A01,    this.reles.B02,     this.reles.B00],
            S02A:   [this.reles.A02,    this.reles.B00,     this.reles.B01],
            S00R:   [this.reles.A00R,   this.reles.B01R,    this.reles.B02R],
            S01R:   [this.reles.A01R,   this.reles.B02R,    this.reles.B00R],
            S02R:   [this.reles.A02R,   this.reles.B00R,    this.reles.B01R],

            S03A:   [this.reles.B00,    this.reles.B01,     this.reles.C00],
            S04A:   [this.reles.B01,    this.reles.B02,     this.reles.C00],
            S05A:   [this.reles.B02,    this.reles.B00,     this.reles.C00],
            S03R:   [this.reles.B00R,   this.reles.B01R,    this.reles.C00R],
            S04R:   [this.reles.B01R,   this.reles.B02R,    this.reles.C00R],
            S05R:   [this.reles.B02R,   this.reles.B00R,    this.reles.C00R],

            S06A:   [this.reles.A00,    this.reles.B02,     this.reles.B00R],
            S07A:   [this.reles.A01,    this.reles.B00,     this.reles.B01R],
            S08A:   [this.reles.A02,    this.reles.B01,     this.reles.B02R],
            S09A:   [this.reles.A00,    this.reles.B01,     this.reles.B00R],
            S10A:   [this.reles.A01,    this.reles.B02,     this.reles.B01R],
            S11A:   [this.reles.A02,    this.reles.B00,     this.reles.B02R],
            S06R:   [this.reles.A00R,   this.reles.B02R,    this.reles.B00],
            S07R:   [this.reles.A01R,   this.reles.B00R,    this.reles.B01],
            S08R:   [this.reles.A02R,   this.reles.B01R,    this.reles.B02],
            S09R:   [this.reles.A00R,   this.reles.B01R,    this.reles.B00],
            S10R:   [this.reles.A01R,   this.reles.B02R,    this.reles.B01],
            S11R:   [this.reles.A02R,   this.reles.B00R,    this.reles.B02]
        };
    }
};
