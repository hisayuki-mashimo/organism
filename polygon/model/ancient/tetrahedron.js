var Tetrahedron = function()
{
};


Tetrahedron.prototype = {
    // 外部設定値
    fill_style:     'rgba(255, 255, 128, 0.8)',
    stroke_style:   'rgb(224, 224, 0)',




    /**
     * 初期化
     *
     */
    configure: function()
    {
        var getLengthByPytha = this.basis.geometry_calculator.getLengthByPytha;

        // 正三角形比率
        var RA00 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2
        };

        var LA00 = this.alpha;
        var LA01 = LA00 * (RA00.A / RA00.C);
        var LA02 = LA00 * (RA00.B / RA00.C);

        var XA00 = getLengthByPytha((LA02 * 2), LA00, null);
        var LA03 = XA00 / 3;

        var LB00 = XA00 * 2 / 3;

        this.reles.A00 = {X: 0,         Y: LA00 * -1,   Z: LA03 * -1};
        this.reles.A01 = {X: LA02,      Y: LA01,        Z: LA03 * -1};
        this.reles.A02 = {X: LA02 * -1, Y: LA01,        Z: LA03 * -1};
        this.reles.B00 = {X: 0,         Y: 0,           Z: LB00};

        this.surfaces = {
            S00A: [this.reles.A00,   this.reles.A01,     this.reles.A02],

            S01A: [this.reles.A00,   this.reles.A01,     this.reles.B00],
            S02A: [this.reles.A01,   this.reles.A02,     this.reles.B00],
            S03A: [this.reles.A02,   this.reles.A00,     this.reles.B00]
        };
    }
};
