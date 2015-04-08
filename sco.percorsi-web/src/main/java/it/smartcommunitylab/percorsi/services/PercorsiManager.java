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

package it.smartcommunitylab.percorsi.services;

import it.smartcommunitylab.percorsi.data.PercorsiSyncStorage;
import it.smartcommunitylab.percorsi.data.RatingRepository;
import it.smartcommunitylab.percorsi.model.Categories;
import it.smartcommunitylab.percorsi.model.Contributor;
import it.smartcommunitylab.percorsi.model.Multimedia;
import it.smartcommunitylab.percorsi.model.POI;
import it.smartcommunitylab.percorsi.model.Path;
import it.smartcommunitylab.percorsi.model.ProviderSettings;
import it.smartcommunitylab.percorsi.model.Rating;
import it.smartcommunitylab.percorsi.security.ProviderSetup;
import it.smartcommunitylab.percorsi.utils.MultimediaUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.common.exception.NotFoundException;
import eu.trentorise.smartcampus.presentation.data.SyncData;

/**
 * @author raman
 *
 */
@Component
public class PercorsiManager {

	private final static Logger logger = LoggerFactory.getLogger(PercorsiManager.class);

	@Autowired
	private PercorsiSyncStorage repository;
	@Autowired
	private RatingRepository ratingRepository;

	@Autowired
	private ProviderSetup providerSetup;

	@PostConstruct
	private void init() throws DataException {
		for (ProviderSettings ps : providerSetup.getProviders()) {
			if (ps.getCategories() != null) {
				ps.getCategories().setLocalId("1");
				Categories categories = repository.getObjectById("1",Categories.class,ps.getId());
				if (categories == null || !categories.getLastChange().equals(ps.getCategories().getLastChange())) {
					repository.storeObject(ps.getCategories(), ps.getId());
				}
			}
		}
	}

	public void storePaths(String appId, List<Path> list) throws DataException {
		logger.info("Storing paths for app {}", appId);
		for (Path p : list) {
			p.setAppId(appId);
			Path old = repository.getObjectById(p.getLocalId(), Path.class, appId);
			if (old == null || !old.coreDataEquals(p)) {
				if (old != null) {
					p.setVote(old.getVote());
					p.setVoteCount(old.getVoteCount());
					p.setImages(MultimediaUtils.mergeProviderMultimedia(p.getImages(), old.getImages()));
					p.setVideos(MultimediaUtils.mergeProviderMultimedia(p.getVideos(), old.getVideos()));
				}
				if (p.getPois() != null) {
					Map<String, POI> oldPois = new HashMap<String, POI>();
					if (old != null && old.getPois() != null) {
						for (POI oldPoi : old.getPois()) {
							oldPois.put(oldPoi.getLocalId(), oldPoi);
						}
					}

					for (POI poi : p.getPois()) {
						if (poi.getLocalId() == null) throw new DataException("POI local ID is missing");
						POI oldPoi = oldPois.get(poi.getLocalId());
						if (oldPoi != null) {
							poi.setImages(MultimediaUtils.mergeProviderMultimedia(poi.getImages(), oldPoi.getImages()));
							poi.setVideos(MultimediaUtils.mergeProviderMultimedia(poi.getVideos(), oldPoi.getVideos()));
						}
					}
				}
				repository.storeObject(p);
			}
		}
	}

	public Categories getCategories(String appId) throws DataException {
		Categories categories = repository.getObjectById("1",Categories.class, appId);
		return categories;
	}

