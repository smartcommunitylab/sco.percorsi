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

import it.smartcommunitylab.percorsi.model.Categories;
import it.smartcommunitylab.percorsi.model.Importer;
import it.smartcommunitylab.percorsi.model.ModObj;
import it.smartcommunitylab.percorsi.model.Path;
import it.smartcommunitylab.percorsi.model.PathData;
import it.smartcommunitylab.percorsi.model.ProviderSettings;
import it.smartcommunitylab.percorsi.model.Rating;
import it.smartcommunitylab.percorsi.model.Response;
import it.smartcommunitylab.percorsi.security.CustomAuthenticationProvider.AppDetails;
import it.smartcommunitylab.percorsi.security.ProviderSetup;
import it.smartcommunitylab.percorsi.services.ModerationManager;
import it.smartcommunitylab.percorsi.services.PercorsiManager;
import it.smartcommunitylab.percorsi.utils.XMLUtils;

import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.JAXB;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import eu.trentorise.smartcampus.presentation.common.exception.DataException;

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
	@Autowired
	private ModerationManager moderationManager;
	
	@RequestMapping("/")
	public String home() {
		return "index";
	}

	@RequestMapping("/login")
	public String login() {
		return "login";
	}

	@RequestMapping(value = "/console/provider")
	public @ResponseBody ProviderSettings provider() throws DataException {
		return getProvider(getAppId());
	}
	@RequestMapping(value = "/console/categories")
	public @ResponseBody Categories categories() throws DataException {
		return manager.getDraftCategories(getAppId());
	}
	@RequestMapping(value = "/console/categories", method = RequestMethod.POST)
	public @ResponseBody ProviderSettings saveCategories(@RequestBody Categories categories) throws DataException {
		manager.storeDraftCategories(getAppId(), categories);
		return getProvider(getAppId());
	}
	@RequestMapping(value = "/console/paths")
	public @ResponseBody List<Path> paths() throws DataException {
		return manager.getDraftPaths(getAppId());
	}
	@RequestMapping(value = "/console/paths", method = RequestMethod.POST)
	public @ResponseBody ProviderSettings savePaths(@RequestBody List<Path> paths) throws DataException {
		manager.storeDraftPaths(getAppId(), paths);
		return getProvider(getAppId());
	}

	@RequestMapping(value = "/console/publish", method = RequestMethod.POST)
	public @ResponseBody ProviderSettings publish(MultipartHttpServletRequest req) throws Exception {
		String appId = getAppId();
		manager.publish(appId);
		return getProvider(appId);
	}

	@RequestMapping(value = "/console/upload", method = RequestMethod.POST)
	public @ResponseBody ProviderSettings upload(MultipartHttpServletRequest req) throws Exception {
		MultiValueMap<String, MultipartFile> multiFileMap = req.getMultiFileMap();
		MultipartFile file = multiFileMap.getFirst("paths");
		if (file == null) throw new IllegalArgumentException("File not found");
		PathData list = new ObjectMapper().readValue(file.getInputStream(), PathData.class);

		String appId = getAppId();
		manager.storeDraftPaths(appId, list.getData());
		return getProvider(appId);
	}
        
	@RequestMapping(value = "/console/uploadxml", method = RequestMethod.POST)
	public @ResponseBody ProviderSettings uploadXML(MultipartHttpServletRequest req) throws Exception {
		MultiValueMap<String, MultipartFile> multiFileMap = req.getMultiFileMap();
		MultipartFile file = multiFileMap.getFirst("paths");
		MultipartFile catFile = multiFileMap.getFirst("categories");
		if (file == null && catFile == null) throw new IllegalArgumentException("File not found");
		String appId = getAppId();
		if (file != null && !file.isEmpty()) {
			it.smartcommunitylab.percorsi.xml.PathData xmlData = JAXB.unmarshal(file.getInputStream(), it.smartcommunitylab.percorsi.xml.PathData.class);
			PathData data = XMLUtils.toDomain(xmlData);
			manager.storeDraftPaths(appId, data.getData());
		}
		if (catFile != null && !catFile.isEmpty()) {
			it.smartcommunitylab.percorsi.xml.Categories xmlData = JAXB.unmarshal(catFile.getInputStream(), it.smartcommunitylab.percorsi.xml.Categories.class);
			Categories data = XMLUtils.toDomain(xmlData);
			manager.storeDraftCategories(appId, data);
		}
		return getProvider(appId);
	}
	
	@RequestMapping(value = "/console/uploadexcel", method = RequestMethod.POST)
	public @ResponseBody ProviderSettings uploadExcel(MultipartHttpServletRequest req) throws Exception {
		Importer importa = new Importer();
		MultiValueMap<String, MultipartFile> multiFileMap = req.getMultiFileMap();
		MultipartFile file = multiFileMap.getFirst("data");
		if (file == null) {
			throw new IllegalArgumentException("File not found");
		}
		String appId = getAppId();
		importa.importData(file.getInputStream());
		manager.storeDraftPaths(appId, importa.getPaths().getData());
		manager.storeDraftCategories(appId, importa.getCategories());
		return getProvider(appId);
	}	

	@RequestMapping(value = "/console/export", method = RequestMethod.GET) 
	@ResponseBody 
	it.smartcommunitylab.percorsi.xml.PathData exportPaths() throws DataException {
		return XMLUtils.toXML(new PathData(manager.getPaths(getAppId(), null)));
	}
	
	@RequestMapping(value = "/console/moderated/{type:.*}")
	public @ResponseBody List<ModObj> getModerated(@PathVariable String type, @RequestParam Integer start, @RequestParam Integer count) {
		return moderationManager.getModObjects(getAppId(), type, start != null ? start : 0, count != null ? count : 100);
	}

	@RequestMapping(value = "/console/moderated/{type}/{localId}/{contributorId}/accept", method=RequestMethod.POST)
	public @ResponseBody void accept(@PathVariable String type, @PathVariable String localId, @PathVariable String contributorId, @RequestParam String value) {
		moderationManager.acceptModObject(getAppId(), localId, type, contributorId, value);
	}

	@RequestMapping(value = "/console/moderated/{type}/{localId}/{contributorId}", method=RequestMethod.DELETE)
	public @ResponseBody void remove(@PathVariable String type, @PathVariable String localId, @PathVariable String contributorId, @RequestParam String value) {
		moderationManager.removeModObject(getAppId(), localId, type, contributorId, value);
	}
	@RequestMapping(value = "/console/moderated/{type}/{localId}/{contributorId}/reject", method=RequestMethod.POST)
	public @ResponseBody void reject(@PathVariable String type, @PathVariable String localId, @PathVariable String contributorId, @RequestParam String value) throws DataException {
		if (Rating.class.getName().equals(type))
			moderationManager.rejectComment(getAppId(), localId, contributorId, value);
		else 
			moderationManager.rejectUserImage(getAppId(), localId, contributorId, value);
	}
	
	private ProviderSettings getProvider(String appId) throws DataException {
		ProviderSettings ps = setup.findProviderById(appId);
		ps.setNewVersion(manager.getDraftVersion(appId));
		return ps;
	}

	private String getAppId() {
		AppDetails details = (AppDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String app = details.getUsername();
		return app;
	}

	@ExceptionHandler(Exception.class)
	public @ResponseBody Response<Void> handleExceptions(Exception exception, HttpServletResponse res) {
		res.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
		return new Response<Void>(HttpStatus.INTERNAL_SERVER_ERROR.value(), exception.getMessage());
	}
}
