/*******************************************************************************
 * Copyright 2015 Smart Community Lab
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/

package it.smartcommunitylab.percorsi.model;

import java.io.Serializable;

/**
 * @author raman
 *
 */
public class ProviderSettings implements Serializable {
	private static final long serialVersionUID = -7078032185171275572L;

	private String id;
    private String password;
    private boolean moderation;
    private String moderator;

    private Categories categories;

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
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}
	/**
	 * @param password the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
	}
	/**
	 * @return the categories
	 */
	public Categories getCategories() {
		return categories;
	}
	/**
	 * @param categories the categories to set
	 */
	public void setCategories(Categories categories) {
		this.categories = categories;
	}
	/**
	 * @return the moderation
	 */
	public boolean isModeration() {
		return moderation;
	}
	/**
	 * @param moderation the moderation to set
	 */
	public void setModeration(boolean moderation) {
		this.moderation = moderation;
	}
	/**
	 * @return the moderator
	 */
	public String getModerator() {
		return moderator;
	}
	/**
	 * @param moderator the moderator to set
	 */
	public void setModerator(String moderator) {
		this.moderator = moderator;
	}

}
