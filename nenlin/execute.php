<html>
  <head>
    <link rel="stylesheet" type="text/css" href="style/block.css" />
    <link rel="stylesheet" type="text/css" href="style/hangar.css" />
    <link rel="stylesheet" type="text/css" href="style/meter.css" />
    <script language="JavaScript" type="text/javascript" src="operator/jquery-1.4.2.min.js"></script>
    <!--[if IE]>
    <script type="text/javascript" src="operator/excanvas_r3/excanvas.js" mce_src="operator/excanvas_r3/excanvas.js"></script>
    <![endif]-->
    <script language="JavaScript" type="text/javascript" src="operator/block.js"></script>
    <script language="JavaScript" type="text/javascript" src="operator/container.js"></script>
    <script language="JavaScript" type="text/javascript" src="operator/ahead.js"></script>
    <script language="JavaScript" type="text/javascript" src="operator/action.js"></script>
    <script language="JavaScript" type="text/javascript" src="operator/calculater.js"></script>
    <script language="JavaScript" type="text/javascript">
      $(document).ready(function(){
        Container_Object = new ContainerObject({
          radius:  15,
          element: $('#hangar').get(0),
          canvas:  $('#image_display').get(0)
        });
        Ahead_Object = new AheadObject({
          side:    4,
          depth:   4,
          element: $('#announcer').get(0)
        });
        Block_Operator = new BlockOperator({
          container:  Container_Object,
          ahead:      Ahead_Object,
          block_size: 10
        });
        Block_Operator.setObjectParam({
          formation:  block_a.formations,
          aim_count:  block_a.aim_count,
          block_type: block_a.block_type,
          class_name: 'block_a'
        });
        Block_Operator.setObjectParam({
          formation:  block_b.formations,
          aim_count:  block_b.aim_count,
          block_type: block_b.block_type,
          class_name: 'block_b'
        });
        Block_Operator.setObjectParam({
          formation:  block_c.formations,
          aim_count:  block_c.aim_count,
          block_type: block_c.block_type,
          class_name: 'block_c'
        });
        Block_Operator.setObjectParam({
          formation:  block_d.formations,
          aim_count:  block_d.aim_count,
          block_type: block_d.block_type,
          class_name: 'block_d'
        });
        Block_Operator.setObjectParam({
          formation:  block_e.formations,
          aim_count:  block_e.aim_count,
          block_type: block_e.block_type,
          class_name: 'block_e'
        });
        Block_Operator.setObjectParam({
          formation:  block_f.formations,
          aim_count:  block_f.aim_count,
          block_type: block_f.block_type,
          class_name: 'block_f'
        });
        Block_Operator.setObjectParam({
          formation:  block_g.formations,
          aim_count:  block_g.aim_count,
          block_type: block_g.block_type,
          class_name: 'block_g'
        });
        Container_Object.buildHangar();
        Container_Object.buildCanvas();
        Action_Operator = new ActionOperator({
          block_operator: Block_Operator,
          container:      Container_Object,
          ahead:          Ahead_Object,
          fall_interval:  new Number(1000)
        });
        Calculater_Object = new Calculater({
          action_operator: Action_Operator,
          container:       Container_Object,
          element:         $("#meter").get(0)
        });
        Action_Operator.startAction();
      });
    </script>
  </head>
  <body>
    <div id="hangar">
      <div id="hangar_A"></div>
      <div id="hangar_B"></div>
      <canvas id="image_display"></canvas>
    </div>
    <div id="announcer"></div>
    <table id="meter">
      <tbody>
        <tr>
          <th>1</th>
          <td id="score_1">0</td>
        </tr>
        <tr>
          <th>2</th>
          <td id="score_2">0</td>
        </tr>
        <tr>
          <th>3</th>
          <td id="score_3">0</td>
        </tr>
        <tr>
          <th>4</th>
          <td id="score_4">0</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>

