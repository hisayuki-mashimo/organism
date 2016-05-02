var ver_count = 100;
var nex_count = 100;

//迷路構築の為の変数
var _crosses  = new Array;
var _road_ids = new Array;
var _next_crs_ver = '';
var _next_crs_nex = '';
var _trial_keys = new Array;
var _road_id    = '';
var _road_value = '';
var _building = new Object;

//解法の為の変数
var start_ver = '';
var start_nex = '';
var goal_ver  = '';
var goal_nex  = '';
var _road_aim = '';
var _soluting = new Object;

var maze_node_id  = 'maze';
var style_node_id = 'style';
var square_text_node = null;

/**
 * 迷路の初期構成の構築
 */
function construct(ver_count_value, nex_count_value)
{
    var maze_node = document.getElementById(maze_node_id);
    //縦･横の枡数の設定
    if(ver_count != undefined) ver_count = ver_count_value;
    if(nex_count != undefined) nex_count = nex_count_value;
    var squares = '';
    var cross_key = 0;
    //縦の配列を設定する。
    for(var ver = 0; ver <= ver_count; ver++){
        //横の配列を設定する。
        for(var nex = 0; nex <= nex_count; nex++){
            squares = squares+"<SPAN id='"+ver+'.'+nex+"' class='";
            squares = squares+"wall'>";
            if(ver%2 == 1 && nex%2 == 1){
            //交差点プロパティを設定する。
                _crosses[cross_key] = 'wall';
                cross_key++;
            }
            squares = squares+"■</SPAN>";
            if(nex == nex_count){
                squares = squares+"<BR />";
            }
        }
    }
    maze_node.innerHTML = squares;
    _road_ids.push(0);
}





/**
 *
 */
function build()
{
    _build_prepare();
    _building = setInterval(_makeWall, 20);
}


/**
 * 迷路形成の準備設定
 */
function _build_prepare()
{
    var target_cross_key = _getTargetSquare();
    if(target_cross_key != undefined){
        var _road_id = _road_ids.length;
        _road_value = 'road.'+_road_id;
        _crosses[target_cross_key] = _road_value;
        var next_coordinate = crs_key2coord(target_cross_key);
        _next_crs_ver = next_coordinate['ver'];
        _next_crs_nex = next_coordinate['nex'];
        var trial_coordinate = _next_crs_ver+'.'+_next_crs_nex;
        _trial_keys[trial_coordinate] = {'ver': _next_pil_ver, 'nex': _next_pil_nex};
        output(_next_crs_ver, _next_crs_nex, 'awall');
    } else{
        clearInterval(_building);
        searchSolution(1, 1);
    }
}


/**
 * ランダムに未定義の支柱プロパティを取得する。
 */
function _getTargetSquare()
{
    var target_crosses = new Array;
    for(var i = 0; i < _crosses.length; i++){
        if(_crosses[i] == 'wall') target_crosses.push(i);
    }
    if(target_crosses.length != 0){
        var rand = Math.random();
        var count = target_crosses.length;
        var rand_number = Math.floor(count*rand);
        return target_crosses[rand_number];
    }
}


/**
 * 壁の形成
 * 壁が自分自身の中に包まれてしまった場合、形成を諦める。
 * 壁が四方の壁(_road_id = 0)に到達した場合、形成に成功し処理を終える。
 */
