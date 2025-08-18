package com.chatapp.web.friends;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FriendService {

    @Autowired
    private FriendsRepository friendsRepository;

    public Friends AddFriend(Friends friends) {

        return friendsRepository.save(friends);
    }

    public Optional<Friends> GetFriend(Long friends) {

        return friendsRepository.findById(friends);
    }
}
