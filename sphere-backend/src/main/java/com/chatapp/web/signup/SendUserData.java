package com.chatapp.web.signup;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SendUserData {

	private final UserInfoRepo userInfoRepo;

	private final PasswordEncoder passwordEncoder;

	SendUserData(UserInfoRepo userInfoRepo, PasswordEncoder passwordEncoder) {
		this.userInfoRepo = userInfoRepo;
		this.passwordEncoder = passwordEncoder;
	}

	public void saveUserInfo(UserInfo user) {

		String encodedPassword = passwordEncoder.encode(user.getPassword());
		user.setPassword(encodedPassword);
		userInfoRepo.save(user);
	}

}
