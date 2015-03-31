package it.smartcommunitylab.percorsi.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Rating {

	@Id
	private String id;

	private String appId;
	private String localId;
	private Integer vote;
	private String comment;
	private Contributor contributor;
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}
	/**
	 * @return the appId
	 */
	public String getAppId() {
		return appId;
	}
	/**
	 * @param appId the appId to set
	 */
	public void setAppId(String appId) {
		this.appId = appId;
	}
	/**
	 * @return the localId
	 */
	public String getLocalId() {
		return localId;
	}
	/**
	 * @param localId the localId to set
	 */
	public void setLocalId(String localId) {
		this.localId = localId;
	}
	/**
	 * @return the vote
	 */
	public Integer getVote() {
		return vote;
	}
	/**
	 * @param vote the vote to set
	 */
	public void setVote(Integer vote) {
		this.vote = vote;
	}
	/**
	 * @return the comment
	 */
	public String getComment() {
		return comment;
	}
	/**
	 * @param comment the comment to set
	 */
	public void setComment(String comment) {
		this.comment = comment;
	}
	/**
	 * @return the contributor
	 */
	public Contributor getContributor() {
		return contributor;
	}
	/**
	 * @param contributor the contributor to set
	 */
	public void setContributor(Contributor contributor) {
		this.contributor = contributor;
	}
}
