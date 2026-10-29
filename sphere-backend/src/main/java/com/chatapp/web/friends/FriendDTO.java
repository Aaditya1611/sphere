package com.chatapp.web.friends;

import java.time.LocalDateTime;

import com.chatapp.web.message.MessageStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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

    public FriendDTO(Long id, String firstname, String lastname, String bio, String email, String profilepicUrl,
            String publicKey, String lastMsgContent, LocalDateTime lastMsgTime, Long lastMsgSenderId,
            MessageStatus msgStatus) {
    }
}
