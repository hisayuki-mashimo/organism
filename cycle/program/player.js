/**
 * プレイヤー実体
 *
 */
var Player = function()
{
};


Player.prototype = {
    /**
     * 性能関連データ
     *
     */
    speed:                  {
        R: new Number(4),
        L: new Number(4)
    },
    might:                  new Number(10),
    jumping_coefficient:    new Number(10),
    body_radius:            {
        X: 31,
        Y: 36
    },


    /**
     * 状態関連データ
     *
     */
    pos:                    {
        X:  null,
        Y:  null
    },
    op_cond:                {
        slide:      'O',
        jump_slide: 'O',
        jump:       false,
        jumping:    false,
        jump_phase: 0
    },
    direction:              'L',
    jump_process:           new Number(0),
    hp:                     new Number(1000),
    hp_max:                 new Number(1000),
    is_damage:              false,


    /**
     * 画像関連データ
     *
     */
    image_body:             null,
    image_wheel:            null,


    /**
     * 依存オブジェクト
     *
     */
    depends:                new Array(
        'operator',
        'avatar_basis',
        'area',
        'map'
    ),




    /**
     * 初期化
     *
     * @param   object  params
     */
    init: function(params)
    {
        if (params != undefined) {
            for (var i in params) {
                if (this[i] !== undefined) {
                    this[i] = params[i];
                }
            }
        }

        this.image_body     = this.avatar_basis.summons(this, 'Player_Body',    {});
        this.image_wheel    = this.avatar_basis.summons(this, 'Player_Wheel',   {});
    },


    /**
     * 平行移動指示
     *
     * @param   string  key
     * @param   boolean operate
     */
    slide: function(key, operate)
    {
        switch (operate) {
            case true:
                if (this.op_cond.jumping === true) {
                    break;
                }

                switch (key) {
                    case 'R':
                    case 'L':
                        this.direction      = key;
                        this.op_cond.slide  = key;
                        if (this.op_cond.jumping === false) {
                            this.op_cond.jump_slide = key;
                        }
                        break;
                }
                break;
            case false:
                this.op_cond.slide = 'O';
                break;
        }
    },


    /**
     * 跳躍指示
     *
     * @param   boolean operate
     */
    jump: function(operate)
    {
        switch (operate) {
            case true:
                if (this.op_cond.jumping === false) {
                    this.op_cond.jump       = true;
                    this.op_cond.jumping    = true;
                    this.jump_process       = 0;
                    this.jump_phase         = 1;
                }
                break;
            case false:
                this.op_cond.jump = false;
                break;
        }
    },


    /**
     * フェーズ内処理の実行
     *
     */
    execute: function()
    {
        // フェーズ内行動
        this.turn();
    },


    /**
     * フェーズ内行動処理の実行
     *
     */
    turn: function()
    {
        this.turnForEnemy();

        if (this.op_cond.jumping === true) {
            switch (this.op_cond.jump_slide) {
                case 'R': this.pos.X += this.speed.R *  1; break;
                case 'L': this.pos.X += this.speed.L * -1; break;
            }

            switch (this.jump_phase) {
                case 1:
                    switch (true) {
                        case (this.jump_process <  4):
                            this.pos.Y = this.map.image_horizon + (this.jump_process * 6);
                            if (this.op_cond.jump === true) {
                                this.jumping_coefficient += 3;
                            }
                            break;
                        case (this.jump_process >= 4):
                            this.jump_process = this.jumping_coefficient;
                            this.jump_phase = 2;
                            break;
                    }
                    this.jump_process ++;
                    break;
                case 2:
                    this.pos.Y -= this.jump_process;
                    this.jump_process -= 1;

                    if (this.jump_process <= this.jumping_coefficient * -1) {
                        this.jump_process = 0;
                        this.jump_phase = 3;
                    }
                    break;
                case 3:
                    switch (true) {
                        case (this.jump_process <  4):
                            this.pos.Y = this.map.image_horizon + (18 - (this.jump_process * 6));
                            break;
                        case (this.jump_process >= 4):
                            this.pos.Y = this.map.image_horizon;
                            this.op_cond.jumping = false;
                            this.jump_process = 0;
                            this.jump_phase = 0;
                            this.jumping_coefficient = 10;
                            break;
                    }
                    this.jump_process ++;
                    break;
            }
        }

        if (this.op_cond.jumping === false) {
            switch (this.op_cond.slide) {
                case 'R': this.pos.X += this.speed.R; break;
                case 'L': this.pos.X -= this.speed.L; break;
            }

            this.op_cond.jump_slide = this.op_cond.slide;

            if (this.op_cond.jump === true) {
                this.jump(true);
            }
        }

        var MIN_X = this.body_radius.X;
        var MAX_X = this.area.canvas_node.width - this.body_radius.X;
        switch (true) {
            case (this.pos.X < MIN_X): this.pos.X = MIN_X; break;
            case (this.pos.X > MAX_X): this.pos.X = MAX_X; break;
        }
    },


    /**
     * 
     *
     */
    turnForEnemy: function()
    {
        this.is_damage = false;

        for (var i in this.area.enemies) {
            var enemy = this.area.enemies[i];

            switch (true) {
                case (this.pos.Y - this.body_radius.Y > enemy.pos.Y + enemy.body_radius.Y):
                case (this.pos.Y + this.body_radius.Y < enemy.pos.Y - enemy.body_radius.Y):
                case (this.pos.X - this.body_radius.X > enemy.pos.X + enemy.body_radius.X):
                case (this.pos.X + this.body_radius.X < enemy.pos.X - enemy.body_radius.X):
                    break;
                default:
                    this.hp -= enemy.might;
                    this.is_damage = true;
                    enemy.hp -= this.might;
                    enemy.is_damage = true;
                    break;
            }
        }
    },


    /**
     * 画像の出力
     *
     * @param   object  CTX
     */
    exportImage: function(CTX)
    {
        this.image_wheel.exportImage(CTX);
        this.image_body.exportImage(CTX);
    },


    /**
     * キー操作反応
     *
     * @param   string  operate
     * @param   number  key_code
     */
    onOperate: function(operate, key_code)
    {
        switch (operate) {
            case 'keydown':
                switch (key_code) {
                    case parseInt(this.operator.keys.aim_R):    this.slide('R', true);  break;
                    case parseInt(this.operator.keys.aim_L):    this.slide('L', true);  break;
                    case parseInt(this.operator.keys.jump):     this.jump(true);        break;
                    default:
                        break;
                }
                break;
            case 'keyup':
                switch (key_code) {
                    case parseInt(this.operator.keys.aim_R):    this.slide('R', false); break;
                    case parseInt(this.operator.keys.aim_L):    this.slide('L', false); break;
                    case parseInt(this.operator.keys.jump):     this.jump(false);       break;
                    default:
                        break;
                }
                break;
        }
    }
};
