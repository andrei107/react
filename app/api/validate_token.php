<?php
// заголовки
header("Access-Control-Allow-Origin: http://jwt/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// требуется для декодирования JWT
include_once "config/core.php";
include_once "libs/php-jwt-master/src/BeforeValidException.php";
include_once "libs/php-jwt-master/src/ExpiredException.php";
include_once "libs/php-jwt-master/src/SignatureInvalidException.php";
include_once "libs/php-jwt-master/src/JWT.php";
include_once "libs/php-jwt-master/src/Key.php";
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// получаем значение веб-токена JSON
$data = json_decode(file_get_contents("php://input"));

// получаем JWT
$jwt = isset($data->data->jwt) ? $data->data->jwt : "";

if($jwt) {
    // если декодирование выполнено успешно, показать данные пользователя
    try { // декодирование jwt
        $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
        // код ответа
        http_response_code(200);
        echo json_encode(array(  // показать детали
          "message" => "Доступ разрешен.",
          "status" => true
        ));
    } catch (Exception $e){  // если декодирование не удалось, это означает, что JWT является недействительным
        http_response_code(401);
        echo json_encode(array(
            "message" => "Доступ закрыт.",
            "error" => $e->getMessage()
        ));
    }
} else{ // показать сообщение об ошибке, если jwt пуст
    http_response_code(401);
    echo json_encode(array("message" => "Доступ запрещён."));
}