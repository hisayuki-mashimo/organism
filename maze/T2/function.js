var Navigator = function(){
    this.init();
};
Navigator.prototype = {
    maze: null,


    init: function()
    {
        this.maze = $('#maze').get(0);
    },


    configure: function(params)
    {
        var ref            = this;
        var length_unit    = params.rgon_side * 15;
        var ver_length     = (params.rgon_ver * length_unit) + 1;
        var nex_length     = (params.rgon_nex * length_unit) + 1;
        var absolute_param = $(this.maze).offset();
        for(var i = 0; i <= params.rgon_ver; i ++){
            var border_node = document.createElement('div');
            $(border_node).css('top',    (absolute_param.top  + 15 + (length_unit * i)) + 'px');
            $(border_node).css('left',   (absolute_param.left + 15) + 'px');
            $(border_node).css('width',  nex_length + 'px');
            $(border_node).css('height', '1px');
            $(border_node).addClass('navigate_border');
            $(border_node).text('　');
            this.maze.appendChild(border_node);
        }
        for(var i = 0; i <= params.rgon_nex; i ++){
            var border_node = document.createElement('div');
            $(border_node).css('top',    (absolute_param.top  + 15) + 'px');
            $(border_node).css('left',   (absolute_param.left + 15 + (length_unit * i)) + 'px');
            $(border_node).css('width',  '1px');
            $(border_node).css('height', ver_length + 'px');
            $(border_node).addClass('navigate_border');
            $(border_node).text('　');
            this.maze.appendChild(border_node);
        }

        var sect_ver = params.rgon_side * params.rgon_ver + 2;
        var sect_nex = params.rgon_side * params.rgon_nex + 1;
        for(var i = 0; i < sect_ver; i ++){
            var nav_node = document.createElement('div');
            $(nav_node).addClass('navigater_ver');
            this.maze.appendChild(nav_node);
        }
        for(var i = 0; i < sect_nex; i ++){
            var nav_node = document.createElement('div');
            $(nav_node).addClass('navigater_nex');
            this.maze.appendChild(nav_node);
        }

        $(document).mousedown(function(){
            $('.navigated').removeClass('navigated');
        });

        var alignment_node = document.createElement('div');
        $(alignment_node).css('position', 'absolute');
        $(alignment_node).css('top',      absolute_param.top);
        $(alignment_node).css('left',     absolute_param.left);
        $(alignment_node).css('width',    ((params.rgon_nex * length_unit) + 1));
        $(alignment_node).css('height',   ((params.rgon_ver * length_unit) + 1));
        $(alignment_node).text('　');
        $(alignment_node).mouseup(function(event){
            ref.changeNavigate(event);
        });
        this.maze.appendChild(alignment_node);
    },


    changeNavigate: function(event)
    {
        var absolute_param = $(this.maze).offset();
        var nav_nodes_ver = $('.navigater_ver');
        var nav_nodes_nex = $('.navigater_nex');
        var coord_ver = Math.floor((event.pageY - absolute_param.top)  / 15);
        var coord_nex = Math.floor((event.pageX - absolute_param.left) / 15);
        var navigated_top = absolute_param.top  + (coord_ver * 15) + 1;
        var navigated_lft = absolute_param.left + (coord_nex * 15) + 1;

        for(var i = 0; i < nav_nodes_ver.length; i ++){
            var nav_node = nav_nodes_ver[i];
            $(nav_node).css('top', (absolute_param.top + (15 * i) + 1) + 'px');
            $(nav_node).css('left', navigated_lft + 'px');
            $(nav_node).addClass('navigated');
        }
        for(var i = 0; i < nav_nodes_nex.length; i ++){
            var nav_node = nav_nodes_nex[i];
            $(nav_node).css('top', navigated_top + 'px');
            $(nav_node).css('left', (absolute_param.left + (15 * i) + 1 + ((i >= (coord_nex)) ? 15 : 0)) + 'px');
            $(nav_node).addClass('navigated');
        }
    }
};




var Controller = function(){
    this.init();
};
Controller.prototype = {
    maze: null,


    init: function()
    {
        this.maze = $('#maze').get(0);
    },


    configure: function(params)
    {
        var absolute_param = $(this.maze).offset();
        var absolute_top = absolute_param.top;
        var absolute_lft = absolute_param.left;
        var player_ver = absolute_top + (((new Number(params.player.ver)) + 1) * 15);
        var player_nex = absolute_lft + (((new Number(params.player.nex)) + 1) * 15);
        var player_node = document.createElement('div');
        $(player_node).css('position', 'absolute');
        $(player_node).css('top', player_ver + 'px');
        $(player_node).css('left', player_nex + 'px');
        $(player_node).css('width', '15px');
        $(player_node).css('height', '15px');
        $(player_node).css('font-size', '0px');
        $(player_node).css('background', 'url("./images/player_' + params.player.aim + '.png")');
        this.maze.appendChild(player_node);
    }
};


var Meter = function(params){
    this.init(params);
};
Meter.prototype = {
    node:       null,
    contents:   null,
    node_left:  new Number(),
    node_width: new Number(),
    gauge:      new Number(1),
    lock:       true,


    init: function(params)
    {
        this.node       = $('#meter').get(0);
        this.node_left  = $(this.node).offset().left;
        this.node_width = $(this.node).attr('offsetWidth');
        this.contents   = $('#contents');

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
        $(this.contents).css('opacity', opacity_value);
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
        $(this.display_switch).click(function(){
            ref.change('display');
        });
    },


    change: function(switch_type)
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




var Camouflager = function(){
    this.init();
};
Camouflager.prototype = {
    init: function(){
        $('td.title ul').css('visibility', 'hidden');
        $('td.value ul').css('visibility', 'hidden');
        $('tr').hover(
            function(){
                $(this).find('td.title ul').css('visibility', 'visible');
                $(this).find('td.value ul').css('visibility', 'visible');
            },
            function(){
                $(this).find('td.title ul').css('visibility', 'hidden');
                $(this).find('td.value ul').css('visibility', 'hidden');
            }
        );
    }
};
