/**
 * マップ実体
 *
 * @param   object  frame_node
 */
var Map = function(frame_node)
{
    this.frame_node = frame_node;
};


Map.prototype = {
    image_base_src: 'http://mt1.google.com/vt/lyrs=m@183000000&hl=ja&src=app&x=__X__&s=&y=__Y__&z=17&s=G',
    image_base_X:   new Number(116381),
    image_base_Y:   new Number(51602),
    image_target_X: new Number(116401),
    image_target_Y: new Number(51614),
    image_metre:    new Number(248),
    image_nodes: {
        A: {},
        B: {}
    },
    map_M: 'A',
    map_S: 'B',
    pos_T: 0,
    pos_L: 0,


    region_limit:   new Number(7),
    region_size:    new Number(256),
    frame_size:     new Number(),
    pos_region_Y:   null,
    pos_region_X:   null,
    display_W:      new Number(),
    display_H:      new Number(),


    map_nodes: {
        A: null,
        B: null
    },


    /**
     * 依存オブジェクト
     *
     */
    depends: new Array(
        'player'
    ),




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

        this.frame_size     = this.region_size * this.region_limit;
        this.display_W      = new Number($(this.frame_node).css('width').replace(/px/, ''));
        this.display_H      = new Number($(this.frame_node).css('height').replace(/px/, ''));
        this.pos_region_X   = Math.floor((this.display_W - this.frame_size) / 2);
        this.pos_region_Y   = Math.floor((this.display_H - this.frame_size) / 2);

        var region_center = Math.ceil(this.region_limit / 2);
        for(var map_key in this.map_nodes){
            var map_node    = document.getElementById('CA02_' + map_key);
            var map_frame   = map_node.parentNode;
            var map_context = map_node.getContext('2d');
            $(map_frame).css('width',   this.frame_size + 'px');
            $(map_frame).css('height',  this.frame_size + 'px');
            $(map_frame).css('z-index', (map_key == this.map_M) ? 2 : 1);
            this.map_nodes[map_key] = {
                canvas: map_node,
                context: map_context
            };
        }

        for(var Y = 1; Y <= this.region_limit; Y ++){
            var image_Y = this.image_base_Y - region_center + Y;
            for(var X = 1; X <= this.region_limit; X ++){
                var image_X = this.image_base_X - region_center + X;

                var image_node = new Image();
                var image_src = this.image_base_src;
                image_src = image_src.replace(/__Y__/, image_Y);
                image_src = image_src.replace(/__X__/, image_X);
                image_node.src = image_src;
                var pos_Y = (Y - 1) * this.region_size;
                var pos_X = (X - 1) * this.region_size;
                this.map_nodes[this.map_M].context.setTransform(1, 0, 0, 1, 0, 0);
                this.map_nodes[this.map_M].context.translate(pos_X, pos_Y);
                this.map_nodes[this.map_M].context.drawImage(image_node, 0, 0);
                this.image_nodes[this.map_M][Y + '_' + X] = image_node;
            }
        }
$(this.map_nodes['A'].canvas.parentNode).css('background-color', '#ff0000');
$(this.map_nodes['B'].canvas.parentNode).css('background-color', '#0000ff');
    },


    /**
     *
     *
     *
     */
    execute: function()
    {
        var speed = this.player.getSpeed();
        this.pos_T += Math.cos(this.player.pos.S) * 2 * speed;
        this.pos_L -= Math.sin(this.player.pos.S) * 2 * speed;

        switch(true){
            case (this.pos_T >= this.region_size *  1): this.reload('T'); break;
            case (this.pos_T <= this.region_size * -1): this.reload('B'); break;
            case (this.pos_L >= this.region_size *  1): this.reload('L'); break;
            case (this.pos_L <= this.region_size * -1): this.reload('R'); break;
            default:
                var map_frame = this.map_nodes[this.map_M].canvas.parentNode;
                $(map_frame).css('top',     Math.floor(this.pos_region_Y + this.pos_T) + 'px');
                $(map_frame).css('left',    Math.floor(this.pos_region_X + this.pos_L) + 'px');
                break;
        }
    },


    /**
     *
     *
     * @param   string  aim
     */
    reload: function(aim)
    {
        switch(this.map_M){
            case 'A': this.map_M = 'B'; this.map_S = 'A'; break;
            case 'B': this.map_M = 'A'; this.map_S = 'B'; break;
        }

        switch(aim){
            case 'T': this.image_base_Y --; this.pos_T -= this.region_size * 1; break;
            case 'R': this.image_base_X ++; this.pos_L += this.region_size * 1; break;
            case 'B': this.image_base_Y ++; this.pos_T += this.region_size * 1; break;
            case 'L': this.image_base_X --; this.pos_L -= this.region_size * 1; break;
        }

        var map_node_M      = this.map_nodes[this.map_M];
        var map_node_S      = this.map_nodes[this.map_S];
        var image_node_M    = this.image_nodes[this.map_M];
        var image_node_S    = this.image_nodes[this.map_S];
        var region_center   = Math.ceil(this.region_limit / 2);
        map_node_M.context.setTransform(1, 0, 0, 1, 0, 0);
        map_node_M.context.clearRect(0, 0, map_node_M.canvas.width, map_node_M.canvas.height);

        for(var Y = 1; Y <= this.region_limit; Y ++){
            var image_Y = this.image_base_Y - region_center + Y;
            for(var X = 1; X <= this.region_limit; X ++){
                var image_X = this.image_base_X - region_center + X;

                switch(true){
                    case (aim == 'T' && Y > 1):                 var image_node = image_node_S[(Y - 1) + '_' + X]; break;
                    case (aim == 'R' && X < this.region_limit): var image_node = image_node_S[Y + '_' + (X + 1)]; break;
                    case (aim == 'B' && Y < this.region_limit): var image_node = image_node_S[(Y + 1) + '_' + X]; break;
                    case (aim == 'L' && X > 1):                 var image_node = image_node_S[Y + '_' + (X - 1)]; break;
                    default:
                        switch(aim){
                            case 'T': var image_node = image_node_S[this.region_limit + '_' + X];   break;
                            case 'R': var image_node = image_node_S[Y + '_' + 1];                   break;
                            case 'B': var image_node = image_node_S[1 + '_' + X];                   break;
                            case 'L': var image_node = image_node_S[Y + '_' + this.region_limit];   break;
                        }
                        var image_src = this.image_base_src;
                        image_src = image_src.replace(/__Y__/, image_Y);
                        image_src = image_src.replace(/__X__/, image_X);
                        image_node.src = image_src;
                        break;
                }
                this.image_nodes[this.map_M][Y + '_' + X] = image_node;

                var pos_Y = (Y - 1) * this.region_size;
                var pos_X = (X - 1) * this.region_size;
                map_node_M.context.setTransform(1, 0, 0, 1, 0, 0);
                map_node_M.context.translate(pos_X, pos_Y);
//map_node_M.context.globalAlpha = 0.8;
                map_node_M.context.drawImage(image_node, 0, 0);
            }
        }

        $(map_node_M.canvas.parentNode).css('top',   Math.floor(this.pos_region_Y + this.pos_T) + 'px');
        $(map_node_M.canvas.parentNode).css('left',  Math.floor(this.pos_region_X + this.pos_L) + 'px');
        $(map_node_M.canvas.parentNode).css('z-index', 2);
        $(map_node_S.canvas.parentNode).css('z-index', 1);
    }
};
