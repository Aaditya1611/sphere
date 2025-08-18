package com.chatapp.web.message;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private SimpMessageSendingOperations msgTemplate;

    public ChatController(SimpMessageSendingOperations msgTemplate) {
        this.msgTemplate = msgTemplate;
    }

    @MessageMapping("/Message")
    public ChatInfo sendMessage(ChatInfo chatMessage) {

        System.out.println("Recieved message from user: " + chatMessage.getSenderName() + ": " + chatMessage.getContent() );
        msgTemplate.convertAndSend("/topic/Message", chatMessage);
        System.out.println("Sent message to /topic/Message: " + chatMessage.getRecipientName() + ": " + chatMessage.getContent());
        return chatMessage;
    }

    @MessageMapping("/PrivateMessage")
    public ChatInfo sendPrivateMessage(ChatInfo chatMessage) {

        msgTemplate.convertAndSendToUser( chatMessage.getRecipientName(), "/queue/PrivateMessage", chatMessage);
        return chatMessage;
    }
}
