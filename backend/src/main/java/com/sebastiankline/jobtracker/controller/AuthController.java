package com.sebastiankline.jobtracker.controller;

import com.sebastiankline.jobtracker.dto.AuthResponse;
import com.sebastiankline.jobtracker.dto.LoginRequest;
import com.sebastiankline.jobtracker.dto.RegisterRequest;
import com.sebastiankline.jobtracker.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

}
