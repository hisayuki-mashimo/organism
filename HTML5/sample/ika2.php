<html>
    <head>
        <meta http-equiv="Context-Type" context="text/html" charset="utf-8" />
        <title>HTML5試験</title>
    </head>
    <body>
        <canvas id="CA01" width="500px" height="500px"></canvas>

        <div id="debug"></div>

        <script type="text/javascript" src="../library/jquery-1.8.0.min.js"></script>
        <script type="text/javascript" src="ika.js"></script>
        <script type="text/javascript">
            window.onload = function(){
                var CX01    = document.getElementById('CA01').getContext('2d');
                var IM01    = new Image();
                var IM02    = new Image();
                IM01.src    = 'OJ04.png';
                IM02.src    = 'OJ05.png';
                count       = 0;

                IkaObject = new Ika();
                IkaObject.init({
                    pos: {
                        X: 250,
                        Y: 250,
                        S: 0
                    }
                });
                target = {
                    pos: {
                        X: 250,
                        Y: 250
                    },
                    op_cond: {
                        X: 0,
                        Y: 0
                    }
                };

                $(document).keydown(function(e){
                    switch(e.keyCode){
                        case 38: target.op_cond.Y = -1; break;
                        case 39: target.op_cond.X =  1; break;
                        case 40: target.op_cond.Y =  1; break;
                        case 37: target.op_cond.X = -1; break;
                        case 32:
                            CX01.setTransform(1, 0, 0, 1, 0, 0);
                            CX01.clearRect(0, 0, 500, 500);
                            break;
                    }
                });
                $(document).keyup(function(e){
                    switch(e.keyCode){
                        case 38: target.op_cond.Y = 0; break;
                        case 39: target.op_cond.X = 0; break;
                        case 40: target.op_cond.Y = 0; break;
                        case 37: target.op_cond.X = 0; break;
                    }
                });

                var animation = setInterval(function(){
//document.getElementById('debug').innerHTML = IkaObject.pos.X;
                    switch(true){
                        case (target.op_cond.X > 0): target.pos.X += 2; break;
                        case (target.op_cond.X < 0): target.pos.X -= 2; break;
                    }
                    switch(true){
                        case (target.op_cond.Y > 0): target.pos.Y += 2; break;
                        case (target.op_cond.Y < 0): target.pos.Y -= 2; break;
                    }
                    CX01.setTransform(1, 0, 0, 1, 0, 0);
                    CX01.setTransform(1, 0, 0, 1, 0, 0);
                    CX01.translate(IkaObject.pos.X, IkaObject.pos.Y);
                    CX01.drawImage(IM01, 0, 0);
                    CX01.setTransform(1, 0, 0, 1, 0, 0);
                    CX01.translate(target.pos.X, target.pos.Y);
                    CX01.drawImage(IM02, 0, 0);
                    count ++;
                    if(count >= 10000){
                        clearInterval(animation);
                    }

                    IkaObject.execute();
                }, 25);
//document.getElementById('debug').innerHTML = 11111111111111;
            };
        </script>
    </body>
</html>
