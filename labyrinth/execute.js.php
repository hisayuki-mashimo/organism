<?php
    $validate_file = dirname(__FILE__).'/validate.php';
    include($validate_file);
    if(isset($_POST['ver']) && isset($_POST['nex'])){
        $coordinate = Validate::convalidate($_POST['ver'], $_POST['nex'], 40, 40);
        list($ver, $nex) = array($coordinate['ver'], $coordinate['nex']);
    } else{
        list($ver, $nex) = array(40, 40);
    }
?>


<HTML>
    <HEAD>
        <META http-equiv='content-style-type' content='text/html; charset=UTF-8' />
        <SCRIPT type='text/javascript' src='./program.js'></SCRIPT>
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
        <DIV id='maze'></DIV>
        <FORM method='POST' action='http://zhen-xia02.hayabusa-lab.jp/organism/labyrinth/execute.js.php'>
            <FIELDSET>
                <LEGEND>迷路の規模</LEGEND>
                縦<INPUT type='text' name='ver' size='3' maxlength='3' value=<?php echo $ver; ?> />　
                横<INPUT type='text' name='nex' size='3' maxlength='3' value=<?php echo $nex; ?> />
                <INPUT type='submit' value='迷路の作成' />
            </FIELDSET>
        </FORM>
    </BODY>
    
    
    <SCRIPT type='text/javascript'>
        <!--
            construct(<?php echo $ver; ?>, <?php echo $nex; ?>);
            build();
        //-->
    </SCRIPT>
</HTML>
