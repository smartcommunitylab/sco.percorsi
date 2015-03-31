package it.smartcommunitylab.percorsi.model;

import eu.trentorise.smartcampus.presentation.data.BasicObject;

public class PercorsiObject extends BasicObject {
	private static final long serialVersionUID = 7925286586633431644L;

	private String appId;
	private String localId;
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


}
