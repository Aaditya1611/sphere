package com.chatapp.web.signup;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.chatapp.web.login.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class UserInfoService {

    private final UserRepository userRepository;
    
    @Autowired
    private UserInfoRepo userInfoRepo;

    UserInfoService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserInfo searchFriend(String email) {

        return userInfoRepo.findByEmail(email);
    }

    public void addBio(UserInfo user) {

        userInfoRepo.save(user);
    }

     @Transactional
    public void updateBio(UserInfo user) {

        userInfoRepo.updateBio(user.getId(), user.getBio());
    }

    public void addName(UserInfo user) {

        userInfoRepo.save(user);
    }

    @Transactional
    public void updateName(UserInfo user) {

        userInfoRepo.updateName(user.getId(), user.getFirstname(), user.getLastname());
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
