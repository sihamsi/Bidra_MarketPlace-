package com.siham.demo.dto;

import com.siham.demo.model.User;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private User user;
}