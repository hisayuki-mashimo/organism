/**
 * 装備データ基礎構造構築機能
 *
 *
 */
var Weapon_Basis = function()
{
};


Weapon_Basis.prototype = {
    /**
     * 依存オブジェクト
     *
     */
    depends: new Array(
        'weapon_entity_basis',
        'player',
        'area'
    ),


    /**
     * 初期化用プロパティ
     *
     */
    property: {
        // 内部処理用定義値
        type:           new String(''),
        title:          new String(''),
        object_key:     new String(''),
        image_key:      new String(''),

        // 状態関連データ
        key_code:       new Number(),
        equiped:        false,

        // 依存オブジェクト
        basis:          null,
        player:         null,
        area:           null
    },
    property_as_launcher: {
        // 内部処理用定義値
        image_material: null,
        image_group:    null,
        image_W:        new Number(),
        image_H:        new Number(),
        image_CX:       new Number(),
        image_CY:       new Number(),
        image_opacity:  null,

        // 性能関連データ
        speed:          new Number(),
        limit_max:      new Number(),
        might:          new Number(),
        pass_max:       new Number(),
        launch_limit:   new Number(),

        // 状態関連データ
        pos:            null,
        op_cond:        null,
        rest_limit:     new Number(0),
        chain:          new Number(1)
    },




    /**
     * 実体化
     *
     * @param   string  embody_key
     * @param   object  params
     */
    summons: function(embody_key, params)
    {
        // 実体化
        eval('var embody = new ' + embody_key + '();');

        // プロパティ定義
        for(var i in this.property){
            if(embody[i] === undefined){
                embody[i] = this.property[i];
            }
        }
        if(embody.type == 'launcher'){
            for(var i in this.property_as_launcher){
                if(embody[i] === undefined){
                    embody[i] = this.property_as_launcher[i];
                }
            }
        }
        if(params != undefined){
            for(var i in params){
                if(embody[i] !== undefined){
                    embody[i] = params[i];
                }
            }
        }

        // 依存オブジェクト挿入
        embody.basis    = this;
        embody.player   = this.player;
        embody.area     = this.area;

        // プロパティ初期化
        if(embody.pos == null){
            embody.pos = {
                X: new Number(),
                Y: new Number(),
                S: new Number(0)
            };
        }
        if(embody.op_cond == null){
            embody.op_cond = {
                trigger_on:     false,
                trigger_off:    false
            };
        }

        // 共通メソッド定義
        var ref = this;
        embody.getImagePath = function(key){
            return ref.getImagePath(this, key);
        };
        if(embody.type == 'launcher'){
            if(embody.launch == undefined){
                embody.launch = function(){
                    return ref.launch(this);
                };
            }
            if(embody.execute == undefined){
                embody.execute = function(){
                    return ref.executeAsLauncher(this);
                };
            }
            if(embody.turn == undefined){
                embody.turn = function(){};
            }
            if(embody.getImageKey == undefined){
                embody.getImageKey = function(prefix){
                    return ref.getImageKey(this, prefix);
                };
            }
        }
        else{
            if(embody.execute == undefined){
                embody.execute = function(){};
            }
        }

        // 画像情報設定
        embody.image_material = {};
        if(embody.type == 'launcher'){
            for(var i = 0; i < embody.image_group.length; i ++){
                var image_key = embody.image_group[i];
                embody.image_material[image_key] = new Image();
                embody.image_material[image_key].src= embody.getImagePath(image_key);
            }
            embody.image_CX = Math.ceil(embody.image_W / 2);
            embody.image_CY = Math.ceil(embody.image_H / 2);
        }

        // 実体初期化
        embody.init();

        return embody;
    },


    /**
     * 発射
     *
     * @param   object  embody
     * @return  object
     */
    launch: function(embody)
    {
        var entity = this.weapon_entity_basis.summons(embody);
        entity.init();
        embody.rest_limit = embody.limit_max;

        return entity;
    },


    /**
     * フェーズ内処理実行
     *
     * @param   object  embody
     */
    executeAsLauncher: function(embody)
    {
        if(embody.rest_limit > 0){
            embody.rest_limit --;
        }
    },


    /**
     * 画像キーの返却
     *
     * @param   object  embody
     * @param   string  prefix
     * @return  string
     */
    getImageKey :function(embody, prefix)
    {
        var image_key = (prefix != undefined) ? prefix : '';

        return image_key;
    },


    /**
     * 画像パス返却
     *
     * @param   object  embody
     * @param   number  key
     */
    getImagePath :function(embody, key)
    {
        return 'resource/weapon/' + embody.image_key + '_' + key + '.png';
    }
};




