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

	private String externalUrl;
	
	private Location coordinates;

	public POI() {
		super();
	}

	public POI(String localId, Map<String, String> title, Map<String, String> description,
			List<Multimedia> images, List<Multimedia> videos,
			List<Multimedia> audios, String externalUrl, Location coordinates) {
		super();
		this.title = title;
		this.description = description;
		this.images = images;
		this.videos = videos;
		this.audios = audios;
		this.externalUrl = externalUrl;
		this.coordinates = coordinates;
		setLocalId(localId);
	}

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

		if (externalUrl == null) { if (other.externalUrl != null) return false; }
		else if (!externalUrl.equals(other.externalUrl)) return false;

		if (!MultimediaUtils.multimediaEquals(getVideos(), other.getVideos())) return false;
		if (!MultimediaUtils.multimediaEquals(getImages(), other.getImages())) return false;

		if (!coordinates.equals(other.coordinates)) return false;
		
		return true;
	}

	public String getExternalUrl() {
		return externalUrl;
	}

	public void setExternalUrl(String externalUrl) {
		this.externalUrl = externalUrl;
	}
	
}
