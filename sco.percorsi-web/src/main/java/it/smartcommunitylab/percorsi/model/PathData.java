package it.smartcommunitylab.percorsi.model;

import java.util.List;

public class PathData {

	private List<Path> data;

	public PathData(List<Path> data) {
		super();
		this.data = data;
	}

	public PathData() {
		super();
	}

	/**
	 * @return the data
	 */
	public List<Path> getData() {
		return data;
	}

	/**
	 * @param data the data to set
	 */
	public void setData(List<Path> data) {
		this.data = data;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((data == null) ? 0 : data.hashCode());
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
		PathData other = (PathData) obj;
		if (data == null) {
			if (other.data != null)
				return false;
		} else if (!data.equals(other.data))
			return false;
		return true;
	}
}
