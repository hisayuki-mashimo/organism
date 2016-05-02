<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Context-Type" context="text/html" charset="utf-8" />
        <link type="text/css" rel="stylesheet" href="style/style.css" />
        <title>HTML5試験</title>
    </head>
    <body>
        <?php $alpha = 80; $size = 200; ?>

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
        <script type="text/javascript" src="model/small_stellated_dodecahedron.js"></script>
        <script type="text/javascript" src="model/great_stellated_dodecahedron.js"></script>
        <script type="text/javascript" src="model/great_icosahedron.js"></script>
        <script type="text/javascript" src="model/great_dodecahedron.js"></script>
        <script type="text/javascript">
            window.onload = function(){
                var frame_node01 = document.getElementById('FR01');
                var frame_node02 = document.getElementById('FR02');
                var frame_node03 = document.getElementById('FR03');
                var frame_node04 = document.getElementById('FR04');
                var frame_node05 = document.getElementById('FR05');
                var frame_node06 = document.getElementById('FR06');
                var params01 = {alpha:<?php echo $alpha; ?>, size: <?php echo $size; ?>};
                var params02 = {alpha:<?php echo $alpha; ?>, size: <?php echo $size; ?>};
                var params03 = {alpha:<?php echo $alpha; ?>, size: <?php echo $size; ?>};
                var params04 = {alpha:<?php echo $alpha; ?>, size: <?php echo $size; ?>};

                var Operater                         = new Polyhedron_Basis({geometry_calculator: geometry_calculator});
                var SmallStellatedDodecahedronObject = Operater.summons('SmallStellatedDodecahedron', frame_node01, params01);
                var GreatStellatedDodecahedronObject = Operater.summons('GreatStellatedDodecahedron', frame_node02, params02);
                var GreatDodecahedronObject          = Operater.summons('GreatDodecahedron',          frame_node05, params03);
                var GreatGcosahedronObject           = Operater.summons('GreatIcosahedron',           frame_node06, params04);

                var theta_X = 0;
                var theta_Y = 0;
                var theta_Z = 0;
                var animation = setInterval(function(){
                    SmallStellatedDodecahedronObject.output(theta_X, theta_Y, theta_Z);
                    GreatStellatedDodecahedronObject.output(theta_X, theta_Y, theta_Z);
                    GreatDodecahedronObject.output(theta_X, theta_Y, theta_Z);
                    GreatGcosahedronObject.output(theta_X, theta_Y, theta_Z);
                    theta_X += 0.015;
                    theta_Y += 0.025;
                    theta_Z += 0.015;
                    //clearInterval(animation);
                }, 50);
            };
        </script>
    </body>
</html>
