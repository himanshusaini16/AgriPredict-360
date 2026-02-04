package com.croprecommand.cropserver.controller;

import com.croprecommand.cropserver.Model.User;
import com.croprecommand.cropserver.repo.UserRepository;
import com.croprecommand.cropserver.service.ImageUploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;
    private final ImageUploadService imageUploadService;

    public UserController(UserRepository userRepository,
                          ImageUploadService imageUploadService) {
        this.userRepository = userRepository;
        this.imageUploadService = imageUploadService;
    }

    @PostMapping("/{userId}/upload-image")
    public ResponseEntity<?> uploadProfileImage(
            @PathVariable String userId,
            @RequestParam("image") MultipartFile image
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String imageUrl = imageUploadService.uploadImage(image);
        user.setImage(imageUrl);
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}/update-name")
    public ResponseEntity<?> updateUsername(
            @PathVariable String userId,
            @RequestParam String username
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(username);
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }


    @GetMapping("/{userId}")
    public ResponseEntity<User> getProfile(@PathVariable String userId) {
        return ResponseEntity.ok(
                userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found"))
        );
    }




}
