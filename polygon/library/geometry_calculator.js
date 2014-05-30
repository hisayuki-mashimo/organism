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
    }
};
