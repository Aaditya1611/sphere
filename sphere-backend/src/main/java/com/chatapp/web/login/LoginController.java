package com.chatapp.web.login;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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
import com.chatapp.web.friends.Friends;
import com.chatapp.web.friends.FriendsRepository;
import com.chatapp.web.message.ChatRepository;
import com.chatapp.web.message.ChatInfo;
import com.chatapp.web.signup.UserInfo;
import com.chatapp.web.signup.UserInfoRepo;

@RestController
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
    public ResponseEntity<LoggedinUserDetails> getLoggedInUserData(@PathVariable Long id) {

        UserInfo userInfo = userInfoRepo.findById(id).orElseThrow(() -> new RuntimeException("user not found"));
        LoggedinUserDetails response = new LoggedinUserDetails(
                // userInfo.getId(),
                userInfo.getUsername(),
                userInfo.getFirstname(),
                userInfo.getLastname(),
                userInfo.getEmail(),
                userInfo.getBio());
        return ResponseEntity.ok(response);
    }

    @GetMapping("userFriends/{id}")
    public ResponseEntity<?> getLoggedInUserFriends(@PathVariable Long id) {

        List<Friends> friends = friendsRepository.findByUserId(id);
        List<Long> friendIds = friends.stream()
                .map(Friends::getFriend)
                .filter(Objects::nonNull)
                .map(Long::valueOf)
                .collect(Collectors.toList());

        List<UserInfo> friendDetails = userInfoRepo.findAllById(friendIds);
        List<FriendDTO> response = friendDetails.stream().map(
                (user -> new FriendDTO(
                        user.getId(),
                        user.getFirstname(),
                        user.getLastname(),
                        user.getBio(),
                        user.getEmail())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("userBlockedFriends/{id}")
    public ResponseEntity<?> getLoggedInUserBlockedFriends(@PathVariable Long id) {

        // Logic is valid, but consider creating a specific repository method
        // like findByUserIdAndBlockedUserNotNull(id) for better performance later.
        // also put safe checks for condition when there's no user in the block list for better performance later.
        List<Friends> blockedFriends = friendsRepository.findByUserId(id);
        List<Long> blockedFriendsId = blockedFriends.stream()
                .map(Friends::getBlockedUser)
                .filter(Objects::nonNull)
                .map(Long::valueOf)
                .collect(Collectors.toList());

        List<UserInfo> blockedFriendDetails = userInfoRepo.findAllById(blockedFriendsId);
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

        List<ChatInfo> chats = chatRepository.findConversationBetween(userId, friendId);
        return ResponseEntity.ok(chats);
    }

}