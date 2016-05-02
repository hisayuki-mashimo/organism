<?php

if(! isset($_POST['maze'])){ exit; }
if(! isset($_POST['log'])){  exit; }
if(! isset($_POST['params']['rgon_Y'])){  exit; }
if(! isset($_POST['params']['rgon_X'])){  exit; }
if(! isset($_POST['params']['rgon_side'])){  exit; }

$html = preg_replace("/(^\n|\n$)/", '', '
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="style.css" />
    </head>

    <body>
        <div id="display">
            <div id="meter">　</div>
            <div id="signal"></div>
            <div id="display_switch"></div>
            <div id="clear"></div>
            <div id="contents">
                <div id="maze">%s</div>
                <div id="log">%s</div>
            </div>
        </div>
    </body>

    <script type="text/javascript" src="../jquery-1.5.min.js"></script>
    <script type="text/javascript" src="function.js"></script>
    <script type="text/javascript">
        var MeterOperator     = new Meter();
        var SwitchOperator    = new Switcher();
        var NavigatorOperator = new Navigator();

        SwitchOperator.change("display");
        MeterOperator.reflect();
        NavigatorOperator.maze = $("#maze").get(0);
        NavigatorOperator.configure(%s);
    </script>
</html>
');

$params = sprintf(
    "{'rgon_Y': %s, 'rgon_X': %s, 'rgon_side': %s}",
    $_POST['params']['rgon_Y'],
    $_POST['params']['rgon_X'],
    $_POST['params']['rgon_side']
);

$html = sprintf($html, $_POST['maze'], $_POST['log'], $params);
$html = preg_replace('/href="/', 'href="../', $html);
$html = preg_replace('/src="/',  'src="../',  $html);

$dir_path = '/home/zhen-xia/public_html/organism/maze/19/logs';
$files = scandir($dir_path);
$file_count = count($files) - 2;
$file_name = date('Y_m_d_H_i_s') . '_' . $file_count . '.html';

file_put_contents($dir_path . '/' . $file_name, $html);
chmod($dir_path . '/' . $file_name, 0777);
