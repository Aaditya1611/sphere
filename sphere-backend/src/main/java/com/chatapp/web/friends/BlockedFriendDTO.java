package com.chatapp.web.friends;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BlockedFriendDTO {

    private Long id;
    private String firstname;
    private String lastname;
    private String email;

    public BlockedFriendDTO(Long id, String firstname, String lastname, String email) {
    }
}
