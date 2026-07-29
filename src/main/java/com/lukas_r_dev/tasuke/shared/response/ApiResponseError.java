package com.lukas_r_dev.tasuke.shared.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

import java.time.Instant;
import java.util.List;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponseError(int statusCode, List<String> errors, String message, Instant timestamp)  {
}
