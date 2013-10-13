/**
 *
 *
 */
var Operator = function()
{
};


Operator.prototype = {
    /**
     * 依存ノード
     *
     */
    nodes: {
        canvas:        null,
        map_frame:     null,
        rest_limit:    null,
        rest_point:    null,
        announce:      null,
        bgm01:         null,
        bgm02:         null,
        bgm03:         null,
        bgm00_trigger: null,
        bgm01_trigger: null,
        bgm02_trigger: null,
        bgm03_trigger: null,
        scroller:      null
    },


    mightinesses: {
        player:         null,
        area:           null,
        avatar_basis:   null,
        map:            null,
        hp_meter:       null,
        enemy_basis:    null,
        audio:          null,
        audio_scroller: null
    },


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
        aim_T: new Number(38),
        aim_R: new Number(39),
        aim_B: new Number(40),
        aim_L: new Number(37),
        enter: new Number(13),
        jump:  new Number(32)
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

        this.nodes.canvas        = document.getElementById('CA01');
        this.nodes.map_frame     = document.getElementById('map_frame');
        this.nodes.rest_limit    = document.getElementById('rest_limit');
        this.nodes.rest_point    = document.getElementById('rest_point');
        this.nodes.hp            = document.getElementById('hp');
        this.nodes.announce      = document.getElementById('announce');
        this.nodes.bgm01         = document.getElementById('AD01');
        this.nodes.bgm02         = document.getElementById('AD02');
        this.nodes.bgm03         = document.getElementById('AD03');
        this.nodes.bgm00_trigger = document.getElementById('bgm00');
        this.nodes.bgm01_trigger = document.getElementById('bgm01');
        this.nodes.bgm02_trigger = document.getElementById('bgm02');
        this.nodes.bgm03_trigger = document.getElementById('bgm03');
        this.nodes.scroller      = document.getElementById('audio_scroller');

        this.mightinesses.player         = new Player();
        this.mightinesses.area           = new Area(this.nodes.canvas);
        this.mightinesses.avatar_basis   = new Avatar_Basis();
        this.mightinesses.map            = new Map(this.nodes.map_frame);
        this.mightinesses.hp_meter       = new Meter(this.nodes.hp);
        this.mightinesses.enemy_basis    = new Enemy_Basis();
        this.mightinesses.audio          = new Audio();
        this.mightinesses.audio_scroller = new Audio_Scroller();
        for (var mightiness_key in this.mightinesses) {
            var mightiness = this.mightinesses[mightiness_key];
            this[mightiness_key] = mightiness;

            if (mightiness.depends != undefined) {
                for (var i = 0; i < mightiness.depends.length; i ++) {
                    var depend_key = mightiness.depends[i];
                    if (depend_key == 'operator') {
                        mightiness[depend_key] = this;
                    }
                    else {
                        mightiness[depend_key] = this.mightinesses[depend_key];
                    }
                }
            }
        }

        this.area.rest_limit_node = this.nodes.rest_limit;
        this.area.rest_point_node = this.nodes.rest_point;
        this.hp_meter.color_MAX   = {R: 255, G: 255, B: 160};
        this.hp_meter.color_MIN   = {R: 255, G:   0, B:   0};

        this.player.init();
        this.map.init();
        this.hp_meter.init();
        this.area.init();
        this.audio.init({
            audio_nodes: {
                bgm01: this.nodes.bgm01,
                bgm02: this.nodes.bgm02,
                bgm03: this.nodes.bgm03
            },
            audio_trigger_nodes: {
                bgm00: this.nodes.bgm00_trigger,
                bgm01: this.nodes.bgm01_trigger,
                bgm02: this.nodes.bgm02_trigger,
                bgm03: this.nodes.bgm03_trigger
            }
        });
        this.audio_scroller.init({
            audio:    this.audio,
            bar_node: this.nodes.scroller
        });

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

        $(this.nodes.announce).hide();

        this.area.startAnimate();
    },


    /**
     * 一時停止実行／解除
     *
     */
    pause: function()
    {
        if (this.paused == false) {
            this.area.stopAnimate();
            this.paused = true;

            $('#pause_back').show();
            $('#complete_back').hide();
            $('#mess_pause').show();
            $('#mess_hp_empty').hide();
            $('#mess_complete').hide();

            $(this.nodes.announce).fadeIn(250);

            this.audio.pauseBgm();
        }
        else{
            this.area.startAnimate();
            this.paused = false;

            $(this.nodes.announce).fadeOut(250);

            this.audio.restartBgm();
        }
    },


    /**
     * 
     *
     * @param   string  failed_case
     */
    fail: function(failed_case)
    {
        $('#pause_back').hide();
        $('#complete_back').hide();
        $('#mess_pause').hide();
        $('#mess_complete').hide();
        switch (failed_case) {
            case 'hp_empty':
                $('#mess_hp_empty').show();
                break;
        }
        $(this.nodes.announce).fadeIn(250);

        this.audio.stopBgm();
    },


    /**
     * 
     *
     */
    complete: function()
    {
        $('#pause_back').hide();
        $('#complete_back').show();
        $('#mess_pause').hide();
        $('#mess_complete').show();
        $('#mess_hp_empty').hide();
        $(this.nodes.announce).fadeIn(250);

        this.audio.stopBgm();
    }
};
