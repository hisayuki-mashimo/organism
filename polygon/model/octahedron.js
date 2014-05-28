var Octahedron = function()
{
};


Octahedron.prototype = {
    // 外部設定値
    fill_style:     'rgba(160, 255, 160, 0.8)',
    stroke_style:   'rgb(104, 224, 104)',




    /**
     * 初期化
     *
     */
    configure: function()
    {
        var pai         = Math.PI;
        var theta060    = pai * 2 / 6;
        var sin060      = Math.sin(theta060);
        var cos060      = Math.cos(theta060);

        // 正三角形比率
        var RA00 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2
        };

        var LA00 = this.alpha;
        var LA01 = LA00 * (RA00.A / RA00.C);
        var LA02 = LA00 * (RA00.B / RA00.C);
        var LA03 = this.getLengthByPytha(LA02, LA01, null);

        this.reles.A00 = {X: 0,         Y: LA00 * -1,   Z: LA03 * -1};
        this.reles.A01 = {X: LA02,      Y: LA01,        Z: LA03 * -1};
        this.reles.A02 = {X: LA02 * -1, Y: LA01,        Z: LA03 * -1};

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

            S01A:   [this.reles.A00,    this.reles.A01,     this.reles.A02R],
            S02A:   [this.reles.A01,    this.reles.A02,     this.reles.A00R],
            S03A:   [this.reles.A02,    this.reles.A00,     this.reles.A01R],
            S01R:   [this.reles.A00R,   this.reles.A01R,    this.reles.A02],
            S02R:   [this.reles.A01R,   this.reles.A02R,    this.reles.A00],
            S03R:   [this.reles.A02R,   this.reles.A00R,    this.reles.A01]
        };
    }
};
