package com.lukas_r_dev.tasuke.notification.aspect;

import com.lukas_r_dev.tasuke.notification.annotation.Notify;
import com.lukas_r_dev.tasuke.notification.dtos.NotificationRequest;
import com.lukas_r_dev.tasuke.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class NotificationAspect {
    private final NotificationService notificationService;

    @AfterReturning(value = "@annotation(notify)", returning = "result")
    public void handleNotification(JoinPoint joinPoint, Notify notify,Object result) {
        Long userId = null;

        if(!notify.userId().isBlank()){
            userId = evaluateSpel(joinPoint, notify.userId(), Long.class);

        }
        if(userId != null){
            NotificationRequest notificationRequest = new NotificationRequest(
                    notify.title(),
                    notify.message(),
                    userId
            );
            notificationService.create(notificationRequest);
        }

    }
    private <T> T evaluateSpel(JoinPoint joinPoint,String spelExpression,Class<T> clazz){
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        String[] paramNames = methodSignature.getParameterNames();
        Object[] args = joinPoint.getArgs();

        EvaluationContext context = new StandardEvaluationContext(args);
        for(int i = 0; i < paramNames.length; i++){
            context.setVariable(paramNames[i], args[i]);
        }

        ExpressionParser expressionParser = new SpelExpressionParser();
        return expressionParser.parseExpression(spelExpression).getValue(context, clazz);

    }


}
