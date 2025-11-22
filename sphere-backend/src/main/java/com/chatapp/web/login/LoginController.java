package com.chatapp.web.login;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

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

import com.chatapp.web.friends.FriendDTO;
import com.chatapp.web.friends.Friends;
import com.chatapp.web.friends.FriendsRepository;
import com.chatapp.web.message.ChatRepository;
import com.chatapp.web.message.ChatInfo;
import com.chatapp.web.signup.UserInfo;
import com.chatapp.web.signup.UserInfoRepo;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final UserInfoRepo userInfoRepo;
    private final ChatRepository chatRepository;
    private final FriendsRepository friendsRepository;

    public LoginController(AuthenticationManager authenticationManager, UserInfoRepo userInfoRepo,
            ChatRepository chatRepository, FriendsRepository friendsRepository) {

        this.authenticationManager = authenticationManager;
        this.userInfoRepo = userInfoRepo;
        this.chatRepository = chatRepository;
        this.friendsRepository = friendsRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserInfo userInfo) {
        try {

            UserInfo user = userInfoRepo.findByUsername(userInfo.getUsername());

            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }
            if (user.getDeletedAt() != null) {
                return ResponseEntity.status(403).body("User is marked for deletion");
            }
            Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(userInfo.getUsername(), userInfo.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            UserInfo userid = userInfoRepo.findByUsername(userDetails.getUsername());
            return ResponseEntity.ok(userid.getId());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<LoggedinUserDetails> SendLoggedInUserData(@PathVariable Long id) {

        User userId = new User();
        userId.setId(id);
        UserInfo userInfo = userInfoRepo.findById(id).orElseThrow(() -> new RuntimeException("user not found"));
        List<Friends> friends = friendsRepository.findByUserId(userId);
        // Build list of friends (including blocked entries). Fetch chats only when friend exists.
        List<FriendWithChats> friendsWithChats = friends.stream()
                .map(friend -> {

                    UserInfo friendInfo = null;
                    if(friend.getFriend() != null) {
                        friendInfo = userInfoRepo.findById(friend.getFriend().getId());
                    }

                    UserInfo blockedInfo = null;
                    if(friend.getBlockedUser() != null) {
                        blockedInfo = userInfoRepo.findById(friend.getBlockedUser().getId());
                    }
                    
                    FriendDTO dto = new FriendDTO(
                        friendInfo != null ? friendInfo.getFirstname() : null,
                        friendInfo != null ? friendInfo.getLastname() : null,
                        friendInfo != null ? friendInfo.getBio() : null,
                        friendInfo != null ? friendInfo.getEmail() : null,
                        friend.getFriend() != null ? friend.getFriend().getId() : null,
                        friend.getBlockedUser() != null ? friend.getBlockedUser().getId() : null,
                        blockedInfo != null ? blockedInfo.getEmail() : null
                    );
                    List<ChatInfo> chats = new ArrayList<>();
                    if (friend.getFriend() != null) {
                        chats = chatRepository.findConversationBetween(id, friend.getFriend().getId());
                    }
                    return new FriendWithChats(dto, chats);
                }).collect(Collectors.toList());

        LoggedinUserDetails response = new LoggedinUserDetails(
                userInfo.getId(),
                userInfo.getUsername(),
                userInfo.getFirstname(),
                userInfo.getLastname(),
                userInfo.getEmail(),
                userInfo.getBio(),
                friendsWithChats);
        return ResponseEntity.ok(response);
    }
}