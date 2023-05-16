<?php
// объект "game"
class Game {
    // подключение к БД таблице "games"
    private $connection;
    private $table_name = 'games';

    //свойства объекта
    public $id;
    public $game_name;
    public $game_code;
    public $password;

    public function __construct($db) {
        $this->connection = $db;
    }

    // Создание new game
    public function createNewGame(){
        if(!$this->checkGameCode()){
            $query = "INSERT INTO " . $this->table_name . " SET game_name = :game_name, game_code = :game_code, password = :password";
            // подготовка запроса
            $stmt = $this->connection->prepare($query);
            // инъекция и зачистка
            $this->game_name = htmlspecialchars(strip_tags($this->game_name));
            $this->game_code = htmlspecialchars(strip_tags($this->game_code));
            $this->password = htmlspecialchars(strip_tags($this->password));
            // привязываем значения
            $stmt->bindParam(":game_name", $this->game_name);
            $stmt->bindParam(":game_code", $this->game_code);
             // для защиты пароля ешируем пароль перед сохранением в базу данных
            $password_hash = password_hash($this->password, PASSWORD_BCRYPT);
            $stmt->bindParam(":password", $password_hash);
        
            // Если выполнение успешно, то информация о игре будет сохранена в базе данных
            if($stmt->execute()) {
                return true;
            }
     
            return false;

        } else {
           return (array(
                "message" => "Данный код уже зарегистрирован",
                "error" => "true"
            ));
        }
    }

    public function checkGameCode(){
        $query = "SELECT password FROM " . $this->table_name . " WHERE game_name = ?";
        // подготовка запроса
        $stmt = $this->connection->prepare( $query );
        // инъекция
        $this->game_name=htmlspecialchars(strip_tags($this->game_name));
        // привязываем значение e-mail
        $stmt->bindParam(1, $this->game_name);
        // выполняем запрос
        $stmt->execute();
        // получаем количество строк
        $num = $stmt->rowCount();
            if($num > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                // присвоим значения свойствам объекта
                $this->id = $row["id"];
                $this->game_name = $row["game_name"];
                $this->game_code = $row["game_code"];
                $this->password = $row["password"];

                return 1;
            }
        return 0;
    }
}