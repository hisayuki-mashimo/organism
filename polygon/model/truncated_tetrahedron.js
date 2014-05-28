/**
 * 切頂四面体
 *
 */
var TruncatedTetrahedron = function()
{
};


TruncatedTetrahedron.prototype = {
    // 外部設定値
    fill_style:     'rgba(244, 192, 244, 0.8)',
    stroke_style:   'rgb(200, 128, 200)',




    /**
     * 初期化
     *
     */
    configure: function()
    {
        var L00 = this.alpha * Math.pow(2, 1 / 2) / 2;
        this.reles.A00 = {
            X: 0,
            Y: this.alpha * -1,
            Z: L00 * -1
        };
        this.reles.A01 = {
            X: this.alpha,
            Y: 0,
            Z: L00 * -1
        };
        this.reles.A02 = {
            X: 0,
            Y: this.alpha,
            Z: L00 * -1
        };
        this.reles.A03 = {
            X: this.alpha * -1,
            Y: 0,
            Z: L00 * -1
        };

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
            S00: [this.reles.A00,   this.reles.A01,     this.reles.A02,     this.reles.A03],
            S01: [this.reles.A00,   this.reles.A02R,    this.reles.A03R,    this.reles.A01],
            S02: [this.reles.A01,   this.reles.A03R,    this.reles.A00R,    this.reles.A02],
            S03: [this.reles.A00R,  this.reles.A02,     this.reles.A03,     this.reles.A01R],
            S04: [this.reles.A01R,  this.reles.A03,     this.reles.A00,     this.reles.A02R],
            S05: [this.reles.A00R,  this.reles.A01R,    this.reles.A02R,    this.reles.A03R]
        };
    }
};
