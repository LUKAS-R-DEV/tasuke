package com.lukas_r_dev.tasuke.notification;

import com.lukas_r_dev.tasuke.AbstractIntegrationTest;
import com.lukas_r_dev.tasuke.notification.domain.Notification;
import com.lukas_r_dev.tasuke.users.domain.Role;
import com.lukas_r_dev.tasuke.users.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Duration;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

/**
 * Testes de comportamento do {@code @Notify} + {@code NotificationAspect}.
 * Usam o bean de teste {@link NotificationTestService} e o fluxo real @Async.
 */
class NotificationAspectIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private NotificationTestService notificationTestService;

    @Test
    void shouldCreateNotificationWhenMethodIsAnnotated() {
        User recipient = createUser("Destinatário", "dest@tasuke.io", Role.ROLE_CUSTOMER);

        notificationTestService.completeTask(recipient.getId());

        await().atMost(Duration.ofSeconds(5)).untilAsserted(() ->
                assertThat(notificationRepository.findAllByUser(recipient))
                        .anyMatch(n -> "Task done".equals(n.getTitle())));
    }

    @Test
    void shouldResolveSpelExpressionFromMethodParameter() {
        User recipient = createUser("Destinatário", "dest@tasuke.io", Role.ROLE_CUSTOMER);

        notificationTestService.completeTask(recipient.getId());

        await().atMost(Duration.ofSeconds(5)).untilAsserted(() -> {
            List<Notification> notifications = notificationRepository.findAllByUser(recipient);
            assertThat(notifications).hasSize(1);
            assertThat(notifications.get(0).getUser().getId()).isEqualTo(recipient.getId());
        });
    }

    @Test
    void shouldPropagateTitleAndMessageFromAnnotation() {
        User recipient = createUser("Destinatário", "dest@tasuke.io", Role.ROLE_CUSTOMER);

        notificationTestService.completeTask(recipient.getId());

        await().atMost(Duration.ofSeconds(5)).untilAsserted(() -> {
            List<Notification> notifications = notificationRepository.findAllByUser(recipient);
            assertThat(notifications).hasSize(1);
            assertThat(notifications.get(0).getTitle()).isEqualTo("Task done");
            assertThat(notifications.get(0).getMessage()).isEqualTo("A task was completed");
        });
    }

    @Test
    void shouldNotCreateNotificationWhenMethodIsNotAnnotated() {
        User user = createUser("Sem anotação", "plain@tasuke.io", Role.ROLE_CUSTOMER);

        String result = notificationTestService.plainMethod();

        assertThat(result).isEqualTo("plain");
        await().atMost(Duration.ofSeconds(2)).untilAsserted(() ->
                assertThat(notificationRepository.findAllByUser(user)).isEmpty());
    }

    @Test
    void shouldNotBreakMainFlowWhenRecipientDoesNotExist() {
        String result = notificationTestService.greet(99999L);

        assertThat(result).isEqualTo("greeted");
        await().atMost(Duration.ofSeconds(2)).untilAsserted(() ->
                assertThat(notificationRepository.findAll()).isEmpty());
    }
}
