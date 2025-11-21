package com.chatapp.web.login;

import java.util.List;

import com.chatapp.web.friends.Friends;
import com.chatapp.web.message.ChatInfo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FriendWithChats {
    
    private Friends friendInfo;
    private List<ChatInfo> chats;
}
