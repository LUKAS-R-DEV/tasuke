package com.lukas_r_dev.tasuke.notification.service;

import com.lukas_r_dev.tasuke.notification.domain.Notification;
import com.lukas_r_dev.tasuke.notification.dtos.NotificationRequest;
import com.lukas_r_dev.tasuke.notification.dtos.NotificationResponse;
import com.lukas_r_dev.tasuke.notification.mapper.NotificationMapper;
import com.lukas_r_dev.tasuke.notification.repository.NotificationRepository;
import com.lukas_r_dev.tasuke.shared.exceptions.NotFoundException;
import com.lukas_r_dev.tasuke.users.domain.User;
import com.lukas_r_dev.tasuke.users.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private NotificationMapper notificationMapper;
    @Mock
    private UserService userService;
    @InjectMocks
    private NotificationService notificationService;

    private User user(Long id) {
        User u = new User();
        u.setId(id);
        u.setName("Ana");
        return u;
    }

    @Test
    void shouldCreateNotificationWhenRecipientExists() {
        NotificationRequest request = new NotificationRequest("Título", "Mensagem", 1L);
        User recipient = user(1L);
        Notification notification = new Notification();

        when(notificationMapper.toNotification(request)).thenReturn(notification);
        when(userService.findByIdActiveTrue(1L)).thenReturn(recipient);
        when(notificationRepository.save(notification)).thenReturn(notification);

        notificationService.create(request);

        assertThat(notification.getUser()).isEqualTo(recipient);
        verify(notificationRepository).save(notification);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenRecipientDoesNotExist() {
        NotificationRequest request = new NotificationRequest("Título", "Mensagem", 99L);
        when(userService.findByIdActiveTrue(99L)).thenThrow(new NotFoundException("User not found"));

        assertThrows(NotFoundException.class, () -> notificationService.create(request));
    }

    @Test
    void shouldReturnNotificationsForUser() {
        User user = user(1L);
        Notification notification = new Notification();
        NotificationResponse response =
                new NotificationResponse(1L, "Título", "Mensagem", false, Instant.parse("2026-01-01T10:00:00Z"), "Ana");

        when(notificationRepository.findAllByUser(user)).thenReturn(List.of(notification));
        when(notificationMapper.toNotificationResponse(notification)).thenReturn(response);

        List<NotificationResponse> result = notificationService.findAllByUser(user);

        assertThat(result).containsExactly(response);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenNotificationIsNotOwnedByUser() {
        User user = user(1L);
        when(notificationRepository.findByIdAndUser(anyLong(), org.mockito.ArgumentMatchers.any()))
                .thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> notificationService.findByIdAndUser(99L, user));
    }

    @Test
    void shouldMarkNotificationAsReadWhenOwnedByUser() {
        User user = user(1L);
        Notification notification = new Notification();
        notification.setIsRead(false);
        NotificationResponse response =
                new NotificationResponse(1L, "Título", "Mensagem", true, Instant.parse("2026-01-01T10:00:00Z"), "Ana");

        when(notificationRepository.findByIdAndUser(1L, user)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(notification)).thenReturn(notification);
        when(notificationMapper.toNotificationResponse(notification)).thenReturn(response);

        notificationService.marAsRead(1L, user);

        assertThat(notification.getIsRead()).isTrue();
        verify(notificationRepository).save(notification);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenMarkingReadNotificationOfAnotherUser() {
        User user = user(1L);
        when(notificationRepository.findByIdAndUser(99L, user)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> notificationService.marAsRead(99L, user));
    }

    @Test
    void shouldDeleteNotificationWhenOwnedByUser() {
        User user = user(1L);
        Notification notification = new Notification();
        NotificationResponse response =
                new NotificationResponse(1L, "Título", "Mensagem", false, Instant.parse("2026-01-01T10:00:00Z"), "Ana");

        when(notificationRepository.findByIdAndUser(1L, user)).thenReturn(Optional.of(notification));
        when(notificationMapper.toNotificationResponse(notification)).thenReturn(response);

        notificationService.delete(1L, user);

        verify(notificationRepository).delete(notification);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenDeletingNotificationOfAnotherUser() {
        User user = user(1L);
        when(notificationRepository.findByIdAndUser(99L, user)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> notificationService.delete(99L, user));
    }
}
