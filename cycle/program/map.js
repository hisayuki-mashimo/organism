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
    image_material: null,
    image_W:        new Number(1000),
    image_H:        new Number(300),
    image_CX:       new Number(),
    image_CY:       new Number(),
    image_horizon:  new Number(200),
    pos:            new Number(0),
    pos_base:       new Number(0),


    display_W:      new Number(600),
    display_H:      new Number(300),


    map_node:       null,


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
        if (params != undefined) {
            for (var i in params) {
                if (this[i] !== undefined) {
                    this[i] = params[i];
                }
            }
        }

        var map_node    = document.getElementById('CA02');
        var map_frame   = map_node.parentNode;
        var map_context = map_node.getContext('2d');
        $(map_frame).css('width',   this.display_W + 'px');
        $(map_frame).css('height',  this.display_H + 'px');
        this.map_node = {
            canvas: map_node,
            context: map_context
        };

        var ref = this;

        this.image_node = new Image();
        this.image_node.src = this.getImagePath();
        this.image_node.onload = function(){
            for (var i = 0; i < 3; i ++) {
                ref.map_node.context.setTransform(1, 0, 0, 1, 0, 0);
                ref.map_node.context.translate(ref.image_W * i, 0);
                ref.map_node.context.drawImage(ref.image_node, 0, 0);
            }
        };

        this.pos_base = ((this.image_W * 3 / 2) - (this.display_W / 2)) * -1;
    },


    /**
     *
     *
     *
     */
    execute: function()
    {
        switch (this.player.direction) {
            case 'L': this.pos += 2; break;
            case 'R': this.pos -= 2; break;
        }

        switch (true) {
            case (this.pos < this.image_W * -1): this.pos += this.image_W; break;
            case (this.pos > this.image_W):      this.pos -= this.image_W; break;
        }

        $(this.map_node.canvas.parentNode).css('left', (this.pos_base + this.pos) + 'px');
    },


    /**
     * 
     *
     */
    getImagePath :function()
    {
        return 'resource/map.png';
    },
};
