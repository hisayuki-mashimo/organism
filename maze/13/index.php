<html>
    <head>
        <link rel="stylesheet" type="text/css" href="style.css" />
    </head>

    <body>
        <div id="display">
            <div id="meter">　</div>
            <div id="signal"></div>
            <div id="switch"></div>
            <div id="clear"></div>
            <div id="maze"><div>
        </div>
    </body>

    <script type="text/javascript" src="../jquery-1.5.min.js"></script>
    <script type="text/javascript" src="function.js"></script>
    <script type="text/javascript">
        var SignalOperator  = new Signal();
        var MeterOperator   = new Meter();
        var DisplayOperator = new Display();

        DisplayOperator.change();
        MeterOperator.reflect();
        SignalOperator.connect();
    </script>
</html>
