package com.lukas_r_dev.tasuke.notification.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NotificationRequest(
        @NotBlank(message = "Title is required")
        String title,
        @NotBlank(message = "Message is required")
        String message,
        @NotNull(message = "User ID is required")
        Long userId) {
}
