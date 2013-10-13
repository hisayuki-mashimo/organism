/**
 * 音響装置実体
 *
 * @param   object  audio_nodes
 */
var Audio = function()
{
}


Audio.prototype = {
    audio_nodes:            null,
    audio_main_code:        new String('bgm00'),
    audio_trigger_nodes:    null,


    /**
     * 依存オブジェクト
     *
     */
    depends:                new Array(
    ),


    /**
     * 初期化
     *
     * @param   array   params
     */
    init: function(params)
    {
        if (params != undefined) {
            for (var i in params) {
                if (this[i] !== undefined) {
                    this[i] = params[i];
                }
            }
        }

        var ref = this;
        for (var i in this.audio_trigger_nodes) {
            var audio_trigger_node = this.audio_trigger_nodes[i];

            if (i != 'bgm00') {
                var audio_node = this.audio_nodes[i];
                audio_node.autoplay = false;
            }

            audio_trigger_node.onclick = function(){
                ref.onChangeBgm(this.getAttribute('id'));
            }
        }

        this.onChangeBgm('bgm00');
    },


    /**
     *
     *
     * param    string  bgm_code
     */
    onChangeBgm: function(bgm_code)
    {
        var class_elements = this.audio_trigger_nodes[this.audio_main_code].className.split(' ');
        for (var i = 0; i < class_elements.length; i ++) {
            if (class_elements[i] == 'bgm_select_selected') {
                class_elements.splice(i, 1);
                this.audio_trigger_nodes[this.audio_main_code].className = class_elements.join(' ');
                break;
            }
        }

        this.stopBgm();
        this.audio_main_code = bgm_code;
        this.startBgm();

        this.audio_trigger_nodes[this.audio_main_code].className += ' ' + 'bgm_select_selected';
    },


    /**
     *
     *
     */
    startBgm: function()
    {
        this.operateBgm('start');
    },


    /**
     *
     *
     */
    restartBgm: function()
    {
        this.operateBgm('restart');
    },


    /**
     *
     *
     */
    pauseBgm: function()
    {
        this.operateBgm('pause');
    },


    /**
     *
     *
     */
    stopBgm: function()
    {
        this.operateBgm('stop');
    },


    /**
     *
     *
     */
    operateBgm: function(operate)
    {
        if (this.audio_main_code == 'bgm00') {
            return
        }

        var audio_main_node = this.audio_nodes[this.audio_main_code];

        switch (operate) {
            case 'start':
                audio_main_node.currentTime = 0;
            case 'restart':
                audio_main_node.play();
                break;
            case 'pause':
            case 'stop':
                audio_main_node.pause();
                break;
        }
    },


    /**
     *
     *
     */
    changeVolume: function(per)
    {
        var volume = Math.round(per * 10) / 10;
        switch (true) {
            case (volume < 0): volume = 0; break;
            case (volume > 1): volume = 1; break;
        }

        for (var i in this.audio_nodes) {
            this.audio_nodes[i].volume = volume;
        }
    }
};




/**
 * スクローラー
 *
 */
Audio_Scroller = function(){
};


Audio_Scroller.prototype = {
    audio:              null,


    bar_node:           null,


    bar_length:         null,
    bar_first_per:      0,


    client_pos:         0,
    client_min_pos:     0,
    client_max_pos:     null,
    bar_pos:            0,
    bar_max_pos:        null,


    _lock_bar:          true,
    _pre_cursor_pos:    null,




    /**
     * 設定
     *
     * @param   Object  params
     */
    init: function(params)
    {
        for (var i in params) {
            if (this[i] !== undefined) {
                this[i] = params[i];
            }
        }

        var bar_base_node   = this.bar_node.parentNode;
        var bar_base_length = bar_base_node.clientWidth;

        this.bar_length          = this.bar_node.clientWidth;
        this.bar_max_pos         = bar_base_length - this.bar_length;
        this.bar_node.style.top  = '0px';
        this.bar_node.style.left = '0px';

        var ref = this;

        this.bar_node.onmousedown = function(event){
            ref._lock_bar = false;
            ref._pre_cursor_pos = event.clientX;
            this.style.backgroundColor = '#f8f8ff';
        };

        var document_func_move = document.onmousemove;
        document.onmousemove = function(event){
            var return_param = null;
            if (document_func_move) {
                return_param = document_func_move(event);
            }

            if (ref._lock_bar === false) {
                ref._scrollBar(event);
            }

            return return_param;
        };

        var document_func_up = document.onmouseup;
        document.onmouseup = function(event){
            var return_param = null;
            if (document_func_up) {
                return_param = document_func_up(event);
            }

            ref._lock_bar = true;
            if (ref.bar_node) {
                ref.bar_node.style.backgroundColor = '#ffffff';
            }

            return return_param;
        };

        if (this.bar_first_per > 0) {
            this._scrollBar(null, this.bar_first_per);
        }

        this._scrollBar(null, 0.8);
    },


    /**
     * スクロール(サイドバー)
     *
     * @param   MouseEvent  event
     * @param   int         specified_per
     */
    _scrollBar: function(event, specified_per)
    {
        if (specified_per) {
            this.bar_pos = Math.floor(this.bar_max_pos * specified_per);
        } else {
            var scroll_pos = parseInt(this.bar_node.style.left.replace(/px/, ''));
            this.bar_pos = scroll_pos + event.clientX - this._pre_cursor_pos;
        }
        if (this.bar_pos < 0)                   this.bar_pos = 0;
        if (this.bar_pos > this.bar_max_pos)    this.bar_pos = this.bar_max_pos;
        this.bar_node.style.left = this.bar_pos + 'px';

        var per = this.bar_pos / this.bar_max_pos;
        this.client_pos = Math.floor(this.client_min_pos * per);
        if (this.client_pos > 0)                    this.client_pos = 0;
        if (this.client_pos < this.client_min_pos)  this.client_pos = this.client_min_pos;

        if (event) this._pre_cursor_pos = event.clientX;

        this.audio.changeVolume(per);
    }
};
