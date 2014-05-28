/**
 * 多面体データレーダーグラム基礎構造構築機能
 *
 * @var Polyhedron_Basis_Theta operator_basis
 */
var Polyhedron_Radar_Basis_Theta = function(operator_basis)
{
    this.operator_basis = operator_basis;
};


Polyhedron_Radar_Basis_Theta.prototype = {
    // 依存オブジェクト
    polygon_basis:  null,


    /**
     * 共通プロパティ
     *
     */
    property: {
        // 依存モデル
        basis:                  null,

        basis_fill_style:       'rgba(255, 255, 255, 0.0)',
        basis_stroke_style:     'rgba(192, 192, 192, 0.5)',
        shaft_fill_style:       'rgba(255, 255, 255, 0.0)',
        shaft_stroke_style:     'rgba(192, 192, 192, 0.5)',
        meter_fill_style:       'rgba(255, 255, 255, 0.0)',
        meter_stroke_style:     'rgba(192, 240, 255, 0.2)',
        param_fill_style:       'rgba(128, 240, 192, 0.5)',
        param_stroke_style:     'rgba(128, 224, 176, 0.8)',
        text_fill_style:        'rgba(128, 128, 255, 0.1)',
        text_stroke_style:      'rgba(128, 224, 176, 0.8)',

        object_basis:           null,

        parameters:             null,
        parameter_texts:        null,
        parameter_relations:    null,
        parameter_text_params:  null,

        _theta_X:               0,
        _theta_Y:               0,
        _theta_Z:               0,

        // メソッド共有変数
        shaft_surfaces:         null,
        meter_surfaces:         null,
        param_surfaces:         null
    },




    /**
     * 実体化
     *
     * @param   string          embody_key
     * @param   HTMLDivElement  frame_node
     * @param   object  params
     */
    summons: function(embody_key, frame_node, params)
    {
        try {

            // 実体化
            var embody          = {};
            embody.basis        = this;
            embody.object_basis = this.operator_basis.summons(embody_key, frame_node, params);

            // プロパティ定義
            for (var i in this.property) {
                if (embody[i] === undefined) {
                    embody[i] = this.property[i];
                }
            }
            for (var i in params) {
                if (embody[i] !== undefined) {
                    embody[i] = params[i];
                }
            }

            // 内部変数の初期化
            if (embody.parameter_texts === null) {
                throw 'Undefined param(parameter_texts).';
            }
            if (embody.parameters === null) {
                embody.parameters = new Array();
            }
            embody.parameter_relations   = new Array();
            embody.shaft_surfaces        = {};
            embody.meter_surfaces        = {};
            embody.param_surfaces        = {};
            embody.parameter_text_params = {};

            // 共通メソッド定義
            var ref = this;
            if (embody.configureParam === undefined) {
                embody.configureParam = function(parameters){
                    ref.configureParam(this, parameters);
                };
            }
            if (embody.setDirection === undefined) {
                embody.setDirection = function(rotate_theta, vector_theta, length_theta){
                    ref.setDirection(this, rotate_theta, vector_theta, length_theta);
                };
            }
            if (embody.output === undefined) {
                embody.output = function(){
                    ref.output(this);
                };
            }
            embody.getLengthByPytha     = this.operator_basis.getLengthByPytha;
            embody.finalizeRatioByPytha = this.operator_basis.finalizeRatioByPytha;

            embody.object_basis.canvas_context.font = '12px';
            //embody.object_basis.canvas_context.font = "12px 'osaka,sans-serif'";

            // 初期化
            this.configure(embody);
        } catch (e) {
            alert(e);
        }

        return embody;
    },


    /**
     * 初期化
     *
     * @param   object  embody
     */
    configure: function(embody)
    {
        embody.object_basis.configure();

        for (var i in embody.object_basis.reles) {
            embody.parameter_relations.push(i);

            embody.shaft_surfaces[i] = ['O', i];
        }

        if (embody.parameters.length === 0) {
            for (var i = 0; i < embody.parameter_relations.length; i ++) {
                embody.parameters.push(0);
            }
        }
        if (embody.parameter_relations.length !== embody.parameters.length) {
            throw 'Invalid parameter length(request: ' + embody.parameters.length + ', capacity: ' + embody.parameter_relations.length + ').';
        }
        if (embody.parameter_relations.length !== embody.parameter_texts.length) {
            throw 'Invalid parameter length(request: ' + embody.parameter_texts.length + ', capacity: ' + embody.parameter_relations.length + ').';
        }

        for (var i in embody.object_basis.surfaces) {
            embody.param_surfaces[i] = new Array();

            for (var j = 0; j < embody.object_basis.surfaces[i].length; j ++) {
                embody.param_surfaces[i].push(embody.object_basis.surfaces[i][j] + '_param');
            }
        }

        if (embody.parameters.length !== 0) {
            this.configureParam(embody, embody.parameters);
        }

        var reles_progress = {};

        for (var i in embody.object_basis.reles) {
            for (var j = 1; j <= 3; j ++) {
                reles_progress[i + '_' + j] = {
                    R: embody.object_basis.reles[i].R * (1 / 4 * j),
                    X: embody.object_basis.reles[i].X,
                    Y: embody.object_basis.reles[i].Y
                };
            }
        }
        for (var i in reles_progress) {
            embody.object_basis.reles[i] = reles_progress[i];
        }

        for (var i in embody.object_basis.surfaces) {
            for (var j = 1; j <= 3; j ++) {
                embody.meter_surfaces[i + '_' + j] = new Array();
                for (var k = 0; k < embody.object_basis.surfaces[i].length; k ++) {
                    embody.meter_surfaces[i + '_' + j].push(embody.object_basis.surfaces[i][k] + '_' + j);
                }
            }
        }

        embody.object_basis.reles['O'] = {R: 0, X: 0, Y: 0};
    },


    /**
     * パラメーター情報の初期化
     *
     * @param   Object  embody
     * @param   Array   parameters
     */
    configureParam: function(embody, parameters)
    {
        if (parameters.length !== embody.parameter_relations.length) {
            throw 'Invalid parameter length(request: ' + parameters.length + ', capacity: ' + embody.parameter_relations.length + ').';
        }

        for (var i = 0; i < embody.parameter_relations.length; i ++) {
            var rel_code  = embody.parameter_relations[i];
            var rel_param = embody.object_basis.reles[rel_code];

            var parameter_length = (parameters[i] / 100) * rel_param.R;

            embody.object_basis.reles[rel_code + '_param'] = {
                'R': parameter_length,
                'X': rel_param.X,
                'Y': rel_param.Y
            };

            var text_value = embody.parameter_texts[i] + ': ' + parameters[i];
            var text_param = embody.object_basis.canvas_context.measureText(text_value);

            embody.parameter_text_params[rel_code] = {
                text_value: text_value,
                text_width: text_param.width
            };
        }
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
        embody.object_basis.moment_surfaces = new Array();

        var surface_group = {
            basis: embody.object_basis.surfaces,
            shaft: embody.shaft_surfaces,
            meter: embody.meter_surfaces,
            param: embody.param_surfaces
        };

        var axis_theta = (vector_theta - (Math.PI / 2));

        for (var part_type in surface_group) {
            var surfaces = surface_group[part_type];
            var reles    = embody.object_basis.reles;

            for (var surface_code in surfaces) {
                var surface = surfaces[surface_code];
                var z_index = 0;

                for (var i = 0; i < surface.length; i ++) {
                    var pos_code = surface[i];
                    var pos_key  = part_type + '_' + pos_code;

                    if (pos_code === 'O') {
                        var X = 0;
                        var Y = 0;
                        var Z = 0;
                    } else {
                        var LS0 = this.operator_basis.getLengthesByTheta('Z', reles[pos_code].X);
                        var RY0 = LS0.Y;
                        var LZ0 = LS0.X;
                        var TY1 = reles[pos_code].Y + rotate_theta - axis_theta;
                        var LS1 = this.operator_basis.getLengthesByTheta('Y', TY1);
                        var LX1 = LS1.X * RY0;
                        var LY1 = LS1.Y * RY0;
                        var TX1 = this.operator_basis.getThetaByLengthes('X', LX1, LZ0);
                        var RX1 = this.operator_basis.getLengthByPytha(null, LX1, LZ0);
                        var TX2 = TX1 + length_theta;
                        var LS2 = this.operator_basis.getLengthesByTheta('X', TX2);
                        var LX2 = LS2.X * RX1;
                        var LZ2 = LS2.Y * RX1;
                        var RY2 = this.operator_basis.getLengthByPytha(null, LX2, LY1);
                        var TY2 = this.operator_basis.getThetaByLengthes('Y', LX2, LY1);
                        var TY3 = TY2 + axis_theta;
                        var LS3 = this.operator_basis.getLengthesByTheta('Y', TY3);
                        var LX3 = LS3.X * RY2;
                        var LY3 = LS3.Y * RY2;
                        var X = LX3 * reles[pos_code].R;
                        var Y = LY3 * reles[pos_code].R;
                        var Z = LZ2 * reles[pos_code].R;
                    }

                    embody.object_basis.moment_poses[pos_key] = {X: X, Y: Y, Z: Z};

                    z_index += Z;
                }

                embody.object_basis.moment_surfaces.push({
                    part_type: part_type,
                    code:      surface_code,
                    z_index:   (z_index / surface.length)
                });
            }
        }

        for (var rel_code in embody.parameter_text_params) {
            var parameter_rel = embody.object_basis.moment_poses['basis_' + rel_code];

            embody.object_basis.moment_surfaces.push({
                part_type: 'text',
                code:      rel_code,
                z_index:   parameter_rel.Z
            });
        }

        embody.object_basis.moment_surfaces.sort(function(A, B){return A.z_index - B.z_index;});
    },


    /**
     * 描画
     *
     * @param   object  embody
     */
    output: function(embody, theta_X, theta_Y, theta_Z)
    {
        embody.object_basis.canvas_context.setTransform(1, 0, 0, 1, 0, 0);
        embody.object_basis.canvas_context.clearRect(0, 0, embody.object_basis.size, embody.object_basis.size);

        var surface_group = {
            basis: embody.object_basis.surfaces,
            shaft: embody.shaft_surfaces,
            meter: embody.meter_surfaces,
            param: embody.param_surfaces
        };

        for (var i = 0; i < embody.object_basis.moment_surfaces.length; i ++) {
            var moment_surface = embody.object_basis.moment_surfaces[i];

            if (moment_surface.part_type === 'text') {
                var parameter_text_param = embody.parameter_text_params[moment_surface.code];
                var parameter_rel        = embody.object_basis.moment_poses['basis_' + moment_surface.code];

                pos_X = parseFloat(parameter_rel.X + embody.object_basis._center + 5);
                pos_Y = parseFloat(parameter_rel.Y + embody.object_basis._center - 5);

                embody.object_basis.canvas_context.fillStyle = embody.text_fill_style;
                embody.object_basis.canvas_context.fillRect(pos_X - 5, pos_Y - 10, parameter_text_param.text_width + 10, 12);

                embody.object_basis.canvas_context.fillStyle = embody.text_stroke_style;
                embody.object_basis.canvas_context.fillText(parameter_text_param.text_value, pos_X, pos_Y);

                continue;
            }

            var target_surface = surface_group[moment_surface.part_type][moment_surface.code];

            embody.object_basis.canvas_context.beginPath();

            for (var j = 0; j < target_surface.length; j ++) {
                var pos_key  = moment_surface.part_type + '_' + target_surface[j];

                var pos = embody.object_basis.moment_poses[pos_key];

                if (j == 0) {
                    embody.object_basis.canvas_context.moveTo(embody.object_basis._center + pos.X, embody.object_basis._center + pos.Y);
                } else {
                    embody.object_basis.canvas_context.lineTo(embody.object_basis._center + pos.X, embody.object_basis._center + pos.Y);
                }
            }

            embody.object_basis.canvas_context.closePath();
            switch (moment_surface.part_type) {
                case 'basis':
                    embody.object_basis.canvas_context.fillStyle     = embody.basis_fill_style;
                    embody.object_basis.canvas_context.strokeStyle   = embody.basis_stroke_style;
                    break;

                case 'shaft':
                    embody.object_basis.canvas_context.fillStyle     = embody.shaft_fill_style;
                    embody.object_basis.canvas_context.strokeStyle   = embody.shaft_stroke_style;
                    break;

                case 'meter':
                    embody.object_basis.canvas_context.fillStyle     = embody.meter_fill_style;
                    embody.object_basis.canvas_context.strokeStyle   = embody.meter_stroke_style;
                    break;

                case 'param':
                    embody.object_basis.canvas_context.fillStyle     = embody.param_fill_style;
                    embody.object_basis.canvas_context.strokeStyle   = embody.param_stroke_style;
                    break;
            }
            embody.object_basis.canvas_context.fill();
            embody.object_basis.canvas_context.stroke();
        }
    }
};
