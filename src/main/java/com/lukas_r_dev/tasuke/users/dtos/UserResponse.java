package com.lukas_r_dev.tasuke.users.dtos;

import com.lukas_r_dev.tasuke.users.domain.Role;

import java.time.Instant;

public record UserResponse(Long id, String name, String email, Role role, boolean active, Instant createdAt, Instant updatedAt) {
}
