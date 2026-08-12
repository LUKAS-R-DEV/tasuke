package com.lukas_r_dev.tasuke.notification;

import com.lukas_r_dev.tasuke.notification.annotation.Notify;
import org.springframework.stereotype.Component;

/**
 * Bean de teste usado exclusivamente para comprovar o comportamento observável
 * do {@code @Notify} + {@code NotificationAspect} sem depender de métodos de produção.
 */
@Component
public class NotificationTestService {

    @Notify(title = "Task done", message = "A task was completed", userId = "#agentId")
    public String completeTask(Long agentId) {
        return "completed";
    }

    @Notify(title = "Greeting", message = "Hello user", userId = "#userId")
    public String greet(Long userId) {
        return "greeted";
    }

    public String plainMethod() {
        return "plain";
    }
}
