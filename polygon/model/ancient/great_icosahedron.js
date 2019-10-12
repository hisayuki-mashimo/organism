/**
 * 大二十面体
 *
 */
var GreatIcosahedron = function()
{
};


GreatIcosahedron.prototype = {
    // 外部設定値
    fill_style:     'rgba(255, 156, 128, 0.8)',
    stroke_style:   'rgba(240, 96, 64, 1.0)',




    /**
     * 初期化
     *
     */
    configure: function()
    {
        var getLengthByPytha = this.basis.geometry_calculator.getLengthByPytha;

        var pai         = Math.PI;
        var theta036    = pai * 2 / 10;
        var sin036      = Math.sin(theta036);
        var cos036      = Math.cos(theta036);

        // 五芒星比率
        var RA00 = {
            A: (4 * Math.pow(cos036, 2)) - 2,
            B: 1,
            C: (4 * Math.pow(cos036, 2)) - 1,
            D: (4 * Math.pow(cos036, 2))
        };

        // 正三角形比率
        var RA01 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2
        };

        var LA00 = this.alpha;
        var LA01 = LA00 * (RA01.A / RA01.C);
        var LA02 = LA00 * (RA01.B / RA01.C);

        var LB00 = LA00 * (RA00.B / RA00.C);
        var LB01 = LB00 * (RA01.A / RA01.C);
        var LB02 = LB00 * (RA01.B / RA01.C);

        var LC00 = LB01 + ((LA01 - LB01) * (RA00.B / RA00.D));
        var LC01 = LC00 * (RA01.A / RA01.C);
        var LC02 = LC00 * (RA01.B / RA01.C);

        var XA00 = getLengthByPytha((LA00 + LA01), (LB00 + LA01), null);
        var LA03 = XA00 * (RA00.A / RA00.C) / 2;
        var LB03 = XA00 * (RA00.D / RA00.C) / 2
        var LC03 = (XA00 * (RA00.C / RA00.D)) - LA03;
        var LD00 = ((LB03 - LA03) * (RA00.C / RA00.D)) + LA03;

        var XB00 = LA02 * (RA00.A / RA00.D);
        var XB01 = LB00 + LA01;
        var XB02 = LA00 - ((LA00 + LA01) * (RA00.C / RA00.D));
        var RX00 = {
            A: LB00 - LC01,
            B: LB00 + XB02,
            C: LB00 + LA01
        };
        var XB03 = XB00 * (RX00.B / RX00.C);
        var XB04 = XB00 * (RX00.A / RX00.C);
        var RX01 = {
            A: LC02 - XB04,
            B: LB02 + XB03,
            C: LB02 + LC02 + XB03 - XB04
        };
        var XB05 = LC01 + XB02;
        var XB06 = XB05 * (RX01.A / RX01.C);
        var RX02 = {
            A: LB00 - LC01 + XB06,
            B: XB01
        };
        var RX03 = {
            A: LC02,
            B: LC02 + LB02,
            C: (LC02 * 2) + LB02
        };
        var XB07 = (LB03 - LA03) * (RA00.B / RA00.D) * (RX03.B / RX03.C);
        var LE00 = XB00 * (RX02.A / RX02.B);
        var LE01 = XB05 - XB02 - XB06;
        var LE02 = XB07 + LA03;

        var XC00 = LB00 - LC00;
        var XC01 = LC00 - (XC00 / 2);
        var RX04 = {
            A: LB02 - XB00,
            B: LB02 + XB00,
            C: LB02 * 2
        };
        var XC02 = LB00 + (XC00 * (RX04.A / RX04.C));
        var RX05 = {
            A: XC01,
            B: XC02,
            C: XC01 + XC02
        };
        var LE03 = XB00 * (RX05.A / RX05.C);
        var LE04 = ((LC00 + LA01) * (RX05.B / RX05.C)) - LA01;

        var RX06 = {
            A: XC00,
            B: LB00 + LC00
        };
        var XD00 = LC00 - (XC00 * (RX06.A / RX06.B));
        var RX07 = {
            A: XD00,
            B: LB00 + XC00,
            C: XD00 + LB00 + XC00
        };
        var LE05 = ((LC02 * 2) * (RX07.B / RX07.C)) - LC02;
        var LE06 = LC01 - (LB00 * (RX07.A / RX07.C));

        var RX08 = {
            A: LC02,
            B: LB02,
            C: LC02 + LB02
        };
        var XE00 = XC00 * (RX08.A / RX08.C);
        var RX09 = {
            A: XE00,
            B: XC00,
            C: XE00 + XC00
        };
        var LF00 = LC02 * (RX09.A / RX09.C);
        var LF01 = LC01 * (1 + (RX09.B / RX09.C));

        var RX10 = {
            A: XC00,
            B: LB00,
            C: XC00 + LB00
        };
        var LF02 = XB00 + ((LC02 - XB00) * (RX10.A / RX10.C));
        var LF03 = LA01 - ((LB00 + LA01 - LC01) * (RX10.A / RX10.C));

        var RX12 = {
            A: LA02 - LC02,
            B: LA02 * (1 + (RA00.A / RA00.C))
        };
        var LF04 = LC02;
        var LF05 = LA01 - ((LB00 - LC01 + LA01) * (RX12.A / RX12.B));

        var LG00 = LB02 * (RA00.C / RA00.D);
        var LG01 = LB01 * (1 + (RA00.B / RA00.D));
        var LG02 = XB00;
        var LG03 = ((LA00 + LA01) * (RA00.B / RA00.D)) - LA01;

        var RX13 = {
            A: LA00 - LB01,
            B: LB00 + XC00,
            C: LA00 + LB00 - LB01 + XC00
        };
        var LH00 = LC02 * (RX13.A / RX13.C);
        var LH01 = LA00 - ((LA00 + LB00 - LC01) * (RX13.A / RX13.C));
        var LH02 = LA03 - ((LA03 * 2) * (RX13.A / RX13.C));

        var RX14 = {
            A: XC00,
            B: LB00,
            C: XC00 + LB00
        };
        var LH03 = LC02 * (RX14.B / RX14.C);
        var LH04 = (LC01 + XC00) * (RX14.B / RX14.C);

        var RX15 = {
            A: LC00,
            B: LA00,
            C: LC00 + LA00
        };
        var LH05 = LB02 * (RX15.B / RX15.C);
        var LH06 = LA00 - ((LB01 + LA00) * (RX15.B / RX15.C));

        var RX16 = {
            A: XB00,
            B: LB02,
            C: XB00 + LB02
        };
        var LI00 = LA01 - ((LC00 + LA01 - LB01) * (RX16.A / RX16.C));
        var LI01 = LI00 * (RA01.A / RA01.C);
        var LI02 = LI00 * (RA01.B / RA01.C);

        var XG00 = LC00 - (XC00 * (RX08.A / RX08.C));
        var RX19 = {
            A: XC00,
            B: XG00,
            C: XC00 + XG00
        };
        var LJ00 = LB02 - ((LB02 + LC02) * (RX19.A / RX19.C));
        var LJ01 = LC01 + ((LB01 - LC01) * (RX19.B / RX19.C));
        var XG01 = LB03 + LA03 + ((LB03 - LA03) * (RA00.B / RA00.D));
        var LJ02 = LB03 - (XG01 * (RX19.A / RX19.C));
        var LJ03 = LB02 * (RX19.B / RX19.C);
        var LJ04 = 0;//((LC00 + LB01) * (RX19.B / RX19.C)) - LC00;

        var XG03 = LB00 - (LC00 * (RA00.B / RA00.C));
        var RX20 = {
            A: XG03,
            B: LC00 + LB00,
            C: XG03 + LC00 + LB00
        };
        var LJ05 = XB00 * (RX20.B / RX20.C);
        var LJ06 = ((LC00 + LA01) * (RX20.B / RX20.C)) - LC00;

        var LK00 = LA03 * (1 - (2 * (RX16.A / RX16.C)));

        this.reles.A00 = {X: 0,         Y: LA00 * -1,   Z: LA03 * -1};
        this.reles.A01 = {X: LA02,      Y: LA01,        Z: LA03 * -1};
        this.reles.A02 = {X: LA02 * -1, Y: LA01,        Z: LA03 * -1};
        this.reles.B00 = {X: 0,         Y: LB00,        Z: LB03 * -1};
        this.reles.B01 = {X: LB02 * -1, Y: LB01 * -1,   Z: LB03 * -1};
        this.reles.B02 = {X: LB02,      Y: LB01 * -1,   Z: LB03 * -1};
        this.reles.C00 = {X: 0,         Y: LC00 * -1,   Z: LC03 * -1};
        this.reles.C01 = {X: LC02,      Y: LC01,        Z: LC03 * -1};
        this.reles.C02 = {X: LC02 * -1, Y: LC01,        Z: LC03 * -1};
        this.reles.D00 = {X: 0,         Y: 0,           Z: LD00 * -1};
        this.reles.E00 = {X: LE00 * -1, Y: LE01,        Z: LE02 * -1};
        this.reles.E01 = {X: LE03 * -1, Y: LE04 * -1,   Z: LE02 * -1};
        this.reles.E02 = {X: LE05,      Y: LE06,        Z: LE02 * -1};
        this.reles.E03 = {X: LE00,      Y: LE01,        Z: LE02 * -1};
        this.reles.E04 = {X: LE05 * -1, Y: LE06,        Z: LE02 * -1};
        this.reles.E05 = {X: LE03,      Y: LE04 * -1,   Z: LE02 * -1};
        this.reles.F00 = {X: LF00,      Y: LF01 * -1,   Z: LA03 * -1};
        this.reles.F01 = {X: LF02,      Y: LF03,        Z: LA03 * -1};
        this.reles.F02 = {X: LF04 * -1, Y: LF05,        Z: LA03 * -1};
        this.reles.F03 = {X: LF00 * -1, Y: LF01 * -1,   Z: LA03 * -1};
        this.reles.F04 = {X: LF04,      Y: LF05,        Z: LA03 * -1};
        this.reles.F05 = {X: LF02 * -1, Y: LF03,        Z: LA03 * -1};
        this.reles.G00 = {X: LG00,      Y: LG01 * -1,   Z: LA03 * -1};
        this.reles.G01 = {X: LG02,      Y: LA01,        Z: LA03 * -1};
        this.reles.G02 = {X: LB02 * -1, Y: LG03 * -1,   Z: LA03 * -1};
        this.reles.G03 = {X: LG00 * -1, Y: LG01 * -1,   Z: LA03 * -1};
        this.reles.G04 = {X: LB02,      Y: LG03 * -1,   Z: LA03 * -1};
        this.reles.G05 = {X: LG02 * -1, Y: LA01,        Z: LA03 * -1};
        this.reles.H00 = {X: LH00,      Y: LH01 * -1,   Z: LH02 * -1};
        this.reles.H01 = {X: LH03,      Y: LH04,        Z: LH02 * -1};
        this.reles.H02 = {X: LH05 * -1, Y: LH06,        Z: LH02 * -1};
        this.reles.H03 = {X: LH00 * -1, Y: LH01 * -1,   Z: LH02 * -1};
        this.reles.H04 = {X: LH05,      Y: LH06,        Z: LH02 * -1};
        this.reles.H05 = {X: LH03 * -1, Y: LH04,        Z: LH02 * -1};
        this.reles.I00 = {X: 0,         Y: LI00 * -1,   Z: LA03};
        this.reles.I01 = {X: LI02,      Y: LI01,        Z: LA03};
        this.reles.I02 = {X: LI02 * -1, Y: LI01,        Z: LA03};
        this.reles.J00 = {X: LJ00 * -1, Y: LJ01 * -1,   Z: LJ02 * -1};
        this.reles.J01 = {X: LJ03,      Y: LJ04 * -1,   Z: LJ02 * -1};
        this.reles.J02 = {X: LJ05 * -1, Y: LJ06,        Z: LJ02 * -1};
        this.reles.J03 = {X: LJ00,      Y: LJ01 * -1,   Z: LJ02 * -1};
        this.reles.J04 = {X: LJ05,      Y: LJ06,        Z: LJ02 * -1};
        this.reles.J05 = {X: LJ03 * -1, Y: LJ04 * -1,   Z: LJ02 * -1};
        this.reles.K00 = {X: 0,         Y: LC00 * -1,   Z: LK00};
        this.reles.K01 = {X: LC02,      Y: LC01,        Z: LK00};
        this.reles.K02 = {X: LC02 * -1, Y: LC01,        Z: LK00};

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
            S00A:   [this.reles.B00,    this.reles.C02,     this.reles.E00],
            S01A:   [this.reles.B01,    this.reles.C00,     this.reles.E01],
            S02A:   [this.reles.B02,    this.reles.C01,     this.reles.E02],
            S03A:   [this.reles.B00,    this.reles.C01,     this.reles.E03],
            S04A:   [this.reles.B01,    this.reles.C02,     this.reles.E04],
            S05A:   [this.reles.B02,    this.reles.C00,     this.reles.E05],
            S00R:   [this.reles.B00R,   this.reles.C02R,    this.reles.E00R],
            S01R:   [this.reles.B01R,   this.reles.C00R,    this.reles.E01R],
            S02R:   [this.reles.B02R,   this.reles.C01R,    this.reles.E02R],
            S03R:   [this.reles.B00R,   this.reles.C01R,    this.reles.E03R],
            S04R:   [this.reles.B01R,   this.reles.C02R,    this.reles.E04R],
            S05R:   [this.reles.B02R,   this.reles.C00R,    this.reles.E05R],

            S06A:   [this.reles.B00,    this.reles.D00,     this.reles.E00],
            S07A:   [this.reles.B01,    this.reles.D00,     this.reles.E01],
            S08A:   [this.reles.B02,    this.reles.D00,     this.reles.E02],
            S09A:   [this.reles.B00,    this.reles.D00,     this.reles.E03],
            S10A:   [this.reles.B01,    this.reles.D00,     this.reles.E04],
            S11A:   [this.reles.B02,    this.reles.D00,     this.reles.E05],
            S06R:   [this.reles.B00R,   this.reles.D00R,    this.reles.E00R],
            S07R:   [this.reles.B01R,   this.reles.D00R,    this.reles.E01R],
            S08R:   [this.reles.B02R,   this.reles.D00R,    this.reles.E02R],
            S09R:   [this.reles.B00R,   this.reles.D00R,    this.reles.E03R],
            S10R:   [this.reles.B01R,   this.reles.D00R,    this.reles.E04R],
            S11R:   [this.reles.B02R,   this.reles.D00R,    this.reles.E05R],

            S12A:   [this.reles.C00,    this.reles.D00,     this.reles.E01],
            S13A:   [this.reles.C01,    this.reles.D00,     this.reles.E02],
            S14A:   [this.reles.C02,    this.reles.D00,     this.reles.E00],
            S15A:   [this.reles.C00,    this.reles.D00,     this.reles.E05],
            S16A:   [this.reles.C01,    this.reles.D00,     this.reles.E03],
            S17A:   [this.reles.C02,    this.reles.D00,     this.reles.E04],
            S12R:   [this.reles.C00R,   this.reles.D00R,    this.reles.E01R],
            S13R:   [this.reles.C01R,   this.reles.D00R,    this.reles.E02R],
            S14R:   [this.reles.C02R,   this.reles.D00R,    this.reles.E00R],
            S15R:   [this.reles.C00R,   this.reles.D00R,    this.reles.E05R],
            S16R:   [this.reles.C01R,   this.reles.D00R,    this.reles.E03R],
            S17R:   [this.reles.C02R,   this.reles.D00R,    this.reles.E04R],

            S18A:   [this.reles.A00,    this.reles.C00,     this.reles.F00],
            S19A:   [this.reles.A01,    this.reles.C01,     this.reles.F01],
            S20A:   [this.reles.A02,    this.reles.C02,     this.reles.F02],
            S21A:   [this.reles.A00,    this.reles.C00,     this.reles.F03],
            S22A:   [this.reles.A01,    this.reles.C01,     this.reles.F04],
            S23A:   [this.reles.A02,    this.reles.C02,     this.reles.F05],
            S18R:   [this.reles.A00R,   this.reles.C00R,    this.reles.F00R],
            S19R:   [this.reles.A01R,   this.reles.C01R,    this.reles.F01R],
            S20R:   [this.reles.A02R,   this.reles.C02R,    this.reles.F02R],
            S21R:   [this.reles.A00R,   this.reles.C00R,    this.reles.F03R],
            S22R:   [this.reles.A01R,   this.reles.C01R,    this.reles.F04R],
            S23R:   [this.reles.A02R,   this.reles.C02R,    this.reles.F05R],

            S24A:   [this.reles.A00,    this.reles.G00,     this.reles.F00],
            S25A:   [this.reles.A01,    this.reles.G01,     this.reles.F01],
            S26A:   [this.reles.A02,    this.reles.G02,     this.reles.F02],
            S27A:   [this.reles.A00,    this.reles.G03,     this.reles.F03],
            S28A:   [this.reles.A01,    this.reles.G04,     this.reles.F04],
            S29A:   [this.reles.A02,    this.reles.G05,     this.reles.F05],
            S24R:   [this.reles.A00R,   this.reles.G00R,    this.reles.F00R],
            S25R:   [this.reles.A01R,   this.reles.G01R,    this.reles.F01R],
            S26R:   [this.reles.A02R,   this.reles.G02R,    this.reles.F02R],
            S27R:   [this.reles.A00R,   this.reles.G03R,    this.reles.F03R],
            S28R:   [this.reles.A01R,   this.reles.G04R,    this.reles.F04R],
            S29R:   [this.reles.A02R,   this.reles.G05R,    this.reles.F05R],

            S30A:   [this.reles.A00,    this.reles.G00,     this.reles.H00],
            S31A:   [this.reles.A01,    this.reles.G01,     this.reles.H01],
            S32A:   [this.reles.A02,    this.reles.G02,     this.reles.H02],
            S33A:   [this.reles.A00,    this.reles.G03,     this.reles.H03],
            S34A:   [this.reles.A01,    this.reles.G04,     this.reles.H04],
            S35A:   [this.reles.A02,    this.reles.G05,     this.reles.H05],
            S30R:   [this.reles.A00R,   this.reles.G00R,    this.reles.H00R],
            S31R:   [this.reles.A01R,   this.reles.G01R,    this.reles.H01R],
            S32R:   [this.reles.A02R,   this.reles.G02R,    this.reles.H02R],
            S33R:   [this.reles.A00R,   this.reles.G03R,    this.reles.H03R],
            S34R:   [this.reles.A01R,   this.reles.G04R,    this.reles.H04R],
            S35R:   [this.reles.A02R,   this.reles.G05R,    this.reles.H05R],

            S36A:   [this.reles.A00,    this.reles.H00,     this.reles.G05R],
            S37A:   [this.reles.A01,    this.reles.H01,     this.reles.G03R],
            S38A:   [this.reles.A02,    this.reles.H02,     this.reles.G04R],
            S39A:   [this.reles.A00,    this.reles.H03,     this.reles.G01R],
            S40A:   [this.reles.A01,    this.reles.H04,     this.reles.G02R],
            S41A:   [this.reles.A02,    this.reles.H05,     this.reles.G00R],
            S36R:   [this.reles.A00R,   this.reles.H00R,    this.reles.G05],
            S37R:   [this.reles.A01R,   this.reles.H01R,    this.reles.G03],
            S38R:   [this.reles.A02R,   this.reles.H02R,    this.reles.G04],
            S39R:   [this.reles.A00R,   this.reles.H03R,    this.reles.G01],
            S40R:   [this.reles.A01R,   this.reles.H04R,    this.reles.G02],
            S41R:   [this.reles.A02R,   this.reles.H05R,    this.reles.G00],

            S42A:   [this.reles.A00,    this.reles.G05R,    this.reles.K00],
            S43A:   [this.reles.A01,    this.reles.G03R,    this.reles.K01],
            S44A:   [this.reles.A02,    this.reles.G04R,    this.reles.K02],
            S45A:   [this.reles.A00,    this.reles.G01R,    this.reles.K00],
            S46A:   [this.reles.A01,    this.reles.G02R,    this.reles.K01],
            S47A:   [this.reles.A02,    this.reles.G00R,    this.reles.K02],
            S42R:   [this.reles.A00R,   this.reles.G05,     this.reles.K00R],
            S43R:   [this.reles.A01R,   this.reles.G03,     this.reles.K01R],
            S44R:   [this.reles.A02R,   this.reles.G04,     this.reles.K02R],
            S45R:   [this.reles.A00R,   this.reles.G01,     this.reles.K00R],
            S46R:   [this.reles.A01R,   this.reles.G02,     this.reles.K01R],
            S47R:   [this.reles.A02R,   this.reles.G00,     this.reles.K02R],

            S48A:   [this.reles.B01,    this.reles.C00,     this.reles.J00],
            S49A:   [this.reles.B02,    this.reles.C01,     this.reles.J01],
            S50A:   [this.reles.B00,    this.reles.C02,     this.reles.J02],
            S51A:   [this.reles.B01,    this.reles.C02,     this.reles.J05],
            S52A:   [this.reles.B02,    this.reles.C00,     this.reles.J03],
            S53A:   [this.reles.B00,    this.reles.C01,     this.reles.J04],
            S48R:   [this.reles.B01R,   this.reles.C00R,    this.reles.J00R],
            S49R:   [this.reles.B02R,   this.reles.C01R,    this.reles.J01R],
            S50R:   [this.reles.B00R,   this.reles.C02R,    this.reles.J02R],
            S51R:   [this.reles.B01R,   this.reles.C02R,    this.reles.J05R],
            S52R:   [this.reles.B02R,   this.reles.C00R,    this.reles.J03R],
            S53R:   [this.reles.B00R,   this.reles.C01R,    this.reles.J04R],

            S54A:   [this.reles.B02,    this.reles.G04,     this.reles.I02R],
            S55A:   [this.reles.B00,    this.reles.G05,     this.reles.I00R],
            S56A:   [this.reles.B01,    this.reles.G03,     this.reles.I01R],
            S57A:   [this.reles.B02,    this.reles.G00,     this.reles.I02R],
            S58A:   [this.reles.B00,    this.reles.G01,     this.reles.I00R],
            S59A:   [this.reles.B01,    this.reles.G02,     this.reles.I01R],
            S54R:   [this.reles.B02R,   this.reles.G04R,    this.reles.I02],
            S55R:   [this.reles.B00R,   this.reles.G05R,    this.reles.I00],
            S56R:   [this.reles.B01R,   this.reles.G03R,    this.reles.I01],
            S57R:   [this.reles.B02R,   this.reles.G00R,    this.reles.I02],
            S58R:   [this.reles.B00R,   this.reles.G01R,    this.reles.I00],
            S59R:   [this.reles.B01R,   this.reles.G02R,    this.reles.I01],

            S60A:   [this.reles.B02,    this.reles.G00,     this.reles.J03],
            S61A:   [this.reles.B00,    this.reles.G01,     this.reles.J04],
            S62A:   [this.reles.B01,    this.reles.G02,     this.reles.J05],
            S63A:   [this.reles.B02,    this.reles.G04,     this.reles.J01],
            S64A:   [this.reles.B00,    this.reles.G05,     this.reles.J02],
            S65A:   [this.reles.B01,    this.reles.G03,     this.reles.J00],
            S60R:   [this.reles.B02R,   this.reles.G00R,    this.reles.J03R],
            S61R:   [this.reles.B00R,   this.reles.G01R,    this.reles.J04R],
            S62R:   [this.reles.B01R,   this.reles.G02R,    this.reles.J05R],
            S63R:   [this.reles.B02R,   this.reles.G04R,    this.reles.J01R],
            S64R:   [this.reles.B00R,   this.reles.G05R,    this.reles.J02R],
            S65R:   [this.reles.B01R,   this.reles.G03R,    this.reles.J00R],

            S66A:   [this.reles.C00,    this.reles.G00,     this.reles.F00],
            S67A:   [this.reles.C01,    this.reles.G01,     this.reles.F01],
            S68A:   [this.reles.C02,    this.reles.G02,     this.reles.F02],
            S69A:   [this.reles.C00,    this.reles.G03,     this.reles.F03],
            S70A:   [this.reles.C01,    this.reles.G04,     this.reles.F04],
            S71A:   [this.reles.C02,    this.reles.G05,     this.reles.F05],
            S66R:   [this.reles.C00R,   this.reles.G00R,    this.reles.F00R],
            S67R:   [this.reles.C01R,   this.reles.G01R,    this.reles.F01R],
            S68R:   [this.reles.C02R,   this.reles.G02R,    this.reles.F02R],
            S69R:   [this.reles.C00R,   this.reles.G03R,    this.reles.F03R],
            S70R:   [this.reles.C01R,   this.reles.G04R,    this.reles.F04R],
            S71R:   [this.reles.C02R,   this.reles.G05R,    this.reles.F05R],

            S72A:   [this.reles.C00,    this.reles.G00,     this.reles.J03],
            S73A:   [this.reles.C01,    this.reles.G01,     this.reles.J04],
            S74A:   [this.reles.C02,    this.reles.G02,     this.reles.J05],
            S75A:   [this.reles.C00,    this.reles.G03,     this.reles.J00],
            S76A:   [this.reles.C01,    this.reles.G04,     this.reles.J01],
            S77A:   [this.reles.C02,    this.reles.G05,     this.reles.J02],
            S72R:   [this.reles.C00R,   this.reles.G00R,    this.reles.J03R],
            S73R:   [this.reles.C01R,   this.reles.G01R,    this.reles.J04R],
            S74R:   [this.reles.C02R,   this.reles.G02R,    this.reles.J05R],
            S75R:   [this.reles.C00R,   this.reles.G03R,    this.reles.J00R],
            S76R:   [this.reles.C01R,   this.reles.G04R,    this.reles.J01R],
            S77R:   [this.reles.C02R,   this.reles.G05R,    this.reles.J02R],

            S78A:   [this.reles.G00,    this.reles.G05R,    this.reles.H00],
            S79A:   [this.reles.G01,    this.reles.G03R,    this.reles.H01],
            S80A:   [this.reles.G02,    this.reles.G04R,    this.reles.H02],
            S81A:   [this.reles.G00,    this.reles.G05R,    this.reles.H05R],
            S82A:   [this.reles.G01,    this.reles.G03R,    this.reles.H03R],
            S83A:   [this.reles.G02,    this.reles.G04R,    this.reles.H04R],

            S78R:   [this.reles.G00R,   this.reles.G05,     this.reles.H00R],
            S79R:   [this.reles.G01R,   this.reles.G03,     this.reles.H01R],
            S80R:   [this.reles.G02R,   this.reles.G04,     this.reles.H02R],
            S81R:   [this.reles.G00R,   this.reles.G05,     this.reles.H05],
            S82R:   [this.reles.G01R,   this.reles.G03,     this.reles.H03],
            S83R:   [this.reles.G02R,   this.reles.G04,     this.reles.H04],

            S84A:   [this.reles.G00,    this.reles.I02R,    this.reles.G04],
            S85A:   [this.reles.G01,    this.reles.I00R,    this.reles.G05],
            S86A:   [this.reles.G02,    this.reles.I01R,    this.reles.G03],
            S87A:   [this.reles.G00,    this.reles.K02R,    this.reles.G04],
            S88A:   [this.reles.G01,    this.reles.K00R,    this.reles.G05],
            S89A:   [this.reles.G02,    this.reles.K01R,    this.reles.G03],
            S84R:   [this.reles.G00R,   this.reles.I02,     this.reles.G04R],
            S85R:   [this.reles.G01R,   this.reles.I00,     this.reles.G05R],
            S86R:   [this.reles.G02R,   this.reles.I01,     this.reles.G03R],
            S87R:   [this.reles.G00R,   this.reles.K02,     this.reles.G04R],
            S88R:   [this.reles.G01R,   this.reles.K00,     this.reles.G05R],
            S89R:   [this.reles.G02R,   this.reles.K01,     this.reles.G03R]
        };
    }
};
