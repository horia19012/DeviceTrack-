package com.example.user.service;

import com.example.user.entity.User;
import com.example.user.entity.dto.UserDTO;
import com.example.user.enums.Role;
import com.example.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    // Find all users
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    // Find user by ID
    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    // Create a new user
    public User createUser(UserDTO userDTO) {
        System.out.println(userDTO.getUserName());
        User user = new User(
                userDTO.getUserName(),
                Role.USER,
                userDTO.getEmail(),
                this.passwordEncoder.encode(userDTO.getPassword())
        );

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists: " + user.getEmail());
        }
        if (userRepository.existsByUserName(user.getUserName())) {
            throw new RuntimeException("Username already exists: " + user.getUserName());
        }

        userRepository.save(user);
        return user;
    }

    // Update an existing user
    public User updateUser(Long id, User updatedUser) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();
            existingUser.setUserName(updatedUser.getUserName()); // Assuming a username field
            existingUser.setEmail(updatedUser.getEmail()); // Assuming an email field
            existingUser.setRole(updatedUser.getRole());
            // Update other fields as necessary

            return userRepository.save(existingUser);
        } else {
            throw new RuntimeException("User not found with id: " + id);
        }
    }

    // Delete a user by ID
    public void deleteUser(Long id) {


        userRepository.deleteById(id);
    }

    public User findByUserName(String userName) {
        return userRepository.findByUserName(userName)
                .orElse(null);
    }

    public String findUserNameById(Long id) {
        return userRepository.findUserNameById(id);
    }

}
