package com.chatapp.web.message;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

@Repository
public interface ChatRepository extends JpaRepository<ChatInfo, Long> {

        // List<ChatInfo> findBySenderIdOrRecipientIdOrderByTimestamp(Long senderId, Long recipientId);

        // long countBySenderIdAndRecipientIdAndStatus(Long senderId, Long recipientId, MessageStatus status);

        // @Query("SELECT c FROM ChatInfo c WHERE " +
        //                 "((c.senderId = :senderId AND c.recipientId = :recipientId) OR " +
        //                 "(c.senderId = :recipientId AND c.recipientId = :senderId)) " +
        //                 "ORDER BY c.timestamp ASC")
        // List<ChatInfo> findConversationBetween(
        //                 @Param("senderId") Long senderId,
        //                 @Param("recipientId") Long recipientId,
        //                 Pageable pageable);

        @Transactional
        @Modifying
        @Query("DELETE FROM ChatInfo c WHERE " +
                        "(c.senderId = :senderId AND c.recipientId = :recipientId) OR " +
                        "(c.senderId = :recipientId AND c.recipientId = :senderId)")
        void deleteChatsBothSides(
                        @Param("senderId") Long senderId,
                        @Param("recipientId") Long recipientId);

        @Transactional
        @Modifying
        @Query("UPDATE ChatInfo c SET c.status = 'READ' WHERE c.senderId = :senderId AND c.recipientId = :recipientId")
        void updateMessageStatusToRead(
                        @Param("senderId") Long senderId,
                        @Param("recipientId") Long recipientId);

        @Query("SELECT c FROM ChatInfo c WHERE " +
                        "(c.senderId = :user1 AND c.recipientId = :user2) OR " +
                        "(c.senderId = :user2 AND c.recipientId = :user1) ")
        List<ChatInfo> findConversationHistory(
                        @Param("user1") Long user1,
                        @Param("user2") Long user2,
                        Pageable pageable);

}