package it.smartcommunitylab.percorsi.model;

import it.smartcommunitylab.percorsi.utils.MultimediaUtils;

import java.util.List;
import java.util.Map;

public class POI extends PercorsiObject {

	private static final long serialVersionUID = -1229408074233301651L;

	private Map<String,String> title;
	private Map<String,String> description;
	
	private List<Multimedia> images;
	private List<Multimedia> videos;
	private List<Multimedia> audios;

	private Location coordinates;

	public Map<String, String> getTitle() {
		return title;
	}

	public void setTitle(Map<String, String> title) {
		this.title = title;
	}

	public Map<String, String> getDescription() {
		return description;
	}

	public void setDescription(Map<String, String> description) {
		this.description = description;
	}

	public List<Multimedia> getImages() {
		return images;
	}

	public void setImages(List<Multimedia> images) {
		this.images = images;
	}

	public List<Multimedia> getVideos() {
		return videos;
	}

	public void setVideos(List<Multimedia> videos) {
		this.videos = videos;
	}

	public List<Multimedia> getAudios() {
		return audios;
	}

	public void setAudios(List<Multimedia> audios) {
		this.audios = audios;
	}

	public Location getCoordinates() {
		return coordinates;
	}

	public void setCoordinates(Location coordinates) {
		this.coordinates = coordinates;
	}
	
	@Override
	public boolean equals(Object obj) {
		if (this == obj) return true;
		if (obj == null) return false;
		if (obj.getClass() != getClass()) return false;
		return coreDataEquals((POI)obj);
	}
	
	public boolean coreDataEquals(POI other) {
		if (this == other)
			return true;
		if (other == null)
			return false;
		if (audios == null) { if (other.audios != null) return false; } 
		else if (!audios.equals(other.audios)) return false;
		
		if (description == null) { if (other.description != null) return false; } 
		else if (!description.equals(other.description)) return false;
		
		if (title == null) { if (other.title != null) return false; } 
		else if (!title.equals(other.title)) return false;
		
		if (!MultimediaUtils.multimediaEquals(getVideos(), other.getVideos())) return false;
		if (!MultimediaUtils.multimediaEquals(getImages(), other.getImages())) return false;
		
		return true;
	}

}
