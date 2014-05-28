/**
 * 大二十面体
 *
 */
var GreatIcosahedronShift = function()
{
};


GreatIcosahedronShift.prototype = {
    // 外部設定値
    fill_style:     'rgba(128, 128, 255, 0.5)',
    stroke_style:   'rgba(64, 64, 240, 0.9)',
    fill_style2:    'rgba(0, 224, 96, 0.0)',
    stroke_style2:  'rgba(0, 224, 96, 1.0)',
    fill_style3:    'rgba(224, 0, 96, 0.0)',
    stroke_style3:  'rgba(224, 0, 96, 0.5)',




    /**
     * 初期化
     *
     */
    configure: function()
    {
        var pai         = Math.PI;
        var theta072    = pai * 2 / 5;
        var theta036    = pai * 2 / 10;
        var theta018    = pai * 1 / 10;
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

        var XA00 = this.alpha;
        var XA01 = XA00 / 2 * Math.pow(3, 1 / 2);
        var LA00 = XA01 / sin072;
        var LA01 = LA00 * sin072;
        var LA02 = LA00 * cos072;
        var LA03 = LA00 * sin036;
        var LA04 = LA00 * cos036;

        var LB00 = LA00 * (RA00.B / RA00.D);
        var LB01 = LB00 * sin072;
        var LB02 = LB00 * cos072;
        var LB03 = LB00 * sin036;
        var LB04 = LA00 * cos072;

        var XB00 = this.getLengthByPytha((XA00 * 3 / 2), LB04, null);
        var LA05 = XB00 * (RA00.C / RA00.D) / 2;

        var LC00 = LA00 * (RA00.C / RA00.D);
        var LC01 = LC00 * sin072;
        var LC02 = LC00 * cos072;
        var LC03 = LC00 * sin036;
        var LC04 = LC00 * cos036;
        var LC05 = LA05 - ((LA05 * 2) * (RA00.B / RA00.D));

        var RX00 = {
            A: LB03,
            B: LC01,
            C: LB03 + LC01
        };
        var LD00 = LB04 - ((LB04 + LC02) * (RX00.A / RX00.C));
        var LD01 = LD00 * sin072;
        var LD02 = LD00 * cos072;
        var LD03 = LD00 * sin036;
        var LD04 = LD00 * cos036;
        var XB01 = (LA04 - LB00) * (RA00.B / RA00.D);
        var RX01 = {
            A: XB01,
            B: LA00 + LB00,
            C: XB01 + LA00 + LB00
        };
        var LD05 = LA05 - ((LA05 * 2) * (RX01.A / RX01.C));;

        var LE00 = XB00 - LA05;

        var RX02 = {
            A: LB03,
            B: LC01,
            C: LB03 + LC01
        };
        var LF00 = LB04 - ((LB04 - LC02) * (RX02.A / RX02.C));
        var LF01 = LF00 * sin072;
        var LF02 = LF00 * cos072;
        var LF03 = LF00 * sin036;
        var LF04 = LF00 * cos036;
        var RX03 = {
            A: LB03,
            B: LA03,
            C: LB03 + LA03
        };
        var XB02 = (LA05 * 2) * (RA00.C / RA00.D);
        var LF05 = LA05 - (XB02 * (RX03.A / RX03.C));

        var RX04 = {
            A: LC00 - LB00,
            B: LB04 * 2,
            C: (LC00 - LB00) + (LB04 * 2)
        };
        var LG00 = LC03 - ((LC03 + LB01) * (RX04.A / RX04.C));
        var LG01 = LC04 - ((LC04 + LB02) * (RX04.A / RX04.C));
        var LG02 = LC01 - ((LC01 + LB03) * (RX04.A / RX04.C));
        var LG03 = LC02 - ((LC02 + LB04) * (RX04.A / RX04.C));
        var LG04 = LB03 * (RX04.A / RX04.C);
        var LG05 = LC00 - ((LC00 + LB04) * (RX04.A / RX04.C));
        var LG06 = LC01 - ((LC01 + LB01) * (RX04.A / RX04.C));
        var LG07 = LB04 - ((LB04 - LB02) * (RX04.B / RX04.C));
        var LG08 = LC03 * (RX04.B / RX04.C);
        var LG09 = LC04 - ((LC04 + LB00) * (RX04.A / RX04.C));
        var LG10 = LA05 - ((LA05 * 2) * (RX04.A / RX04.C));

        var RX05 = {
            A: LC00 - LB00,
            B: LC04 + LB02,
            C: LC00 - LB00 + LC04 + LB02
        };
        var LH00 = LB01 * (RX05.A / RX05.C);
        var LH01 = LC00 - ((LC00 + LB02) * (RX05.A / RX05.C));
        var LH02 = LC01 * (RX05.B / RX05.C);
        var LH03 = LC02 - ((LC02 + LB00) * (RX05.A / RX05.C));
        var LH04 = LC03 - ((LC03 + LB01) * (RX05.A / RX05.C));
        var LH05 = LC00 - ((LC00 - LB04) * (RX05.B / RX05.C));
        var LH06 = LC01 - ((LC01 - LB03) * (RX05.B / RX05.C));
        var LH07 = LC04 - ((LC04 + LB04) * (RX05.A / RX05.C));
        var LH08 = LC01 - ((LC01 + LB03) * (RX05.A / RX05.C));
        var LH09 = LC04 - ((LC04 - LB02) * (RX05.B / RX05.C));
        var XC00 = (LA05 * 2) * (RA00.C / RA00.D);
        var LH10 = LA05 - (XC00 * (RX05.B / RX05.C));

        this.reles.A00 = {X: 0,         Y: LA00,        Z: LA05 * -1};
        this.reles.A01 = {X: LA01 * -1, Y: LA02,        Z: LA05 * -1};
        this.reles.A02 = {X: LA03 * -1, Y: LA04 * -1,   Z: LA05 * -1};
        this.reles.A03 = {X: LA03,      Y: LA04 * -1,   Z: LA05 * -1};
        this.reles.A04 = {X: LA01,      Y: LA02,        Z: LA05 * -1};
        this.reles.B00 = {X: 0,         Y: LB00 * -1,   Z: LA05 * -1};
        this.reles.B01 = {X: LB01,      Y: LB02 * -1,   Z: LA05 * -1};
        this.reles.B02 = {X: LB03,      Y: LB04,        Z: LA05 * -1};
        this.reles.B03 = {X: LB03 * -1, Y: LB04,        Z: LA05 * -1};
        this.reles.B04 = {X: LB01 * -1, Y: LB02 * -1,   Z: LA05 * -1};
        this.reles.C00 = {X: 0,         Y: LC00,        Z: LC05};
        this.reles.C01 = {X: LC01 * -1, Y: LC02,        Z: LC05};
        this.reles.C02 = {X: LC03 * -1, Y: LC04 * -1,   Z: LC05};
        this.reles.C03 = {X: LC03,      Y: LC04 * -1,   Z: LC05};
        this.reles.C04 = {X: LC01,      Y: LC02,        Z: LC05};
        this.reles.D00 = {X: 0,         Y: LD00,        Z: LD05 * -1};
        this.reles.D01 = {X: LD01 * -1, Y: LD02,        Z: LD05 * -1};
        this.reles.D02 = {X: LD03 * -1, Y: LD04 * -1,   Z: LD05 * -1};
        this.reles.D03 = {X: LD03,      Y: LD04 * -1,   Z: LD05 * -1};
        this.reles.D04 = {X: LD01,      Y: LD02,        Z: LD05 * -1};
        this.reles.E00 = {X: 0,         Y: 0,           Z: LE00 * -1};
        this.reles.F00 = {X: 0,         Y: LF00,        Z: LF05 * -1};
        this.reles.F01 = {X: LF01 * -1, Y: LF02,        Z: LF05 * -1};
        this.reles.F02 = {X: LF03 * -1, Y: LF04 * -1,   Z: LF05 * -1};
        this.reles.F03 = {X: LF03,      Y: LF04 * -1,   Z: LF05 * -1};
        this.reles.F04 = {X: LF01,      Y: LF02,        Z: LF05 * -1};
        this.reles.G00 = {X: LG00,      Y: LG01 * -1,   Z: LG10};
        this.reles.G01 = {X: LG02,      Y: LG03,        Z: LG10};
        this.reles.G02 = {X: LG04,      Y: LG05,        Z: LG10};
        this.reles.G03 = {X: LG06 * -1, Y: LG07,        Z: LG10};
        this.reles.G04 = {X: LG08 * -1, Y: LG09 * -1,   Z: LG10};
        this.reles.G05 = {X: LG00 * -1, Y: LG01 * -1,   Z: LG10};
        this.reles.G06 = {X: LG08,      Y: LG09 * -1,   Z: LG10};
        this.reles.G07 = {X: LG06,      Y: LG07,        Z: LG10};
        this.reles.G08 = {X: LG04 * -1, Y: LG05,        Z: LG10};
        this.reles.G09 = {X: LG02 * -1, Y: LG03,        Z: LG10};
        this.reles.H00 = {X: LH00 * -1, Y: LH01,        Z: LH10 * -1};
        this.reles.H01 = {X: LH02 * -1, Y: LH03,        Z: LH10 * -1};
        this.reles.H02 = {X: LH04 * -1, Y: LH05 * -1,   Z: LH10 * -1};
        this.reles.H03 = {X: LH06,      Y: LH07 * -1,   Z: LH10 * -1};
        this.reles.H04 = {X: LH08,      Y: LH09,        Z: LH10 * -1};
        this.reles.H05 = {X: LH00,      Y: LH01,        Z: LH10 * -1};
        this.reles.H06 = {X: LH08 * -1, Y: LH09,        Z: LH10 * -1};
        this.reles.H07 = {X: LH06 * -1, Y: LH07 * -1,   Z: LH10 * -1};
        this.reles.H08 = {X: LH04,      Y: LH05 * -1,   Z: LH10 * -1};
        this.reles.H09 = {X: LH02,      Y: LH03,        Z: LH10 * -1};

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
            S00A:   [this.reles.B00,    this.reles.E00,     this.reles.D03],
            S01A:   [this.reles.B01,    this.reles.E00,     this.reles.D04],
            S02A:   [this.reles.B02,    this.reles.E00,     this.reles.D00],
            S03A:   [this.reles.B03,    this.reles.E00,     this.reles.D01],
            S04A:   [this.reles.B04,    this.reles.E00,     this.reles.D02],
            S05A:   [this.reles.B00,    this.reles.E00,     this.reles.D02],
            S06A:   [this.reles.B01,    this.reles.E00,     this.reles.D03],
            S07A:   [this.reles.B02,    this.reles.E00,     this.reles.D04],
            S08A:   [this.reles.B03,    this.reles.E00,     this.reles.D00],
            S09A:   [this.reles.B04,    this.reles.E00,     this.reles.D01],
            S00R:   [this.reles.B00R,   this.reles.E00R,    this.reles.D03R],
            S01R:   [this.reles.B01R,   this.reles.E00R,    this.reles.D04R],
            S02R:   [this.reles.B02R,   this.reles.E00R,    this.reles.D00R],
            S03R:   [this.reles.B03R,   this.reles.E00R,    this.reles.D01R],
            S04R:   [this.reles.B04R,   this.reles.E00R,    this.reles.D02R],
            S05R:   [this.reles.B00R,   this.reles.E00R,    this.reles.D02R],
            S06R:   [this.reles.B01R,   this.reles.E00R,    this.reles.D03R],
            S07R:   [this.reles.B02R,   this.reles.E00R,    this.reles.D04R],
            S08R:   [this.reles.B03R,   this.reles.E00R,    this.reles.D00R],
            S09R:   [this.reles.B04R,   this.reles.E00R,    this.reles.D01R],

            S10A:   [this.reles.A00,    this.reles.F00,     this.reles.B03],
            S11A:   [this.reles.A01,    this.reles.F01,     this.reles.B04],
            S12A:   [this.reles.A02,    this.reles.F02,     this.reles.B00],
            S13A:   [this.reles.A03,    this.reles.F03,     this.reles.B01],
            S14A:   [this.reles.A04,    this.reles.F04,     this.reles.B02],
            S15A:   [this.reles.A00,    this.reles.F00,     this.reles.B02],
            S16A:   [this.reles.A01,    this.reles.F01,     this.reles.B03],
            S17A:   [this.reles.A02,    this.reles.F02,     this.reles.B04],
            S18A:   [this.reles.A03,    this.reles.F03,     this.reles.B00],
            S19A:   [this.reles.A04,    this.reles.F04,     this.reles.B01],
            S10R:   [this.reles.A00R,   this.reles.F00R,    this.reles.B03R],
            S11R:   [this.reles.A01R,   this.reles.F01R,    this.reles.B04R],
            S12R:   [this.reles.A02R,   this.reles.F02R,    this.reles.B00R],
            S13R:   [this.reles.A03R,   this.reles.F03R,    this.reles.B01R],
            S14R:   [this.reles.A04R,   this.reles.F04R,    this.reles.B02R],
            S15R:   [this.reles.A00R,   this.reles.F00R,    this.reles.B02R],
            S16R:   [this.reles.A01R,   this.reles.F01R,    this.reles.B03R],
            S17R:   [this.reles.A02R,   this.reles.F02R,    this.reles.B04R],
            S18R:   [this.reles.A03R,   this.reles.F03R,    this.reles.B00R],
            S19R:   [this.reles.A04R,   this.reles.F04R,    this.reles.B01R],

            S20A:   [this.reles.A00,    this.reles.C03R,    this.reles.G00R],
            S21A:   [this.reles.A01,    this.reles.C04R,    this.reles.G01R],
            S22A:   [this.reles.A02,    this.reles.C00R,    this.reles.G02R],
            S23A:   [this.reles.A03,    this.reles.C01R,    this.reles.G03R],
            S24A:   [this.reles.A04,    this.reles.C02R,    this.reles.G04R],
            S25A:   [this.reles.A00,    this.reles.C02R,    this.reles.G05R],
            S26A:   [this.reles.A01,    this.reles.C03R,    this.reles.G06R],
            S27A:   [this.reles.A02,    this.reles.C04R,    this.reles.G07R],
            S28A:   [this.reles.A03,    this.reles.C00R,    this.reles.G08R],
            S29A:   [this.reles.A04,    this.reles.C01R,    this.reles.G09R],
            S20R:   [this.reles.A00R,   this.reles.C03,     this.reles.G00],
            S21R:   [this.reles.A01R,   this.reles.C04,     this.reles.G01],
            S22R:   [this.reles.A02R,   this.reles.C00,     this.reles.G02],
            S23R:   [this.reles.A03R,   this.reles.C01,     this.reles.G03],
            S24R:   [this.reles.A04R,   this.reles.C02,     this.reles.G04],
            S25R:   [this.reles.A00R,   this.reles.C02,     this.reles.G05],
            S26R:   [this.reles.A01R,   this.reles.C03,     this.reles.G06],
            S27R:   [this.reles.A02R,   this.reles.C04,     this.reles.G07],
            S28R:   [this.reles.A03R,   this.reles.C00,     this.reles.G08],
            S29R:   [this.reles.A04R,   this.reles.C01,     this.reles.G09],

            S30A:   [this.reles.A00,    this.reles.C03R,    this.reles.H00],
            S31A:   [this.reles.A01,    this.reles.C04R,    this.reles.H01],
            S32A:   [this.reles.A02,    this.reles.C00R,    this.reles.H02],
            S33A:   [this.reles.A03,    this.reles.C01R,    this.reles.H03],
            S34A:   [this.reles.A04,    this.reles.C02R,    this.reles.H04],
            S35A:   [this.reles.A00,    this.reles.C02R,    this.reles.H05],
            S36A:   [this.reles.A01,    this.reles.C03R,    this.reles.H06],
            S37A:   [this.reles.A02,    this.reles.C04R,    this.reles.H07],
            S38A:   [this.reles.A03,    this.reles.C00R,    this.reles.H08],
            S39A:   [this.reles.A04,    this.reles.C01R,    this.reles.H09],
            S30R:   [this.reles.A00R,   this.reles.C03,     this.reles.H00R],
            S31R:   [this.reles.A01R,   this.reles.C04,     this.reles.H01R],
            S32R:   [this.reles.A02R,   this.reles.C00,     this.reles.H02R],
            S33R:   [this.reles.A03R,   this.reles.C01,     this.reles.H03R],
            S34R:   [this.reles.A04R,   this.reles.C02,     this.reles.H04R],
            S35R:   [this.reles.A00R,   this.reles.C02,     this.reles.H05R],
            S36R:   [this.reles.A01R,   this.reles.C03,     this.reles.H06R],
            S37R:   [this.reles.A02R,   this.reles.C04,     this.reles.H07R],
            S38R:   [this.reles.A03R,   this.reles.C00,     this.reles.H08R],
            S39R:   [this.reles.A04R,   this.reles.C01,     this.reles.H09R],

            S40A:   [this.reles.A00,    this.reles.B02,     this.reles.G05R],
            S41A:   [this.reles.A01,    this.reles.B03,     this.reles.G06R],
            S42A:   [this.reles.A02,    this.reles.B04,     this.reles.G07R],
            S43A:   [this.reles.A03,    this.reles.B00,     this.reles.G08R],
            S44A:   [this.reles.A04,    this.reles.B01,     this.reles.G09R],
            S45A:   [this.reles.A00,    this.reles.B03,     this.reles.G00R],
            S46A:   [this.reles.A01,    this.reles.B04,     this.reles.G01R],
            S47A:   [this.reles.A02,    this.reles.B00,     this.reles.G02R],
            S48A:   [this.reles.A03,    this.reles.B01,     this.reles.G03R],
            S49A:   [this.reles.A04,    this.reles.B02,     this.reles.G04R],
            S40R:   [this.reles.A00R,   this.reles.B02R,    this.reles.G05],
            S41R:   [this.reles.A01R,   this.reles.B03R,    this.reles.G06],
            S42R:   [this.reles.A02R,   this.reles.B04R,    this.reles.G07],
            S43R:   [this.reles.A03R,   this.reles.B00R,    this.reles.G08],
            S44R:   [this.reles.A04R,   this.reles.B01R,    this.reles.G09],
            S45R:   [this.reles.A00R,   this.reles.B03R,    this.reles.G00],
            S46R:   [this.reles.A01R,   this.reles.B04R,    this.reles.G01],
            S47R:   [this.reles.A02R,   this.reles.B00R,    this.reles.G02],
            S48R:   [this.reles.A03R,   this.reles.B01R,    this.reles.G03],
            S49R:   [this.reles.A04R,   this.reles.B02R,    this.reles.G04],

            S50A:   [this.reles.A00,    this.reles.H05,     this.reles.C00],
            S51A:   [this.reles.A01,    this.reles.H06,     this.reles.C01],
            S52A:   [this.reles.A02,    this.reles.H07,     this.reles.C02],
            S53A:   [this.reles.A03,    this.reles.H08,     this.reles.C03],
            S54A:   [this.reles.A04,    this.reles.H09,     this.reles.C04],
            S55A:   [this.reles.A00,    this.reles.H00,     this.reles.C00],
            S56A:   [this.reles.A01,    this.reles.H01,     this.reles.C01],
            S57A:   [this.reles.A02,    this.reles.H02,     this.reles.C02],
            S58A:   [this.reles.A03,    this.reles.H03,     this.reles.C03],
            S59A:   [this.reles.A04,    this.reles.H04,     this.reles.C04],
            S50R:   [this.reles.A00R,   this.reles.H05R,    this.reles.C00R],
            S51R:   [this.reles.A01R,   this.reles.H06R,    this.reles.C01R],
            S52R:   [this.reles.A02R,   this.reles.H07R,    this.reles.C02R],
            S53R:   [this.reles.A03R,   this.reles.H08R,    this.reles.C03R],
            S54R:   [this.reles.A04R,   this.reles.H09R,    this.reles.C04R],
            S55R:   [this.reles.A00R,   this.reles.H00R,    this.reles.C00R],
            S56R:   [this.reles.A01R,   this.reles.H01R,    this.reles.C01R],
            S57R:   [this.reles.A02R,   this.reles.H02R,    this.reles.C02R],
            S58R:   [this.reles.A03R,   this.reles.H03R,    this.reles.C03R],
            S59R:   [this.reles.A04R,   this.reles.H04R,    this.reles.C04R],

            S60A:   [this.reles.B00,    this.reles.B01,     this.reles.D03],
            S61A:   [this.reles.B01,    this.reles.B02,     this.reles.D04],
            S62A:   [this.reles.B02,    this.reles.B03,     this.reles.D00],
            S63A:   [this.reles.B03,    this.reles.B04,     this.reles.D01],
            S64A:   [this.reles.B04,    this.reles.B00,     this.reles.D02],
            S60R:   [this.reles.B00R,   this.reles.B01R,    this.reles.D03R],
            S61R:   [this.reles.B01R,   this.reles.B02R,    this.reles.D04R],
            S62R:   [this.reles.B02R,   this.reles.B03R,    this.reles.D00R],
            S63R:   [this.reles.B03R,   this.reles.B04R,    this.reles.D01R],
            S64R:   [this.reles.B04R,   this.reles.B00R,    this.reles.D02R],

            S65A:   [this.reles.B00,    this.reles.B01,     this.reles.F03],
            S66A:   [this.reles.B01,    this.reles.B02,     this.reles.F04],
            S67A:   [this.reles.B02,    this.reles.B03,     this.reles.F00],
            S68A:   [this.reles.B03,    this.reles.B04,     this.reles.F01],
            S69A:   [this.reles.B04,    this.reles.B00,     this.reles.F02],
            S65R:   [this.reles.B00R,   this.reles.B01R,    this.reles.F03R],
            S66R:   [this.reles.B01R,   this.reles.B02R,    this.reles.F04R],
            S67R:   [this.reles.B02R,   this.reles.B03R,    this.reles.F00R],
            S68R:   [this.reles.B03R,   this.reles.B04R,    this.reles.F01R],
            S69R:   [this.reles.B04R,   this.reles.B00R,    this.reles.F02R],

            S70A:   [this.reles.B00,    this.reles.C00R,    this.reles.G08R],
            S71A:   [this.reles.B01,    this.reles.C01R,    this.reles.G09R],
            S72A:   [this.reles.B02,    this.reles.C02R,    this.reles.G05R],
            S73A:   [this.reles.B03,    this.reles.C03R,    this.reles.G06R],
            S74A:   [this.reles.B04,    this.reles.C04R,    this.reles.G07R],
            S75A:   [this.reles.B00,    this.reles.C00R,    this.reles.G02R],
            S76A:   [this.reles.B01,    this.reles.C01R,    this.reles.G03R],
            S77A:   [this.reles.B02,    this.reles.C02R,    this.reles.G04R],
            S78A:   [this.reles.B03,    this.reles.C03R,    this.reles.G00R],
            S79A:   [this.reles.B04,    this.reles.C04R,    this.reles.G01R],
            S70R:   [this.reles.B00R,   this.reles.C00,     this.reles.G08],
            S71R:   [this.reles.B01R,   this.reles.C01,     this.reles.G09],
            S72R:   [this.reles.B02R,   this.reles.C02,     this.reles.G05],
            S73R:   [this.reles.B03R,   this.reles.C03,     this.reles.G06],
            S74R:   [this.reles.B04R,   this.reles.C04,     this.reles.G07],
            S75R:   [this.reles.B00R,   this.reles.C00,     this.reles.G02],
            S76R:   [this.reles.B01R,   this.reles.C01,     this.reles.G03],
            S77R:   [this.reles.B02R,   this.reles.C02,     this.reles.G04],
            S78R:   [this.reles.B03R,   this.reles.C03,     this.reles.G00],
            S79R:   [this.reles.B04R,   this.reles.C04,     this.reles.G01],

            S80A:   [this.reles.C00,    this.reles.C03R,    this.reles.H00],
            S81A:   [this.reles.C01,    this.reles.C04R,    this.reles.H01],
            S82A:   [this.reles.C02,    this.reles.C00R,    this.reles.H02],
            S83A:   [this.reles.C03,    this.reles.C01R,    this.reles.H03],
            S84A:   [this.reles.C04,    this.reles.C02R,    this.reles.H04],
            S85A:   [this.reles.C00,    this.reles.C02R,    this.reles.H05],
            S86A:   [this.reles.C01,    this.reles.C03R,    this.reles.H06],
            S87A:   [this.reles.C02,    this.reles.C04R,    this.reles.H07],
            S88A:   [this.reles.C03,    this.reles.C00R,    this.reles.H08],
            S89A:   [this.reles.C04,    this.reles.C01R,    this.reles.H09],
            S80R:   [this.reles.C00R,   this.reles.C03,     this.reles.H00R],
            S81R:   [this.reles.C01R,   this.reles.C04,     this.reles.H01R],
            S82R:   [this.reles.C02R,   this.reles.C00,     this.reles.H02R],
            S83R:   [this.reles.C03R,   this.reles.C01,     this.reles.H03R],
            S84R:   [this.reles.C04R,   this.reles.C02,     this.reles.H04R],
            S85R:   [this.reles.C00R,   this.reles.C02,     this.reles.H05R],
            S86R:   [this.reles.C01R,   this.reles.C03,     this.reles.H06R],
            S87R:   [this.reles.C02R,   this.reles.C04,     this.reles.H07R],
            S88R:   [this.reles.C03R,   this.reles.C00,     this.reles.H08R],
            S89R:   [this.reles.C04R,   this.reles.C01,     this.reles.H09R],
        };

        /*this.surfaces2 = {
        };

        this.surfaces3 = {
        };*/
    },


    output: function(theta_X, theta_Y, theta_Z)
    {
        this.canvas_context.setTransform(1, 0, 0, 1, 0, 0);
        this.canvas_context.clearRect(0, 0, this.size, this.size);
        //this._output(this.surfaces2, this.fill_style2,   this.stroke_style2, theta_X, theta_Y, theta_Z);
        //this._output(this.surfaces3, this.fill_style3,   this.stroke_style3, theta_X, theta_Y, theta_Z);
        this._output(this.surfaces,  this.fill_style,    this.stroke_style,  theta_X, theta_Y, theta_Z);
this.lockOn(this.reles.H00, theta_X, theta_Y, theta_Z);
    },


    _output: function(surfaces, fill_style, stroke_style, theta_X, theta_Y, theta_Z)
    {
        var sin_X = Math.sin(theta_X);
        var cos_X = Math.cos(theta_X);
        var sin_Y = Math.sin(theta_Y);
        var cos_Y = Math.cos(theta_Y);
        var sin_Z = Math.sin(theta_Z);
        var cos_Z = Math.cos(theta_Z);

        var coordinates =new Array();
        for (var i in surfaces) {
            var poses = new Array();
            var z_index = 0;

            for (var j = 0; j < surfaces[i].length; j ++) {
                var X0 = surfaces[i][j].X;
                var Y0 = surfaces[i][j].Y;
                var Z0 = surfaces[i][j].Z;
                var X1 = (X0 * cos_X) + (Z0 * sin_X);
                var Z1 = (Z0 * cos_X) - (X0 * sin_X);
                var X2 = (X1 * cos_Y) + (Y0 * sin_Y);
                var Y2 = (Y0 * cos_Y) - (X1 * sin_Y);
                var Y3 = (Y2 * cos_Z) - (Z1 * sin_Z);
                var Z3 = (Z1 * cos_Z) + (Y2 * sin_Z);
                var X = parseFloat(X2);
                var Y = parseFloat(Y3);
                var Z = parseFloat(Z3);

                poses.push({X: X, Y: Y, Z: Z});
                z_index += Z;
            }

            z_index = z_index / surfaces[i].length;
            coordinates.push({poses: poses, z_index: z_index});
        }

        coordinates.sort(function(A, B){return B.z_index - A.z_index;});

        for (var i = 0; i < coordinates.length; i ++) {
            this.canvas_context.beginPath();

            for (var j = 0; j < coordinates[i].poses.length; j ++) {
                var pos = coordinates[i].poses[j];
                if (j == 0) {
                    this.canvas_context.moveTo(this._center + pos.X, this._center + pos.Y);
                } else {
                    this.canvas_context.lineTo(this._center + pos.X, this._center + pos.Y);
                }
            }

            this.canvas_context.closePath();
            this.canvas_context.fillStyle     = fill_style;
            this.canvas_context.fill();
            this.canvas_context.strokeStyle   = stroke_style;
            this.canvas_context.stroke();
        }
    }
};
