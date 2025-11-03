<?php
class VivoProvinciaController {
    private $db;
    private $tabla = 'com_db_vivo_provincia';
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    // ========== OBTENER TODOS LOS REGISTROS ==========
    public function getAll() {
        try {
            $sql = "SELECT * FROM {$this->tabla} ORDER BY fecha DESC, id DESC";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
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
    
    // ========== CREAR REGISTRO ==========
    public function create() {
        try {
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
            
            // Construir SQL dinámicamente
            $campos = array_keys($data);
            $valores = array_values($data);
            $placeholders = array_fill(0, count($valores), '?');
            
            $sql = "INSERT INTO {$this->tabla} (" . implode(', ', $campos) . ") 
                    VALUES (" . implode(', ', $placeholders) . ")";
            
            $stmt = $this->db->prepare($sql);
            $resultado = $stmt->execute($valores);
            
            if ($resultado) {
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Registro creado exitosamente',
                    'id' => $this->db->lastInsertId()
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
    
    // ========== ACTUALIZAR REGISTRO ==========
    public function update() {
        try {
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Falta el ID del registro']);
                return;
            }
            
            $id = $data['id'];
            unset($data['id']);
            
            // Construir SET dinámicamente
            $setClauses = [];
            $valores = [];
            foreach ($data as $campo => $valor) {
                $setClauses[] = "$campo = ?";
                $valores[] = $valor;
            }
            $valores[] = $id; // Para el WHERE
            
            $sql = "UPDATE {$this->tabla} SET " . implode(', ', $setClauses) . " WHERE id = ?";
            
            $stmt = $this->db->prepare($sql);
            $resultado = $stmt->execute($valores);
            
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
    
    // ========== ELIMINAR REGISTRO ==========
    public function delete($id) {
        try {
            $sql = "DELETE FROM {$this->tabla} WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $resultado = $stmt->execute([$id]);
            
            if ($resultado && $stmt->rowCount() > 0) {
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
    
    // ========== EXPORTAR A CSV ==========
    public function exportarCSV() {
        try {
            $sql = "SELECT * FROM {$this->tabla} ORDER BY fecha DESC";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Headers para descarga de archivo CSV
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename="vivo_provincia_' . date('Y-m-d') . '.csv"');
            
            // Crear salida CSV
            $output = fopen('php://output', 'w');
            
            // Escribir BOM para UTF-8
            fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
            
            // Headers del CSV
            if (count($resultado) > 0) {
                fputcsv($output, array_keys($resultado[0]));
            }
            
            // Datos
            foreach ($resultado as $row) {
                fputcsv($output, $row);
            }
            
            fclose($output);
            exit;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error al exportar datos',
                'message' => $e->getMessage()
            ]);
        }
    }
}
?>
