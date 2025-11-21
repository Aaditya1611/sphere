package com.chatapp.web.message;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    public ChatInfo saveChats(ChatInfo chatInfo) {

        if (chatInfo.getTimestamp() == null) {
            chatInfo.setTimestamp(LocalDateTime.now());
        }
        return chatRepository.save(chatInfo);
    }

    public List<ChatInfo> getUserChats(Long senderId, Long recieverId) {

        return chatRepository.findConversationBetween(senderId, recieverId);
    }

    @Transactional
    public void deleteUserChats(Long senderId, Long recipientId) {
        chatRepository.deleteChatsBothSides(senderId, recipientId);
    }

}
