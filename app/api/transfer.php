<?php
header("Access-Control-Allow-Origin: http://jwt/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once "config/database.php";
include_once "objects/player.php";

$database = new DatabaseConnection();
$db = $database->getConnection();

$player = new Player($db);
$data = json_decode(file_get_contents("php://input"));

$player->transaction($data->data->from, $data->data->to, $data->data->value);
