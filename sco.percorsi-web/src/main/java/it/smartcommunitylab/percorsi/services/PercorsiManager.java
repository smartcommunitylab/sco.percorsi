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
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

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

	@Autowired
	private ModerationManager moderationManager;
	
	@PostConstruct
	private void init() throws DataException {
		for (ProviderSettings ps : providerSetup.getProviders()) {
			if (ps.getCategories() != null) {
				ps.getCategories().setLocalId("1");
				Categories categories = repository.getObjectById("1",Categories.class,ps.getId());
				if (categories == null || categories.getLastChange() < ps.getCategories().getLastChange()) {
					repository.storeDraftObject(ps.getCategories(), ps.getId());
				}
			}
		}
	}

	public void storeDraftPaths(String appId, List<Path> list) throws DataException {
		logger.info("Storing paths for app {}", appId);
		Map<String, Path> oldIds = new HashMap<String, Path>();
		List<Path> oldPaths = getDraftPaths(appId);
		if (oldPaths != null) for (Path p : oldPaths) oldIds.put(p.getLocalId(), p);
		
		for (Path p : list) {
			p.setAppId(appId);
			Path old = oldIds.get(p.getLocalId());
			if (old != null) {
				oldIds.remove(old.getLocalId());
			}
			if (old != null) {
				p.setId(old.getId());
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
			repository.storeDraftObject(p, appId);
		}
		for (String oldId : oldIds.keySet()) {
			repository.deleteDraftObject(oldIds.get(oldId), appId);
		}
	}

	public void storeDraftCategories(String appId, Categories data) throws DataException {
		if (data.getCategories() != null) {
			data.setLocalId("1");
			data.setAppId(appId);
			repository.storeDraftObject(data, appId);
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
		moderationManager.addModObjects(appId, pathId, Path.class.getName(), url, contributor);
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
					moderationManager.addModObjects(appId, pathId, Path.class.getName(), url, contributor);
					return getPath(appId, pathId);
				}
			}
		}
		throw new NotFoundException("POI "+ poiId +" of path"+ pathId +" of app "+appId+" not found.");

	}

	public List<Rating> getRatings(String appId, String pathId, Integer start, Integer count) {
		Sort sort = new Sort(Sort.Direction.DESC, "timestamp");
		if (count != null && count > 0) {
			int pageIdx = start != null && start > 0 ? (start / count) : 0;
			int size = count != null && count > 0 ? count : 100;
			PageRequest pr = new PageRequest(pageIdx, size, sort);
			Page<Rating> page = ratingRepository.findByAppIdAndLocalId(appId, pathId, pr);
			return page.getContent();
		} else {
			return ratingRepository.findByAppIdAndLocalId(appId, pathId, sort);
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
		rating.setTimestamp(System.currentTimeMillis());
		ratingRepository.save(rating);

		if (StringUtils.hasText(comment)) {
			moderationManager.addModObjects(appId, pathId, Rating.class.getName(), comment, contributor);
		}
		
		List<Rating> list = ratingRepository.findByAppIdAndLocalId(appId, pathId);

		double avg = 0;
		int count = 0;
		for (Rating r : list) {
			if (r.getVote() != null && r.getVote() > 0) {
				avg += r.getVote();
				count++;
			}
		}
		avg = count > 0 ? avg / count : 0;
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

	/**
	 * @param appId
	 */
	public Long publish(String appId) throws DataException{
		return repository.publish(appId);
	}

	/**
	 * @param appId
	 * @return
	 */
	public Long getDraftVersion(String appId) throws DataException{
		return repository.getDraftVersion(appId);
	}

	public Categories getDraftCategories(String appId) throws DataException{
		Categories draft = repository.getDraftCategories(appId);
		if (draft == null) draft = getCategories(appId);
		return draft;
	}
	public List<Path> getDraftPaths(String appId) throws DataException{
		List<Path> paths = repository.getDraftPaths(appId);
		if (paths == null || paths.isEmpty()) paths = getPaths(appId, null);
		return paths;
	}

}
