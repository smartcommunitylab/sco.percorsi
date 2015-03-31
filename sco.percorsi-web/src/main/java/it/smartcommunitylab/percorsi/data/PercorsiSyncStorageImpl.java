package it.smartcommunitylab.percorsi.data;

import it.smartcommunitylab.percorsi.model.PercorsiObject;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.SortedMap;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.geo.Circle;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.data.BasicObject;
import eu.trentorise.smartcampus.presentation.data.SyncData;
import eu.trentorise.smartcampus.presentation.storage.sync.mongo.GenericObjectSyncMongoStorage;

@Component
public class PercorsiSyncStorageImpl extends GenericObjectSyncMongoStorage<PercorsiBean> implements PercorsiSyncStorage {

	@Autowired
	public PercorsiSyncStorageImpl(MongoOperations mongoTemplate) {
		super(mongoTemplate);
	}

	@Override
	public Class<PercorsiBean> getObjectClass() {
		return PercorsiBean.class;
	}

	@Override
	public String getCollectionName(Class<?> cls) {
		return "syncObject";
	}

	@Override
	public SyncData getSyncAppData(long since, String appId, Map<String, Object> include, Map<String, Object> exclude) throws DataException {
		return retrieveSyncData(appId, since, include, exclude);
	}

	@SuppressWarnings("unchecked")
	@Override
	public <T extends PercorsiObject> List<T> searchObjects(String appId,
			Class<T> inCls,
			Circle circle,
			String text, String lang,
			Map<String, Object> inCriteria,
			SortedMap<String,Integer> sort,
			int limit, int skip) throws DataException
	{
		Criteria criteria = createSearchCriteria(appId, inCls, circle, text, lang, inCriteria);
		Query query = Query.query(criteria);
		if (limit > 0)
			query.limit(limit);
		if (skip > 0)
			query.skip(skip);
		if (sort != null && !sort.isEmpty()) {
			Order[] orderings = new Order[sort.size()];
			int i = 0;
			for (String key : sort.keySet()) {
				Order order = new Order(sort.get(key) > 0 ? Direction.ASC : Direction.DESC,"content."+key);
				orderings[i++] = order;
			}
			query.with(new Sort(orderings));
		}

		Class<T> cls = inCls;
		if (cls == null)
			cls = (Class<T>) PercorsiObject.class;

		return find(query, cls);
	}

	private <T> Criteria createSearchCriteria(String appId, Class<T> cls, Circle circle, String text, String lang,
			Map<String, Object> inCriteria) {
		Criteria criteria = createBaseCriteria(appId);
		if (cls != null) {
			criteria.and("type").is(cls.getCanonicalName());
		}
		criteria.and("deleted").is(false);
		if (circle != null) {
			criteria.and("content.location").within(circle);
		}
		if (text != null && !text.isEmpty()) {
			Criteria[] or = new Criteria[5];
			or[0] = new Criteria("content.title."+lang).regex(text.toLowerCase(),"i");
			or[1] = new Criteria("content.shortTitle."+lang).regex(text.toLowerCase(),"i");
			or[2] = new Criteria("content.subtitle."+lang).regex(text.toLowerCase(),"i");
			or[3] = new Criteria("content.description."+lang).regex(text.toLowerCase(),"i");
			or[4] = new Criteria("content.info."+lang).regex(text.toLowerCase(),"i");
			criteria.orOperator(or);
		}
		if (inCriteria != null) {
			for (String key : inCriteria.keySet()) {
				criteria.and("content." + key).is(inCriteria.get(key));
			}
		}
		return criteria;
	}


	@Override
	public List<PercorsiObject> getAllAppObjects(String appId)  throws DataException{
		Criteria criteria = createBaseCriteria(appId);
		criteria.and("deleted").is(false);
		return find(Query.query(criteria), (Class<PercorsiObject>) PercorsiObject.class);
	}


	@Override
	public <T extends PercorsiObject> List<T> getAppObjectsByType(String appId, Class<T> cls) throws DataException {
		Criteria criteria = createBaseCriteria(appId);
		criteria.and("deleted").is(false);
		criteria.and("type").is(cls.getCanonicalName());
		return find(Query.query(criteria), (Class<T>) cls);
	}

	@Override
	public PercorsiObject getObjectById(String id, String appId) throws DataException {
		Criteria criteria = createBaseCriteria(appId);
		criteria.and("localId").is(id);
		List<PercorsiObject> objs = find(Query.query(criteria), (Class<PercorsiObject>) PercorsiObject.class);
		return objs == null || objs.size() == 0 ? null : objs.get(0);
	}

	@Override
	public <T extends PercorsiObject> T getObjectById(String id, Class<T> cls, String appId)  throws DataException{
		Criteria criteria = createBaseCriteria(appId);
		criteria.and("localId").is(id);
		List<T> objs = find(Query.query(criteria), cls);
		return objs == null || objs.size() == 0 ? null : objs.get(0);
	}

	protected <T> Criteria createBaseCriteria(String appId) {
		Criteria criteria = new Criteria();
		criteria.and("appId").is(appId);
		return criteria;
	}

