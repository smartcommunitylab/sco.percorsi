package it.smartcommunitylab.percorsi.model;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/**
 *
 * @author rafael
 */
public class Exporter {
	FileOutputStream fileOut;
	XSSFWorkbook wb;
	String excelFileName;// name of excel file
	final String titoliCategorie = "id,name it,name en,name de,image";
	String[] titCat;
	final String titoliPercorsi = "id,categories,title it,title en,title de,description it,description en,description de,length,time,difficulty,images,videos,audios,shape,pois";
	String[] titPerc;
	final String titoliPOI = "id,title it,title en,title de,description it,description en,description de,images,videos,audios,coordinates";
	String[] titPOI;

	public Exporter() throws FileNotFoundException {
		titCat = titoliCategorie.split(",");
		titPerc = titoliPercorsi.split(",");
		titPOI = titoliPOI.split(",");
	}

	public Exporter(String nome) throws FileNotFoundException {
		excelFileName = nome;
		fileOut = new FileOutputStream(excelFileName);
		titCat = titoliCategorie.split(",");
		titPerc = titoliPercorsi.split(",");
		titPOI = titoliPOI.split(",");
	}

	public XSSFWorkbook getWorkbook() {
		return wb;
	}

	public FileOutputStream getFile() {
		return fileOut;
	}

	public ByteArrayOutputStream exportDataStream(Categories categorie, PathData percorsi) throws IOException {
		wb = new XSSFWorkbook();
		if (categorie != null) {
			writeCategories(categorie, wb);
		}
		if (percorsi != null) {
			writePaths(percorsi, wb);
			writePOI(percorsi, wb);
		}

		ByteArrayOutputStream os = new ByteArrayOutputStream();
		wb.write(os);
		return os;
	}

	public XSSFWorkbook exportData(Categories categorie, PathData percorsi) throws IOException {
		wb = new XSSFWorkbook();
		if (categorie != null) {
			writeCategories(categorie, wb);
		}
		if (percorsi != null) {
			writePaths(percorsi, wb);
			writePOI(percorsi, wb);
		}

		// wb.write(fileOut);
		// fileOut.flush();
		return wb;
	}

	private void writeCategories(Categories categorie, XSSFWorkbook wb) throws IOException {
		String sheetName = "Categorie";// name of sheet
		XSSFSheet sheet = wb.createSheet(sheetName);
		XSSFRow titoli = sheet.createRow(0);

		// titoli
		for (int m = 0; m < titCat.length; m++) {
			titoli.createCell(m).setCellValue(titCat[m]);
		}// ****
		for (int j = 0; j < 5; j++) {
			XSSFRow row;
			XSSFCell cell;
			for (int i = 0; i < categorie.getCategories().size(); i++)

			{

				switch (j) {
				case 0:

					row = sheet.createRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue(categorie.getCategories().get(i).getId());
					cell.setAsActiveCell();
					break;
				case 1:
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue((String) categorie.getCategories().get(i).getName().get("it"));
					break;
				case 2:
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue((String) categorie.getCategories().get(i).getName().get("en"));
					break;
				case 3:
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue((String) categorie.getCategories().get(i).getName().get("de"));
					break;
				case 4:
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue(categorie.getCategories().get(i).getImage());
					break;
				}
			}
		}

	}

	private void writePaths(PathData percorsi, XSSFWorkbook wb) throws IOException {

		String sheetName = "Paths";// name of sheet
		XSSFSheet sheet = wb.createSheet(sheetName);
		XSSFRow titoli = sheet.createRow(0);
		// XSSFCell cellatitoli=titolicat.ge
		for (int m = 0; m < titPerc.length; m++) {
			titoli.createCell(m).setCellValue(titPerc[m]);
		}

		for (int j = 0; j < 15; j++) {
			XSSFRow row;
			XSSFCell cell;
			for (int i = 0; i < percorsi.getData().size(); i++) {
				switch (j) {
				case 0:

					row = sheet.createRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue(percorsi.getData().get(i).getLocalId());
					break;
				case 1:
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue(percorsi.getData().get(i).getCategories().toString().replace('[', ' ').replace(']', ' ').substring(1));
					break;
				case 2:
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue((String) percorsi.getData().get(i).getTitle().get("it"));
					break;
				case 3:
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue((String) percorsi.getData().get(i).getTitle().get("en"));
					break;
				case 4:
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue((String) percorsi.getData().get(i).getTitle().get("de"));
					break;
				case 5:
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue(percorsi.getData().get(i).getDescription().get("it"));
					break;
				case 6:
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue(percorsi.getData().get(i).getDescription().get("en"));
					break;
				case 7:
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue(percorsi.getData().get(i).getDescription().get("de"));
					break;
				case 8:
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue(percorsi.getData().get(i).getLength());
					break;
				case 9:
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue(percorsi.getData().get(i).getTime());
					break;
				case 10:
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue(percorsi.getData().get(i).getDifficulty());
					break;
				case 11:
					int p = 0;
					String po = "";
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					while (p < percorsi.getData().get(i).getImages().size()) {
						po = po + percorsi.getData().get(i).getImages().get(p).getUrl() + "\n";
						p++;
					}
					cell.setCellValue(po.substring(0, po.length() - 1));
					break;
				case 12:
					int o = 0;
					String oi = "";
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					while (o < percorsi.getData().get(i).getVideos().size()) {
						oi = oi + percorsi.getData().get(i).getVideos().get(o).getUrl() + "\n";
						o++;
					}
					cell.setCellValue(oi.substring(0, oi.length() - 1));
					break;
				case 13:
					int u = 0;
					String iu = "";
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					while (u < percorsi.getData().get(i).getAudios().size()) {
						iu = iu + percorsi.getData().get(i).getAudios().get(u).getUrl() + "\n";
						u++;
					}
					cell.setCellValue(iu.substring(0, iu.length() - 1));
					break;
				case 14:
					row = sheet.getRow(i + 1);
					cell = row.createCell(j);
					cell.setCellValue(percorsi.getData().get(i).getShape());
					break;
				}
			}
		}
	}

