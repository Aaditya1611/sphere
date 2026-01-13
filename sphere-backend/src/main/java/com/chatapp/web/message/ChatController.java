package com.chatapp.web.message;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private SimpMessageSendingOperations msgTemplate;
    private ChatService chatService;

    public ChatController(SimpMessageSendingOperations msgTemplate, ChatService chatService) {
        this.msgTemplate = msgTemplate;
        this.chatService = chatService;
    }

    // @MessageMapping("/Message") // public message endpoint // dont need this right now
    // public ChatInfo sendMessage(ChatInfo chatMessage) {

    //     chatService.saveChats(chatMessage);
    //     msgTemplate.convertAndSend("/topic/Message", chatMessage);
    //     return chatMessage;
    // }

    @MessageMapping("/PrivateMessage")
    public ChatInfo sendPrivateMessage(ChatInfo chatMessage) {

        chatService.saveChats(chatMessage); // this is Async method, saving messages to database can happen later on, 
        msgTemplate.convertAndSendToUser(String.valueOf(chatMessage.getRecipientId()), "/queue/PrivateMessage", chatMessage);
        return chatMessage;
    }

    @MessageMapping("/MessageStatus")
    public void markMessagesAsRead(@Payload ReadReceiptRequestDTO request) {

        chatService.markMessagesAsRead(request.getSenderId(), request.getRecipientId());
        msgTemplate.convertAndSendToUser(String.valueOf(request.getSenderId()), "/queue/MessageStatus", request);
    }
}