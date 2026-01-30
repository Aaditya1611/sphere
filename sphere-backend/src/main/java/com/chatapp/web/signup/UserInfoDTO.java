package com.chatapp.web.signup;

import lombok.Data;

@Data
public class UserInfoDTO {
    
    private Long userId;
    private String bio;
    private String firstname;
    private String lastname;
    private String publicKey;
}
