package com.croprecommand.cropserver.service;

import com.croprecommand.cropserver.Model.User;
import com.croprecommand.cropserver.config.JwtUtil;
import com.croprecommand.cropserver.dto.LoginRequest;
import com.croprecommand.cropserver.dto.RegisterRequest;
import com.croprecommand.cropserver.dto.UserResponse;
import com.croprecommand.cropserver.repo.UserRepository;
import lombok.Data;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Data
@Service
public class AuthService {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepo,JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
    }

    public UserResponse register(RegisterRequest req) {

        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(
                BCrypt.hashpw(req.getPassword(), BCrypt.gensalt())
        );


        User savedUser = userRepo.save(user);

        String token = jwtUtil.generateToken(savedUser.getEmail());

        UserResponse res = new UserResponse();
        res.setId(savedUser.getId());
        res.setName(savedUser.getName());
        res.setEmail(savedUser.getEmail());
        res.setToken(token);

        return res;
    }


    public UserResponse login(LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!BCrypt.checkpw(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

//        System.out.println("Token generated"+ " " +token);

        UserResponse res = new UserResponse();
        res.setId(user.getId());
        res.setName(user.getName());
        res.setEmail(user.getEmail());
        res.setToken(token);
        return res;
    }
}