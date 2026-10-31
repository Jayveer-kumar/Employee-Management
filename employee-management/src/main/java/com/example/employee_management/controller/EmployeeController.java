
package com.example.employee_management.controller;

import com.example.employee_management.dto.EmployeeRequestDTO;
import com.example.employee_management.dto.EmployeeResponseDTO;
import com.example.employee_management.service.EmployeeService;

import jakarta.validation.Valid;

// import org.hibernate.query.Page;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

// import java.util.List;

@CrossOrigin (origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // Create Employee
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeResponseDTO createEmployee(
            @Valid @RequestBody EmployeeRequestDTO requestDTO) {

        return employeeService.createEmployee(requestDTO);
    }

    // Get All Employees
    @GetMapping 
    public Page<EmployeeResponseDTO> getAllEmployees(
        @RequestParam (defaultValue = "0") int page,
        @RequestParam (defaultValue = "5") int size,
        @RequestParam (defaultValue = "id") String sortBy,
        @RequestParam (defaultValue = "asc") String direction
    ){
        return employeeService.getEmployeesWithPagination(page ,size , sortBy , direction);
    }
    // @GetMapping
    // public List<EmployeeResponseDTO> getAllEmployees() {

    //     return employeeService.getAllEmployees();
    // }

    // Get Employee By ID
    @GetMapping("/{id}")
    public EmployeeResponseDTO getEmployeeById(@PathVariable Long id) {

        return employeeService.getEmployeeById(id);
    }

    // Update Employee
    @PutMapping("/{id}")
    public EmployeeResponseDTO updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequestDTO requestDTO) {

        return employeeService.updateEmployee(id, requestDTO);
    }

    // Delete Employee
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmployee(@PathVariable Long id) {

        employeeService.deleteEmployee(id);
    }
}


