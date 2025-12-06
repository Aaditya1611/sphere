package com.chatapp.web.signup.otp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OtpController {
    
    @Autowired
    public OtpService otpService;

    @RequestMapping("/sendOtp")
    public ResponseEntity<?> sendOtp(@RequestParam String email) {
        
        otpService.sendOtpEmail(email);
        return ResponseEntity.ok("OTP sent successfully");
    }

    @RequestMapping("/verifyOtp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {

        boolean verified = otpService.verifyOtp(email, otp);
        if(verified == true) {
            return ResponseEntity.ok("OTP verification successfull");
        }
        else {
            return ResponseEntity.status(400).body("Otp verification failed");
        }
    }
}