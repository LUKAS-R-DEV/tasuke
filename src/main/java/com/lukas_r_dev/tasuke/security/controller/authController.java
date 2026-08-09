package com.lukas_r_dev.tasuke.security.controller;

import com.lukas_r_dev.tasuke.security.dtos.LoginRequest;
import com.lukas_r_dev.tasuke.security.dtos.LoginResponse;
import com.lukas_r_dev.tasuke.security.jwt.JwtService;
import com.lukas_r_dev.tasuke.shared.response.ApiResponse;
import com.lukas_r_dev.tasuke.users.domain.User;
import com.lukas_r_dev.tasuke.users.dtos.UserResponse;

import com.lukas_r_dev.tasuke.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class authController {
    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email(),loginRequest.password())
        );
        User user = (User) authentication.getPrincipal();
        String token = jwtService.generateToken(user);
        return ApiResponse.success(new LoginResponse(token),"login successfully");
    }
    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<UserResponse> getMe(@AuthenticationPrincipal UserDetails userDetails){
      UserResponse userResponse = userService.findByEmail(userDetails.getUsername());
      return ApiResponse.success(userResponse);
    }

}
