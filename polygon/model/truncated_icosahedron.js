/**
 * 切頂二十面体
 *
 */
var TruncatedIcosahedron = function()
{
};


TruncatedIcosahedron.prototype = {
    // 外部設定値
    fill_style:     'rgba(254, 254, 254, 0.8)',
    stroke_style:   'rgb(160, 160, 160)',




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

        var ratio00 = {
            A: 1 - cos072,
            B: cos072 + cos036,
            C: 1 + cos036
        };
        var L00 = (this.alpha * sin036) * 2;
        var L01 = this.getLengthByPytha(L00, this.alpha, null);
        var L02 = L01 * (ratio00.B / ratio00.A);
        var L03 = (L01 * 2) + (L02 * 3 / 2);
        this.reles.A00 = {
            X: 0,
            Y: this.alpha * -1,
            Z: L03 * -1
        };
        this.reles.A01 = {
            X: this.alpha * sin072,
            Y: this.alpha * cos072 * -1,
            Z: L03 * -1
        };
        this.reles.A02 = {
            X: this.alpha * sin036,
            Y: this.alpha * cos036,
            Z: L03 * -1
        };
        this.reles.A03 = {
            X: this.alpha * sin036 * -1,
            Y: this.alpha * cos036,
            Z: L03 * -1
        };
        this.reles.A04 = {
            X: this.alpha * sin072 * -1,
            Y: this.alpha * cos072 * -1,
            Z: L03 * -1
        };

        var L04 = L01 + (L02 * 3 / 2);
        this.reles.B00 = {
            X: 0,
            Y: this.alpha * -2,
            Z: L04 * -1
        };
        this.reles.B01 = {
            X: this.alpha * sin072 * 2,
            Y: this.alpha * cos072 * -2,
            Z: L04 * -1
        };
        this.reles.B02 = {
            X: this.alpha * sin036 * 2,
            Y: this.alpha * cos036 * 2,
            Z: L04 * -1
        };
        this.reles.B03 = {
            X: this.alpha * sin036 * -2,
            Y: this.alpha * cos036 * 2,
            Z: L04 * -1
        };
        this.reles.B04 = {
            X: this.alpha * sin072 * -2,
            Y: this.alpha * cos072 * -2,
            Z: L04 * -1
        };

        var L05 = L02 * 3 / 2;
        this.reles.C00 = {
            X: this.alpha * sin072,
            Y: ((this.alpha * cos072) + (this.alpha * 2)) * -1,
            Z: L05 * -1
        };
        this.reles.C01 = {
            X: this.alpha * sin072 * 2,
            Y: ((this.alpha * cos072 * 2) + this.alpha) * -1,
            Z: L05 * -1
        };
        this.reles.C02 = {
            X: (this.alpha * sin072) + (this.alpha * cos036 * sin072 * 2),
            Y: ((this.alpha * cos036 * cos072) * 2) - (this.alpha * cos072),
            Z: L05 * -1
        };
        this.reles.C03 = {
            X: (this.alpha * sin036) + (this.alpha * cos036 * sin072 * 2),
            Y: ((this.alpha * cos036 * cos072) * 2) + (this.alpha * cos036),
            Z: L05 * -1
        };
        this.reles.C04 = {
            X: this.alpha * sin036,
            Y: this.alpha * cos036 * 3,
            Z: L05 * -1
        };
        this.reles.C05 = {
            X: this.alpha * sin036 * -1,
            Y: this.alpha * cos036 * 3,
            Z: L05 * -1
        };
        this.reles.C06 = {
            X: ((this.alpha * sin036) + (this.alpha * cos036 * sin072 * 2)) * -1,
            Y: ((this.alpha * cos036 * cos072) * 2) + (this.alpha * cos036),
            Z: L05 * -1
        };
        this.reles.C07 = {
            X: ((this.alpha * sin072) + (this.alpha * cos036 * sin072 * 2)) * -1,
            Y: ((this.alpha * cos036 * cos072) * 2) - (this.alpha * cos072),
            Z: L05 * -1
        };
        this.reles.C08 = {
            X: this.alpha * sin072 * -2,
            Y: ((this.alpha * cos072 * 2) + this.alpha) * -1,
            Z: L05 * -1
        };
        this.reles.C09 = {
            X: this.alpha * sin072 * -1,
            Y: ((this.alpha * cos072) + (this.alpha * 2)) * -1,
            Z: L05 * -1
        };

        var L06 = (this.alpha * cos072) + (this.alpha * cos072 * (ratio00.B / ratio00.A)) + (this.alpha * 2);
        var L07 = L02 * 1 / 2;
        this.reles.D00 = {
            X: this.alpha * sin036,
            Y: L06 * -1,
            Z: L07 * -1
        };
        this.reles.D01 = {
            X: (L06 * sin072) - (this.alpha * (sin072 - sin036) / 2),
            Y: ((L06 * cos072) + (this.alpha * ratio00.B / 2)) * -1,
            Z: L07 * -1
        };
        this.reles.D02 = {
            X: (L06 * sin072) + (this.alpha * (sin072 - sin036) / 2),
            Y: ((L06 * cos072) - (this.alpha * ratio00.B / 2)) * -1,
            Z: L07 * -1
        };
        this.reles.D03 = {
            X: (L06 * sin036) + (this.alpha * sin072 / 2),
            Y: (L06 * cos036) - (this.alpha * ratio00.A / 2),
            Z: L07 * -1
        };
        this.reles.D04 = {
            X: (L06 * sin036) - (this.alpha * sin072 / 2),
            Y: (L06 * cos036) + (this.alpha * ratio00.A / 2),
            Z: L07 * -1
        };
        this.reles.D05 = {
            X: ((L06 * sin036) - (this.alpha * sin072 / 2)) * -1,
            Y: (L06 * cos036) + (this.alpha * ratio00.A / 2),
            Z: L07 * -1
        };
        this.reles.D06 = {
            X: ((L06 * sin036) + (this.alpha * sin072 / 2)) * -1,
            Y: (L06 * cos036) - (this.alpha * ratio00.A / 2),
            Z: L07 * -1
        };
        
        
        this.reles.D07 = {
            X: ((L06 * sin072) + (this.alpha * (sin072 - sin036) / 2)) * -1,
            Y: ((L06 * cos072) - (this.alpha * ratio00.B / 2)) * -1,
            Z: L07 * -1
        };
        this.reles.D08 = {
            X: ((L06 * sin072) - (this.alpha * (sin072 - sin036) / 2)) * -1,
            Y: ((L06 * cos072) + (this.alpha * ratio00.B / 2)) * -1,
            Z: L07 * -1
        };
        this.reles.D09 = {
            X: this.alpha * sin036 * -1,
            Y: L06 * -1,
            Z: L07 * -1
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
            S00: [this.reles.A00,   this.reles.A01,     this.reles.A02,     this.reles.A03,     this.reles.A04],
            S01: [this.reles.A00,   this.reles.B00,     this.reles.C00,     this.reles.C01,     this.reles.B01,     this.reles.A01],
            S02: [this.reles.A01,   this.reles.B01,     this.reles.C02,     this.reles.C03,     this.reles.B02,     this.reles.A02],
            S03: [this.reles.A02,   this.reles.B02,     this.reles.C04,     this.reles.C05,     this.reles.B03,     this.reles.A03],
            S04: [this.reles.A03,   this.reles.B03,     this.reles.C06,     this.reles.C07,     this.reles.B04,     this.reles.A04],
            S05: [this.reles.A04,   this.reles.B04,     this.reles.C08,     this.reles.C09,     this.reles.B00,     this.reles.A00],

            S06: [this.reles.B00,   this.reles.C09,     this.reles.D09,     this.reles.D00,     this.reles.C00],
            S07: [this.reles.B01,   this.reles.C01,     this.reles.D01,     this.reles.D02,     this.reles.C02],
            S08: [this.reles.B02,   this.reles.C03,     this.reles.D03,     this.reles.D04,     this.reles.C04],
            S09: [this.reles.B03,   this.reles.C05,     this.reles.D05,     this.reles.D06,     this.reles.C06],
            S10: [this.reles.B04,   this.reles.C07,     this.reles.D07,     this.reles.D08,     this.reles.C08],

            S11: [this.reles.C00,   this.reles.D00,     this.reles.D05R,    this.reles.D06R,    this.reles.D01,     this.reles.C01],
            S12: [this.reles.C02,   this.reles.D02,     this.reles.D07R,    this.reles.D08R,    this.reles.D03,     this.reles.C03],
            S13: [this.reles.C04,   this.reles.D04,     this.reles.D09R,    this.reles.D00R,    this.reles.D05,     this.reles.C05],
            S14: [this.reles.C06,   this.reles.D06,     this.reles.D01R,    this.reles.D02R,    this.reles.D07,     this.reles.C07],
            S15: [this.reles.C08,   this.reles.D08,     this.reles.D03R,    this.reles.D04R,    this.reles.D09,     this.reles.C09],

            S16: [this.reles.C00R,  this.reles.D00R,    this.reles.D05,     this.reles.D06,     this.reles.D01R,    this.reles.C01R],
            S17: [this.reles.C02R,  this.reles.D02R,    this.reles.D07,     this.reles.D08,     this.reles.D03R,    this.reles.C03R],
            S18: [this.reles.C04R,  this.reles.D04R,    this.reles.D09,     this.reles.D00,     this.reles.D05R,    this.reles.C05R],
            S19: [this.reles.C06R,  this.reles.D06R,    this.reles.D01,     this.reles.D02,     this.reles.D07R,    this.reles.C07R],
            S20: [this.reles.C08R,  this.reles.D08R,    this.reles.D03,     this.reles.D04,     this.reles.D09R,    this.reles.C09R],

            S21: [this.reles.B00R,  this.reles.C09R,    this.reles.D09R,    this.reles.D00R,    this.reles.C00R],
            S22: [this.reles.B01R,  this.reles.C01R,    this.reles.D01R,    this.reles.D02R,    this.reles.C02R],
            S23: [this.reles.B02R,  this.reles.C03R,    this.reles.D03R,    this.reles.D04R,    this.reles.C04R],
            S24: [this.reles.B03R,  this.reles.C05R,    this.reles.D05R,    this.reles.D06R,    this.reles.C06R],
            S25: [this.reles.B04R,  this.reles.C07R,    this.reles.D07R,    this.reles.D08R,    this.reles.C08R],

            S26: [this.reles.A00R,  this.reles.B00R,    this.reles.C00R,    this.reles.C01R,    this.reles.B01R,    this.reles.A01R],
            S27: [this.reles.A01R,  this.reles.B01R,    this.reles.C02R,    this.reles.C03R,    this.reles.B02R,    this.reles.A02R],
            S28: [this.reles.A02R,  this.reles.B02R,    this.reles.C04R,    this.reles.C05R,    this.reles.B03R,    this.reles.A03R],
            S29: [this.reles.A03R,  this.reles.B03R,    this.reles.C06R,    this.reles.C07R,    this.reles.B04R,    this.reles.A04R],
            S30: [this.reles.A04R,  this.reles.B04R,    this.reles.C08R,    this.reles.C09R,    this.reles.B00R,    this.reles.A00R],
            S31: [this.reles.A00R,  this.reles.A01R,    this.reles.A02R,    this.reles.A03R,    this.reles.A04R]
        };
    }
};
