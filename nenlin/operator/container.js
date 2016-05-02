ContainerObject = function(params)
{
  this.init(params);
};


ContainerObject.prototype = {
  block_operator: null,
  calculater:     null,

  radius: new Number(6),
  element: null,
  canvas:  null,

  conds_A: new Array(),
  conds_B: new Array(),
  pits_A:  new Array(),
  pits_B:  new Array(),
  type_main: new String('A'),
  blocks: new Array(),

  api_url:    'http://zhen-xia02.hayabusa-lab.jp/organism/nenlin/function/image_operator.php',
  image_url:  'http://zhen-xia02.hayabusa-lab.jp/organism/nenlin/resource/output/hangar.png',


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
    var types = new Array('A', 'B');
    for (var i = 0; i < types.length; i ++) {

      var rows = new Array();
      var type = types[i];
      eval('var conds  = this.conds_'+type+';');
      eval('var pits   = this.pits_'+type+';');
      eval("var hangar = $('#hangar_"+type+"').get(0);");

      for (var r = 0; r < (this.radius*2)+1; r ++) {
        conds[r] = new Array();
        pits[r]  = new Array();
        rows[r] = document.createElement('ul');
        $(rows[r]).attr('id', ('pits_'+type+'_'+r));
        hangar.appendChild(rows[r]);
        for (var c = 0; c < (this.radius*2)+1; c ++) {
          conds[r][c] = new String('n');
          pits[r][c]  = document.createElement('li');
          $(pits[r][c]).addClass('pit');
          $(pits[r][c]).css('width',  this.block_operator.block_size+'px');
          $(pits[r][c]).css('height', this.block_operator.block_size+'px');
          rows[r].appendChild(pits[r][c]);

          // 中心ブロック
          if (r == this.radius && c == this.radius) {
            conds[r][c] = 'o';
            $(pits[r][c]).addClass('block_o');
          }
        }
      }
    }

    $(this.getSub().hangar).hide();
  },


  buildCanvas: function()
  {
    $(this.canvas).css('position', 'absolute');
    $(this.canvas).css('top', '0px');
    $(this.canvas).css('left', '0px');
    $(this.canvas).attr('width',  ((this.radius*2)+1)*(this.block_operator.block_size));
    $(this.canvas).attr('height', ((this.radius*2)+1)*(this.block_operator.block_size));
    $(this.canvas).hide();
  },


  getMain: function()
  {
    eval("var conds  = this.conds_"+this.type_main+";");
    eval("var pits   = this.pits_"+this.type_main+";");
    eval("var hangar = $('#hangar_"+this.type_main+"').get(0);");
    return {conds: conds, pits: pits, hangar: hangar};
  },


  getSub: function()
  {
    var type_sub = (this.type_main == 'A') ? 'B' : 'A';
    eval("var conds = this.conds_"+type_sub+";");
    eval("var pits  = this.pits_"+type_sub+";");
    eval("var hangar = $('#hangar_"+type_sub+"').get(0);");
    return {conds: conds, pits: pits, hangar: hangar};
  },


  changeTypeMain: function()
  {
    var type_sub = (this.type_main == 'A') ? 'B' : 'A';
    this.type_main = type_sub;

    $(this.getSub().hangar).hide();
    $(this.getMain().hangar).show();
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
    block_object.blocks_left = Math.floor(this.radius);
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


  rotate: function(aim)
  {
    this.action_operator.pause();

    var ref = this;
    var main = this.getMain();
    var sub  = this.getSub();
    var grow_data = new String('');

    for (var r = 0; r < (this.radius*2)+1; r ++) {
      for (var c = 0; c <(this.radius*2)+1; c ++) {
        if (aim == 'left') {
          var pos_y = c;
          var pos_x = (r-this.radius)*(-1)+this.radius;
        } else {
          var pos_y = (c-this.radius)*(-1)+this.radius;
          var pos_x = r;
        }
        sub.conds[r][c] = main.conds[pos_y][pos_x];
        $(sub.pits[r][c]).removeClass();
        $(sub.pits[r][c]).addClass('pit');
        $(sub.pits[r][c]).addClass('block_'+sub.conds[r][c]);
        grow_data += main.conds[r][c];
      }
    }

    $.ajax({
      type:    'POST',
      url:     ref.api_url,
      data:    'side='  +((ref.radius*2)+1)+
               '&conds='+grow_data,
      success: function(){
        ref.rotateImage(aim);
      }
    });
  },


  rotateImage: function(aim)
  {
    var ref    = this;
    var img    = new Image();
    var ctx    = this.canvas.getContext("2d");
    var rotDig = 0;
    var rot    = 0;
    var today  = new Date();
    ctx.fillStyle = 'rgb(255,255,255)';
    img.src    = this.image_url+'?'+today.getTime();
    img.onload = function() {
      $(ref.canvas).show();
      var rotating = setInterval(function(){
        rotDig = (rotDig+1)%360;
        ctx.fillRect(0, 0, ref.canvas.width, ref.canvas.height);
        ctx.save();
        ctx.translate(ref.canvas.width/2, ref.canvas.height/2);
        switch (aim) {
          case 'left':
            rot = (360-rotDig)/180*Math.PI;
            break;
          case 'right':
            rot = rotDig/180*Math.PI;
            break;
        }
        ctx.rotate(rot);
        ctx.translate((-1)*(img.width)/2, (-1)*(img.height)/2);
        ctx.drawImage(img, 0, 0);
        ctx.restore();

        if (rotDig >= 90) {
          clearInterval(rotating);
          ref.changeTypeMain();
          $(ref.canvas).hide();
          ref.action_operator.pause();
        }
      }, 10);
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
    var conds = this.getMain().conds;

    for (var i = 0; i < block_object.blocks_count; i ++) {
      var position = block_object.aim_positions[block_object.aim][i];
      var pos_left = block_object.blocks_left+position.left;
      var pos_top  = block_object.blocks_top +position.top;
      if (conds[pos_top] == undefined) {
        return false;
      }
      if (conds[pos_top][pos_left] == undefined) {
        return false;
      }
      if (conds[pos_top][pos_left] != 'n') {
        return false;
      }
    }

    return true;
  },


  reachBlocks: function(block_object)
  {
    var main = this.getMain();

    var aligned_rings  = new Array();
    for (var i = 0; i < block_object.blocks_count; i ++) {
      var position = block_object.aim_positions[block_object.aim][i];
      var pos_left = block_object.blocks_left+position.left;
      var pos_top  = block_object.blocks_top +position.top;
      main.conds[pos_top][pos_left] = block_object.block_type;
      $(main.pits[pos_top][pos_left]).removeClass();
      $(main.pits[pos_top][pos_left]).addClass('pit');
      $(main.pits[pos_top][pos_left]).addClass('block_'+block_object.block_type);

      continue; // kari
      // 列にブロックが揃ったかの判断
      for (var r = 1; r <= this.radius; r ++) {
        var is_aligned = true;

        var y = r;
        for (var x = r; x > (-1)*r; x --) {
          if (main.conds[y][x] == n) {is_aligned = false; break;}
        }
        if (is_aligned == false) {continue;}

        var x = (-1)*r;
        for (var y = r; y > (-1)*r; y --) {
          if (main.conds[y][x] == n) {is_aligned = false; break;}
        }
        if (is_aligned == false) {continue;}

        var y = (-1)*r;
        for (var x = (-1)*r; x < r; x ++) {
          if (main.conds[y][x] == n) {is_aligned = false; break;}
        }
        if (is_aligned == false) {continue;}

        var x = r;
        for (var y = (-1)*r; y < r; y ++) {
          if (main.conds[y][x] == n) {is_aligned = false; break;}
        }
        if (is_aligned == false) {continue;}

        aligned_rings += '|'+r;
      }
    }

    if (aligned_rings.length > 0) {
      this.processWhenAligned(aligned_rings);
    }
  },


  processWhenAligned: function(aligned_rings)
  {
    this.block_operator.action_operator.pause();

    this.calculater.calculate(aligned_rings.length);

    var params = {aligned_rings: aligned_rings};
    this.executeAnimate(params);

    this.block_operator.action_operator.pause();
  },


  //animate_completed: new Number(0),


  preAnimate: function(params)
  {
    /*// ブロックの揃った列の情報を格納する配列の文字列化
    params.rows_chained = new String('|');
    for (var i = 0; i < params.aligned_rows.length; i ++) {
      params.rows_chained += params.aligned_rows[i]+'|';
    }

    return params;*/
  },


  executeAnimate: function(params)
  {
    /*params = this.preAnimate(params);

    this.postAnimate(params);

    return params;*/
  },


  postAnimate: function(params)
  {
    /*var hangar = this.getHangarMain();

    $('#reviser').css('height', '0px');
    $(params.rows_regexp).css('height', (this.block_operator.block_size)+'px');

    var slide = new Number(0);

    for (var r = (this.radius*2)+1; r >= 0; r --) {
      for (var i = slide; i <= params.aligned_rows.length; i ++) {
        slide = i;
        if (hangar[r-i] == undefined) {
          break;
        }
        if (params.rows_chained.indexOf('|'+(r-i)+'|') < 0) {
          break;
        }
      }

      if (slide > 0) {
        for (var c = 0; c < (this.radius*2)+1; c ++) {
          $(this.pits[r][c]).removeClass();
          $(this.pits[r][c]).addClass('pit');
          if (r-slide >= 0) {
            hangar[r][c] = hangar[r-slide][c];
            $(this.pits[r][c]).addClass($(this.pits[r-slide][c]).attr('class'));
          } else {
            hangar[r][c] = 'n';
          }
        }
      }
    }*/
  }
};