	public List<Path> getPaths(String appId, String category) throws DataException {
		Map<String, Object> criteria = category != null ? Collections.<String,Object>singletonMap("categories", category) : Collections.<String,Object>emptyMap();
		List<Path> list = repository.searchObjects(appId, Path.class, null, null, null, criteria, null, -1, -1);
		return list;
	}
	public Path getPath(String appId, String pathId) throws DataException {
		return repository.getObjectById(pathId, Path.class, appId);
	}
	public POI getPOI(String appId, String pathId, String poiId) throws DataException {
		Path path = getPath(appId, pathId);
		if (path != null && path.getPois() != null) {
			for (POI poi : path.getPois()) {
				if (poi.getLocalId().equals(poiId)) return poi;
			}
		}
		return null;
	}
	public Path addImageToPath(String appId, String pathId, String url, Contributor contributor) throws DataException, NotFoundException {
		logger.info("Contributor {} is adding image to path {}@{}: {}", contributor.getUserId(), pathId, appId, url);
		Path path = getPath(appId, pathId);
		if (path == null) {
			throw new NotFoundException("Path "+ pathId +" of app "+appId+" not found.");
		}
		if (path.getImages() == null) path.setImages(new ArrayList<Multimedia>());
		path.getImages().add(new Multimedia(url, true, contributor.getUserId()));
		repository.storeObject(path);
		return getPath(appId, pathId);
	}
	public Path addImageToPOI(String appId, String pathId, String poiId, String url, Contributor contributor) throws DataException, NotFoundException {
		logger.info("Contributor {} is adding image to poi {}@{}@{}: {}", contributor.getUserId(), poiId, pathId, appId, url);
		Path path = getPath(appId, pathId);
		if (path == null) {
			throw new NotFoundException("Path "+ pathId +" of app "+appId+" not found.");
		}
		if (path != null && path.getPois() != null) {
			for (POI poi : path.getPois()) {
				if (poi.getLocalId().equals(poiId)) {
					if (poi.getImages() == null) poi.setImages(new ArrayList<Multimedia>());
					poi.getImages().add(new Multimedia(url, true, contributor.getUserId()));
					repository.storeObject(path);
					return getPath(appId, pathId);
				}
			}
		}
		throw new NotFoundException("POI "+ poiId +" of path"+ pathId +" of app "+appId+" not found.");

	}

	public List<Rating> getRatings(String appId, String pathId, Integer start, Integer count) {
		if (count != null && count > 0) {
			int pageIdx = start != null && start > 0 ? (start / count) : 0;
			int size = count != null && count > 0 ? count : 100;
			PageRequest pr = new PageRequest(pageIdx, size);
			Page<Rating> page = ratingRepository.findByAppIdAndLocalId(appId, pathId, pr);
			return page.getContent();
		} else {
			return ratingRepository.findByAppIdAndLocalId(appId, pathId);
		}
	}

	public Path rate(String appId, String pathId, Contributor contributor, Integer vote, String comment) throws DataException, NotFoundException {
		logger.info("Adding rating to path {}@{}: {}", pathId, appId, vote);
		Path path = getPath(appId, pathId);
		if (path == null) {
			throw new NotFoundException("Path "+ pathId +" of app "+appId+" not found.");
		}
		Rating rating = ratingRepository.findByAppIdAndLocalIdAndUserId(appId, pathId, contributor.getUserId());
		if (rating == null) {
			rating = new Rating();
			rating.setAppId(appId);
			rating.setLocalId(pathId);
			rating.setContributor(contributor);
		}
		rating.setComment(comment);
		rating.setVote(vote);
		ratingRepository.save(rating);

		List<Rating> list = ratingRepository.findByAppIdAndLocalId(appId, pathId);
		int count = list.size();

		double avg = 0;
		for (Rating r : list) {
			avg += r.getVote();
		}
		avg = avg / count;
		path.setVoteCount(count);
		path.setVote(avg);

		repository.storeObject(path);
		return getPath(appId, pathId);
	}

	public SyncData getSyncAppData(long since, String appId, Map<String, Object> include, Map<String, Object> exclude) throws DataException {
		return repository.getSyncAppData(since, appId, include, exclude);
	}

	public Rating getUserRating(String appId, String pathId, Contributor contributor) throws NotFoundException, DataException {
		Path path = getPath(appId, pathId);
		if (path == null) {
			throw new NotFoundException("Path "+ pathId +" of app "+appId+" not found.");
		}
		Rating rating = ratingRepository.findByAppIdAndLocalIdAndUserId(appId, pathId, contributor.getUserId());
		return rating;
	}
}
