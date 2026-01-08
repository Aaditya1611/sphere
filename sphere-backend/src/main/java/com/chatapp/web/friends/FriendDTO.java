package com.chatapp.web.friends;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FriendDTO {
    
    private Long id;
    private String firstname;
    private String lastname;
    private String bio;
    private String email;
}
