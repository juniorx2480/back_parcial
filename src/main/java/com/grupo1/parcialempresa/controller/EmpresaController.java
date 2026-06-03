package com.grupo1.parcialempresa.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grupo1.parcialempresa.dto.ApiResponse;
import com.grupo1.parcialempresa.dto.EmpresaDTO;
import com.grupo1.parcialempresa.service.EmpresaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;

    public EmpresaController(EmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    // POST /api/v1/empresas
    @PostMapping
    public ResponseEntity<ApiResponse<EmpresaDTO>> crear(@Valid @RequestBody EmpresaDTO dto) {
        EmpresaDTO creada = empresaService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Empresa creada exitosamente", creada));
    }

    // GET /api/v1/empresas
    @GetMapping
    public ResponseEntity<ApiResponse<List<EmpresaDTO>>> listar() {
        List<EmpresaDTO> lista = empresaService.listar();
        return ResponseEntity.ok(new ApiResponse<>(true, "Empresas obtenidas exitosamente", lista));
    }

    // GET /api/v1/empresas/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmpresaDTO>> obtenerPorId(@PathVariable Long id) {
        EmpresaDTO dto = empresaService.obtenerPorId(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Empresa obtenida exitosamente", dto));
    }

    // PUT /api/v1/empresas/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmpresaDTO>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody EmpresaDTO dto) {
        EmpresaDTO actualizada = empresaService.actualizar(id, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Empresa actualizada exitosamente", actualizada));
    }

    // DELETE /api/v1/empresas/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        empresaService.eliminar(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Empresa eliminada exitosamente", null));
    }
}
