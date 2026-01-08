package com.chatapp.web.friends;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chatapp.web.login.User;
import com.chatapp.web.signup.UserInfo;
import com.chatapp.web.signup.UserInfoRepo;

@Service
public class FriendService {

    @Autowired
    private FriendsRepository friendsRepository;
    @Autowired
    private UserInfoRepo userInfoRepo;

    // public List<Friends> GetAllFriends(Long user) {
    // return friendsRepository.findByUserId(user).stream()
    // .filter(f -> f.getFriend() != null)
    // .collect(Collectors.toList());
    // }

    public List<BlockedFriendDTO> getAllBlockedUsers(Long userId) {

        List<Friends> blockedRows = friendsRepository.findByUserIdAndBlockedUserNotNull(userId);

        List<Long> blockedIds = blockedRows.stream()
                .map(f -> Long.valueOf(f.getBlockedUser())) // Assuming blockedUser is a String/Long
                .collect(Collectors.toList());

        List<UserInfo> users = userInfoRepo.findAllById(blockedIds);

        return users.stream()
                .map(
                        u -> new BlockedFriendDTO(
                                u.getId(),
                                u.getFirstname(),
                                u.getLastname(),
                                u.getEmail()))
                .collect(Collectors.toList());
    }

    public boolean addFriend(Long userId, Long friend) {
        boolean exists = friendsRepository.existsByUserIdAndFriend(
                userId,
                friend);
        if (exists) {
            return false;
        }
        boolean isBlocked = friendsRepository.existsByUserIdAndBlockedUser(
                userId,
                friend);
        if (isBlocked) {
            return false;
        }
        Friends newFriend = new Friends();
        newFriend.setUserId(userId);
        newFriend.setFriend(friend);
        friendsRepository.save(newFriend);
        return true;
    }

    public boolean blockUser(Long userId, Long blockedUser) {

        boolean alreadyBlocked = friendsRepository.existsByUserIdAndBlockedUser(
                userId,
                blockedUser);
        if (alreadyBlocked) {
            return false;
        }
        Optional<Friends> existingFriendship = friendsRepository.findByUserIdAndFriend(
                userId,
                blockedUser);
        if (existingFriendship.isPresent()) {
            Friends record = existingFriendship.get();
            record.setFriend(null);
            record.setBlockedUser(blockedUser);
            friendsRepository.saveAndFlush(record);
            return true;
        }
        Friends newBlock = new Friends();
        newBlock.setUserId(userId);
        newBlock.setBlockedUser(blockedUser);
        friendsRepository.save(newBlock);
        return true;
    }

    @Transactional
    public void unBlockUser(Long userId, Long blockedUser) {

        friendsRepository.deleteByUserIdAndBlockedUser(
                userId,
                blockedUser);
    }
}