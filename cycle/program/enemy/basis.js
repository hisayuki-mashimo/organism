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
        'map',
        'avatar_basis'
    ),


    /**
     * 共通プロパティ
     *
     */
    property: {
        // 内部処理用定義値
        id:             new Number(),
        body_radius:    null,
        avatars:        null,
        avatar_codes:   null,

        // 性能関連データ
        speed:          new Number(),
        might:          new Number(),

        // 状態関連データ
        pos:            null,
        op_cond:        null,
        hp:             new Number(),
        appeared:       false,
        existed:        false,
        is_damage:      false,

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
        // 実体化
        eval('var embody = new ' + embody_key + '();');

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

        // 依存オブジェクト挿入
        embody.area = this.area;
        embody.map  = this.map;

        // プロパティ初期化
        if (embody.body_radius === null) {
            embody.body_radius = {X: 10, Y: 10};
        }
        if (embody.avatar_codes === null) {
            embody.avatar_codes = [embody_key];
        }
        embody.avatars = {};
        embody.existed = true;

        // 共通メソッド定義
        var ref = this;
        if (embody.initPos == undefined) {
            embody.initPos = function(){
                ref.initPos(this);
            };
        }
        if (embody.execute == undefined) {
            embody.execute = function(){
                ref.execute(this);
            };
        }
        if (embody.turn == undefined) {
            embody.turn = function(){};
        }
        if (embody.exportImage == undefined) {
            embody.exportImage = function(CTX){
                ref.exportImage(this, CTX);
            };
        }
        embody.getImagePath = function(image_key){
            return ref.getImagePath(this, image_key);
        };

        // 画像情報設定
        for (var i = 0; i < embody.avatar_codes.length; i ++) {
            var avatar_code = embody.avatar_codes[i];

            embody.avatars[avatar_code] = this.avatar_basis.summons(embody, avatar_code);
        }

        // 実体初期化
        embody.init();
        if (embody.pos == null) {
            embody.initPos();
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
                case (embody.pos.X < embody.body_radius.X * -1):
                case (embody.pos.Y < embody.body_radius.Y * -1):
                case (embody.pos.X > this.map.display_W + embody.body_radius.X):
                case (embody.pos.Y > this.map.display_H + embody.body_radius.Y):
DW(
embody.pos.X + '<br />' +
embody.pos.Y + '<br />' +
embody.body_radius.X + '<br />' +
embody.body_radius.Y + '<br />' +
this.map.display_W + '<br />' +
this.map.display_H
);
                    break;
                default:
                    embody.appeared = true;
                    break;
            }
        }

        // 状態パラメータ更新
        embody.is_damage = false;
    },


    /**
     * 画像の出力
     *
     * @param   object  embody
     */
    exportImage: function(embody, CTX)
    {
        for (var i in embody.avatars) {
            embody.avatars[i].exportImage(CTX);
        }

        // 状態パラメータ初期化
        embody.is_damage = false;
    }
};
