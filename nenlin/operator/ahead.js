AheadObject = function(params)
{
  this.init(params);
};


AheadObject.prototype = {
  block_operator:  null,
  action_operator: null,

  side:    new Number(4),
  depth:   new Number(4),
  element: null,

  blocks:       new Array(),
  blocks_count: new Number(0),

  blocks_left: new Number(0),
  blocks_top:  new Number(0),

  displaying: true,


  init: function(params)
  {
    if (params != undefined) {
      for (var i in params) {
        this[i] = params[i];
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
    var max_lft = 0;
    var max_rgt = 0;
    var max_top = 0;
    var max_btm = 0;
    var element_width  = $(this.element).css('width').replace('px', '');
    var element_height = $(this.element).css('height').replace('px', '');
    this.blocks_count = block_object.blocks_count;
    for (var i = 0; i < this.blocks_count; i ++) {
      var position = block_object.aim_positions[block_object.aim][i];
      if (position.left < max_lft) {max_lft = position.left}
      if (position.left > max_rgt) {max_rgt = position.left}
      if (position.top  < max_top) {max_top = position.top}
      if (position.top  > max_top) {max_btm = position.top}
    }
    this.blocks_left = Math.floor((element_width-((max_rgt-max_lft+1)*this.block_operator.block_size))/2)-(max_lft*this.block_operator.block_size);
    this.blocks_top  = Math.floor((element_height-((max_btm-max_top+1)*this.block_operator.block_size))/2)-(max_top*this.block_operator.block_size);

    for (var i = 0; i < block_object.blocks_count; i ++) {
      if (this.blocks.length <= i) {
        this.buildBlock();
      }
      this.reflect(block_object, i);
      $(this.blocks[i]).removeClass();
      $(this.blocks[i]).addClass('block');
      $(this.blocks[i]).addClass(block_object.class_name);
      if (this.displaying == true) {
        $(this.blocks[i]).show();
      }
    }
    if (this.blocks.length > block_object.blocks_count) {
      for (var j = i+1; j < this.blocks.length; j ++) {
        $(this.blocks[j]).hide();
      }
    }
  },


  hideAnnouncer: function()
  {
    if (this.action_operator.startProcess('hide') == false) {
      return;
    }

    switch (this.displaying) {
      case true:
        for (var i = 0; i < this.blocks_count; i ++) {
          $(this.blocks[i]).hide();
        }
        this.displaying = false;
        break;
      case false:
        for (var i = 0; i < this.blocks_count; i ++) {
          $(this.blocks[i]).show();
        }
        this.displaying = true;
        break;
    }

    this.operator.action_operator.endProcess('hide');
  },


  reflect: function(block_object, number)
  {
    var position = block_object.aim_positions[block_object.aim][number];
    $(this.blocks[number]).css('left', (this.blocks_left+(position.left*block_object.block_size)));
    $(this.blocks[number]).css('top',  (this.blocks_top +(position.top *block_object.block_size)));
  }
};
