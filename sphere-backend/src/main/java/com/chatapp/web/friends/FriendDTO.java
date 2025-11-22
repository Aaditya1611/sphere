package com.chatapp.web.friends;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FriendDTO {
    
    // private Long id;
    //private Long userId;
    private String firstname;
    private String lastname;
    private String bio;
    private String email;
    private Long friend;
    private Long blockedUser;
    private String blockedUserEmail;
}
