package com.chatapp.web.friends;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping("/add")
    public Friends AddNewFriend(@RequestBody Friends friends) {
            
        return friendService.AddFriend(friends);
    }

    @PostMapping("/block")
    public Friends BlockUsers(@RequestBody Friends blockedUser) {
        
        return friendService.BlockUser(blockedUser);
    }
    
    @GetMapping("/get/{userId}")
    public List<Friends> GetAllFriends(@PathVariable User userId) {

        return friendService.GetAllFriends(userId);
    }

    @GetMapping("/getBlockedUsers/{userId}")
    public List<Friends> getMethodName(@PathVariable Long userId) {

        User user = new User();
        user.setId(userId);
        return friendService.GetAllBlockedUsers(user);
    }

}
