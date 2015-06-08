package it.smartcommunitylab.percorsi.model;

import java.util.List;

public class Categories extends PercorsiObject {
	private static final long serialVersionUID = 6511796975080369284L;

	private List<Category> categories;
	private Long lastChange;

	public Categories(List<Category> categories, Long lastChange) {
		super();
		this.categories = categories;
		this.lastChange = lastChange;
	}

	public Categories() {
		super();
	}

	public List<Category> getCategories() {
		return categories;
	}
	public void setCategories(List<Category> categories) {
		this.categories = categories;
	}
	/**
	 * @return the lastChange
	 */
	public Long getLastChange() {
		return lastChange;
	}
	/**
	 * @param lastChange the lastChange to set
	 */
	public void setLastChange(Long lastChange) {
		this.lastChange = lastChange;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((categories == null) ? 0 : categories.hashCode());
		result = prime * result
				+ ((lastChange == null) ? 0 : lastChange.hashCode());
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
		Categories other = (Categories) obj;
		if (categories == null) {
			if (other.categories != null)
				return false;
		} else if (!categories.equals(other.categories))
			return false;
		if (lastChange == null) {
			if (other.lastChange != null)
				return false;
		} else if (!lastChange.equals(other.lastChange))
			return false;
		return true;
	}
	
	
}
