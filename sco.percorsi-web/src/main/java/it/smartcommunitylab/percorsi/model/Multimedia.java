package it.smartcommunitylab.percorsi.model;

import java.util.Map;

public class Multimedia {

	private Map<String,String> title;
	private String url;
	private boolean userDefined = false;
	private String userId;

	public Multimedia() {
		super();
	}

	public Multimedia(String url, boolean userDefined, String userId) {
		super();
		this.url = url;
		this.userDefined = userDefined;
	}

	public Multimedia(Map<String, String> title, String url,
			boolean userDefined, String userId) {
		super();
		this.title = title;
		this.url = url;
		this.userDefined = userDefined;
		this.userId = userId;
	}

	public Map<String, String> getTitle() {
		return title;
	}
	public void setTitle(Map<String, String> title) {
		this.title = title;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}

	/**
	 * @return the userDefined
	 */
	public boolean isUserDefined() {
		return userDefined;
	}

	/**
	 * @param userDefined the userDefined to set
	 */
	public void setUserDefined(boolean userDefined) {
		this.userDefined = userDefined;
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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((title == null) ? 0 : title.hashCode());
		result = prime * result + ((url == null) ? 0 : url.hashCode());
		result = prime * result + (userDefined ? 1231 : 1237);
		return result;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Multimedia other = (Multimedia) obj;
		if (title == null || title.isEmpty()) {
			if (other.title != null && !other.title.isEmpty())
				return false;
		} else if (!title.equals(other.title))
			return false;
		if (url == null) {
			if (other.url != null)
				return false;
		} else if (!url.equals(other.url))
			return false;
		if (userDefined != other.userDefined)
			return false;
		return true;
	}
}
