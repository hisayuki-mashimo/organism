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
        'en_meter',
        'enemy_basis'
    ),


    phase:              1,
    rest_limit:         10000,
    rest_metre:         null,
    rest_limit_node:    null,
    rest_metre_node:    null,


    enemy_list:         null,
    enemies:            null,
    enemy_count:        new Number(),
    weapon_entities:    new Array(),
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
        }
        if(! this.player.pos.X){
            this.player.pos.X = this.canvas_node.width / 2;
        }
        if(this.enemies == null){
            this.enemies = {};
        }
        if(this.enemy_list == null){
            this.enemy_list = new Array(
                {arise: 'Kurage',   priority: 5.0, cond: {max: null, min: null}},
                {arise: 'Uni',      priority: 2.0, cond: {max: 5000, min: null}},
                {arise: 'Tako',     priority: 4.0, cond: {max: 3000, min: null}}
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
        switch(this.phase){
            case 1: this.execute01(); break;
            case 2: this.execute02(); break;
        }
    },


    /**
     *
     *
     *
     */
    execute01: function()
    {
        this.callEvent();

        this.player.execute();
        var rest_weapon_entities    = new Array();
        var rest_enemies            = {};
        for(var i = 0; i < this.weapon_entities.length; i ++){
            var entity = this.weapon_entities[i];
            entity.execute();
            if(entity.enable == false){
                entity = null;
                continue;
            }
            rest_weapon_entities.push(entity);
        }
        for(var entity_id in this.enemies){
            var entity = this.enemies[entity_id];
            if(entity.hp <= 0){
                entity = null;
                this.enemy_count --;
                continue;
            }
            entity.execute();
            rest_enemies[entity_id] = entity;
        }
        this.weapon_entities    = rest_weapon_entities;
        this.enemies            = rest_enemies;

        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas_node.width, this.canvas_node.height);
        for(var entity_id in this.enemies){
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.enemies[entity_id].exportImage(this.context);
        }
        for(var i = 0; i < this.weapon_entities.length; i ++){
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.weapon_entities[i].exportImage(this.context);
        }
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.player.exportImage(this.context);

        this.map.execute();

        var rest_pos_X = ((this.map.image_target_X - this.map.image_base_X) * this.map.region_size) + this.map.pos_L;
        var rest_pos_Y = ((this.map.image_target_Y - this.map.image_base_Y) * this.map.region_size) + this.map.pos_T;
        rest_pos_X -= this.player.pos.X - (this.map.display_W / 2);
        rest_pos_Y -= this.player.pos.Y - (this.map.display_H / 2);
        rest_pos_X = Math.abs(rest_pos_X);
        rest_pos_Y = Math.abs(rest_pos_Y);
        var hypotenuse  = Math.sqrt(Math.pow(rest_pos_X, 2) + Math.pow(rest_pos_Y, 2));
        this.rest_metre = Math.floor(hypotenuse / this.map.region_size * this.map.image_metre);
        this.rest_metre_node.innerHTML = this.rest_metre;

        this.hp_meter.execute();
        this.en_meter.execute();

        this.rest_limit --;
        this.rest_limit_node.innerHTML = this.rest_limit;

        if(this.player.hp <= 0){
            this.stopAnimate();
            this.operator.fail('hp_empty');
        }
        if(this.player.energy <= 0){
            this.stopAnimate();
            this.operator.fail('energy_empty');
        }
        if(this.rest_limit <= 0){
            this.stopAnimate();
            this.operator.fail('time_over');
        }
        if(hypotenuse < 200){
            this.phase = 2;
        }
    },


    /**
     *
     *
     *
     */
    execute02: function()
    {
        var boss_arised = (this.enemies['B-01'] != undefined) ? true : false;
        if(boss_arised == false){
            this.callEvent();
        }

        this.player.execute();
        var rest_weapon_entities    = new Array();
        var rest_enemies            = {};
        for(var i = 0; i < this.weapon_entities.length; i ++){
            var entity = this.weapon_entities[i];
            entity.execute();
            if((entity.passed >= entity.basis.pass_max) || (entity.enable == false)){
                entity = null;
                continue;
            }
            rest_weapon_entities.push(entity);
        }
        for(var entity_id in this.enemies){
            var entity = this.enemies[entity_id];
            if(entity.hp <= 0){
                entity = null;
                if(entity_id == 'B-01'){
                    this.stopAnimate();
                    this.operator.complete();
                }
                this.enemy_count --;
                continue;
            }
            entity.execute();
            rest_enemies[entity_id] = entity;
        }
        this.weapon_entities    = rest_weapon_entities;
        this.enemies            = rest_enemies;

        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas_node.width, this.canvas_node.height);
        for(var entity_id in this.enemies){
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.enemies[entity_id].exportImage(this.context);
        }
        for(var i = 0; i < this.weapon_entities.length; i ++){
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.weapon_entities[i].exportImage(this.context);
        }
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.player.exportImage(this.context);

        var rest_pos_X = ((this.map.image_target_X - this.map.image_base_X) * this.map.region_size) + this.map.pos_L;
        var rest_pos_Y = ((this.map.image_target_Y - this.map.image_base_Y) * this.map.region_size) + this.map.pos_T;
        rest_pos_X -= this.player.pos.X - (this.map.display_W / 2);
        rest_pos_Y -= this.player.pos.Y - (this.map.display_H / 2);
        rest_pos_X = Math.abs(rest_pos_X);
        rest_pos_Y = Math.abs(rest_pos_Y);
        var hypotenuse  = Math.sqrt(Math.pow(rest_pos_X, 2) + Math.pow(rest_pos_Y, 2));
        this.rest_metre = Math.floor(hypotenuse / this.map.region_size * this.map.image_metre);
        this.rest_metre_node.innerHTML = this.rest_metre;

        this.hp_meter.execute();
        this.en_meter.execute();

        this.rest_limit --;
        this.rest_limit_node.innerHTML = this.rest_limit;

        if(this.player.hp <= 0){
            this.stopAnimate();
            this.operator.fail('hp_empty');
        }
        if(this.player.energy <= 0){
            this.stopAnimate();
            this.operator.fail('energy_empty');
        }
        if(this.rest_limit <= 0){
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
        switch(this.phase){
            case 1:
                if(this.rest_limit % 100 == 1){
                    if(this.enemy_count < 7){
                        var alise_rand = Math.random();
                        if(alise_rand > 0.3){
                            var arise = null;
                            var priority_max = -1;
                            for(var i = 0; i < this.enemy_list.length; i ++){
                                var enemy_data = this.enemy_list[i];
                                switch(true){
                                    case ((enemy_data.cond.max) != null && (enemy_data.cond.max < this.rest_metre)): break;
                                    case ((enemy_data.cond.min) != null && (enemy_data.cond.min > this.rest_metre)): break;
                                    default:
                                        var priority = Math.random() * enemy_data.priority;
                                        if(priority > priority_max){
                                            arise = enemy_data.arise;
                                            priority_max = priority;
                                        }
                                        break;
                                }
                            }
                            if(arise != null){
                                var enemy = this.enemy_basis.summons(arise);
                                if(enemy instanceof Array){
                                    for(var i = 0; i < enemy.length; i ++){
                                        this.setEnemy(enemy[i]);
                                    }
                                }
                                else{
                                    this.setEnemy(enemy);
                                }
                            }
                        }
                    }
                }
                break;
            case 2:
                if(this.enemy_count <= 0){
                    var enemy = this.enemy_basis.summons('Ika');
                    var id = 'B-01';
                    enemy.id = id;
                    this.enemies[id] = enemy;
                    this.enemy_increment ++;
                    this.enemy_count ++;
                }
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
