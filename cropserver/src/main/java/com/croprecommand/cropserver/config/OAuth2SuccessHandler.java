package com.croprecommand.cropserver.config;

import com.croprecommand.cropserver.Model.User;
import com.croprecommand.cropserver.repo.UserRepository;
import com.croprecommand.cropserver.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepo;

    @Value("${app.oauth2.redirect-uri:http://localhost:5173}")
    private String redirectUri;


    public OAuth2SuccessHandler(
            JwtService jwtService,
            UserRepository userRepo
    ) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String image = oAuth2User.getAttribute("picture");

        User user = userRepo.findByEmail(email)
                .orElseGet(() -> {
                    User u = new User();
                    u.setEmail(email);
                    u.setName(name);
                    u.setImage(image);
                    return userRepo.save(u);
                });

        String token = jwtService.generateToken(user);
        System.out.println("token-->"+token);

        System.out.println("User Info"+ user);

        // Redirect back to frontend with token
        response.sendRedirect(
                "http://localhost:5173/oauth2/success"
                        + "?token=" + token
                        + "&id=" + user.getId()
        );

    }
}
