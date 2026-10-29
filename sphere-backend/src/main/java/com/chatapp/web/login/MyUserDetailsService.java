package com.chatapp.web.login;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.chatapp.web.signup.UserInfo;
import com.chatapp.web.signup.UserInfoRepo;

@Service
public class MyUserDetailsService implements UserDetailsService {

	private final UserInfoRepo userInfoRepo;

	MyUserDetailsService(UserInfoRepo userInfoRepo) {
		this.userInfoRepo = userInfoRepo;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		UserInfo userInfo = userInfoRepo.findByUsername(username);
		if (userInfo == null) {
			throw new UsernameNotFoundException("User 404");
		}

		return new UserDetailsImplementation(userInfo);
	}

}
