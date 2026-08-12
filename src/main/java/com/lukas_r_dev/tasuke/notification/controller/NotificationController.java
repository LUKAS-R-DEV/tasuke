package com.lukas_r_dev.tasuke.notification.controller;

import com.lukas_r_dev.tasuke.notification.dtos.NotificationRequest;
import com.lukas_r_dev.tasuke.notification.dtos.NotificationResponse;
import com.lukas_r_dev.tasuke.notification.service.NotificationService;
import com.lukas_r_dev.tasuke.shared.response.ApiResponse;
import com.lukas_r_dev.tasuke.users.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<NotificationResponse>> findAll(@AuthenticationPrincipal User user) {
        return ApiResponse.success(notificationService.findAllByUser(user));
    }
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<NotificationResponse> findById(@PathVariable Long id,@AuthenticationPrincipal User user) {
        return ApiResponse.success(notificationService.findByIdAndUser(id, user));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@Valid @RequestBody NotificationRequest notificationRequest) {
    }
    @PatchMapping("/{id}/read")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<NotificationResponse> read (@PathVariable Long id,@AuthenticationPrincipal User user) {
        return ApiResponse.success(notificationService.marAsRead(id, user),"Notification mark is read");
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<NotificationResponse> delete (@PathVariable Long id,@AuthenticationPrincipal User user) {
        return ApiResponse.success(notificationService.delete(id, user),"Notification deleted");
    }

}
