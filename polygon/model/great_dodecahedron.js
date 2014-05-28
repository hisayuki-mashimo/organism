/**
 * 大十二面体
 *
 */
var GreatDodecahedron = function()
{
};


GreatDodecahedron.prototype = {
    // 外部設定値
    fill_style:     'rgba(176, 255, 96, 0.8)',
    stroke_style:   'rgb(128, 192, 64)',




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

        var LA00 = this.alpha;
        var LA01 = LA00 * sin072;
        var LA02 = LA00 * cos072;
        var LA03 = LA00 * sin036;
        var LA04 = LA00 * cos036;

        var LB00 = LA00 * (RA00.B / RA00.D);
        var LB01 = LB00 * sin072;
        var LB02 = LB00 * cos072;
        var LB03 = LB00 * sin036;
        var LB04 = LA00 * cos072;

        var LC00 = LA02 * 2;
        var LC01 = LC00 * sin072;
        var LC02 = LC00 * cos072;
        var LC03 = LC00 * sin036;
        var LC04 = LC00 * cos036;

        var XA00 = LA03 * (RA00.C / RA00.B) * 2;
        var XA01 = this.getLengthByPytha(XA00, LA00, null);
        var RX00 = {
            A: LA00,
            B: XA01,
            C: XA00
        };
        var LA05 = LA03 * (RX00.B / RX00.C);
        var LC05 = (XA01 * (RA00.B / RA00.D)) - LA05;
        var LD00 = XA01 - LA05;

        this.reles.A00 = {X: 0,         Y: LA00 * -1,   Z: LA05 * -1};
        this.reles.A01 = {X: LA01,      Y: LA02 * -1,   Z: LA05 * -1};
        this.reles.A02 = {X: LA03,      Y: LA04,        Z: LA05 * -1};
        this.reles.A03 = {X: LA03 * -1, Y: LA04,        Z: LA05 * -1};
        this.reles.A04 = {X: LA01 * -1, Y: LA02 * -1,   Z: LA05 * -1};
        this.reles.B00 = {X: 0,         Y: LB00,        Z: LA05 * -1};
        this.reles.B01 = {X: LB01 * -1, Y: LB02,        Z: LA05 * -1};
        this.reles.B02 = {X: LB03 * -1, Y: LB04 * -1,   Z: LA05 * -1};
        this.reles.B03 = {X: LB03,      Y: LB04 * -1,   Z: LA05 * -1};
        this.reles.B04 = {X: LB01,      Y: LB02,        Z: LA05 * -1};
        this.reles.C00 = {X: 0,         Y: LC00,        Z: LC05 * -1};
        this.reles.C01 = {X: LC01 * -1, Y: LC02,        Z: LC05 * -1};
        this.reles.C02 = {X: LC03 * -1, Y: LC04 * -1,   Z: LC05 * -1};
        this.reles.C03 = {X: LC03,      Y: LC04 * -1,   Z: LC05 * -1};
        this.reles.C04 = {X: LC01,      Y: LC02,        Z: LC05 * -1};
        this.reles.D00 = {X: 0,         Y: 0,           Z: LD00 * -1};

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
            S00A:   [this.reles.A00,    this.reles.D00,     this.reles.B03],
            S01A:   [this.reles.A01,    this.reles.D00,     this.reles.B04],
            S02A:   [this.reles.A02,    this.reles.D00,     this.reles.B00],
            S03A:   [this.reles.A03,    this.reles.D00,     this.reles.B01],
            S04A:   [this.reles.A04,    this.reles.D00,     this.reles.B02],
            S05A:   [this.reles.A00,    this.reles.D00,     this.reles.B02],
            S06A:   [this.reles.A01,    this.reles.D00,     this.reles.B03],
            S07A:   [this.reles.A02,    this.reles.D00,     this.reles.B04],
            S08A:   [this.reles.A03,    this.reles.D00,     this.reles.B00],
            S09A:   [this.reles.A04,    this.reles.D00,     this.reles.B01],
            S00R:   [this.reles.A00R,   this.reles.D00R,    this.reles.B03R],
            S01R:   [this.reles.A01R,   this.reles.D00R,    this.reles.B04R],
            S02R:   [this.reles.A02R,   this.reles.D00R,    this.reles.B00R],
            S03R:   [this.reles.A03R,   this.reles.D00R,    this.reles.B01R],
            S04R:   [this.reles.A04R,   this.reles.D00R,    this.reles.B02R],
            S05R:   [this.reles.A00R,   this.reles.D00R,    this.reles.B02R],
            S06R:   [this.reles.A01R,   this.reles.D00R,    this.reles.B03R],
            S07R:   [this.reles.A02R,   this.reles.D00R,    this.reles.B04R],
            S08R:   [this.reles.A03R,   this.reles.D00R,    this.reles.B00R],
            S09R:   [this.reles.A04R,   this.reles.D00R,    this.reles.B01R],

            S10A:   [this.reles.A00R,   this.reles.C00,     this.reles.A03],
            S11A:   [this.reles.A01R,   this.reles.C01,     this.reles.A04],
            S12A:   [this.reles.A02R,   this.reles.C02,     this.reles.A00],
            S13A:   [this.reles.A03R,   this.reles.C03,     this.reles.A01],
            S14A:   [this.reles.A04R,   this.reles.C04,     this.reles.A02],
            S15A:   [this.reles.A00R,   this.reles.C00,     this.reles.A02],
            S16A:   [this.reles.A01R,   this.reles.C01,     this.reles.A03],
            S17A:   [this.reles.A02R,   this.reles.C02,     this.reles.A04],
            S18A:   [this.reles.A03R,   this.reles.C03,     this.reles.A00],
            S19A:   [this.reles.A04R,   this.reles.C04,     this.reles.A01],
            S10R:   [this.reles.A00,    this.reles.C00R,    this.reles.A03R],
            S11R:   [this.reles.A01,    this.reles.C01R,    this.reles.A04R],
            S12R:   [this.reles.A02,    this.reles.C02R,    this.reles.A00R],
            S13R:   [this.reles.A03,    this.reles.C03R,    this.reles.A01R],
            S14R:   [this.reles.A04,    this.reles.C04R,    this.reles.A02R],
            S15R:   [this.reles.A00,    this.reles.C00R,    this.reles.A02R],
            S16R:   [this.reles.A01,    this.reles.C01R,    this.reles.A03R],
            S17R:   [this.reles.A02,    this.reles.C02R,    this.reles.A04R],
            S18R:   [this.reles.A03,    this.reles.C03R,    this.reles.A00R],
            S19R:   [this.reles.A04,    this.reles.C04R,    this.reles.A01R],

            S20A:   [this.reles.A00,    this.reles.A01,     this.reles.B02],
            S21A:   [this.reles.A01,    this.reles.A02,     this.reles.B03],
            S22A:   [this.reles.A02,    this.reles.A03,     this.reles.B04],
            S23A:   [this.reles.A03,    this.reles.A04,     this.reles.B00],
            S24A:   [this.reles.A04,    this.reles.A00,     this.reles.B01],
            S20R:   [this.reles.A00R,   this.reles.A01R,    this.reles.B02R],
            S21R:   [this.reles.A01R,   this.reles.A02R,    this.reles.B03R],
            S22R:   [this.reles.A02R,   this.reles.A03R,    this.reles.B04R],
            S23R:   [this.reles.A03R,   this.reles.A04R,    this.reles.B00R],
            S24R:   [this.reles.A04R,   this.reles.A00R,    this.reles.B01R],

            S25A:   [this.reles.A00,    this.reles.A01,     this.reles.C03],
            S26A:   [this.reles.A01,    this.reles.A02,     this.reles.C04],
            S27A:   [this.reles.A02,    this.reles.A03,     this.reles.C00],
            S28A:   [this.reles.A03,    this.reles.A04,     this.reles.C01],
            S29A:   [this.reles.A04,    this.reles.A00,     this.reles.C02],
            S30R:   [this.reles.A00R,   this.reles.A01R,    this.reles.C03R],
            S31R:   [this.reles.A01R,   this.reles.A02R,    this.reles.C04R],
            S32R:   [this.reles.A02R,   this.reles.A03R,    this.reles.C00R],
            S33R:   [this.reles.A03R,   this.reles.A04R,    this.reles.C01R],
            S34R:   [this.reles.A04R,   this.reles.A00R,    this.reles.C02R],
        };
    }
};
