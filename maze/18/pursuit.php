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
            'rgon_ver'       => 3,
            'rgon_nex'       => 3,
            'rgon_side'      => 8,
            'room_count'     => 6,
            'room_side_max'  => 2,
            'room_area_disp' => '',
            'room_pdng_min'  => 0,
            'room_pdng_max'  => 2
        );
        $this->init($params);
        $this->build();
        $result = $this->export();
        $lines  = array();
        $group = array();
        $dense = false;
        foreach(explode("\n", $result) as $v => $line){
            $lines[$v] = str_split($line);
            foreach($lines[$v] as $n => $type){
                $now_coord = $v . '_' . $n; $zhou_coords = array($now_coord);
                $top_coord = $this->_getCoord($now_coord, 'top'); $zhou_coords[] = $top_coord;
                $lft_coord = $this->_getCoord($now_coord, 'lft'); $zhou_coords[] = $lft_coord;
                $ltp_coord = $this->_getCoord($top_coord, 'lft'); $zhou_coords[] = $ltp_coord;
                $zhou_coords = array(
                    array('v' => $v,       'n' => $n),
                    array('v' => ($v - 1), 'n' => $n),
                    array('v' => $v,       'n' => ($n - 1)),
                    array('v' => ($v - 1), 'n' => ($n - 1))
                );
                $conds = array('D' => 0, 'M' => 0);
                foreach($zhou_coords as $zhou){
                    if(isset($lines[$zhou['v']][$zhou['n']])){
                        switch($lines[$zhou['v']][$zhou['n']]){
                            case ($this->_type_road): $conds['D'] += 1; break;
                            case ($this->_type_room): $conds['M'] += 1;
                        }
                    }
                }
                if(($conds['M'] < 4) && (($conds['D'] + $conds['M']) >= 4)){
                    $dense = true;
                    break 2;
                }
                if($type != 0){
                    $belongs = array();
                    foreach($group as $key => $coords){
                        if(isset($coords[$top_coord])){ $group[$key][$now_coord] = true; $belongs[] = $key; continue; }
                        if(isset($coords[$lft_coord])){ $group[$key][$now_coord] = true; $belongs[] = $key; }
                    }
                    switch(true){
                        case(count($belongs) == 2):
                            $group[$belongs[0]] = array_merge($group[$belongs[0]], $group[$belongs[1]]);
                            unset($group[$belongs[1]]);
                            break;
                        case (count($belongs) == 0):
                            $group[] = array($now_coord => true);
                    }
                }
            }
        }
        if(($dense == true) || (count($group) > 1)){
            $this->errored_params = array(
                'maze'   => $this->dump(),
                'logs'   => $this->_log,
                'params' => json_encode(array(
                    '_sect_tiles' => $this->_sect_tiles,
                    '_rgon_tiles' => $this->_rgon_tiles,
                    '_room_tiles' => $this->_room_tiles,
                    '_room_chain' => $this->_room_chain,
                    '_road_tiles' => $this->_road_tiles,
                    '_gate_tiles' => $this->_gate_tiles,
                    '_gate_tasks' => $this->_gate_tasks,
                    '_gate_cands' => $this->_gate_cands
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
    echo $returns . $zeros . $n;
    $Pursuiter = new Pursuiter();
    $Pursuiter->pursuite();
    if($Pursuiter->errored_params){
        echo "E\n" . $zeros . $n;
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
            #            <div id="clear"></div>
            #            <div id="contents">
            #                <div id="maze">%s</div>
            #                <div id="log">%s</div>
            #            </div>
            #        </div>
            #    </body>

            #    <script type="text/javascript" src="../jquery-1.5.min.js"></script>
            #    <script type="text/javascript" src="function.js"></script>
            #    <script type="text/javascript">
            #        var MeterOperator     = new Meter();
            #        var NavigatorOperator = new Navigator();

            #        MeterOperator.reflect();
            #        NavigatorOperator.maze = $("#maze").get(0);
            #        NavigatorOperator.configure();
            #    </script>
            #</html>
        ');
        $html = sprintf($html, $params['maze'], ($params['logs'] . '<br />' . $params['params']));
        $html = preg_replace('/href="/', 'href="../', $html);
        $html = preg_replace('/src="/',  'src="../',  $html);

        $dir_path = '/home/zhen-xia/public_html/organism/maze/18/logs';
        $files = scandir($dir_path);
        $file_count = count($files) - 2;
        $file_name = date('Y_m_d_H_i_s') . '_' . $file_count . '.html';

        file_put_contents($dir_path . '/' . $file_name, $html);
        chmod($dir_path . '/' . $file_name, 0777);
    }
}
echo "\n";
