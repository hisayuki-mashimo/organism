<html>
    <head>
        <meta http-equiv='content-style-type' content='text/html; charset=UTF-8' />

        <style type="text/css">
            div#maze_box {
                position: relative;
            }

            canvas#flame,
            canvas#maze {
                position: absolute;
            }
        </style>
    </head>

    <body>
        <form name="operator" method="get" action="http://zhen-xia02.hayabusa-lab.jp/organism/labyrinth/js">
            <fieldset>
                <legend>迷路の規模</legend>

                縦<input type="text" name="X" size="3" maxlength="3" value="20" />&nbsp;
                横<input type="text" name="Y" size="3" maxlength="3" value="20" />

                <input type="button" name="make"   value="作成" />&nbsp;
                <input type="button" name="switch" value="停止" />
            </fieldset>
        </FORM>

        <div id="maze_box">
            <canvas id="flame"></canvas>
            <canvas id="maze"></canvas>
        </div>
    </BODY>

    <script type="text/javascript" src="./program.js"></script>
    <script type="text/javascript">
        var operator = new Labylinth();

        var animation_status = 1;

        var flame_node    = document.getElementById('flame');
        var flame_context = flame_node.getContext('2d');

        var maze_node    = document.getElementById('maze');
        var maze_context = maze_node.getContext('2d');

        var pos_side_X = 0.5;
        var pos_side_Y = 0.5;

        var params = {size: {X: 30, Y: 30}};

        var makeLabyrinth = function(){
            operator.build();

            maze_context.setTransform(1, 0, 0, 1, pos_side_X, pos_side_Y);
            maze_context.beginPath();
            maze_context.moveTo((operator.progress.from.X * 10), (operator.progress.from.Y * 10));
            maze_context.lineTo((operator.progress.to.X   * 10), (operator.progress.to.Y   * 10));
            maze_context.closePath();
            maze_context.stroke();

            if (! operator.progress.built && (animation_status == 1)) {
                setTimeout(makeLabyrinth, 10);
            };
        };

        window.onload = function(){
            flame_node.setAttribute('width',  ((pos_side_X + params.size.X * 10) + 1));
            flame_node.setAttribute('height', ((pos_side_Y + params.size.Y * 10) + 1));

            flame_context.clearRect(pos_side_X, pos_side_X, (pos_side_X + params.size.X * 10), (pos_side_Y + params.size.Y * 10));
            flame_context.strokeStyle = 'rgb(236, 240, 255)';

            for (var X = 1; X < params.size.X; X ++) {
                flame_context.beginPath();
                flame_context.moveTo(pos_side_X + (X * 10), pos_side_Y);
                flame_context.lineTo(pos_side_X + (X * 10), pos_side_Y + (params.size.Y * 10));
                flame_context.stroke();
                flame_context.closePath();
            }

            for (var Y = 1; Y < params.size.Y; Y ++) {
                flame_context.beginPath();
                flame_context.moveTo(pos_side_X,                        pos_side_Y + (Y * 10));
                flame_context.lineTo(pos_side_X + (params.size.X * 10), pos_side_Y + (Y * 10));
                flame_context.stroke();
                flame_context.closePath();
            }

            flame_context.strokeStyle = 'rgb(0, 128, 255)';
            flame_context.strokeRect(pos_side_X, pos_side_X, params.size.X * 10, params.size.Y * 10);

            document.operator.make.onclick = function(){
                operator.init(params);
                operator.prepare();

                maze_node.setAttribute('width',  params.size.X * 10);
                maze_node.setAttribute('height', params.size.Y * 10);

                maze_context.clearRect(pos_side_X, pos_side_X, (pos_side_X + params.size.X * 10), (pos_side_Y + params.size.Y * 10));
                maze_context.strokeStyle = 'rgb(255, 0, 0)';

                animation_status = 1;

                makeLabyrinth();

                return false;
            };

            document.operator.switch.onclick = function(){
                switch (animation_status) {
                    case 0:
                        animation_status = 1;
                        document.operator.switch.value = '停止';
                        makeLabyrinth();
                        break;

                    case 1:
                        animation_status = 0;
                        document.operator.switch.value = '再開';
                        break;
                }

                return false;
            };
        };
    </script>
</HTML>
