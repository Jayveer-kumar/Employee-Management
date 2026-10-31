package com.example.employee_management.entity;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity 
@Table (name = "employees")
public class Employee {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank (message = "Name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @NotBlank (message = "Email is required")
    @Email (message = "Please provide a valid email")
    @Column (nullable = false , unique = true)
    @Size (max = 150, message = "Email cannot exceed 150 characters")
    private String email;

    @NotBlank (message = "Phone is required")
    @Pattern (
        regexp = "^[0-9]{10}$",
        message = "Phone must contain exactly 10 digits"
    )
    private String phone;

    // Default Constructor
    public Employee(){

    }

    // Getter and Setter for ID

    public Long getId(){
        return id;
    }

    public void setId(Long id){
        this.id = id;
    }

    // Getter and setter for name

    public String getName(){
        return name;
    }  
    
    public void setName(String name){
        this.name = name;
    }

    // Getter and setter for email

    public String getEmail(){
        return email;
    }

    public void setEmail(String email){
        this.email = email;
    }

    // Getter and setter for phone

    public String getPhone(){
        return phone;
    }

    public void setPhone(String phone){
        this.phone = phone;
    }
}
