package com.chatapp.web.login;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoggedinUserDetails {
    
    private Long id;
    private String username;
    private String firstname;
    private String lastname;
    private String email;
    private String bio;
    private String profilepicUrl;

    LoggedinUserDetails(Long id, String username, String firstname, String lastname, String email, String bio, String profilepicUrl) {
    }
}
