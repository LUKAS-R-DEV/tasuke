package com.lukas_r_dev.tasuke.notification.mapper;

import com.lukas_r_dev.tasuke.notification.domain.Notification;
import com.lukas_r_dev.tasuke.notification.dtos.NotificationRequest;
import com.lukas_r_dev.tasuke.notification.dtos.NotificationResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    Notification toNotification(NotificationRequest notificationRequest);

    @Mapping(target = "userName", source = "user.name")
    NotificationResponse toNotificationResponse(Notification notification);

}
