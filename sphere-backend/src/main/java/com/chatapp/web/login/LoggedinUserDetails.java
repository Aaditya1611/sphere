package com.chatapp.web.login;

import java.util.List;

import com.chatapp.web.friends.Friends;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter
@AllArgsConstructor //generates constructor for all arguments
public class LoggedinUserDetails {
    
    private Long id;
    private String username;
    private String email;
    private String bio;
  // private List<ChatInfo> chats;
  // private List userSettings;
    private List<Friends> friends;

}
