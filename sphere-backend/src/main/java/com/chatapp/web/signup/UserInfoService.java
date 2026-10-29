package com.chatapp.web.signup;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class UserInfoService {

    private final UserInfoRepo userInfoRepo;

    UserInfoService(UserInfoRepo userInfoRepo) {
        this.userInfoRepo = userInfoRepo;
    }

    public Optional<UserInfo> getUserDetailsById(Long id) {

        return userInfoRepo.findById(id);
    }

    public UserInfo getUserDetailsByUsername(String name) {

        return userInfoRepo.findByUsername(name);
    }

    public UserInfo getUserDetailsByEmail(String email) {

        return userInfoRepo.findByEmail(email);
    }

    public List<UserInfo> getAllUserDetailsByIds(List<Long> id) {

        return userInfoRepo.findAllById(id);
    }

    public SearchFriendDTO searchFriend(String email) {

        SearchFriendDTO user = userInfoRepo.findFriendSummaryByEmail(email);
        if (user == null) {
            return null;
        }
        return new SearchFriendDTO(user.getId(), user.getUsername());
    }

    public void addBio(UserInfo user) {

        userInfoRepo.save(user);
    }

    public void addName(UserInfo user) {

        userInfoRepo.save(user);
    }

    @Transactional
    public void updateBio(UserInfo user) {

        userInfoRepo.updateBio(user.getId(), user.getBio());
    }

    @Transactional
    public void updateName(UserInfo user) {

        userInfoRepo.updateName(user.getId(), user.getFirstname(), user.getLastname());
    }

    @Transactional
    public void updateProfilePic(Long id, String url) {
        
        userInfoRepo.updateProfilePicUrl(id, url);
    }

    public void markRelationsForDelete(Long id) {

        userInfoRepo.markRelationsAsDeleted(id);
    }

    public void markUserForDelete(Long id) {

        userInfoRepo.markUserAsDeleted(id);
    }

    public void markChatsForDelete(Long id) {

        userInfoRepo.markChatsAsDeleted(id);
    }

}
