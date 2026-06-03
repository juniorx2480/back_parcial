package com.grupo1.parcialempresa.service;

import com.grupo1.parcialempresa.dto.EmpresaDTO;
import java.util.List;

public interface EmpresaService {
    EmpresaDTO crear(EmpresaDTO dto);
    List<EmpresaDTO> listar();
    EmpresaDTO obtenerPorId(Long id);
    EmpresaDTO actualizar(Long id, EmpresaDTO dto);
    void eliminar(Long id);
}
