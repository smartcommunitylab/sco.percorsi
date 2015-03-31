package it.smartcommunitylab.percorsi.utils;

import it.smartcommunitylab.percorsi.model.Multimedia;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MultimediaUtils {

	public static boolean multimediaEquals(List<Multimedia> list1, List<Multimedia> list2) {
		List<Multimedia> red1 = providerList(list1);
		List<Multimedia> red2 = providerList(list2);
		return red1.equals(red2);
	}

	public static List<Multimedia> mergeProviderMultimedia(List<Multimedia> providerList, List<Multimedia> oldList) {
		List<Multimedia> merged = providerList != null ? new ArrayList<Multimedia>(providerList) : new ArrayList<Multimedia>();
		if (oldList != null) {
			for (Multimedia old : oldList) {
				if (old.isUserDefined()) merged.add(old);
			}
		}
		return merged;
	}

	private static List<Multimedia> providerList(List<Multimedia> list) {
		if (list == null || list.isEmpty()) return Collections.emptyList();
		List<Multimedia> res = new ArrayList<Multimedia>();
		for (Multimedia mm : list) {
			if (!mm.isUserDefined()) res.add(mm);
		}
		return res;
	}
}
