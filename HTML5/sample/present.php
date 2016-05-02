<html>
    <head>
        <link rel="stylesheet" href="style.css" type="text/css" />
    </head>
    <body>
        <div class="h1">
            WEBアプリ上でのPHP・JavaScript比較(直感的な話ですので正確な説明ではありません。)
        </div>

        <table>
            <tr>
                <th></th>
                <th class="td_C">PHP</th>
                <th class="td_C">JavaScript</th>
                <th class="td_C">備考</th>
            </tr>
            <tr>
                <th>動く場所</th>
                <td class="td_C">サーバー</td>
                <td class="td_C">各PCのブラウザ</td>
                <td class="td_L GRAY"></td>
            </tr>
            <tr>
                <th>足し算／引き算</th>
                <td class="td_C">○</td>
                <td class="td_C">○</td>
                <td class="td_L" rowspan="2">
                    その他の言語同様、記述の仕方や判別処理に共通点は多い<br />
                    [ A = B; ]<br />
                    [ if( … ){ …… } ]
                </td>
            </tr>
            <tr>
                <th>Yes/No判断</th>
                <td class="td_C">○</td>
                <td class="td_C">○</td>
            </tr>
            <!--<tr>
                <th>文章を作る</th>
                <td class="td_C">○</td>
                <td class="td_C">○</td>
                <td class="td_L">両者:出力はHTML　JS:<a href="javascript:alert('Javascript');">アラートが可能</a></td>
            </tr>-->
            <tr>
                <th>ファイル作成</th>
                <td class="td_C">○</td>
                <td class="td_C">○</td>
                <td class="td_L">JS:HTML5～ webストレージでローカルに保存可能</td>
            </tr>
            <tr>
                <th>DBアクセス</th>
                <td class="td_C">○</td>
                <td class="td_C">×</td>
                <td class="td_L GRAY"></td>
            </tr>
            <tr>
                <th>HTML書き出し</th>
                <td class="td_C">○</td>
                <td class="td_C">○</td>
                <td class="td_L">PHP:設計図を作成 &raquo; ブラウザ:ページに起こす<br />JS:改竄</td>
            </tr>
            <tr>
                <th>HTML上でテトリス</th>
                <td class="td_C">×</td>
                <td class="td_C">○</td>
                <td class="td_L GRAY"></td>
            </tr>
            <tr>
                <th>HTML上で迷路作成</th>
                <td><a href="http://zhen-xia.hayabusa-lab.jp/organism/labyrinth/execute.php">○</a></td>
                <td><a href="http://zhen-xia.hayabusa-lab.jp/organism/labyrinth/execute.js.php">○</a></td>
                <td class="td_L GRAY"></td>
            </tr>
            <!--<tr>
                <th>ロケーション</th>
                <td class="td_C">○</td>
                <td class="td_C">○</td>
                <td class="td_L GRAY"></td>
            </tr>-->
        </table>

        <div class="h1">
            HTML5で可能となる処理
        </div>
        <table>
            <tr>
                <th>機能</td>
                <th>備考</td>
            </tr>
            <tr>
                <td class="td_L">データ記憶機能サポート(JavaScriptにて実現)</td>
                <td class="td_L">
                    ・『<a href="http://www.htmq.com/webstorage/">Web Storage</a>』<br />
                    ・『<a href="http://www.htmq.com/IndexedDB/">Indexed Database API</a>』<br />
                    ・『Web SQL Database』(実装中止)<br />
                </td>
            </tr>
            <tr>
                <td class="td_L">ドラッグ＆ドロップ(JavaScriptとの連携)</td>
                <td class="td_L"><a href="http://zhen-xia.hayabusa-lab.jp/organism/HTML5/sample/DRA.html">サンプル</a></td>
            </tr>
            <tr>
                <td class="td_L">並列処理(JavaScriptにて実現)</td>
                <td class="td_L">『<a href="http://www.atmarkit.co.jp/fdotnet/chushin/introhtml5_07/introhtml5_07_01.html">Web Workers</a>』</td>
            </tr>
            <tr>
                <td class="td_L" rowspan="6">canvas(JavaScriptとの連携)</td>
                <td class="td_L">
                    [デモ]
                    <a href="http://zhen-xia.hayabusa-lab.jp/organism/rakka/execute.php">B</a>
                    &raquo;
                    <a href="http://zhen-xia.hayabusa-lab.jp/organism/nenlin/execute.php">A</a>
                </td>
            </tr>
            <tr>
                <td class="td_L"><a href="http://zhen-xia.hayabusa-lab.jp/organism/HTML5/sample/test1.html">サンプル①</a></td>
            </tr>
            <tr>
                <td class="td_L"><a href="http://zhen-xia.hayabusa-lab.jp/organism/HTML5/sample/test2_1.html">サンプル②</a></td>
            </tr>
            <tr>
                <td class="td_L"><a href="http://zhen-xia.hayabusa-lab.jp/organism/HTML5/sample/test2_2.html">サンプル③</a></td>
            </tr>
            <tr>
                <td class="td_L"><a href="http://zhen-xia.hayabusa-lab.jp/organism/HTML5/sample/test2_3.html">サンプル④</a></td>
            </tr>
            <tr>
                <td class="td_L"><a href="http://zhen-xia.hayabusa-lab.jp/organism/HTML5/sample/CAN.php">ロジック解説</a></td>
            </tr>
            <!--<tr>
                <td class="td_L">まとめ</td>
                <td class="td_L"><a href="http://zhen-xia.hayabusa-lab.jp/organism/cruise/">サンプル</a></td>
            </tr>-->
        </table>
    </body>
</html>




