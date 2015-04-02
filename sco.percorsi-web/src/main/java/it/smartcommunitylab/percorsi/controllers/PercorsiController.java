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

package it.smartcommunitylab.percorsi.controllers;

import it.smartcommunitylab.percorsi.model.Categories;
import it.smartcommunitylab.percorsi.model.Path;
import it.smartcommunitylab.percorsi.model.Response;
import it.smartcommunitylab.percorsi.services.PercorsiManager;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.common.util.Util;
import eu.trentorise.smartcampus.presentation.data.SyncData;
import eu.trentorise.smartcampus.presentation.data.SyncDataRequest;

/**
 * @author raman
 *
 */
@Controller
public class PercorsiController {

	@Autowired
	private PercorsiManager manager;

	@RequestMapping(method=RequestMethod.GET, value="/categories/{providerId}")
	public @ResponseBody Response<Categories> getCategories(@PathVariable String providerId) throws DataException {
		return new Response<Categories>(manager.getCategories(providerId));
	}

	@RequestMapping(method=RequestMethod.GET, value="/paths/{providerId}")
	public @ResponseBody Response<List<Path>> getPercorsi(@PathVariable String providerId, @RequestParam(required=false) String category) throws DataException {
		return new Response<List<Path>>(manager.getPaths(providerId, category));
	}

	@RequestMapping(method=RequestMethod.GET, value="/paths/{providerId}/{pathId}")
	public @ResponseBody Response<Path> getPercorso(@PathVariable String providerId, @PathVariable String pathId) throws DataException {
		return new Response<Path>(manager.getPath(providerId, pathId));
	}

	@RequestMapping(method = RequestMethod.POST, value = "/sync/{providerId}")
	public ResponseEntity<SyncData> synchronize(@PathVariable String providerId, HttpServletRequest request, @RequestParam long since, @RequestBody Map<String,Object> obj) throws Exception{
		try {

			SyncDataRequest syncReq = Util.convertRequest(obj, since);
			SyncData result = manager.getSyncAppData(syncReq.getSince(), providerId, syncReq.getSyncData().getInclude(), syncReq.getSyncData().getExclude());
			return new ResponseEntity<SyncData>(result,HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}

	@ExceptionHandler(Exception.class)
	public @ResponseBody Response<Void> handleExceptions(Exception exception, HttpServletResponse res) {
		res.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
		return new Response<Void>(HttpStatus.INTERNAL_SERVER_ERROR.value(), exception.getMessage());
	}

}
