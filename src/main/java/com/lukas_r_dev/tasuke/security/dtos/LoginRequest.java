package com.lukas_r_dev.tasuke.security.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "email is required")
        @Email(message = "invalid email")
        String email,
        @NotBlank(message = "password is required")
        String password) {
}
