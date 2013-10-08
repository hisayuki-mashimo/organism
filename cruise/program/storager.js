/**
 * データ記憶機能
 *
 */
var Storager = function()
{
    this.storage = localStorage;
};


Storager.prototype = {
    /**
     * データ管理方式
     *
     */
    storage: null,


    /**
     * データキー
     *
     */
    base_key: new String('HTML5TEST-CRUISE'),


    /**
     * 依存オブジェクト
     *
     */
    depends: new Array(
        'player',
        'area',
        'map',
        'hp_meter',
        'en_meter',
        'container',
        'weapon_basis',
        'weapon_entity_basis',
        'weapons',
        'enemy_basis'
    ),




    /**
     * データ記憶
     *
     */
    store: function()
    {
        var data = {};

        var P = this.player;
        data.player = {
            speed:              P.speed,
            speed_coefficient:  P.speed_coefficient,
            mobility:           P.mobility,
            might:              P.might,
            pos:                P.pos,
            hp:                 P.hp,
            is_damage:          P.is_damage,
            rotate_process:     P.rotate_process,
            energy_max:         P.energy_max,
            energy:             P.energy,
            energy_expend:      P.energy_expend
        };

        var A = this.area;
        data.area = {
            phase:              A.phase,
            animation_speed:    A.animation_speed,
            rest_limit:         A.rest_limit,
            rest_metre:         A.rest_metre,
            enemy_count:        A.enemy_count,
            enemy_increment:    A.enemy_increment
        };

        data.enemies = {};
        for(var enemy_id in A.enemies){
            var enemy = A.enemies[enemy_id];
            data.enemies[enemy.id] = {
                id:         enemy.id,
                object_key: enemy.object_key.toString(),
                speed:      enemy.speed,
                mobility:   enemy.mobility,
                pos:        enemy.pos,
                op_cond:    enemy.op_cond,
                hp:         enemy.hp,
                appeared:   enemy.appeared,
                is_damage:  enemy.is_damage,
                ego_time:   enemy.ego_time
            };
            if(enemy.basis != undefined){
                data.enemies[enemy.id].basis_id     = enemy.basis.id;
                data.enemies[enemy.id].sub_count    = enemy.sub_count;
                data.enemies[enemy.id].sub_sita     = enemy.sub_sita;
            }
            if(enemy.sub_basis != undefined){
                data.enemies[enemy.id].sub_basis_id = enemy.sub_basis.id;
            }
        }

        var M = this.map;
        data.map = {
            image_base_src: M.image_base_src,
            image_base_X:   M.image_base_X,
            image_base_Y:   M.image_base_Y,
            image_target_X: M.image_target_X,
            image_target_Y: M.image_target_Y,
            image_metre:    M.image_metre,
            pos_T:          M.pos_T,
            pos_L:          M.pos_L,
            region_limit:   M.region_limit,
            region_size:    M.region_size
        };

        data.weapons = {};
        for(var weapon_key in this.weapons){
            var weapon = this.weapons[weapon_key];
            data.weapons[weapon_key] = {
                key_code:   weapon.key_code,
                equiped:    weapon.equiped,
                rest_limit: weapon.rest_limit,
                entities:   new Array()
            };
            if(weapon.type == 'launcher'){
                data.weapons[weapon_key].op_cond = {
                    trigger_on:     weapon.op_cond.trigger_on,
                    trigger_off:    true
                };
            }
        }
        for(var i = 0; i < A.weapon_entities.length; i ++){
            var entity = A.weapon_entities[i];
            var weapon_key = entity.basis.object_key.toString();
            var weapon_data = data.weapons[weapon_key];
            var params = {};
            switch(weapon_key){
                case 'Chaff':
                    params.chain_pass   = entity.chain_pass;
                case 'Beam':
                case 'Flare':
                case 'Missile':
                    params.pos          = entity.pos;
                    params.op_cond      = entity.op_cond;
                    params.passed       = entity.passed;
                    params.enable       = entity.enable;
                    break;
                case 'Burner':
                case 'Ccv':
                    break;
            }
            weapon_data.entities.push(params);
        }

        var data_string = JSON.stringify(data);
        this.storage.setItem(this.base_key, data_string);
    },


    /**
     * データ復元
     *
     */
    restore: function()
    {
        var data = null;
        var data_string = this.storage.getItem(this.base_key);
        if(data_string == null){
            return false;
        }
        data = JSON.parse(data_string);

        this.player.init(data.player);
        this.map.init(data.map);
        this.hp_meter.init();
        this.en_meter.init();
        this.area.init(data.area);

        var enemies = {};
        for(var enemy_id in data.enemies){
            var enemy_data = data.enemies[enemy_id];
            var spesifies = {is_restore: true};
            enemies[enemy_id] = this.enemy_basis.summons(enemy_data.object_key, enemy_data, spesifies);
            this.area.enemies[enemy_id] = enemies[enemy_id];
        }
        for(var enemy_id in enemies){
            var enemy       = enemies[enemy_id];
            var enemy_data  = data.enemies[enemy_id];
            if(enemy_data.basis_id != undefined){
                var basis = enemies[enemy_data.basis_id];
                switch(true){
                    case (basis == undefined):
                    case (basis == null):
                    case (basis.hp <= 0):
                        break;
                    default:
                        enemy.basis = basis;
                        basis.sub_entities.push(enemy);
                        break;
                }
            }
            if(enemy_data.sub_basis_id != undefined){
                var sub_basis = enemies[enemy_data.sub_basis_id];
                switch(true){
                    case (sub_basis == undefined):
                    case (sub_basis == null):
                    case (sub_basis.hp <= 0):
                        break;
                    default:
                        enemy.sub_basis = sub_basis;
                        break;
                }
            }
        }

        for(var weapon_key in data.weapons){
            var weapon_data = data.weapons[weapon_key];
            var weapon = this.weapon_basis.summons(weapon_key, weapon_data);
            this.weapons[weapon_key] = weapon;
            if(weapon.equiped == true){
                this.player.setWeapon(weapon, weapon.key_code);
            }
            for(var i = 0; i < weapon_data.entities.length; i ++){
                var entity_data = weapon_data.entities[i];
                var entity = this.weapon_entity_basis.summons(weapon, entity_data);
                this.area.weapon_entities.push(entity);
            }
        }

        this.container.init();

        return true;
    },


    /**
     * データ削除
     *
     */
    clear: function()
    {
        this.storage.clear();
    }
};
