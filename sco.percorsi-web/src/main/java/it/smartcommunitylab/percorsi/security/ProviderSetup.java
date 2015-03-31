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

package it.smartcommunitylab.percorsi.security;

import it.smartcommunitylab.percorsi.model.ProviderSettings;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

@Component
public class ProviderSetup {

	@Value("classpath:/providers-access.yml")
	private Resource resource;

	@PostConstruct
	public void init() throws IOException {
		Yaml yaml = new Yaml(new Constructor(ProviderSetup.class));
		ProviderSetup data = (ProviderSetup) yaml.load(resource.getInputStream());
		this.providers = data.providers;
	}


	private List<ProviderSettings> providers;
	private Map<String,ProviderSettings> providersMap;


	/**
	 * @return the providers
	 */
	public List<ProviderSettings> getProviders() {
		return providers;
	}

	/**
	 * @param providers the providers to set
	 */
	public void setProviders(List<ProviderSettings> providers) {
		this.providers = providers;
	}

	@Override
	public String toString() {
		return "ProviderSetup [providers=" + providers + "]";
	}

	public ProviderSettings findProviderById(String username) {
		if (providersMap == null) {
			providersMap = new HashMap<String, ProviderSettings>();
			for (ProviderSettings provider : providers) {
				providersMap.put(provider.getId(), provider);
			}
		}
		return providersMap.get(username);
	}
}
