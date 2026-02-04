package com.croprecommand.cropserver.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        System.out.println("Home endpoint accessed");
        return "Welcome to the Crop Recommendation Server!";

    }
}
