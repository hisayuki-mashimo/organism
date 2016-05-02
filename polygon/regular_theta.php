<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Context-Type" context="text/html" charset="utf-8" />
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
        <script type="text/javascript" src="model/polyhedron_basis_theta.js"></script>
        <script type="text/javascript" src="model/tetrahedron_theta.js"></script>
        <script type="text/javascript" src="model/tetrahedron_shift_theta.js"></script>
        <script type="text/javascript" src="model/hexahedron_theta.js"></script>
        <script type="text/javascript" src="model/hexahedron_shift_theta.js"></script>
        <script type="text/javascript" src="model/octahedron_theta.js"></script>
        <script type="text/javascript" src="model/octahedron_shift_theta.js"></script>
        <script type="text/javascript" src="model/dodecahedron_theta.js"></script>
        <script type="text/javascript" src="model/dodecahedron_shift_theta.js"></script>
        <script type="text/javascript" src="model/icosahedron_theta.js"></script>
        <script type="text/javascript" src="model/icosahedron_shift_theta.js"></script>
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

                var Operater                = new Polyhedron_Basis_Theta({geometry_calculator: geometry_calculator});
                var TetrahedronObject       = Operater.summons('Tetrahedron_Theta',        frame_node01, params01);
                var TetrahedronShiftObject  = Operater.summons('Tetrahedron_Shift_Theta',  frame_node01, params01);
                var HexahedronObject        = Operater.summons('Hexahedron_Theta',         frame_node02, params02);
                var HexahedronShiftObject   = Operater.summons('Hexahedron_Shift_Theta',   frame_node02, params02);
                var OctahedronObject        = Operater.summons('Octahedron_Theta',         frame_node03, params03);
                var OctahedronShiftObject   = Operater.summons('Octahedron_Shift_Theta',   frame_node03, params03);
                var DodecahedronObject      = Operater.summons('Dodecahedron_Theta',       frame_node04, params04);
                var DodecahedronShiftObject = Operater.summons('Dodecahedron_Shift_Theta', frame_node04, params04);
                var IcosahedronObject       = Operater.summons('Icosahedron_Theta',        frame_node05, params05);
                var IcosahedronShiftObject  = Operater.summons('Icosahedron_Shift_Theta',  frame_node05, params05);

                var animation = null;

                var theta_R = 0;
                var theta_V = 0;
                var theta_L = 0;

                var animate = function(){
                    TetrahedronObject.setDirection(theta_R, theta_V, theta_L);
                    //TetrahedronShiftObject.setDirection(theta_R, theta_V, theta_L);
                    HexahedronObject.setDirection(theta_R, theta_V, theta_L);
                    //HexahedronShiftObject.setDirection(theta_R, theta_V, theta_L);
                    OctahedronObject.setDirection(theta_R, theta_V, theta_L);
                    //OctahedronShiftObject.setDirection(theta_R, theta_V, theta_L);
                    DodecahedronObject.setDirection(theta_R, theta_V, theta_L);
                    //DodecahedronShiftObject.setDirection(theta_R, theta_V, theta_L);
                    IcosahedronObject.setDirection(theta_R, theta_V, theta_L);
                    //IcosahedronShiftObject.setDirection(theta_R, theta_V, theta_L);
                    TetrahedronObject.output();
                    //TetrahedronShiftObject.output();
                    HexahedronObject.output();
                    //HexahedronShiftObject.output();
                    OctahedronObject.output();
                    //OctahedronShiftObject.output();
                    DodecahedronObject.output();
                    //DodecahedronShiftObject.output();
                    IcosahedronObject.output();
                    //IcosahedronShiftObject.output();

                    theta_R += 0.015;
                    theta_V += 0.025;
                    theta_L += 0.035;
                };

                document.onkeydown = function(event){
                    switch (event.keyCode) {
                        case 13:
                            if (animation) {
                                clearInterval(animation);
                                animation = null;
                            } else {
                                animation = setInterval(animate, 50);
                            }
                            break;
                    }
                };

                animate();
            };
        </script>
    </body>
</html>