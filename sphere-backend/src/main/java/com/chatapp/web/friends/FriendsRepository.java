package com.chatapp.web.friends;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chatapp.web.login.User;
import java.util.List;


@Repository
public interface FriendsRepository extends JpaRepository<Friends, Long> {

    List<Friends> findByFriend(User friend);
    List<Friends> findByUserId(User userId);
    List<Friends> findByBlockedUser(User blockedUser);
    Optional<Friends> findByFriendOrBlockedUser(User friend, User blockedUser);
    Optional<Friends> findByUserIdAndFriend(User userId, User friend);
    Optional<Friends> findByUserIdAndBlockedUser(User userId, User blockedUser);
    void deleteByUserIdAndBlockedUser(User userId, User blockedUser);
    boolean existsByUserIdAndFriend(User userId, User friend);
    boolean existsByUserIdAndBlockedUser(User userId, User blockedUser);
} 
