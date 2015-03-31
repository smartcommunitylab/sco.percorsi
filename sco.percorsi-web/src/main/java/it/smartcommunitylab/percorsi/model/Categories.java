package it.smartcommunitylab.percorsi.model;

import java.util.List;

public class Categories extends PercorsiObject {
	private static final long serialVersionUID = 6511796975080369284L;

	private List<Category> categories;
	private Long lastChange;
	
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
}
 