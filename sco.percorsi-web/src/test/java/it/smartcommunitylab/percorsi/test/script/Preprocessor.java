package it.smartcommunitylab.percorsi.test.script;

import it.smartcommunitylab.percorsi.xml.I18NText;
import it.smartcommunitylab.percorsi.xml.POI;
import it.smartcommunitylab.percorsi.xml.Path;
import it.smartcommunitylab.percorsi.xml.PathData;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.List;

import javax.xml.bind.JAXB;

public class Preprocessor {


	public static PathData preprocessPaths(String file) throws FileNotFoundException {
		PathData xmlData = JAXB.unmarshal(new FileInputStream(file), it.smartcommunitylab.percorsi.xml.PathData.class);
		for (Path pd : xmlData.getPath()) {
			List<I18NText> description = pd.getDescription();
			preprocessDescriptions(description);
			
			for (POI poi : pd.getPoi()) {
				description = poi.getDescription();
				preprocessDescriptions(description);
			}
		}
		return xmlData;
	}

	/**
	 * @param description
	 */
	private static void preprocessDescriptions(List<I18NText> description) {
		for(int i = 0; i < description.size(); i++) {
			I18NText txt = description.get(i);
			preprocessText(txt);
		} 
	}

	/**
	 * @param txt
	 */
	private static void preprocessText(I18NText txt) {
		txt.setValue(txt.getValue().replace("\n", "<br/>"));
		System.err.println("New value: "+txt.getValue());
		System.err.println("------------");
	}
	
	public static void main(String[] args) throws FileNotFoundException {
		String file = "src/test/resources/paths-ingarda.xml";
		
		JAXB.marshal(preprocessPaths(file), new FileOutputStream(file));
	}
}
