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
    speed:              {
        T: new Number(4),
        R: new Number(2.5),
        B: new Number(3),
        L: new Number(2)
    },
    speed_coefficient:  new Number(2.2),
    mobility:           new Number(0.04),
    might:              new Number(80),
    speed_alpha:        {
        T: new Number(0),
        R: new Number(0),
        B: new Number(0),
        L: new Number(0)
    },
    mobility_alpha:     new Number(0),


    /**
     * 状態関連データ
     *
     */
    pos:                {
        X: null,
        Y: null,
        S: null,
    },
    op_cond:            {
        slide:  'O',
        rotate: 'O',
        accel:  false
    },
    rotate_process: new Number(0),
    energy_max:     new Number(10000),
    energy:         null,
    energy_expend:  new Number(1),
    hp:             null,
    hp_max:         new Number(1500),
    is_damage:      false,


    /**
     * 画像関連データ
     *
     */
    image_material: {},
    image_group:    new Array(
        'm_oo', 'm_or', 'm_ol', 'm_rr', 'm_ll',
        's_oo', 's_or', 's_ol', 's_rr', 's_ll'
    ),
    image_opacity:  {
        M: new Number(1.0),
        S: new Number(0.5)
    },
    image_W:        new Number(49),
    image_H:        new Number(81),
    image_CX:       new Number(),
    image_CY:       new Number(),


    /**
     * 武装関連データ
     *
     */
    weapons:        {},


    /**
     * 依存オブジェクト
     *
     */
    depends:        new Array(
        'operator',
        'area'
    ),




    /**
     * 初期化
     *
     * @param   object  params
     */
    init: function(params)
    {
        if(params != undefined){
            for(var i in params){
                if(this[i] !== undefined){
                    this[i] = params[i];
                }
            }
        }

        if(this.hp == null){
            this.hp = this.hp_max;
        }
        if(this.energy == null){
            this.energy = this.energy_max;
        }

        for(var i = 0; i < this.image_group.length; i ++){
            var image_key = this.image_group[i];
            this.image_material[image_key] = new Image();
            this.image_material[image_key].src = this.getImagePath(image_key, false);
            this.image_material[image_key + '_d'] = new Image();
            this.image_material[image_key + '_d'].src = this.getImagePath(image_key, true);
        }
        this.image_CX = Math.ceil(this.image_W / 2);
        this.image_CY = Math.ceil(this.image_H / 2);

        var ref = this;
    },


    /**
     * 平行移動指示
     *
     * @param   string  key
     * @param   boolean operate
     */
    slide: function(key, operate)
    {
        switch(operate){
            case true:
                switch(key){
                    case 'T': this.op_cond.slide = 'T'; break;
                    case 'B': this.op_cond.slide = 'B'; break;
                }
                break;
            case false:
                this.op_cond.slide = 'O';
                break;
        }
    },


    /**
     * 旋回指示
     *
     * @param   string  key
     * @param   boolean operate
     */
    rotate: function(key, operate)
    {
        switch(operate){
            case true:
                if(key != this.op_cond.rotate){
                    switch(key){
                        case 'R': this.op_cond.rotate = 'R'; break;
                        case 'L': this.op_cond.rotate = 'L'; break;
                    }

                    this.rotate_process = 0;
                }
                break;
            case false:
                this.op_cond.rotate = 'O';
                break;
        }
    },


    /**
     * 加速指示
     *
     * @param   boolean operate
     */
    accel: function(operate)
    {
        this.op_cond.accel = operate;
    },


    /**
     * 武器の装着
     *
     * @param   object  weapon
     * @param   number  key_code
     */
    setWeapon: function(weapon, key_code)
    {
        this.weapons['L-' + key_code] = weapon;
        weapon.key_code = key_code;
        weapon.equiped = true;
    },


    /**
     * フェーズ内処理の実行
     *
     */
    execute: function()
    {
        var expend = this.energy_expend;
        if(this.op_cond.accel == true){
            expend *= 2.4;
        }
        this.energy -= expend;

        // フェーズ内行動
        this.turn();

        for(var i in this.weapons){
            var weapon = this.weapons[i];
            if(weapon.type == 'launcher'){
                if(weapon.op_cond.trigger_on == true){
                    if(weapon.rest_limit <= 0){
                        for(var i = 0; i < weapon.chain; i ++){
                            weapon.setPosition(this.pos.X, this.pos.Y, this.pos.S);
                            var entity = weapon.launch();
                            this.area.weapon_entities.push(entity);
                        }
                    }
                }
                if(weapon.op_cond.trigger_off == true){
                    weapon.op_cond.trigger_on   = false;
                    weapon.op_cond.trigger_off  = false;
                }
            }
        }

        this.mobility_alpha = 0;
        for(var i in this.weapons){
            var weapon = this.weapons[i];
            weapon.execute();
        }
    },


    /**
     * フェーズ内行動処理の実行
     *
     */
    turn: function()
    {
        this.turnForEnemy();

        var pos_pre = {};
        for(var i in this.pos){
            pos_pre[i] = this.pos[i];
        }
        try{
            switch(this.op_cond.rotate){
                case 'R':
                    if(this.op_cond.slide == 'T'){
                        this.pos.S += this.mobility + this.mobility_alpha;
                    }
                    if(this.rotate_process < 2){
                        this.rotate_process ++;
                    }
                    break;
                case 'L':
                    if(this.op_cond.slide == 'T'){
                        this.pos.S -= this.mobility + this.mobility_alpha;
                    }
                    if(this.rotate_process > -2){
                        this.rotate_process --;
                    }
                    break;
                case 'O':
                    switch(true){
                        case (this.rotate_process > 0): this.rotate_process --; break;
                        case (this.rotate_process < 0): this.rotate_process ++; break;
                    }
                    break;
            }

            var speed = {
                T: this.speed.T + this.speed_alpha.T,
                R: this.speed.R + this.speed_alpha.R,
                B: this.speed.B + this.speed_alpha.B,
                L: this.speed.L + this.speed_alpha.L
            };

            if(this.op_cond.slide != 'O'){
                switch(this.op_cond.slide){
                    case 'T': var slide_coefficient = {Y: speed.T * -1, X: speed.T *  1}; break;
                    case 'B': var slide_coefficient = {Y: speed.B *  1, X: speed.B * -1}; break;
                }
                this.pos.Y += Math.cos(this.pos.S) * slide_coefficient.Y;
                this.pos.X += Math.sin(this.pos.S) * slide_coefficient.X;
            }

            if(this.op_cond.slide != 'T'){
                if(this.op_cond.rotate != 'O'){
                    switch(this.op_cond.rotate){
                        case 'R': var slide_coefficient = {Y: speed.R *  1, X: speed.R *  1}; break;
                        case 'L': var slide_coefficient = {Y: speed.L * -1, X: speed.L * -1}; break;
                    }
                    this.pos.Y += Math.sin(this.pos.S) * slide_coefficient.Y;
                    this.pos.X += Math.cos(this.pos.S) * slide_coefficient.X;
                }
            }

            var W = this.area.canvas_node.width;
            var H = this.area.canvas_node.height;
            switch(true){
                case (this.pos.Y < 0): throw null; break;
                case (this.pos.Y > H): throw null; break;
                case (this.pos.X < 0): throw null; break;
                case (this.pos.X > W): throw null; break;
            }
        }
        catch(e){
            for(var i in pos_pre){
                this.pos[i] = pos_pre[i];
            }
        }
    },


    /**
     * 
     *
     */
    turnForEnemy: function()
    {
        for(var i in this.area.enemies){
            var enemy = this.area.enemies[i];
            var Y_abs = Math.abs(enemy.pos.Y - this.pos.Y);
            var X_abs = Math.abs(enemy.pos.X - this.pos.X);
            if((Y_abs <= enemy.image_CY) && (X_abs <= enemy.image_CX)){
                this.hp -= enemy.might;
                this.is_damage = true;
                enemy.hp -= this.might;
                enemy.is_damage = true;
            }
        }
    },


    /**
     * 速度の返却
     *
     * @return  number
     */
    getSpeed: function()
    {
        var speed = 1.0;
        if(this.op_cond.accel == true){
            speed *= this.speed_coefficient;
        }

        return speed;
    },


    /**
     * 画像の出力
     *
     * @param   object  CTX
     */
    exportImage: function(CTX)
    {
        var image_M = this.image_material[this.getImageKey('m')];
        var image_S = this.image_material[this.getImageKey('s')];
        CTX.translate(this.pos.X, this.pos.Y);
        CTX.rotate(this.pos.S);
        CTX.translate(this.image_CX * -1, this.image_CY * -1);
        CTX.globalAlpha = this.image_opacity.M;
        CTX.drawImage(image_M, 0, 0);
        CTX.globalAlpha = this.image_opacity.S;
        CTX.drawImage(image_S, 0, 0);

        // 状態パラメータ初期化
        this.is_damage = false;
    },


    /**
     * 画像キーの返却
     *
     * @param   string  prefix
     * @return  string
     */
    getImageKey :function(prefix)
    {
        var image_key = (prefix != undefined) ? (prefix + '_') : '';
        switch(true){
            case (this.rotate_process >=  2): image_key += 'rr'; break;
            case (this.rotate_process >   0): image_key += 'or'; break;
            case (this.rotate_process ==  0): image_key += 'oo'; break;
            case (this.rotate_process >  -2): image_key += 'ol'; break;
            case (this.rotate_process <= -2): image_key += 'll'; break;
        }
        if(this.is_damage == true){
            image_key += '_d';
        }

        return image_key;
    },


    /**
     * 
     *
     */
    getImagePath :function(key, is_damage)
    {
        return 'resource/player_' + key + ((is_damage == true) ? '_d' : '') + '.png';
    },


    /**
     * キー操作反応
     *
     * @param   string  operate
     * @param   number  key_code
     */
    onOperate: function(operate, key_code)
    {
        switch(operate){
            case 'keydown':
                switch(key_code){
                    case parseInt(this.operator.keys.aim_T):    this.slide('T', true);  break;
                    case parseInt(this.operator.keys.aim_R):    this.rotate('R', true); break;
                    case parseInt(this.operator.keys.aim_B):    this.slide('B', true);  break;
                    case parseInt(this.operator.keys.aim_L):    this.rotate('L', true); break;
                    case parseInt(this.operator.keys.accel):    this.accel(true);       break;
                    default:
                        if(this.weapons['L-' + key_code] != undefined){
                            var weapon = this.weapons['L-' + key_code];
                            weapon.op_cond.trigger_on = true;
                        }
                        break;
                }
                break;
            case 'keyup':
                switch(key_code){
                    case parseInt(this.operator.keys.aim_T):    this.slide('T', false);     break;
                    case parseInt(this.operator.keys.aim_R):    this.rotate('R', false);    break;
                    case parseInt(this.operator.keys.aim_B):    this.slide('B', false);     break;
                    case parseInt(this.operator.keys.aim_L):    this.rotate('L', false);    break;
                    case parseInt(this.operator.keys.accel):    this.accel(false);          break;
                    default:
                        if(this.weapons['L-' + key_code] != undefined){
                            var weapon = this.weapons['L-' + key_code];
                            weapon.op_cond.trigger_off = true;
                        }
                        break;
                }
                break;
        }
    }
};
