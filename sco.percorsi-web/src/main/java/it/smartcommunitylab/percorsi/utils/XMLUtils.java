package it.smartcommunitylab.percorsi.utils;

import it.smartcommunitylab.percorsi.xml.Categories;
import it.smartcommunitylab.percorsi.xml.Category;
import it.smartcommunitylab.percorsi.xml.CustomAttribute;
import it.smartcommunitylab.percorsi.xml.I18NText;
import it.smartcommunitylab.percorsi.xml.Location;
import it.smartcommunitylab.percorsi.xml.Multimedia;
import it.smartcommunitylab.percorsi.xml.POI;
import it.smartcommunitylab.percorsi.xml.Path;
import it.smartcommunitylab.percorsi.xml.Path.Attributes;
import it.smartcommunitylab.percorsi.xml.PathData;

import java.util.ArrayList;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;

public class XMLUtils {

	private static final String ATTR_LENGTH = "length";
	private static final String ATTR_DIFFICULTY = "difficulty";
	private static final String ATTR_DURATION = "duration";

	public static Categories toXML(it.smartcommunitylab.percorsi.model.Categories categories) throws DatatypeConfigurationException {
		GregorianCalendar c = new GregorianCalendar();
		c.setTimeInMillis(categories.getLastChange());
		return new Categories(toXML(categories.getCategories()), DatatypeFactory.newInstance().newXMLGregorianCalendar(c)); 
	}

	public static PathData toXML(it.smartcommunitylab.percorsi.model.PathData data) {
		return new PathData(toXMLPaths(data.getData()));
	}

	private static List<Category> toXML(List<it.smartcommunitylab.percorsi.model.Category> categories) {
		List<Category> list = new ArrayList<Category>();
		if (categories != null) {
			for (it.smartcommunitylab.percorsi.model.Category category: categories) {
				list.add(toXML(category));
			}
		}
		return list;
	}

	private static Category toXML(it.smartcommunitylab.percorsi.model.Category category) {
		return new Category(toXML(category.getName()), toXML(category.getDescription()), category.getImage(), category.getId());
	}

	private static List<I18NText> toXML(Map<String, String> values) {
		List<I18NText> list = new ArrayList<I18NText>();
		if (values != null) {
			for (Entry<String,String> entry : values.entrySet()) {
				list.add(new I18NText(entry.getValue(),entry.getKey()));
			}
		}
		return list;
	}
	
	private static List<Path> toXMLPaths(List<it.smartcommunitylab.percorsi.model.Path> data) {
		List<Path> list = new ArrayList<>();
		if (data != null) {
			for (it.smartcommunitylab.percorsi.model.Path obj: data) {
				list.add(toXML(obj));
			}
		}
		return list;
	}

	private static Path toXML(it.smartcommunitylab.percorsi.model.Path path) {
		return new Path(
				toXML(path.getTitle()), 
				toXML(path.getDescription()), 
				path.getCategories(), 
				toXMLMM(path.getImages()), 
				toXMLMM(path.getVideos()),
				toXMLMM(path.getAudios()),
				path.getExternalUrl(),
				toXMLAttrs(path),
				path.getShape(),
				toXMLPOIs(path.getPois()),
				path.getLocalId());
	}

	private static List<POI> toXMLPOIs(List<it.smartcommunitylab.percorsi.model.POI> data) {
		List<POI> list = new ArrayList<>();
		if (data != null) {
			for (it.smartcommunitylab.percorsi.model.POI obj: data) {
				list.add(toXML(obj));
			}
		}
		return list;
	}

	private static POI toXML(it.smartcommunitylab.percorsi.model.POI obj) {
		return new POI(
				toXML(obj.getTitle()),
				toXML(obj.getDescription()),
				toXMLMM(obj.getImages()), 
				toXMLMM(obj.getVideos()),
				toXMLMM(obj.getAudios()),
				obj.getExternalUrl(),
				new Location(obj.getCoordinates().getLat(), obj.getCoordinates().getLng()),
				obj.getLocalId());
	}

	private static Attributes toXMLAttrs(it.smartcommunitylab.percorsi.model.Path path) {
		List<CustomAttribute> list = new ArrayList<>();
		list.add(new CustomAttribute(""+path.getTime(), ATTR_DURATION));
		list.add(new CustomAttribute(""+path.getDifficulty(), ATTR_DIFFICULTY));
		list.add(new CustomAttribute(""+path.getLength(),ATTR_LENGTH));
		return new Attributes(list);
	}

	private static List<Multimedia> toXMLMM(List<it.smartcommunitylab.percorsi.model.Multimedia> data) {
		List<Multimedia> list = new ArrayList<>();
		if (data != null) {
			for (it.smartcommunitylab.percorsi.model.Multimedia obj: data) {
				list.add(toXML(obj));
			}
		}
		return list;
	}

