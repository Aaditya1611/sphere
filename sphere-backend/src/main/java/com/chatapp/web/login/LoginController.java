package com.chatapp.web.login;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.chatapp.web.friends.Friends;
import com.chatapp.web.friends.FriendsRepository;
import com.chatapp.web.signup.UserInfo;
import com.chatapp.web.signup.UserInfoRepo;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final UserInfoRepo userInfoRepo;
    //private final ChatRepository chatRepository;
    private final FriendsRepository friendsRepository;


    public LoginController(AuthenticationManager authenticationManager, UserInfoRepo userInfoRepo, FriendsRepository friendsRepository) {

        this.authenticationManager = authenticationManager;
        this.userInfoRepo = userInfoRepo;
        //this.chatRepository = chatRepository;
        this.friendsRepository = friendsRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserInfo userInfo) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userInfo.getUsername(), userInfo.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            UserInfo userid = userInfoRepo.findByUsername(userDetails.getUsername());
            return ResponseEntity.ok(userid.getId());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Inavlid credentials");
        }
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<LoggedinUserDetails> SendLoggedInUserData(@PathVariable Long id) {

        User userId = new User();
        userId.setId(id);
        UserInfo userInfo = userInfoRepo.findById(id).orElseThrow(() -> new RuntimeException("user not found"));
        // List<ChatInfo> chats = chatRepository.findByUserId(userId);
        List<Friends> friends = friendsRepository.findByUserId(userId);

       LoggedinUserDetails response = new LoggedinUserDetails(
        userInfo.getId(),
        userInfo.getUsername(),
        userInfo.getEmail(),
        userInfo.getBio(),
       // chats,
        friends
        );
        return ResponseEntity.ok(response);
    };

}
