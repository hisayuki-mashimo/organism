/**
 * 迷路の画像は縦*横の枡ノードの作成によって表現される。各枡ノードは[0.0]～[n.n]の形のＩＤを保持する。
 * 各々の枡は以下の3種類のプロパティとして分類される。
 *  ①支柱プロパティ
 *      [(偶数).(偶数)]に該当する枡が該当する（0からスタートするため）。値の種類は以下の通り。
 *          'road'      : 壁として定義されていない状態の値。
 *          'wall.(ID)' : 壁として定義された状態の値。(ID)は自身が属している壁のＩＤ。
 *  ②壁／通路可変プロパティ
 *      [(偶数).(奇数)]または[(奇数).(偶数)]に該当する枡が該当する。値の種類は以下の通り。
 *          false：通路である場合。
 *          true ：壁である場合。
 *  ③通路プロパティ
 *      [(奇数).(奇数)]に該当する枡が該当する。①／②以外のプロパティ。値は以下に固定される。
 *          null
 * defineAim : 自身の壁を拡張する方向をランダムで決定する関数
 *          defineAimで決まった方向で対象枡の2枡先にある枡（それは必ず支柱プロパティになる）が、自身と同じBの値を持っている場合、拡張不可をreturnする。
 */
var ver_count = 100;
var nex_count = 100;

//迷路構築の為の変数
var _pillars  = new Array;
var __pillars = new Array;
var _wall_ids = new Array;
var _next_pil_ver = '';
var _next_pil_nex = '';
var _trial_keys = new Array;
var _wall_id    = '';
var _wall_value = '';
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
    if(ver_count_value != undefined) ver_count = ver_count_value;
    if(nex_count_value != undefined) nex_count = nex_count_value;
    var squares = '';
    var pillar_key = 0;
    //縦の配列を設定する。
    for(var ver = 0; ver <= ver_count; ver++){
        //横の配列を設定する。
        for(var nex = 0; nex <= nex_count; nex++){
            squares = squares+"<SPAN id='"+ver+'.'+nex+"' class='";
            if(ver == 0 || ver == ver_count || nex == 0 || nex == nex_count){
            //四方の端を壁にする。
                if(ver%2 == 0 && nex%2 == 0){
                    _pillars[pillar_key]  = 'wall.0';
                    __pillars[pillar_key] = 'wall.0';
                    pillar_key++;
                }
                squares = squares+"wall'>";
            } else if(ver%2 == 0 && nex%2 == 0){
            //支柱プロパティを設定する。
                _pillars[pillar_key]  = 'road';
                __pillars[pillar_key] = 'road';
                pillar_key++;
                squares = squares+"road'>";
            } else{
            //通路プロパティを設定する。
                squares = squares+"road'>";
            }
            squares = squares+"■</SPAN>";
            if(nex == nex_count){
                squares = squares+"<BR />";
            }
        }
    }
    maze_node.innerHTML = squares;
    _wall_ids.push(0);
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
    var target_pillar_key = _getTargetSquare();
    if(target_pillar_key != undefined){
        var _wall_id = _wall_ids.length;
        _wall_value = 'wall.'+_wall_id;
        __pillars[target_pillar_key] = _wall_value;
        var next_coordinate = pil_key2coord(target_pillar_key);
        _next_pil_ver = next_coordinate['ver'];
        _next_pil_nex = next_coordinate['nex'];
        var trial_coordinate = _next_pil_ver+'.'+_next_pil_nex;
        _trial_keys[trial_coordinate] = {'ver': _next_pil_ver, 'nex': _next_pil_nex};
        output(_next_pil_ver, _next_pil_nex, 'awall');
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
    var target_pillars = new Array;
    for(var i = 0; i < __pillars.length; i++){
        if(__pillars[i] == 'road') target_pillars.push(i);
    }
    if(target_pillars.length != 0){
        var rand = Math.random();
        var count = target_pillars.length;
        var rand_number = Math.floor(count*rand);
        return target_pillars[rand_number];
    }
}


/**
 * 壁の形成
 * 壁が自分自身の中に包まれてしまった場合、形成を諦める。
 * 壁が四方の壁(_wall_id = 0)に到達した場合、形成に成功し処理を終える。
 */
