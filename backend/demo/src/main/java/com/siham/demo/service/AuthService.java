package com.siham.demo.service;

import com.siham.demo.dto.AuthResponse;
import com.siham.demo.dto.RegisterRequest;
import com.siham.demo.model.User;
import com.siham.demo.repository.UserRepository;
import com.siham.demo.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.siham.demo.dto.AuthRequest;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
    // Validation manuelle supplémentaire
    if (request.getMotDePasse() == null || request.getMotDePasse().trim().isEmpty()) {
        throw new IllegalArgumentException("Le mot de passe ne peut pas être vide");
    }

    var user = User.builder()
            .prenom(request.getPrenom())
            .nom(request.getNom())
            .email(request.getEmail())
            .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
            .telephone(request.getTelephone())
            .role(request.getRole())
            .build();
    
    userRepository.save(user);
    
    var jwtToken = jwtUtil.generateToken(user);
    return AuthResponse.builder()
            .token(jwtToken)
            .user(user)
            .build();
}

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getMotDePasse()
            )
        );
        
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        
        var jwtToken = jwtUtil.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .user(user)
                .build();
    }
}