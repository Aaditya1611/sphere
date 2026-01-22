package com.chatapp.web.login;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.chatapp.web.friends.BlockedFriendDTO;
import com.chatapp.web.friends.FriendDTO;
import com.chatapp.web.friends.FriendService;
import com.chatapp.web.friends.Friends;
import com.chatapp.web.message.ChatService;
import com.chatapp.web.message.MessageStatus;
import com.chatapp.web.message.ChatInfo;
import com.chatapp.web.signup.UserInfo;
import com.chatapp.web.signup.UserInfoService;

@RestController
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final ChatService chatService;
    private final UserInfoService userInfoService;
    private final FriendService friendService;

    public LoginController(
            AuthenticationManager authenticationManager, ChatService chatService, UserInfoService userInfoService,
            FriendService friendService) {

        this.authenticationManager = authenticationManager;
        this.chatService = chatService;
        this.userInfoService = userInfoService;
        this.friendService = friendService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserInfo userInfo) {
        try {

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    userInfo.getUsername(), 
                    userInfo.getPassword()
                )
            );
            UserDetailsImplementation userDetails = (UserDetailsImplementation) authentication.getPrincipal();
            UserInfo userEntity = userDetails.getUser();

            if(userEntity.getDeletedAt() != null) {
                return ResponseEntity.status(403).body("Account disabled/deleted");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", userEntity.getId());
            response.put("username", userEntity.getUsername());
            response.put("firstname", userEntity.getFirstname());
            response.put("lastname", userEntity.getLastname());
            response.put("email", userEntity.getEmail());
            response.put("bio", userEntity.getBio());
            response.put("profilepicUrl", userEntity.getProfilepicUrl());

            return ResponseEntity.ok(response);
           
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error");
        }
    }

    // @GetMapping("/profile/{id}")
    // public ResponseEntity<LoggedinUserDetails> getLoggedInUserData(@PathVariable Long id) {

    //     UserInfo userInfo = userInfoService.getUserDetailsById(id)
    //             .orElseThrow(() -> new RuntimeException("user not found"));
    //     ;
    //     LoggedinUserDetails response = new LoggedinUserDetails(
    //             userInfo.getId(),
    //             userInfo.getUsername(),
    //             userInfo.getFirstname(),
    //             userInfo.getLastname(),
    //             userInfo.getEmail(),
    //             userInfo.getBio(),
    //             userInfo.getProfilepicUrl());
    //     return ResponseEntity.ok(response);
    // }

    @GetMapping("userFriends/{id}")
    public ResponseEntity<?> getLoggedInUserFriends(@PathVariable Long id) {

        List<Friends> friends = friendService.getAllFriendsByUserId(id);

        List<Long> friendIds = friends.stream()
                .map(Friends::getFriend)
                .filter(Objects::nonNull)
                .map(Long::valueOf)
                .collect(Collectors.toList());

        List<UserInfo> friendDetails = userInfoService.getAllUserDetailsByIds(friendIds);

        List<FriendDTO> response = friendDetails.stream().map(friend -> {

            List<ChatInfo> lastChatList = chatService.findConversationHistory(
                    id,
                    friend.getId());

            String lastMsgContent = null;
            LocalDateTime lastMsgTime = null;
            Long lastMsgSenderId = null;
            MessageStatus msgStatus = null;

            if (!lastChatList.isEmpty()) {
                ChatInfo lastChat = lastChatList.get(0);

                // Handle Media Types so it doesn't show a URL
                if ("IMAGE".equals(String.valueOf(lastChat.getType()))) {
                    lastMsgContent = "Photo";
                } else if ("VIDEO".equals(String.valueOf(lastChat.getType()))) {
                    lastMsgContent = "Video";
                } else {
                    lastMsgContent = lastChat.getContent();
                }

                lastMsgTime = lastChat.getTimestamp();
                lastMsgSenderId = lastChat.getSenderId();
                msgStatus = lastChat.getStatus();
            }

            return new FriendDTO(
                    friend.getId(),
                    friend.getFirstname(),
                    friend.getLastname(),
                    friend.getBio(),
                    friend.getEmail(),
                    friend.getProfilepicUrl(),
                    lastMsgContent,
                    lastMsgTime,
                    lastMsgSenderId,
                    msgStatus);

        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("userBlockedFriends/{id}")
    public ResponseEntity<?> getLoggedInUserBlockedFriends(@PathVariable Long id) {

        // Logic is valid, but create a specific repository method
        // like findByUserIdAndBlockedUserNotNull(id) for better performance later.
        // also put safe checks for condition when there's no user in the block list for
        // better performance later.
        List<Friends> blockedFriends = friendService.getAllFriendsByUserId(id);
        List<Long> blockedFriendsId = blockedFriends.stream()
                .map(Friends::getBlockedUser)
                .filter(Objects::nonNull)
                .map(Long::valueOf)
                .collect(Collectors.toList());

        List<UserInfo> blockedFriendDetails = userInfoService.getAllUserDetailsByIds(blockedFriendsId);
        List<BlockedFriendDTO> response = blockedFriendDetails.stream().map(
                (user -> new BlockedFriendDTO(
                        user.getId(),
                        user.getFirstname(),
                        user.getLastname(),
                        user.getEmail())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("userChats/{userId}/{friendId}")
    public ResponseEntity<?> getUserChats(@PathVariable Long userId, @PathVariable Long friendId) {

        List<ChatInfo> chats = chatService.getUserChats(userId, friendId);
        return ResponseEntity.ok(chats);
    }

}