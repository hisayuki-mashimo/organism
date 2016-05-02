<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Context-Type" context="text/html" charset="utf-8" />
        <link type="text/css" rel="stylesheet" href="style/style.css" />
        <title>HTML5試験</title>
    </head>
    <body>
        <?php $alpha = 40; $size = 180; ?>

        <table style="position:absolute; border-collapse:collapse;">
            <tr>
                <td><div id="FR01" style="width:<?php echo $size + 1; ?>px; height:<?php echo $size + 1; ?>px;"></div></td>
                <td><div id="FR02" style="width:<?php echo $size + 1; ?>px; height:<?php echo $size + 1; ?>px;"></div></td>
                <td><div id="FR03" style="width:<?php echo $size + 1; ?>px; height:<?php echo $size + 1; ?>px;"></div></td>
            </tr>
            <tr>
                <td><div id="FR04" style="width:<?php echo $size + 1; ?>px; height:<?php echo $size + 1; ?>px;"></div></td>
                <td><div id="FR05" style="width:<?php echo $size + 1; ?>px; height:<?php echo $size + 1; ?>px;"></div></td>
                <td><div id="FR06" style="width:<?php echo $size + 1; ?>px; height:<?php echo $size + 1; ?>px;"></div></td>
            </tr>
        </table>

        <script type="text/javascript" src="../library/jquery-1.8.0.min.js"></script>
        <script type="text/javascript" src="../library/debug.js"></script>
        <script type="text/javascript" src="library/geometry_calculator.js"></script>
        <script type="text/javascript" src="model/polyhedron_basis.js"></script>
        <script type="text/javascript" src="model/tetrahedron.js"></script>
        <script type="text/javascript" src="model/hexahedron.js"></script>
        <script type="text/javascript" src="model/octahedron.js"></script>
        <script type="text/javascript" src="model/dodecahedron.js"></script>
        <script type="text/javascript" src="model/icosahedron.js"></script>
        <script type="text/javascript">
            window.onload = function(){
                var frame_node01 = document.getElementById('FR01');
                var frame_node02 = document.getElementById('FR02');
                var frame_node03 = document.getElementById('FR03');
                var frame_node04 = document.getElementById('FR04');
                var frame_node05 = document.getElementById('FR05');
                var frame_node06 = document.getElementById('FR06');
                var params01 = {alpha:<?php echo $alpha; ?>, size: <?php echo $size; ?>, fill_style: 'rgba(255, 255, 128, 0.8)', stroke_style: 'rgba(224, 224,   0, 1.0)'};
                var params02 = {alpha:<?php echo $alpha; ?>, size: <?php echo $size; ?>, fill_style: 'rgba(244, 192, 244, 0.8)', stroke_style: 'rgba(200, 128, 200, 1.0)'};
                var params03 = {alpha:<?php echo $alpha; ?>, size: <?php echo $size; ?>, fill_style: 'rgba(160, 255, 160, 0.8)', stroke_style: 'rgba(104, 224, 104, 1.0)'};
                var params04 = {alpha:<?php echo $alpha; ?>, size: <?php echo $size; ?>, fill_style: 'rgba(255, 192, 200, 0.8)', stroke_style: 'rgba(240, 128, 132, 1.0)'};
                var params05 = {alpha:<?php echo $alpha; ?>, size: <?php echo $size; ?>, fill_style: 'rgba(192, 192, 255, 0.8)', stroke_style: 'rgba(128, 128, 240, 1.0)'};

                var Operater            = new Polyhedron_Basis({geometry_calculator: geometry_calculator});
                var TetrahedronObject   = Operater.summons('Tetrahedron',   frame_node01, params01);
                var HexahedronObject    = Operater.summons('Hexahedron',    frame_node02, params02);
                var OctahedronObject    = Operater.summons('Octahedron',    frame_node03, params03);
                var DodecahedronObject  = Operater.summons('Dodecahedron',  frame_node04, params04);
                var IcosahedronObject   = Operater.summons('Icosahedron',   frame_node05, params05);

                var theta_X = 0;
                var theta_Y = 0;
                var theta_Z = 0;
                var animation = setInterval(function(){
                    TetrahedronObject.output(theta_X, theta_Y, theta_Z);
                    HexahedronObject.output(theta_X, theta_Y, theta_Z);
                    OctahedronObject.output(theta_X, theta_Y, theta_Z);
                    DodecahedronObject.output(theta_X, theta_Y, theta_Z);
                    IcosahedronObject.output(theta_X, theta_Y, theta_Z);

                    theta_X += 0.015;
                    theta_Y += 0.025;
                    theta_Z += 0.035;
                }, 50);
            };
        </script>
    </body>
</html>
