<?php

$post = $_POST;

$rgon_side     = isset($post['rgon_side'])     ? (int)$post['rgon_side'] : 5;
$rgon_Y        = isset($post['rgon_Y'])        ? (int)$post['rgon_Y']    : 5;
$rgon_X        = isset($post['rgon_X'])        ? (int)$post['rgon_X']    : 5;
$sect_size     = isset($post['sect_size'])     ? (int)$post['sect_size'] : 12;
$opacity_maze  = isset($post['opacity_maze'])  ? $post['opacity_maze']   : '0.1';
$opacity_space = isset($post['opacity_space']) ? $post['opacity_space']  : '1.0';

?>


<html>
    <head>
        <style type="text/css">
            *{
                margin:             0px;
                padding:            0px;
                color:              #880044;
            }

            div#space{
                width:              100%;
                height:             100%;
                background:         url("./back_redmine.png");
            }

            div#maze{
                position:           absolute;
                top:                0px;
                left:               0px;
                width:              <?php echo $rgon_X * $rgon_side * $sect_size + 1 ?>px;
                height:             <?php echo $rgon_Y * $rgon_side * $sect_size + 1 ?>px;
                overflow:           hidden;
                font-size:          0px;
            }

            div#maze div#sects,
            div#maze div#lines_rgon_Y,
            div#maze div#lines_rgon_X,
            div#maze div#lines_sect_Y,
            div#maze div#lines_sect_X{
                position:           absolute;
                top:                0px;
                left:               0px;
            }

            div#maze div#sects{
                width:              <?php echo $rgon_X * $rgon_side * $sect_size ?>px;
                height:             <?php echo $rgon_Y * $rgon_side * $sect_size ?>px;
            }

            div#maze div#sects div.s{
                float:              left;
                margin:             0px;
                padding:            0px;
                width:              <?php echo $sect_size; ?>px;
                height:             <?php echo $sect_size; ?>px;
                text-align:         center;
                color:              #880044;
            }

            div#maze div#sects div.s_room{
                background-color:   #aaaaff;
            }

            div#maze div#sects div.c,
            div#maze div#lines_X div.c{
                clear:              both;
            }

            div#maze div#lines_rgon_Y{
                width:              <?php echo $rgon_X * $rgon_side * $sect_size + 1 ?>px;
                height:             <?php echo ($rgon_Y + 1) * $rgon_side * $sect_size ?>px;
            }

            div#maze div#lines_rgon_X{
                width:              <?php echo ($rgon_X + 1) * $rgon_side * $sect_size ?>px;
                height:             <?php echo $rgon_Y * $rgon_side * $sect_size ?>px;
            }

            div#maze div#lines_rgon_Y div.line,
            div#maze div#lines_sect_Y div.line{
                width:              100%;
                height:             1px;
                overflow:           hidden;
            }

            div#maze div#lines_rgon_X div.line,
            div#maze div#lines_sect_X div.line{
                float:              left;
                width:              1px;
                height:             100%;
                overflow:           hidden;
            }

            div#maze div#lines_rgon_Y div.line{
                margin-bottom:      <?php echo $rgon_side * $sect_size - 1; ?>px;
                background-color:   #8888aa;
            }

            div#maze div#lines_rgon_X div.line{
                margin-right:       <?php echo $rgon_side * $sect_size - 1; ?>px;
                background-color:   #8888aa;
            }

            div#maze div#lines_sect_Y{
                width:              <?php echo $rgon_X * $rgon_side * $sect_size + 1 ?>px;
                height:             <?php echo $rgon_Y * $rgon_side * ($sect_size + 1) ?>px;
            }

            div#maze div#lines_sect_X{
                width:              <?php echo $rgon_X * $rgon_side * ($sect_size + 1) ?>px;
                height:             <?php echo $rgon_Y * $rgon_side * $sect_size + 1 ?>px;
            }

            div#maze div#lines_sect_Y div.line{
                margin-bottom:      <?php echo $sect_size - 1; ?>px;
                background-color:   #aaaaaa;
            }

            div#maze div#lines_sect_X div.line{
                margin-right:       <?php echo $sect_size - 1; ?>px;
                background-color:   #aaaaaa;
            }

            div#maze div#gauze{
                position:           absolute;
                width:              <?php echo $rgon_X * $rgon_side * $sect_size + 1 ?>px;
                height:             <?php echo $rgon_Y * $rgon_side * $sect_size + 1 ?>px;
            }

            div#operater{
                position:           absolute;
                top:                <?php echo $rgon_Y * $rgon_side * $sect_size + 1 + 10 ?>px;
            }

            div#camouflager{
                position:           absolute;
                top:                42px;
                left:               508px;
                width:              353px;
                height:             60px;
            }
            div#camouflager div#camouflager_D,
            div#camouflager div#camouflager_B{
                height:             30px;
            }
        </style>

        <script type="text/javascript" src="../jquery-1.5.min.js"></script>
        <script type="text/javascript">
            var rgon_side     = <?php echo $rgon_side; ?>;
            var rgon_Y        = <?php echo $rgon_Y; ?>;
            var rgon_X        = <?php echo $rgon_X; ?>;
            var sect_size     = <?php echo $sect_size; ?>;
            var change_lock   = true;
            var change_switch = 'room';
            var slide_lock_D  = true;
            var slide_lock_B  = true;
            var drow_type     = 'write';


            $(document).ready(function(){
                var camouflager_width = parseInt($('#camouflager').css('width').replace('px', ''));
                var camouflager_pos   = $('#camouflager').position().left;
                var sect_params       = new Object();
                var trtrs             = new Object();
                var trtr_id           = new Number(0);
                trtrs[trtr_id]        = new Object();
                for(var v = 0; v < (rgon_Y * rgon_side); v ++){
                    for(var n = 0; n < (rgon_X * rgon_side); n ++){
                        var sect_id = numbers2Id(v, n);
                        sect_params[sect_id] = {'type': 'wall', 'trtr': trtr_id};
                        trtrs[trtr_id][sect_id] = true;
                    }
                }

                $('div#maze').css('opacity', '<?php echo $opacity_maze; ?>');
                $('div#operater').css('opacity', '<?php echo $opacity_maze; ?>');
                $('div#camouflager').css('opacity', '<?php echo $opacity_maze; ?>');
                $('div#space').css('opacity', '<?php echo $opacity_space; ?>');
                $('div#camouflager div#camouflager_D').css('background-color', '#00ddff');
                $('div#camouflager div#camouflager_B').css('background-color', '#44ddcc');
                $('div#operater a#drow_type').text('描');

                $('div#gauze').mousedown(function(event){
                    change_lock = false;
                    switch(event.button){
                        case 2:  change_switch = 'wall'; break;
                        default: change_switch = 'room'; break;
                    }

                    switch(drow_type){
                        case 'write': drowRoom(event); break;
                        case 'paint': drowRoomSwoop(event); break;
                    }
                });

                $('div#camouflager_D').mousedown(function(event){
                    slide_lock_D = false;
                    camouflageD(event);
                });

                $('div#camouflager_B').mousedown(function(event){
                    slide_lock_B = false;
                    camouflageB(event);
                });

                $(document).mouseup(function(){
                    change_lock = true;
                    slide_lock_D  = true;
                    slide_lock_B  = true;
                });

                $('div#gauze').mousemove(function(event){
                    switch(drow_type){
                        case 'write': drowRoom(event); break;
                    }
                });

                $(document).mousemove(function(event){
                    camouflageD(event);
                    camouflageB(event);
                });

                $('div#gauze').bind('contextmenu', function(){
                    return false;
                });

                $('div#operater a#maze_clear').click(function(event){
                    clearRoom(event);

                    return false;
                });

                $('div#operater a#drow_type').click(function(event){
                    changeDrowType(event);

                    return false;
                });


                function drowRoom(event)
                {
                    if(change_lock == false){
                        //var sect_Y        = Math.floor(event.clientY / sect_size);
                        //var sect_X        = Math.floor(event.clientX / sect_size);
                        var sect_Y        = Math.floor(event.pageY / sect_size);
                        var sect_X        = Math.floor(event.pageX / sect_size);
                        var sect_id       = numbers2Id(sect_Y, sect_X);
                        var sect_selector = numbers2Selector(sect_Y, sect_X);
                        var pre_type      = sect_params[sect_id].type;
                        var pre_trtr      = sect_params[sect_id].trtr;

                        switch(change_switch){
                            case 'room':
                                $(sect_selector).addClass('s_room');
                                var post_type = 'room';
                                break;
                            case 'wall':
                                $(sect_selector).removeClass('s_room');
                                var post_type = 'wall';
                                break;
                        }

                        /*if(pre_type != post_type){
                            trtr_id ++;
                            sect_params[sect_id].type = post_type;
                            sect_params[sect_id].trtr = trtr_id;
                            trtrs[trtr_id] = new Object();
                            trtrs[trtr_id][sect_id] = true;
                            delete trtrs[pre_trtr][sect_id];
                            reconfirmTerritory(trtr_id);

                            var zhou_sect_params = getZhouSectParams(sect_id);
                            var divided  = concernDivided(pre_trtr, zhou_sect_params);
                            if(divided == true){
                                reconfirmTerritory(pre_trtr);
                            }
                        }*/
                    }
                }


                function drowRoomSwoop(event)
                {
                    //var sect_Y = Math.floor(event.clientY / sect_size);
                    //var sect_X = Math.floor(event.clientX / sect_size);
                    var sect_Y = Math.floor(event.pageY / sect_size);
                    var sect_X = Math.floor(event.pageX / sect_size);
                    var sect_id  = numbers2Id(sect_Y, sect_X);
                    var sect_trtr = sect_params[sect_id].trtr;

                    for(var sect_id in trtrs[sect_trtr]){
                        var sect_selector = id2Selector(sect_id);
                        sect_params[sect_id].type = 'room';
                        $(sect_selector).addClass('s_room');
                    }

                    reconfirmTerritory(sect_trtr);
                }


                function getZhouSectParams(sect_id)
                {
                    var zhou_sect_params = new Object();
                    var aims = getAims();
                    for(var aim in aims){
                        var zhou_sect_id = slideSectId(sect_id, aim);
                        if(sect_params[zhou_sect_id] == undefined){
                            zhou_sect_params[aim] = null;
                        }else{
                            zhou_sect_params[aim] = sect_params[zhou_sect_id];
                        }
                    }

                    return zhou_sect_params;
                }


                function concernDivided(pre_trtr, zhou_sect_params)
                {
                    var zhou_trtr_cond = new String('');
                    for(var aim in zhou_sect_params){
                        if(zhou_sect_params[aim] == null){
                            zhou_sect = 'F';
                        }else{
                            zhou_sect = (pre_trtr == zhou_sect_params[aim].trtr) ? 'T' : 'F';
                        }

                        if(zhou_sect != zhou_trtr_cond.match(/.$/i)){
                            zhou_trtr_cond += zhou_sect;
                        }
                    }

                    switch(true){
                        case (zhou_trtr_cond.match(/TFT/) != null):
                        case (zhou_trtr_cond.match(/^T.*TF$/) != null):
                        case (zhou_trtr_cond.match(/^FT.*T$/) != null):
                            return true;
                            break;
                        default:
                            return false;
                            break;
                    }
                }


                function concernCombined(post_type, zhou_sect_params)
                {
                    var zhou_trtr_ids = new Array();
                    for(var aim in zhou_sect_params){
                        if(zhou_sect_params[aim] != null){
                            if(post_type == zhou_sect_params[aim].type){
                                zhou_trtr_ids.push(zhou_sect_params[aim].trtr);
                            }
                        }
                    }

                    return zhou_trtr_ids;
                }


                function reconfirmTerritory(target_trtr_id)
                {
                    var temp_sect_params = new Object();
                    var temp_trtrs       = new Object();
                    var temp_trtr_count  = 0;
                    var aims             = getAims(false);
                //document.getElementById('camouflager').innerHTML += '<br />' + target_trtr_id;
                            document.getElementById('camouflager').innerHTML += 'A';
                    for(var sect_id in trtrs[target_trtr_id]){
                    //document.getElementById('camouflager').innerHTML += '|' + target_trtr_id;
                            document.getElementById('camouflager').innerHTML += 'B';
                        var sect_type = sect_params[sect_id].type;
                        for(var aim in aims){
                            document.getElementById('camouflager').innerHTML += 'C';
                            var zhou_sect_id = slideSectId(sect_id, aim);
                            var base_trtr_id = null;
                            for(var temp_trtr_id in temp_trtrs){
                            document.getElementById('camouflager').innerHTML += 'D';
                                if(temp_trtrs[temp_trtr_id][zhou_sect_id] != undefined){
                                    if(base_trtr_id == null){
                                        base_trtr_id = temp_trtr_id;
                                    }else if(base_trtr_id != temp_trtr_id){
                                        for(var temp_sect_id in temp_trtrs[temp_trtr_id]){
                                            temp_sect_params[temp_sect_id] = {'type': sect_type, 'trtr': base_trtr_id};
                                            temp_trtrs[base_trtr_id][temp_sect_id] = true;
                                        }
                                        delete temp_trtrs[temp_trtr_id];
                                    }
                                    temp_sect_params[sect_id] = {'type': sect_type, 'trtr': base_trtr_id};
                                    temp_trtrs[base_trtr_id][sect_id] = true;
                                }
                            }
                            if(base_trtr_id == null){
                            document.getElementById('camouflager').innerHTML += 'E';
                                trtr_id ++;
                                base_trtr_id = trtr_id;
                                temp_sect_params[sect_id] = {'type': sect_type, 'trtr': base_trtr_id};
                                temp_trtrs[base_trtr_id] = new Object();
                                temp_trtrs[base_trtr_id][sect_id] = true;
                    //document.getElementById('camouflager').innerHTML += '<br />' + aim;
                                temp_trtr_count ++;
                            }
                            document.getElementById('camouflager').innerHTML += 'F';
                        }
                            document.getElementById('camouflager').innerHTML += 'G';
                    }
                            document.getElementById('camouflager').innerHTML += 'H';

                    if(temp_trtr_count > 1){
                        for(temp_trtr_id in temp_trtrs){
                            trtrs[temp_trtr_id] = temp_trtrs[temp_trtr_id];
                        }
                        for(temp_sect_id in temp_sect_params){
                            sect_params[temp_sect_id] = temp_sect_params[temp_sect_id];
                        }
                        delete trtrs[target_trtr_id];
                    }
                }


                function numbers2Id(Y, X)
                {
                    return Y + '_' + X;
                }


                function id2Numbers(sect_id)
                {
                    return {
                        'Y': new Number(sect_id.replace(/_.*/i, '')),
                        'X': new Number(sect_id.replace(/.*_/i, ''))
                    }
                }


                function numbers2Selector(Y, X)
                {
                    return '#sect_' + Y + '_' + X;
                }


                function id2Selector(sect_id)
                {
                    var sect_numbers = id2Numbers(sect_id);
                    return '#sect_' + sect_numbers.Y + '_' + sect_numbers.X;
                }


                function getAims(oblique)
                {
                    switch(oblique){
                        case undefined:
                        case true:
                            return {'top': true, 'tor': true, 'rgt': true, 'rgb': true, 'btm': true, 'btl': true, 'lft': true, 'lfp': true};
                            break;
                        case false:
                            return {'top': true, 'rgt': true, 'btm': true, 'lft': true};
                            break;
                    }
                }


                function slideSectId(sect_id, vect)
                {
                    var sect_numbers = id2Numbers(sect_id);
                    switch(vect){
                        case 'top': sect_numbers.Y -= 1; sect_numbers.X += 0; break;
                        case 'tor': sect_numbers.Y -= 1; sect_numbers.X += 1; break;
                        case 'rgt': sect_numbers.Y += 0; sect_numbers.X += 1; break;
                        case 'rgb': sect_numbers.Y += 1; sect_numbers.X += 1; break;
                        case 'btm': sect_numbers.Y += 1; sect_numbers.X += 0; break;
                        case 'btl': sect_numbers.Y += 1; sect_numbers.X -= 1; break;
                        case 'lft': sect_numbers.Y += 0; sect_numbers.X -= 1; break;
                        case 'lfp': sect_numbers.Y -= 1; sect_numbers.X -= 1; break;
                    }

                    return numbers2Id(sect_numbers.Y, sect_numbers.X);
                }


                function camouflageD(event)
                {
                    if(slide_lock_D == false){
                        var mouse_pos = event.pageX - camouflager_pos;
                        if(mouse_pos < 0){
                            mouse_pos = 0;
                        }
                        else if(mouse_pos > camouflager_width){
                            mouse_pos = camouflager_width;
                        }
                        var percentage = Math.floor(mouse_pos / camouflager_width * 10);
                        var opacity_value = (percentage == 10) ? '1.0' : '0.' + (percentage);
                        $('div#maze').css('opacity', opacity_value);
                        $('div#operater').css('opacity', opacity_value);
                        document.operator.opacity_maze.value = opacity_value;
                    }
                }


                function camouflageB(event)
                {
                    if(slide_lock_B == false){
                        var mouse_pos = event.pageX - camouflager_pos;
                        if(mouse_pos < 0){
                            mouse_pos = 0;
                        }
                        else if(mouse_pos > camouflager_width){
                            mouse_pos = camouflager_width;
                        }
                        var percentage = Math.floor(mouse_pos / camouflager_width * 10);
                        var opacity_value = (percentage == 10) ? '1.0' : '0.' + (percentage);
                        $('div#space').css('opacity', opacity_value);
                        document.operator.opacity_space.value = opacity_value;
                    }
                }


                function clearRoom(event)
                {
                    $('div.s').removeClass('s_room');
                }


                function changeDrowType()
                {
                    switch(drow_type){
                        case 'write':
                            drow_type = 'paint';
                            $('div#operater a#drow_type').text('塗');
                            break;
                        case 'paint':
                            drow_type = 'write';
                            $('div#operater a#drow_type').text('描');
                            break;
                    }
                }
            });
        </script>
    </head>
    <body>
        <div id="space">
        </div>
            <div id="maze">
                <div id="sects">
