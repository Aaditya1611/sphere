package com.chatapp.web.friends;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chatapp.web.login.User;

@Repository
public interface FriendsRepository extends JpaRepository<Friends, Long> {

    Optional<Friends> findByFriendOrBlockedUser(User friend, User blockedUser);
} 