function _makeWall()
{
    var aim = _getAim(_next_crs_ver, _next_crs_nex, _road_value);
    //var node = document.getElementById('maze');node.innerHTML = aim;exit;
    if(aim != undefined){
        var _next_road_ver = _next_crs_ver;
        var _next_road_nex = _next_crs_nex;
        switch(aim){
            case 'on':
                _next_road_ver = Number(_next_crs_ver)-1;
                _next_crs_ver  = Number(_next_crs_ver)-2;
                break;
            case 'right':
                _next_road_nex = Number(_next_crs_nex)+1;
                _next_crs_nex  = Number(_next_crs_nex)+2;
                break;
            case 'under':
                _next_road_ver = Number(_next_crs_ver)+1;
                _next_crs_ver  = Number(_next_crs_ver)+2;
                break;
            case 'left':
                _next_road_nex = Number(_next_crs_nex)-1;
                _next_crs_nex  = Number(_next_crs_nex)-2;
                break;
        }
        _trial_keys[_next_wall_ver+'.'+_next_wall_nex] = {'ver': _next_wall_ver, 'nex': _next_wall_nex}
        _trial_keys[_next_pil_ver +'.'+_next_pil_nex]  = {'ver': _next_pil_ver,  'nex': _next_pil_nex}
        var _next_crs_key = coord2crs_key(_next_crs_ver, _next_crs_nex);
        output(_next_road_ver, _next_road_nex, 'awall');
        output(_next_crs_ver,  _next_crs_nex,  'awall');
        if(_crosses[_next_crs_key] == 'road'){
        //壁が四方の壁に到達していなければ、壁の形成を続ける。
            _crosses[_next_crs_key] = _road_value;
        } else{
            _road_ids.push(_road_id);
            _build_prepare();
        }
    } else{
    //進行可能な進路がない場合、壁の形成に失敗
        _build_prepare();
    }
    //var node = document.getElementById('maze');node.innerHTML = 'h';exit;
}


/**
 * 壁の進行可能方向を探し、ランダムに方向を決定する。
 */
function _getAim(ver, nex, cross_value)
{
    var crd_on    = {'ver': Number(ver)-2, 'nex': Number(nex)};
    var crd_right = {'ver': Number(ver),   'nex': Number(nex)+2};
    var crd_under = {'ver': Number(ver)+2, 'nex': Number(nex)};
    var crd_left  = {'ver': Number(ver),   'nex': Number(nex)-2};
    var crs_key_on    = coord2crs_key(crd_on['ver'],    crd_on['nex']);
    var crs_key_right = coord2crs_key(crd_right['ver'], crd_right['nex']);
    var crs_key_under = coord2crs_key(crd_under['ver'], crd_under['nex']);
    var crs_key_left  = coord2crs_key(crd_left['ver'],  crd_left['nex']);
    var aims = new Array;
    if(_crosses[crs_key_on]    != cross_value) aims.push('on');
    if(_crosses[crs_key_right] != cross_value) aims.push('right');
    if(_crosses[crs_key_under] != cross_value) aims.push('under');
    if(_crosses[crs_key_left]  != cross_value) aims.push('left');
    if(aims.length != 0){
        var rand = Math.random();
        var count = aims.length;
        var rand_number = Math.floor(count*rand);
        return aims[rand_number];
    }
}


/**
 * 交差点/キー→座標
 */
function crs_key2coord(crs_key)
{
    //交差点の集合の横列数
    var crs_nex_count = Number(nex_count)/2;
    var crs_ver = Math.floor(Number(crs_key)/Number(crs_nex_count));
    var crs_nex = Number(crs_key)%Number(crs_nex_count);
    return {'ver': crs_ver*2+1, 'nex': crs_nex*2+1};
}


/**
 * 座標→支柱/キー
 */
function coord2crs_key(ver, nex)
{
    var crs_ver = Math.floor(Number(ver)/2);
    var crs_nex = Math.floor(Number(nex)/2);
    var crs_nex_count = Number(nex_count)/2;
    return crs_ver*crs_nex_count+crs_nex;
}


/**
 * 迷路の出力
 */
function output(ver_number, nex_number, square_class)
{
    var square_node = document.getElementById(ver_number+'.'+nex_number);
    square_node.setAttribute('class',     square_class);
    square_node.setAttribute('className', square_class);
}





/**
 * 解法を探す。
 */
function searchSolution()
{
    if(start_ver == '') start_ver = 1;
    if(start_nex == '') start_nex = 1;
    if(goal_ver  == '') goal_ver  = Number(ver_count)-1;
    if(goal_nex  == '') goal_nex  = Number(nex_count)-1;
    if(_road_aim == '') _road_aim = 'under';
    _soluting = setInterval(_searchSolution, 20);
}


