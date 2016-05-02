/**
 * 幾何計算機能群
 *
 */
var geometry_calculator = {
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
     *
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
    },


    /**
     * 特定位置からの相対移動による絶対位置の返却
     *
     * @param   float   base_rotate_theta
     * @param   float   base_vector_theta
     * @param   float   base_length_theta
     * @param   float   move_rotate_theta
     * @param   float   move_vector_theta
     * @param   float   move_length_theta
     * @return  object
     */
    getThetasByRelative: function(base_rotate_theta, base_vector_theta, base_length_theta, move_rotate_theta, move_vector_theta, move_length_theta)
    {
        var getLengthesByTheta  = geometry_calculator.getLengthesByTheta;
        var getLengthByPytha    = geometry_calculator.getLengthByPytha;
        var getThetaByLengthes  = geometry_calculator.getThetaByLengthes;

        var TA0 = move_vector_theta - (Math.PI / 2);
        var TY0 = base_vector_theta - TA0;
        var LS0 = getLengthesByTheta('Z', base_length_theta);
        var RY0 = LS0.Y;
        var LZ0 = LS0.X;
        var LS1 = getLengthesByTheta('Y', TY0);
        var LX1 = LS1.X * RY0;
        var LY1 = LS1.Y * RY0;
        var RX1 = getLengthByPytha(null, LX1, LZ0);
        var TX1 = getThetaByLengthes('X', LX1, LZ0);
        var TX2 = TX1 + move_length_theta;
        var LS2 = getLengthesByTheta('X', TX2);
        var LX2 = LS2.X * RX1;
        var LZ2 = LS2.Y * RX1;
        var RY2 = getLengthByPytha(null, LX2, LY1);
        var TL2 = getThetaByLengthes('Z', LZ2, RY2);
        var TV2 = getThetaByLengthes('Y', LX2, LY1);

        if (LY1 == 0) {
            var TX = 0;
        } else {
            var LS3 = getLengthesByTheta('X', TX1);
            var LX3 = LS3.X * RX1;
            var LZ3 = LS3.Y * RX1;
            var RY3 = getLengthByPytha(null, LX3, LY1);
            var TL3 = getThetaByLengthes('Z', LZ3, RY3);
            var TV3 = getThetaByLengthes('Y', LX3, LY1);
            var L0 = Math.sin(TV3);
            var L1 = Math.cos(TV3);
            var L2 = Math.cos(TL3) * L1;
            var T0 = getThetaByLengthes('Y', L2, L0);
            var T1 = T0 + TV3;

            var L3 = Math.sin(TV2);
            var L4 = Math.cos(TV2);
            var L5 = Math.cos(TL2) * L4;
            var T2 = getThetaByLengthes('Y', L5, L3);
            var T3 = T2 + TV2;
            var TX = T3 - T1;
        }

        rotate_theta = TX + base_rotate_theta;
        vector_theta = TV2 + TA0;
        length_theta = TL2;

        return {
            rotate_theta: rotate_theta,
            vector_theta: vector_theta,
            length_theta: length_theta
        };
    }
};
