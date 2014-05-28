/**
 * 5つの正四面体
 *
 */
var Fifth_Tetrahedron_Shift = function()
{
};


Fifth_Tetrahedron_Shift.prototype = {
    // 外部設定値
    fill_style:     'rgba(160, 112, 224, 0.2)',
    //fill_style:     'rgba(0, 0, 0, 1.0)',
    stroke_style:   'rgba(80, 32, 176, 0.2)',
    fill_stylew:    'rgba(0, 0, 0, 0.4)',
    stroke_style2:  'rgba(160, 0, 80, 0.4)',




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

        // 正三角形比率
        var RA01 = {
            A: 1,
            B: Math.pow(3, 1 / 2),
            C: 2
        };

        var XA00 = this.alpha;

        var RX00 = (RA01.A / RA01.B) + ((RA01.C / RA01.B) * (RA00.C / RA00.B));
        var XA01 = XA00 / Math.pow((1 + Math.pow(RX00, 2)), 1 / 2);
        var LA00 = XA01 / sin036;
        var LA01 = LA00 * sin072;
        var LA02 = LA00 * cos072;
        var LA03 = XA01;
        var LA04 = LA00 * cos036;

        var RX00 = {
            A: LA03,
            B: LA01,
            C: LA02 + LA04
        };
        var LA05 = LA04 * (RX00.B / RX00.A);

        var LB00 = LA00 * (RA00.C / RA00.B);
        var LB01 = LB00 * sin072;
        var LB02 = LB00 * cos072;
        var LB03 = LB00 * sin036;
        var LB04 = LB00 * cos036;
        var LB05 = LA03 * (RX00.A / RX00.C);

        var LC00 = (LA02 * 2) * (RA00.C / RA00.D);
        var LC01 = LC00 * sin072;
        var LC02 = LC00 * cos072;
        var LC03 = LC00 * sin036;
        var LC04 = LC00 * cos036;
        var LC05 = ((LA05 - LB05) * (RA00.C / RA00.D)) + LB05;

        var LD00 = LB01 * (RA00.B / RA00.D);
        var LD01 = ((LA00 + LB02) * (RA00.C / RA00.D)) - LB02;
        var LD02 = LA01 * (RA00.C / RA00.D);
        var LD03 = ((LA02 + LB00) * (RA00.B / RA00.D)) - LA02;
        var LD04 = ((LA03 + LB01) * (RA00.B / RA00.D)) - LA03;
        var LD05 = ((LA04 - LB02) * (RA00.C / RA00.D)) + LB02;
        var LD06 = ((LB03 - LA03) * (RA00.B / RA00.D)) + LA03;
        var LD07 = 0;//((LA04 + LB04) * (RA00.B / RA00.D)) - LA04;
        var LD08 = ((LA01 + LB03) * (RA00.C / RA00.D)) - LB03;
        var LD09 = ((LB04 - LA02) * (RA00.B / RA00.D)) + LA02;
        var LD10 = ((LA05 + LB05) * (RA00.C / RA00.D)) - LB05;

        var LE00 = LA03 * (RA00.B / RA00.D);
        var LE01 = (LA00 - LA04) * (RA00.C / RA00.D) + LA04;
        var LE02 = (LA01 - LA03) * (RA00.C / RA00.D) + LA03;
        var LE03 = (LA04 - LA02) * (RA00.B / RA00.D) + LA02;
        var LE04 = (LA01 - LA03) * (RA00.B / RA00.D) + LA03;
        var LE05 = (LA04 - LA02) * (RA00.C / RA00.D) + LA02;
        var LE06 = LA03 * (RA00.C / RA00.D);
        var LE07 = (LA00 - LA04) * (RA00.B / RA00.D) + LA04;
        var LE08 = LA01;
        var LE09 = LA02 * ((2 * (RA00.C / RA00.D)) - 1);
        var LE10 = LA05 * ((2 * (RA00.C / RA00.D)) - 1);

        var LF00 = LA00 * (RA00.C / RA00.D);
        var LF01 = LF00 * sin072;
        var LF02 = LF00 * cos072;
        var LF03 = LF00 * sin036;
        var LF04 = LF00 * cos036;

        var LG00 = LB05 * ((2 * (RA00.C / RA00.D)) - 1);
        var LO00 = ((LA05 - LG00) / 2) + LG00;
        var LF05 = ((LO00 - LG00) * (RA00.B / RA00.D)) + LG00;

        var LH00 = LA03 * (RA00.B / RA00.D);
        var LH01 = ((LA04 + LB00) * (RA00.C / RA00.D)) - LA04;
        var LH02 = ((LA03 + LB01) * (RA00.C / RA00.D)) - LA03;
        var LH03 = 0;//((LA04 + LB02) * (RA00.C / RA00.D)) - LA04;
        var LH04 = ((LA01 + LB03) * (RA00.C / RA00.D)) - LA01;
        var LH05 = ((LA02 + LB04) * (RA00.C / RA00.D)) - LA02;
        var LH06 = LB03 * (RA00.C / RA00.D);
        var LH07 = ((LA00 + LB04) * (RA00.C / RA00.D)) - LA00;
        var LH08 = ((LA01 + LB01) * (RA00.C / RA00.D)) - LA01;
        var LH09 = ((LB02 - LA02) * (RA00.C / RA00.D)) + LA02;
        var LH10 = ((LA05 - LB05) * (RA00.B / RA00.D)) + LB05;

        var LI00 = LA01 * (RA00.B / RA00.D);
        var LI01 = ((LA02 + LB00) * (RA00.C / RA00.D)) - LA02;
        var LI02 = LB01 * (RA00.C / RA00.D);
        var LI03 = ((LA00 + LB02) * (RA00.B / RA00.D)) - LB02;
        var LI04 = ((LA01 + LB03) * (RA00.C / RA00.D)) - LA01;
        var LI05 = ((LB04 - LA02) * (RA00.C / RA00.D)) + LA02;
        var LI06 = ((LB03 - LA03) * (RA00.C / RA00.D)) + LA03;
        var LI07 = ((LA04 + LB04) * (RA00.C / RA00.D)) - LA04;
        var LI08 = ((LA03 + LB01) * (RA00.C / RA00.D)) - LA03;
        var LI09 = ((LA04 - LB02) * (RA00.B / RA00.D)) + LB02;
        var LI10 = ((LA05 + LB05) * (RA00.C / RA00.D)) - LA05;

        var LJ00 = ((LA01 + LB03) * (RA00.C / RA00.D)) - LA01;
        var LJ01 = ((LB04 - LA02) * (RA00.C / RA00.D)) + LA02;
        var LJ02 = LB01 * (RA00.C / RA00.D);
        var LJ03 = ((LA00 + LB02) * (RA00.B / RA00.D)) - LB02;
        var LJ04 = LA01 * (RA00.B / RA00.D);
        var LJ05 = ((LA02 + LB00) * (RA00.C / RA00.D)) - LA02;
        var LJ06 = ((LA03 + LB01) * (RA00.C / RA00.D)) - LA03;
        var LJ07 = ((LA04 - LB02) * (RA00.B / RA00.D)) + LB02;
        var LJ08 = ((LB03 - LA03) * (RA00.C / RA00.D)) + LA03;
        var LJ09 = ((LA04 + LB04) * (RA00.C / RA00.D)) - LA04;
        var LJ10 = ((LA05 + LB05) * (RA00.C / RA00.D)) - LA05;

        var LK00 = LB05 * ((2 * (RA00.C / RA00.D)) - 1);

        var LL00 = LA03 * (RA00.C / RA00.D);
        var LL01 = ((LA00 - LA04) * (RA00.B / RA00.D)) + LA04;
        var LL02 = ((LA01 - LA03) * (RA00.B / RA00.D)) + LA03;
        var LL03 = ((LA04 - LA02) * (RA00.C / RA00.D)) + LA02;
        var LL04 = ((LA01 - LA03) * (RA00.C / RA00.D)) + LA03;
        var LL05 = ((LA04 - LA02) * (RA00.B / RA00.D)) + LA02;
        var LL06 = LA03 * (RA00.B / RA00.D);
        var LL07 = ((LA00 - LA04) * (RA00.C / RA00.D)) + LA04;
        var LL08 = LA01;
        var LL09 = LA02 * ((2 * (RA00.C / RA00.D)) - 1);
        var LL10 = LA05 * ((2 * (RA00.C / RA00.D)) - 1);

        this.reles.O00 = {X: 0,         Y: 0,           Z: LO00 * -1};
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
        this.reles.C00 = {X: 0,         Y: LC00 * -1,   Z: LC05 * -1};
        this.reles.C01 = {X: LC01,      Y: LC02 * -1,   Z: LC05 * -1};
        this.reles.C02 = {X: LC03,      Y: LC04,        Z: LC05 * -1};
        this.reles.C03 = {X: LC03 * -1, Y: LC04,        Z: LC05 * -1};
        this.reles.C04 = {X: LC01 * -1, Y: LC02 * -1,   Z: LC05 * -1};
        this.reles.D00 = {X: LD00,      Y: LD01 * -1,   Z: LD10 * -1};
        this.reles.D01 = {X: LD02,      Y: LD03,        Z: LD10 * -1};
        this.reles.D02 = {X: LD04 * -1, Y: LD05,        Z: LD10 * -1};
        this.reles.D03 = {X: LD06 * -1, Y: LD07,        Z: LD10 * -1};
        this.reles.D04 = {X: LD08 * -1, Y: LD09 * -1,   Z: LD10 * -1};
        this.reles.E00 = {X: LE00 * -1, Y: LE01 * -1,   Z: LE10 * -1};
        this.reles.E01 = {X: LE02,      Y: LE03 * -1,   Z: LE10 * -1};
        this.reles.E02 = {X: LE04,      Y: LE05,        Z: LE10 * -1};
        this.reles.E03 = {X: LE06 * -1, Y: LE07,        Z: LE10 * -1};
        this.reles.E04 = {X: LE08 * -1, Y: LE09 * -1,   Z: LE10 * -1};
        this.reles.F00 = {X: 0,         Y: LF00,        Z: LF05 * -1};
        this.reles.F01 = {X: LF01 * -1, Y: LF02,        Z: LF05 * -1};
        this.reles.F02 = {X: LF03 * -1, Y: LF04 * -1,   Z: LF05 * -1};
        this.reles.F03 = {X: LF03,      Y: LF04 * -1,   Z: LF05 * -1};
        this.reles.F04 = {X: LF01,      Y: LF02,        Z: LF05 * -1};
        this.reles.G00 = {X: 0,         Y: LA00,        Z: LG00 * -1};
        this.reles.G01 = {X: LA01 * -1, Y: LA02,        Z: LG00 * -1};
        this.reles.G02 = {X: LA03 * -1, Y: LA04 * -1,   Z: LG00 * -1};
        this.reles.G03 = {X: LA03,      Y: LA04 * -1,   Z: LG00 * -1};
        this.reles.G04 = {X: LA01,      Y: LA02,        Z: LG00 * -1};
        this.reles.H00 = {X: LH00,      Y: LH01 * -1,   Z: LH05 * -1};
        this.reles.H01 = {X: LH02,      Y: LH03,        Z: LH05 * -1};
        this.reles.H02 = {X: LH04,      Y: LH05,        Z: LH05 * -1};
        this.reles.H03 = {X: LH06 * -1, Y: LH07,        Z: LH05 * -1};
        this.reles.H04 = {X: LH08 * -1, Y: LH09 * -1,   Z: LH05 * -1};
        this.reles.I00 = {X: LI00,      Y: LI01 * -1,   Z: LI10 * -1};
        this.reles.I01 = {X: LI02,      Y: LI03,        Z: LI10 * -1};
        this.reles.I02 = {X: LI04,      Y: LI05,        Z: LI10 * -1};
        this.reles.I03 = {X: LI06 * -1, Y: LI07,        Z: LI10 * -1};
        this.reles.I04 = {X: LI08 * -1, Y: LI09 * -1,   Z: LI10 * -1};
        this.reles.J00 = {X: LJ00,      Y: LJ01 * -1,   Z: LJ10};
        this.reles.J01 = {X: LJ02,      Y: LJ03 * -1,   Z: LJ10};
        this.reles.J02 = {X: LJ04,      Y: LJ05,        Z: LJ10};
        this.reles.J03 = {X: LJ06 * -1, Y: LJ07,        Z: LJ10};
        this.reles.J04 = {X: LJ08 * -1, Y: LJ09 * -1,   Z: LJ10};
        
        
        
        this.reles.K00 = {X: 0,         Y: LA00 * -1,   Z: LK00};
        this.reles.K01 = {X: LA01,      Y: LA02 * -1,   Z: LK00};
        this.reles.K02 = {X: LA03,      Y: LA04,        Z: LK00};
        this.reles.K03 = {X: LA03 * -1, Y: LA04,        Z: LK00};
        this.reles.K04 = {X: LA01 * -1, Y: LA02 * -1,   Z: LK00};

        this.reles.L00 = {X: LL00 * -1, Y: LL01 * -1,   Z: LL10};
        this.reles.L01 = {X: LL02,      Y: LL03 * -1,   Z: LL10};
        this.reles.L02 = {X: LL04,      Y: LL05,        Z: LL10};
        this.reles.L03 = {X: LL06 * -1, Y: LL07,        Z: LL10};
        this.reles.L04 = {X: LL08 * -1, Y: LL09,        Z: LL10};

        this.reles.M00 = {X: LH00,      Y: LH01 * -1,   Z: LH05};
        this.reles.M01 = {X: LH02,      Y: LH03,        Z: LH05};
        this.reles.M02 = {X: LH04,      Y: LH05,        Z: LH05};
        this.reles.M03 = {X: LH06 * -1, Y: LH07,        Z: LH05};
        this.reles.M04 = {X: LH08 * -1, Y: LH09 * -1,   Z: LH05};

        this.reles.N00 = {X: LH00,      Y: LH01 * -1,   Z: LH05};
        this.reles.N01 = {X: LH02,      Y: LH03,        Z: LH05};
        this.reles.N02 = {X: LH04,      Y: LH05,        Z: LH05};
        this.reles.N03 = {X: LH06 * -1, Y: LH07,        Z: LH05};
        this.reles.N04 = {X: LH08 * -1, Y: LH09 * -1,   Z: LH05};
        
        this.reles.Z00 = {X: LD02,      Y: LD03,        Z: LD10};
        this.reles.Z01 = {X: LD00,      Y: LD01 * -1,   Z: LD10};
        this.reles.Z02 = {X: LD08 * -1, Y: LD09 * -1,   Z: LD10};
        this.reles.Z03 = {X: LD06 * -1, Y: LD07,        Z: LD10};
        this.reles.Z04 = {X: LD04 * -1, Y: LD05,        Z: LD10};

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
            S00A:   [this.reles.O00,    this.reles.C04,     this.reles.A00,     this.reles.D00,     this.reles.C00],
            S01A:   [this.reles.O00,    this.reles.C00,     this.reles.A01,     this.reles.D01,     this.reles.C01],
            S02A:   [this.reles.O00,    this.reles.C01,     this.reles.A02,     this.reles.D02,     this.reles.C02],
            S03A:   [this.reles.O00,    this.reles.C02,     this.reles.A03,     this.reles.D03,     this.reles.C03],
            S04A:   [this.reles.O00,    this.reles.C03,     this.reles.A04,     this.reles.D04,     this.reles.C04],
            S00R:   [this.reles.O00R,   this.reles.C01R,    this.reles.A00R,    this.reles.Z00,     this.reles.C00R],
            S01R:   [this.reles.O00R,   this.reles.C00R,    this.reles.A04R,    this.reles.Z01,     this.reles.C04R],
            S02R:   [this.reles.O00R,   this.reles.C04R,    this.reles.A03R,    this.reles.Z02,     this.reles.C03R],
            S03R:   [this.reles.O00R,   this.reles.C03R,    this.reles.A02R,    this.reles.Z03,     this.reles.C02R],
            S04R:   [this.reles.O00R,   this.reles.C02R,    this.reles.A01R,    this.reles.Z04,     this.reles.C01R],

            S05A:   [this.reles.A00,    this.reles.C04,     this.reles.D04,     this.reles.F02,     this.reles.E00],
            S06A:   [this.reles.A01,    this.reles.C00,     this.reles.D00,     this.reles.F03,     this.reles.E01],
            S07A:   [this.reles.A02,    this.reles.C01,     this.reles.D01,     this.reles.F04,     this.reles.E02],
            S08A:   [this.reles.A03,    this.reles.C02,     this.reles.D02,     this.reles.F00,     this.reles.E03],
            S09A:   [this.reles.A04,    this.reles.C03,     this.reles.D03,     this.reles.F01,     this.reles.E04],
            S05R:   [this.reles.A03R,   this.reles.C04R,    this.reles.Z01,     this.reles.F01R,    this.reles.L01],
            S06R:   [this.reles.A04R,   this.reles.C00R,    this.reles.Z00,     this.reles.F02R,    this.reles.L02],
            S07R:   [this.reles.A00R,   this.reles.C01R,    this.reles.Z04,     this.reles.F03R,    this.reles.L03],
            S08R:   [this.reles.A01R,   this.reles.C02R,    this.reles.Z03,     this.reles.F04R,    this.reles.L04],
            S09R:   [this.reles.A02R,   this.reles.C03R,    this.reles.Z02,     this.reles.F00R,    this.reles.L00],

            S10A:   [this.reles.B00,    this.reles.G02,     this.reles.F02,     this.reles.E00,     this.reles.H00],
            S11A:   [this.reles.B01,    this.reles.G03,     this.reles.F03,     this.reles.E01,     this.reles.H01],
            S12A:   [this.reles.B02,    this.reles.G04,     this.reles.F04,     this.reles.E02,     this.reles.H02],
            S13A:   [this.reles.B03,    this.reles.G00,     this.reles.F00,     this.reles.E03,     this.reles.H03],
            S14A:   [this.reles.B04,    this.reles.G01,     this.reles.F01,     this.reles.E04,     this.reles.H04],
            S10R:   [this.reles.B03R,   this.reles.K01,     this.reles.F01R,    this.reles.L01,     this.reles.M00],
            S11R:   [this.reles.B04R,   this.reles.K02,     this.reles.F02R,    this.reles.L02,     this.reles.M01],
            S12R:   [this.reles.B00R,   this.reles.K03,     this.reles.F03R,    this.reles.L03,     this.reles.M02],
            S13R:   [this.reles.B01R,   this.reles.K04,     this.reles.F04R,    this.reles.L04,     this.reles.M03],
            S14R:   [this.reles.B02R,   this.reles.K00,     this.reles.F00R,    this.reles.L00,     this.reles.M04],

            S15A:   [this.reles.A00,    this.reles.D00,     this.reles.F03,     this.reles.H00,     this.reles.E00],
            S16A:   [this.reles.A01,    this.reles.D01,     this.reles.F04,     this.reles.H01,     this.reles.E01],
            S17A:   [this.reles.A02,    this.reles.D02,     this.reles.F00,     this.reles.H02,     this.reles.E02],
            S18A:   [this.reles.A03,    this.reles.D03,     this.reles.F01,     this.reles.H03,     this.reles.E03],
            S19A:   [this.reles.A04,    this.reles.D04,     this.reles.F02,     this.reles.H04,     this.reles.E04],
            S15R:   [this.reles.A03R,   this.reles.Z02,     this.reles.F00R,    this.reles.M00,     this.reles.L01],
            S16R:   [this.reles.A04R,   this.reles.Z01,     this.reles.F01R,    this.reles.M01,     this.reles.L02],
            S17R:   [this.reles.A00R,   this.reles.Z00,     this.reles.F02R,    this.reles.M02,     this.reles.L03],
            S18R:   [this.reles.A01R,   this.reles.Z04,     this.reles.F03R,    this.reles.M03,     this.reles.L04],
            S19R:   [this.reles.A02R,   this.reles.Z03,     this.reles.F04R,    this.reles.M04,     this.reles.L00],

            S20A:   [this.reles.B00,    this.reles.H00,     this.reles.F03,     this.reles.J00,     this.reles.I00],
            S21A:   [this.reles.B01,    this.reles.H01,     this.reles.F04,     this.reles.J01,     this.reles.I01],
            S22A:   [this.reles.B02,    this.reles.H02,     this.reles.F00,     this.reles.J02,     this.reles.I02],
            S23A:   [this.reles.B03,    this.reles.H03,     this.reles.F01,     this.reles.J03,     this.reles.I03],
            S24A:   [this.reles.B04,    this.reles.H04,     this.reles.F02,     this.reles.J04,     this.reles.I04],
            S20R:   [this.reles.B03R,   this.reles.N00,     this.reles.F00R,    this.reles.I00,     this.reles.J00],
            S21R:   [this.reles.B04R,   this.reles.N01,     this.reles.F01R,    this.reles.I01,     this.reles.J01],
            S22R:   [this.reles.B00R,   this.reles.N02,     this.reles.F02R,    this.reles.I02,     this.reles.J02],
            S23R:   [this.reles.B01R,   this.reles.N03,     this.reles.F03R,    this.reles.I03,     this.reles.J03],
            S24R:   [this.reles.B02R,   this.reles.N04,     this.reles.F04R,    this.reles.I04,     this.reles.J04],

            S25A:   [this.reles.B00,    this.reles.I00,     this.reles.F00R,    this.reles.G00R,    this.reles.G02],
            S26A:   [this.reles.B01,    this.reles.I01,     this.reles.F01R,    this.reles.G01R,    this.reles.G03],
            S27A:   [this.reles.B02,    this.reles.I02,     this.reles.F02R,    this.reles.G02R,    this.reles.G04],
            S28A:   [this.reles.B03,    this.reles.I03,     this.reles.F03R,    this.reles.G03R,    this.reles.G00],
            S29A:   [this.reles.B04,    this.reles.I04,     this.reles.F04R,    this.reles.G04R,    this.reles.G01],
            S25R:   [this.reles.B00R,   this.reles.J02,     this.reles.F00,     this.reles.G00,     this.reles.G03R],
            S26R:   [this.reles.B01R,   this.reles.J03,     this.reles.F01,     this.reles.G01,     this.reles.G04R],
            S27R:   [this.reles.B02R,   this.reles.J04,     this.reles.F02,     this.reles.G02,     this.reles.G00R],
            S28R:   [this.reles.B03R,   this.reles.J00,     this.reles.F03,     this.reles.G03,     this.reles.G01R],
            S29R:   [this.reles.B04R,   this.reles.J01,     this.reles.F04,     this.reles.G04,     this.reles.G02R]
        };
    },
zzzzoutput: function(x, y, z)
{
    this.canvas_context.setTransform(1, 0, 0, 1, 0, 0);
    this.canvas_context.clearRect(0, 0, this.size, this.size);
    this._output(this.surfaces2, this.fill_style2,   this.stroke_style2, x, y, z);
    this._output(this.surfaces,  this.fill_style,    this.stroke_style,  x, y, z);

    this.lockOn('I01', x, y, z);
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
