package com.chatapp.web.friends;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chatapp.web.login.User;

@Service
public class FriendService {

    @Autowired
    private FriendsRepository friendsRepository;

    public Friends AddFriend(Friends friends) {

        return friendsRepository.save(friends);
    }

    public Friends BlockUser(Friends blockedUser) {

        return friendsRepository.save(blockedUser);
    }

    public List<Friends> GetAllFriends(User user) {

        return friendsRepository.findByUserId(user);

    }

    public List<Friends> GetAllBlockedUsers(User blockedUser) {

        return friendsRepository.findByBlockedUser(blockedUser);
    }
}
