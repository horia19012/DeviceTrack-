package com.example.user.entity;

import com.example.user.enums.Role;
import com.example.user.enums.Status;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")  // Changed to "users" for better convention (PostgreSQL convention)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)  // Added explicit name for clarity
    private Role role;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    private Status status;

    public User(String userName, Role role, String email, String password) {
        this.userName = userName;
        this.role = role;
        this.email = email;
        this.password = password;
    }
}
