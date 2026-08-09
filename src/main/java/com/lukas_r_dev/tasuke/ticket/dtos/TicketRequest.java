package com.lukas_r_dev.tasuke.ticket.dtos;

import com.lukas_r_dev.tasuke.ticket.domain.TicketPriority;
import com.lukas_r_dev.tasuke.ticket.domain.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TicketRequest(
        @NotBlank(message = "title is required")
        String title,
        @NotBlank(message = "description is required")
        String description,
        @NotNull(message = "user id is required")
        Long userId,
        @NotNull(message = "priority is required")
        TicketPriority priority) {
}
