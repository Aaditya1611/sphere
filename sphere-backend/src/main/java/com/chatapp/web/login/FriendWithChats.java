package com.chatapp.web.login;

import java.util.List;

import com.chatapp.web.friends.FriendDTO;
import com.chatapp.web.message.ChatInfo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FriendWithChats {
    
    private FriendDTO friendInfo;
    private List<ChatInfo> chats;
}
