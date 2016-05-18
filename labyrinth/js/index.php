<html>
    <head>
        <meta http-equiv='content-style-type' content='text/html; charset=UTF-8' />

        <style type="text/css">
            div#maze_box {
                position: relative;
            }

            canvas#rule,
            canvas#solve,
            canvas#point,
            canvas#maze,
            canvas#flame {
                position: absolute;
            }

            table#maze_export_result {
                position: absolute;
                border-collapse: collapse;
            }

            table#maze_export_result td {
                padding: 0px;
                border: none;
                width: 5px;
                height: 5px;
                line-height: 0px;
                font-size: 0px;
            }

            table#maze_export_result td.wall {
                background-color: #000000;
            }
        </style>
    </head>

    <body>
        <form name="operator" method="get" action="http://zhen-xia02.hayabusa-lab.jp/organism/labyrinth/js">
            <fieldset>
                <legend>迷路の規模</legend>

                縦<input type="text" name="X" size="3" maxlength="3" value="30" />&nbsp;
                横<input type="text" name="Y" size="3" maxlength="3" value="30" />

                <input type="button" name="make"   value="作成" />&nbsp;
                <input type="button" name="switch" value="停止" />&nbsp;
                <input type="button" name="export" value="出力" />
            </fieldset>
        </form>

        <div id="maze_box">
            <canvas id="rule"></canvas>
            <canvas id="solve"></canvas>
            <canvas id="point"></canvas>
            <canvas id="maze"></canvas>
            <canvas id="flame"></canvas>

            <table id="maze_export_result"></table>
        </div>
    </body>

    <script type="text/javascript" src="./program.js"></script>
    <script type="text/javascript">
        window.onload = function(){
            var operator = new Labylinth();

            var animation_status = 1;

            var canvas_R_node    = document.getElementById('rule');
            var canvas_S_node    = document.getElementById('solve');
            var canvas_P_node    = document.getElementById('point');
            var canvas_M_node    = document.getElementById('maze');
            var canvas_F_node    = document.getElementById('flame');
            var canvas_R_context = canvas_R_node.getContext('2d');
            var canvas_S_context = canvas_S_node.getContext('2d');
            var canvas_P_context = canvas_P_node.getContext('2d');
            var canvas_M_context = canvas_M_node.getContext('2d');
            var canvas_F_context = canvas_F_node.getContext('2d');

            var pos_side_X = 0.5;
            var pos_side_Y = 0.5;

            var params = {
                size:  {X: 10, Y: 10},
                solve: {
                    start_X: 0,
                    start_Y: 0,
                    end_X:   9,
                    end_Y:   9
                }
            };

            var makeLabyrinth = function(){
                if (animation_status != 1) return;

                operator.buildProgress();

                canvas_M_context.setTransform(1, 0, 0, 1, pos_side_X, pos_side_Y);
                canvas_M_context.beginPath();
                canvas_M_context.moveTo((operator.progress.from.X * 10), (operator.progress.from.Y * 10));
                canvas_M_context.lineTo((operator.progress.to.X   * 10), (operator.progress.to.Y   * 10));
                canvas_M_context.closePath();
                canvas_M_context.stroke();

                if (operator.progress.built) {
                    canvas_P_context.setTransform(1, 0, 0, 1, pos_side_X, pos_side_Y);
                    canvas_P_context.fillRect((pos_side_X + (params.solve.start_X * 10)), (pos_side_Y + (params.solve.start_Y * 10)), 9, 9);
                    canvas_P_context.fillRect((pos_side_X + (params.solve.end_X   * 10)), (pos_side_Y + (params.solve.end_Y   * 10)), 9, 9);

                    solveLabyrinth();
                } else {
                    setTimeout(makeLabyrinth, 10);
                };
            };

            var makeLabyrinthFix = function(){
                operator.build();

                var directions = [
                    operator._direction_id.R,
                    operator._direction_id.B
                ];

                for (var X = 0; X < params.size.X; X ++) {
                    for (var Y = 0; Y < params.size.Y; Y ++) {
                        directions.forEach(function(direction){
                            if (operator._pillers[X + '.' + Y] & direction) {
                                canvas_M_context.setTransform(1, 0, 0, 1, pos_side_X, pos_side_Y);
                                canvas_M_context.beginPath();
                                canvas_M_context.moveTo((X * 10), (Y * 10));

                                switch (direction) {
                                    case operator._direction_id.R:
                                        canvas_M_context.lineTo(((X + 1) * 10), (Y * 10));
                                        break;

                                    case operator._direction_id.B:
                                        canvas_M_context.lineTo((X * 10), ((Y + 1) * 10));
                                        break;
                                }

                                canvas_M_context.closePath();
                                canvas_M_context.stroke();
                            }
                        });
                    }
                }
            };

            var solveLabyrinth = function(){
                if (animation_status != 1) return;

                operator.solveProgress();

                canvas_S_context.setTransform(1, 0, 0, 1, pos_side_X, pos_side_Y);

                if (operator.progress.solve.elase_coordinate) {
                    var X = pos_side_X + (operator.progress.solve.elase_coordinate.X * 10) - 1;
                    var Y = pos_side_Y + (operator.progress.solve.elase_coordinate.Y * 10) - 1;

                    canvas_S_context.clearRect(X, Y, 11, 11);
                } else {
                    var X = pos_side_X + (operator.progress.solve.coordinate.X * 10);
                    var Y = pos_side_Y + (operator.progress.solve.coordinate.Y * 10);
                    var W = 9;
                    var H = 9;

                    switch (operator.progress.solve.coordinate.D) {
                        case 'T':
                            H += 1;
                            break;

                        case 'R':
                            X -= 1;
                            W += 1;
                            break;

                        case 'B':
                            Y -= 1;
                            H += 1;
                            break;

                        case 'L':
                            W += 1;
                            break;
                    }

                    canvas_S_context.fillRect(X, Y, W, H);
                }

                if (operator.progress.solved) {
                    exportLabyrinth();
                } else {
                    setTimeout(solveLabyrinth, 10);
                }
            };

            var solveLabyrinthFix = function(){
                canvas_P_context.setTransform(1, 0, 0, 1, pos_side_X, pos_side_Y);
                canvas_P_context.fillRect((pos_side_X + (params.solve.start_X * 10)), (pos_side_Y + (params.solve.start_Y * 10)), 9, 9);
                canvas_P_context.fillRect((pos_side_X + (params.solve.end_X   * 10)), (pos_side_Y + (params.solve.end_Y   * 10)), 9, 9);

                operator.solve();

                var fillSolve = function(coordinate, pre_coordinate){
                    canvas_S_context.setTransform(1, 0, 0, 1, pos_side_X, pos_side_Y);

                    var X = pos_side_X + (coordinate.X * 10);
                    var Y = pos_side_Y + (coordinate.Y * 10);
                    var W = 9;
                    var H = 9;

                    if (pre_coordinate) {
                        switch (true) {
                            case (coordinate.Y < pre_coordinate.Y):
                                H += 1;
                                break;

                            case (coordinate.X > pre_coordinate.X):
                                X -= 1;
                                W += 1;
                                break;

                            case (coordinate.Y > pre_coordinate.Y):
                                Y -= 1;
                                H += 1;
                                break;

                            case (coordinate.X < pre_coordinate.X):
                                W += 1;
                                break;
                        }
                    }

                    canvas_S_context.fillRect(X, Y, W, H);
                };

                var pre_solve_coordinate = {X: params.solve.start_X, Y: params.solve.start_Y};

                operator._solve_chain.forEach(function(coordinate){
                    fillSolve(coordinate, pre_solve_coordinate);

                    pre_solve_coordinate = coordinate;
                });

                fillSolve({X: params.solve.end_X, Y: params.solve.end_Y}, pre_solve_coordinate);
            };

            var exportLabyrinth = function(){
                var pillers = operator.export();

                var export_result_node = document.getElementById('maze_export_result');

                for (var Y = -1; Y <= ((params.size.Y * 2) - 1); Y ++) {
                    var tr_node = document.createElement('tr');

                    export_result_node.appendChild(tr_node);

                    for (var X = -1; X <= ((params.size.X * 2) - 1); X ++) {
                        var td_node = document.createElement('td');

                        switch (true) {
                            case (Y == -1):
                            case (X == -1):
                            case (Y == ((params.size.Y * 2) - 1)):
                            case (X == ((params.size.X * 2) - 1)):
                            case (pillers[X][Y] == 0):
                                td_node.className = 'wall';
                                break;
                        }

                        tr_node.appendChild(td_node);
                    }
                }
            };

            var init = function(){
                params.size.X        = parseInt(document.operator.X.value);
                params.size.Y        = parseInt(document.operator.Y.value);
                params.solve.start_X = Math.floor(Math.random() * params.size.X);
                params.solve.start_Y = Math.floor(Math.random() * params.size.Y);
                params.solve.end_X   = Math.floor(Math.random() * params.size.X);
                params.solve.end_Y   = Math.floor(Math.random() * params.size.Y);

                canvas_R_node.setAttribute('width',  ((params.size.X * 10) + 1));
                canvas_R_node.setAttribute('height', ((params.size.Y * 10) + 1));
                canvas_S_node.setAttribute('width',  ((params.size.X * 10) + 1));
                canvas_S_node.setAttribute('height', ((params.size.Y * 10) + 1));
                canvas_P_node.setAttribute('width',  ((params.size.X * 10) + 1));
                canvas_P_node.setAttribute('height', ((params.size.Y * 10) + 1));
                canvas_M_node.setAttribute('width',  ((params.size.X * 10) + 1));
                canvas_M_node.setAttribute('height', ((params.size.Y * 10) + 1));
                canvas_F_node.setAttribute('width',  ((params.size.X * 10) + 1));
                canvas_F_node.setAttribute('height', ((params.size.Y * 10) + 1));

                canvas_R_context.strokeStyle = 'rgb(236, 240, 255)';
                canvas_S_context.fillStyle   = 'rgb( 64, 255, 128)';
                canvas_P_context.fillStyle   = 'rgb(  0, 192,  64)';
                canvas_M_context.strokeStyle = 'rgb(255,   0, 128)';
                canvas_F_context.strokeStyle = 'rgb(  0, 128, 255)';

                for (var X = 1; X < params.size.X; X ++) {
                    canvas_R_context.beginPath();
                    canvas_R_context.moveTo(pos_side_X + (X * 10), pos_side_Y);
                    canvas_R_context.lineTo(pos_side_X + (X * 10), pos_side_Y + (params.size.Y * 10));
                    canvas_R_context.stroke();
                    canvas_R_context.closePath();
                }

                for (var Y = 1; Y < params.size.Y; Y ++) {
                    canvas_R_context.beginPath();
                    canvas_R_context.moveTo(pos_side_X,                        pos_side_Y + (Y * 10));
                    canvas_R_context.lineTo(pos_side_X + (params.size.X * 10), pos_side_Y + (Y * 10));
                    canvas_R_context.stroke();
                    canvas_R_context.closePath();
                }

                canvas_F_context.strokeRect(pos_side_X, pos_side_X, params.size.X * 10, params.size.Y * 10);

                operator.init(params);
            };

            document.operator.make.onclick = function(){
                init();

                canvas_M_context.clearRect(0, 0, ((params.size.X * 10) + 1), ((params.size.Y * 10) + 1));
                canvas_S_context.clearRect(0, 0, ((params.size.X * 10) + 1), ((params.size.Y * 10) + 1));

                animation_status = 1;

                document.getElementById('maze_export_result').style.top = ((params.size.Y * 10) + 10) + 'px';

                //makeLabyrinth();
                makeLabyrinthFix();
                solveLabyrinthFix();

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

            document.operator.export.onclick = function(){
                return false;
            };
        };
    </script>
</HTML>
