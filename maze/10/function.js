var Signal = function(){
    this.init();
};
Signal.prototype = {
    node:    null,
    maze:    null,
    api_url: new String('http://zhen-xia.hayabusa-lab.jp/organism/maze/10/program.php'),


    init: function()
    {
        this.node = $('#signal').get(0);
        this.maze = $('#maze').get(0);

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
            success: function(labyrinth){
                ref.maze.innerHTML = labyrinth;
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
        this.sections   = $('#maze').get(0);

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




var Display = function(){
    this.init();
};
Display.prototype = {
    node:    null,
    display: null,
    cond:    false,


    init: function()
    {
        this.node    = $('#switch').get(0);
        this.display = $('#display').get(0);

        var ref = this;
        $(this.node).click(function(){
            ref.change();
        });
    },


    change: function()
    {
        switch(this.cond){
            case true:
                $(this.display).addClass('display_visible');
                $(this.display).removeClass('display_imvisible');
                this.cond = false;
                break;
            case false:
                $(this.display).removeClass('display_visible');
                $(this.display).addClass('display_imvisible');
                this.cond = true;
        }
    }
};
