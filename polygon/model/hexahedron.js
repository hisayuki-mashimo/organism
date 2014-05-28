var Hexahedron = function()
{
};


Hexahedron.prototype = {
    // 外部設定値
    fill_style:     'rgba(244, 192, 244, 0.8)',
    stroke_style:   'rgb(200, 128, 200)',




    /**
     * 初期化
     *
     */
    configure: function()
    {
        var LA00 = this.alpha;
        var LA01 = LA00 * Math.pow(2, 1 / 2) / 2;

        this.reles.A00 = {X: 0,         Y: LA00 * -1,   Z: LA01};
        this.reles.A01 = {X: LA00,      Y: 0,           Z: LA01};
        this.reles.A02 = {X: 0,         Y: LA00,        Z: LA01};
        this.reles.A03 = {X: LA00 * -1, Y: 0,           Z: LA01};

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
            S00A:   [this.reles.A00,    this.reles.A01,     this.reles.A02,     this.reles.A03],
            S00R:   [this.reles.A00R,   this.reles.A01R,    this.reles.A02R,    this.reles.A03R],

            S01A:   [this.reles.A00,    this.reles.A02R,    this.reles.A03R,    this.reles.A01],
            S02A:   [this.reles.A01,    this.reles.A03R,    this.reles.A00R,    this.reles.A02],
            S01R:   [this.reles.A00R,   this.reles.A02,     this.reles.A03,     this.reles.A01R],
            S02R:   [this.reles.A01R,   this.reles.A03,     this.reles.A00,     this.reles.A02R]
        };
    }
};
