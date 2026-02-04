package com.chatapp.web.message;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Async
    public void saveChats(ChatInfo chatInfo) {
        if (chatInfo.getTimestamp() == null) {
            chatInfo.setTimestamp(LocalDateTime.now());
        }
        chatRepository.save(chatInfo);
    }

    public List<ChatInfo> getUserChats(Long userId, Long friendId, int page) {

        Pageable pageable = PageRequest.of(page, 50, Sort.by("timestamp").descending());
        Page<ChatInfo> resultPage = chatRepository.findConversationHistory(userId, friendId, pageable);
        return resultPage.getContent();
    }

    @Transactional
    public void deleteUserChats(Long senderId, Long recipientId) {
        chatRepository.deleteChatsBothSides(senderId, recipientId);
    }

    public void markMessagesAsRead(Long senderId, Long recipientId) {
        chatRepository.updateMessageStatusToRead(senderId, recipientId);
    }

    public List<ChatInfo> findLastMessageHistory(Long userId, Long friendId) {

        Pageable pageable = PageRequest.of(0, 1, Sort.by("timestamp").descending());
        Page <ChatInfo> page = chatRepository.findConversationHistory(userId, friendId, pageable);
        return page.getContent();
}
}