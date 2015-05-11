package it.smartcommunitylab.percorsi.services;

import it.smartcommunitylab.percorsi.data.ModeratorRepository;
import it.smartcommunitylab.percorsi.data.PercorsiSyncStorage;
import it.smartcommunitylab.percorsi.data.RatingRepository;
import it.smartcommunitylab.percorsi.model.Contributor;
import it.smartcommunitylab.percorsi.model.ModObj;
import it.smartcommunitylab.percorsi.model.Multimedia;
import it.smartcommunitylab.percorsi.model.POI;
import it.smartcommunitylab.percorsi.model.Path;
import it.smartcommunitylab.percorsi.model.Rating;

import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.trentorise.smartcampus.presentation.common.exception.DataException;

@Component
public class ModerationManager {

	@Autowired
	private ModeratorRepository repository;
	@Autowired
	private PercorsiSyncStorage storage;
	@Autowired
	private RatingRepository ratingRepository;
	
	public List<ModObj> getModObjects(String appId, String type) {
		return repository.findByFields(appId, type, 0);
	}
	
	public void addModObjects(String appId, String localId, String type, String value, Contributor contributor) {
		ModObj obj = new ModObj();
		obj.setAppId(appId);
		obj.setLocalId(localId);
		obj.setType(type);
		obj.setStatus(0);
		obj.setValue(value);
		obj.setContributor(contributor);
		repository.save(obj);
	}

	public void acceptModObject(String appId, String localId, String type, String contributorId, String value) {
		ModObj obj = repository.findByContributor(appId, localId, type, contributorId, value);
		if (obj != null) {
			obj.setStatus(1);
			repository.save(obj);
		}
	}
	
	public void rejectComment(String appId, String localId, String contributorId, String value) throws DataException {
		ModObj obj = repository.findByContributor(appId, localId, Rating.class.getName(), contributorId, value);
		if (obj != null) {
			obj.setStatus(-1);
			Rating rating = ratingRepository.findByAppIdAndLocalIdAndUserId(appId, localId, contributorId);
			rating.setComment(null);
			ratingRepository.save(rating);
			repository.save(obj);
		}	
	}	
	
	public void rejectUserImage(String appId, String localId, String contributorId, String value) throws DataException {
		ModObj obj = repository.findByContributor(appId, localId, Path.class.getName(), contributorId, value);
		if (obj != null) {
			obj.setStatus(-1);
			Path path = storage.getObjectById(localId, Path.class, appId);
			filter(path.getImages(), obj.getValue());
			filter(path.getVideos(), obj.getValue());
			filter(path.getAudios(), obj.getValue());
			for (POI poi : path.getPois()) {
				filter(poi.getImages(), obj.getValue());
				filter(poi.getVideos(), obj.getValue());
				filter(poi.getAudios(), obj.getValue());
			}
			storage.storeObject(path, appId);	
			repository.save(obj);
		}
	}

	private void filter(List<Multimedia> list, String value) {
		if (list != null)
			for (Iterator<Multimedia> iterator = list.iterator(); iterator.hasNext();) {
				Multimedia mm = iterator.next();
				if (mm.isUserDefined() && mm.getUrl().equals(value)) {
				  iterator.remove();
				}
			}	
	}
}
