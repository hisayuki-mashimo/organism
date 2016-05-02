<html>
    <head>
        <link rel="stylesheet" type="text/css" href="style.css" />
    </head>

    <body>
        <div id="display">
            <div id="meter">　</div>
            <div id="signal"></div>
            <div id="display_switch"></div>
            <div id="operate_switch"></div>
            <div id="clear"></div>
            <div id="contents">
                <div id="maze"></div>
                <div id="memory">
                    <button href="">保存</button>
                </div>
                <div id="log"></div>
                <div id="debug"></div>
            </div>
            <div id="operate">
                <form action="" method="post" name="params">
                    <table>
                        <tr class="odd">
                            <td class="number"><div>1</div></td>
                            <td class="title"><div><a href="">管区の数</a></div><ul><li><a href="" class="edit">編集</a></li><li class="ser"> | </li><li><a href="" class="delete">削除</a></li><li class="ser"> | </li><li><a href="" class="preview">プレビュー</a></li></ul></td>
                            <td class="value"><div>region/count</div><ul><li>縦: <input type="text" name="rgon_ver" size="2" value="4" />&nbsp;&nbsp;横: <input type="text" name="rgon_nex" size="2" value="4" /></li></ul></td>
                            <td class="date"><div>2011/03/10 20:33</div></td>
                        </tr>
                        <tr class="even">
                            <td class="number"><div>2</div></td>
                            <td class="title"><div><a href="">管区の規模</a></div><ul><li><a href="" class="edit">編集</a></li><li class="ser"> | </li><li><a href="" class="delete">削除</a></li><li class="ser"> | </li><li><a href="" class="preview">プレビュー</a></li></ul></td>
                            <td class="value"><div>region/side</div><ul><li><input type="text" name="rgon_side" size="2" value="10" /></li></ul></td>
                            <td class="date"><div>2011/03/04 11:16</div></td>
                        </tr>
                        <tr class="odd">
                            <td class="number"><div>3</div></td>
                            <td class="title"><div><a href="">部屋の個数</a></div><ul><li><a href="" class="edit">編集</a></li><li class="ser"> | </li><li><a href="" class="delete">削除</a></li><li class="ser"> | </li><li><a href="" class="preview">プレビュー</a></li></ul></td>
                            <td class="value"><div>room/count</div><ul><li><input type="text" name="room_count" size="2" value="10" /></li></ul></td>
                            <td class="date"><div>2011/02/23 06:28</div></td>
                        </tr>
                        <tr class="even">
                            <td class="number"><div>4</div></td>
                            <td class="title"><div><a href="">部屋の最大幅</a></div><ul><li><a href="" class="edit">編集</a></li><li class="ser"> | </li><li><a href="" class="delete">削除</a></li><li class="ser"> | </li><li><a href="" class="preview">プレビュー</a></li></ul></td>
                            <td class="value"><div>room/side/max</div><ul><li><input type="text" name="room_side_max" size="2" value="2" /></li></ul></td>
                            <td class="date"><div>2011/02/23 06:28</div></td>
                        </tr>
                        <tr class="odd">
                            <td class="number"><div>5</div></td>
                            <td class="title"><div><a href="">部屋の面積の分布</a></div><ul><li><a href="" class="edit">編集</a></li><li class="ser"> | </li><li><a href="" class="delete">削除</a></li><li class="ser"> | </li><li><a href="" class="preview">プレビュー</a></li></ul></td>
                            <td class="value"><div>room/area/dispersion</div><ul><li><input type="text" name="room_area_disp" size="20" value="" /></li></ul></td>
                            <td class="date"><div>2011/03/16 19:43</div></td>
                        </tr>
                        <tr class="even">
                            <td class="number"><div>6</div></td>
                            <td class="title"><div><a href="">部屋のパディング</a></div><ul><li><a href="" class="edit">編集</a></li><li class="ser"> | </li><li><a href="" class="delete">削除</a></li><li class="ser"> | </li><li><a href="" class="preview">プレビュー</a></li></ul></td>
                            <td class="value"><div>room/padding/min</div><ul><li>最小: <input type="text" name="room_pdng_min"  size="1" value="0" />&nbsp;&nbsp;最大: <input type="text" name="room_pdng_max"  size="4" value="3" /></li></ul></td>
                            <td class="date"><div>2011/02/23 06:28</div></td>
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    </body>

    <script type="text/javascript" src="../jquery-1.5.min.js"></script>
    <script type="text/javascript" src="function.js"></script>
    <script type="text/javascript">
        var SignalOperator   = new Signal();
        var MeterOperator    = new Meter();
        var SwitchOperator   = new Switcher();
        var Camouflager      = new Camouflager();

        SwitchOperator.change('display');
        SwitchOperator.change('operate');
        MeterOperator.reflect();
        SignalOperator.connect();
    </script>
</html>
