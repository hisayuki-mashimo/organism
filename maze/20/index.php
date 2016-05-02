<html>
    <head>
        <link rel="stylesheet" type="text/css" href="style.css" />
    </head>

    <body>
        <div id="display">
            <div id="meter">　</div>
            <div id="signal"></div>
            <div id="display_switch"></div>
            <div id="operate_switch"></div>
            <div id="clear"></div>
            <div id="contents">
                <div id="maze"></div>
                <div id="memory">
                    <button href="">保存</button>
                </div>
                <div id="log"></div>
                <div id="debug"></div>
            </div>
            <div id="operate">
                <form action="" method="post" name="params">
                    <table>
                        <tr>
                            <td>管区の数</td>
                            <td>縦: <input type="text" name="region_y" size="2" value="6" />&nbsp;&nbsp;横: <input type="text" name="region_x" size="2" value="6" /></td>
                        </tr>
                        <tr>
                            <td>管区の規模</td>
                            <td><input type="text" name="unit_size" size="2" value="5" /></td>
                        </tr>
                        <tr>
                            <td>部屋の個数</td>
                            <td><input type="text" name="room_count" size="2" value="16" /></td>
                        </tr>
                        <tr>
                            <td>部屋の最大幅</td>
                            <td><input type="text" name="room_side_max" size="2" value="4" /></td>
                        </tr>
                        <tr>
                            <td>部屋の面積の分布</td>
                            <td><input type="text" name="room_area_disp" size="20" value="{'1':2, '2':2}" /></td>
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    </body>

    <script type="text/javascript" src="../jquery-1.5.min.js"></script>
    <script type="text/javascript" src="function.js"></script>
    <script type="text/javascript">
        var SignalOperator   = new Signal();
        var MeterOperator    = new Meter();
        var SwitchOperator   = new Switcher();
        var Camouflager      = new Camouflager();

        SwitchOperator.change('display');
        SwitchOperator.change('operate');
        MeterOperator.reflect();
        SignalOperator.connect();
    </script>
</html>
