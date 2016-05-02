var Ika = function(){
};


Ika.prototype = {
    pos: {
        X: new Number(0),
        Y: new Number(0),
        S: new Number(0)
    },
    op_cond: {
        alg:    1,
        phase:  1,
        chain:  0,
        pass_length: new Number(0),
        pass_length_rest: new Number(0),
    },


    target: null,


    init: function(params)
    {
        if(params != undefined){
            for(var i in params){
                if(this[i] !== undefined){
                    this[i] = params[i];
                }
            }
        }
    },


    execute: function()
    {
        switch(this.op_cond.alg){
            case 1: this.algorithm01(); break;
            case 2: this.algorithm02(); break;
            case 3: this.algorithm03(); break;
        }
    },


    algorithm01: function()
    {
        var relation = this.calcRelation();

        switch(this.op_cond.phase){
            case 1:
                this.pos.S += 0.05;// * ((relation.S > 0) ? 1 : -1);
                speed = 1.5;
/*document.getElementById('debug').innerHTML = 
    (Math.round(this.pos.S * 100) / 100) + '<br />' + 
    (Math.round(relation.S * 100) / 100) + '<br />' + 
    relation.S;*/
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
document.getElementById('debug').innerHTML = this.op_cond.pass_length;
                speed = 2 + Math.abs(Math.sin((this.op_cond.pass_length_rest / this.op_cond.pass_length) * Math.PI) * 15);
                this.op_cond.pass_length_rest -= speed;
//document.getElementById('debug').innerHTML = speed;
                if(this.op_cond.pass_length_rest < 0){
//document.getElementById('debug').innerHTML = 3;
                    this.op_cond.chain = 0;
                    this.op_cond.phase = 1;
                }
                break;
        }

        var move_Y = Math.cos(this.pos.S) * speed * -1;
        var move_X = Math.sin(this.pos.S) * speed;
        this.pos.Y += move_Y;
        this.pos.X += move_X;
/*document.getElementById('debug').innerHTML = 
    Math.round(this.pos.X) + '|' + 
    Math.round(this.pos.Y) + '<br />' +
    '<div style="width:50px; text-align:right">' +
    Math.round(this.pos.S * 100) / 100 +
    '</div>';*/
    },


    calcRelation: function()
    {
        var pai = Math.PI;
        var rel_Y_abs = Math.abs(target.pos.Y - this.pos.Y);
        var rel_X_abs = Math.abs(target.pos.X - this.pos.X);
        if(rel_Y_abs == 0){
            var rel_S = (pai / 2) * ((rel_X_abs >= 0) ? 1 : -1);
        }
        else{
            var rel_S = Math.atan(rel_X_abs / rel_Y_abs);
            rel_S = (target.pos.Y < this.pos.Y) ? rel_S : (pai - rel_S);
            rel_S = (target.pos.X > this.pos.X) ? rel_S : (rel_S * -1);
        }
        var own_S = this.pos.S % (pai * 2);
        if(Math.abs(own_S) > pai){
            own_S = (pai - Math.abs(this.pos.S % pai)) * ((own_S > 0) ? -1 : 1);
        }

        return {
            D: Math.sqrt(Math.pow(rel_X_abs, 2) + Math.pow(rel_Y_abs, 2)),
            S: rel_S - own_S
        };
    }
};
