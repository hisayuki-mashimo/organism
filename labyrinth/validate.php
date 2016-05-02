<?php
    class Validate
    {
        /**
         *
         */
        public function __construct()
        {
            
        }
        
        
        /**
         *
         */
        static function convalidate($ver, $nex, $default_ver=40, $default_nex=40)
        {
            $coordinate = array(
                'ver' => preg_replace('/[^0-9]+/', '', $ver),
                'nex' => preg_replace('/[^0-9]+/', '', $nex));
            $default_coordinate = array(
                'ver' => $default_ver,
                'nex' => $default_nex);
            foreach($coordinate as $key => $number){
                if($number == '')  $number = $default_coordinate[$key];
                if($number < 4)    $number = 4;
                if($number > 200)  $number = 200;
                if($number%2 == 1) $number++;
                $coordinate[$key] = intval($number);
            }
            return $coordinate;
        }
    }
?>
