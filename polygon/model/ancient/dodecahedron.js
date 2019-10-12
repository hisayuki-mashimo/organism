var Dodecahedron = function()
{
};


Dodecahedron.prototype = {
    // äOïîê›íËíl
    fill_style:     'rgba(255, 192, 200, 0.0)',
    stroke_style:   'rgb(240, 128, 132)',




    /**
     * èâä˙âª
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

        var LA00 = this.alpha;
        var LA01 = LA00 * sin072;
        var LA02 = LA00 * cos072;
        var LA03 = LA00 * sin036;
        var LA04 = LA00 * cos036;

        var RX00 = {
            A: LA03,
            B: LA01,
            C: LA02 + LA04
        };
        var LA05 = LA04 * (RX00.B / RX00.A);

        var XA00 = LA03 * (RX00.B / RX00.C);
        var LB00 = LA02 + LA04 + XA00;
        var LB01 = LB00 * sin072;
        var LB02 = LB00 * cos072;
        var LB03 = LB00 * sin036;
        var LB04 = LB00 * cos036;
        var LB05 = LA03 * (RX00.A / RX00.C);

        this.reles.A00 = {X: 0,         Y: LA00 * -1,   Z: LA05 * -1};
        this.reles.A01 = {X: LA01,      Y: LA02 * -1,   Z: LA05 * -1};
        this.reles.A02 = {X: LA03,      Y: LA04,        Z: LA05 * -1};
        this.reles.A03 = {X: LA03 * -1, Y: LA04,        Z: LA05 * -1};
        this.reles.A04 = {X: LA01 * -1, Y: LA02 * -1,   Z: LA05 * -1};
        this.reles.B00 = {X: 0,         Y: LB00 * -1,   Z: LB05 * -1};
        this.reles.B01 = {X: LB01,      Y: LB02 * -1,   Z: LB05 * -1};
        this.reles.B02 = {X: LB03,      Y: LB04,        Z: LB05 * -1};
        this.reles.B03 = {X: LB03 * -1, Y: LB04,        Z: LB05 * -1};
        this.reles.B04 = {X: LB01 * -1, Y: LB02 * -1,   Z: LB05 * -1};

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
            S00A:   [this.reles.A00,    this.reles.A01,     this.reles.A02,     this.reles.A03,     this.reles.A04],
            S00R:   [this.reles.A00R,   this.reles.A01R,    this.reles.A02R,    this.reles.A03R,    this.reles.A04R],

            S01A:   [this.reles.A00,    this.reles.B00,     this.reles.B03R,    this.reles.B01,     this.reles.A01],
            S02A:   [this.reles.A01,    this.reles.B01,     this.reles.B04R,    this.reles.B02,     this.reles.A02],
            S03A:   [this.reles.A02,    this.reles.B02,     this.reles.B00R,    this.reles.B03,     this.reles.A03],
            S04A:   [this.reles.A03,    this.reles.B03,     this.reles.B01R,    this.reles.B04,     this.reles.A04],
            S05A:   [this.reles.A04,    this.reles.B04,     this.reles.B02R,    this.reles.B00,     this.reles.A00],
            S01R:   [this.reles.A00R,   this.reles.B00R,    this.reles.B03,     this.reles.B01R,    this.reles.A01R],
            S02R:   [this.reles.A01R,   this.reles.B01R,    this.reles.B04,     this.reles.B02R,    this.reles.A02R],
            S03R:   [this.reles.A02R,   this.reles.B02R,    this.reles.B00,     this.reles.B03R,    this.reles.A03R],
            S04R:   [this.reles.A03R,   this.reles.B03R,    this.reles.B01,     this.reles.B04R,    this.reles.A04R],
            S05R:   [this.reles.A04R,   this.reles.B04R,    this.reles.B02,     this.reles.B00R,    this.reles.A00R]
        };
    }
};
