package com.example.user.config;

import com.example.user.entity.User;
import com.example.user.enums.Role;
import com.example.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Autowired
    private UserRepository userRepository;
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public CommandLineRunner initDatabase() {
        return args -> {
            // Check if the admin user already exists to avoid duplicates
            if (userRepository.findByUserName("admin").isEmpty()) { // Changed to null check
                User adminUser = new User("admin", Role.ADMIN, "admin@example.com", "$2a$10$GEzvbalcinQRZHPNUp70pelnv3QkrRgp5e5vUiW1YfNx7T1QdlmxO");
                userRepository.save(adminUser);
            }
        };
    }
}