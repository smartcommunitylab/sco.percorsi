package it.smartcommunitylab.percorsi.model;

import org.springframework.data.annotation.Id;

public class ModObj {

	@Id
	private String _id;
	
	private String localId;
	private String appId;
	private String type;
	private String value;
	private Contributor contributor;
	
	private long timestamp;
	
	private int status;
	
	public String getLocalId() {
		return localId;
	}
	public void setLocalId(String localId) {
		this.localId = localId;
	}
	public String getAppId() {
		return appId;
	}
	public void setAppId(String appId) {
		this.appId = appId;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public Contributor getContributor() {
		return contributor;
	}
	public void setContributor(Contributor contributor) {
		this.contributor = contributor;
	}
	public long getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}
}
