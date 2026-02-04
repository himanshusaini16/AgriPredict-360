//package com.croprecommand.cropserver.Security;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//@EnableMethodSecurity
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//
//        http
//                // ❌ disable CSRF (Postman / REST APIs)
//                .csrf(csrf -> csrf.disable())
//
//                // ❌ disable all default auth mechanisms
//                .formLogin(form -> form.disable())
//                .httpBasic(basic -> basic.disable())
//
//                // ✅ allow everything
//                .authorizeHttpRequests(auth -> auth
//                        .anyRequest().permitAll()
//                )
//
//                // ❌ no session
//                .sessionManagement(session ->
//                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                );
//
//        return http.build();
//    }
//}
