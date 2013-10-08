/**
 * 
 *
 */
var Ika = function()
{
};


Ika.prototype = {
    object_key:     new String('Ika'),
    image_key:      new String('ika'),
    image_group:    new Array(
        'm_oo', 'm_or', 'm_ol', 'm_rr', 'm_ll',
        's_oo', 's_or', 's_ol', 's_rr', 's_ll'
    ),


    speed:      new Number(3),
    mobility:   new Number(0.1),
    might:      new Number(65),


    hp:             new Number(1000),
    rotate_process: new Number(0),


    image_W:    new Number(113),
    image_H:    new Number(81),
    image_opacity: {
        M: new Number(1.0),
        S: new Number(0.5)
    },




    /**
     * 初期化
     *
     */
    init: function()
    {
        if(this.op_cond == null){
            this.op_cond = {
                alg:                1,
                phase:              1,
                chain:              0,
                pass_length:        new Number(0),
                pass_length_rest:   new Number(0),
                rotate:             null
            };
        }
    },


    /**
     *
     *
     *
     */
    postSetTarget: function()
    {
        if(this.op_cond.rotate == null){
            var relation = this.calcRelation();
            this.op_cond.rotate = relation.S;
            this.pos.S          = relation.S;
        }
    },


    /**
     * フェーズ内処理実行
     *
     */
    turn: function()
    {
        switch(this.op_cond.alg){
            case 1: this.algorithm01(); break;
            case 2: this.algorithm02(); break;
            case 3: this.algorithm03(); break;
        }
    },


    /**
     * 行動パターン1
     *
     *
     */
    algorithm01: function()
    {
        var relation = this.calcRelation();
        var pai = Math.PI;

        switch(this.op_cond.phase){
            case 1:
                var coefficicate = Math.sin((relation.S / pai) * pai);
                speed = 5.0 - Math.abs(coefficicate * 1.0);
                this.pos.S += 0.02 + Math.abs(coefficicate * 0.05);
                if(this.rotate_process < 5){
                    this.rotate_process ++;
                }

                if(Math.abs(relation.S) < 0.2){
                    this.op_cond.phase = 2;
                    if(relation.D > 50){
                        this.op_cond.pass_length = relation.D + 150;
                    }
                    else{
                        this.op_cond.pass_length = 200;
                    }
                    this.op_cond.pass_length_rest = this.op_cond.pass_length;
                }
                break;
            case 2:
                speed = 5.0 + Math.abs(Math.sin((this.op_cond.pass_length_rest / this.op_cond.pass_length) * pai) * 15);
                this.pos.S += 0.02;
                this.op_cond.pass_length_rest -= speed;
                if(this.rotate_process > 0){
                    this.rotate_process --;
                }
                if(this.op_cond.pass_length_rest < 0){
                    this.op_cond.chain = 0;
                    this.op_cond.phase = 1;
                }
                break;
        }

        this.pos.X += Math.sin(this.pos.S) * speed;
        this.pos.Y -= Math.cos(this.pos.S) * speed;
        this.op_cond.rotate = this.pos.S;
    },


    /**
     * @override
     */
    getImageKey :function(prefix)
    {
        var image_key = (prefix != undefined) ? prefix : '';
        switch(true){
            case (this.rotate_process >  0): image_key += '_or'; break;
            case (this.rotate_process == 0): image_key += '_oo'; break;
        }
        if(this.is_damage == true){
            image_key += '_d';
        }

        return image_key;
    }
};
