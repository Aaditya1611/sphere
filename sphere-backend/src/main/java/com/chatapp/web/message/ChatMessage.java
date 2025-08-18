package com.chatapp.web.message;

import lombok.Data;

@Data
public class ChatMessage {

    private String senderName;
    private String recipientName;
    private String content;
    private String timestamp;
    private String status;

}
