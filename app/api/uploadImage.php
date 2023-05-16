<?php
    $fileExt = explode("/", $_FILES["image"]["type"])[1];
    $fileName = $_FILES["image"]["name"];
  
    if(!is_dir("../../img/")){
        mkdir("../../img/");
    }

    move_uploaded_file($_FILES["image"]["tmp_name"], "../../img/" . $fileName);
    echo json_encode(array("src" => $fileName));
