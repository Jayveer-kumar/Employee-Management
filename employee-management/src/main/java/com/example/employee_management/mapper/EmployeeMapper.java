package com.example.employee_management.mapper;

import com.example.employee_management.dto.EmployeeRequestDTO;
import com.example.employee_management.dto.EmployeeResponseDTO;
import com.example.employee_management.entity.Employee;

public class EmployeeMapper {
    
    // Convert Request DTO into Employee Entity
    public static Employee toEntity(EmployeeRequestDTO requestDTO){
        Employee employee = new Employee();
        employee.setEmail(requestDTO.getEmail());
        employee.setName(requestDTO.getName());
        employee.setPhone(requestDTO.getPhone());
        return employee;
    }

    // Convert Employee Entity into Response DTO
    public static EmployeeResponseDTO toResponseDTO(Employee employee){
        return new EmployeeResponseDTO(
            employee.getId(),
            employee.getName(),
            employee.getEmail(),
            employee.getPhone()
        );
    }
}
