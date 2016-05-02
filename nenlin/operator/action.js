ActionOperator = function(params)
{
  this.init(params);
};


ActionOperator.prototype = {
  block_operator: null,
  ahead:          null,
  calculater:     null,

  falling:       null,
  fall_interval: new Number(500),

  action_doing:      true,
  action_proseccing: false,
  block_falling:     false,
  block_droping:     false,
  block_sliding:     false,
  block_rotating:    false,
  ahead_renewing:    false,

  keys: {
    left:           37,
    right:          39,
    up:             38,
    down:           40,
    quick_down:     32,
    rotate_left:    90,
    rotate_right:   88,
    reversal_left:  65,
    reversal_right: 83,
    pause:          13,
    hide:           16
  },


  init: function(params)
  {
    if (params != undefined) {
      for (var i in params) {
        this[i] = params[i];
      }
    }
    this.block_operator.action_operator = this;
    this.container.action_operator      = this;
    this.ahead.action_operator          = this;

    var ref = this;

    $(document).keydown(function(e) {
      switch (e.keyCode) {
        case ref.keys.left:
          ref.block_operator.active_object.slide('left');
          break;
        case ref.keys.right:
          ref.block_operator.active_object.slide('right');
          break;
        case ref.keys.up:
          ref.block_operator.active_object.rotate('left');
          break;
        case ref.keys.down:
          break;
        case ref.keys.quick_down:
          ref.block_operator.active_object.drop();
          break;
        case ref.keys.rotate_left:
          ref.block_operator.active_object.rotate('left');
          break;
        case ref.keys.rotate_right:
          ref.block_operator.active_object.rotate('right');
          break;
        case ref.keys.reversal_left:
          ref.container.rotate('left');
          break;
        case ref.keys.reversal_right:
          ref.container.rotate('right');
          break;
        case ref.keys.pause:
          ref.pause();
          break;
        case ref.keys.hide:
          ref.ahead.hideAnnouncer();
          break;
      }
    });
  },


  startAction: function()
  {
    this.block_operator.prepareObject();
    this.updateProcess();
    this.action();
  },


  action: function()
  {
    var ref = this;

    this.action_doing = true;
    this.falling = setInterval(function(){
      ref.block_operator.active_object.fall();
    }, this.fall_interval);
  },


  startProcess: function(action_name)
  {
    var a = this.action_doing      == true;
    var p = this.action_proseccing == true;
    var f = this.block_falling     == true;
    var d = this.block_droping     == true;
    var s = this.block_sliding     == true;
    var r = this.block_rotating    == true;
    var h = this.ahead_renewing    == true;

    switch (action_name) {
      case 'do':
        this.action_doing = true;
        return true;
      case 'process':
        if (! a) {
          return false;
        }
        this.action_processing = true;
        return true;
      case 'drop':
        if (! a || p || f || d || s || r) {
          return false;
        }
      case 'fall':
        if (d) {
          return false;
        }
        this.block_droping = true;
        return true;
        break;
      case 'slide':
        if (! a || p || f || d || s || r) {
          return false;
        }
        this.block_sliding = true;
        return true;
        break;
      case 'rotate':
        if (! a || p || f || d || s || r) {
          return false;
        }
        this.block_rotaing = true;
        return true;
        break;
      case 'hide':
        if (! a) {
          return false;
        }
        this.ahead_renewing = true;
        return true;
        break;
    }
  },


  endProcess: function(action_name)
  {
    switch (action_name) {
      case 'do':      this.action_doing      = false; break;
      case 'process': this.action_processing = false; break;
      case 'fall':    this.block_droping     = false; break;
      case 'drop':    this.block_droping     = false; break;
      case 'slide':   this.block_sliding     = false; break;
      case 'rotate':  this.block_rotating    = false; break;
      case 'hide':    this.ahead_renewing    = false; break;
    }
  },


  updateProcess: function()
  {
    if (this.startProcess('process') == false) {
      return;
    }

    var seted = this.block_operator.instantObject();
    if (! seted) {
      this.endProcess('process');
      this.pause();
      $('#score_1').get(0).innerHTML = 'Z';//kari
    }

    this.block_operator.prepareObject();

    this.endProcess('process');
  },


  pause: function()
  {
    if (this.action_doing == true) {
      this.endProcess('do');
      clearInterval(this.falling);
    } else {
      this.action();
      this.startProcess('do');
    }
  }
};
