<?php

class Maze
{
    public $labyrinth;

    public $floor;
    public $rooms;


    public function __construct()
    {
        
    }


    public function init($params)
    {
        $this->labyrinth->init($params);
    }


    public function build()
    {
        $this->labyrinth->build();
        $this->rooms = $this->labyrinth->getRooms();
    }


    public function setMonsters($params)
    {
        foreach($params as $param){
            
        }
    }


    public function setItems($params)
    {
        
    }


    public function export()
    {
        
    }
}
