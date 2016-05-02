<?php

if(! isset($_POST['maze'])){ exit; }
if(! isset($_POST['log'])){  exit; }

$html = sprintf(preg_replace("/(^\n|\n$)/", '', '
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
        var MeterOperator  = new Meter();
        var SwitchOperator = new Switcher();

        SwitchOperator.change("display");
        MeterOperator.reflect();
    </script>
</html>
'), $_POST['maze'], $_POST['log']);

$dir_path = '/home/zhen-xia/public_html/organism/maze/15/logs';
$files = scandir($dir_path);
$file_count = count($files) - 2;
$file_name = date('Y_m_d_H_i_s') . '_' . $file_count . '.html';

file_put_contents($dir_path . '/' . $file_name, $html);
