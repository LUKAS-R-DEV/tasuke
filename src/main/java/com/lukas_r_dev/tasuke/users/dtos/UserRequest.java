package com.lukas_r_dev.tasuke.users.dtos;

import com.lukas_r_dev.tasuke.users.domain.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRequest(
        @NotBlank(message = "Name is required")
        String name,
        @NotBlank(message = "Email is required")
        @Email()
        String email,
        @NotBlank(message = "Password is required")
        String password,
        @NotNull(message = "Role is required")
        Role role) {
}
