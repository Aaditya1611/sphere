package com.chatapp.web.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.chatapp.web.signup.UserInfoRepo;

@Component
@EnableScheduling
public class RelationCleanupScheduler {
    
    @Autowired
    private UserInfoRepo userInfoRepo;

    //Runs daily at 3 Am
    @Scheduled(cron = "0 0 3 * * *")
    public void cleanOldRelation() {
        userInfoRepo.deleteOldRelations();
    }

    @Scheduled(cron = "0 30 3 * * *")
    public void cleanUsers() {
        userInfoRepo.deleteOldUsers();
    }
}
