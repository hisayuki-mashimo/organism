var Camouflager = function(params){
    this.configure(params);
};
Camouflager.prototype = {
    meter_node:     null,
    meter_X:        new Number(),
    meter_W:        new Number(),
    back_node:      null,
    back_hider:     null,
    back_switch:    true,
    back_url:       null,
    back_color:     null,
    contents_node:  null,
    gauge:          new Number(1),
    lock:           true,


    configure: function(params)
    {
        try {
            switch (true) {
                case (params.meter !== undefined):
                    this.meter_node = params.meter;
                    break;
                case (params.meter_id !== undefined):
                    this.meter_node = document.getElementById(params.meter_id);
                    break;
                default:
                    throw 'not-set-meter-node.';
            }

            switch (true) {
                case (params.contents !== undefined):
                    this.contents_node = params.contents;
                    break;
                case (params.contents_id !== undefined):
                    this.contents_node = document.getElementById(params.contents_id);
                    break;
                default:
                    throw 'not-set-contents-node.';
            }

            switch (true) {
                case (params.back !== undefined):
                    this.back_node = params.back;
                    break;
                case (params.back_id !== undefined):
                    this.back_node = document.getElementById(params.back_id);
                    break;
            }
            if (this.back_node !== null) {
                switch (true) {
                    case (params.back_hider !== undefined):
                        this.back_hider = params.back_hider;
                        break;
                    case (params.back_hider_id !== undefined):
                        this.back_hider = document.getElementById(params.back_hider_id);
                        break;
                    default:
                        throw 'not-set-back-hider-node.';
                }
                this.back_url   = params.back_url;
                this.back_color = params.back_color;
            }
        } catch (E) {
            alert(E);
        }

        this.meter_X = $(this.meter_node).offset().left;
        this.meter_W = $(this.meter_node).width();

        var ref = this;

        $(this.meter_node).mousedown(function(event){
            ref.lock = false;
            ref.slide(event);
        });
        $(document).mousemove(function(event){
            ref.slide(event);
        });
        $(document).mouseup(function(event){
            ref.lock = true;
        });

        $(this.back_hider).mousedown(function(event){
            ref.hide();
        });
    },


    slide: function(event)
    {
        if(this.lock == false){
            this.setTrimGauge(event.clientX - this.meter_X);
            this.reflect();
        }
    },


    setTrimGauge: function(width)
    {
        gauge = (width / this.meter_W) * 10;
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


    reflect: function()
    {
        var opacity_value = (this.gauge == 10) ? '1.0' : '0.' + (this.gauge);
        $(this.contents_node).css('opacity', opacity_value);
    },


    hide: function()
    {
        if (this.back_switch === true) {
            this.back_switch = false;
            $(this.back_node).css('background', 'url("' + this.back_url + '")');
        } else {
            this.back_switch = true;
            $(this.back_node).css('background', 'none');
            $(this.back_node).css('background-color', this.back_color);
        }
    }
};
