/**
 * 大星型十二面体
 *
 */
var GreatStellatedDodecahedron = function()
{
};


GreatStellatedDodecahedron.prototype = {
    // 外部設定値
    fill_style:     'rgba(224, 156, 184, 0.8)',
    stroke_style:   'rgba(176, 116, 148, 1.0)',




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

        var XA00 = LB03 * (RA00.B / RA00.A);
        var LC00 = XA00 / sin036;
        var LC01 = LC00 * sin072;
        var LC02 = LC00 * cos072;
        var LC03 = LC00 * sin036;
        var LC04 = LC00 * cos036;

        var XB00 = LA00 + LA04;
        var XB01 = LA03 / Math.pow(3, 1 / 2);
        var XB02 = LA03 * Math.pow(3, 1 / 2);
        var XB03 = this.getLengthByPytha(XB00, XB01, null);
        var RX00 = {
            A: XB01,
            B: XB03,
            C: XB00
        };
        var XB04 = XB02 * (RX00.B / RX00.C);
        var LA05 = XB04 * (RA00.B / RA00.D) / 2;
        var LC05 = XB04 - LA05;
        var LE00 = (XB04 * (RA00.C / RA00.D)) - LA05;

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
        this.reles.C00 = {X: 0,         Y: LC00 * -1,   Z: LC05 * -1};
        this.reles.C01 = {X: LC01,      Y: LC02 * -1,   Z: LC05 * -1};
        this.reles.C02 = {X: LC03,      Y: LC04,        Z: LC05 * -1};
        this.reles.C03 = {X: LC03 * -1, Y: LC04,        Z: LC05 * -1};
        this.reles.C04 = {X: LC01 * -1, Y: LC02 * -1,   Z: LC05 * -1};
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
            S00A:   [this.reles.A00,    this.reles.B02,     this.reles.B03],
            S01A:   [this.reles.A01,    this.reles.B03,     this.reles.B04],
            S02A:   [this.reles.A02,    this.reles.B04,     this.reles.B00],
            S03A:   [this.reles.A03,    this.reles.B00,     this.reles.B01],
            S04A:   [this.reles.A04,    this.reles.B01,     this.reles.B02],
            S00R:   [this.reles.A00R,   this.reles.B02R,    this.reles.B03R],
            S01R:   [this.reles.A01R,   this.reles.B03R,    this.reles.B04R],
            S02R:   [this.reles.A02R,   this.reles.B04R,    this.reles.B00R],
            S03R:   [this.reles.A03R,   this.reles.B00R,    this.reles.B01R],
            S04R:   [this.reles.A04R,   this.reles.B01R,    this.reles.B02R],

            S05A:   [this.reles.A00,    this.reles.B02,     this.reles.B00R],
            S06A:   [this.reles.A01,    this.reles.B03,     this.reles.B01R],
            S07A:   [this.reles.A02,    this.reles.B04,     this.reles.B02R],
            S08A:   [this.reles.A03,    this.reles.B00,     this.reles.B03R],
            S09A:   [this.reles.A04,    this.reles.B01,     this.reles.B04R],
            S10A:   [this.reles.A00,    this.reles.B03,     this.reles.B00R],
            S11A:   [this.reles.A01,    this.reles.B04,     this.reles.B01R],
            S12A:   [this.reles.A02,    this.reles.B00,     this.reles.B02R],
            S13A:   [this.reles.A03,    this.reles.B01,     this.reles.B03R],
            S14A:   [this.reles.A04,    this.reles.B02,     this.reles.B04R],
            S05R:   [this.reles.A00R,   this.reles.B02R,    this.reles.B00],
            S06R:   [this.reles.A01R,   this.reles.B03R,    this.reles.B01],
            S07R:   [this.reles.A02R,   this.reles.B04R,    this.reles.B02],
            S08R:   [this.reles.A03R,   this.reles.B00R,    this.reles.B03],
            S09R:   [this.reles.A04R,   this.reles.B01R,    this.reles.B04],
            S10R:   [this.reles.A00R,   this.reles.B03R,    this.reles.B00],
            S11R:   [this.reles.A01R,   this.reles.B04R,    this.reles.B01],
            S12R:   [this.reles.A02R,   this.reles.B00R,    this.reles.B02],
            S13R:   [this.reles.A03R,   this.reles.B01R,    this.reles.B03],
            S14R:   [this.reles.A04R,   this.reles.B02R,    this.reles.B04],

            S15A:   [this.reles.C00,    this.reles.B02,     this.reles.B03],
            S16A:   [this.reles.C01,    this.reles.B03,     this.reles.B04],
            S17A:   [this.reles.C02,    this.reles.B04,     this.reles.B00],
            S18A:   [this.reles.C03,    this.reles.B00,     this.reles.B01],
            S19A:   [this.reles.C04,    this.reles.B01,     this.reles.B02],
            S15R:   [this.reles.C00R,   this.reles.B02R,    this.reles.B03R],
            S16R:   [this.reles.C01R,   this.reles.B03R,    this.reles.B04R],
            S17R:   [this.reles.C02R,   this.reles.B04R,    this.reles.B00R],
            S18R:   [this.reles.C03R,   this.reles.B00R,    this.reles.B01R],
            S19R:   [this.reles.C04R,   this.reles.B01R,    this.reles.B02R],

            S20A:   [this.reles.C00,    this.reles.E00,     this.reles.B02],
            S21A:   [this.reles.C01,    this.reles.E00,     this.reles.B03],
            S22A:   [this.reles.C02,    this.reles.E00,     this.reles.B04],
            S23A:   [this.reles.C03,    this.reles.E00,     this.reles.B00],
            S24A:   [this.reles.C04,    this.reles.E00,     this.reles.B01],
            S25A:   [this.reles.C00,    this.reles.E00,     this.reles.B03],
            S26A:   [this.reles.C01,    this.reles.E00,     this.reles.B04],
            S27A:   [this.reles.C02,    this.reles.E00,     this.reles.B00],
            S28A:   [this.reles.C03,    this.reles.E00,     this.reles.B01],
            S29A:   [this.reles.C04,    this.reles.E00,     this.reles.B02],
            S20R:   [this.reles.C00R,   this.reles.E00R,    this.reles.B02R],
            S21R:   [this.reles.C01R,   this.reles.E00R,    this.reles.B03R],
            S22R:   [this.reles.C02R,   this.reles.E00R,    this.reles.B04R],
            S23R:   [this.reles.C03R,   this.reles.E00R,    this.reles.B00R],
            S24R:   [this.reles.C04R,   this.reles.E00R,    this.reles.B01R],
            S25R:   [this.reles.C00R,   this.reles.E00R,    this.reles.B03R],
            S26R:   [this.reles.C01R,   this.reles.E00R,    this.reles.B04R],
            S27R:   [this.reles.C02R,   this.reles.E00R,    this.reles.B00R],
            S28R:   [this.reles.C03R,   this.reles.E00R,    this.reles.B01R],
            S29R:   [this.reles.C04R,   this.reles.E00R,    this.reles.B02R]
        };
    }
};
