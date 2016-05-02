<?php


require_once dirname(dirname(__FILE__)) . '/18/labyrinth.php';
require_once dirname(__FILE__) . '/labyrinth_test.php';
require_once dirname(__FILE__) . '/component/Dungeon.class.php';
require_once dirname(__FILE__) . '/component/Dungeon_Maze_Manager.class.php';
require_once dirname(__FILE__) . '/component/Dungeon_Maze.class.php';
require_once dirname(__FILE__) . '/component/Dungeon_Maze_Matrix.class.php';
require_once dirname(__FILE__) . '/component/Dungeon_Maze_Object.class.php';
require_once dirname(__FILE__) . '/component/Dungeon_Maze_Object_Road.class.php';
require_once dirname(__FILE__) . '/component/Dungeon_Maze_Object_Room.class.php';
require_once dirname(__FILE__) . '/component/Dungeon_Maze_Object_Stairs.class.php';
require_once dirname(__FILE__) . '/component/Dungeon_Maze_Object_Treasurebox.class.php';
require_once dirname(__FILE__) . '/component/Dungeon_Maze_Object_Wall.class.php';
require_once dirname(__FILE__) . '/component/Dungeon_Embody.class.php';
require_once dirname(__FILE__) . '/component/Dungeon_Data_Dungeon.class.php';
require_once dirname(__FILE__) . '/component/Dungeon_Data_Dungeon_Floor.class.php';
require_once '/home/zhen-xia/works/dungeon/front/component/dungeon/math/Randomizer.class.php';
require_once '/usr/share/pear/Samurai/library/Spyc/spyc.php';
require_once '/home/zhen-xia/public_html/sanbou/sanbou.php';


class Operator
{
    public $Manager;
    public $Maze;

    public $data = array();

    private $PDO;


    public function __construct()
    {
        $this->Manager = new Dungeon_Maze_Manager();
        $this->PDO     = new PDO('mysql:host=localhost; dbname=test', 'zhenxia', 'hMxCRkPft2jv');
    }


    public function init($params)
    {
        $this->Manager->init($params);

        $id = isset($params['id']) ? (int)$params['id'] : null;
        if($id){
            $stmt = $this->PDO->prepare('SELECT * FROM `dungeon_floor` WHERE `id` = :id;');
            $data = $stmt->execute(array(':id' => $id))->fetch(PDO::FETCH_ASSOC);
        }
        else{
            $data = null;
        }

        if($data){
            $this->Maze = $this->Manager->remake($data['map_matrix']);
            $this->id   = $id;
        }
        else{
            $this->Maze = $this->Manager->make();
            $this->deployObjects();
            $this->PDO->beginTransaction();
            try{
                $id = (int)$this->PDO->query('SELECT MAX(`id`) FROM `dungeon_floor`;')->fetchColumn() + 1;
                $stmt = $this->PDO->prepare(
                    'INSERT INTO `dungeon_floor` ' .
                    '(`id`, `map_matrix`, `opened_matrix`, `matrix_objects`) ' .
                    'VALUES (:id, :maze, :visible, :objects);'
                );
                $stmt->execute(array(
                    ':id'        => $id,
                    //'coordinate' => 
                    ':maze'      => $this->Maze->toString(),
                    ':visible'   => $this->Maze->toOpenedString(),
                    ':objects'   => Spyc::YAMLDump($this->Maze->getMatrixObjects())
                ));
                $this->PDO->commit();
            }
            catch(Exception $e){
                $this->PDO->rollBack();
            }
            $this->data['id'] = $id;
        }
    }


    public function deployObjects()
    {
        $rooms = array();
        foreach($this->Maze->getRoom() as $room_coordinate => $objects){
            shuffle($objects);
            $rooms[$room_coordinate] = array(
                'free_count'   => count($objects),
                'free_objects' => $objects,
                'items'        => 0,
                'monsters'     => 0
            );
        }

        // プレイヤー配置
        $player_room   = array_rand($rooms);
        $player_object = array_shift($rooms[$player_room]['free_objects']);
        $player_aims   = array();
        list($player_nex, $player_ver) = explode(',', $player_object->getCoordinate());

        $dcph_aims = array(
            'up'    => 'top',
            'right' => 'rgt',
            'down'  => 'btm',
            'left'  => 'lft'
        );

        foreach($player_object->getAround() as $obj_aim => $object){
            if($object->enableMoveOn()){
                $player_aims[$dcph_aims[$obj_aim]] = true;
            }
        }

        $rooms[$player_room]['free_count'] --;

        $this->data['player'] = array(
            'ver'  => $player_ver,
            'nex'  => $player_nex,
            'aim'  => $dcph_aims[array_rand($dcph_aims)],
            'aims' => $player_aims
        );
    }


    public function display()
    {
        $maze_html  = array();
        $ver_range  = range(0, ($this->Maze->matrix->height - 1));
        $nex_range  = range(0, ($this->Maze->matrix->width  - 1));
        $sects      = $this->Maze->toArray();
        $gate_conds = array(
            'top' => '1000',
            'rgt' => '0100',
            'btm' => '0010',
            'lft' => '0001'
        );

        foreach($ver_range as $ver){
            $line_html = '<div class="s">' . $ver . '</div>';
            foreach($nex_range as $nex){
                $sect = $sects[$ver][$nex];
                switch(true){
                    case $sect->isWall():        $cond = 0; break;
                    case $sect->isRoad():        $cond = 1; break;
                    case $sect->isRoom():        $cond = 1; break;
                    case $sect->isStairs():      $cond = 1; break;
                    case $sect->isTreasurebox(): $cond = 1;
                }
                $line_html .= '<div class="s s' . $cond . '">' . /*$sects[$ver][$nex]->type . */'</div>';
            }
            $line_html .= '<div class="s">' . $ver . '</div><div class="c"></div>';
            $maze_html[] = $line_html;
        }

        $line_head_html = '<div class="s"></div>';
        $line_foot_html = '<div class="s"></div>';
        foreach($nex_range as $nex){
            $line_head_html .= '<div class="s">' . $nex . '</div>';
            $line_foot_html .= '<div class="s">' . $nex . '</div>';
        }
        $line_head_html .= '<div class="c"></div>';
        $line_foot_html .= '<div class="s"></div><div class="c"></div>';

        array_unshift($maze_html, $line_head_html);
        array_push($maze_html, $line_foot_html);
        return implode("\n", $maze_html);
    }
}
