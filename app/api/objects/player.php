
<?php
// объект "game"
class Player {
    // подключение к БД таблице "games"
    private $connection;
    private $table_name = 'players';
  
    //свойства объекта
    public $id;
    public $name;
    public $nik;
    public $code;
    public $bank;
    public $image;

    public function __construct($db) {
        $this->connection = $db;
    }

    // Создание new player
    public function createNewPlayer(){
        if(!$this->checkName()){
            // Вставляем запрос
            $query = "INSERT INTO " . $this->table_name . " SET name = :name, nik = :nik, code = :code, bank = :bank, image = :image";
            // поготовка запроса
            $stmt = $this->connection->prepare($query);
            // инъекция и зачистка
            $this->name = htmlspecialchars(strip_tags($this->name));
            $this->nik = htmlspecialchars(strip_tags($this->nik));
            $this->bank = htmlspecialchars(strip_tags($this->bank));
            $this->code = htmlspecialchars(strip_tags($this->code));
            $this->image = htmlspecialchars(strip_tags($this->image));

            // привязываем значения
            $stmt->bindParam(":name", $this->name);
            $stmt->bindParam(":nik", $this->nik);
            $stmt->bindParam(":code", $this->code);
            $stmt->bindParam(":bank", $this->bank);
            $stmt->bindParam(":image", $this->image);

            if($stmt->execute()) {
                echo json_encode(array(
                    "message" => "Игрок создан",
                    "status" => "true"
                ));
                return true;
            }
         
        return false;

        } else {
            echo json_encode(array(
                "message" => "Данный игрок уже зарегистрирован",
                "status" => "false"
            ));
        }
    }

    public function checkName(){
        $query = "SELECT * FROM " . $this->table_name . "WHERE name = ?";
        // подготовка запроса
        $stmt = $this->connection->prepare( $query );
        // инъекция
        $this->name = htmlspecialchars(strip_tags($this->name));
        // привязываем значение game_code
        $stmt->bindParam(1, $this->name);
        // выполняем запрос
        $stmt->execute();
        // получаем количество строк
        $num = $stmt->rowCount();
       
        // если game_code существует
        if($num > 0) {
            return true;
        }

        return false;
    }

    public function deletePlayer($name){
        
        $query = "DELETE FROM " . $this->table_name . " WHERE name = ?";
        $stmt = $this->connection->prepare( $query );
        $this->name = htmlspecialchars(strip_tags($name));
        $stmt->bindParam(1, $this->name);

        if($stmt->execute()){
            echo json_encode(array(
                "message" => "Игрок удален!",
                "status" => "true"
            ));
        } else {
            echo json_encode(array(
                "message" => "Ошибка удаления!",
                "status" => "false"
            ));
        }
    }

    public function getAllPlayers(){
        $query = "SELECT * FROM " . $this->table_name;
        $data = array();
        try {
            $result = $this->connection->query($query);
            foreach($result as $key=>$row){
                array_push($data, $row);
            }
        }
        catch (PDOException $e) {
            echo "Database error: " . $e->getMessage();
        }

        echo json_encode(array(
            "data" => $data
        ));
    }


    public function transaction($from, $to, $value){
        $queryCurrentValue = "SELECT bank FROM " . $this->table_name . " WHERE name = ?";

        $stmt = $this->connection->prepare( $queryCurrentValue);

        $nameFrom = htmlspecialchars(strip_tags($from));
        $nameTo =  htmlspecialchars(strip_tags($to)); 
        $deltaValue =  htmlspecialchars(strip_tags($value)); 

        //исходный банк того кто платит
        $stmt->bindParam(1, $nameFrom);
        $stmt->execute();
        $bankFrom = $stmt->fetch(PDO::FETCH_ASSOC)['bank'];
        //исходный банк тому кому платят
        $stmt->bindParam(1, $nameTo);
        $stmt->execute();
        $bankTo = $stmt->fetch(PDO::FETCH_ASSOC)['bank'];

        //обновление счетов
        $queryUpdateBank = "UPDATE " . $this->table_name . " SET bank = :bank WHERE name = :name";
      
        //вычет первого
        $stmt2 = $this->connection->prepare( $queryUpdateBank);
        $newBankFrom = $bankFrom - $deltaValue;
      
        $stmt2->bindParam(":bank", $newBankFrom);
        $stmt2->bindParam(":name", $nameFrom);
        $stmt2->execute();

        $stmt3 = $this->connection->prepare( $queryUpdateBank);
        $newBankTo = $bankTo + $deltaValue;
        $stmt3->bindParam(":bank", $newBankTo);
        $stmt3->bindParam(":name", $nameTo);
        $stmt3->execute();
    }
}