<?php

require_once __DIR__ . '/../repositories/DetalleAreaRepository.php';

class DetalleAreaService
{
    private $repository;

    public function __construct($db)
    {
        $this->repository = new DetalleAreaRepository($db);
    }

    public function obtenerTodos()
    {
        return $this->repository->getAll();
    }

    public function obtenerPorId($id)
    {
        return $this->repository->findById($id);
    }

    public function crear($data)
    {
        // Validaciones
        if (empty($data['fecha'])) {
            throw new Exception('La fecha es obligatoria');
        }
        if (empty($data['provincia'])) {
            throw new Exception('La provincia es obligatoria');
        }
        if (empty($data['area'])) {
            throw new Exception('El área es obligatoria');
        }
        if (empty($data['motivo'])) {
            throw new Exception('El motivo es obligatorio');
        }

        $id = $this->repository->save($data);
        
        return [
            'success' => true,
            'message' => 'Registro creado exitosamente',
            'id' => $id,
            'cod_mot' => $id
        ];
    }

    public function actualizar($data)
    {
        if (empty($data['id'])) {
            throw new Exception('El ID es obligatorio para actualizar');
        }

        // Validaciones
        if (empty($data['fecha'])) {
            throw new Exception('La fecha es obligatoria');
        }
        if (empty($data['provincia'])) {
            throw new Exception('La provincia es obligatoria');
        }
        if (empty($data['area'])) {
            throw new Exception('El área es obligatoria');
        }
        if (empty($data['motivo'])) {
            throw new Exception('El motivo es obligatorio');
        }

        $id = $this->repository->save($data);
        
        return [
            'success' => true,
            'message' => 'Registro actualizado exitosamente',
            'id' => $id
        ];
    }

    public function eliminar($id)
    {
        if (empty($id)) {
            throw new Exception('El ID es obligatorio para eliminar');
        }

        $result = $this->repository->delete($id);
        
        if ($result > 0) {
            return [
                'success' => true,
                'message' => 'Registro eliminado exitosamente'
            ];
        } else {
            throw new Exception('No se encontró el registro a eliminar');
        }
    }

    public function filtrar($fechaInicio = null, $fechaFin = null, $provincia = null, $area = null)
    {
        return $this->repository->findByFilters($fechaInicio, $fechaFin, $provincia, $area);
    }
}

