package it.smartcommunitylab.percorsi.test;

import it.smartcommunitylab.percorsi.data.PercorsiSyncStorage;
import it.smartcommunitylab.percorsi.model.Categories;
import it.smartcommunitylab.percorsi.model.Contributor;
import it.smartcommunitylab.percorsi.model.ModObj;
import it.smartcommunitylab.percorsi.model.Path;
import it.smartcommunitylab.percorsi.model.PathData;
import it.smartcommunitylab.percorsi.model.Rating;
import it.smartcommunitylab.percorsi.services.ModerationManager;
import it.smartcommunitylab.percorsi.services.PercorsiManager;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.common.exception.NotFoundException;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {TestConfig.class}, loader = AnnotationConfigContextLoader.class)
public class TestModeration {

	@Autowired
	private PercorsiManager percorsiManager;
	@Autowired 
	private ModerationManager moderationManager;
	@Autowired
	private PercorsiSyncStorage syncStorage;
	@Autowired
	private MongoTemplate mongo;
	
	@Before
	public void init() throws JsonParseException, JsonMappingException, FileNotFoundException, IOException, DataException {
		mongo.dropCollection("syncObject");
		mongo.dropCollection(ModObj.class);
		
		ObjectMapper mapper = new ObjectMapper();
		Categories categories = mapper.readValue(new FileInputStream("src/test/resources/categories.json"), Categories.class);
		percorsiManager.storeCategories("test", categories); 
		PathData data = mapper.readValue(new FileInputStream("src/test/resources/paths.json"), PathData.class);
		percorsiManager.storePaths("test", data.getData());
	}
	
	@Test
	public void testModerateImage() throws JsonParseException, JsonMappingException, FileNotFoundException, IOException, DataException, NotFoundException {
		// add image
		percorsiManager.addImageToPath("test", "ididididpath1", "testUrl", new Contributor("1","name"));
		List<ModObj> 
		modObjects = moderationManager.getModObjects("test", Path.class.getName());
		Assert.assertNotNull(modObjects);
		Assert.assertEquals(1, modObjects.size());
		// accept
		moderationManager.acceptModObject("test", "ididididpath1", Path.class.getName(), "1", "testUrl");
		modObjects = moderationManager.getModObjects("test", Path.class.getName());
		Assert.assertEquals(0, modObjects.size());
		// add image
		percorsiManager.addImageToPath("test", "ididididpath1", "testUrl2", new Contributor("1","name"));
		modObjects = moderationManager.getModObjects("test", Path.class.getName());
		Assert.assertNotNull(modObjects);
		Assert.assertEquals(1, modObjects.size());
		Path path = percorsiManager.getPath("test", "ididididpath1");
		Assert.assertEquals(5, path.getImages().size());
		// reject
		moderationManager.rejectUserImage("test", "ididididpath1", "1", "testUrl2");
		modObjects = moderationManager.getModObjects("test", Path.class.getName());
		Assert.assertEquals(0, modObjects.size());
		path = percorsiManager.getPath("test", "ididididpath1");
		Assert.assertEquals(4, path.getImages().size());
	}
	
	@Test
	public void testModerateComment() throws JsonParseException, JsonMappingException, FileNotFoundException, IOException, DataException, NotFoundException {
		// add rating
		percorsiManager.rate("test", "ididididpath1", new Contributor("1","name"), 3, "pippo");
		List<ModObj> 
		modObjects = moderationManager.getModObjects("test", Rating.class.getName());
		Assert.assertNotNull(modObjects);
		Assert.assertEquals(1, modObjects.size());
		// accept
		moderationManager.acceptModObject("test", "ididididpath1", Rating.class.getName(), "1", "pippo");
		modObjects = moderationManager.getModObjects("test", Rating.class.getName());
		Assert.assertEquals(0, modObjects.size());
		// add image
		percorsiManager.rate("test", "ididididpath1", new Contributor("1","name"), 4, "plutto");
		modObjects = moderationManager.getModObjects("test", Rating.class.getName());
		Assert.assertNotNull(modObjects);
		Assert.assertEquals(1, modObjects.size());
		Rating rating = percorsiManager.getUserRating("test", "ididididpath1", new Contributor("1","name"));
		Assert.assertNotNull(rating);
		// reject
		moderationManager.rejectComment("test", "ididididpath1", "1", "plutto");
		modObjects = moderationManager.getModObjects("test", Rating.class.getName());
		Assert.assertEquals(0, modObjects.size());
		rating = percorsiManager.getUserRating("test", "ididididpath1", new Contributor("1","name"));
		Assert.assertNull(rating.getComment());
	}

}