/**
 * 装備データ放出実体基礎構造構築機能
 *
 */
var Weapon_Entity_Basis = function()
{
};


Weapon_Entity_Basis.prototype = {
    /**
     * 依存オブジェクト
     *
     */
    depends:    new Array(
        //'weapon_basis'
    ),


    /**
     * 初期化用プロパティ
     *
     */
    property:   {
        // 状態関連データ
        pos:    null,
        enable: true,
        passed: null,

        // 依存オブジェクト
        entity_basis:   null,
        basis:          null
    },




    /**
     * 実体化
     *
     * @param   string  embody_key
     * @param   object  params
     */
    summons: function(basis, params)
    {
        // 実体化
        eval('var embody = new ' + basis.object_key.toString() + 'Entity();');

        // プロパティ定義
        for(var i in this.property){
            if(embody[i] === undefined){
                embody[i] = this.property[i];
            }
        }
        if(params != undefined){
            for(var i in params){
                if(embody[i] !== undefined){
                    embody[i] = params[i];
                }
            }
        }

        // プロパティ初期化
        if(embody.pos == null){
            embody.pos = {
                X: basis.pos.X,
                Y: basis.pos.Y,
                S: basis.pos.S
            };
        }
        if(embody.passed == null){
            embody.passed = 0;
        }

        // 共通メソッド定義
        var ref = this;
        if(embody.execute == undefined){
            embody.execute = function(){
                ref.execute(this);
            };
        }
        if(embody.turn == undefined){
            embody.turn = function(){
                ref.turn(this);
            };
        }
        if(embody.turnForTarget == undefined){
            embody.turnForTarget = function(){
                ref.turnForTarget(this);
            };
        }
        if(embody.exportImage == undefined){
            embody.exportImage = function(CTX){
                ref.exportImage(this, CTX);
            };
        }

        // 依存オブジェクト挿入
        embody.entity_basis = this;
        embody.basis        = basis;

        // 実体初期化
        embody.init();

        return embody;
    },


    /**
     * 
     *
     * @param   object  embody
     */
    execute: function(embody)
    {
        if(embody.enable == false){
            return;
        }

        embody.turn();

        embody.passed ++;
        if(embody.passed >= embody.basis.pass_max){
            embody.enable = false;
        }

        embody.pos.X += Math.sin(embody.pos.S) * embody.basis.speed;
        embody.pos.Y -= Math.cos(embody.pos.S) * embody.basis.speed;
    },


    /**
     * 
     *
     * @param   object  embody
     */
    turn: function(embody)
    {
        this.turnForTarget(embody);
    },


    /**
     * 目標に対しての相対角度の算出
     *
     * @param   object  embody
     */
    turnForTarget: function(embody)
    {
        for(var i in embody.basis.area.enemies){
            var enemy = embody.basis.area.enemies[i];
            var Y_abs = Math.abs(enemy.pos.Y - embody.pos.Y);
            var X_abs = Math.abs(enemy.pos.X - embody.pos.X);
            if(Y_abs <= enemy.image_CY){
                if(X_abs <= enemy.image_CX){
                    enemy.hp -= embody.basis.might;
                    enemy.is_damage = true;
                    embody.enable = false;

                    return;
                }
            }
        }
    },


    /**
     * 画像の出力
     *
     * @param   object  embody
     */
    exportImage: function(embody, CTX)
    {
        var image_M = embody.basis.image_material[embody.basis.getImageKey('m')];
        var image_S = embody.basis.image_material[embody.basis.getImageKey('s')];
        CTX.translate(embody.pos.X, embody.pos.Y);
        CTX.rotate(embody.pos.S);
        CTX.translate(embody.basis.image_CX * -1, embody.basis.image_CY * -1);
        CTX.globalAlpha = embody.basis.image_opacity.M;
        CTX.drawImage(image_M, 0, 0);
        CTX.globalAlpha = embody.basis.image_opacity.S;
        CTX.drawImage(image_S, 0, 0);
    }
};
