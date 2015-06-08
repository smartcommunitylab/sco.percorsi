package it.smartcommunitylab.percorsi.test;

import it.smartcommunitylab.percorsi.model.Categories;
import it.smartcommunitylab.percorsi.model.PathData;
import it.smartcommunitylab.percorsi.utils.XMLUtils;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.xml.bind.JAXB;
import javax.xml.datatype.DatatypeConfigurationException;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Assert;
import org.junit.Test;

public class TestTranslation {


	@Test
	public void testXMLGeneration() throws JsonParseException, JsonMappingException, IOException, DatatypeConfigurationException {
		ObjectMapper mapper = new ObjectMapper();

		// test categories
		Categories categories = mapper.readValue(new FileInputStream("src/test/resources/categories.json"), Categories.class);
		it.smartcommunitylab.percorsi.xml.Categories xml = XMLUtils.toXML(categories);
		Assert.assertNotNull(xml);
		Assert.assertEquals(2,xml.getCategory().size());		
		Categories converted = XMLUtils.toDomain(xml);
		Assert.assertNotNull(converted);
		Assert.assertEquals(2,converted.getCategories().size());
		Assert.assertEquals(categories, converted);
		
		// test paths
		PathData data = mapper.readValue(new FileInputStream("src/test/resources/paths.json"), PathData.class);
		it.smartcommunitylab.percorsi.xml.PathData xmlPaths = XMLUtils.toXML(data);
		Assert.assertNotNull(xmlPaths);
		Assert.assertEquals(3,xmlPaths.getPath().size());		
		PathData convertedPaths = XMLUtils.toDomain(xmlPaths);
		Assert.assertNotNull(convertedPaths);
		Assert.assertEquals(3,convertedPaths.getData().size());
		Assert.assertEquals(data, convertedPaths);
	}
	
	@Test
	public void testXMLParsing() throws FileNotFoundException {
		it.smartcommunitylab.percorsi.xml.Categories xmlCategories = JAXB.unmarshal(new FileInputStream("src/test/resources/categories.xml"), it.smartcommunitylab.percorsi.xml.Categories.class);
		Assert.assertNotNull(xmlCategories);
		Assert.assertEquals(2, xmlCategories.getCategory().size());
		Categories categories = XMLUtils.toDomain(xmlCategories);
		Assert.assertNotNull(categories);
		Assert.assertEquals(2, categories.getCategories().size());
		
		it.smartcommunitylab.percorsi.xml.PathData xmlData = JAXB.unmarshal(new FileInputStream("src/test/resources/paths.xml"), it.smartcommunitylab.percorsi.xml.PathData.class);
		Assert.assertNotNull(xmlData);
		Assert.assertEquals(1, xmlData.getPath().size());
		Assert.assertEquals(2, xmlData.getPath().get(0).getPoi().size());
		PathData data = XMLUtils.toDomain(xmlData);
		Assert.assertNotNull(data);
		Assert.assertEquals(1, data.getData().size());
		
	}
}
