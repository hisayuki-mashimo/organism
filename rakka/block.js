BlockOperator = function(params)
{
  this.init(params);
};


BlockOperator.prototype = {
  container:       null,
  ahead:           null,
  action_operator: null,

  block_size: new Number(10),

  object_params:  new Array(),
  waiting_object: null,
  active_object:  null,


  init: function(params)
  {
    if (params != undefined) {
      for (var i in params) {
        this[i] = params[i];
      }
    }

    this.waiting_object = new BlocksObject({
      operator:   this,
      block_size: this.block_size
    });
    this.active_object = new BlocksObject({
      operator:   this,
      block_size: this.block_size
    });

    this.container.block_operator = this;
    this.ahead.block_operator     = this;
  },


  setObjectParam: function(param)
  {
    this.object_params[this.object_params.length] = param;
  },


  prepareObject: function()
  {
    var rand_number = Math.round(Math.random()*(this.object_params.length-1));
    var block_param = this.object_params[rand_number];
    this.waiting_object.initParams(block_param);
    this.waiting_object.instantAimPositions();
    this.ahead.setBlocks(this.waiting_object);
  },


  instantObject: function()
  {
    this.active_object.aim         = this.waiting_object.aim;
    this.active_object.aim_count   = this.waiting_object.aim_count;
    this.active_object.aim_element = this.waiting_object.aim_element;
    this.active_object.class_name  = this.waiting_object.class_name;
    this.active_object.instantAimPositions();
    this.container.setBlocks(this.active_object);

    return this.container.isExistable(this.active_object);
  }
};




BlocksObject = function(params)
{
  this.init(params);
};


