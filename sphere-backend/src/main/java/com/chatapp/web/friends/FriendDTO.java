package com.chatapp.web.friends;

import java.time.LocalDateTime;

import com.chatapp.web.message.MessageStatus;
import com.chatapp.web.signup.UserInfo;

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
    private String profilepicUrl;
    private String publicKey;
    private String lastMessage;
    private LocalDateTime lastMsgTime;
    private Long lastMessageSenderId;
    private MessageStatus status;
}
