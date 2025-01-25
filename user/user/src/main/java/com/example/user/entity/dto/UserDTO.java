package com.example.user.entity.dto;

import com.example.user.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String userName;
    private Role role;
    private String email;
    private String password;
}