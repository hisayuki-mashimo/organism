var Signal = function(){
    this.init();
};
Signal.prototype = {
    api_url:   new String('http://zhen-xia02.hayabusa-lab.jp/organism/maze/20/labyrinth_test.php'),
    node:      null,
    maze:      null,
    log:       null,
    operate:   null,
    memory:    null,
    debug:     null,
    navigator: null,


    init: function()
    {
        this.node      = $('#signal').get(0);
        this.maze      = $('#maze').get(0);
        this.log       = $('#log').get(0);
        this.debug     = $('#debug').get(0);
        this.operate   = document.params;
        this.memory    = new Memory();
        this.navigator = new Navigator();
        this.navigator.maze = this.maze;

        var ref = this;
        $(this.node).click(function(){
            ref.connect();
        });
    },


    connect: function()
    {
        var params = {
            'region_y':       this.operate.region_y.value,
            'region_x':       this.operate.region_x.value,
            'unit_size':      this.operate.unit_size.value,
            'room_count':     this.operate.room_count.value,
            'room_side_max':  this.operate.room_side_max.value,
            'room_area_disp': this.operate.room_area_disp.value
        };

        var ref = this;
        $.ajax({
            url:     ref.api_url + '?rand=' + Math.random(),
            type:    'post',
            data:    params,
            success: function(result){
                var labyrinth = result.split('#|#');
                ref.maze.innerHTML  = labyrinth[1];
                ref.log.innerHTML   = labyrinth[2];
                ref.debug.innerHTML = labyrinth[0].replace(/---$/, '');

                ref.navigator.configure(params);

                if(labyrinth[3] == 'T'){
                    ref.memory.connect();
                }
            }
        });
    }
};




