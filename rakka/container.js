ContainerObject = function(params)
{
    this.init(params);
};


ContainerObject.prototype = {
    block_operator: null,
    calculater:     null,

    side:    new Number(15),
    depth:   new Number(20),
    element: null,

    hangar: new Array(),
    blocks: new Array(),


    init: function(params)
    {
        if (params != undefined) {
            for (var i in params) {
                this[i] = params[i];
            }
        }
    },


    buildHangar: function()
    {
        var reviser = document.createElement('div');
        $(reviser).attr('id', 'reviser');
        $(reviser).css('width', (this.block_operator.block_size*this.side)+'px');
        $(reviser).css('height', '0px');
        this.element.appendChild(reviser);

        var rows = new Array();
        for (var r = 0; r < this.depth; r ++) {
            this.hangar[r] = new Array();
            rows[r] = document.createElement('ul');
            $(rows[r]).attr('id', ('pits_'+r));
            this.element.appendChild(rows[r]);
            for (var c = 0; c < this.side; c ++) {
                this.hangar[r][c] = {
                    condition: new Number(0),
                    element:   document.createElement('li')
                };
                $(this.hangar[r][c].element).addClass('pit');
                $(this.hangar[r][c].element).css('width',  this.block_operator.block_size+'px');
                $(this.hangar[r][c].element).css('height', this.block_operator.block_size+'px');
                rows[r].appendChild(this.hangar[r][c].element);
            }
        }
    },


    buildBlock: function()
    {
        var block_number = this.blocks.length;
        this.blocks[block_number] = document.createElement('div');
        $(this.blocks[block_number]).addClass('block');
        this.element.appendChild(this.blocks[block_number]);
    },


    setBlocks: function(block_object)
    {
        block_object.blocks_left = Math.floor(this.side/2);
        block_object.blocks_top  = 3;

        for (var i = 0; i < block_object.blocks_count; i ++) {
            if (this.blocks.length <= i) {
                this.buildBlock();
            }
            this.reflect(block_object, i);
            $(this.blocks[i]).removeClass();
            $(this.blocks[i]).addClass('block');
            $(this.blocks[i]).addClass(block_object.class_name);
            $(this.blocks[i]).show();
        }
        if (this.blocks.length > block_object.blocks_count) {
            for (var j = i+1; j < this.blocks.length; j ++) {
                $(this.blocks[j]).hide();
            }
        }
    },


    reflect: function(block_object, number)
    {
        var position = block_object.aim_positions[block_object.aim][number];
        $(this.blocks[number]).css('left', (block_object.blocks_left+position.left)*block_object.block_size);
        $(this.blocks[number]).css('top',  (block_object.blocks_top +position.top) *block_object.block_size);
    },


    isExistable: function(block_object)
    {
        for (var i = 0; i < block_object.blocks_count; i ++) {
            var position = block_object.aim_positions[block_object.aim][i];
            var pos_left = block_object.blocks_left+position.left;
            var pos_top  = block_object.blocks_top +position.top;
            if (this.hangar[pos_top] == undefined) {
                return false;
            }
            if (this.hangar[pos_top][pos_left] == undefined) {
                return false;
            }
            if (this.hangar[pos_top][pos_left].condition != 0) {
                return false;
            }
        }

        return true;
    },


    reachBlocks: function(block_object)
    {
        var aligned_rows  = new Array();
        for (var i = 0; i < block_object.blocks_count; i ++) {
            var position = block_object.aim_positions[block_object.aim][i];
            var pos_left = block_object.blocks_left+position.left;
            var pos_top  = block_object.blocks_top +position.top;
            this.hangar[pos_top][pos_left].condition = 1;
            $(this.hangar[pos_top][pos_left].element).removeClass();
            $(this.hangar[pos_top][pos_left].element).addClass('pit');
            $(this.hangar[pos_top][pos_left].element).addClass(block_object.class_name);

            // 列にブロックが揃ったかの判断
            for (var c = 0; c < this.side; c ++) {
                if (this.hangar[pos_top][c].condition == 0) {
                    break;
                }
                if (c+1 == this.hangar[pos_top].length) {
                    aligned_rows.push(pos_top);
                }
            }
        }

        if (aligned_rows.length > 0) {
            this.processWhenAligned(aligned_rows);
        }
    },


    processWhenAligned: function(aligned_rows)
    {
        this.block_operator.action_operator.pause();

        this.calculater.calculate(aligned_rows.length);

        var params = {aligned_rows: aligned_rows};
        this.executeAnimate(params);

        this.block_operator.action_operator.pause();
    },


    preAnimate: function(params)
    {
        // ブロックの揃った列の情報を格納する配列の文字列化
        params.rows_chained = new String('|');
        for (var i = 0; i < params.aligned_rows.length; i ++) {
            params.rows_chained += params.aligned_rows[i]+'|';
        }

        return params;
    },


    executeAnimate: function(params)
    {
        params = this.preAnimate(params);

        params.rows_regexp = params.rows_chained;

        params.rows_regexp = params.rows_regexp.replace(/\|$/g, ' li');
        params.rows_regexp = params.rows_regexp.replace(/\|/g, ' li, #pits_');
        params.rows_regexp = params.rows_regexp.replace(/^ li, /g, '');

        var ref = this;
        var shrinking = this.block_operator.block_size;
        var animation = setInterval(function(){
            shrinking --;
            $(params.rows_regexp).css('height', shrinking+'px');
            $('#reviser').css('height', (params.aligned_rows.length*(ref.block_operator.block_size-shrinking))+'px');

            if (shrinking <= 0) {
                clearInterval(animation);
                ref.postAnimate(params);
                return params;
            }
        }, 10);
    },


    postAnimate: function(params)
    {
        $('#reviser').css('height', '0px');
        $(params.rows_regexp).css('height', (this.block_operator.block_size)+'px');

        var slide = new Number(0);

        for (var r = this.depth-1; r >= 0; r --) {
            for (var i = slide; i <= params.aligned_rows.length; i ++) {
                slide = i;
                if (this.hangar[r-i] == undefined) {
                    break;
                }
                if (params.rows_chained.indexOf('|'+(r-i)+'|') < 0) {
                    break;
                }
            }

            if (slide > 0) {
                for (var c = 0; c < this.side; c ++) {
                    $(this.hangar[r][c].element).removeClass();
                    $(this.hangar[r][c].element).addClass('pit');
                    if (r-slide >= 0) {
                        this.hangar[r][c].condition = this.hangar[r-slide][c].condition;
                        $(this.hangar[r][c].element).addClass($(this.hangar[r-slide][c].element).attr('class'));
                    } else {
                        this.hangar[r][c].condition = 0;
                    }
                }
            }
        }
    }
};
