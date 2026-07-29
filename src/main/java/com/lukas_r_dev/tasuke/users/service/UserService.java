package com.lukas_r_dev.tasuke.users.service;

import com.lukas_r_dev.tasuke.shared.exceptions.ConflictException;
import com.lukas_r_dev.tasuke.shared.exceptions.NotFoundException;
import com.lukas_r_dev.tasuke.users.domain.User;
import com.lukas_r_dev.tasuke.users.dtos.UserRequest;
import com.lukas_r_dev.tasuke.users.dtos.UserResponse;
import com.lukas_r_dev.tasuke.users.mapper.UserMapper;
import com.lukas_r_dev.tasuke.users.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public List<UserResponse> findAll(){
        return userRepository.findAllByActiveTrue().stream().map(userMapper::toUserResponse).toList();
    }

    public UserResponse findById(Long id){
        User user = userRepository.findById(id).orElseThrow(()-> new NotFoundException("User not found"));
        return userMapper.toUserResponse(user);
    }

    public UserResponse save(UserRequest userRequest){
        User user  = userMapper.toUser(userRequest);
        if(userRepository.existsByEmailIgnoreCase(userRequest.email())){
            throw new ConflictException("Email already exists");
        }
        User savedUser = userRepository.save(user);
        return userMapper.toUserResponse(savedUser);

    }

    @Transactional
    public UserResponse update(Long id,UserRequest userRequest){
        User user = userRepository.findById(id).orElseThrow(()-> new NotFoundException("User not found"));
        userMapper.toUserUpdate(user, userRequest);
        return userMapper.toUserResponse(user);
    }

    @Transactional
    public UserResponse deactivate(Long id){
        User user = userRepository.findById(id).orElseThrow(()-> new NotFoundException("User not found"));
        user.deactivate();
        return userMapper.toUserResponse(user);
    }

    @Transactional
    public UserResponse activate(Long id){
        User user = userRepository.findById(id).orElseThrow(()-> new NotFoundException("User not found"));
        user.activate();
        return userMapper.toUserResponse(user);
    }




}
