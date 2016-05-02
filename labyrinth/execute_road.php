<?
    $maze_file     = dirname(__FILE__).'/program_road.php';
    $validate_file = dirname(__FILE__).'/validate.php';
    include($maze_file);
    include($validate_file);
    if(isset($_POST['ver']) && isset($_POST['nex'])){
        $coordinate = Validate::convalidate($_POST['ver'], $_POST['nex'], 40, 40);
        list($ver, $nex) = array($coordinate['ver'], $coordinate['nex']);
    } else{
        list($ver, $nex) = array(40, 40);
    }
    $maze = new maze($ver, $nex);
    $maze->build();
    //$maze->searchSolution();
?>


<HTML>
    <HEAD>
        <META http-equiv='content-style-type' content='text/html; charset=UTF-8' />
        <STYLE type='text/css'>
            <!--
                DIV#maze{
                    letter-spacing: -2pt;
                    line-height: 4pt;
                    font-size: 6pt;
                }
                DIV#maze SPAN{
                    letter-spacing: -2pt;
                    line-height: 4pt;
                    font-size: 6pt;
                }
                DIV#maze SPAN.wall{
                    color: #000000;
                }
                DIV#maze SPAN.awall{
                    color: #FF0080;
                }
                DIV#maze SPAN.road{
                    color: #FFFFFF;
                }
                DIV#maze SPAN.solute{
                    color: #FF0080;
                }
            -->
        </STYLE>
    </HEAD>
    <BODY>
        <DIV id='maze'><? echo $maze->output(); ?></DIV>
        <FORM method='POST' action='http://202.171.139.242/~hisayuki.mashimo/program/maze/execute.php'>
            <FIELDSET>
                <LEGEND>迷路の規模</LEGEND>
                縦<INPUT type='text' name='ver' size='3' maxlength='3' value=<? echo $ver; ?> />　
                横<INPUT type='text' name='nex' size='3' maxlength='3' value=<? echo $nex; ?> />
                <INPUT type='submit' value='迷路の作成' />
            </FIELDSET>
        </FORM>
    </BODY>
</HTML>
