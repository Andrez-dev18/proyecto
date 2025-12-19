<?php
require_once __DIR__ . '/../repositories/DashboardRepository.php';

class DashboardController {
    private $repository;

    public function __construct($db) {
        $this->repository = new DashboardRepository($db);
    }

    // ==================== RESUMEN GENERAL ====================
    public function getResumenGeneral() {
        try {
            $fechaInicio = $_GET['fechaInicio'] ?? null;
            $fechaFin = $_GET['fechaFin'] ?? null;
            
            $data = $this->repository->getResumenGeneral($fechaInicio, $fechaFin);
            
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // ==================== VIVO AREQUIPA ====================
    public function getVivoAqpResumen() {
        try {
            $fechaInicio = $_GET['fechaInicio'] ?? null;
            $fechaFin = $_GET['fechaFin'] ?? null;
            
            $data = $this->repository->getVivoAqpResumen($fechaInicio, $fechaFin);
            
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function getVivoAqpPorZona() {
        try {
            $fechaInicio = $_GET['fechaInicio'] ?? null;
            $fechaFin = $_GET['fechaFin'] ?? null;
            
            $data = $this->repository->getVivoAqpPorZona($fechaInicio, $fechaFin);
            
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function getVivoAqpPorProveedor() {
        try {
            $fechaInicio = $_GET['fechaInicio'] ?? null;
            $fechaFin = $_GET['fechaFin'] ?? null;
            
            $data = $this->repository->getVivoAqpPorProveedor($fechaInicio, $fechaFin);
            
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // ==================== BENEFICIADO ====================
    public function getBeneficiadoProvinciaResumen() {
        try {
            $fechaInicio = $_GET['fechaInicio'] ?? null;
            $fechaFin = $_GET['fechaFin'] ?? null;
            
            $data = $this->repository->getBeneficiadoProvinciaResumen($fechaInicio, $fechaFin);
            
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // ==================== TROZADO ====================
    public function getTrozadoDiarioResumen() {
        try {
            $fechaInicio = $_GET['fechaInicio'] ?? null;
            $fechaFin = $_GET['fechaFin'] ?? null;
            
            $data = $this->repository->getTrozadoDiarioResumen($fechaInicio, $fechaFin);
            
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function getTrozadoPorProducto() {
        try {
            $fechaInicio = $_GET['fechaInicio'] ?? null;
            $fechaFin = $_GET['fechaFin'] ?? null;
            
            $data = $this->repository->getTrozadoPorProducto($fechaInicio, $fechaFin);
            
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // ==================== CLIENTES ====================
    public function getClienteProcesadosTop() {
        try {
            $fechaInicio = $_GET['fechaInicio'] ?? null;
            $fechaFin = $_GET['fechaFin'] ?? null;
            $limit = $_GET['limit'] ?? 20;
            
            $data = $this->repository->getClienteProcesadosTop($fechaInicio, $fechaFin, $limit);
            
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function getClientePorLinea() {
        try {
            $fechaInicio = $_GET['fechaInicio'] ?? null;
            $fechaFin = $_GET['fechaFin'] ?? null;
            
            $data = $this->repository->getClientePorLinea($fechaInicio, $fechaFin);
            
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // ==================== HUEVO ====================
    public function getHuevoResumen() {
        try {
            $fechaInicio = $_GET['fechaInicio'] ?? null;
            $fechaFin = $_GET['fechaFin'] ?? null;
            
            $data = $this->repository->getHuevoResumen($fechaInicio, $fechaFin);
            
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // ==================== GALLINA ====================
    public function getGallinaResumen() {
        try {
            $fechaInicio = $_GET['fechaInicio'] ?? null;
            $fechaFin = $_GET['fechaFin'] ?? null;
            
            $data = $this->repository->getGallinaResumen($fechaInicio, $fechaFin);
            
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

        // ==================== CRIADORES EMPRENDEDORES ====================
    public function getCriadoresEmprendedoresResumen() {
        try {
            $fechaInicio = isset($_GET['fechaInicio']) ? $_GET['fechaInicio'] : null;
            $fechaFin = isset($_GET['fechaFin']) ? $_GET['fechaFin'] : null;
            
            $data = $this->repository->getCriadoresEmprendedoresResumen($fechaInicio, $fechaFin);
            
            http_response_code(200);
            echo json_encode(array('success' => true, 'data' => $data));
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(array('success' => false, 'message' => $e->getMessage()));
        }
    }

    // ==================== PRODUCTO SUSTITUTO ====================
    public function getProductoSustitutoResumen() {
        try {
            $fechaInicio = isset($_GET['fechaInicio']) ? $_GET['fechaInicio'] : null;
            $fechaFin = isset($_GET['fechaFin']) ? $_GET['fechaFin'] : null;
            
            $data = $this->repository->getProductoSustitutoResumen($fechaInicio, $fechaFin);
            
            http_response_code(200);
            echo json_encode(array('success' => true, 'data' => $data));
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(array('success' => false, 'message' => $e->getMessage()));
        }
    }

    // ==================== MONITOREO DEL SISTEMA ====================
public function getEstadisticasGeneralesSistema() {
    try {
        $fechaInicio = isset($_GET['fechaInicio']) ? $_GET['fechaInicio'] : null;
        $fechaFin = isset($_GET['fechaFin']) ? $_GET['fechaFin'] : null;
        
        $data = $this->repository->getEstadisticasGeneralesSistema($fechaInicio, $fechaFin);
        
        http_response_code(200);
        echo json_encode(array('success' => true, 'data' => $data));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array('success' => false, 'message' => $e->getMessage()));
    }
}

public function getUsoPorModuloSistema() {
    try {
        $fechaInicio = isset($_GET['fechaInicio']) ? $_GET['fechaInicio'] : null;
        $fechaFin = isset($_GET['fechaFin']) ? $_GET['fechaFin'] : null;
        
        $data = $this->repository->getUsoPorModuloSistema($fechaInicio, $fechaFin);
        
        http_response_code(200);
        echo json_encode(array('success' => true, 'data' => $data));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array('success' => false, 'message' => $e->getMessage()));
    }
}

public function getActividadUltimos30DiasSistema() {
    try {
        $data = $this->repository->getActividadUltimos30DiasSistema();
        
        http_response_code(200);
        echo json_encode(array('success' => true, 'data' => $data));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array('success' => false, 'message' => $e->getMessage()));
    }
}

public function getUsuariosActivosSistema() {
    try {
        $data = $this->repository->getUsuariosActivosSistema();
        
        http_response_code(200);
        echo json_encode(array('success' => true, 'data' => $data));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array('success' => false, 'message' => $e->getMessage()));
    }
}

public function getActividadRecienteSistema() {
    try {
        $limit = isset($_GET['limit']) ? $_GET['limit'] : 10;
        $data = $this->repository->getActividadRecienteSistema($limit);
        
        http_response_code(200);
        echo json_encode(array('success' => true, 'data' => $data));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array('success' => false, 'message' => $e->getMessage()));
    }
}

    
}
?>
