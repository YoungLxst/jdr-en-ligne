<?php
    include "connection.php";
    include "Personnage.php";
    $errorLog = array(
        "nom_error" => "",
        "prenom_error" => "",
        "INT_error" => "",
        "REF_error" => "",
        "DEX_error" => "",
        "TECH_error" => "",
        "PRES_error" => "",
        "VOL_error" => "",
        "MOUV_error" => "",
        "COR_error" => "",
        "CHA_error" => "",
        "EMP_error" => "",
        "CARA_error" => "",
        "QUERY_error" => "",
        "success" => true,
    );
    $newPers = new Personnage();
    $newPers->setNom(verifyInput(mysqli_real_escape_string($conn,$_POST['nom'])));
    $newPers->setPrenom(verifyInput(mysqli_real_escape_string($conn,$_POST['prenom'])));
    $newPers->setStat('INT',mysqli_real_escape_string($conn,$_POST['int']));
    $newPers->setStat('REF',mysqli_real_escape_string($conn,$_POST['ref']));
    $newPers->setStat('DEX',mysqli_real_escape_string($conn,$_POST['dex']));
    $newPers->setStat('TECH',mysqli_real_escape_string($conn,$_POST['tech']));
    $newPers->setStat('PRES',mysqli_real_escape_string($conn,$_POST['pres']));
    $newPers->setStat('VOL',mysqli_real_escape_string($conn,$_POST['vol']));
    $newPers->setStat('CHA',mysqli_real_escape_string($conn,$_POST['cha']));
    $newPers->setStat('MOUV',mysqli_real_escape_string($conn,$_POST['mouv']));
    $newPers->setStat('COR',mysqli_real_escape_string($conn,$_POST['cor']));
    $newPers->setStat('EMP',mysqli_real_escape_string($conn,$_POST['emp']));
    
    if(!empty($newPers->nom) && !empty($newPers->prenom) && $newPers->isEmpty()){
        checkStat($newPers->stat);
        if($errorLog['success']){
            $randomId = (int)110000 + (int)random_int(0,10000);

            $newPers->setHum(); $newPers->setPS();
            $sql = 'INSERT INTO personnages (nom, prenom, intelligence, volonte, prestance, empathie, reflexes, chance, corps, dexterite, mouvement, technique, humanite, PS, id, idCompte) VALUES ("'.$newPers->nom.'","'.$newPers->prenom.'",'.$newPers->stat['INT'].','.$newPers->stat['VOL'].','.$newPers->stat['PRES'].','.$newPers->stat['EMP'].','.$newPers->stat['REF'].','.$newPers->stat['CHA'].','.$newPers->stat['COR'].','.$newPers->stat['DEX'].','.$newPers->stat['MOUV'].','.$newPers->stat['TECH'].','.$newPers->getHum().','.$newPers->getPS().','.$randomId.', 1)';
            $sql2 = mysqli_query($conn,$sql);
            if($sql2){
                //echo "success";
            }else{
                $errorLog['success'] = false;
                $errorLog['QUERY_error'] = "error in query";
            }
        }
    }else{
        $errorLog['success'] = false;
        if(empty($newPers->nom)) $errorLog['nom_error'] = "nom manquant";
        if(empty($newPers->prenom)) $errorLog['prenom_error'] = "prenom manquant";
        checkStat($newPers->stat);
    }

    function checkStat($stat){
        $somme = 0;
        global $errorLog;
        foreach($stat as $key => $value){
            if($value <2 || $value >8){
                $errorLog['success'] = false;
                $errorName = $key.'_error';
                $errorLog[$errorName]= 'doit etre entre 2 et 8';
            }
            $somme = (int)$somme + (int)$value;
        }
        if($somme != 66){
            $errorLog['success'] = false;
            $errorLog['CARA_error'] = "vous devez placer 62 points de cara";
        }
    }
    echo json_encode($errorLog);
?>