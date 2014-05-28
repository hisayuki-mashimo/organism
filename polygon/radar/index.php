<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Context-Type" context="text/html" charset="utf-8" />
        <link type="text/css" rel="stylesheet" href="style/style.css" />
        <title>にせ姓名判断</title>

<?php $type = isset($_GET['type']) ? intval($_GET['type'])          : null; ?>
<?php $sei  = isset($_GET['sei'])  ? htmlspecialchars($_GET['sei']) : '';   ?>
<?php $mei  = isset($_GET['sei'])  ? htmlspecialchars($_GET['mei']) : '';   ?>
<?php switch ($type): ?>
<?php case  4: ?>
<?php case  8: ?>
<?php case 20: ?>
<?php break; ?>
<?php default: ?>
<?php $type = 8; ?>
<?php break; ?>
<?php endswitch; ?>
    </head>

    <body>
        <table id="contents_frame">
            <tr>
                <td id="title_frame">
                    <div id="title">
                        <?php if ($sei || $mei): ?>
                        <span id="name"><?php echo "{$sei} {$mei}"; ?></span>さんのパラメータ
                        <?php else: ?>
                        　
                        <?php endif; ?>
                    </div>
                </td>
                <td class="col_spacer"></td>
                <td id="advice_title_frame">
                    <div id="advice_title"></div>
                </td>
            </tr>
            <tr>
                <td colspan="3" class="row_spacer"></td>
            </tr>
            <tr>
                <td id="radar_frame">
                    <div id="radar"></div>
                </td>
                <td class="col_spacer"></td>
                <td rowspan="3" id="advice_frame">
                    <div id="advice"></div>
                </td>
            </tr>
            <tr>
                <td colspan="2" class="row_spacer"></td>
            </tr>
            <tr>
                <td id="form_frame">
                    <div id="form">
                        <form name="FM01" action="http://zhen-xia02.hayabusa-lab.jp/organism/develop/polygon/radar/index.php" method="get">
                            <input type="hidden" name="type" value="<?php echo $type; ?>" />
                            <table>
                                <tr>
                                    <td>
                                        姓:<input type="text" name="sei" size="10" value="<?php echo $sei; ?>" />
                                        名:<input type="text" name="mei" size="10" value="<?php echo $mei; ?>" />
                                        <input type="submit" value="診断" />
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </div>
                </td>
                <td class="col_spacer"></td>
            </tr>
            <tr>
                <td colspan="3" class="row_spacer"></td>
            </tr>
            <tr>
                <td id="info_frame">
                    <div id="info">
                        これは姓名判断ではありません。<br />
                        ここで出力される結果は事実に即しておりませんので、<br />
                        信用しないでください。
                    </div>
                </td>
                <td colspan="2" class="col_spacer"></td>
            </tr>
        </table>
<div id="debug" style="color:#ff0000;"></div>

        <script type="text/javascript" src="../../library/jquery-1.8.0.min.js"></script>
        <script type="text/javascript" src="../library/md5.js"></script>
        <script type="text/javascript" src="../../library/debug.js"></script>
        <script type="text/javascript" src="../model/polyhedron_basis_theta.js"></script>
        <script type="text/javascript" src="../model/radar/polyhedron_basis_theta.js"></script>
        <script type="text/javascript" src="../model/tetrahedron_theta.js"></script>
        <script type="text/javascript" src="../model/octahedron_theta.js"></script>
        <script type="text/javascript" src="../model/icosahedron_theta.js"></script>
<?php switch ($type): ?>
<?php case 4: ?>
        <script type="text/javascript" src="appli/properties_4.js"></script>
<?php break; ?>
<?php case 8: ?>
        <script type="text/javascript" src="appli/properties_8.js"></script>
<?php break; ?>
<?php case 20: ?>
        <script type="text/javascript" src="appli/properties_20.js"></script>
