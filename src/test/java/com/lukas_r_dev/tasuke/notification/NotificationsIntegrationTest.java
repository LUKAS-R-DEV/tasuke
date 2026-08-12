package com.lukas_r_dev.tasuke.notification;

import com.lukas_r_dev.tasuke.AbstractIntegrationTest;
import com.lukas_r_dev.tasuke.notification.domain.Notification;
import com.lukas_r_dev.tasuke.users.domain.Role;
import com.lukas_r_dev.tasuke.users.domain.User;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class NotificationsIntegrationTest extends AbstractIntegrationTest {

    @Test
    void shouldListOnlyOwnNotifications() throws Exception {
        User owner = createUser("Dono", "dono@tasuke.io", Role.ROLE_CUSTOMER);
        User other = createUser("Outro", "outro@tasuke.io", Role.ROLE_CUSTOMER);
        createNotification(owner, "Do dono", "mensagem do dono");
        createNotification(other, "De outro", "mensagem de outro");

        String token = tokenFor(owner);

        authorized(get("/notifications"), token)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].title").value("Do dono"));
    }

    @Test
    void shouldMarkNotificationAsRead() throws Exception {
        User owner = createUser("Dono", "dono@tasuke.io", Role.ROLE_CUSTOMER);
        Notification notification = createNotification(owner, "Título", "mensagem");
        String token = tokenFor(owner);

        authorized(patch("/notifications/" + notification.getId() + "/read"), token)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isRead").value(true));
    }

    @Test
    void shouldRejectMarkingReadNotificationOfAnotherUser() throws Exception {
        User owner = createUser("Dono", "dono@tasuke.io", Role.ROLE_CUSTOMER);
        User other = createUser("Outro", "outro@tasuke.io", Role.ROLE_CUSTOMER);
        Notification notification = createNotification(owner, "Título", "mensagem");
        String otherToken = tokenFor(other);

        authorized(patch("/notifications/" + notification.getId() + "/read"), otherToken)
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldDeleteOwnNotification() throws Exception {
        User owner = createUser("Dono", "dono@tasuke.io", Role.ROLE_CUSTOMER);
        Notification notification = createNotification(owner, "Título", "mensagem");
        String token = tokenFor(owner);

        authorized(delete("/notifications/" + notification.getId()), token).andExpect(status().isOk());

        assertThat(notificationRepository.findById(notification.getId())).isEmpty();
    }

    @Test
    void shouldRejectDeletingNotificationOfAnotherUser() throws Exception {
        User owner = createUser("Dono", "dono@tasuke.io", Role.ROLE_CUSTOMER);
        User other = createUser("Outro", "outro@tasuke.io", Role.ROLE_CUSTOMER);
        Notification notification = createNotification(owner, "Título", "mensagem");
        String otherToken = tokenFor(other);

        authorized(delete("/notifications/" + notification.getId()), otherToken)
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturnNotFoundForMissingNotification() throws Exception {
        User owner = createUser("Dono", "dono@tasuke.io", Role.ROLE_CUSTOMER);
        String token = tokenFor(owner);

        mockMvc.perform(get("/notifications/99999").header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }
}
