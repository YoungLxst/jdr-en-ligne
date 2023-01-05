<?php 
    $conn = mysqli_connect("localhost","root","","choomba");
    if(!$conn){
        echo "database not conect" . mysqli_connect_error();
    }

    function verifyInput($var){
        $var = trim($var);
        $var = stripslashes($var);
        $var = htmlspecialchars($var);

        return $var;
    }
?>