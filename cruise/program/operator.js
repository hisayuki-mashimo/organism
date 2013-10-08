var Operator = function()
{
};


Operator.prototype = {
    /**
     * 依存ノード
     *
     */
    nodes: {
        canvas:     null,
        map_frame:  null,
        rest_limit: null,
        rest_metre: null,
        energy:     null,
        memory:     null,
        container:  null
    },


    mightinesses: {
        storager:               null,
        player:                 null,
        area:                   null,
        map:                    null,
        hp_meter:               null,
        en_meter:               null,
        container:              null,
        weapon_basis:           null,
        weapon_entity_basis:    null,
        weapons:                null,
        enemy_basis:            null
    },


    /**
     * 召喚装備データ
     *
     */
    weapon_keys: new Array(
        'Beam',
        'Missile',
        'Flare',
        'Chaff',
        'Burner',
        'Ccv'
    ),


    /**
     * 状態関連データ
     *
     */
    paused: false,


    /**
     * 操作キー
     *
     */
    keys: {
        aim_T:  new Number(38),
        aim_R:  new Number(39),
        aim_B:  new Number(40),
        aim_L:  new Number(37),
        shot:   new Number(32),
        enter:  new Number(13),
        accel:  new Number(32)
    },




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

        this.nodes.canvas       = document.getElementById('CA01');
        this.nodes.map_frame    = document.getElementById('map_frame');
        this.nodes.rest_limit   = document.getElementById('rest_limit');
        this.nodes.rest_metre   = document.getElementById('rest_metre');
        this.nodes.hp           = document.getElementById('hp');
        this.nodes.energy       = document.getElementById('energy');
        this.nodes.memory       = document.getElementById('memory_confirm');

        this.mightinesses.storager              = new Storager();
        this.mightinesses.player                = new Player();
        this.mightinesses.area                  = new Area(this.nodes.canvas);
        this.mightinesses.map                   = new Map(this.nodes.map_frame);
        this.mightinesses.hp_meter              = new Meter(this.nodes.hp);
        this.mightinesses.en_meter              = new Meter(this.nodes.energy);
        this.mightinesses.container             = new Container();
        this.mightinesses.weapon_basis          = new Weapon_Basis();
        this.mightinesses.weapon_entity_basis   = new Weapon_Entity_Basis();
        this.mightinesses.weapons               = {};
        this.mightinesses.enemy_basis           = new Enemy_Basis();
        for(var mightiness_key in this.mightinesses){
            var mightiness = this.mightinesses[mightiness_key];
            this[mightiness_key] = mightiness;

            if(mightiness.depends != undefined){
                for(var i = 0; i < mightiness.depends.length; i ++){
                    var depend_key = mightiness.depends[i];
                    if(depend_key == 'operator'){
                        mightiness[depend_key] = this;
                    }
                    else{
                        mightiness[depend_key] = this.mightinesses[depend_key];
                    }
                }
            }
        }

        this.area.rest_limit_node   = this.nodes.rest_limit;
        this.area.rest_metre_node   = this.nodes.rest_metre;
        this.hp_meter.type          = 'hp';
        this.hp_meter.color_MAX     = {R: 255, G: 255, B: 160};
        this.hp_meter.color_MIN     = {R: 255, G:   0, B:   0};
        this.en_meter.type          = 'energy';
        this.en_meter.color_MAX     = {R: 192, G: 255, B: 240};
        this.en_meter.color_MIN     = {R:   0, G:   0, B: 128};

        var restored = this.storager.restore();
        if(restored == false){
            for(var i = 0; i < this.weapon_keys.length; i ++){
                var weapon_key = this.weapon_keys[i];
                this.weapons[weapon_key] = this.weapon_basis.summons(weapon_key);
            }
            this.player.init();
            this.player.setWeapon(this.weapons.Beam, 90);
            this.player.setWeapon(this.weapons.Missile, 88);
            this.map.init();
            this.hp_meter.init();
            this.en_meter.init();
            this.container.init();
            this.area.init();
        }

        var ref = this;
        $(document).keydown(function(e){
            var key_code = parseInt(e.keyCode);
            switch(key_code){
                case parseInt(ref.keys.enter):
                    ref.pause();
                    break;
                default:
                    ref.player.onOperate('keydown', key_code);
                    break;
            }
        });
        $(document).keyup(function(e){
            var key_code = parseInt(e.keyCode);
            ref.player.onOperate('keyup', key_code);
        });

        $(this.nodes.memory).hide();
        $('div#memory_DO').click(function(){
            ref.storager.store();
        });
        $('div#memory_NO01').click(function(){
            ref.storager.clear();
            window.location.reload();
        });
        $('div#memory_NO02').click(function(){
            ref.storager.clear();
            window.location.reload();
        });
        $('div#reload_DO').click(function(){
            window.location.reload();
        });
        $('div#end_DO').click(function(){
            window.close();
        });

        this.area.startAnimate();
    },


    /**
     * 一時停止実行／解除
     *
     */
    pause: function()
    {
        if(this.paused == false){
            this.area.stopAnimate();
            this.paused = true;

            $('#memory_table01').show();
            $('#memory_table02').hide();
            $('#memory_back').show();
            $('#complete_back').hide();
            $('#mess_pause').show();
            $('#mess_hp_empty').hide();
            $('#mess_energy_empty').hide();
            $('#mess_complete').hide();
            $('#reload_DO').hide();

            $(this.nodes.memory).fadeIn(250);
        }
        else{
            this.area.startAnimate();
            this.paused = false;

            $(this.nodes.memory).fadeOut(250);
        }
    },


    /**
     * 
     *
     * @param   string  failed_case
     */
    fail: function(failed_case)
    {
        $('#memory_table01').show();
        $('#memory_table02').hide();
        $('#memory_back').show();
        $('#complete_back').hide();
        $('#mess_pause').hide();
        $('#mess_complete').hide();
        $('#memory_DO').hide();
        $('#reload_DO').show();
        switch(failed_case){
            case 'hp_empty':
                $('#mess_hp_empty').show();
                $('#mess_energy_empty').hide();
                break;
            case 'energy_empty':
                $('#mess_hp_empty').hide();
                $('#mess_energy_empty').show();
                break;
        }
        $(this.nodes.memory).fadeIn(250);
    },


    /**
     * 
     *
     */
    complete: function()
    {
        $('#memory_table01').hide();
        $('#memory_table02').show();
        $('#memory_back').hide();
        $('#complete_back').show();
        $('#mess_pause').hide();
        $('#mess_complete').show();
        $('#memory_DO').hide();
        $('#reload_DO').show();
        $('#mess_hp_empty').hide();
        $('#mess_energy_empty').hide();
        $(this.nodes.memory).fadeIn(250);
    }
};