	private static Multimedia toXML(it.smartcommunitylab.percorsi.model.Multimedia obj) {
		return new Multimedia(toXML(obj.getTitle()),obj.getUrl(), obj.isUserDefined(), obj.getUserId());
	}
	
	public static it.smartcommunitylab.percorsi.model.Categories toDomain(Categories categories) {
		Long lastChange = categories.getLastChange().toGregorianCalendar().getTimeInMillis();
		return new it.smartcommunitylab.percorsi.model.Categories(toDomainCategories(categories.getCategory()), lastChange);
	}

	public static it.smartcommunitylab.percorsi.model.PathData toDomain(PathData data) {
		return new it.smartcommunitylab.percorsi.model.PathData(toDomainPaths(data.getPath()));
	}
	
	private static List<it.smartcommunitylab.percorsi.model.Category> toDomainCategories(List<Category> data) {
		List<it.smartcommunitylab.percorsi.model.Category> list = new ArrayList<>();
		if (data != null) {
			for (Category obj: data) {
				list.add(toDomain(obj));
			}
		}
		return list;
	}

	private static it.smartcommunitylab.percorsi.model.Category toDomain(Category obj) {
		return new it.smartcommunitylab.percorsi.model.Category(toDomain(obj.getName()), toDomain(obj.getDescription()), obj.getImage(), obj.getCategoryId());
	}

	private static Map<String, String> toDomain(List<I18NText> name) {
		Map<String,String> map = new HashMap<>();
		if (name != null)
			for (I18NText e : name)
				map.put(e.getLang(), e.getValue());
		return map;
	}
	

	private static List<it.smartcommunitylab.percorsi.model.Path> toDomainPaths(List<Path> data) {
		List<it.smartcommunitylab.percorsi.model.Path> list = new ArrayList<>();
		if (data != null) 
			for (Path obj : data)
				list.add(toDomain(obj));
		return list;
	}

	private static it.smartcommunitylab.percorsi.model.Path toDomain(Path obj) {
		List<CustomAttribute> attrs = obj.getAttributes() != null ? obj.getAttributes().getAttribute() : null;
		Integer length = null, time = null, difficulty = null;
		if (attrs != null) 
			for (CustomAttribute attr : attrs) {
				if (ATTR_LENGTH.equalsIgnoreCase(attr.getName())) try {length = Integer.parseInt(attr.getValue()); } catch(Exception e) {};
				if (ATTR_DURATION.equalsIgnoreCase(attr.getName())) try {time = Integer.parseInt(attr.getValue()); } catch(Exception e) {};
				if (ATTR_DIFFICULTY.equalsIgnoreCase(attr.getName())) try {difficulty = Integer.parseInt(attr.getValue()); } catch(Exception e) {};
			}	
		
		return new it.smartcommunitylab.percorsi.model.Path(
				obj.getPathId(),
				toDomain(obj.getTitle()),
				toDomain(obj.getDescription()),
				obj.getCategory(),
				toDomainMM(obj.getImage()),
				toDomainMM(obj.getVideo()),
				toDomainMM(obj.getAudio()),
				toDomainPOIs(obj.getPoi()),
				obj.getShape(),
				length,
				time,
				difficulty,
				obj.getExternalURL()
				);
	}

	private static List<it.smartcommunitylab.percorsi.model.POI> toDomainPOIs(List<POI> data) {
		List<it.smartcommunitylab.percorsi.model.POI> list = new ArrayList<>();
		if (data != null) 
			for (POI obj : data)
				list.add(toDomain(obj));
		return list;
	}

	private static it.smartcommunitylab.percorsi.model.POI toDomain(POI obj) {
		return new it.smartcommunitylab.percorsi.model.POI(
				obj.getPoiId(),
				toDomain(obj.getTitle()),
				toDomain(obj.getDescription()),
				toDomainMM(obj.getImage()),
				toDomainMM(obj.getVideo()),
				toDomainMM(obj.getAudio()),
				obj.getExternalURL(),
				new it.smartcommunitylab.percorsi.model.Location(obj.getCoordinates().getLatitude(), obj.getCoordinates().getLongitude())
		);
	}

	private static List<it.smartcommunitylab.percorsi.model.Multimedia> toDomainMM(List<Multimedia> data) {
		List<it.smartcommunitylab.percorsi.model.Multimedia> list = new ArrayList<>();
		if (data != null) 
			for (Multimedia obj : data)
				list.add(toDomain(obj));
		return list;
	}

	private static it.smartcommunitylab.percorsi.model.Multimedia toDomain(Multimedia obj) {
		return new it.smartcommunitylab.percorsi.model.Multimedia(toDomain(obj.getTitle()), obj.getUrl(), obj.isUserDefined(), obj.getUserId());
	}

	
}
