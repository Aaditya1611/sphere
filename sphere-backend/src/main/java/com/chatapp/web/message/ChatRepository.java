package com.chatapp.web.message;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

@Repository
public interface ChatRepository extends JpaRepository<ChatInfo, Long> {

    @Query("SELECT c FROM ChatInfo c WHERE " +
            "((c.senderId = :senderId AND c.recipientId = :recipientId) OR " +
            "(c.senderId = :recipientId AND c.recipientId = :senderId)) " +
            "ORDER BY c.timestamp ASC")
    List<ChatInfo> findConversationBetween(@Param("senderId") Long senderId, @Param("recipientId") Long recipientId);

    List<ChatInfo> findBySenderIdOrRecipientIdOrderByTimestamp(Long senderId, Long recipientId);

    @Transactional
    @Modifying
    @Query("DELETE FROM ChatInfo c WHERE " +
            "(c.senderId = :senderId AND c.recipientId = :recipientId) OR " +
            "(c.senderId = :recipientId AND c.recipientId = :senderId)")
    void deleteChatsBothSides(
            @Param("senderId") Long senderId,
            @Param("recipientId") Long recipientId);
}