package com.chatapp.web.message;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chatapp.web.login.User;

@Service
public class ChatService {
    
    @Autowired
    private ChatRepository chatRepository;

    public ChatInfo saveChats(ChatInfo chatInfo) {

        return chatRepository.save(chatInfo);
    }

    public List<ChatInfo> getUserChats(User sender, User reciever) {

        return chatRepository.findBySenderOrRecipientOrderByTimestamp(sender, reciever);
    }
}
