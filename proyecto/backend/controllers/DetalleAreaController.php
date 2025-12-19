<?php

require_once __DIR__ . '/../services/DetalleAreaService.php';

class DetalleAreaController
{
    private $service;

    public function __construct($db)
    {
        $this->service = new DetalleAreaService($db);
    }

    public function getAll()
    {
        try {
            $datos = $this->service->obtenerTodos();
            http_response_code(200);
            echo json_encode($datos);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(array(
                'error' => true,
                'message' => $e->getMessage()
            ));
        }
    }

    public function create()
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('JSON inválido');
            }

            $resultado = $this->service->crear($data);
            
            http_response_code(201);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(array(
                'error' => true,
                'message' => $e->getMessage()
            ));
        }
    }

    public function update()
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('JSON inválido');
            }

            $resultado = $this->service->actualizar($data);
            
            http_response_code(200);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(array(
                'error' => true,
                'message' => $e->getMessage()
            ));
        }
    }

    public function delete($id)
    {
        try {
            $resultado = $this->service->eliminar($id);
            
            http_response_code(200);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(array(
                'error' => true,
                'message' => $e->getMessage()
            ));
        }
    }

    public function obtenerDatosFiltrados()
    {
        try {
            // PHP 7.2 Compatible
            $fechaInicio = isset($_GET['fechaInicio']) ? $_GET['fechaInicio'] : null;
            $fechaFin = isset($_GET['fechaFin']) ? $_GET['fechaFin'] : null;
            $provincia = isset($_GET['provincia']) ? $_GET['provincia'] : null;
            $area = isset($_GET['area']) ? $_GET['area'] : null;

            $datos = $this->service->filtrar($fechaInicio, $fechaFin, $provincia, $area);
            
            http_response_code(200);
            echo json_encode(array(
                'success' => true,
                'data' => $datos,
                'count' => count($datos)
            ));
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(array(
                'error' => true,
                'message' => $e->getMessage()
            ));
        }
    }
}
