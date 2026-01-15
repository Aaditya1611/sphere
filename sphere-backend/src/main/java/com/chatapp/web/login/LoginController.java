package com.chatapp.web.login;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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

            UserInfo user = userInfoService.getUserDetailsByUsername(userInfo.getUsername());

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
            UserInfo userid = userInfoService.getUserDetailsByUsername(userDetails.getUsername());
            return ResponseEntity.ok(userid.getId());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<LoggedinUserDetails> getLoggedInUserData(@PathVariable Long id) {

        UserInfo userInfo = userInfoService.getUserDetailsById(id)
                .orElseThrow(() -> new RuntimeException("user not found"));
        ;
        LoggedinUserDetails response = new LoggedinUserDetails(
                userInfo.getId(),
                userInfo.getUsername(),
                userInfo.getFirstname(),
                userInfo.getLastname(),
                userInfo.getEmail(),
                userInfo.getBio());
        return ResponseEntity.ok(response);
    }

    @GetMapping("userFriends/{id}")
    public ResponseEntity<?> getLoggedInUserFriends(@PathVariable Long id) {

        // 1. Get List of Friends
        List<Friends> friends = friendService.getAllFriendsByUserId(id);

        // 2. Extract IDs
        List<Long> friendIds = friends.stream()
                .map(Friends::getFriend)
                .filter(Objects::nonNull)
                .map(Long::valueOf)
                .collect(Collectors.toList());

        // 3. Get Details
        List<UserInfo> friendDetails = userInfoService.getAllUserDetailsByIds(friendIds);

        // 4. Map to FriendDTO with Last Message
        List<FriendDTO> response = friendDetails.stream().map(user -> {

            // A. Query the database for the LAST message (Limit 1)
            // We use PageRequest.of(0, 1) to replicate "LIMIT 1" in SQL
            List<ChatInfo> lastChatList = chatService.findConversationHistory(
                    id, // My ID
                    user.getId() // Friend's ID
            );

            // B. Set default values (in case there is NO chat history)
            String lastMsgContent = null;
            LocalDateTime lastMsgTime = null;
            Long lastMsgSenderId = null;

            // C. If a message exists, extract the data
            if (!lastChatList.isEmpty()) {
                ChatInfo lastChat = lastChatList.get(0);

                // Optional: Handle Media Types so it doesn't show a URL
                if ("IMAGE".equals(String.valueOf(lastChat.getType()))) {
                    lastMsgContent = "📷 Photo";
                } else if ("VIDEO".equals(String.valueOf(lastChat.getType()))) {
                    lastMsgContent = "🎥 Video";
                } else {
                    lastMsgContent = lastChat.getContent();
                }

                lastMsgTime = lastChat.getTimestamp();
                lastMsgSenderId = lastChat.getSenderId();
            }

            // D. Return the DTO (Must match Constructor Order)
            return new FriendDTO(
                    user.getId(),
                    user.getFirstname(),
                    user.getLastname(),
                    user.getBio(),
                    user.getEmail(),
                    lastMsgContent, // ✅ New Field
                    lastMsgTime, // ✅ New Field
                    lastMsgSenderId // ✅ New Field
            );

        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("userBlockedFriends/{id}")
    public ResponseEntity<?> getLoggedInUserBlockedFriends(@PathVariable Long id) {

        // Logic is valid, but consider creating a specific repository method
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