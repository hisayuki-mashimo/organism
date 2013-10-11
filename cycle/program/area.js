/**
 * エリア実体
 *
 * @param   object  canvas_node
 */
var Area = function(canvas_node)
{
    this.canvas_node = canvas_node;
};


Area.prototype = {
    canvas_node: null,
    context: null,


    animation: null,
    animation_speed: new Number(50),


    /**
     * 依存オブジェクト
     *
     */
    depends: new Array(
        'operator',
        'player',
        'map',
        'hp_meter',
        'enemy_basis'
    ),


    phase:              1,
    rest_limit:         10000,
    rest_point:         new Number(10),
    rest_limit_node:    null,
    rest_point_node:    null,


    enemy_list:         null,
    enemies:            null,
    enemy_count:        new Number(),
    enemy_increment:    new Number(1),




    /**
     * 初期化
     *
     * @param   array   params
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

        this.context = this.canvas_node.getContext('2d');

        this.player.area = this;
        if(! this.player.pos.Y){
            this.player.pos.Y = this.canvas_node.height / 2;
            this.player.pos.Y = this.map.image_horizon;
        }
        if(! this.player.pos.X){
            this.player.pos.X = this.canvas_node.width / 2;
        }
        if(this.enemies == null){
            this.enemies = {};
        }
        if(this.enemy_list == null){
            this.enemy_list = new Array(
                {arise: 'Kurage',   priority: 5.0, cond: {max: null, min: null}}
            );
        }
    },


    /**
     * 
     *
     *
     */
    startAnimate: function()
    {
        var ref = this;

        this.animation = setInterval(function(){
            ref.execute();
        }, this.animation_speed);
    },


    /**
     * 
     *
     *
     */
    stopAnimate: function()
    {
        clearInterval(this.animation);
    },


    /**
     *
     *
     *
     */
    execute: function()
    {
        this.callEvent();

        this.player.execute();
        var rest_enemies = {};
        for (var entity_id in this.enemies) {
            var entity = this.enemies[entity_id];
            if ((entity.hp <= 0) || (entity.existed === false)) {
                if (entity.existed === false) {
                    this.rest_point --;
                }

                entity = null;
                this.enemy_count --;
                continue;
            }
            entity.execute();
            rest_enemies[entity_id] = entity;
        }
        this.enemies = rest_enemies;

        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas_node.width, this.canvas_node.height);
        for (var entity_id in this.enemies) {
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.enemies[entity_id].exportImage(this.context);
        }
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.player.exportImage(this.context);

        this.map.execute();

        this.rest_point_node.innerHTML = this.rest_point;

        this.hp_meter.execute();

        this.rest_limit --;
        this.rest_limit_node.innerHTML = this.rest_limit;

        if (this.rest_point <= 0) {
            this.stopAnimate();
            this.operator.complete();
        }
        if (this.player.hp <= 0) {
            this.stopAnimate();
            this.operator.fail('hp_empty');
        }
        if (this.rest_limit <= 0) {
            this.stopAnimate();
            this.operator.fail('time_over');
        }
    },


    /**
     *
     *
     *
     */
    callEvent: function()
    {
        switch (this.phase) {
            case 1:
                if (this.rest_limit % 10 == 1) {
                    if (this.enemy_count < 3) {
                        var alise_rand = Math.random();
                        if (alise_rand > 0.3) {
                            var arise = null;
                            var priority_max = -1;
                            for (var i = 0; i < this.enemy_list.length; i ++) {
                                var enemy_data = this.enemy_list[i];
                                switch (true) {
                                    case ((enemy_data.cond.max != null) && (enemy_data.cond.max < this.rest_metre)): break;
                                    case ((enemy_data.cond.min != null) && (enemy_data.cond.min > this.rest_metre)): break;
                                    default:
                                        var priority = Math.random() * enemy_data.priority;
                                        if (priority > priority_max) {
                                            arise = enemy_data.arise;
                                            priority_max = priority;
                                        }
                                        break;
                                }
                            }
                            if (arise != null) {
                                var enemy = this.enemy_basis.summons(arise);
                                if (enemy instanceof Array) {
                                    for (var i = 0; i < enemy.length; i ++) {
                                        this.setEnemy(enemy[i]);
                                    }
                                } else {
                                    this.setEnemy(enemy);
                                }
                            }
                        }
                    }
                }
                break;
            case 2:
                break;
        }
    },


    /**
     * 
     *
     *
     */
    setEnemy: function(enemy)
    {
        var id = 'E-' + this.enemy_increment;
        enemy.id = id;

        this.enemies[id] = enemy;
        this.enemy_increment ++;
        this.enemy_count ++;
    }
};
