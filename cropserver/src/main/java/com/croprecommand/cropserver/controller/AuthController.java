package com.croprecommand.cropserver.controller;

import com.croprecommand.cropserver.dto.LoginRequest;
import com.croprecommand.cropserver.dto.RegisterRequest;
import com.croprecommand.cropserver.dto.UserResponse;
import com.croprecommand.cropserver.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest req) {
        System.out.println("In register");
        System.out.println(req);
        return authService.register(req);
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest req) {
        System.out.println("In login Api");
        return authService.login(req);
    }
}
