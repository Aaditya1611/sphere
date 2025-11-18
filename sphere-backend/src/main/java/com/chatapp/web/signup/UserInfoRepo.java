package com.chatapp.web.signup;

import org.springframework.data.jpa.repository.JpaRepository;


public interface UserInfoRepo extends JpaRepository<UserInfo, Long>{
    UserInfo findByUsername(String username);
}