var Navigator = function(){
};
Navigator.prototype = {
    maze:         null,
    absolute_top: null,
    absolute_lft: null,


    configure: function(params)
    {
        var ref            = this;
        var length_unit    = params.unit_size * 15;
        var ver_length     = (params.region_y * length_unit) + 1;
        var nex_length     = (params.region_x * length_unit) + 1;
        var absolute_param = $(this.maze).offset();
        var sect_count_ver = params.region_y * params.unit_size;
        var sect_count_nex = params.region_x * params.unit_size;

        this.absolute_top = absolute_param.top + 15;
        this.absolute_lft = absolute_param.left + 15;

        for(var i = 0; i <= sect_count_ver; i ++){
            var border_node = document.createElement('div');
            $(border_node).css('position', 'absolute');
            $(border_node).css('top', (this.absolute_top + (15 * i)) + 'px');
            $(border_node).css('left', this.absolute_lft + 'px');
            $(border_node).css('width', nex_length + 'px');
            $(border_node).css('height', '1px');
            $(border_node).css('background-color', '#4488CC');
            $(border_node).css('opacity', '0.2');
            $(border_node).css('font-size', '0px');
            $(border_node).css('overflow', 'hidden');
            $(border_node).text('　');
            this.maze.appendChild(border_node);
        }
        for(var i = 0; i <= sect_count_nex; i ++){
            var border_node = document.createElement('div');
            $(border_node).css('position', 'absolute');
            $(border_node).css('top', this.absolute_top + 'px');
            $(border_node).css('left', (this.absolute_lft + (15 * i)) + 'px');
            $(border_node).css('width', '1px');
            $(border_node).css('height', ver_length + 'px');
            $(border_node).css('background-color', '#4488CC');
            $(border_node).css('opacity', '0.2');
            $(border_node).css('font-size', '0px');
            $(border_node).css('overflow', 'hidden');
            $(border_node).text('　');
            this.maze.appendChild(border_node);
        }

        for(var i = 0; i < (params.region_y - 1); i ++){
            var border_node = document.createElement('div');
            $(border_node).css('position', 'absolute');
            $(border_node).css('top', (this.absolute_top + (length_unit * (i + 1))) + 'px');
            $(border_node).css('left', this.absolute_lft + 'px');
            $(border_node).css('width', nex_length + 'px');
            $(border_node).css('height', '1px');
            $(border_node).css('background-color', '#FF0044');
            $(border_node).css('opacity', '0.2');
            $(border_node).css('font-size', '0px');
            $(border_node).css('overflow', 'hidden');
            $(border_node).text('　');
            this.maze.appendChild(border_node);
        }
        for(var i = 0; i < (params.region_x - 1); i ++){
            var border_node = document.createElement('div');
            $(border_node).css('position', 'absolute');
            $(border_node).css('top', this.absolute_top + 'px');
            $(border_node).css('left', (this.absolute_lft + (length_unit * (i + 1))) + 'px');
            $(border_node).css('width', '1px');
            $(border_node).css('height', ver_length + 'px');
            $(border_node).css('background-color', '#FF0044');
            $(border_node).css('opacity', '0.2');
            $(border_node).css('font-size', '0px');
            $(border_node).css('overflow', 'hidden');
            $(border_node).text('　');
            this.maze.appendChild(border_node);
        }

        var gauze_node = document.createElement('div');
        $(gauze_node).css('position', 'absolute');
        $(gauze_node).css('top', this.absolute_top + 'px');
        $(gauze_node).css('left', this.absolute_lft + 'px');
        $(gauze_node).css('width', nex_length + 'px');
        $(gauze_node).css('height', ver_length + 'px');
        $(gauze_node).css('font-size', '0px');
        $(gauze_node).css('overflow', 'hidden');
        $(gauze_node).css('cursor', 'pointer');
        $(gauze_node).css('background-color', '#000000');
        $(gauze_node).css('opacity', '0.0');
        $(gauze_node).text('　');
        this.maze.appendChild(gauze_node);

        $(gauze_node).mousedown(function(event){
            ref.changeNavigate(event);
        });
    },


    changeNavigate: function(event)
    {
        $(this.maze).find('.navigated').removeClass('navigated');

        //var id_ver = Math.floor((event.clientY - this.absolute_top) / 15);
        //var id_nex = Math.floor((event.clientX - this.absolute_lft) / 15);
        var id_ver = Math.floor((event.pageY - this.absolute_top) / 15);
        var id_nex = Math.floor((event.pageX - this.absolute_lft) / 15);
        $(this.maze).find("div[id^='sect_" + id_ver + "_']").addClass('navigated');
        $(this.maze).find("div[id$='_" + id_nex + "']").addClass('navigated');
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
    operate_switch: null,
    operate_node:   null,
    operate_cond:   false,


    init: function()
    {
        this.display_switch = document.getElementById('display_switch');
        this.display_node   = document.getElementById('display');

        this.operate_switch = document.getElementById('operate_switch');
        this.operate_node   = document.getElementById('operate');

        var ref = this;
        //$(this.display_switch).click(function(){ ref.change('display'); });
        //$(this.operate_switch).click(function(){ ref.change('operate'); });
    },


    change: function(switch_type)
    {
        switch(switch_type){
            case 'display':
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
                break;
            case 'operate':
                switch(this.operate_cond){
                    case true:
                        $(this.operate_node).addClass('operate_visible');
                        $(this.operate_node).removeClass('operate_imvisible');
                        this.operate_cond = false;
                        break;
                    case false:
                        $(this.operate_node).removeClass('operate_visible');
                        $(this.operate_node).addClass('operate_imvisible');
                        this.operate_cond = true;
                }
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




var Memory = function(){
    this.init();
};
Memory.prototype = {
    node:         null,
    maze:         null,
    log:          null,
    api_url:      new String('http://zhen-xia02.hayabusa-lab.jp/organism/maze/20/log.php'),
    api_url_maze: new String('http://zhen-xia02.hayabusa-lab.jp/organism/maze/20/labyrinth_test.php'),


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
        var ref    = this;
        var params = {
            'region_y':  document.params.region_y.value,
            'region_x':  document.params.region_x.value,
            'unit_size': document.params.unit_size.value
        };

        $.ajax({
            url:     ref.api_url + '?rand=' + Math.random(),
            type:    'post',
            data:    {'maze': ref.maze.innerHTML, 'log': ref.log.innerHTML, 'params': params},
            success: function(result){
                
            }
        });
        $.ajax({
            url:     ref.api_url_maze + '?error=1&rand=' + Math.random(),
            type:    'get',
            success: function(result){
                $("#exe_count").text('0');
            }
        });
    }
};
