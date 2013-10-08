Calculater = function(params)
{
  this.init(params);
};


Calculater.prototype = {
  action_operator: null,
  container:       null,

  element: null,

  scores:    new Array(40, 100, 300, 1200),
  acquireds: new Array(),


  init: function(params)
  {
    if (params != undefined) {
      for (var i in params) {
        this[i] = params[i];
      }
    }

    this.action_operator.calculater = this;
    this.container.calculater       = this;
  },


  calculate: function(score)
  {
    if (this.acquireds[score-1] == undefined) {
      for (var i = 0; i < score; i ++) {
        if (this.acquireds[i] == undefined) {
          this.acquireds[i] = new Number(0);
        }
      }
    }
    this.acquireds[score-1] += this.scores[score-1];

    var meter_id = '#score_'+score;
    $($(this.element).find(meter_id).get(0)).text(this.acquireds[score-1]);
    
  }
};