BlocksObject.prototype = {
  operator: null,

  aim_element:   new String(),
  aim_positions: new Array(),
  aim:           new Number(0),
  aim_count:     new Number(1),

  blocks_count: new Number(4),
  blocks_left:  new Number(0),
  blocks_top:   new Number(0),
  block_size:   new Number(10),

  class_name:   new String(),


  init: function(params)
  {
    for (var i in params) {
      this[i] = params[i];
    }
  },


  initParams: function(params)
  {
    for (var i in params) {
      switch (i) {
        case 'formation':
          this.setAimPositions(params[i], params.aim_count);
          break;
        default:
          this[i] = params[i];
      }
    }

    this.aim          = Math.round(Math.random()*(this.aim_count-1));
    this.blocks_count = params.formation.length;
  },


  setAimPositions: function(aim_positions_base, aim_count)
  {
    /*this.aim_count = aim_count;
    var aim_positions = new Array(aim_positions_base);
    for (var i = 1; i < this.aim_count; i ++) {
      aim_positions[i] = new Array();
      for (var j = 0; j < aim_positions_base.length; j ++) {
        var pre_left = aim_positions[i-1][j].left;
        var pre_top  = aim_positions[i-1][j].top;
        aim_positions[i][j] = {
          left: pre_top,
          top:  pre_left*(-1)
        };
      }
    }
    this.aim_positions = aim_positions;
    this.aim_element = JSON.stringify(this.aim_positions);*/
    this.aim_count = aim_count;
    var aim_positions = new Array(aim_positions_base);

    this.aim_element  = '[';
    this.aim_element +=   '[';
    for (var i = 0; i < aim_positions_base.length; i ++) {
      var isnot_last = (i+1 < aim_positions_base.length) ? ', ' : '';
      this.aim_element +=   '{"left": '+aim_positions_base[i].left+', "top": '+aim_positions_base[i].top+'}'+isnot_last;
    }
    this.aim_element +=   '], ';

    for (var i = 1; i < this.aim_count; i ++) {
      this.aim_element += '[';
      aim_positions[i] = new Array();
      for (var j = 0; j < aim_positions_base.length; j ++) {
        var pre_left = aim_positions[i-1][j].left;
        var pre_top  = aim_positions[i-1][j].top;
        aim_positions[i][j] = {
          left: pre_top,
          top:  pre_left*(-1)
        };
        var isnot_last = (j+1 < aim_positions_base.length) ? ', ' : '';
        this.aim_element += '{"left": '+pre_top+', "top": '+(pre_left*(-1))+'}'+isnot_last;
      }
      var isnot_last = (i+1 < this.aim_count) ? ', ' : '';
      this.aim_element += ']'+isnot_last;
    }
    this.aim_element += ']';
    this.aim_positions = aim_positions;
  },


  instantAimPositions: function()
  {
    this.aim_positions = eval(this.aim_element);
  },


  fall: function()
  {
    if (this.operator.action_operator.startProcess('fall') == false) {
      return;
    }

    this.blocks_top ++;
    if (this.operator.container.isExistable(this) === false) {
      this.blocks_top --;
      this.operator.container.reachBlocks(this);
      this.operator.action_operator.updateProcess();
    } else {
      for (var i = 0; i < this.blocks_count; i ++) {
        this.operator.container.reflect(this, i);
      }
    }

    this.operator.action_operator.endProcess('fall');
  },


  drop: function()
  {
    if (this.operator.action_operator.startProcess('drop') == false) {
      return;
    }

    var floating = true;
    while (floating == true) {
      this.blocks_top ++;
      if (this.operator.container.isExistable(this) === false) {
        this.blocks_top --;
        floating = false;
      }
    }

    this.operator.container.reachBlocks(this);
    this.operator.action_operator.updateProcess();

    this.operator.action_operator.endProcess('drop');
  },


  slide: function(revolution)
  {
    if (this.operator.action_operator.startProcess('slide') == false) {
      return;
    }

    switch (revolution) {
      case 'left':  var sliding_value = new Number(-1); break;
      case 'right': var sliding_value = new Number(1);  break;
    }
    this.blocks_left += sliding_value;
    if (this.operator.container.isExistable(this) === false) {
      this.blocks_left -= sliding_value;
    } else {
      for (var i = 0; i < this.blocks_count; i ++) {
        this.operator.container.reflect(this, i);
      }
    }

    this.operator.action_operator.endProcess('slide');
  },


  rotate: function(revolution)
  {
    if (this.operator.action_operator.startProcess('rotate') == false) {
      return;
    }

    var pre_aim = this.aim;

    switch (revolution) {
      case 'left':
        this.aim --;
        if (this.aim < 0) {
          this.aim = this.aim_count-1;
        }
        break;
      case 'right':
        this.aim ++;
        if (this.aim >= this.aim_count) {
          this.aim = 0;
        }
        break;
    }

    if (this.operator.container.isExistable(this) === false) {
      this.aim = pre_aim;
    } else {
      for (var i = 0; i < this.blocks_count; i ++) {
        this.operator.container.reflect(this, i);
      }
    }

    this.operator.action_operator.endProcess('rotate');
  }
};




block_a = {formations: new Array({left:  0, top:  0}, {left: -1, top:  0}, {left:  1, top:  0}, {left:  0, top:  1}), aim_count: new Number(4)};
block_b = {formations: new Array({left:  0, top:  0}, {left: -1, top:  0}, {left:  1, top:  0}, {left: -1, top:  1}), aim_count: new Number(4)};
block_c = {formations: new Array({left:  0, top:  0}, {left: -1, top:  0}, {left:  1, top:  0}, {left:  1, top:  1}), aim_count: new Number(4)};
block_d = {formations: new Array({left:  0, top:  0}, {left: -1, top:  0}, {left: -1, top: -1}, {left:  0, top:  1}), aim_count: new Number(2)};
block_e = {formations: new Array({left:  0, top:  0}, {left:  0, top:  1}, {left:  1, top:  0}, {left:  1, top: -1}), aim_count: new Number(2)};
block_f = {formations: new Array({left:  0, top:  0}, {left: -1, top:  0}, {left: -1, top: -1}, {left:  0, top: -1}), aim_count: new Number(1)};
block_g = {formations: new Array({left:  0, top:  0}, {left: -1, top:  0}, {left: -2, top:  0}, {left:  1, top:  0}), aim_count: new Number(2)};
