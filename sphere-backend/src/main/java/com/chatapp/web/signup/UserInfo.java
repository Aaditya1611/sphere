package com.chatapp.web.signup;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_list")
public class UserInfo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String email;
	private String username;
	private String password;
	private String bio;
	private String firstname;
	private String lastname;

	@Column(name = "profile_pic_url")
	private String profilepicUrl;

	@Column(name = "deleted_at")
	private LocalDateTime deletedAt;

	@Column(columnDefinition = "TEXT")
	private String pubicKey;

	@Column(columnDefinition = "TEXT")
	private String privateKey;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUsername() {
		return username;
	}

	public String getPassword() {
		return password;
	}

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public LocalDateTime getDeletedAt() {
		return deletedAt;
	}

	public void setDeletedAt(LocalDateTime deletedAt) {
		this.deletedAt = deletedAt;
	}

	public String getProfilepicUrl() {
		return profilepicUrl;
	}

	public void setProfilepicUrl(String profilepicUrl) {
		this.profilepicUrl = profilepicUrl;
	}

	public String getPubicKey() {
		return pubicKey;
	}

	public void setPubicKey(String pubicKey) {
		this.pubicKey = pubicKey;
	}

	public String getPrivateKey() {
		return privateKey;
	}

	public void setPrivateKey(String privateKey) {
		this.privateKey = privateKey;
	}

}
