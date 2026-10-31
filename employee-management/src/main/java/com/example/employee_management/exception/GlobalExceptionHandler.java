package com.example.employee_management.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });

        return new ResponseEntity<>(
                errors,
                HttpStatus.BAD_REQUEST
        );
    }

    // Handle database constraint errors
    @ExceptionHandler (DataIntegrityViolationException.class)
    public ResponseEntity<Map<String,Object>> handleDatabaseException(DataIntegrityViolationException ex){
        Map<String,Object> error = new HashMap<>();

        error.put("status",HttpStatus.CONFLICT.value());
        error.put("message","Email already exists. Please use a different email.");
        return new ResponseEntity<>(
            error,
            HttpStatus.CONFLICT
        );
    }

    // Handle employee not found and other ResponseStatusException errors
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String , Object>> handleResponseStatusException(ResponseStatusException ex){
        Map<String,Object> error = new HashMap<>();
        
        error.put("status",ex.getStatusCode().value());
        error.put("message",ex.getReason());

        return new ResponseEntity<>(
            error,
            ex.getStatusCode()
        );
    }

    // Handle all other unexpected exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(
            Exception ex) {

        Map<String, String> error = new HashMap<>();

        error.put("message", "Something went wrong");

        return new ResponseEntity<>(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
