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
                <div id="maze"></div>
                <div id="memory">
                    <button href="">保存</button>
                </div>
                <div id="log"></div>
            </div>
        </div>
    </body>

    <script type="text/javascript" src="../jquery-1.5.min.js"></script>
    <script type="text/javascript" src="function.js"></script>
    <script type="text/javascript">
        var SignalOperator = new Signal();
        var MeterOperator  = new Meter();
        var SwitchOperator = new Switcher();
        var MemoryOperator = new Memory();

        SwitchOperator.change('display');
        MeterOperator.reflect();
        SignalOperator.connect();
    </script>
</html>
