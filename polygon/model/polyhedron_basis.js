/**
 * 多面体データ基礎構造構築機能
 */
class Polyhedron_Basis {
    /**
     * 共通プロパティ
     *
     */
    property = {
        // 依存モデル
        basis: null,

        // HTMLデータ
        frame_node: null,
        canvas_node: null,
        canvas_context: null,


        // 外部設定値
        alpha: 20,
        size: 100,
        fill_style: null,
        stroke_style: null,
        debug_stroke_style: null,


        // 内部設定値
        _center: null,


        // メソッド共有変数
        reles: null,
        moment_poses: null,
        surfaces: null,
        moment_surfaces: null,
    }

    /**
     * 依存ライブラリ
     */
    geometry_calculator = null

    constructor(params) {
        // プロパティ定義
        for (let i in params) {
            if (this[i] !== undefined) {
                this[i] = params[i];
            }
        }

        if (this.geometry_calculator === null) {
            throw 'Undefined property(geometry_calculator).';
        }
    }

    /**
     * 実体化
     *
     * @param   object  embody
     * @param   string  frame_node
     * @param   object  params
     */
    summons = (embody, frame_node, params) => {
        try {
            embody.basis = this;

            // プロパティ定義
            for (let i in this.property) {
                if (embody[i] === undefined) {
                    embody[i] = this.property[i];
                }
            }
            if (params != undefined) {
                for (let j in params) {
                    if (embody[j] !== undefined) {
                        embody[j] = params[j];
                    }
                }
            }

            // 内部変数の初期化
            embody._center = embody.size / 2 + 0.5;
            embody.reles = {};
            embody.moment_poses = {};

            // HTMLデータの初期化
            if (frame_node === undefined) {
                throw 'Undefined param(frame).';
            }
            embody.frame_node = frame_node;
            embody.canvas_node = document.createElement('canvas');
            embody.canvas_context = embody.canvas_node.getContext('2d');
            $(embody.canvas_node).attr('width', (embody._center * 2) + 'px');
            $(embody.canvas_node).attr('height', (embody._center * 2) + 'px');
            $(embody.canvas_node).css('position', 'absolute');
            embody.frame_node.appendChild(embody.canvas_node);

            // 共通メソッド定義
            if (embody.configure === undefined) {
                throw 'Undefined method(configure()).';
            }
            embody.setDirection = (rotate_theta, vector_theta, length_theta) => {
                this.setDirection(embody, rotate_theta, vector_theta, length_theta);
            };
            embody.output = (...direction_arguments) => {
                if (direction_arguments.length) {
                    this.setDirection(embody, ...direction_arguments);
                }
                this.output(embody);
            };

            // 実体初期化
            embody.configure();
        } catch (e) {
            console.warn(e);
        }

        return embody;
    }

    /**
     * 方向転換
     *
     * @param   object  embody
     * @param   float   rotate_theta
     * @param   float   vector_theta
     * @param   float   length_theta
     */
    setDirection = (embody, rotate_theta, vector_theta, length_theta) => {
        const {
            getLengthByPytha,
            getLengthesByTheta,
            getThetaByLengthes,
        } = this.geometry_calculator;

        embody.moment_surfaces = new Array();

        const axis_theta = (vector_theta - (Math.PI / 2));

        for (let i in embody.surfaces) {
            let z_index = 0;

            for (let j = 0; j < embody.surfaces[i].length; j++) {
                const pos_code = embody.surfaces[i][j];

                const LS0 = getLengthesByTheta('Z', embody.reles[pos_code].X);
                const RY0 = LS0.Y;
                const LZ0 = LS0.X;

                const TY1 = embody.reles[pos_code].Y + rotate_theta - axis_theta;
                const LS1 = getLengthesByTheta('Y', TY1);
                const LX1 = LS1.X * RY0 * -1;
                const LY1 = LS1.Y * RY0 * -1;
                const TX1 = getThetaByLengthes('X', LX1, LZ0);
                const RX1 = getLengthByPytha(null, LX1, LZ0);
                const TX2 = TX1 + length_theta;
                const LS2 = getLengthesByTheta('X', TX2);
                const LX2 = LS2.X * RX1;
                const LZ2 = LS2.Y * RX1;
                const RY2 = getLengthByPytha(null, LX2, LY1);
                const TY2 = getThetaByLengthes('Y', LX2, LY1);

                const TY3 = TY2 + axis_theta;
                const LS3 = getLengthesByTheta('Y', TY3);
                const LX3 = LS3.X * RY2;
                const LY3 = LS3.Y * RY2;
                const X = LX3 * embody.reles[pos_code].R;
                const Y = LY3 * embody.reles[pos_code].R;
                const Z = LZ2 * embody.reles[pos_code].R;

                embody.moment_poses[pos_code] = { X: X, Y: Y, Z: Z };

                z_index += Z;
            }

            z_index = z_index / embody.surfaces[i].length;
            embody.moment_surfaces.push({ code: i, z_index: z_index });
        }

        embody.moment_surfaces.sort((A, B) => A.z_index - B.z_index);
    }

    /**
     * 描画
     *
     * @param   object  embody
     */
    output = (embody) => {
        embody.canvas_context.setTransform(1, 0, 0, 1, 0, 0);
        embody.canvas_context.clearRect(0, 0, embody.size, embody.size);

        for (let i = 0; i < embody.moment_surfaces.length; i++) {
            embody.canvas_context.beginPath();

            const surface_code = embody.moment_surfaces[i].code;
            if (surface_code.match(/^D_/)) continue;
            const surface = embody.surfaces[surface_code];

            for (let j = 0; j < surface.length; j++) {
                const pos = embody.moment_poses[surface[j]];
                if (j == 0) {
                    embody.canvas_context.moveTo(embody._center + pos.X, embody._center + pos.Y);
                } else {
                    embody.canvas_context.lineTo(embody._center + pos.X, embody._center + pos.Y);
                }
            }

            embody.canvas_context.closePath();
            // embody.canvas_context.fillStyle = embody.fill_style;
            embody.canvas_context.fillStyle = 'rgba(255, 255, 255, 0.7)';
            embody.canvas_context.fill();
            // embody.canvas_context.strokeStyle = embody.stroke_style;
            embody.canvas_context.strokeStyle = 'rgba(224, 224, 224, 0.3)';
            embody.canvas_context.stroke();
        }

        for (let i = 0; i < embody.moment_surfaces.length; i++) {
            embody.canvas_context.beginPath();

            const surface_code = embody.moment_surfaces[i].code;
            const debug_code = surface_code.match(/^D_(([^_]+)_.*)?/);
            if (!debug_code) continue;
            const surface = embody.surfaces[surface_code];

            for (let j = 0; j < surface.length; j++) {
                const pos = embody.moment_poses[surface[j]];
                if (j == 0) {
                    embody.canvas_context.moveTo(embody._center + pos.X, embody._center + pos.Y);
                } else {
                    embody.canvas_context.lineTo(embody._center + pos.X, embody._center + pos.Y);
                }
            }

            embody.canvas_context.closePath();
            // embody.canvas_context.fillStyle = 'rgba(255, 224, 224, 0.2)';
            // embody.canvas_context.fill();
            embody.canvas_context.strokeStyle =
                debug_code[2] &&
                    embody.debug_stroke_style &&
                    embody.debug_stroke_style[debug_code[2]]
                    ? embody.debug_stroke_style[debug_code[2]]
                    : embody.stroke_style;
            embody.canvas_context.stroke();
        }
    }
}
