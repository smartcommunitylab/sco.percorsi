package it.smartcommunitylab.percorsi.data;

import it.smartcommunitylab.percorsi.model.ModObj;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface ModeratorRepository extends MongoRepository<ModObj, String>{

	@Query("{'appId':?0,'type':?1,'status':?2}")
	public List<ModObj> findByFields(String appId, String type, int status);
	@Query("{'appId':?0,'localId':?1,'contributor.userId':?3, 'type':?2, 'value':?4}")
	public ModObj findByContributor(String appId, String localId, String type, String contributor, String value);
}
