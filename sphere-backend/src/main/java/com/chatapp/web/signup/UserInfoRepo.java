package com.chatapp.web.signup;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

public interface UserInfoRepo extends JpaRepository<UserInfo, Long> {

    UserInfo findByUsername(String username);

    UserInfo findByEmail(String email);

    UserInfo findById(long id);

    @Transactional
    @Modifying
    @Query("UPDATE UserInfo u SET u.bio = :bio WHERE u.id = :id")
    void updateBio(
            @Param("id") Long id,
            @Param("bio") String bio);

    @Transactional
    @Modifying
    @Query("UPDATE UserInfo u SET u.firstname= :firstname, u.lastname= :lastname WHERE u.id= :id")
    void updateName(@Param("id") Long id,
            @Param("firstname") String firstname,
            @Param("lastname") String lastname);


    // OR friend_id = :id // add these after WHERE user_id = :id
    // OR blocked_id = :id 
    @Transactional
    @Modifying
    @Query(value = """
            UPDATE friendid_blockedid
            SET deleted_at = NOW()
            WHERE user_id = :id
            """, nativeQuery = true)
    void markRelationsAsDeleted(@Param("id") Long id);

    @Transactional
    @Modifying
    @Query(value = """
            DELETE FROM friendid_blockedid
            WHERE deleted_at IS NOT NULL
            AND deleted_at < NOW() - INTERVAL '30 days'
            """, nativeQuery = true)
    void deleteOldRelations();

    @Transactional
    @Modifying
    @Query(value = """
            UPDATE chats
            SET deleted_at = NOW()
            WHERE senderid = :id
            """, nativeQuery = true)
    void markChatsAsDeleted(@Param("id") Long id);

    @Transactional
    @Modifying
    @Query(value = """
            DELETE FROM chats
            WHERE deleted_at IS NOT NULL
            AND deleted_at < NOW() - INTERVAL '31 days'
            """, nativeQuery = true)
    void deleteOldChats();

    @Transactional
    @Modifying
    @Query(value = """
            UPDATE user_list
            SET deleted_at = NOW()
            WHERE id = :id
            """, nativeQuery = true)
    void markUserAsDeleted(@Param("id") Long id);

    @Transactional
    @Modifying
    @Query(value = """
            DELETE FROM user_list
            WHERE deleted_at IS NOT NULL
            AND deleted_at < NOW() - INTERVAL '31 days'
            """, nativeQuery = true)
    void deleteOldUsers();

}
