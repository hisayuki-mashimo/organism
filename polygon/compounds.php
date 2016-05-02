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
        <script type="text/javascript" src="model/stella_octangula.js"></script>
        <script type="text/javascript" src="model/fifth_tetrahedron.js"></script>
        <script type="text/javascript" src="model/ten_tetrahedron.js"></script>
        <script type="text/javascript">
            window.onload = function(){
                var frame_node01    = document.getElementById('FR01');
                var frame_node02    = document.getElementById('FR02');
                var frame_node03    = document.getElementById('FR03');
                var frame_node04    = document.getElementById('FR04');
                var frame_node05    = document.getElementById('FR05');
                var frame_node06    = document.getElementById('FR06');
                var params01        = {alpha:    80,    size:   180};
                var params02        = {alpha:    80,    size:   180};
                var params03        = {alpha:    80,    size:   180};
                var params04        = {alpha:    85,    size:   180};
                var params05        = {alpha:    85,    size:   180};

                var Operater                        = new Polyhedron_Basis({geometry_calculator: geometry_calculator});
                var StellaOctangulaObject           = Operater.summons('StellaOctangula',       frame_node01, params01);
                var FifthTetrahedronObject          = Operater.summons('FifthTetrahedron',      frame_node02, params02);
                var TenTetrahedronObject            = Operater.summons('TenTetrahedron',        frame_node03, params03);

                var theta_X = 0;
                var theta_Y = 0;
                var theta_Z = 0;
                var animation = setInterval(function(){
                    StellaOctangulaObject.output(theta_X, theta_Y, theta_Z);
                    FifthTetrahedronObject.output(theta_X, theta_Y, theta_Z);
                    TenTetrahedronObject.output(theta_X, theta_Y, theta_Z);
                    theta_X += 0.015;
                    theta_Y += 0.025;
                    theta_Z += 0.015;
                    //clearInterval(animation);
                }, 50);
            };
        </script>
    </body>
</html>
