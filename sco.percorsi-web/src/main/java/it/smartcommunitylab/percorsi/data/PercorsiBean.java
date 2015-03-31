package it.smartcommunitylab.percorsi.data;

import eu.trentorise.smartcampus.presentation.storage.sync.mongo.SyncObjectBean;

public class PercorsiBean extends SyncObjectBean {
	private String localId;
	private String appId;
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
}
