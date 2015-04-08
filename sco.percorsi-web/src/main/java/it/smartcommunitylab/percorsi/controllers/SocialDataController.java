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

import it.smartcommunitylab.percorsi.model.Contributor;
import it.smartcommunitylab.percorsi.model.Path;
import it.smartcommunitylab.percorsi.model.Rating;
import it.smartcommunitylab.percorsi.model.Response;
import it.smartcommunitylab.percorsi.services.ContributorManager;
import it.smartcommunitylab.percorsi.services.PercorsiManager;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.common.exception.NotFoundException;

/**
 * @author raman
 *
 */
@Controller
public class SocialDataController {

	@Autowired
	private PercorsiManager manager;
	@Autowired
	private ContributorManager contributorManager;

	@RequestMapping(method=RequestMethod.POST, value = "/userdata/paths/{providerId}/{pathId}/images/url")
	public @ResponseBody Response<Path> addImageToPath(
			@PathVariable String providerId,
			@PathVariable String pathId,
			@RequestParam String url) throws DataException
	{
		Contributor contributor = contributorManager.getContributor(getUserId());
		try {
			Path path = manager.addImageToPath(providerId, pathId, url, contributor);
			return new Response<Path>(path);
		} catch (NotFoundException e) {
			e.printStackTrace();
			return new Response<Path>(HttpStatus.NOT_FOUND.value(), e.getMessage());
		}
	}

	@RequestMapping(method=RequestMethod.POST, value = "/userdata/paths/{providerId}/{pathId}/{poiId}/images/url")
	public @ResponseBody Response<Path> addImageToPOI(
			@PathVariable String providerId,
			@PathVariable String pathId,
			@PathVariable String poiId,
			@RequestParam String url) throws DataException
	{
		Contributor contributor = contributorManager.getContributor(getUserId());
		try {
			Path path = manager.addImageToPOI(providerId, pathId, poiId, url, contributor);
			return new Response<Path>(path);
		} catch (NotFoundException e) {
			e.printStackTrace();
			return new Response<Path>(HttpStatus.NOT_FOUND.value(), e.getMessage());
		}
	}

	@RequestMapping(method=RequestMethod.POST, value = "/userdata/paths/{providerId}/{pathId}/rate")
	public @ResponseBody Response<Path> rate(
			@PathVariable String providerId,
			@PathVariable String pathId,
			@RequestBody Rating rating) throws DataException
	{
		Contributor contributor = contributorManager.getContributor(getUserId());
		try {
			Path path = manager.rate(providerId, pathId, contributor, rating.getVote(), rating.getComment());
			return new Response<Path>(path);
		} catch (NotFoundException e) {
			e.printStackTrace();
			return new Response<Path>(HttpStatus.NOT_FOUND.value(), e.getMessage());
		}
	}


	@RequestMapping(value = "/userdata/paths/{providerId}/{pathId}/rate")
	public @ResponseBody Response<Rating> getMyRate(
			@PathVariable String providerId,
			@PathVariable String pathId) throws DataException
	{
		Contributor contributor = contributorManager.getContributor(getUserId());
		try {
			Rating rating = manager.getUserRating(providerId, pathId, contributor);
			return new Response<Rating>(rating);
		} catch (NotFoundException e) {
			e.printStackTrace();
			return new Response<Rating>(HttpStatus.NOT_FOUND.value(), e.getMessage());
		}
	}

	@ExceptionHandler(Exception.class)
	public @ResponseBody Response<Void> handleExceptions(Exception exception, HttpServletResponse res) {
		exception.printStackTrace();
		if (exception instanceof SecurityException) {
			res.setStatus(HttpStatus.FORBIDDEN.value());
			return new Response<Void>(HttpStatus.FORBIDDEN.value(), exception.getMessage());
		}

		res.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
		return new Response<Void>(HttpStatus.INTERNAL_SERVER_ERROR.value(), exception.getMessage());
	}

	private String getUserId() {
		return ((UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
	}
}
