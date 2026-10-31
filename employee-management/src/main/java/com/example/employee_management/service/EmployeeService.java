package com.example.employee_management.service;

import com.example.employee_management.dto.EmployeeRequestDTO;
import com.example.employee_management.dto.EmployeeResponseDTO;
import com.example.employee_management.entity.Employee;
import com.example.employee_management.mapper.EmployeeMapper;
import com.example.employee_management.repository.EmployeeRepository;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // Create Employee
    public EmployeeResponseDTO createEmployee(EmployeeRequestDTO requestDTO) {

        Employee employee = EmployeeMapper.toEntity(requestDTO);

        Employee savedEmployee = employeeRepository.save(employee);

        return EmployeeMapper.toResponseDTO(savedEmployee);
    }

    // Get All Employees
    public List<EmployeeResponseDTO> getAllEmployees() {

        return employeeRepository.findAll()
                .stream()
                .map(EmployeeMapper::toResponseDTO)
                .toList();
    }

    // Get Employee By ID
    public EmployeeResponseDTO getEmployeeById(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Employee not found with id: " + id));

        return EmployeeMapper.toResponseDTO(employee);
    }

    // Update Employee
    public EmployeeResponseDTO updateEmployee(
            Long id,
            EmployeeRequestDTO requestDTO) {

        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Employee not found with id: " + id));

        existingEmployee.setName(requestDTO.getName());
        existingEmployee.setEmail(requestDTO.getEmail());
        existingEmployee.setPhone(requestDTO.getPhone());

        Employee updatedEmployee = employeeRepository.save(existingEmployee);

        return EmployeeMapper.toResponseDTO(updatedEmployee);
    }

    // Delete Employee
    public void deleteEmployee(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Employee not found with id: " + id));

        employeeRepository.delete(employee);
    }

    // Allowed fields for sorting
    private static final Set<String> ALLOWED_SORT_FIELDS=Set.of("id","name","email","phone");
    
    // Maximum records allowed per page
    private static final int MAX_PAGE_SIZE=100;

    public Page<EmployeeResponseDTO> getEmployeesWithPagination(
            int page,
            int size,
            String sortBy,
            String direction) {
        
        // 1. Validate page number
        if(page<0){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Page number cannot be negative"
            );
        }  
        
        // 2. Validate page size
        if(size < 1 || size > MAX_PAGE_SIZE){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Page size must be between 1 and 100"
            );
        }

        // 3. Validate sorting field
        if(!ALLOWED_SORT_FIELDS.contains(sortBy)){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid sort field. Allowed field: id , name , email, phone"
            );
        }

        // 4. Validation sorting direction
        if(!direction.equalsIgnoreCase("asc") && !direction.equalsIgnoreCase("desc")){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid sort direction. Use asc or desc"
            );
        }

        // Create sorting order
        Sort sort = direction.equalsIgnoreCase("desc")? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        // Create pagination request
        Pageable pageable = PageRequest.of(page, size, sort);

        // Fetch paginated employees
        Page<Employee> employeePage = employeeRepository.findAll(pageable);

        // Convert Employee Entity into Response DTO
        return employeePage.map(EmployeeMapper::toResponseDTO);
    }

}
