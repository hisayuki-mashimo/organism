/**
 * 敵データ基礎構造構築機能
 *
 *
 */
var Enemy_Basis = function()
{
};


Enemy_Basis.prototype = {
    /**
     * 依存オブジェクト
     *
     */
    depends: new Array(
        'player',
        'area',
        'map'
    ),


    /**
     * 共通プロパティ
     *
     */
    property: {
        // 内部処理用定義値
        id:             new Number(),
        image_material: null,
        image_opacity:  null,
        image_key:      new String(''),
        image_group:    new Array(),
        image_W:        new Number(),
        image_H:        new Number(),
        image_CX:       new Number(),
        image_CY:       new Number(),

        // 性能関連データ
        speed:          new Number(),
        mobility:       new Number(),
        might:          new Number(),

        // 状態関連データ
        target:         null,
        pos:            null,
        op_cond:        null,
        hp:             new Number(),
        appeared:       false,
        is_damage:      false,
        ego_time:       new Number(0),

        // 依存オブジェクト
        area:           null,
        map:            null
    },




    /**
     * 実体化
     *
     * @param   string  embody_key
     * @param   object  params
     * @param   object  specifies
     */
    summons: function(embody_key, params, specifies)
    {
        // 指定事項確認
        if(specifies != undefined){
            is_restore = (specifies.is_restore == true) ? true : false;
        }
        else{
            is_restore = false;
        }

        // 実体化
        eval('var embody = new ' + embody_key + '();');

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

        // 依存オブジェクト挿入
        embody.area = this.area;
        embody.map  = this.map;

        // プロパティ初期化

        // 共通メソッド定義
        var ref = this;
        if(embody.initPos == undefined){
            embody.initPos = function(){
                ref.initPos(this);
            };
        }
        embody.setTarget = function(target){
            ref.setTarget(this, target);
        };
        if(embody.postSetTarget == undefined){
            embody.postSetTarget = function(){};
        }
        if(embody.execute == undefined){
            embody.execute = function(){
                ref.execute(this);
            };
        }
        if(embody.turn == undefined){
            embody.turn = function(){};
        }
        if(embody.exportImage == undefined){
            embody.exportImage = function(CTX){
                ref.exportImage(this, CTX);
            };
        }
        if(embody.getImageKey == undefined){
            embody.getImageKey = function(prefix){
                return ref.getImageKey(this, prefix);
            };
        }
        embody.getImagePath = function(key, is_damage){
            return ref.getImagePath(this, key, is_damage);
        };
        embody.calcRelation = function(){
            return ref.calcRelation(this);
        };

        // 画像情報設定
        embody.image_material = {};
        for(var i = 0; i < embody.image_group.length; i ++){
            var image_key = embody.image_group[i];
            embody.image_material[image_key] = new Image();
            embody.image_material[image_key].src= embody.getImagePath(image_key, false);
            embody.image_material[image_key + '_d'] = new Image();
            embody.image_material[image_key + '_d'].src= embody.getImagePath(image_key, true);
        }
        embody.image_CX = Math.ceil(embody.image_W / 2);
        embody.image_CY = Math.ceil(embody.image_H / 2);

        // 実体初期化
        embody.init();
        if(embody.pos == null){
            embody.initPos();
        }
        embody.setTarget(this.player);

        if(is_restore == false){
            if(embody.subordinate != undefined){
                var embodies = new Array();
                for(var i = 1; i <= embody.subordinate.count; i ++){
                    var weapon_key = embody.subordinate.object_key.toString();
                    var subordinate = this.summons(weapon_key, {
                        basis:      embody,
                        sub_count:  i
                    });
                    embody.sub_entities.push(subordinate);
                    embodies.push(subordinate);
                }
                embodies.push(embody);

                return embodies;
            }
        }

        return embody;
    },


    /**
     * 位置・方向の初期化
     *
     * @param   object  embody
     */
    initPos :function(embody)
    {
        var radius = this.map.display_W + 50;
        var rand_sita = Math.PI * 2 / Math.random();
        embody.pos = {
            X: Math.floor((this.map.display_W / 2) + (radius * Math.sin(rand_sita))),
            Y: Math.floor((this.map.display_H / 2) + (radius * Math.cos(rand_sita))),
            S: new Number(0)
        };
    },


    /**
     * フェーズ内処理の実行
     *
     * @param   object  embody
     */
    execute :function(embody)
    {
        // フェーズ内行動
        embody.turn();

        // 被認知可能判別
        if(embody.appeared == false){
            switch(true){
                case (embody.pos.X < embody.image_CX * -1):
                case (embody.pos.Y < embody.image_CY * -1):
                case (embody.pos.X > this.map.display_W + embody.image_CX):
                case (embody.pos.Y > this.map.display_H + embody.image_CY):
                    break;
                default:
                    embody.appeared = true;
                    break;
            }
        }

        // 状態パラメータ更新
        embody.ego_time ++;
        //embody.is_damage = false;
    },


    /**
     * 画像の出力
     *
     * @param   object  embody
     */
    exportImage: function(embody, CTX)
    {
        var image_M = embody.image_material[embody.getImageKey('m')];
        var image_S = embody.image_material[embody.getImageKey('s')];
        CTX.translate(embody.pos.X, embody.pos.Y);
        CTX.rotate(embody.pos.S);
        CTX.translate(embody.image_CX * -1, embody.image_CY * -1);
        CTX.globalAlpha = embody.image_opacity.M;
        CTX.drawImage(image_M, 0, 0);
        CTX.globalAlpha = embody.image_opacity.S;
        CTX.drawImage(image_S, 0, 0);

        // 状態パラメータ初期化
        embody.is_damage = false;
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
        if(embody.is_damage == true){
            image_key += '_d';
        }

        return image_key;
    },


    /**
     * 画像パスの返却
     *
     * @param   object  embody
     * @param   string  key
     * @param   boolean is_damage
     * @return  string
     */
    getImagePath :function(embody, key, is_damage)
    {
        return 'resource/enemy/' + embody.image_key + '_' + key + ((is_damage == true) ? '_d' : '') + '.png';
    },


    /**
     * 対象の指定
     *
     * @param   object  embody
     * @param   object  target
     */
    setTarget :function(embody, target)
    {
        embody.target = target;
        embody.postSetTarget();
    },


    /**
     * 対象との相対位置・角度の算出
     *
     * @param   object  embody
     * @return  object  {D: 相対距離, S: 相対角度}
     */
    calcRelation: function(embody)
    {
        var pai = Math.PI;
        var own_S = (embody.op_cond.rotate == null) ? 0 : embody.op_cond.rotate;
        var rel_Y = Math.abs(embody.target.pos.Y - embody.pos.Y);
        var rel_X = Math.abs(embody.target.pos.X - embody.pos.X);
        if(rel_Y == 0){
            var abs_S = (pai / 2) * ((rel_X >= 0) ? 1 : -1);
        }
        else{
            var abs_S = Math.atan(rel_X / rel_Y);
            abs_S = (embody.target.pos.Y < embody.pos.Y) ? abs_S : (pai - abs_S);
            abs_S = (embody.target.pos.X > embody.pos.X) ? abs_S : (abs_S * -1);
        }
        var rel_S = (abs_S - own_S) % (pai * 2);
        if(Math.abs(rel_S) > pai){
            rel_S = (pai - Math.abs((abs_S - own_S) % pai)) * ((rel_S > 0) ? -1 : 1);
        }

        return {
            D: Math.sqrt(Math.pow(rel_X, 2) + Math.pow(rel_Y, 2)),
            S: rel_S
        };
    }
};
