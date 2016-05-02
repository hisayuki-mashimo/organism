var Signal = function(){
    this.init();
};
Signal.prototype = {
    node:    null,
    maze:    null,
    api_url: new String('http://zhen-xia.hayabusa-lab.jp/organism/maze/T1/program.php'),


    init: function()
    {
        this.node = $('#signal').get(0);
        this.maze = $('#maze').get(0);
        this.log  = $('#log').get(0);

        var ref = this;
        $(this.node).click(function(){
            ref.connect();
        });
    },


    connect: function()
    {
        var ref = this;
        $.ajax({
            url:     ref.api_url + '?rand=' + Math.random(),
            type:    'post',
            success: function(result){
                var labyrinth = result.split('#|#');
                ref.maze.innerHTML = labyrinth[0];
                ref.log.innerHTML  = labyrinth[1];
            }
        });
    }
};




var Meter = function(params){
    this.init(params);
};
Meter.prototype = {
    node:       null,
    sections:   null,
    node_left:  new Number(),
    node_width: new Number(),
    gauge:      new Number(1),
    lock:       true,


    init: function($params)
    {
        this.node       = $('#meter').get(0);
        this.node_left  = $(this.node).offset().left;
        this.node_width = $(this.node).attr('offsetWidth');
        this.sections   = $('#contents').get(0);

        var ref = this;
        $(this.node).mousedown(
            function(event){
                ref.lock = false;
                ref.slide(event);
            }
        );
        $(document).mousemove(
            function(event){
                ref.slide(event);
            }
        );
        $(document).mouseup(
            function(event){
                ref.lock = true;
            }
        );
    },


    slide: function(event)
    {
        if(this.lock == false){
            this.setTrimGauge(event.pageX - this.node_left);
            this.reflect();
        }
    },


    setTrimGauge: function(width)
    {
        gauge = (width / this.node_width) * 10;
        if(gauge > 10){
            this.gauge = 10;
        }
        else if(gauge < 0){
            this.gauge = 0;
        }
        else{
            this.gauge = Math.ceil(gauge);
        }
    },


    reflect: function(){
        var opacity_value = (this.gauge == 10) ? '1.0' : '0.' + (this.gauge);
        $(this.sections).css('opacity', opacity_value);
    }
};




var Switcher = function(){
    this.init();
};
Switcher.prototype = {
    display_switch: null,
    display_node:   null,
    display_cond:   false,


    init: function()
    {
        this.display_switch = document.getElementById('display_switch');
        this.display_node   = document.getElementById('display');

        var ref = this;
        $(this.display_switch).click(function(){ ref.change('display'); });
    },


    change: function()
    {
        switch(this.display_cond){
            case true:
                $(this.display_node).addClass('display_visible');
                $(this.display_node).removeClass('display_imvisible');
                this.display_cond = false;
                break;
            case false:
                $(this.display_node).removeClass('display_visible');
                $(this.display_node).addClass('display_imvisible');
                this.display_cond = true;
        }
    }
};




var Memory = function(){
    this.init();
};
Memory.prototype = {
    node:    null,
    maze:    null,
    log:     null,
    api_url: new String('http://zhen-xia.hayabusa-lab.jp/organism/maze/T1/log.php'),


    init: function()
    {
        this.node = $('#memory button').get(0);
        this.maze = $('#maze').get(0);
        this.log  = $('#log').get(0);

        var ref = this;
        $(this.node).click(function(){
            ref.connect();
            return false;
        });
    },


    connect: function()
    {
        var ref = this;
        $.ajax({
            url:     ref.api_url + '?rand=' + Math.random(),
            type:    'post',
            data:    {'maze': ref.maze.innerHTML, 'log': ref.log.innerHTML},
            success: function(result){
                
            }
        });
    }
};
