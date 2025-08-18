package com.chatapp.web.signup;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SendUserData {

	@Autowired
	private UserInfoRepo userInfoRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public void saveUserInfo(UserInfo user) {

		String encodedPassword = passwordEncoder.encode(user.getPassword());
		user.setPassword(encodedPassword);
		userInfoRepo.save(user);
	}

}
