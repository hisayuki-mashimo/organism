<?php

if(! isset($_POST)){
    $_POST = array();
}
$_POST['pursuite'] = true;
require_once '/home/zhen-xia/public_html/sanbou/sanbou.php';
require_once dirname(__FILE__) . '/labyrinth_test.php';




class Pursuiter extends Labyrinth_Test
{
    public $errored_params = null;


    public function __construct()
    {
        Labyrinth::__construct();
    }


    public function pursuite()
    {
        $params = array(
            'rgon_Y'         => 3,
            'rgon_X'         => 3,
            'rgon_side'      => 8,
            'room_count'     => 6,
            'room_side_max'  => 2,
            'room_area_disp' => array(1 => 2, 2 => 2),
            'room_pdng_min'  => 0,
            'room_pdng_max'  => 2
        );
        $this->init($params);
        $this->build();
        $result = $this->export();



/*$result = preg_replace("/(^\n|\n$)/", '',
    preg_replace('/■/', '2',
        preg_replace('/□/', '1',
             preg_replace('/　/', '0', '
　　　　　　　　　　　　　　　　　　　　■■■■
　　　　　　　　　　　　　　　□□□□□■■■■
　　■■■■■■■■■■■■　□　　　　■■■■
　　■■■■■■■■■■■■□□　　　　　□　　
　　■■■■■■■■■■■■　　　　　　　□　　
　　■■■■■■■■■■■■　　　　　　　□　　
　　■■■■■■■■■■■■　　　　　　　□　　
　　　□　　　　　□　　　　　　　　　　　□　　
　　　□□　　　　□　　　　　　　　　　　□　　
　　　　□　　　　□□□□□　□□□□□□□　　
　　　■■■■■　　　□　□　□　　　　　　　　
　　　■■■■■□□□□　□　□　　　　　　　　
　　　■■■■■　　□　　□□□　　　　　　　　
　　　■■■■■　　□　　　　　　　　　　　　　
　　　■■■■■　　□　　　　　　　　　　　　　
　　　　□　　　□□□　　　　　　　　　　　　　
　　　　□　　　□　　　　　　　　　　　　　　　
　　　　□　　　□　　　　　　　　　　　　　　　
　　　□□　　　□　　　　　　　　　　　　　　　
　　　□　　　　□　　　　　　　　　　　　　　　
　　■■■　□□□　　　　　　　　　　　　　　　
　　■■■□□　　　　　　　　　　　　　　　　　
　　■■■　　　　　　　　　　　　　　　　　　　
　　　　　　　　　　　　　　　　　　　　　　　　
             ')
        )
    )
);*/



        $lines = array();
        $group = array();
        $dense = false;
        foreach(explode("\n", $result) as $YN => $line){
            $lines[$YN] = str_split($line);
            foreach($lines[$YN] as $XN => $type){
                list($YT, $XT) = $this->_slide($YN, $XN, 'T');
                list($YL, $XL) = $this->_slide($YN, $XN, 'L');
                list($YC, $XC) = $this->_slide($YT, $XT, 'L');
                $zhou_poses = array(
                    array($YN, $XN),
                    array($YT, $XT),
                    array($YL, $XL),
                    array($YC, $XC)
                );
                $conds = array('D' => 0, 'M' => 0);
                foreach($zhou_poses as $pos){
                    list($YZ, $XZ) = $pos;
                    if(isset($lines[$YZ][$XZ])){
                        switch($lines[$YZ][$XZ]){
                            case ($this->_type_road): $conds['D'] += 1; break;
                            case ($this->_type_room): $conds['M'] += 1; break;
                        }
                    }
                }
                if(($conds['M'] < 4) && (($conds['D'] + $conds['M']) >= 4)){
                    $dense = true;
                    break 2;
                }
                if($type != 0){
                    $belongs = array();
                    foreach($group as $key => $poses){
                        if(isset($poses[($YT . '_' . $XT)])){ $group[$key][($YN . '_' . $XN)] = true; $belongs[] = $key; continue; }
                        if(isset($poses[($YL . '_' . $XL)])){ $group[$key][($YN . '_' . $XN)] = true; $belongs[] = $key; continue; }
                    }
                    switch(true){
                        case(count($belongs) == 2):
                            $group[$belongs[0]] = array_merge($group[$belongs[0]], $group[$belongs[1]]);
                            unset($group[$belongs[1]]);
                            break;
                        case (count($belongs) == 0):
                            $group[] = array(($YN . '_' . $XN) => true);
                            break;
                    }
                }
            }
        }
        if(($dense == true) || (count($group) > 1)){
            $error_type = 0;
            $error_type += ($dense == true) ? 1: 0;
            $error_type += (count($group) > 1) ? 2 : 0;
            $this->errored_params = array(
                'type'   => $error_type,
                'maze'   => $this->dump(),
                'logs'   => $this->_log,
                'params' => json_encode(array(
                    '_room_chain' => $this->_room_chain,
                    '_gate_tasks' => $this->_gate_tasks
                )),
            );
        }
    }
}




