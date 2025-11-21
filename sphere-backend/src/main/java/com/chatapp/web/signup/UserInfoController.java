package com.chatapp.web.signup;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserInfoController {

    @Autowired
    private SendUserData sendUserData;
    @Autowired
    private UserInfoService userInfoService;

    @Autowired
    private UserInfoRepo userInfoRepo;

    @PostMapping("/signup")
    public String registerUser(@RequestBody UserInfo userInfo) {

        sendUserData.saveUserInfo(userInfo);
        return "Signup Successful";
    }

    @GetMapping("/searchFriend/{email}")
    public ResponseEntity<?> searchFriendsWithEmailId(@PathVariable String email) {

        UserInfo user = userInfoService.searchFriend(email);

        if (user == null) {
            return ResponseEntity.status(404).body("User does not exit");
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/savebio")
    public ResponseEntity<?> saveBio(@RequestBody UserInfoDTO userInfoDTO) {

        UserInfo user = userInfoRepo.findById(userInfoDTO.getUserId()).orElseThrow();

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

        UserInfo user = userInfoRepo.findById(userInfoDTO.getUserId()).orElseThrow();

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

}
