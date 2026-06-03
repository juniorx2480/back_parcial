package com.grupo1.parcialempresa.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grupo1.parcialempresa.dto.ApiResponse;
import com.grupo1.parcialempresa.dto.EmpleadoDTO;
import com.grupo1.parcialempresa.exception.ResourceNotFoundException;
import com.grupo1.parcialempresa.model.Empleado;
import com.grupo1.parcialempresa.model.Empresa;
import com.grupo1.parcialempresa.repository.EmpleadoRepository;
import com.grupo1.parcialempresa.repository.EmpresaRepository;

@RestController
@RequestMapping("/api/v1/empleados")
public class EmpleadoController {

    private final EmpleadoRepository empleadoRepository;
    private final EmpresaRepository empresaRepository;

    public EmpleadoController(EmpleadoRepository empleadoRepository, EmpresaRepository empresaRepository) {
        this.empleadoRepository = empleadoRepository;
        this.empresaRepository = empresaRepository;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmpleadoDTO>> crear(@RequestBody EmpleadoDTO dto) {
        Empresa empresa = empresaRepository.findById(dto.getEmpresaId())
                .orElseThrow(() -> new ResourceNotFoundException("Empresa no encontrada con id: " + dto.getEmpresaId()));
        Empleado e = new Empleado();
        e.setNombre(dto.getNombre());
        e.setCargo(dto.getCargo());
        e.setCorreo(dto.getCorreo());
        e.setEmpresa(empresa);
        Empleado saved = empleadoRepository.save(e);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Empleado creado exitosamente", toDTO(saved)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmpleadoDTO>>> listarTodos() {
        List<EmpleadoDTO> list = empleadoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Empleados obtenidos exitosamente", list));
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<ApiResponse<List<EmpleadoDTO>>> listarPorEmpresa(@PathVariable Long empresaId) {
        List<EmpleadoDTO> list = empleadoRepository.findByEmpresaId(empresaId)
                .stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Empleados obtenidos exitosamente", list));
    }

    private EmpleadoDTO toDTO(Empleado e) {
        EmpleadoDTO dto = new EmpleadoDTO();
        dto.setId(e.getId());
        dto.setNombre(e.getNombre());
        dto.setCargo(e.getCargo());
        dto.setCorreo(e.getCorreo());
        dto.setEmpresaId(e.getEmpresa() != null ? e.getEmpresa().getId() : null);
        return dto;
    }
}
