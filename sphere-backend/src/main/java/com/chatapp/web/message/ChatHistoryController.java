package com.chatapp.web.message;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/user/chats")
public class ChatHistoryController {

    private final ChatService chatService;

    public ChatHistoryController(ChatService chatService) {

        this.chatService = chatService;
    }

    // @PostMapping("/save")
    // public ChatInfo saveChatInfo(@RequestBody ChatInfo chatInfo) {

    //     return chatService.saveChats(chatInfo);
    // }

    // @GetMapping("/fetch/{senderId}/{recipientId}")
    // public List<ChatInfo> getChatInfo(@PathVariable Long senderId, @PathVariable Long recipientId) {

    //     return chatService.getUserChats(senderId, recipientId);
    // }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteUserChats(@RequestBody ChatInfo chatInfo) {

        chatService.deleteUserChats(chatInfo.getSenderId(), chatInfo.getRecipientId());
        return ResponseEntity.ok("Chats deleted successfully");
    }
}

