package com.lukas_r_dev.tasuke.shared.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(StatusResponse statusResponse ,String message, T data, Instant timestamp) {



    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(StatusResponse.SUCCESS, null, data, Instant.now());
    }

    public static <T> ApiResponse<T> success(T data,String message) {
        return new ApiResponse<>(StatusResponse.SUCCESS,message, data, Instant.now());
    }
}