$count    = (isset($argv[1])) ? intval($argv[1]) : 1;
$zeros    = str_repeat('0', (strlen($count) - 1));
$returns  = str_repeat("\r", strlen($count));
$division = 10;
echo "\n" . $returns . 0;
for($n = 1; $n <= $count; $n ++){
    if($n == $division){
        $zeros = substr($zeros, 0, (strlen($zeros) - 1));
        $division *= 10;
    }
    echo sprintf('%s%s%d', $returns, $zeros, $n);
    $Pursuiter = new Pursuiter();
    $Pursuiter->pursuite();
    if($Pursuiter->errored_params){
        echo sprintf("E(%d)\n%s%d", $Pursuiter->errored_params['type'], $zeros, $n);
        $params = $Pursuiter->errored_params;
        $html = preg_replace("/(^\n|\n$| +#)/", '', '
            #<html>
            #    <head>
            #        <link rel="stylesheet" type="text/css" href="style.css" />
            #    </head>

            #    <body>
            #        <div id="display">
            #            <div id="meter">　</div>
            #            <div id="signal"></div>
            #            <div id="display_switch"></div>
            #            <div id="clear"></div>
            #            <div id="contents">
            #                <div id="maze">%s</div>
            #                <div id="log">%s</div>
            #                <div id="debug">%s</div>
            #            </div>
            #        </div>
            #    </body>

            #    <script type="text/javascript" src="../jquery-1.5.min.js"></script>
            #    <script type="text/javascript" src="function.js"></script>
            #    <script type="text/javascript">
            #        var MeterOperator     = new Meter();
            #        var SwitchOperator    = new Switcher();
            #        var NavigatorOperator = new Navigator();

            #        SwitchOperator.change("display");
            #        MeterOperator.reflect();
            #        NavigatorOperator.maze = $("#maze").get(0);
            #        NavigatorOperator.configure(%s);
            #    </script>
            #</html>
        ');

        $maze_params = sprintf(
            "{'rgon_Y': %s, 'rgon_X': %s, 'rgon_side': %s}",
            $Pursuiter->rgon_scales['Y'],
            $Pursuiter->rgon_scales['X'],
            $Pursuiter->rgon_side
        );

        $maze_node_params = explode('#|#', $params['maze']);
        $maze_node  = $maze_node_params[1];
        $log_node   = $maze_node_params[2];
        $debug_node = preg_replace('/---$/', '', $maze_node_params[0]);

        $html = sprintf($html, $maze_node, $log_node, $debug_node, $maze_params);
        $html = preg_replace('/href="/', 'href="../', $html);
        $html = preg_replace('/src="/',  'src="../',  $html);

        $dir_path = '/home/zhen-xia/public_html/organism/maze/19/logs';
        $files = scandir($dir_path);
        $file_count = count($files) - 2;
        $file_name = date('Y_m_d_H_i_s') . '_' . $file_count . '.html';

        file_put_contents($dir_path . '/' . $file_name, $html);
        chmod($dir_path . '/' . $file_name, 0777);
    }
}
echo "\n";
