/**
 * 多面体データ基礎構造構築機能
 *
 */
var Polyhedron_Basis_Theta = function()
{
};


Polyhedron_Basis_Theta.prototype = {
    /**
     * 共通プロパティ
     *
     */
    property: {
        // 依存モデル
        basis:              null,

        // HTMLデータ
        frame_node:         null,
        canvas_node:        null,
        canvas_context:     null,


        // 外部設定値
        alpha:              20,
        size:               100,
        fill_style:         null,
        stroke_style:       null,


        // 内部設定値
        _center:            null,


        // メソッド共有変数
        reles:              null,
        moment_poses:       null,
        surfaces:           null,
        moment_surfaces:    null,
    },


    /**
     * 実体化
     *
     * @param   string  embody_key
     * @param   string  frame_node
     * @param   object  params
     */
    summons: function(embody_key, frame_node, params)
    {
        try {
            // 実体化
            eval('var embody = new ' + embody_key + '();');
            embody.basis = this;

            // プロパティ定義
            for (var i in this.property) {
                if (embody[i] === undefined) {
                    embody[i] = this.property[i];
                }
            }
            if (params != undefined) {
                for (var i in params) {
                    if (embody[i] !== undefined) {
                        embody[i] = params[i];
                    }
                }
            }

            // 内部変数の初期化
            embody._center      = embody.size / 2 + 0.5;
            embody.reles        = {};
            embody.moment_poses = {};

            // HTMLデータの初期化
            if (frame_node === undefined) {
                throw 'Undefined param(frame).';
            }
            embody.frame_node       = frame_node;
            embody.canvas_node      = document.createElement('canvas');
            embody.canvas_context   = embody.canvas_node.getContext('2d');
            $(embody.canvas_node).attr('width',   (embody._center * 2) + 'px');
            $(embody.canvas_node).attr('height',  (embody._center * 2) + 'px');
            $(embody.canvas_node).css('position',   'absolute');
            embody.frame_node.appendChild(embody.canvas_node);

            // 共通メソッド定義
            var ref = this;
            if (embody.configure === undefined) {
                throw 'Undefined method(configure()).';
            }
            embody.setDirection = function(rotate_theta, vector_theta, length_theta){
                ref.setDirection(this, rotate_theta, vector_theta, length_theta);
            };
            embody.output = function(){
                ref.output(this);
            };
            embody.getLengthByPytha = function(hypotenuse, cathetus1, cathetus2){
                return ref.getLengthByPytha(hypotenuse, cathetus1, cathetus2);
            };
            embody.finalizeRatioByPytha = function(ratio){
                return ref.finalizeRatioByPytha(ratio);
            };
            embody.getThetaByLengthes = function(theta_code, X, Y){
                return ref.getThetaByLengthes(theta_code, X, Y);
            };
            embody.getLengthesByTheta = function(theta_code, theta){
                return ref.getLengthesByTheta(theta_code, theta);
            };

            // 実体初期化
            embody.configure();
        } catch (e) {
            alert(e);
        }

        return embody;
    },


    /**
     * 方向転換
     *
     * @param   object  embody
     * @param   float   rotate_theta
     * @param   float   vector_theta
     * @param   float   length_theta
     */
    setDirection: function(embody, rotate_theta, vector_theta, length_theta)
    {
        embody.moment_surfaces = new Array();

        var axis_theta = (vector_theta - (Math.PI / 2));

        for (var i in embody.surfaces) {
            var poses = new Array();
            var z_index = 0;

            for (var j = 0; j < embody.surfaces[i].length; j ++) {
                var pos_code = embody.surfaces[i][j];

                var LS0 = this.getLengthesByTheta('Z', embody.reles[pos_code].X);
                var RY0 = LS0.Y;
                var LZ0 = LS0.X;

                var TY1 = embody.reles[pos_code].Y + rotate_theta - axis_theta;
                var LS1 = this.getLengthesByTheta('Y', TY1);
                var LX1 = LS1.X * RY0 * -1;
                var LY1 = LS1.Y * RY0 * -1;
                var TX1 = this.getThetaByLengthes('X', LX1, LZ0);
                var RX1 = this.getLengthByPytha(null, LX1, LZ0);
                var TX2 = TX1 + length_theta;
                var LS2 = this.getLengthesByTheta('X', TX2);
                var LX2 = LS2.X * RX1;
                var LZ2 = LS2.Y * RX1;
                var RY2 = this.getLengthByPytha(null, LX2, LY1);
                var TY2 = this.getThetaByLengthes('Y', LX2, LY1);

                var TY3 = TY2 + axis_theta;
                var LS3 = this.getLengthesByTheta('Y', TY3);
                var LX3 = LS3.X * RY2;
                var LY3 = LS3.Y * RY2;
                var X = LX3 * embody.reles[pos_code].R;
                var Y = LY3 * embody.reles[pos_code].R;
                var Z = LZ2 * embody.reles[pos_code].R;

                embody.moment_poses[pos_code] = {X: X, Y: Y, Z: Z};

                z_index += Z;
            }

            z_index = z_index / embody.surfaces[i].length;
            embody.moment_surfaces.push({code: i, z_index: z_index});
        }

        embody.moment_surfaces.sort(function(A, B){return A.z_index - B.z_index;});
    },


    /**
     * 描画
     *
     * @param   object  embody
     */
    output: function(embody)
    {
        embody.canvas_context.setTransform(1, 0, 0, 1, 0, 0);
        embody.canvas_context.clearRect(0, 0, embody.size, embody.size);

        for (var i = 0; i < embody.moment_surfaces.length; i ++) {
            embody.canvas_context.beginPath();

            var surface = embody.surfaces[embody.moment_surfaces[i].code];

            for (var j = 0; j < surface.length; j ++) {
                var pos = embody.moment_poses[surface[j]];
                if (j == 0) {
                    embody.canvas_context.moveTo(embody._center + pos.X, embody._center + pos.Y);
                } else {
                    embody.canvas_context.lineTo(embody._center + pos.X, embody._center + pos.Y);
                }
            }

            embody.canvas_context.closePath();
            embody.canvas_context.fillStyle     = embody.fill_style;
            embody.canvas_context.fill();
            embody.canvas_context.strokeStyle   = embody.stroke_style;
            embody.canvas_context.stroke();
        }
    },


    /**
     * 三平方の定理による辺の長の返却
     *
     * @param   float   hypotenuse
     * @param   float   cathetus1
     * @param   float   cathetus2
     */
    getLengthByPytha: function(hypotenuse, cathetus1, cathetus2)
    {
        switch (null) {
            case hypotenuse:    var line_length = Math.pow((Math.pow(cathetus1,  2) + Math.pow(cathetus2, 2)), (1 / 2)); break;
            case cathetus1:     var line_length = Math.pow((Math.pow(hypotenuse, 2) - Math.pow(cathetus2, 2)), (1 / 2)); break;
            case cathetus2:     var line_length = Math.pow((Math.pow(hypotenuse, 2) - Math.pow(cathetus1, 2)), (1 / 2)); break;
        }

        return line_length;
    },


    /**
     * 三平方の定理による辺の比率の補完
     *
     * @param   object  ratio
     */
    finalizeRatioByPytha: function(ratio)
    {
        switch (null) {
            case ratio.A: ratio.A = Math.pow((Math.pow(ratio.B, 2) + Math.pow(ratio.C, 2)), (1 / 2)); break;
            case ratio.B: ratio.B = Math.pow((Math.pow(ratio.A, 2) - Math.pow(ratio.C, 2)), (1 / 2)); break;
            case ratio.C: ratio.C = Math.pow((Math.pow(ratio.A, 2) - Math.pow(ratio.B, 2)), (1 / 2)); break;
        }

        return ratio;
    },


    /**
     */
    getThetaByLengthes: function(theta_code, X, Y)
    {
        var X_ABS = Math.abs(X);
        var Y_ABS = Math.abs(Y);
        var TA_ZR = 0;
        var TA_LG = Math.PI / 2;
        var TR_ZR = Math.PI * -1;
        var TR_LG = (Math.PI * -1) / 2;

        switch (theta_code) {
            case 'X':
                switch (true) {
                    case ((X >  0) && (Y >  0)): var theta = TR_LG + Math.atan(Y_ABS / X_ABS); break;
                    case ((X >  0) && (Y <= 0)): var theta = TR_LG - Math.atan(Y_ABS / X_ABS); break;
                    case ((X <  0) && (Y >  0)): var theta = TA_LG - Math.atan(Y_ABS / X_ABS); break;
                    case ((X <  0) && (Y <= 0)): var theta = TA_LG + Math.atan(Y_ABS / X_ABS); break;
                    case ((X == 0) && (Y >  0)): var theta = TA_ZR;                            break;
                    case ((X == 0) && (Y <= 0)): var theta = TR_ZR;                            break;
                }
                break;

            case 'Y':
                switch (true) {
                    case ((X >  0) && (Y >  0)): var theta = TR_LG - Math.atan(Y_ABS / X_ABS); break;
                    case ((X >  0) && (Y <= 0)): var theta = TR_LG + Math.atan(Y_ABS / X_ABS); break;
                    case ((X <  0) && (Y >  0)): var theta = TA_LG + Math.atan(Y_ABS / X_ABS); break;
                    case ((X <  0) && (Y <= 0)): var theta = TA_LG - Math.atan(Y_ABS / X_ABS); break;
                    case ((X == 0) && (Y >  0)): var theta = TR_ZR;                            break;
                    case ((X == 0) && (Y <= 0)): var theta = TA_ZR;                            break;
                }
                break;

            case 'Z':
                switch (true) {
                    case ((X >  0) && (Y >  0)): var theta = TA_ZR - Math.atan(Y_ABS / X_ABS); break;
                    case ((X >  0) && (Y <= 0)): var theta = TA_ZR + Math.atan(Y_ABS / X_ABS); break;
                    case ((X <  0) && (Y >  0)): var theta = TR_ZR + Math.atan(Y_ABS / X_ABS); break;
                    case ((X <  0) && (Y <= 0)): var theta = TR_ZR - Math.atan(Y_ABS / X_ABS); break;
                    case ((X == 0) && (Y >  0)): var theta = TR_LG;                            break;
                    case ((X == 0) && (Y <= 0)): var theta = TA_LG;                            break;
                }
                break;
        }

        return theta;
    },


    /**
     */
    getLengthesByTheta: function(theta_code, theta)
    {
        theta = theta % (Math.PI * 2);
        theta = (theta > Math.PI)      ? (theta - (Math.PI * 2)) : theta;
        theta = (theta < Math.PI * -1) ? (theta + (Math.PI * 2)) : theta;

        var T_ABS = Math.abs(theta);
        var S_ABS = Math.abs(Math.sin(theta));
        var C_ABS = Math.abs(Math.cos(theta));
        var TA_ZR = 0;
        var TA_LG = Math.PI / 2;
        var TR_ZR = Math.PI * -1;
        var TR_LG = (Math.PI * -1) / 2;

        switch (theta_code) {
            case 'X':
                var X = (theta > TA_ZR) ? S_ABS * -1 : S_ABS;
                var Y = (T_ABS > TA_LG) ? C_ABS * -1 : C_ABS;
                break;

            case 'Y':
                var X = (theta > TA_ZR) ? S_ABS * -1 : S_ABS;
                var Y = (T_ABS > TA_LG) ? C_ABS : C_ABS * -1;
                break;

            case 'Z':
                var X = (T_ABS > TA_LG) ? C_ABS * -1 : C_ABS;
                var Y = (theta > TA_ZR) ? S_ABS * -1 : S_ABS;
                break;
        }

        return {X: X, Y: Y};
    },


    /**
     * 軸の傾斜に対応する座標の返却
     *
     * @param   object  poses
     * @param   object  thetas
     */
    getPosesByThetas: function(poses, thetas)
    {
        var X0 = poses.X;
        var Y0 = poses.Y;
        var Z0 = poses.Z;
        var X1 = (X0 * Math.cos(thetas.X)) + (Z0 * Math.sin(thetas.X));
        var Z1 = (Z0 * Math.cos(thetas.X)) - (X0 * Math.sin(thetas.X));
        var X2 = (X1 * Math.cos(thetas.Y)) + (Y0 * Math.sin(thetas.Y));
        var Y2 = (Y0 * Math.cos(thetas.Y)) - (X1 * Math.sin(thetas.Y));
        var Y3 = (Y2 * Math.cos(thetas.Z)) - (Z1 * Math.sin(thetas.Z));

        return {
            X: parseFloat(X2) * -1,
            Y: parseFloat(Y3) * -1,
            Z: parseFloat(Z1) * -1
        };
    }
};
