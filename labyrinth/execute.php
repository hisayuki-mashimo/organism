<?php
    $maze_file     = dirname(__FILE__).'/program.php';
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
    $maze->searchSolution();
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
                    color: #FF0000;
                }
            //-->
        </STYLE>
    </HEAD>
    <BODY>
        <DIV id='maze'><?php echo $maze->output(); ?></DIV>
        <FORM method='POST' action='http://zhen-xia02.hayabusa-lab.jp/organism/labyrinth/execute.php'>
            <FIELDSET>
                <LEGEND>迷路の規模</LEGEND>
                縦<INPUT type='text' name='ver' size='3' maxlength='3' value=<?php echo $ver; ?> />　
                横<INPUT type='text' name='nex' size='3' maxlength='3' value=<?php echo $nex; ?> />
                <INPUT type='submit' value='迷路の作成' />
            </FIELDSET>
            <FIELDSET>
                <LEGEND>スタイル設定</LEGEND>
                <TABLE>
                    <TR>
                        <TH>letter-spacing</TH>
                        <TD><INPUT type='text' id='letter-spacing' size='3' maxlength='3' value=-2 /></TD>
                    </TR>
                    <TR>
                        <TH>line-height</TH>
                        <TD><INPUT type='text' id='line-height'    size='3' maxlength='3' value=4 /></TD>
                    </TR>
                    <TR>
                        <TH>font-size</TH>
                        <TD><INPUT type='text' id='font-size'      size='3' maxlength='3' value=6 /></TD>
                    </TR>
                    <TR>
                        <TD colspan='3'><INPUT type='button' value='設定' onClick='setStyle4square()' /></TD>
                    </TR>
                </TABLE>
            </FIELDSET>
        </FORM>
    </BODY>
    
    
    <SCRIPT language='JavaScript'>
        <!--
            function setStyle4square()
            {
                var square = document.getElementById('maze');
                var letter_spacing = document.getElementById('letter-spacing').value;
                var line_height    = document.getElementById('line-height').value;
                var font_size      = document.getElementById('font-size').value;
                square.setAttribute('letter-spacing', letter_spacing+'pt');
                square.setAttribute('line-height',    line_height+'pt');
                square.setAttribute('font-size',      font_size+'pt');
                //alert(square.getAttribute('letter-spacing'));
                //square.letter-spacing = document.getElementById('letter-spacing').value;
                //square.line-height    = document.getElementById('line-height').value;
                //square.font-size      = document.getElementById('font-size').value;
            }
        //-->
    </SCRIPT>
</HTML>
