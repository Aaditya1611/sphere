package com.chatapp.web.login;

import java.util.Collection;
import java.util.Collections;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.chatapp.web.signup.UserInfo;

public class UserDetailsImplementation implements UserDetails {

	//private User user;
	private UserInfo userInfo;

	public UserDetailsImplementation(UserInfo userInfo) {
		super();
		this.userInfo = userInfo;
	}

	public UserInfo getUser() {
		return this.userInfo;
	}

	public Long getId() {
		return this.userInfo.getId();
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {

		return Collections.singleton(new SimpleGrantedAuthority("USER"));
	}

	@Override
	public String getPassword() {

		return userInfo.getPassword();
	}

	@Override
	public String getUsername() {

		return userInfo.getUsername();
	}
}
