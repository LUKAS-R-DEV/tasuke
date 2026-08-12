package com.lukas_r_dev.tasuke.notification.service;

import com.lukas_r_dev.tasuke.notification.domain.Notification;
import com.lukas_r_dev.tasuke.notification.dtos.NotificationRequest;
import com.lukas_r_dev.tasuke.notification.dtos.NotificationResponse;
import com.lukas_r_dev.tasuke.notification.mapper.NotificationMapper;
import com.lukas_r_dev.tasuke.notification.repository.NotificationRepository;
import com.lukas_r_dev.tasuke.shared.exceptions.NotFoundException;
import com.lukas_r_dev.tasuke.users.domain.User;
import com.lukas_r_dev.tasuke.users.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final UserService userService;


    public List<NotificationResponse> findAllByUser(User user){
        return notificationRepository.findAllByUser(user).stream().map(notificationMapper::toNotificationResponse).toList();
    }


    @Async
    @Transactional
    public void create (NotificationRequest notificationRequest){
        Notification notification = notificationMapper.toNotification(notificationRequest);
        User user = userService.findByIdActiveTrue(notificationRequest.userId());
        notification.setUser(user);
        Notification savedNotification = notificationRepository.save(notification);

    }

    public NotificationResponse findByIdAndUser(Long id,User user){
        return notificationMapper.toNotificationResponse(notificationRepository.findByIdAndUser(id,user).orElseThrow(()-> new NotFoundException("Notification not found")));
    }

    @Transactional
    public NotificationResponse marAsRead(Long id,User user){
        Notification notification = notificationRepository.findByIdAndUser(id,user).orElseThrow(()-> new NotFoundException("Notification not found"));
        notification.setIsRead(true);
        return notificationMapper.toNotificationResponse(notificationRepository.save(notification));
    }

    @Transactional
    public NotificationResponse delete(Long id,User user){
        Notification notification = notificationRepository.findByIdAndUser(id,user).orElseThrow(()-> new NotFoundException("Notification not found"));
        notificationRepository.delete(notification);
        return notificationMapper.toNotificationResponse(notification);
    }
}
