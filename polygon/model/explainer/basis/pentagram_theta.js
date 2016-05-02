/**
 * 五芒星
 *
 */
var Pentagram_Theta_Explain = function()
{
};


Pentagram_Theta_Explain.prototype = {
    /**
     * 初期化
     *
     */
    configure: function()
    {
        // 五芒星比率
        var RA_A01 = {
            A: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2)) - 2,
            B: 1,
            C: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2)) - 1,
            D: (4 * Math.pow(Math.cos(Math.PI * 2 / 10), 2))
        };

        /*var reles_aid = {};

        reles_aid.X00 = {R: 0, X: 0, Y: 0};

        for (var i in reles_aid) {
            this.object_basis.reles[i] = reles_aid[i];
        }*/
        
        
        
        
        
        
        /*var LX_A00 = this.alpha;
        var LX_A01 = LX_A00 * (RA_A01.A / RA_A01.C);

        var LT_A00 = LX_A00;
        var LT_B00 = LX_A01;

        var TX_A00 = Math.PI / 2;

        var TY_A00 = 0;
        var TY_B00 = Math.PI;

        var reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00},
            B0: {R: LT_B00, X: TX_A00, Y: TY_B00}
        };

        for (var i in reles_base) {
            var base_R = reles_base[i].R;
            var base_X = reles_base[i].X;
            var base_Y = reles_base[i].Y;

            for (var n = 0; n < 5; n ++) {
                this.reles[i + n + 'AO'] = {R: base_R};

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((Math.PI * 2 / 5) * n);
            }
        }*/
        
        
        
        
        
        this.proofs[0] = {
            lines: [
                {code: 'A00', poses: ['A00AO', 'A01AO', 'A02AO', 'A03AO', 'A04AO'], color: [128, 128, 128]},
                {code: 'A01', poses: ['A00AO', 'B02AO', 'B03AO'],                   color: [128, 128, 128]},
                {code: 'A02', poses: ['A01AO', 'B03AO', 'B04AO'],                   color: [128, 128, 128]},
                {code: 'A03', poses: ['A02AO', 'B04AO', 'B00AO'],                   color: [128, 128, 128]},
                {code: 'A04', poses: ['A03AO', 'B00AO', 'B01AO'],                   color: [128, 128, 128]},
                {code: 'A05', poses: ['A04AO', 'B01AO', 'B02AO'],                   color: [128, 128, 128]}
            ],
            theta: {R: 0, V: 0, L: 0},
            texts: [
                ['(A01) ', {T: '正五角形', P: ['A00AO', 'A01AO', 'A02AO', 'A03AO', 'A04AO'], C: [128, 128, 128]}, 'を定義']
            ]
        };
        this.proofs[1] = {
            reset_lines: ['A00', 'A01', 'A02', 'A03', 'A04', 'A05'],
            lines: [
                {code: 'A06', poses: ['B01AO', 'B02AO'], color: [255,   0,   0]},
                {code: 'A07', poses: ['A00AO', 'B02AO'], color: [  0,   0, 255]},
                {code: 'A08', poses: ['A02AO', 'B04AO'], color: [255, 128, 128]},
                {code: 'A09', poses: ['A00AO', 'B04AO'], color: [128, 128, 255]},
                {code: 'A10', poses: ['B02AO', 'B04AO'], color: [128, 128, 128]},
                {code: 'A11', poses: ['B01AO', 'A02AO'], color: [128, 128, 128]}
            ],
            theta: {R: 0, V: 0, L: 0},
            texts: [
                ['(A02) ∴(A01) ', {T: 'lin', P: ['A02AO', 'B01AO'], C: [128, 128, 128]}, '∥', {T: 'lin', P: ['B04AO', 'B02AO'], C: [128, 128, 128]}],
                ['(A03) ∴(A04) ', '(', {T: 'lin', P: ['B01AO', 'B02AO'], C: [255, 0, 0]}, ':', {T: 'lin', P: ['A00AO', 'B02AO'], C: [0, 0, 255]}, ') = (', {T: 'lin', P: ['A02AO', 'B04AO'], C: [255, 128, 128]}, ':', {T: 'lin', P: ['A00AO', 'B04AO'], C: [128, 128, 255]}, ')'],
                ['(A04) ∴(A01) ', {T: 'lin', P: ['A00AO', 'B02AO'], C: [0, 0, 255]}, '=', {T: 'lin', P: ['A02AO', 'B04AO'], C: [255, 128, 128]}],
                ['(A05) ∴(A01) ', {T: 'lin', P: ['A00AO', 'B01AO'], C: [128, 128, 128]}, '=', {T: 'lin', P: ['A00AO', 'B04AO'], C: [128, 128, 255]}],
                ['(A06) ∴(A03)(A04)(A05) ', '(', {T: 'lin', P: ['B01AO', 'B02AO'], C: [255, 0, 0]}, ':', {T: 'lin', P: ['A00AO', 'B02AO'], C: [0, 0, 255]}, ') = (', {T: 'lin', P: ['A00AO', 'B02AO'], C: [255, 128, 128]}, ':', {T: 'lin', P: ['A00AO', 'B01AO'], C: [128, 128, 128]}, ')'],
            ]
        };
        this.proofs[2] = {
            reset_lines: ['A06', 'A07', 'A10', 'A11'],
            lines: [
                {code: 'A12', poses: ['A01AO', 'A02AO'], color: [255,   0,   0]},
                {code: 'A13', poses: ['A00AO', 'A03AO'], color: [  0,   0, 255]},
                {code: 'A14', poses: ['A00AO', 'A01AO'], color: [128, 128, 128]},
                {code: 'A15', poses: ['A02AO', 'B01AO'], color: [128, 128, 128]}
            ],
            theta: {R: 0, V: 0, L: 0},
            texts: [
                ['(A07) ∴(A01) ', {T: 'lin', P: ['A00AO', 'B01AO'], C: [128, 128, 128]}, '∥', {T: 'lin', P: ['A01AO', 'A02AO'], C: [255, 0, 0]}],
                ['(A08) ∴(A07) ', '(', {T: 'lin', P: ['A01AO', 'A02AO'], C: [255, 0, 0]}, ':', {T: 'lin', P: ['A00AO', 'A03AO'], C: [0, 0, 255]}, ') = (', {T: 'lin', P: ['A02AO', 'B04AO'], C: [255, 128, 128]}, ':', {T: 'lin', P: ['A00AO', 'B04AO'], C: [128, 128, 255]}, ')'],
                ['(A09) ∴(A01) ', {T: 'lin', P: ['A00AO', 'A01AO'], C: [0, 0, 255]}, '∥', {T: 'lin', P: ['A02AO', 'B01AO'], C: [255, 0, 0]}],
                ['(A10) ∴(A07)(A09) ', {T: '四角形', P: ['A00AO', 'A01AO', 'A02AO', 'B01AO'], C: [128, 128, 128]}, 'は平行四辺形'],
                ['(A11) ∴(A10) ', {T: 'lin', P: ['A00AO', 'B01AO'], C: [0, 0, 255]}, '=', {T: 'lin', P: ['A01AO', 'A02AO'], C: [255, 0, 0]}],
                ['(A12) ∴(A07)(A11) ', '(', {T: 'lin', P: ['A00AO', 'B01AO'], C: [255, 0, 0]}, ':', {T: 'lin', P: ['A00AO', 'A03AO'], C: [0, 0, 255]}, ') = (', {T: 'lin', P: ['A02AO', 'B04AO'], C: [255, 128, 128]}, ':', {T: 'lin', P: ['A00AO', 'B04AO'], C: [128, 128, 255]}, ')'],
                ['(A13) ∴(A06)(A12) ', '(', {T: 'lin', P: ['B01AO', 'B02AO'], C: [255, 0, 0]}, ':', {T: 'lin', P: ['A00AO', 'B02AO'], C: [0, 0, 255]}, ') = (', {T: 'lin', P: ['A00AO', 'B01AO'], C: [255, 128, 128]}, ':', {T: 'lin', P: ['A00AO', 'A03AO'], C: [128, 128, 255]}, ')']
            ]
        };
    }
};
