package it.smartcommunitylab.percorsi.model;

import java.io.Serializable;
import java.util.Map;

public class Category implements Serializable {
	private static final long serialVersionUID = 4177441048635009765L;

	private String id;
	private Map<String,String> name;
	private Map<String,String> description;
	private String image;

	
	public Category() {
		super();
	}
	public Category(Map<String, String> name, Map<String, String> description, String image, String id) {
		super();
		this.name = name;
		this.description = description;
		this.image = image;
		this.id = id;
	}
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
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((description == null) ? 0 : description.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((image == null) ? 0 : image.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Category other = (Category) obj;
		if (description == null || description.isEmpty()) {
			if (other.description != null && !other.description.isEmpty())
				return false;
		} else if (!description.equals(other.description))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (image == null) {
			if (other.image != null)
				return false;
		} else if (!image.equals(other.image))
			return false;
		if (name == null || name.isEmpty()) {
			if (other.name != null && !name.isEmpty())
				return false;
		} else if (!name.equals(other.name))
			return false;
		return true;
	}
	
	
}
