package com.chatapp.web.friends;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class FriendController {

    @Autowired
    private FriendService friendService;

    // @GetMapping("/getFriends/{userId}")
    // public List<Friends> getAllFriends(@PathVariable Long userId) {

    //     return friendService.GetAllFriends(userId);
    // }

    @GetMapping("/getBlockedUsers/{userId}")
    public ResponseEntity<?> getBlockedUsers(@PathVariable Long userId) {

        List<BlockedFriendDTO> blockedUsers =  friendService.getAllBlockedUsers(userId);
        return ResponseEntity.ok(blockedUsers);
    }

    @PostMapping("/addFriend")
    public ResponseEntity<?> addNewFriend(@RequestBody Friends friends) {

        boolean addedorBlocked = friendService.addFriend(friends.getUserId(), friends.getFriend());

        if (!addedorBlocked) {
            return ResponseEntity.status(409).body("Friend already added or blocked");
        }
        return ResponseEntity.ok().body("Friend added successfully");
    }

    @PostMapping("/blockUser")
    public ResponseEntity<?> blockUsers(@RequestBody Friends blockUser) {

        boolean blocked = friendService.blockUser(blockUser.getUserId(), blockUser.getBlockedUser());

        if (!blocked) {
            return ResponseEntity.status(409).body("Something went wrong");
        }
        return ResponseEntity.ok().body("User Blocked");
    }

    @PostMapping("/unblockUser")
    public ResponseEntity<?> unBlockUser(@RequestBody Friends friends) {

        friendService.unBlockUser(friends.getUserId(), friends.getBlockedUser());
        return ResponseEntity.ok().body("User removed from blocklist");
    }

}