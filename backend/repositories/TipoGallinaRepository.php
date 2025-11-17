<?php

class TipoGallinaRepository
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }
    public function findAll()
    {
        $query = "SELECT * FROM com_tipo_gallina;";

        return $this->executeQuery($query);
    }


    private function executeQuery($query)
    {
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    
}
