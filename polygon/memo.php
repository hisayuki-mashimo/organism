<html>
    <body>
        <script type="text/javascript" src="../../library/jquery-1.8.0.min.js"></script>
        <script type="text/javascript" src="../../library/debug.js"></script>
        <script type="text/javascript">
            var pai         = Math.PI;
            var theta072    = pai * 2 / 5;
            var theta036    = pai * 2 / 10;
            var sin072      = Math.sin(theta072);
            var cos072      = Math.cos(theta072);
            var sin036      = Math.sin(theta036);
            var cos036      = Math.cos(theta036);
            var ratio00 = {
                A: 1 - cos072,
                B: cos072 + cos036,
                C: 1 + cos036
            };
            var ratio01 = {
                A: sin036 * (ratio00.B / ratio00.C),
                B: sin072 - (sin036 * (ratio00.B / ratio00.C)),
                C: sin072
            };
            var L00 = this.alpha * (Math.pow(3, 1 / 2) / 2);
            var L01 = L00 * sin072;
            var L02 = L01 * cos072;

            vd(
                'sin2α = 2sinαcosα',
                'cos2α',
                '└ = cos<sup>2</sup>α - sin<sup>2</sup>α',
                '└ = 2cos<sup>2</sup>α - 1',
                '└ = 1 - 2sin<sup>2</sup>α',
                'tan2α = (2tanα) / (1 - tan<sup>2</sup>α)'
            );
        </script>
    </body>
</html>