/**
 *
 */
function _searchSolution()
{
    output(start_ver, start_nex, 'solute');
    var squr_crd = new Array;
    var road_crd = new Array;
    var ver = Number(start_ver);
    var nex = Number(start_nex);
    if(_road_aim == 'under'){
        squr_crd['left']  = {'ver': ver,   'nex': nex+1};
        squr_crd['front'] = {'ver': ver+1, 'nex': nex};
        squr_crd['right'] = {'ver': ver,   'nex': nex-1};
        squr_crd['back']  = {'ver': ver-1, 'nex': nex};
        road_crd['left']  = {'ver': ver,   'nex': nex+2};
        road_crd['front'] = {'ver': ver+2, 'nex': nex};
        road_crd['right'] = {'ver': ver,   'nex': nex-2};
        road_crd['back']  = {'ver': ver-2, 'nex': nex};
        var aims = {'left': 'right', 'front': 'under', 'right': 'left', 'back': 'on'};
    } else if(_road_aim == 'left'){
        squr_crd['left']  = {'ver': ver+1, 'nex': nex};
        squr_crd['front'] = {'ver': ver,   'nex': nex-1};
        squr_crd['right'] = {'ver': ver-1, 'nex': nex};
        squr_crd['back']  = {'ver': ver,   'nex': nex+1};
        road_crd['left']  = {'ver': ver+2, 'nex': nex};
        road_crd['front'] = {'ver': ver,   'nex': nex-2};
        road_crd['right'] = {'ver': ver-2, 'nex': nex};
        road_crd['back']  = {'ver': ver,   'nex': nex+2};
        var aims = {'left': 'under', 'front': 'left', 'right': 'on', 'back': 'right'};
    } else if(_road_aim == 'on'){
        squr_crd['left']  = {'ver': ver,   'nex': nex-1};
        squr_crd['front'] = {'ver': ver-1, 'nex': nex};
        squr_crd['right'] = {'ver': ver,   'nex': nex+1};
        squr_crd['back']  = {'ver': ver+1, 'nex': nex};
        road_crd['left']  = {'ver': ver,   'nex': nex-2};
        road_crd['front'] = {'ver': ver-2, 'nex': nex};
        road_crd['right'] = {'ver': ver,   'nex': nex+2};
        road_crd['back']  = {'ver': ver+2, 'nex': nex};
        var aims = {'left': 'left', 'front': 'on', 'right': 'right', 'back': 'under'};
    } else if(_road_aim == 'right'){
        squr_crd['left']  = {'ver': ver-1, 'nex': nex};
        squr_crd['front'] = {'ver': ver,   'nex': nex+1};
        squr_crd['right'] = {'ver': ver+1, 'nex': nex};
        squr_crd['back']  = {'ver': ver,   'nex': nex-1};
        road_crd['left']  = {'ver': ver-2, 'nex': nex};
        road_crd['front'] = {'ver': ver,   'nex': nex+2};
        road_crd['right'] = {'ver': ver+2, 'nex': nex};
        road_crd['back']  = {'ver': ver,   'nex': nex-2};
        var aims = {'left': 'on', 'front': 'right', 'right': 'under', 'back': 'left'};
    }
    var square_node = document.getElementById(start_ver+'.'+start_nex);
    for(var aim in aims){
        var ver = squr_crd[aim]['ver'];
        var nex = squr_crd[aim]['nex'];
        var next_square_node = document.getElementById(ver+'.'+nex);
        if(next_square_node != undefined){
            var square_class     = next_square_node.getAttribute('class');
            var square_className = next_square_node.getAttribute('className');
            if(square_class == 'road' || square_class == 'solute' || square_className == 'road' || square_className == 'solute'){
                if(square_class == 'solute'){
                    square_node.setAttribute('class', 'road');
                    square_node.setAttribute('className', 'road');
                    next_square_node.setAttribute('class', 'road');
                    next_square_node.setAttribute('className', 'road');
                } else{
                    next_square_node.setAttribute('class', 'solute');
                    next_square_node.setAttribute('className', 'solute');
                }
                start_ver = ver;
                start_nex = nex;
                _road_aim = aims[aim];
                break;
            }
        }
    }
    if(start_ver == goal_ver && start_nex == goal_nex){
        clearInterval(_soluting);
    }
}




