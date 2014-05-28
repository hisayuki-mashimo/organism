/**
 * 多面体データ基礎構造構築機能
 *
 *
 */
var Polyhedron_Basis = function()
{
};


Polyhedron_Basis.prototype = {
    /**
     * 共通プロパティ
     *
     */
    property: {
        // 依存モデル
        basis:          null,


        // HTMLデータ
        frame_node:     null,
        canvas_node:    null,
        canvas_context: null,


        // 外部設定値
        alpha:          20,
        size:           100,
        fill_style:     null,
        stroke_style:   null,


        // 内部設定値
        _center:        null,


        // メソッド共有変数
        reles:          null,
        surfaces:       null
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
            embody._center  = embody.size / 2;
            embody.reles    = {};
            embody.surfaces = {};

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
            if (embody.output === undefined) {
                embody.output = function(theta_X, theta_Y, theta_Z){
                    ref.output(this, theta_X, theta_Y, theta_Z);
                };
            }
            embody.getLengthByPytha = function(hypotenuse, cathetus1, cathetus2){
                return ref.getLengthByPytha(hypotenuse, cathetus1, cathetus2);
            };
            embody.lockOn = function(pos_code, theta_X, theta_Y, theta_Z){
                var poses = this.reles[pos_code];
                ref.lockOn(this, poses, theta_X, theta_Y, theta_Z);
            };

            // 実体初期化
            embody.configure();
        } catch (e) {
            alert(e);
        }

        return embody;
    },




    /**
     * 描画
     *
     * @param   object  embody
     * @param   float   theta_X
     * @param   float   theta_Y
     * @param   float   theta_Z
     */
    output: function(embody, theta_X, theta_Y, theta_Z)
    {
        embody.canvas_context.setTransform(1, 0, 0, 1, 0, 0);
        embody.canvas_context.clearRect(0, 0, embody.size, embody.size);

        var sin_X = Math.sin(theta_X);
        var cos_X = Math.cos(theta_X);
        var sin_Y = Math.sin(theta_Y);
        var cos_Y = Math.cos(theta_Y);
        var sin_Z = Math.sin(theta_Z);
        var cos_Z = Math.cos(theta_Z);

        /*for (var i in embody.surfaces) {
            embody.canvas_context.beginPath();
            for (var j = 0; j < embody.surfaces[i].length; j ++) {
                var X0 = embody.surfaces[i][j].X;
                var Y0 = embody.surfaces[i][j].Y;
                var Z0 = embody.surfaces[i][j].Z;
                var X1 = (X0 * cos_X) + (Z0 * sin_X);
                var Z1 = (Z0 * cos_X) - (X0 * sin_X);
                var X2 = (X1 * cos_Y) + (Y0 * sin_Y);
                var Y2 = (Y0 * cos_Y) - (X1 * sin_Y);
                var Y3 = (Y2 * cos_Z) - (Z1 * sin_Z);
                var X = parseFloat(X2);
                var Y = parseFloat(Y3);

                if (j == 0) {
                    embody.canvas_context.moveTo(embody._center + X, embody._center + Y);
                } else {
                    embody.canvas_context.lineTo(embody._center + X, embody._center + Y);
                }
            }
            embody.canvas_context.closePath();
            embody.canvas_context.fillStyle     = embody.fill_style;
            embody.canvas_context.fill();
            embody.canvas_context.strokeStyle   = embody.stroke_style;
            embody.canvas_context.stroke();
        }*/
        var coordinates =new Array();
        for (var i in embody.surfaces) {
            var poses = new Array();
            var z_index = 0;

            for (var j = 0; j < embody.surfaces[i].length; j ++) {
                var X0 = embody.surfaces[i][j].X;
                var Y0 = embody.surfaces[i][j].Y;
                var Z0 = embody.surfaces[i][j].Z;
                var X1 = (X0 * cos_X) + (Z0 * sin_X);
                var Z1 = (Z0 * cos_X) - (X0 * sin_X);
                var X2 = (X1 * cos_Y) + (Y0 * sin_Y);
                var Y2 = (Y0 * cos_Y) - (X1 * sin_Y);
                var Y3 = (Y2 * cos_Z) - (Z1 * sin_Z);
                var Z3 = (Z1 * cos_Z) + (Y2 * sin_Z);
                var X = parseFloat(X2) * -1;
                var Y = parseFloat(Y3) * -1;
                var Z = parseFloat(Z3) * -1;

                poses.push({X: X, Y: Y, Z: Z});
                z_index += Z;
            }

            z_index = z_index / embody.surfaces[i].length;
            coordinates.push({poses: poses, z_index: z_index});
        }

        coordinates.sort(function(A, B){return B.z_index - A.z_index;});

        for (var i = 0; i < coordinates.length; i ++) {
            embody.canvas_context.beginPath();

            for (var j = 0; j < coordinates[i].poses.length; j ++) {
                var pos = coordinates[i].poses[j];
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
     * 指定座標の表示
     *
     * @param   object  embody
     * @param   float   theta_X
     * @param   float   theta_Y
     * @param   float   theta_Z
     */
    lockOn: function(embody, poses, theta_X, theta_Y, theta_Z)
    {
        var poses_shift = this.getPosesByThetas(poses, {X: theta_X, Y: theta_Y, Z: theta_Z});

        embody.canvas_context.setTransform(1, 0, 0, 1, embody._center, embody._center);
        embody.canvas_context.beginPath();
        embody.canvas_context.moveTo(poses_shift.X - 10, poses_shift.Y);
        embody.canvas_context.lineTo(poses_shift.X + 10, poses_shift.Y);
        embody.canvas_context.closePath();
        embody.canvas_context.strokeStyle = 'rgb(255, 0, 0)';
        embody.canvas_context.stroke();
        embody.canvas_context.beginPath();
        embody.canvas_context.moveTo(poses_shift.X, poses_shift.Y - 10);
        embody.canvas_context.lineTo(poses_shift.X, poses_shift.Y + 10);
        embody.canvas_context.closePath();
        embody.canvas_context.strokeStyle = 'rgb(255, 0, 0)';
        embody.canvas_context.stroke();
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

