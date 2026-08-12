package com.lukas_r_dev.tasuke.shared.exceptions;

import com.lukas_r_dev.tasuke.shared.response.ApiResponseError;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.Instant;
import java.util.List;

@RestControllerAdvice
public class HandleException {
    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponseError authenticationException(AuthenticationException ex){
        return ApiResponseError.builder()
                .statusCode(HttpStatus.UNAUTHORIZED.value())
                .message("Credenciais inválidas")
                .timestamp(Instant.now())
                .build();
    }

    @ExceptionHandler(DomainException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponseError domainException(DomainException ex){
        ApiResponseError apiResponseError = ApiResponseError.builder()
            .statusCode(HttpStatus.BAD_REQUEST.value())
            .message(ex.getMessage())
            .timestamp(Instant.now())
            .build();
        return apiResponseError;
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponseError notFoundException(NotFoundException ex){
        ApiResponseError apiResponseError = ApiResponseError.builder()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .timestamp(Instant.now())
                .build();
        return apiResponseError;
    }
    @ExceptionHandler(ConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiResponseError conflictException (ConflictException ex){
        ApiResponseError apiResponseError = ApiResponseError.builder()
                .statusCode(HttpStatus.CONFLICT.value())
                .message(ex.getMessage())
                .timestamp(Instant.now())
                .build();
        return apiResponseError;
    }
   @ExceptionHandler(MethodArgumentNotValidException.class)
   @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponseError methodArgumentException(MethodArgumentNotValidException ex){
        List<String> errors = ex.getBindingResult().getFieldErrors().stream().map(error ->error.getField()+ ": "+error.getDefaultMessage()).toList();
        ApiResponseError apiResponseError = ApiResponseError.builder()
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .message("Erro de validacao nos campos")
                .errors(errors)
                .timestamp(Instant.now())
                .build();
        return apiResponseError;
   }
   @ExceptionHandler(MethodArgumentTypeMismatchException.class)
   @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponseError methodMismatchException (MethodArgumentTypeMismatchException ex){
        String requiredType = ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "desconhecido";
        String message = String.format("O parametro '%s' deve ser do tipo '%s'.",ex.getName(),requiredType);
        ApiResponseError apiResponseError = ApiResponseError.builder()
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .message(message)
                .timestamp(Instant.now())
                .build();
        return apiResponseError;
   }
   @ExceptionHandler(AuthorizationDeniedException.class)
   @ResponseStatus(HttpStatus.FORBIDDEN)
   public ApiResponseError authorizationDeniedException(AuthorizationDeniedException ex){
        return ApiResponseError.builder()
                .statusCode(HttpStatus.FORBIDDEN.value())
                .message("Acesso negado")
                .timestamp(Instant.now())
                .build();
   }

   @ExceptionHandler(Exception.class)
   @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponseError globalException(Exception ex){
        ApiResponseError apiResponseError = ApiResponseError.builder()
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("Erro interno do servidor")
                .timestamp(Instant.now())
                .build();
        return apiResponseError;

   }










}
