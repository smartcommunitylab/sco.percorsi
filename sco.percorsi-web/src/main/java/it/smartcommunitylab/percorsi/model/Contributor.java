package it.smartcommunitylab.percorsi.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.util.StringUtils;

import eu.trentorise.smartcampus.profileservice.model.BasicProfile;

@Document
public class Contributor {

	@Id
	private String userId;
	private String name;
	public Contributor(String userId, String name) {
		super();
		this.userId = userId;
		this.name = name;
	}
	
	public Contributor() {
		super();
	}

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
		StringBuilder sb = new StringBuilder();
		if (StringUtils.hasText(basicProfile.getName())) sb.append(basicProfile.getName());
		if (StringUtils.hasText(basicProfile.getSurname())) {
			if (sb.length() > 0) sb.append(' ');
			sb.append(basicProfile.getSurname());
		}
		if (sb.length() > 0) c.setName(sb.toString());
		return c;
	}
}
