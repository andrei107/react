<?
header("Access-Control-Allow-Origin: http://jwt/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

//подключение требуемых файлов
include_once "config/database.php";
include_once "objects/player.php";

//получаем соединение с базой
$database = new DatabaseConnection();
$db = $database->getConnection();

//объект игры
$player = new Player($db);

//получаем данные
$data = json_decode(file_get_contents("php://input"));
// устанавливаем значения

$player->name = $data->data->name;
$player->nik = $data->data->nik;
$player->bank = $data->data->bank;
$player->image = $data->data->image;
$player->code = $data->data->code;

$tryToSave = $player->createNewPlayer();
if(!empty($player->name) && !empty($player->bank) && !empty($player->code) && $tryToSave){
     // устанавливаем код ответа
    http_response_code(200);
     // покажем сообщение о том, что игра была создана
    echo json_encode(array(
        "message" => "Игрок создан!!",
        "status" => "true"
    ));
} else {
    http_response_code(400);
    echo json_encode(array(
        "message" => "Ошибка при создании",
        "status" => "false"
    ));
}
