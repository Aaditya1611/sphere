package com.chatapp.web.message;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.chatapp.web.login.User;
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
        return chatService.saveChats(chatInfo); // clean separation
    }

    @GetMapping("/fetch/{senderId}/{recieverId}")
    public List<ChatInfo> getChatInfo(@PathVariable Long senderId, @PathVariable Long recieverId) {

        User sender = new User();
        sender.setId(senderId);

        User reciever = new User();
        reciever.setId(recieverId);

        return chatService.getUserChats(sender, reciever);  // delegate to service
    }
}

