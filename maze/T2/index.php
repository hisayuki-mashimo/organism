<?php


require_once dirname(__FILE__) .'/operator.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : null;
$params = array(
    'id'             => $id,
    'rgon_ver'       => 3,
    'rgon_nex'       => 3,
    'rgon_side'      => 10,
    'room_count'     => 6,
    'room_side_max'  => 2,
    'room_area_disp' => '',
    'room_pdng_min'  => 0,
    'room_pdng_max'  => 3
);

$Operator = new Operator();
$Operator->init($params);


?>




<html>
    <head>
        <link rel="stylesheet" type="text/css" href="style.css" />
    </head>

    <body>
        <div id="display">
            <div id="meter">　</div>
            <div id="display_switch"></div>
            <div id="clear"></div>
            <div id="contents">
                <div id="maze"><?php echo $Operator->display(); ?></div>
                <div id="operate">
                <?php $player_aims = $Operator->data['player']['aims']; ?>
                    <form action="" method="get">
                        <input type="hidden" name="id" value="<?php echo $Operator->data['id']; ?>" />
                        <table>
                            <tr>
                                <td></td>
                                <td><?php if(isset($player_aims['top'])): ?><input type="submit" name="aim[top]" value="↑" /><?php endif; ?></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><?php if(isset($player_aims['lft'])): ?><input type="submit" name="aim[lft]" value="←" /><?php endif; ?></td>
                                <td></td>
                                <td><?php if(isset($player_aims['rgt'])): ?><input type="submit" name="aim[rgt]" value="→" /><?php endif; ?></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><?php if(isset($player_aims['btm'])): ?><input type="submit" name="aim[btm]" value="↓" /><?php endif; ?></td>
                                <td></td>
                            </tr>
                        </table>
                    </form>
                </div>
            </div>
        </div>
    </body>

    <script type="text/javascript" src="../jquery-1.5.min.js"></script>
    <script type="text/javascript" src="function.js"></script>
    <script type="text/javascript">
        var NavigateOperator = new Navigator();
        var MeterOperator    = new Meter();
        var SwitchOperator   = new Switcher();
        var Camouflager      = new Camouflager();
        var ObjectController = new Controller();

        SwitchOperator.change();
        ObjectController.configure(<?php echo json_encode($Operator->data); ?>);
        NavigateOperator.configure(<?php echo json_encode($params); ?>);
        MeterOperator.reflect();
    </script>
</html>