	private void writePOI(PathData percorsi, XSSFWorkbook wb) throws IOException {

		int i = 0;
		while (i < percorsi.getData().size()) {
			XSSFRow tmpRow = wb.getSheet("Paths").getRow(i + 1);
			XSSFCell tmpCell = tmpRow.createCell(15);
			String pois = "";

			String sheetName = percorsi.getData().get(i).getTitle().get("it");// name
																				// of
																				// sheet
			XSSFSheet sheet = wb.createSheet(sheetName);
			XSSFRow titoli = sheet.createRow(0);
			// XSSFCell cellatitoli=titolicat.ge
			for (int m = 0; m < titPOI.length; m++) {
				titoli.createCell(m).setCellValue(titPOI[m]);
			}

			for (int j = 0; j < 11; j++) {

				XSSFRow row;
				XSSFCell cell;
				for (int k = 0; k < percorsi.getData().get(i).getPois().size(); k++) {

					switch (j) {
					case 0:

						row = sheet.createRow(k + 1);
						cell = row.createCell(j);
						String tmp = percorsi.getData().get(i).getPois().get(k).getLocalId();
						cell.setCellValue(tmp);
						pois = pois + " " + tmp;
						break;
					case 1:
						row = sheet.getRow(k + 1);
						cell = row.createCell(j);
						cell.setCellValue((String) percorsi.getData().get(i).getPois().get(k).getTitle().get("it"));
						break;
					case 2:
						row = sheet.getRow(k + 1);
						cell = row.createCell(j);
						cell.setCellValue((String) percorsi.getData().get(i).getPois().get(k).getTitle().get("en"));
						break;
					case 3:
						row = sheet.getRow(k + 1);
						cell = row.createCell(j);
						cell.setCellValue((String) percorsi.getData().get(i).getPois().get(k).getTitle().get("de"));
						break;
					case 4:
						row = sheet.getRow(k + 1);
						cell = row.createCell(j);
						cell.setCellValue(percorsi.getData().get(i).getPois().get(k).getDescription().get("it"));
						break;
					case 5:
						row = sheet.getRow(k + 1);
						cell = row.createCell(j);
						cell.setCellValue(percorsi.getData().get(i).getPois().get(k).getDescription().get("en"));
						break;
					case 6:
						row = sheet.getRow(k + 1);
						cell = row.createCell(j);
						cell.setCellValue(percorsi.getData().get(i).getPois().get(k).getDescription().get("de"));
						break;
					case 7:
						int p = 0;
						String po = "";
						row = sheet.getRow(k + 1);
						cell = row.createCell(j);
						while (p < percorsi.getData().get(i).getPois().get(k).getImages().size()) {
							po = po + percorsi.getData().get(i).getPois().get(k).getImages().get(p).getUrl() + "\n";
							p++;
						}
						cell.setCellValue(po.substring(0, po.length() - 1));
						break;
					case 8:
						int y = 0;
						String yu = "";
						row = sheet.getRow(k + 1);
						cell = row.createCell(j);
						while (y < percorsi.getData().get(i).getPois().get(k).getVideos().size()) {
							yu = yu + percorsi.getData().get(i).getPois().get(k).getVideos().get(y).getUrl() + "\n";
							y++;
						}
						cell.setCellValue(yu);
						break;
					case 9:
						int t = 0;
						String ty = "";
						row = sheet.getRow(k + 1);
						cell = row.createCell(j);
						while (t < percorsi.getData().get(i).getPois().get(k).getVideos().size()) {
							ty = ty + percorsi.getData().get(i).getPois().get(k).getVideos().get(t).getUrl() + "\n";
							t++;
						}
						cell.setCellValue(ty);
						break;
					case 10:
						row = sheet.getRow(k + 1);
						cell = row.createCell(j);
						cell.setCellValue(Double.toString(percorsi.getData().get(i).getPois().get(k).getCoordinates().getLat()) + ", "
								+ percorsi.getData().get(i).getPois().get(k).getCoordinates().getLat());
					}
				}
				tmpCell.setCellValue(pois);
			}
			i++;
		}
		/*
		 * try (FileOutputStream fileOut = new FileOutputStream(excelFileName))
		 * { wb.write(fileOut); fileOut.flush(); }
		 */
	}
}