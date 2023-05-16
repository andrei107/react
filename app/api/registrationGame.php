<?php
header("Access-Control-Allow-Origin: http://jwt/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

//подключение требуемых файлов
include_once "config/database.php";
include_once "objects/game.php";

//получаем соединение с базой
$database = new DatabaseConnection();
$db = $database->getConnection();

//объект игры
$game = new Game($db);

//получаем данные
$dataForGame = json_decode(file_get_contents("php://input"));

// устанавливаем значения
$game->game_name = $dataForGame->data->game_name;
$game->game_code = $dataForGame->data->game_code;
$game->password = $dataForGame->data->password;

// создание пользователя
$tryToSave = $game->createNewGame();

if(!empty($game->game_name) && !empty($game->game_code) && !empty($game->password) && $tryToSave){
    if($tryToSave['error']){
        http_response_code(200);

         echo json_encode([
            'message' => 'Игра с таким именем уже существует!',
            'status' => false
          ]) ;
    } else {
    // устанавливаем код ответа
    http_response_code(200);
    // покажем сообщение о том, что игра была создана
       echo json_encode([
            'message' => 'Игра зарегистрирована!',
            'status' => true
       ]) ;
    }
} else {
    http_response_code(400);
    echo json_encode(array(
        "message" => "Ошибка при регистрации",
        "error" => "true"
    ));
}