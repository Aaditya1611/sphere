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

    @MessageMapping("/Message")
    public ChatInfo sendMessage(ChatInfo chatMessage) {

        // System.out.println("Recieved message from user: " +
        // chatMessage.getSenderName() + ": " + chatMessage.getContent() );

        chatService.saveChats(chatMessage);
        msgTemplate.convertAndSend("/topic/Message", chatMessage);

        // System.out.println("Sent message to /topic/Message: " +
        // chatMessage.getRecipientName() + ": " + chatMessage.getContent());
        return chatMessage;
    }

    @MessageMapping("/PrivateMessage")
    public ChatInfo sendPrivateMessage(ChatInfo chatMessage) {

        // System.out.println("Recieved message from user: " +
        // chatMessage.getSenderName() + ": " + chatMessage.getContent() );

        chatService.saveChats(chatMessage); // this is Async method, saving messages to database can happen later on, 
        msgTemplate.convertAndSendToUser(String.valueOf(chatMessage.getRecipientId()), "/queue/PrivateMessage", chatMessage);
        
        // System.out.println("Sent message to /queue/PrivateMessage: " +
        // chatMessage.getRecipientName() + ": " + chatMessage.getContent());
        return chatMessage;
    }

    @MessageMapping("/read-messages")
    public void markMessagesAsRead(@Payload ReadReceiptRequestDTO request) {

        System.out.println("========== READ RECEIPT REQUEST ==========");
        System.out.println("📥 Received read receipt request:");
        System.out.println("the person who read the message and send the receipt: " + request.getRecipientId());
        System.out.println("the person who needs to check for this receipt: " + request.getSenderId());

        // recipientId = original message sender (whose messages to mark as READ)
        // senderId = the person reading the messages
        chatService.markMessagesAsRead(request.getSenderId(), request.getRecipientId());
        
        // Send receipt back to the original message sender using their firstname
        msgTemplate.convertAndSendToUser(String.valueOf(request.getSenderId()), "/queue/read-receipt", request);
        System.out.println("✅ Receipt sent successfully to: " + request.getSenderId());
        System.out.println("==========================================");
    }
}