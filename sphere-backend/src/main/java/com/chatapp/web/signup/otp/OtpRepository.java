package com.chatapp.web.signup.otp;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OtpRepository extends JpaRepository<OtpEntity, Long> {
   
    Optional<OtpEntity> findByEmail(String email);
}