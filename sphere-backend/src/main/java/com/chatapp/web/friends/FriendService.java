package com.chatapp.web.friends;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chatapp.web.login.User;

@Service
public class FriendService {

    @Autowired
    private FriendsRepository friendsRepository;

    public List<Friends> GetAllFriends(User user) {
        return friendsRepository.findByUserId(user).stream()
            .filter(f -> f.getFriend() != null)
            .collect(Collectors.toList());
    }

    public List<Friends> GetAllBlockedUsers(User blockedUser) {
        return friendsRepository.findByBlockedUser(blockedUser);
    }

    public boolean addFriend(Friends friends) {
        boolean exists = friendsRepository.existsByUserIdAndFriend(
            friends.getUserId(), 
            friends.getFriend()
        );
        if (exists) {
            return false;
        }
        boolean isBlocked = friendsRepository.existsByUserIdAndBlockedUser(
            friends.getUserId(),
            friends.getFriend()
        );
        if (isBlocked) {
            return false; 
        }
        friendsRepository.save(friends);
        return true;
    }

    public boolean blockUser(Friends friends) {

        boolean alreadyBlocked = friendsRepository.existsByUserIdAndBlockedUser(
            friends.getUserId(),
            friends.getBlockedUser()
        );
        if (alreadyBlocked) {
            return false;
        }
        Optional<Friends> existingFriendship = friendsRepository.findByUserIdAndFriend(
            friends.getUserId(), 
            friends.getBlockedUser()
        );
        if (existingFriendship.isPresent()) {
            Friends record = existingFriendship.get();
            record.setFriend(null);             
            record.setBlockedUser(friends.getBlockedUser());
            friendsRepository.saveAndFlush(record);
            return true;
        }
        Friends newBlock = new Friends();
        newBlock.setUserId(friends.getUserId());
        newBlock.setBlockedUser(friends.getBlockedUser());
        friendsRepository.save(newBlock);
        return true;
    }

    @Transactional
    public void unBlockUser(Friends friends) {

        friendsRepository.deleteByUserIdAndBlockedUser(
            friends.getUserId(), 
            friends.getBlockedUser()
        );
    }
}
