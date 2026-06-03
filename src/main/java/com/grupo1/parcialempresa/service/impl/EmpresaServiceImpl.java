package com.grupo1.parcialempresa.service.impl;

import com.grupo1.parcialempresa.dto.EmpresaDTO;
import com.grupo1.parcialempresa.exception.ResourceNotFoundException;
import com.grupo1.parcialempresa.model.Empresa;
import com.grupo1.parcialempresa.repository.EmpresaRepository;
import com.grupo1.parcialempresa.service.EmpresaService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmpresaServiceImpl implements EmpresaService {

    private final EmpresaRepository empresaRepository;

    public EmpresaServiceImpl(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    @Override
    public EmpresaDTO crear(EmpresaDTO dto) {
        Empresa empresa = toEntity(dto);
        return toDTO(empresaRepository.save(empresa));
    }

    @Override
    public List<EmpresaDTO> listar() {
        return empresaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EmpresaDTO obtenerPorId(Long id) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa no encontrada con id: " + id));
        return toDTO(empresa);
    }

    @Override
    public EmpresaDTO actualizar(Long id, EmpresaDTO dto) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa no encontrada con id: " + id));
        empresa.setNombre(dto.getNombre());
        empresa.setNit(dto.getNit());
        empresa.setCiudad(dto.getCiudad());
        empresa.setSector(dto.getSector());
        return toDTO(empresaRepository.save(empresa));
    }

    @Override
    public void eliminar(Long id) {
        if (!empresaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Empresa no encontrada con id: " + id);
        }
        empresaRepository.deleteById(id);
    }

    private Empresa toEntity(EmpresaDTO dto) {
        Empresa e = new Empresa();
        e.setNombre(dto.getNombre());
        e.setNit(dto.getNit());
        e.setCiudad(dto.getCiudad());
        e.setSector(dto.getSector());
        return e;
    }

    private EmpresaDTO toDTO(Empresa e) {
        EmpresaDTO dto = new EmpresaDTO();
        dto.setId(e.getId());
        dto.setNombre(e.getNombre());
        dto.setNit(e.getNit());
        dto.setCiudad(e.getCiudad());
        dto.setSector(e.getSector());
        return dto;
    }
}
