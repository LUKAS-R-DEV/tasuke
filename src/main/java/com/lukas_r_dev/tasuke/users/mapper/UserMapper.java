package com.lukas_r_dev.tasuke.users.mapper;


import com.lukas_r_dev.tasuke.users.domain.User;
import com.lukas_r_dev.tasuke.users.dtos.UserRequest;
import com.lukas_r_dev.tasuke.users.dtos.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toUser(UserRequest userRequest);

    UserResponse toUserResponse(User user);

    void toUserUpdate(@MappingTarget User user, UserRequest userRequest);
}
