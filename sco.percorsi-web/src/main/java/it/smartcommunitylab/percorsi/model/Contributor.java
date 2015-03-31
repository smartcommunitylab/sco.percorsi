package it.smartcommunitylab.percorsi.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import eu.trentorise.smartcampus.profileservice.model.BasicProfile;

@Document
public class Contributor {

	@Id
	private String userId;
	private String name;
	/**
	 * @return the userId
	 */
	public String getUserId() {
		return userId;
	}
	/**
	 * @param userId the userId to set
	 */
	public void setUserId(String userId) {
		this.userId = userId;
	}
	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	public static Contributor fromUserProfile(BasicProfile basicProfile) {
		Contributor c = new Contributor();
		c.setUserId(basicProfile.getUserId());
		// TODO
		return c;
	}
}
