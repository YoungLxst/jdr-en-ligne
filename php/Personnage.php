<?php 

    class Personnage{
        public $nom, $prenom, $classe = "",
        $stat = array(
            "INT" => 0,
            "REF" => 0,
            "DEX" => 0,
            "TECH" => 0,
            "PRES" => 0,
            "VOL" => 0,
            "CHA" => 0,
            "MOUV" => 0,
            "COR" => 0,
            "EMP" => 0,
            "HUM" => 2,
            "PS" => 2
        );

        function setStat($nstat,$var){
            $this->stat[$nstat] = $var;
            /*if($var >=2 && $var <=8){
                $stat[$nstat] = $var;
            }*/
        }

        function setNom($var){
            $this->nom = $var;
        }

        function setPrenom($var){
            $this->prenom = $var;
        }

        function isEmpty(){
            $val = "";
            foreach($this->stat as $key => $value){
                if(empty($value)){
                    return 0;
                }
            }
           return 1; 
        }

        function setHum(){
            $this->stat['HUM'] = (int)$this->stat['EMP']*10;
        }

        function getHum(){
             return $this->stat['HUM'];
        }

        function setPS(){
            $divide = ((int)$this->stat['COR']+(int)$this->stat['VOL'])/2;
            $divide = round($divide,0);
            $point = 10 + (5*$divide);
            $this->stat['PS'] = $point;
        }

        function getPS(){
            return $this->stat['PS'];
        }
    }
?>