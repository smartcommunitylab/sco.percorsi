package it.smartcommunitylab.percorsi.model;

import it.smartcommunitylab.percorsi.utils.MultimediaUtils;

import java.util.List;
import java.util.Map;

public class Path extends PercorsiObject {
	private static final long serialVersionUID = 891458950170569358L;

	private List<String> categories;
	private Map<String,String> title;
	private Map<String,String> description;

	private Integer length;
	private Integer time;
	private Integer difficulty;

	private List<Multimedia> images;
	private List<Multimedia> videos;
	private List<Multimedia> audios;
	private String shape;
	private Double vote;
	private Integer voteCount;

	private String externalUrl;
	
	private List<POI> pois;

	public Path() {
		super();
	}

	
	public Path(String localId, Map<String, String> title, Map<String, String> description,
			List<String> categories, List<Multimedia> images,
			List<Multimedia> videos, List<Multimedia> audios, List<POI> pois,
			String shape, Integer length, Integer time, Integer difficulty,
			String externalUrl) {
		super();
		this.title = title;
		this.description = description;
		this.categories = categories;
		this.images = images;
		this.videos = videos;
		this.audios = audios;
		this.pois = pois;
		this.shape = shape;
		this.length = length;
		this.time = time;
		this.difficulty = difficulty;
		this.externalUrl = externalUrl;
		setLocalId(localId);
	}


	public List<String> getCategories() {
		return categories;
	}

	public void setCategories(List<String> categories) {
		this.categories = categories;
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

	public Integer getLength() {
		return length;
	}

	public void setLength(Integer length) {
		this.length = length;
	}

	public Integer getTime() {
		return time;
	}

	public void setTime(Integer time) {
		this.time = time;
	}

	public Integer getDifficulty() {
		return difficulty;
	}

	public void setDifficulty(Integer difficulty) {
		this.difficulty = difficulty;
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

	public String getShape() {
		return shape;
	}

	public void setShape(String shape) {
		this.shape = shape;
	}

	public Double getVote() {
		return vote;
	}

	public void setVote(Double vote) {
		this.vote = vote;
	}

	public List<POI> getPois() {
		return pois;
	}

	public void setPois(List<POI> pois) {
		this.pois = pois;
	}

	/**
	 * @return the voteCount
	 */
	public Integer getVoteCount() {
		return voteCount;
	}

	/**
	 * @param voteCount the voteCount to set
	 */
	public void setVoteCount(Integer voteCount) {
		this.voteCount = voteCount;
	}

	public boolean coreDataEquals(Path other) {
		if (this == other)
			return true;
		if (other == null)
			return false;
		if (audios == null) { if (other.audios != null) return false; }
		else if (!audios.equals(other.audios)) return false;

		if (categories == null) { if (other.categories != null) return false; }
		else if (!categories.equals(other.categories)) return false;

		if (description == null) { if (other.description != null) return false; }
		else if (!description.equals(other.description)) return false;

		if (difficulty == null) { if (other.difficulty != null) return false; }
		else if (!difficulty.equals(other.difficulty)) return false;

		if (length == null) { if (other.length != null) return false; }
		else if (!length.equals(other.length)) return false;

		if (pois == null) { if (other.pois != null) return false; }
		else if (!pois.equals(other.pois)) return false;

		if (shape == null) { if (other.shape != null) return false; }
		else if (!shape.equals(other.shape)) return false;

		if (time == null) { if (other.time != null) return false; }
		else if (!time.equals(other.time)) return false;

		if (title == null) { if (other.title != null) return false; }
		else if (!title.equals(other.title)) return false;

		if (externalUrl == null) { if (other.externalUrl != null) return false; }
		else if (!externalUrl.equals(other.externalUrl)) return false;

		if (!MultimediaUtils.multimediaEquals(getVideos(), other.getVideos())) return false;
		if (!MultimediaUtils.multimediaEquals(getImages(), other.getImages())) return false;

		return true;
	}

	public String getExternalUrl() {
		return externalUrl;
	}

	public void setExternalUrl(String externalUrl) {
		this.externalUrl = externalUrl;
	}


	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((audios == null) ? 0 : audios.hashCode());
		result = prime * result
				+ ((categories == null) ? 0 : categories.hashCode());
		result = prime * result
				+ ((description == null) ? 0 : description.hashCode());
		result = prime * result
				+ ((difficulty == null) ? 0 : difficulty.hashCode());
		result = prime * result
				+ ((externalUrl == null) ? 0 : externalUrl.hashCode());
		result = prime * result + ((images == null) ? 0 : images.hashCode());
		result = prime * result + ((length == null) ? 0 : length.hashCode());
		result = prime * result + ((pois == null) ? 0 : pois.hashCode());
		result = prime * result + ((shape == null) ? 0 : shape.hashCode());
		result = prime * result + ((time == null) ? 0 : time.hashCode());
		result = prime * result + ((title == null) ? 0 : title.hashCode());
		result = prime * result + ((videos == null) ? 0 : videos.hashCode());
		return result;
	}


	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Path other = (Path) obj;
		if (audios == null) {
			if (other.audios != null)
				return false;
		} else if (!audios.equals(other.audios))
			return false;
		if (categories == null) {
			if (other.categories != null)
				return false;
		} else if (!categories.equals(other.categories))
			return false;
		if (description == null || description.isEmpty()) {
			if (other.description != null && !other.description.isEmpty())
				return false;
		} else if (!description.equals(other.description))
			return false;
		if (difficulty == null) {
			if (other.difficulty != null)
				return false;
		} else if (!difficulty.equals(other.difficulty))
			return false;
		if (externalUrl == null) {
			if (other.externalUrl != null)
				return false;
		} else if (!externalUrl.equals(other.externalUrl))
			return false;
		if (images == null) {
			if (other.images != null)
				return false;
		} else if (!images.equals(other.images))
			return false;
		if (length == null) {
			if (other.length != null)
				return false;
		} else if (!length.equals(other.length))
			return false;
		if (pois == null) {
			if (other.pois != null)
				return false;
		} else if (!pois.equals(other.pois))
			return false;
		if (shape == null) {
			if (other.shape != null)
				return false;
		} else if (!shape.equals(other.shape))
			return false;
		if (time == null) {
			if (other.time != null)
				return false;
		} else if (!time.equals(other.time))
			return false;
		if (title == null || title.isEmpty()) {
			if (other.title != null && !other.title.isEmpty())
				return false;
		} else if (!title.equals(other.title))
			return false;
		if (videos == null) {
			if (other.videos != null)
				return false;
		} else if (!videos.equals(other.videos))
			return false;
		return true;
	}

	
}
