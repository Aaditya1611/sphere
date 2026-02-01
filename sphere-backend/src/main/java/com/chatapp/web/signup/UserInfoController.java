package com.chatapp.web.signup;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chatapp.web.login.JWTService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserInfoController {

    @Autowired
    private SendUserData sendUserData;
    @Autowired
    private UserInfoService userInfoService;
    @Autowired
    private JWTService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserInfo userInfo) {

        sendUserData.saveUserInfo(userInfo);
        UserInfo user = userInfoService.getUserDetailsByUsername(userInfo.getUsername());
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("firstname", user.getFirstname());
        response.put("lastname", user.getLastname());
        response.put("email", user.getEmail());
        response.put("bio", user.getBio());
        response.put("profilepicUrl", user.getProfilepicUrl());
        response.put("token", jwtService.generateToken(user.getUsername()));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/searchFriend/{email}")
    public ResponseEntity<?> searchFriendsWithEmail(@PathVariable String email) {

        SearchFriendDTO user = userInfoService.searchFriend(email);
        if (user == null) {
            return ResponseEntity.status(404).body("User does not exit");
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/savebio")
    public ResponseEntity<?> saveBio(@RequestBody UserInfoDTO userInfoDTO) {

        UserInfo user = userInfoService.getUserDetailsById(userInfoDTO.getUserId()).orElseThrow();

        boolean isNew = (user.getBio() == null);
        user.setBio(userInfoDTO.getBio());
        if (isNew) {
            userInfoService.addBio(user);
            return ResponseEntity.ok("bio added");
        } else {
            userInfoService.updateBio(user);
            return ResponseEntity.ok("bio updated");
        }
    }

    @PostMapping("/savename")
    public ResponseEntity<?> saveName(@RequestBody UserInfoDTO userInfoDTO) {

        UserInfo user = userInfoService.getUserDetailsById(userInfoDTO.getUserId()).orElseThrow();

        user.setFirstname(userInfoDTO.getFirstname());
        user.setLastname(userInfoDTO.getLastname());
        userInfoService.updateName(user);
        return ResponseEntity.ok("Name saved successfully");
    }

    @DeleteMapping("/deleteaccount/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {

        userInfoService.markRelationsForDelete(id);
        userInfoService.markChatsForDelete(id);
        userInfoService.markUserForDelete(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PostMapping("/updateProfilePicUrl")
    public ResponseEntity<?> updateProfilePic(@RequestParam Long id, @RequestParam String url) {

       userInfoService.updateProfilePic(id, url);
       return ResponseEntity.status(200).body("Profile pic url updated successfully");
    }
    

}