<?php
// заголовки
header("Access-Control-Allow-Origin: http://jwt/");
header("Content-Type: application/json; charset=cp1251");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// файлы необходимые для соединения с БД
include_once "config/database.php";
include_once "objects/game.php";
// получаем соединение с базой данных
$database = new DatabaseConnection();
$db = $database->getConnection();
// создание объекта "Game"
$game = new Game($db);

// получаем данные
$data = json_decode(file_get_contents("php://input"));

// устанавливаем значения
$game->game_name = $data->data->game_name;
$game_exists = $game->checkGameCode();

// подключение файлов jwt
include_once "config/core.php";
include_once "libs/php-jwt-master/src/BeforeValidException.php";
include_once "libs/php-jwt-master/src/ExpiredException.php";
include_once "libs/php-jwt-master/src/SignatureInvalidException.php";
include_once "libs/php-jwt-master/src/JWT.php";
use \Firebase\JWT\JWT;

// существует ли игра и соответствует ли пароль тому, что находится в базе данных
if ( $game_exists && password_verify($data->data->password, $game->password) ) {
    $token = array(
        "iss" => $iss,
        "aud" => $aud,
        "iat" => $iat,
        "nbf" => $nbf,
        "data" => array(
            "id" => $game->id,
            "game_name" => $game->game_name,
        )
    );
   
    $jwt = JWT::encode($token, $key, 'HS256');
    $data->jwt = $jwt;

    http_response_code(200);
    
    echo json_encode([
        'message' => 'Успешный вход в систему!',
        "jwt" => $jwt,
        "code" => $game->game_code
    ]) ;
} else { // Если электронная почта не существует или пароль не совпадает
    http_response_code(401);

    echo json_encode([
        'status' => 'false',
        "error" => '"Ошибка входа',
    ]) ;
}