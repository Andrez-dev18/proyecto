<?php
require_once __DIR__ . '/../services/ComercializacionService.php';

class ComercializacionController {
    private $service;
    
    public function __construct($db) {
        $this->service = new ComercializacionService($db);
    }
    
    // ========== VIVO AREQUIPA ==========
    
    public function getVivoAqp() {
        try {
            $resultado = $this->service->getAllVivoAqp();
            http_response_code(200);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al obtener datos',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    public function filtrarVivoAqp() {
        try {
            $fecha = $_GET['fecha'] ?? null;
            $mercado = $_GET['mercado'] ?? null;
            $proveedor = $_GET['proveedor'] ?? null;
            $condicion = $_GET['condicion'] ?? null;
            
            $resultado = $this->service->filtrarVivoAqp($fecha, $mercado, $proveedor, $condicion);
            http_response_code(200);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al filtrar datos',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    public function getByIdVivoAqp($id) {
        try {
            $resultado = $this->service->getByIdVivoAqp($id);
            if ($resultado) {
                http_response_code(200);
                echo json_encode($resultado);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Registro no encontrado']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al obtener registro',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    // ========== VIVO PROVINCIA ==========
    
    public function getVivoProvincia() {
        try {
            $resultado = $this->service->getAllVivoProvincia();
            http_response_code(200);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al obtener datos',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    public function filtrarVivoProvincia() {
        try {
            $fecha = $_GET['fecha'] ?? null;
            $provincia = $_GET['provincia'] ?? null;
            $proveedor = $_GET['proveedor'] ?? null;
            $tipo = $_GET['tipo'] ?? null;
            
            $resultado = $this->service->filtrarVivoProvincia($fecha, $provincia, $proveedor, $tipo);
            http_response_code(200);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al filtrar datos',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    public function getByIdVivoProvincia($id) {
        try {
            $resultado = $this->service->getByIdVivoProvincia($id);
            if ($resultado) {
                http_response_code(200);
                echo json_encode($resultado);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Registro no encontrado']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al obtener registro',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    // ========== CREAR (AMBAS TABLAS) ==========
    
    public function create() {
        try {
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
            
            if (!isset($data['tabla'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta especificar la tabla']);
                return;
            }
            
            $tabla = $data['tabla'];
            unset($data['tabla']);
            
            if ($tabla === 'com_db_vivo_aqp') {
                $resultado = $this->service->saveVivoAqp($data);
            } elseif ($tabla === 'com_db_vivo_provincia') {
                $resultado = $this->service->saveVivoProvincia($data);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Tabla no válida']);
                return;
            }
            
            if ($resultado) {
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Registro creado exitosamente'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'No se pudo crear el registro']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al crear registro',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    // ========== ACTUALIZAR (AMBAS TABLAS) ==========
    
    public function update() {
        try {
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
            
            if (!isset($data['tabla'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta especificar la tabla']);
                return;
            }
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta especificar el ID']);
                return;
            }
            
            $tabla = $data['tabla'];
            unset($data['tabla']);
            
            if ($tabla === 'com_db_vivo_aqp') {
                $resultado = $this->service->updateVivoAqp($data);
            } elseif ($tabla === 'com_db_vivo_provincia') {
                $resultado = $this->service->updateVivoProvincia($data);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Tabla no válida']);
                return;
            }
            
            if ($resultado) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Registro actualizado exitosamente'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'No se pudo actualizar el registro']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al actualizar registro',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    // ========== ELIMINAR (AMBAS TABLAS) ==========
    
    public function delete($id) {
        try {
            $tabla = $_GET['tabla'] ?? null;
            
            if (!$tabla) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta especificar la tabla']);
                return;
            }
            
            if ($tabla === 'com_db_vivo_aqp') {
                $resultado = $this->service->deleteVivoAqp($id);
            } elseif ($tabla === 'com_db_vivo_provincia') {
                $resultado = $this->service->deleteVivoProvincia($id);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Tabla no válida']);
                return;
            }
            
            if ($resultado) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Registro eliminado exitosamente'
                ]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Registro no encontrado']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al eliminar registro',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    // ========== DATOS PARA SELECTS ==========
    
    public function getEmpresas() {
        try {
            $resultado = $this->service->getEmpresas();
            http_response_code(200);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al obtener empresas',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    public function getMercados() {
        try {
            $resultado = $this->service->getMercados();
            http_response_code(200);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al obtener mercados',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    public function getProveedores() {
        try {
            $resultado = $this->service->getProveedores();
            http_response_code(200);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al obtener proveedores',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    public function getProvincias() {
        try {
            $resultado = $this->service->getProvincias();
            http_response_code(200);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al obtener provincias',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    public function getCondiciones() {
        try {
            $resultado = $this->service->getCondiciones();
            http_response_code(200);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al obtener condiciones',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    public function getTipos() {
        try {
            $resultado = $this->service->getTipos();
            http_response_code(200);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al obtener tipos',
                'message' => $e->getMessage()
            ]);
        }
    }
}
?>
