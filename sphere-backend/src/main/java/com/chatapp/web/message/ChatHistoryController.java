package com.chatapp.web.message;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/user/chats")
public class ChatHistoryController {

    private final ChatService chatService;

    public ChatHistoryController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/save")
    public ChatInfo saveChatInfo(@RequestBody ChatInfo chatInfo) {
        return chatService.saveChats(chatInfo);
    }

    @GetMapping("/fetch/{senderId}/{recipientId}")
    public List<ChatInfo> getChatInfo(@PathVariable Long senderId, @PathVariable Long recipientId) {
        return chatService.getUserChats(senderId, recipientId);
    }
}

