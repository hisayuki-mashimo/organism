/**
 * 多面体データ基礎構造解説構築機能
 *
 * @var Polyhedron_Basis_Theta operator_basis
 */
var Polyhedron_Explainer_Basis_Theta = function(operator_basis)
{
    this.operator_basis = operator_basis;
};


Polyhedron_Explainer_Basis_Theta.prototype = {
    // 依存オブジェクト
    operator_basis: null,


    /**
     * 共通プロパティ
     *
     */
    property: {
        // 依存モデル
        basis:              null,

        // 
        proofs:             null,
        proof_index:        0,
        proof_phase:        0,
        proof_progress:     0,
        lines:              null,
        //coordinates:        null,

        fill_style:         'rgba(255, 255, 255, 0.5)',
        stroke_style:       'rgba(192, 192, 192, 0.5)',

        navigaters:         null,
        object_basis:       null,

        animation:          null,
        animation_switch:   false,
        animation_index:    0,
        animation_phase:    0,
        animation_progress: 0,

        text_frame_node:    null,

        _theta_X:           0,
        _theta_Y:           0,
        _theta_Z:           0,

        // メソッド共有変数
        reles:              null,
        surfaces:           null
    },




    /**
     * 実体化
     *
     * @param   string          embody_key
     * @param   HTMLDivElement  frame_node_C
     * @param   HTMLDivElement  frame_node_S
     * @param   HTMLDivElement  frame_node_H
     * @param   HTMLDivElement  text_frame_node
     * @param   object          params
     */
    summons: function(embody_key, frame_node_C, frame_node_S, frame_node_H, text_frame_node, params)
    {
        try {
            // 実体化
            eval('var embody = new ' + embody_key + '_Explain();');
            embody.basis        = this;
            embody.object_basis = this.operator_basis.summons(embody_key, frame_node_C, params);

            // プロパティ定義
            for (var i in this.property) {
                if (embody[i] === undefined) {
                    embody[i] = this.property[i];
                }
            }
            embody.text_frame_node  = text_frame_node;
            embody.fill_style       = embody.object_basis.fill_style;
            embody.stroke_style     = embody.object_basis.stroke_style;

            embody.object_basis.fill_style   = 'rgba(255, 255, 255, 0.5)';
            embody.object_basis.stroke_style = 'rgba(216, 216, 216, 0.5)';

            // 内部変数の初期化
            embody.proofs      = new Array();
            embody.lines       = {};
            embody.surfaces    = {};
            embody.reles       = embody.object_basis.reles;
            embody.navigaters  = {
                C: {frame_node: frame_node_C, relative_thetas: {R: 0, V: 0,           L: 0}},
                S: {frame_node: frame_node_S, relative_thetas: {R: 0, V: Math.PI / 2, L: Math.PI / 2}},
                H: {frame_node: frame_node_H, relative_thetas: {R: 0, V: 0,           L: Math.PI / 2}}
            };
            embody.navigaters.C.canvas_node       = embody.object_basis.canvas_node;
            embody.navigaters.S.canvas_node       = document.createElement('canvas');
            embody.navigaters.H.canvas_node       = document.createElement('canvas');
            embody.navigaters.C.canvas_context    = embody.object_basis.canvas_context;
            embody.navigaters.S.canvas_context    = embody.navigaters.S.canvas_node.getContext('2d');
            embody.navigaters.H.canvas_context    = embody.navigaters.H.canvas_node.getContext('2d');
            $(embody.navigaters.S.canvas_node).attr('width',   (embody.object_basis._center * 2) + 'px');
            $(embody.navigaters.S.canvas_node).attr('height',  (embody.object_basis._center * 2) + 'px');
            $(embody.navigaters.H.canvas_node).attr('width',   (embody.object_basis._center * 2) + 'px');
            $(embody.navigaters.H.canvas_node).attr('height',  (embody.object_basis._center * 2) + 'px');
            $(embody.navigaters.S.canvas_node).css('position', 'absolute');
            $(embody.navigaters.H.canvas_node).css('position', 'absolute');
            embody.navigaters.S.frame_node.appendChild(embody.navigaters.S.canvas_node);
            embody.navigaters.H.frame_node.appendChild(embody.navigaters.H.canvas_node);

            // 共通メソッド定義
            var ref = this;
            if (embody.configure === undefined) {
                throw 'Undefined method(configure()).';
            }
            if (embody.explain === undefined) {
                embody.explain = function(){
                    ref.explain(this);
                };
            }
            if (embody.preExplain === undefined) {
                embody.preExplain = function(){
                    ref.preExplain(this);
                };
            }

            // 実体初期化
            embody.configure();
        } catch (e) {
            alert(e);
        }

        return embody;
    },


    /**
     *
     */
    preExplain: function(embody)
    {
        for (var i in embody.navigaters) {
            embody.object_basis.canvas_node    = embody.navigaters[i].canvas_node;
            embody.object_basis.canvas_context = embody.navigaters[i].canvas_context;
            var theta_R = embody._theta_X + embody.navigaters[i].relative_thetas.R;
            var theta_V = embody._theta_Y + embody.navigaters[i].relative_thetas.V;
            var theta_L = embody._theta_Z + embody.navigaters[i].relative_thetas.L;
            embody.object_basis.setDirection(theta_R, theta_V, theta_L);
            embody.object_basis.output();
        }
    },


    /**
     *
     */
    explain: function(embody, animation_switch)
    {
        switch (animation_switch) {
            case true:
            case false:
                embody.animation_switch = animation_switch;
                break;
        }

        switch (embody.animation_switch) {
            case true:
                embody.animation = setInterval(function(){
                    embody.basis.animate(embody);
                }, 50);
                break;

            case false:
                clearInterval(embody.animation);
                break;
        }
    },


    /**
     *
     */
    animate: function(embody)
    {
        switch (embody.animation_phase) {
            case 0:
                this.shiftObject(embody);
                break;

            case 1:
                this.displayText(embody);
                break;
        }
    },


    /**
     *
     */
    shiftObject: function(embody)
    {
        var getLengthByPytha    = this.operator_basis.geometry_calculator.getLengthByPytha;
        var getLengthesByTheta  = this.operator_basis.geometry_calculator.getLengthesByTheta;
        var getThetaByLengthes  = this.operator_basis.geometry_calculator.getThetaByLengthes;

        var proof = embody.proofs[embody.animation_index];

        var diff_R = parseFloat(proof.theta.R - embody._theta_R);
        var diff_V = parseFloat(proof.theta.V - embody._theta_V);
        var diff_L = parseFloat(proof.theta.L - embody._theta_L);
        var diff_R_ABS = Math.abs(diff_R);
        var diff_V_ABS = Math.abs(diff_V);
        var diff_L_ABS = Math.abs(diff_L);
        var diff_max = Math.max(diff_R_ABS, diff_V_ABS, diff_L_ABS);
        if (diff_max > 0) {
            var animation_step = Math.ceil(diff_max / 0.02);
            var animation_diff_unit_R = parseFloat(diff_R_ABS / animation_step);
            var animation_diff_unit_V = parseFloat(diff_V_ABS / animation_step);
            var animation_diff_unit_L = parseFloat(diff_L_ABS / animation_step);
        } else {
            var animation_step = 1;
            var animation_diff_unit_R = 0;
            var animation_diff_unit_V = 0;
            var animation_diff_unit_L = 0;
        }

        if (embody.animation_progress + 1 >= animation_step) {
            embody.basis.registerLines(embody);
            embody.basis.registerSurfaces(embody);

            embody.animation_phase    = 1;
            embody.animation_progress = 0;
        }

        embody._theta_R = proof.theta.R - (animation_diff_unit_R * (animation_step - embody.animation_progress - 1));
        embody._theta_V = proof.theta.V - (animation_diff_unit_V * (animation_step - embody.animation_progress - 1));
        embody._theta_L = proof.theta.L - (animation_diff_unit_L * (animation_step - embody.animation_progress - 1));

        for (var i in embody.navigaters) {
            var canvas_context = embody.navigaters[i].canvas_context;

            var rotate_theta = embody._theta_R + embody.navigaters[i].relative_thetas.R;
            var vector_theta = embody._theta_V + embody.navigaters[i].relative_thetas.V;
            var length_theta = embody._theta_L + embody.navigaters[i].relative_thetas.L;

            canvas_context.setTransform(1, 0, 0, 1, 0, 0);
            canvas_context.clearRect(0, 0, embody.object_basis.size, embody.object_basis.size);

            embody.object_basis.moment_surfaces = new Array();
            embody.object_basis.moment_poses    = {};

            var axis_theta = (vector_theta - (Math.PI / 2));

            for (var j in embody.object_basis.surfaces) {
                var poses = new Array();
                var z_index = 0;

                for (var k = 0; k < embody.object_basis.surfaces[j].length; k ++) {
                    var pos_code = embody.object_basis.surfaces[j][k];

                    var LS0 = getLengthesByTheta('Z', embody.object_basis.reles[pos_code].X);
                    var RY0 = LS0.Y;
                    var LZ0 = LS0.X;

                    var TY1 = embody.object_basis.reles[pos_code].Y + rotate_theta - axis_theta;
                    var LS1 = getLengthesByTheta('Y', TY1);
                    var LX1 = LS1.X * RY0 * -1;
                    var LY1 = LS1.Y * RY0 * -1;
                    var TX1 = getThetaByLengthes('X', LX1, LZ0);
                    var RX1 = getLengthByPytha(null, LX1, LZ0);
                    var TX2 = TX1 + length_theta;
                    var LS2 = getLengthesByTheta('X', TX2);
                    var LX2 = LS2.X * RX1;
                    var LZ2 = LS2.Y * RX1;
                    var RY2 = getLengthByPytha(null, LX2, LY1);
                    var TY2 = getThetaByLengthes('Y', LX2, LY1);

                    var TY3 = TY2 + axis_theta;
                    var LS3 = getLengthesByTheta('Y', TY3);
                    var LX3 = LS3.X * RY2;
                    var LY3 = LS3.Y * RY2;
                    var X = LX3 * embody.object_basis.reles[pos_code].R;
                    var Y = LY3 * embody.object_basis.reles[pos_code].R;
                    var Z = LZ2 * embody.object_basis.reles[pos_code].R;

                    embody.object_basis.moment_poses[pos_code] = {X: X, Y: Y, Z: Z};

                    z_index += Z;
                }

                z_index = z_index / embody.object_basis.surfaces[j].length;
                embody.object_basis.moment_surfaces.push({code: j, z_index: z_index});
            }

            embody.object_basis.moment_surfaces.sort(function(A, B){return A.z_index - B.z_index;});

            for (var j = 0; j < embody.object_basis.moment_surfaces.length; j ++) {
                canvas_context.beginPath();

                var surface_code = embody.object_basis.moment_surfaces[j].code;
                var surface = embody.object_basis.surfaces[surface_code];

                for (var k = 0; k < surface.length; k ++) {
                    var pos = embody.object_basis.moment_poses[surface[k]];
                    if (j == 0) {
                        canvas_context.moveTo(embody.object_basis._center + pos.X, embody.object_basis._center + pos.Y);
                    } else {
                        canvas_context.lineTo(embody.object_basis._center + pos.X, embody.object_basis._center + pos.Y);
                    }
                }

                canvas_context.closePath();

                if (embody.surfaces[surface_code] === undefined) {
                    canvas_context.fillStyle   = embody.object_basis.fill_style;
                    canvas_context.strokeStyle = embody.object_basis.stroke_style;
                } else {
                    canvas_context.fillStyle   = embody.fill_style;
                    canvas_context.strokeStyle = embody.stroke_style;
                }

                canvas_context.fill();
                canvas_context.stroke();
            }

            var coordinates = {};

            for (var j in embody.lines) {
                var proof_line = embody.lines[j];

                canvas_context.beginPath();

                for (var k = 0; k < proof_line.poses.length; k ++) {
                    if (proof_line.poses[k] === 'O') {
                        var display_X = embody.object_basis._center;
                        var display_Y = embody.object_basis._center;
                    } else {
                        if (embody.object_basis.moment_poses[proof_line.poses[k]] === undefined) {
                            var LS0 = getLengthesByTheta('Z', embody.object_basis.reles[proof_line.poses[k]].X);
                            var RY0 = LS0.Y;
                            var LZ0 = LS0.X;

                            var TY1 = embody.object_basis.reles[proof_line.poses[k]].Y + rotate_theta - axis_theta;
                            var LS1 = getLengthesByTheta('Y', TY1);
                            var LX1 = LS1.X * RY0 * -1;
                            var LY1 = LS1.Y * RY0 * -1;
                            var TX1 = getThetaByLengthes('X', LX1, LZ0);
                            var RX1 = getLengthByPytha(null, LX1, LZ0);
                            var TX2 = TX1 + length_theta;
                            var LS2 = getLengthesByTheta('X', TX2);
                            var LX2 = LS2.X * RX1;
                            var LZ2 = LS2.Y * RX1;
                            var RY2 = getLengthByPytha(null, LX2, LY1);
                            var TY2 = getThetaByLengthes('Y', LX2, LY1);

                            var TY3 = TY2 + axis_theta;
                            var LS3 = getLengthesByTheta('Y', TY3);
                            var LX3 = LS3.X * RY2;
                            var LY3 = LS3.Y * RY2;
                            var X = LX3 * embody.object_basis.reles[proof_line.poses[k]].R;
                            var Y = LY3 * embody.object_basis.reles[proof_line.poses[k]].R;
                            var Z = LZ2 * embody.object_basis.reles[proof_line.poses[k]].R;

                            embody.object_basis.moment_poses[proof_line.poses[k]] = {X: X, Y: Y, Z: Z};
                        }

                        var display_X = embody.object_basis._center + embody.object_basis.moment_poses[proof_line.poses[k]].X;
                        var display_Y = embody.object_basis._center + embody.object_basis.moment_poses[proof_line.poses[k]].Y;
                    }

                    if (k == 0) {
                        canvas_context.moveTo(display_X, display_Y);
                    } else {
                        canvas_context.lineTo(display_X, display_Y);
                    }

                    coordinates[proof_line.poses[k]] = {X: display_X, Y: display_Y};
                }

                canvas_context.closePath();
                canvas_context.strokeStyle = 'rgba(' + proof_line.color[0] + ', ' + proof_line.color[1] + ', ' + proof_line.color[2] + ', 0.5)';
                canvas_context.stroke();
            }

            canvas_context.fillStyle = 'rgba(128, 128, 128, 0.8)';
            for (var j in coordinates) {
                canvas_context.fillText(j, coordinates[j].X + 5, coordinates[j].Y + 5);
            }
        }

        embody.animation_progressanimation_progress ++;
    },


    /**
     *
     */
    displayText: function(embody)
    {
        var proof = embody.proofs[embody.animation_index];

        if (embody.animation_progress >= proof.texts.length) {
            embody.animation_index    ++;
            embody.animation_phase    = 0;
            embody.animation_progress = 0;

            clearInterval(embody.animation);
            embody.animation_switch = false;

            return;
        }

        var text_param = proof.texts[embody.animation_progress];

        if (text_param instanceof Array) {
            var text_value = '';

            for (var i = 0; i < text_param.length; i ++) {
                if (text_param[i] instanceof Object) {
                    var text_poses = text_param[i].P;
                    var text_color = text_param[i].C;
                    var text_type  = text_param[i].T;

                    text_value += '<span style="color:rgb(' + text_color[0] + ',' + text_color[1] + ',' + text_color[2] + ');">';
                    switch (text_type) {
                        case 'lin': text_value += '';        break;
                        case 'cor': text_value += '∠';      break;
                        case 'tre': text_value += '△';      break;
                        case 'qua': text_value += '四角形';  break;
                        default:    text_value += text_type; break;
                    }
                    text_value += '[';
                    for (var j = 0; j < text_poses.length; j ++) {
                        text_value += text_poses[j];
                        text_value += (j + 1 < text_poses.length) ? '-' : '';
                    }
                    text_value += ']';
                    text_value += '</span>';
                } else {
                    text_value += text_param[i];
                }
            }
        } else {
            var text_value = text_param;
        }

        embody.text_frame_node.innerHTML += text_value + '<br />';

        embody.animation_progress ++;
    },


    /**
     *
     */
    registerLines: function(embody)
    {
        var proof = embody.proofs[embody.animation_index];

        if (proof.lines !== undefined) {
            for (var i = 0; i < proof.lines.length; i ++) {
                var proof_line = proof.lines[i];

                embody.lines[proof_line.code] = {poses: proof_line.poses, color: proof_line.color};
            }
        }

        if (proof.reset_lines !== undefined) {
            for (var i = 0; i < proof.reset_lines.length; i ++) {
                delete embody.lines[proof.reset_lines[i]];
            }
        }
    },

    /**
     *
     */
    registerSurfaces: function(embody)
    {
        var proof = embody.proofs[embody.animation_index];

        if (proof.surfaces !== undefined) {
            for (var i = 0; i < proof.surfaces.length; i ++) {
                embody.surfaces[proof.surfaces[i]] = true;
            }
        }

        if (proof.reset_surfaces !== undefined) {
            for (var i = 0; i < proof.reset_surfaces.length; i ++) {
                delete embody.surfaces[proof.reset_surfaces[i]];
            }
        }
    }
};
