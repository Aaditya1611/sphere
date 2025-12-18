package com.chatapp.web.friends;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import com.chatapp.web.login.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/user/friends")
public class FriendController {

    @Autowired
    private FriendService friendService;

    @PostMapping("/addFriend")
    public ResponseEntity<?> AddNewFriend(@RequestBody Friends friends) {
        
        boolean addedorBlocked = friendService.addFriend(friends);

        if(!addedorBlocked) {
            return ResponseEntity.status(409).body("Friend already added or blocked");
        }
        return ResponseEntity.ok().body("Friend added successfully");
    }

    @PostMapping("/blockUser")
    public ResponseEntity<?> BlockUsers(@RequestBody Friends blockedUser) {
        
       boolean blocked = friendService.blockUser(blockedUser);

       if(!blocked) {
            return ResponseEntity.status(409).body("Something went wrong");
       }
       return ResponseEntity.ok().body("User Blocked");
    }
    
    @GetMapping("/getFriends/{userId}")
    public List<Friends> GetAllFriends(@PathVariable User userId) {

        return friendService.GetAllFriends(userId);
    }

    @GetMapping("/getBlockedUsers/{userId}")
    public List<Friends> GetBlockedUsers(@PathVariable Long userId) {

        User user = new User();
        user.setId(userId);
        return friendService.GetAllBlockedUsers(user);
    }

    @PostMapping("/unblockUser")
    public ResponseEntity<?> UnBlockUser(@RequestBody Friends friends) {

        friendService.unBlockUser(friends);
        return ResponseEntity.ok().body("User removed from blocklist");
    }
    
}
