package com.chatapp.web.stomp;

import lombok.Data;

@Data
public class ChatMessage {

    private String senderName;
    private String recipientName;
    private String content;
    private String timestamp;
    private String status;

    public String getSenderName() {

        return senderName;
    };

    public void getRecipientName(String senderName) {

        this.senderName = senderName;
    };

    public String getRecipientName() {

        return recipientName;
    };

    public void setRecipientName(String recipientName) {

        this.recipientName = recipientName;
    };

    public String getContent() {

        return content;
    }

    public void setContent(String content) {

        this.content = content;
    }

    public String getTimeStamp() {

        return timestamp;
    }

    public void setTimeStamp(String timestamp) {

        this.timestamp = timestamp;
    }

    public String getStatus() {

        return status;
    }

    public void setStatus(String status) {

        this.status = status;
    }
}