	@SuppressWarnings("unchecked")
	private SyncData retrieveSyncData(String appId, long since, Map<String, Object> include, Map<String, Object> exclude) {
		long newVersion = getVersion();
		SyncData syncData = new SyncData();
		syncData.setVersion(newVersion);
		List<PercorsiBean> list = searchWithVersion(appId, since-1, newVersion, include, exclude);
		if (list != null && !list.isEmpty()) {
			Map<String,List<BasicObject>> updated = new HashMap<String, List<BasicObject>>();
			Map<String,List<String>> deleted = new HashMap<String, List<String>>();
			for (PercorsiBean sob : list) {
				if (sob.isDeleted()) {
					List<String> deletedList = deleted.get(sob.getType());
					if (deletedList == null) {
						deletedList = new ArrayList<String>();
						deleted.put(sob.getType(), deletedList);
					}
					deletedList.add(sob.getLocalId());
				} else {
					List<BasicObject> updatedList = updated.get(sob.getType());
					if (updatedList == null) {
						updatedList = new ArrayList<BasicObject>();
						updated.put(sob.getType(), updatedList);
					}
					try {
						BasicObject b = convertBeanToBasicObject(sob, (Class<? extends PercorsiObject>)Thread.currentThread().getContextClassLoader().loadClass(sob.getType()));
						updatedList.add(b);
					} catch (ClassNotFoundException e) {
						continue;
					}

				}
			}
			syncData.setDeleted(deleted);
			syncData.setUpdated(updated);
		}
		return syncData;
	}

	private List<PercorsiBean> searchWithVersion(String appId, long fromVersion, long toVersion, Map<String, Object> include, Map<String, Object> exclude) {
		Criteria criteria = new Criteria();
		criteria.and("appId").is(appId);
		criteria.and("version").gt(fromVersion).lt(toVersion);
		if (include != null && !include.isEmpty()) {
			for (String key : include.keySet()) {
				Object value = include.get(key);
				if (value instanceof Collection) {
					criteria.and("content."+key).in((Collection<?>)value);
				} else {
					criteria.and("content."+key).is(value);
				}
			}
		}
		if (exclude != null && !exclude.isEmpty()) {
			for (String key : exclude.keySet()) {
				Object value = exclude.get(key);
				if (value instanceof Collection) {
					criteria.and("content."+key).nin((Collection<?>)value);
				} else {
					criteria.and("content."+key).ne(value);
				}
			}
		}
		return mongoTemplate.find(Query.query(criteria), getObjectClass(), getCollectionName(getObjectClass()));
	}

	@Override
	public <T extends PercorsiObject> T storeObject(T obj, String appId) throws DataException {
		obj.setLocalId(obj.getLocalId());
		obj.setAppId(appId);

		PercorsiBean old = getBean(obj, appId);

		try {
			obj.setVersion(getNewVersion());
			PercorsiBean newObj = convertToObjectBean(obj);
			if (old != null) {
				newObj.setId(old.getId());
			} else {
				newObj.setId(new ObjectId().toString());
			}
			mongoTemplate.save(newObj, getCollectionName(obj.getClass()));
			return obj;
		} catch (Exception e) {
			e.printStackTrace();
			throw new DataException(e.getMessage());
		}

	}

	@Override
	protected <T extends BasicObject> PercorsiBean convertToObjectBean(T object)
			throws InstantiationException, IllegalAccessException {
		PercorsiBean obj = super.convertToObjectBean(object);
		obj.setAppId(((PercorsiObject)object).getAppId());
		obj.setLocalId(((PercorsiObject)object).getLocalId());
		return obj;
	}

	@Override
	protected BasicObject convertBeanToBasicObject(PercorsiBean object, Class<? extends BasicObject> cls) {
		PercorsiObject appObj = (PercorsiObject)super.convertBeanToBasicObject(object, cls);
		appObj.setLocalId(appObj.getLocalId());
		return appObj;
	}

	private <T extends PercorsiObject> PercorsiBean getBean(T obj, String appId) {
		PercorsiBean old = null;
		Criteria criteria = createBaseCriteria(appId);
		criteria.and("localId").is(obj.getLocalId());
		List<PercorsiBean> result = mongoTemplate.find(Query.query(criteria), getObjectClass(), getCollectionName(getObjectClass()));
		if (result != null && !result.isEmpty()) {
			old = result.get(0);
		}
		return old;
	}

	@Override
	public <T extends PercorsiObject> void deleteObject(T obj, String appId)  throws DataException {
		obj.setVersion(getNewVersion());
		PercorsiBean old = getBean(obj, appId);

		try {
			PercorsiBean newObj = convertToObjectBean(obj);
			if (old != null) {
				newObj.setId(old.getId());
			} else {
				newObj.setId(new ObjectId().toString());
			}
			newObj.setDeleted(true);
			mongoTemplate.save(newObj, getCollectionName(obj.getClass()));
		} catch (Exception e) {
			e.printStackTrace();
			throw new DataException(e.getMessage());
		}
	}

}