/*var ver_count = 100;
var nex_count = 100;

//迷路構築の為の変数
var _crosses  = new Array;
var _road_ids = new Array;
var _next_crs_ver = '';
var _next_crs_nex = '';
var _trial_keys = new Array;
var _road_id = '';
var _building = new Object;

//解法の為の変数
var start_ver = '';
var start_nex = '';
var goal_ver  = '';
var goal_nex  = '';
var _road_aim = '';
var _soluting = new Object;

var maze_node_id  = 'maze';
var style_node_id = 'style';
var square_text_node = null;


function construct(ver_count_value, nex_count_value)
{
    var maze_node = document.getElementById(maze_node_id);
    //縦･横の枡数の設定
    if(ver_count != undefined) ver_count = ver_count_value;
    if(nex_count != undefined) nex_count = nex_count_value;
    var squares = '';
    var cross_key = 0;
    //縦の配列を設定する。
    for(var ver = 0; ver <= ver_count; ver++){
        //横の配列を設定する。
        for(var nex = 0; nex <= nex_count; nex++){
            squares = squares+"<SPAN id='"+ver+'.'+nex+"' class='";
            squares = squares+"wall'>";
            if(ver%2 == 1 && nex%2 == 1){
            //交差点プロパティを設定する。
                _crosses[cross_key] = 'wall';
                cross_key++;
            }
            squares = squares+"■</SPAN>";
            if(nex == nex_count){
                squares = squares+"<BR />";
            }
        }
    }
    maze_node.innerHTML = squares;
    _road_ids.push(0);
}





function build()
{
    _build_prepare();
    _building = setInterval(_makeWall, 20);
}



function _build_prepare()
{
    var target_cross_key = _getTargetSquare();
    if(target_cross_key != undefined){
        var _road_id = _road_ids.length;
        _road_value = 'wall.'+_road_id;
        _crosses[target_cross_key] = _road_value;
        var next_coordinate = crs_key2coord(target_cross_key);
        _next_crs_ver = next_coordinate['ver'];
        _next_crs_nex = next_coordinate['nex'];
        var trial_coordinate = _next_crs_ver+'.'+_next_crs_nex;
        _trial_keys[trial_coordinate] = {'ver': _next_crs_ver, 'nex': _next_crs_nex};
        output(_next_crs_ver, _next_crs_nex, 'awall');
    } else{
        clearInterval(_building);
        searchSolution(1, 1);
    }
}



function _getTargetSquare()
{
    var target_crosses = new Array;
    for(var i = 0; i < _crosses.length; i++){
        if(_crosses[i] == 'wall') target_crosses.push(i);
    }
    if(target_crosses.length != 0){
        var rand = Math.random();
        var count = target_crosses.length;
        var rand_number = Math.floor(count*rand);
        return target_crosses[rand_number];
    }
}


function _makeWall()
{
    //var node = document.getElementById('maze');node.innerHTML = _next_crs_ver;exit;
    var aim = _getAim(_next_crs_ver, _next_crs_nex, _road_value);
    if(aim != undefined){
        var _next_road_ver = _next_crs_ver;
        var _next_road_nex = _next_crs_nex;
        switch(aim){
            case 'on':
                _next_road_ver = Number(_next_crs_ver)-1;
                _next_crs_ver  = Number(_next_crs_ver)-2;
                break;
            case 'right':
                _next_road_nex = Number(_next_crs_nex)+1;
                _next_crs_nex  = Number(_next_crs_nex)+2;
                break;
            case 'under':
                _next_road_ver = Number(_next_crs_ver)+1;
                _next_crs_ver  = Number(_next_crs_ver)+2;
                break;
            case 'left':
                _next_road_nex = Number(_next_crs_nex)-1;
                _next_crs_nex  = Number(_next_crs_nex)-2;
                break;
        }
        _trial_keys[_next_road_ver+'.'+_next_road_nex] = {'ver': _next_road_ver, 'nex': _next_road_nex}
        _trial_keys[_next_crs_ver +'.'+_next_crs_nex]  = {'ver': _next_crs_ver,  'nex': _next_crs_nex}
        var _next_crs_key = coord2crs_key(_next_crs_ver, _next_crs_nex);
        output(_next_road_ver, _next_road_nex, 'awall');
        output(_next_crs_ver,  _next_crs_nex,  'awall');
        if(_crosses[_next_crs_key] == 'road'){
        //壁が四方の壁に到達していなければ、壁の形成を続ける。
            _crosses[_next_crs_key] = _road_value;
        } else{
            _road_ids.push(_road_id);
            for(var i in _trial_keys){
                var coord = _trial_keys[i];
                output(coord['ver'], coord['nex'], 'wall');
            }
            _trial_keys = new Array;
            _build_prepare();
        }
    } else{
    //進行可能な進路がない場合、壁の形成に失敗
        for(var i in _trial_keys){
            var coord = _trial_keys[i];
            output(coord['ver'], coord['nex'], 'road');
        }
        _trial_keys = new Array;
        _build_prepare();
    }
}


function _getAim(ver, nex, cross_value)
{
    var crd_on    = {'ver': Number(ver)-2, 'nex': Number(nex)};
    var crd_right = {'ver': Number(ver),   'nex': Number(nex)+2};
    var crd_under = {'ver': Number(ver)+2, 'nex': Number(nex)};
    var crd_left  = {'ver': Number(ver),   'nex': Number(nex)-2};
    var crs_key_on    = coord2crs_key(crd_on['ver'],    crd_on['nex']);
    var crs_key_right = coord2crs_key(crd_right['ver'], crd_right['nex']);
    var crs_key_under = coord2crs_key(crd_under['ver'], crd_under['nex']);
    var crs_key_left  = coord2crs_key(crd_left['ver'],  crd_left['nex']);
    var aims = new Array;
    if(_crosses[crs_key_on]    != cross_value) aims.push('on');
    if(_crosses[crs_key_right] != cross_value) aims.push('right');
    if(_crosses[crs_key_under] != cross_value) aims.push('under');
    if(_crosses[crs_key_left]  != cross_value) aims.push('left');
    if(aims.length != 0){
        var rand = Math.random();
        var count = aims.length;
        var rand_number = Math.floor(count*rand);
        return aims[rand_number];
    }
}


function crs_key2coord(crs_key)
{
    //交差点の集合の横列数
    var crs_nex_count = Number(nex_count)/2;
    var crs_ver = Math.floor(Number(crs_key)/Number(crs_nex_count));
    var crs_nex = Number(crs_key)%Number(crs_nex_count);
    return {'ver': crs_ver*2, 'nex': crs_nex*2};
}



function coord2crs_key(ver, nex)
{
    var crs_ver = Number(ver)/2;
    var crs_nex = Number(nex)/2;
    var crs_nex_count = Number(nex_count)/2;
    return crs_ver*crs_nex_count+crs_nex;
}


function output(ver_number, nex_number, square_class)
{
    var square_node = document.getElementById(ver_number+'.'+nex_number);
    square_node.setAttribute('class',     square_class);
    square_node.setAttribute('className', square_class);
}





function searchSolution()
{
    if(start_ver == '') start_ver = 1;
    if(start_nex == '') start_nex = 1;
    if(goal_ver  == '') goal_ver  = Number(ver_count)-1;
    if(goal_nex  == '') goal_nex  = Number(nex_count)-1;
    if(_road_aim == '') _road_aim = 'under';
    _soluting = setInterval(_searchSolution, 20);
}


function _searchSolution()
{
    output(start_ver, start_nex, 'solute');
    var squr_crd = new Array;
    var road_crd   = new Array;
    var ver = Number(start_ver);
    var nex = Number(start_nex);
    if(_road_aim == 'under'){
        squr_crd['left']  = {'ver': ver,   'nex': nex+1};
        squr_crd['front'] = {'ver': ver+1, 'nex': nex};
        squr_crd['right'] = {'ver': ver,   'nex': nex-1};
        squr_crd['back']  = {'ver': ver-1, 'nex': nex};
        road_crd['left']  = {'ver': ver,   'nex': nex+2};
        road_crd['front'] = {'ver': ver+2, 'nex': nex};
        road_crd['right'] = {'ver': ver,   'nex': nex-2};
        road_crd['back']  = {'ver': ver-2, 'nex': nex};
        var aims = {'left': 'right', 'front': 'under', 'right': 'left', 'back': 'on'};
    } else if(_road_aim == 'left'){
        squr_crd['left']  = {'ver': ver+1, 'nex': nex};
        squr_crd['front'] = {'ver': ver,   'nex': nex-1};
        squr_crd['right'] = {'ver': ver-1, 'nex': nex};
        squr_crd['back']  = {'ver': ver,   'nex': nex+1};
        road_crd['left']  = {'ver': ver+2, 'nex': nex};
        road_crd['front'] = {'ver': ver,   'nex': nex-2};
        road_crd['right'] = {'ver': ver-2, 'nex': nex};
        road_crd['back']  = {'ver': ver,   'nex': nex+2};
        var aims = {'left': 'under', 'front': 'left', 'right': 'on', 'back': 'right'};
    } else if(_road_aim == 'on'){
        squr_crd['left']  = {'ver': ver,   'nex': nex-1};
        squr_crd['front'] = {'ver': ver-1, 'nex': nex};
        squr_crd['right'] = {'ver': ver,   'nex': nex+1};
        squr_crd['back']  = {'ver': ver+1, 'nex': nex};
        road_crd['left']  = {'ver': ver,   'nex': nex-2};
        road_crd['front'] = {'ver': ver-2, 'nex': nex};
        road_crd['right'] = {'ver': ver,   'nex': nex+2};
        road_crd['back']  = {'ver': ver+2, 'nex': nex};
        var aims = {'left': 'left', 'front': 'on', 'right': 'right', 'back': 'under'};
    } else if(_road_aim == 'right'){
        squr_crd['left']  = {'ver': ver-1, 'nex': nex};
        squr_crd['front'] = {'ver': ver,   'nex': nex+1};
        squr_crd['right'] = {'ver': ver+1, 'nex': nex};
        squr_crd['back']  = {'ver': ver,   'nex': nex-1};
        road_crd['left']  = {'ver': ver-2, 'nex': nex};
        road_crd['front'] = {'ver': ver,   'nex': nex+2};
        road_crd['right'] = {'ver': ver+2, 'nex': nex};
        road_crd['back']  = {'ver': ver,   'nex': nex-2};
        var aims = {'left': 'on', 'front': 'right', 'right': 'under', 'back': 'left'};
    }
    var square_node = document.getElementById(start_ver+'.'+start_nex);
    for(var aim in aims){
        var ver = squr_crd[aim]['ver'];
        var nex = squr_crd[aim]['nex'];
        var next_square_node = document.getElementById(ver+'.'+nex);
        if(next_square_node != undefined){
            var square_class     = next_square_node.getAttribute('class');
            var square_className = next_square_node.getAttribute('className');
            if(square_class == 'road' || square_class == 'solute' || square_className == 'road' || square_className == 'solute'){
                if(square_class == 'solute'){
                    square_node.setAttribute('class', 'road');
                    square_node.setAttribute('className', 'road');
                    next_square_node.setAttribute('class', 'road');
                    next_square_node.setAttribute('className', 'road');
                } else{
                    next_square_node.setAttribute('class', 'solute');
                    next_square_node.setAttribute('className', 'solute');
                }
                start_ver = ver;
                start_nex = nex;
                _road_aim = aims[aim];
                break;
            }
        }
    }
    if(start_ver == goal_ver && start_nex == goal_nex){
        clearInterval(_soluting);
    }
}*/
