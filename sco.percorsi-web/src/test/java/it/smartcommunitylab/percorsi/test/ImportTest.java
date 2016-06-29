package it.smartcommunitylab.percorsi.test;
import it.smartcommunitylab.percorsi.model.ImportException;
import it.smartcommunitylab.percorsi.model.Importer;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import static org.junit.Assert.assertFalse;

import static org.junit.Assert.assertTrue;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author rafael
 */
public class ImportTest {
    String excelFilePath ="DatiPAthRivaExample.xlsx";
    File fileExcel=new File(excelFilePath);
    
    
    @org.junit.Test
    public void testCategories() throws FileNotFoundException, IOException, ImportException {
        int ascii=97;
      FileInputStream inputStream = new FileInputStream(fileExcel);
        assertTrue("File non letto. Verificare il percorso!",fileExcel.exists());
        
        Importer importer=new Importer();
        importer.importData(inputStream);
        
        assertTrue("La lista di cattegorie é troppo lunga!",importer.getCategories().getCategories().size()<5);
        assertTrue("La lista di PATH é troppo lunga",importer.getPaths().getData().size()<22);
        for(int i=0;i<4;i++)
        {
        assertTrue("Contenuto non valido",importer.getCategories().getCategories().get(i).getId().charAt(0)==(char)ascii);
        assertFalse("Nessun contenuto disponibile in nessuna lingua",importer.getCategories().getCategories().get(i).getName().isEmpty());
        assertTrue("Link non disponibile",importer.getCategories().getCategories().get(i).getImage()!=null);
        
        ascii++;
                }
        for(int i=0;i<21;i++)
        {
            assertFalse("Categorie non disponibili.",importer.getPaths().getData().get(i).getCategories().isEmpty());
            assertFalse("Titolo in italiano non disponibile. Inserire un titolo!",importer.getPaths().getData().get(i).getTitle().get("it").isEmpty());
            assertFalse("Titolo in inglese non disponibile. Inserire un titolo!",importer.getPaths().getData().get(i).getTitle().get("en").isEmpty());
            assertFalse("Titolo in tedesco non disponibile. Inserire un titolo!",importer.getPaths().getData().get(i).getTitle().get("de").isEmpty());
            
            assertFalse("Descrizione in italiano non disponibile.Inserire una descrizione!",importer.getPaths().getData().get(i).getDescription().get("it").isEmpty());
            assertFalse("Descrizione in inglese non disponibile.Inserire una descrizione!",importer.getPaths().getData().get(i).getDescription().get("en").isEmpty());
            assertFalse("Descrizione in tedesco non disponibile.Inserire una descrizione!",importer.getPaths().getData().get(i).getDescription().get("de").isEmpty());
            
            assertTrue("Lunghezza non disponibile. Inserire la lunghezza del percorso",importer.getPaths().getData().get(i).getLength()>0);
            assertTrue("Tempo non disponibile. Inserire il tempo di percorrenza",importer.getPaths().getData().get(i).getTime()>0);
            assertTrue("Difficolta non disponibile. Inserire la difficoltá del percorso",importer.getPaths().getData().get(i).getDifficulty()>0);
            
            assertFalse("URL immagine non esiste!",importer.getPaths().getData().get(i).getImages().get(0).getUrl().isEmpty());
            assertFalse("Nessun POI disponibile",importer.getPaths().getData().get(i).getPois().isEmpty());
            //**********
            for(int j=0;j<importer.getPaths().getData().get(i).getPois().size();j++)
            {
                assertFalse("IDpoi non disponibile",importer.getPaths().getData().get(i).getPois().get(j).getLocalId().isEmpty());

                assertFalse("Titolo POI in italiano non disponibile",importer.getPaths().getData().get(i).getPois().get(j).getTitle().get("it").isEmpty());
                assertFalse("Titolo POI in inglese non disponibile",importer.getPaths().getData().get(i).getPois().get(j).getTitle().get("en").isEmpty());
                assertFalse("Titolo POI in tedesco non disponibile",importer.getPaths().getData().get(i).getPois().get(j).getTitle().get("de").isEmpty());

                assertFalse("Descrizione POI in italiano non disponibile", importer.getPaths().getData().get(i).getPois().get(j).getDescription().get("it").isEmpty());
                assertFalse("Descrizione POI in inglese non disponibile", importer.getPaths().getData().get(i).getPois().get(j).getDescription().get("en").isEmpty());
                assertFalse("Descrizione POI in tedesco non disponibile", importer.getPaths().getData().get(i).getPois().get(j).getDescription().get("de").isEmpty());

                assertFalse("URL immagini POI non disponibili",importer.getPaths().getData().get(i).getPois().get(j).getImages().get(0).getUrl().isEmpty());
                assertTrue("Coordinate POI non disponibili",importer.getPaths().getData().get(i).getPois().get(j).getCoordinates().getLat()>0
                        & importer.getPaths().getData().get(i).getPois().get(j).getCoordinates().getLat()>0);
             }
        }
    }
}
