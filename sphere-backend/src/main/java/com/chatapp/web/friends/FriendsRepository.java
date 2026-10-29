package com.chatapp.web.friends;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

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
