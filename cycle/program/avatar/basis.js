/**
 * アバターデータ基礎構造構築機能
 *
 *
 */
var Avatar_Basis = function()
{
};


Avatar_Basis.prototype = {
    /**
     * 依存オブジェクト
     *
     */
    depends: new Array(
        'area'
    ),


    /**
     * 共通プロパティ
     *
     */
    property: {
        // 実体コード
        embody_code:        null,

        // 内部処理用定義値
        image_materials:    null,
        image_paturns:      null,
        image_opacity:      new Number(1),
        image_W:            new Number(),
        image_H:            new Number(),
        image_CX:           new Number(),
        image_CY:           new Number(),

        // 状態関連データ
        pos_relative:       null,

        // 依存オブジェクト
        owner:              null,
        area:               null
    },




    /**
     * 実体化
     *
     * @param   string  embody_key
     * @param   object  params
     * @param   object  specifies
     */
    summons: function(owner, embody_code, params)
    {
        // 実体化
        eval('var embody = new Avatar_' + embody_code + '();');

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
        if (embody.pos_relative === null) {
            embody.pos_relative = {
                X: new Number(0),
                Y: new Number(0),
                S: new Number(0)
            };
        }
        embody.image_materials = {};
        if (embody.image_paturns === null) {
            embody.image_paturns = ['base'];
        }

        // 依存オブジェクト挿入
        embody.owner    = owner;
        embody.area     = this.area;

        // プロパティ初期化

        // 共通メソッド定義
        var ref = this;
        if(embody.exportImage == undefined){
            embody.exportImage = function(CTX){
                ref.exportImage(this, CTX);
            };
        }
        embody.getImagePath = function(paturn_code){
            return ref.getImagePath(this, paturn_code);
        };
        if(embody.getImageMaterial == undefined){
            embody.getImageMaterial = function(){
                return ref.getImageMaterial(this);
            };
        }
        if (embody.adjustPos == undefined) {
            embody.adjustPos = function(){
                ref.adjustPos(this);
            };
        }

        // 画像情報設定
        embody.image_CX = embody.image_W / 2;
        embody.image_CY = embody.image_H / 2;
        for (var i = 0; i < embody.image_paturns.length; i ++) {
            var image_material  = new Image();
            var image_paturn    = embody.image_paturns[i];

            image_material.src= embody.getImagePath(image_paturn);

            embody.image_materials[image_paturn] = image_material;
        }

        return embody;
    },


    /**
     * 画像の出力
     *
     * @param   object  embody
     * @param   object  CTX
     */
    exportImage: function(embody, CTX)
    {
        embody.adjustPos();

        CTX.setTransform(1, 0, 0, 1, 0, 0);
        CTX.translate(embody.owner.pos.X,       embody.owner.pos.Y);
        CTX.translate(embody.pos_relative.X,    embody.pos_relative.Y);
        CTX.rotate(embody.pos_relative.S);
        CTX.translate(embody.image_CX * -1, embody.image_CY * -1);
        CTX.globalAlpha = embody.image_opacity.M;
        CTX.drawImage(embody.getImageMaterial(), 0, 0);
    },


    /**
     * 位置調整
     *
     * @param   object  embody
     */
    adjustPos: function(embody)
    {
    },


    /**
     * 画像パスの返却
     *
     * @param   object  embody
     * @param   string  paturn_code
     * @return  string
     */
    getImagePath :function(embody, paturn_code)
    {
        return 'resource/avatar/' + embody.embody_code + (paturn_code !== null ? ('_' + paturn_code) : '') + '.png';
    },


    /**
     * 
     *
     * @param   object  embody
     * @return  object
     */
    getImageMaterial :function(embody)
    {
        return embody.image_materials.base;
    }
};