function _makeWall()
{
    var aim = _getAim(_next_pil_ver, _next_pil_nex, _wall_value);
    if(aim != undefined){
        var _next_wall_ver = _next_pil_ver;
        var _next_wall_nex = _next_pil_nex;
        switch(aim){
            case 'on':
                _next_wall_ver = Number(_next_pil_ver)-1;
                _next_pil_ver  = Number(_next_pil_ver)-2;
                break;
            case 'right':
                _next_wall_nex = Number(_next_pil_nex)+1;
                _next_pil_nex  = Number(_next_pil_nex)+2;
                break;
            case 'under':
                _next_wall_ver = Number(_next_pil_ver)+1;
                _next_pil_ver  = Number(_next_pil_ver)+2;
                break;
            case 'left':
                _next_wall_nex = Number(_next_pil_nex)-1;
                _next_pil_nex  = Number(_next_pil_nex)-2;
                break;
        }
        _trial_keys[_next_wall_ver+'.'+_next_wall_nex] = {'ver': _next_wall_ver, 'nex': _next_wall_nex}
        _trial_keys[_next_pil_ver +'.'+_next_pil_nex]  = {'ver': _next_pil_ver,  'nex': _next_pil_nex}
        var _next_pil_key = coord2pil_key(_next_pil_ver, _next_pil_nex);
        output(_next_wall_ver, _next_wall_nex, 'awall');
        output(_next_pil_ver,  _next_pil_nex,  'awall');
        if(__pillars[_next_pil_key] == 'road'){
        //壁が四方の壁に到達していなければ、壁の形成を続ける。
            __pillars[_next_pil_key] = _wall_value;
        } else{
            _pillars = __pillars.concat();
            _wall_ids.push(_wall_id);
            __pillars = _pillars.concat();
            for(var i in _trial_keys){
                var coord = _trial_keys[i];
                output(coord['ver'], coord['nex'], 'wall');
            }
            _trial_keys = new Array;
            _build_prepare();
        }
    } else{
    //進行可能な進路がない場合、壁の形成に失敗
        __pillars = _pillars.concat();
        for(var i in _trial_keys){
            var coord = _trial_keys[i];
            output(coord['ver'], coord['nex'], 'road');
        }
        _trial_keys = new Array;
        _build_prepare();
    }
}


/**
 * 壁の進行可能方向を探し、ランダムに方向を決定する。
 */
function _getAim(ver, nex, pillar_value)
{
    var crd_on    = {'ver': Number(ver)-2, 'nex': Number(nex)};
    var crd_right = {'ver': Number(ver),   'nex': Number(nex)+2};
    var crd_under = {'ver': Number(ver)+2, 'nex': Number(nex)};
    var crd_left  = {'ver': Number(ver),   'nex': Number(nex)-2};
    var pil_key_on    = coord2pil_key(crd_on['ver'],    crd_on['nex']);
    var pil_key_right = coord2pil_key(crd_right['ver'], crd_right['nex']);
    var pil_key_under = coord2pil_key(crd_under['ver'], crd_under['nex']);
    var pil_key_left  = coord2pil_key(crd_left['ver'],  crd_left['nex']);
    var aims = new Array;
    if(__pillars[pil_key_on]    != pillar_value) aims.push('on');
    if(__pillars[pil_key_right] != pillar_value) aims.push('right');
    if(__pillars[pil_key_under] != pillar_value) aims.push('under');
    if(__pillars[pil_key_left]  != pillar_value) aims.push('left');
    if(aims.length != 0){
        var rand = Math.random();
        var count = aims.length;
        var rand_number = Math.floor(count*rand);
        return aims[rand_number];
    }
}


/**
 * 支柱/キー→座標
 */
function pil_key2coord(pil_key)
{
    //支柱の集合の横列数
    var pil_nex_count = Number(nex_count)/2+1;
    var pil_ver = Math.floor(Number(pil_key)/Number(pil_nex_count));
    var pil_nex = Number(pil_key)%Number(pil_nex_count);
    return {'ver': pil_ver*2, 'nex': pil_nex*2};
}


/**
 * 座標→支柱/キー
 */
function coord2pil_key(ver, nex)
{
    var pil_ver = Number(ver)/2;
    var pil_nex = Number(nex)/2;
    var pil_nex_count = Number(nex_count)/2+1;
    return pil_ver*pil_nex_count+pil_nex;
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
}
