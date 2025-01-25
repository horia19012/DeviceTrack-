package com.example.user.service;

import com.example.user.entity.User;
import com.example.user.entity.dto.LoginRequest;
import com.example.user.repository.UserRepository;
import com.example.user.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    @Autowired
    public AuthenticationService(UserRepository usersRepository, PasswordEncoder passwordEncoder,JwtUtil jwtUtil) {
        this.userRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String authenticate(LoginRequest loginRequest) {
        User user = userRepository.findByUserName(loginRequest.getUsername())
                .orElse(null);
        if (user == null) {
            return null;
        }
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return jwtUtil.generateToken(user.getUserName());
        }
        return null;
    }
}