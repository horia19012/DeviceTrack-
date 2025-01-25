package com.example.user.service;



import com.example.user.entity.User;
import com.example.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DefaultCustomUserDetailsService implements CustomUserDetailsService {

    @Autowired
    private final UserRepository usersRepository;
    public DefaultCustomUserDetailsService(UserRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = usersRepository.findByUserName(username);
        if (user.isEmpty()) {
            return null;
        }
        User foundUser=user.get();
        return org.springframework.security.core.userdetails.User.builder()
                .username(foundUser.getUserName())
                .password(foundUser.getPassword())
                .roles(foundUser.getRole().toString())
                .build();
    }
}