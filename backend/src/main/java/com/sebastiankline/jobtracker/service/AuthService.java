package com.sebastiankline.jobtracker.service;

import com.sebastiankline.jobtracker.dto.AuthResponse;
import com.sebastiankline.jobtracker.dto.LoginRequest;
import com.sebastiankline.jobtracker.dto.RegisterRequest;
import com.sebastiankline.jobtracker.exception.AuthException;
import com.sebastiankline.jobtracker.model.User;
import com.sebastiankline.jobtracker.repository.UserRepository;
import com.sebastiankline.jobtracker.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        // Check is user exists by email
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        // If Optional is present, user exists (if empty, user doesn't exist)
        if (existingUser.isPresent()) {
            throw new AuthException("User already exists!");
        }

        User user = new User();

        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        userRepository.save(user);

        AuthResponse response = new AuthResponse(jwtService.generateToken(user));
        response.setFirstName(user.getFirstName());

        return response;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthException("Invalid email or password");
        }

        AuthResponse response = new AuthResponse(jwtService.generateToken(user));
        response.setFirstName(user.getFirstName());

        return response;
    }

}
