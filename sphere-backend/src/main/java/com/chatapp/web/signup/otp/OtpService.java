package com.chatapp.web.signup.otp;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    public OtpRepository otpRepository;


    public String generateOTP() {

        return String.valueOf(100000 + new Random().nextInt(999999));
    }

    // @Value("${MAIL_PASSWORD}")
    // private String debugPassword;

    // @Value("${MAIL_USERNAME}")
    // private String debugEmail;

    // @PostConstruct
    // public void init() {
    //     System.out.println("========================================");
    //     System.out.println("DEBUG EMAIL: " + debugEmail);
    //     System.out.println("DEBUG PASSWORD: '" + debugPassword + "'"); // Quotes help see spaces!
    //     System.out.println("========================================");
    // }

    public void sendOtpEmail(String email) {

        String otp = generateOTP();

        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);
        OtpEntity existing = otpRepository.findByEmail(email).orElse(null);

        if(existing == null) {
            existing = new OtpEntity();
            existing.setEmail(email);
        }

        existing.setOtp(otp);
        existing.setExpiryTime(expiry);
        existing.setAttempts(0);

        otpRepository.save(existing);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Here is your verfication code: ");
        message.setText("Your OTP is " + otp + "\n Otp is valid only for 5 minutes");

        mailSender.send(message);
    }
    
    public boolean verifyOtp(String email, String enteredotp) {

        OtpEntity entity = otpRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Otp not found for this user"));

        if(entity.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpRepository.delete(entity);
            throw new RuntimeException("OTP expired");
        };

        if(entity.getAttempts() >= 3 ) {
            otpRepository.delete(entity);
            throw new RuntimeException("Too many attempts");
        }

        if(!entity.getOtp().equals(enteredotp)) {
            entity.setAttempts(entity.getAttempts() + 1);
            otpRepository.save(entity);
            throw new RuntimeException("Invalid OTP");
        }

        //otpRepository.delete(entity);
        return true;
    }
}