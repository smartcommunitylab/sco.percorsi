package it.smartcommunitylab.percorsi.model;

import java.io.Serializable;
import java.util.Map;

public class Category implements Serializable {
	private static final long serialVersionUID = 4177441048635009765L;

	private String id;
	private Map<String,String> name;
	private Map<String,String> description;
	private String image;

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Map<String, String> getName() {
		return name;
	}
	public void setName(Map<String, String> name) {
		this.name = name;
	}
	public Map<String, String> getDescription() {
		return description;
	}
	public void setDescription(Map<String, String> description) {
		this.description = description;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
}
