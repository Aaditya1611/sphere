package com.chatapp.web.stomp;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private SimpMessageSendingOperations msgTemplate;

    public ChatController(SimpMessageSendingOperations  msgTemplate) {

        this.msgTemplate = msgTemplate;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {

        return chatMessage;
    }

    @MessageMapping("/chat.sendPrivateMessage")
    public ChatMessage sendPrivateMessage(@Payload ChatMessage chatMessage) {

        msgTemplate.convertAndSendToUser(
                chatMessage.getRecipientName(),
                "/queue/message",
                chatMessage
        );
        return chatMessage;
    }
}
