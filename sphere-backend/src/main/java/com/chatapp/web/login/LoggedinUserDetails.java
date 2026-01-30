package com.chatapp.web.login;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoggedinUserDetails {
    
    private Long id;
    private String username;
    private String firstname;
    private String lastname;
    private String email;
    private String bio;
    private String profilepicUrl;
}
