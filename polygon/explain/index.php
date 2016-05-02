<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Context-Type" context="text/html" charset="utf-8" />
        <link type="text/css" rel="stylesheet" href="style.css" />
        <title>HTML5試験</title>
    </head>
    <body>
        <?php $alpha = 150; $size = 350; ?>

        <table style="position:absolute; border-collapse:collapse;">
            <tr>
                <td><div id="FR0S" style="width:<?php echo $size + 1; ?>px; height:<?php echo $size + 1; ?>px;"></div></td>
                <td><div id="FR0C" style="width:<?php echo $size + 1; ?>px; height:<?php echo $size + 1; ?>px;"></div></td>
                <!-- <td rowspan="2"><div id="FR0K" style="width:<?php echo $size + 1; ?>px; height:<?php echo ($size + 1) * 2; ?>px;"></div></td> -->
                <td rowspan="2"><div id="FR0K" style="height:<?php echo ($size + 1) * 2; ?>px;"></div></td>
            </tr>
            <tr>
                <td></td>
                <td><div id="FR0H" style="width:<?php echo $size + 1; ?>px; height:<?php echo $size + 1; ?>px;"></div></td>
            </tr>
        </table>

        <script type="text/javascript" src="../../library/jquery-1.8.0.min.js"></script>
        <script type="text/javascript" src="../../library/debug.js"></script>
        <script type="text/javascript" src="../library/geometry_calculator.js"></script>
        <script type="text/javascript" src="../model/polyhedron_basis_theta.js"></script>
        <script type="text/javascript" src="../model/basis/pentagram_theta.js"></script>
        <script type="text/javascript" src="../model/fifth_tetrahedron_theta.js"></script>
        <script type="text/javascript" src="../model/explainer/polyhedron_basis_theta.js"></script>
        <script type="text/javascript" src="../model/explainer/basis/pentagram_theta.js"></script>
        <script type="text/javascript" src="../model/explainer/fifth_tetrahedron_theta.js"></script>
        Polyhedron_Basis_Theta_Explain
        <script type="text/javascript">
            window.onload = function(){
                var frame_node0C = document.getElementById('FR0C');
                var frame_node0S = document.getElementById('FR0S');
                var frame_node0H = document.getElementById('FR0H');
                var frame_node0K = document.getElementById('FR0K');
                var params = {
                    alpha: <?php echo $alpha; ?>,
                    size:  <?php echo $size; ?>
                };

                var OperaterTheta               = new Polyhedron_Basis_Theta({geometry_calculator: geometry_calculator});
                var OperaterThetaExplainer      = new Polyhedron_Explainer_Basis_Theta(OperaterTheta);
                var PentagramThetaObject        = OperaterThetaExplainer.summons('Pentagram_Theta',         frame_node0C, frame_node0S, frame_node0H, frame_node0K, params);
                var FifthTetrahedronThetaObject = OperaterThetaExplainer.summons('Fifth_Tetrahedron_Theta', frame_node0C, frame_node0S, frame_node0H, frame_node0K, params);

                PentagramThetaObject.preExplain();
                //FifthTetrahedronThetaObject.preExplain();

                $(document).keydown(function(event){
                    if (event.keyCode == 13) {
                        var animation_switch = (PentagramThetaObject.animation_switch === true) ? false : true;
                        //var animation_switch = (FifthTetrahedronThetaObject.animation_switch === true) ? false : true;

                        PentagramThetaObject.animation_switch = animation_switch;
                        PentagramThetaObject.explain();
                        //FifthTetrahedronThetaObject.animation_switch = animation_switch;
                        //FifthTetrahedronThetaObject.explain();
                    }
                });
            };
        </script>
    </body>
</html>
