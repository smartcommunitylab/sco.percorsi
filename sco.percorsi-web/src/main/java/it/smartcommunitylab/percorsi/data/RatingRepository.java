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

package it.smartcommunitylab.percorsi.data;

import it.smartcommunitylab.percorsi.model.Rating;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

/**
 * @author raman
 *
 */
public interface RatingRepository extends MongoRepository<Rating, String>{
	@Query("{'appId': ?0, 'localId': ?1, 'contributor.userId':?2}")
	Rating findByAppIdAndLocalIdAndUserId(String appId, String localId, String userId);

	Page<Rating> findByAppIdAndLocalId(String appId, String localId, Pageable pageable);
	List<Rating> findByAppIdAndLocalId(String appId, String localId, Sort sort);
	List<Rating> findByAppIdAndLocalId(String appId, String localId);

}