<?php foreach(range(0, $rgon_Y * $rgon_side - 1) as $Y): ?>
    <?php foreach(range(0, $rgon_X * $rgon_side - 1) as $X): ?>
                    <div class="s" id="<?php echo sprintf('sect_%d_%d', $Y, $X); ?>">　</div>
    <?php endforeach; ?>
                    <div class="c"></div>
<?php endforeach; ?>
                </div>

                <div id="lines_sect_Y">
<?php foreach(range(0, $rgon_Y * $rgon_side) as $Y): ?>
                    <div class="line"></div>
<?php endforeach; ?>
                </div>

                <div id="lines_sect_X">
<?php foreach(range(0, $rgon_X * $rgon_side) as $X): ?>
                    <div class="line"></div>
<?php endforeach; ?>
                    <div class="c"></div>
                </div>

                <div id="lines_rgon_Y">
<?php foreach(range(0, $rgon_Y) as $Y): ?>
                    <div class="line"></div>
<?php endforeach; ?>
                </div>

                <div id="lines_rgon_X">
<?php foreach(range(0, $rgon_X) as $X): ?>
                    <div class="line"></div>
<?php endforeach; ?>
                    <div class="c"></div>
                </div>

                <div id="gauze">　</div>
            </div>
            <div id="operater">
                <div>
                    <a id="maze_clear"href="">※</a>
                    <a id="drow_type" href=""></a>
                </div>
                <div>
                    <form action="index.php" method="post" name="operator">
                        <input type="hidden" name="opacity_maze"  value="<?php echo $opacity_maze;  ?>" />
                        <input type="hidden" name="opacity_space" value="<?php echo $opacity_space; ?>" />
                        <table>
                            <tr>
                                <th>rgon_side</th>
                                <td><input type="text" name="rgon_side" size="2" value="<?php echo $rgon_side; ?>" /></td>
                            </tr>
                            <tr>
                                <th>rgon_Y</th>
                                <td><input type="text" name="rgon_Y" size="2" value="<?php echo $rgon_Y; ?>" /></td>
                            </tr>
                            <tr>
                                <th>rgon_X</th>
                                <td><input type="text" name="rgon_X" size="2" value="<?php echo $rgon_X; ?>" /></td>
                            </tr>
                            <tr>
                                <th>sect_size</th>
                                <td><input type="text" name="sect_size" size="2" value="<?php echo $sect_size; ?>" /></td>
                            </tr>
                            <tr>
                                <td colspan"2"><input type="submit" value="送信" /></td>
                            </tr>
                        </table>
                    </form>
                </div>
            </div>

            <div id="camouflager">
                <div id="camouflager_D">　</div>
                <div id="camouflager_B">　</div>
            </div>
    </body>
</html>
