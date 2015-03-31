/*******************************************************************************
 * Copyright 2012-2013 Trento RISE
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

import it.smartcommunitylab.percorsi.model.PercorsiObject;

import java.util.List;
import java.util.Map;
import java.util.SortedMap;

import org.springframework.data.geo.Circle;

import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.data.SyncData;
import eu.trentorise.smartcampus.presentation.storage.sync.BasicObjectSyncStorage;

public interface PercorsiSyncStorage extends BasicObjectSyncStorage {

	SyncData getSyncAppData(long since, String appId, Map<String,Object> include, Map<String,Object> exclude) throws DataException;

	public <T extends PercorsiObject> List<T> searchObjects(
			String appId,
			Class<T> cls,
			Circle circle,
			String text, String lang,
			Map<String, Object> criteria,
			SortedMap<String,Integer> sort, int limit, int skip) throws DataException;

	public List<PercorsiObject> getAllAppObjects(String appId) throws DataException;
	public <T extends PercorsiObject> List<T> getAppObjectsByType(String appId, Class<T> cls) throws DataException;
	public PercorsiObject getObjectById(String id, String appId) throws DataException;
	public <T extends PercorsiObject> T getObjectById(String id, Class<T> cls, String appId) throws DataException;

	public <T extends PercorsiObject> T storeObject(T obj, String appId) throws DataException;
	public <T extends PercorsiObject> void deleteObject(T obj, String appId) throws DataException;

}
