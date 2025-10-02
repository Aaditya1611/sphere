package com.chatapp.web.message;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chatapp.web.friends.Friends;
import com.chatapp.web.login.User;

@Repository
public interface ChatRepository extends JpaRepository<ChatInfo, Long> {

    List<ChatInfo> findBySenderIdOrRecipientIdOrderByTimestamp(User senderId, User recipientId);
    List<ChatInfo> findByUserId(User userid);
} 
