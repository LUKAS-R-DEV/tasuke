package com.lukas_r_dev.tasuke.service;

import com.lukas_r_dev.tasuke.shared.exceptions.NotFoundException;
import com.lukas_r_dev.tasuke.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;


  @Override
    public UserDetails loadUserByUsername(String userName){
        return userRepository.findByEmailIgnoreCase(userName).orElseThrow(()-> new UsernameNotFoundException("User not found"));

    }

}
