/*******************************************************************************
 * Copyright 2015 Fondazione Bruno Kessler
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

package it.smartcommunitylab.percorsi.controllers;

import it.smartcommunitylab.percorsi.model.PathData;
import it.smartcommunitylab.percorsi.model.ProviderSettings;
import it.smartcommunitylab.percorsi.model.Response;
import it.smartcommunitylab.percorsi.security.CustomAuthenticationProvider.AppDetails;
import it.smartcommunitylab.percorsi.security.ProviderSetup;
import it.smartcommunitylab.percorsi.services.PercorsiManager;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

/**
 * @author raman
 *
 */
@Controller
public class ConsoleController {

	@Autowired
	private PercorsiManager manager;
	@Autowired
	private ProviderSetup setup;
	
	@RequestMapping("/")
	public String home() {
		return "index";
	}

	@RequestMapping("/login")
	public String login() {
		return "login";
	}

	@RequestMapping(value = "/console/data")
	public @ResponseBody ProviderSettings data() {
		return setup.findProviderById(getAppId());
	}		

	@RequestMapping(value = "/upload", method = RequestMethod.POST)
	public @ResponseBody ProviderSettings upload(MultipartHttpServletRequest req) throws Exception {
		MultiValueMap<String, MultipartFile> multiFileMap = req.getMultiFileMap();
		MultipartFile file = multiFileMap.getFirst("paths");
		if (file == null) throw new IllegalArgumentException("File not found");
		PathData list = new ObjectMapper().readValue(file.getInputStream(), PathData.class);

		String appId = getAppId();
		manager.storePaths(appId, list.getData());
		return setup.findProviderById(appId);
	}

	private String getAppId() {
		AppDetails details = (AppDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String app = details.getUsername();
		return app;
	}	

	@ExceptionHandler(Exception.class)
	public @ResponseBody Response<Void> handleExceptions(Exception exception) {
		return new Response<Void>(500, exception.getMessage());
	}
}
