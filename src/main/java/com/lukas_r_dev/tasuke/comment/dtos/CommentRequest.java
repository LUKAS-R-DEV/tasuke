package com.lukas_r_dev.tasuke.comment.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CommentRequest(
        @NotBlank(message = "Message cannot be blank")
        String message,
        @NotNull(message = "Ticket ID cannot be null")
        Long ticketId,
        @NotNull(message = "User ID cannot be null")
        Long userId) {
}
