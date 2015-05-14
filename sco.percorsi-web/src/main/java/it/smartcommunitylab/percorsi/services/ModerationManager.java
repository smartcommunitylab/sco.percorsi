package it.smartcommunitylab.percorsi.services;

import it.smartcommunitylab.percorsi.data.ModeratorRepository;
import it.smartcommunitylab.percorsi.data.PercorsiSyncStorage;
import it.smartcommunitylab.percorsi.data.RatingRepository;
import it.smartcommunitylab.percorsi.model.Contributor;
import it.smartcommunitylab.percorsi.model.ModObj;
import it.smartcommunitylab.percorsi.model.Multimedia;
import it.smartcommunitylab.percorsi.model.POI;
import it.smartcommunitylab.percorsi.model.Path;
import it.smartcommunitylab.percorsi.model.ProviderSettings;
import it.smartcommunitylab.percorsi.model.Rating;
import it.smartcommunitylab.percorsi.security.ProviderSetup;

import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import eu.trentorise.smartcampus.presentation.common.exception.DataException;

@Component
public class ModerationManager {

	@Autowired
	private ModeratorRepository repository;
	@Autowired
	private PercorsiSyncStorage storage;
	@Autowired
	private RatingRepository ratingRepository;
	@Autowired
	private ProviderSetup setup;
	
	public List<ModObj> getModObjects(String appId, String type) {
		return repository.findByFields(appId, type, 0);
	}
	
	public void addModObjects(String appId, String localId, String type, String value, Contributor contributor) {
		if (!moderated(appId)) return;
		
		ModObj obj = new ModObj();
		obj.setAppId(appId);
		obj.setLocalId(localId);
		obj.setType(type);
		obj.setStatus(0);
		obj.setValue(value);
		obj.setContributor(contributor);
		repository.save(obj);
		
		notifyModerator(appId, localId, type, value, contributor);
	}

	public void acceptModObject(String appId, String localId, String type, String contributorId, String value) {
		if (!moderated(appId)) return;

		List<ModObj> objs = repository.findByContributor(appId, localId, type, contributorId, value);
		if (objs != null && ! objs.isEmpty()) {
			for (ModObj obj : objs) {
				obj.setStatus(1);
				repository.save(obj);
			}
		}
	}
	
	public void rejectComment(String appId, String localId, String contributorId, String value) throws DataException {
		if (!moderated(appId)) return;

		List<ModObj> objs = repository.findByContributor(appId, localId, Rating.class.getName(), contributorId, value);
		if (objs != null && ! objs.isEmpty()) {
			for (ModObj obj : objs) {
				obj.setStatus(-1);
				Rating rating = ratingRepository.findByAppIdAndLocalIdAndUserId(appId, localId, contributorId);
				if (value != null && value.equals(rating.getComment())) {
					rating.setComment(null);
					ratingRepository.save(rating);
				}
				repository.save(obj);
			}
		}
	}	
	
	public void rejectUserImage(String appId, String localId, String contributorId, String value) throws DataException {
		if (!moderated(appId)) return;

		List<ModObj> objs = repository.findByContributor(appId, localId, Path.class.getName(), contributorId, value);
		if (objs != null && ! objs.isEmpty()) {
			for (ModObj obj : objs) {
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
	
	private boolean moderated(String appId) {
		ProviderSettings providerSettings = setup.findProviderById(appId);
		return providerSettings != null && providerSettings.isModeration();
	}

	private void notifyModerator(String appId, String localId, String type, String value, Contributor contributor) {
		ProviderSettings providerSettings = setup.findProviderById(appId);
		if (providerSettings != null && StringUtils.hasText(providerSettings.getModerator())) {
			// TODO
		}
	}


}
