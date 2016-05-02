<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Context-Type" context="text/html" charset="utf-8" />
        <link type="text/css" rel="stylesheet" href="style/style.css" />
        <title>HTML5試験</title>
    </head>
    <body>
        <div id="FR01"></div>
        <div id="FR02"></div>
        <div id="FR03"></div>
        <div id="FR04"></div>
        <div id="FR05"></div>
        <div id="FR06"></div>

        <script type="text/javascript" src="../library/jquery-1.8.0.min.js"></script>
        <script type="text/javascript" src="../library/debug.js"></script>
        <script type="text/javascript" src="library/geometry_calculator.js"></script>
        <script type="text/javascript" src="model/polyhedron_basis.js"></script>
        <script type="text/javascript" src="model/truncated_icosahedron.js"></script>
        <script type="text/javascript">
            window.onload = function(){
                var frame_node01    = document.getElementById('FR01');
                var frame_node02    = document.getElementById('FR02');
                var frame_node03    = document.getElementById('FR03');
                var frame_node04    = document.getElementById('FR04');
                var frame_node05    = document.getElementById('FR05');
                var frame_node06    = document.getElementById('FR06');
                var params          = {
                    alpha:  40,
                    size:   300
                };

                var Operater                    = new Polyhedron_Basis({geometry_calculator: geometry_calculator});
                var TruncatedIcosahedronObject  = Operater.summons('TruncatedIcosahedron',  frame_node01, params);

                var theta_X = 0;
                //var theta_X = Math.PI / 2;
                var theta_Y = 0;
                var theta_Z = 0;
                var animation = setInterval(function(){
                    TruncatedIcosahedronObject.output(theta_X, theta_Y, theta_Z);
                    theta_X += 0.015;
                    theta_Y += 0.025;
                    theta_Z += 0.035;
                    //clearInterval(animation);
                }, 50);
            };
        </script>
    </body>
</html>
