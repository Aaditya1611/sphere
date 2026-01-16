package com.chatapp.web.friends;

import java.util.Optional;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.chatapp.web.message.ChatInfo;

import java.util.List;

@Repository
public interface FriendsRepository extends JpaRepository<Friends, Long> {

    List<Friends> findByFriend(Long friend);

    List<Friends> findByUserId(Long userId);

    List<Friends> findByBlockedUser(Long blockedUser);

    Optional<Friends> findByFriendOrBlockedUser(Long friend, Long blockedUser);

    Optional<Friends> findByUserIdAndFriend(Long userId, Long friend);

    List<Friends> findByUserIdAndBlockedUserNotNull(Long userId);

    void deleteByUserIdAndBlockedUser(Long userId, Long blockedUser);

    boolean existsByUserIdAndFriend(Long userId, Long friend);

    boolean existsByUserIdAndBlockedUser(Long userId, Long blockedUser);
}
