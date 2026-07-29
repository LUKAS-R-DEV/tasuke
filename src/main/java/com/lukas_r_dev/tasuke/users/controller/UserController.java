package com.lukas_r_dev.tasuke.users.controller;

import com.lukas_r_dev.tasuke.shared.response.ApiResponse;
import com.lukas_r_dev.tasuke.users.dtos.UserRequest;
import com.lukas_r_dev.tasuke.users.dtos.UserResponse;
import com.lukas_r_dev.tasuke.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;



   @GetMapping
   @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<UserResponse>> findAll(){
        return ApiResponse.success(userService.findAll());
    }
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<UserResponse> findById(@PathVariable Long id){
        return ApiResponse.success(userService.findById(id));
    }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<UserResponse> save(@Valid @RequestBody UserRequest userRequest){
        return ApiResponse.success(userService.save(userRequest),"User saved successfully");
    }
    @PatchMapping("/deactivate/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<UserResponse> deactivate(@PathVariable Long id){
        return ApiResponse.success(userService.deactivate(id),"User deactivated successfully");
    }
    @PatchMapping("/activate/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<UserResponse> activate(@PathVariable Long id){
        return ApiResponse.success(userService.activate(id),"User activated successfully");
    }
    @PatchMapping("/update/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<UserResponse> update(@PathVariable Long id, @Valid @RequestBody UserRequest userRequest){
        return ApiResponse.success(userService.update(id, userRequest),"User updated successfully");
    }





}