<?php break; ?>
<?php endswitch; ?>
        <script type="text/javascript">
            window.onload = function(){
                var frame_node = document.getElementById('radar');

                var parameters          = [];
                var paramsters_progress = [];
                var progress_count      = 100;
                var advice              = new Array();

                var sei = <?php echo json_encode($sei); ?>;
                var mei = <?php echo json_encode($mei); ?>;

                for (var i = 0; i < parameter_count; i ++) {
                    parameters.push(0);
                    paramsters_progress.push(0);
                }

                var OperaterTheta      = new Polyhedron_Basis_Theta();
                var OperaterRadarTheta = new Polyhedron_Radar_Basis_Theta(OperaterTheta);
                var RadarObjectTheta   = OperaterRadarTheta.summons(object_code, frame_node, params);

                if (sei || mei) {
                    var string_md5  = CybozuLabs.MD5.calc(sei + '+=+' + mei);
                    var strings     = string_md5.split('');

                    for (var i = 0; i < parameter_count; i ++) {
                        var integer = 1;

                        for (var j = 0; j < 2; j ++) {
                            var n = (i * 2) + j;

                            switch (j) {
                                case 0:
                                    switch (true) {
                                        case (strings[n].match(/[0-9]/) !== null): var unit_integer = parseInt(strings[n]); break;
                                        case (strings[n].match(/[a-b]/) !== null): var unit_integer = 0; break; // weight: 2
                                        case (strings[n].match(/[c-d]/) !== null): var unit_integer = 1; break; // weight: 2
                                        case (strings[n].match(/[e-g]/) !== null): var unit_integer = 2; break; // weight: 3
                                        case (strings[n].match(/[h-j]/) !== null): var unit_integer = 3; break; // weight: 3
                                        case (strings[n].match(/[k-m]/) !== null): var unit_integer = 4; break; // weight: 3
                                        case (strings[n].match(/[n-p]/) !== null): var unit_integer = 5; break; // weight: 3
                                        case (strings[n].match(/[q-s]/) !== null): var unit_integer = 6; break; // weight: 3
                                        case (strings[n].match(/[t-v]/) !== null): var unit_integer = 7; break; // weight: 3
                                        case (strings[n].match(/[w-x]/) !== null): var unit_integer = 8; break; // weight: 2
                                        case (strings[n].match(/[y-z]/) !== null): var unit_integer = 9; break; // weight: 2
                                    }

                                    var coefficient = 1;
                                    break;

                                case 1:
                                    switch (true) {
                                        case (strings[n].match(/[0-9]/) !== null): var unit_integer = parseInt(strings[n]); break;
                                        case (strings[n].match(/a/)     !== null): var unit_integer = 0; break; // weight: 1
                                        case (strings[n].match(/b/)     !== null): var unit_integer = 1; break; // weight: 1
                                        case (strings[n].match(/[c-d]/) !== null): var unit_integer = 2; break; // weight: 2
                                        case (strings[n].match(/[e-h]/) !== null): var unit_integer = 3; break; // weight: 4
                                        case (strings[n].match(/[i-m]/) !== null): var unit_integer = 4; break; // weight: 5
                                        case (strings[n].match(/[n-r]/) !== null): var unit_integer = 5; break; // weight: 5
                                        case (strings[n].match(/[s-v]/) !== null): var unit_integer = 6; break; // weight: 4
                                        case (strings[n].match(/[w-x]/) !== null): var unit_integer = 7; break; // weight: 2
                                        case (strings[n].match(/y/)     !== null): var unit_integer = 8; break; // weight: 1
                                        case (strings[n].match(/z/)     !== null): var unit_integer = 9; break; // weight: 1
                                    }

                                    var coefficient = 10;
                                    break;
                            }

                            integer += unit_integer * coefficient;
                        }

                        parameters[i] = integer;
                    }

                    progress_count = 0;
                }

                var move_switch = false;
                var latest_base_X = 0;
                var latest_base_Y = 0;
                var latest_move_X = 0;
                var latest_move_Y = 0;
                var move_rotate_theta = (0) / 180 * Math.PI;
                var move_vector_theta = (30) / 180 * Math.PI;
                var move_length_theta = (0) / 180 * Math.PI;
                var diff_vector_theta = (0.05) / 180 * Math.PI;
                var diff_length_theta = (1.5) / 180 * Math.PI;
                var rotate_theta_base = (15) / 180 * Math.PI;
                var vector_theta_base = (0) / 180 * Math.PI;
                var length_theta_base = (0) / 180 * Math.PI;
                var rotate_theta = 0;
                var vector_theta = 0;
                var length_theta = 0;
                var theta_R = Math.PI / 2;

                var parseLength = function(len)
                {
                    return Math.round(len * 100) / 100;
                };

                var parseTheta = function(theta, to_360)
                {
                    var theta_quarity  = (theta >= 0) ? 1 : -1;
                    var theta_quantity = Math.abs(theta) % (Math.PI * 2);

                    if (theta_quantity > Math.PI) {
                        theta_quarity  = theta_quarity * -1;
                        theta_quantity = (Math.PI * 2) - theta_quantity;
                    }

                    theta = theta_quarity * theta_quantity;

                    if (to_360 !== true) {
                        theta = Math.round(theta / Math.PI * 1800) / 10;
                    }

                    return theta;
                };

                var execute = function(){
                    if (progress_count < 100) {
                        for (var i = 0; i < parameter_count; i ++) {
                            if (paramsters_progress[i] >= parameters[i]) {
                                paramsters_progress[i] = parameters[i];
                                continue;
                            }
                            paramsters_progress[i] += 2;
                        }

                        progress_count ++;
                    }

                    if (move_switch === true) {
                        rotate_theta_base = rotate_theta;
                        vector_theta_base = vector_theta;
                        length_theta_base = length_theta;

                        var diff_X = latest_move_X - latest_base_X;
                        var diff_Y = latest_move_Y - latest_base_Y;
                        latest_base_X = latest_move_X;
                        latest_base_Y = latest_move_Y;

                        var direction_X = (diff_X > 0) ? -1 :  1;
                        var direction_Y = (diff_Y > 0) ?  1 : -1;
                        var abs_X = Math.abs(diff_X);
                        var abs_Y = Math.abs(diff_Y);
                        if (abs_X > 30) abs_X = 30;
                        if (abs_Y > 30) abs_Y = 30;
                        theta_diff_X = (abs_X / 200) * direction_X;
                        theta_diff_Y = (abs_Y / 200) * direction_Y;

                        move_vector_theta = OperaterTheta.getThetaByLengthes('Y', theta_diff_X, theta_diff_Y) * -1 + Math.PI;
                        move_rotate_theta = 0;
                        move_length_theta = 0;
                        //diff_length_theta = OperaterTheta.getLengthByPytha(null, theta_diff_X, theta_diff_Y);
                        diff_length_theta = (abs_X == 0 && abs_Y == 0) ? 0 : Math.PI / 120;
                    }

                    if (diff_length_theta > 0) {
                        move_length_theta += diff_length_theta;

                        var TA0 = move_vector_theta - (Math.PI / 2);
                        var TY0 = vector_theta_base - TA0;
                        var LS0 = OperaterTheta.getLengthesByTheta('Z', length_theta_base);
                        var RY0 = LS0.Y;
                        var LZ0 = LS0.X;
                        var LS1 = OperaterTheta.getLengthesByTheta('Y', TY0);
                        var LX1 = LS1.X * RY0;
                        var LY1 = LS1.Y * RY0;
                        var RX1 = OperaterTheta.getLengthByPytha(null, LX1, LZ0);
                        var TX1 = OperaterTheta.getThetaByLengthes('X', LX1, LZ0);
                        var TX2 = TX1 + move_length_theta;
                        var LS2 = OperaterTheta.getLengthesByTheta('X', TX2);
                        var LX2 = LS2.X * RX1;
                        var LZ2 = LS2.Y * RX1;
                        var RY2 = OperaterTheta.getLengthByPytha(null, LX2, LY1);
                        var TL2 = OperaterTheta.getThetaByLengthes('Z', LZ2, RY2);
                        var TV2 = OperaterTheta.getThetaByLengthes('Y', LX2, LY1);

                        if (LY1 == 0) {
                            var TX = 0;
                        } else {
                            var LS3 = OperaterTheta.getLengthesByTheta('X', TX1);
                            var LX3 = LS3.X * RX1;
                            var LZ3 = LS3.Y * RX1;
                            var RY3 = OperaterTheta.getLengthByPytha(null, LX3, LY1);
                            var TL3 = OperaterTheta.getThetaByLengthes('Z', LZ3, RY3);
                            var TV3 = OperaterTheta.getThetaByLengthes('Y', LX3, LY1);
                            var L0 = Math.sin(TV3);
                            var L1 = Math.cos(TV3);
                            var L2 = Math.cos(TL3) * L1;
                            var T0 = OperaterTheta.getThetaByLengthes('Y', L2, L0);
                            var T1 = T0 + TV3;

                            var L3 = Math.sin(TV2);
                            var L4 = Math.cos(TV2);
                            var L5 = Math.cos(TL2) * L4;
                            var T2 = OperaterTheta.getThetaByLengthes('Y', L5, L3);
                            var T3 = T2 + TV2;
                            var TX = T3 - T1;
                        }

                        rotate_theta = TX + rotate_theta_base;
                        vector_theta = TV2 + TA0;
                        length_theta = TL2;

                        RadarObjectTheta.configureParam(paramsters_progress);
                        RadarObjectTheta.setDirection(rotate_theta, vector_theta, length_theta);
                        RadarObjectTheta.output();
                    }
                };

                execute();

                var animation = null;
                var animation_switch = true;
                $(document).keydown(function(event){
                    if (event.keyCode == 13) {
                        if (animation_switch === false) {
                            animation_switch = true;
                            animation = setInterval(function(){
                                execute();
                            }, 50);
                        } else {
                            animation_switch = false;
                            clearInterval(animation);
                        }
                    }
                });

                if (animation_switch === true) {
                    animation = setInterval(function(){
                        execute();
                    }, 50);
                }

                var radar_box  = document.getElementById('radar');
                var gauze_node = document.createElement('div');
                $(gauze_node).css('width',            '351px');
                $(gauze_node).css('height',           '351px');
                $(gauze_node).css('position',         'absolute');
                $(gauze_node).css('top',              '0px');
                $(gauze_node).css('left',             '0px');
                $(gauze_node).css('cursor',           'default');
                $(gauze_node).css('background-color', 'rgba(0, 0, 0, 0)');
                radar_box.appendChild(gauze_node);

                gauze_node.onmousedown = function(event){
                    move_switch = true;
                    latest_move_X = event.clientX;
                    latest_move_Y = event.clientY;
                    latest_base_X = event.clientX;
                    latest_base_Y = event.clientY;
                };

                document.onmousemove = function(event){
                    if (move_switch === true) {
                        latest_move_X = event.clientX;
                        latest_move_Y = event.clientY;
                    }
                };

                document.onmouseup = function(event){
                    if (move_switch === true) {
                        move_switch = false;

                        latest_move_X = event.clientX;
                        latest_move_Y = event.clientY;
                    }
                };
            };
        </script>
    </body>
</html>
