package it.smartcommunitylab.percorsi.model;
import java.io.IOException;
import java.io.InputStream;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
 
//Importa file Excel
public class Importer {
   
    private Categories categories;
    private PathData paths;
    
    //Istanzia categories e paths
    public void importData(InputStream inputStream) throws IOException, ImportException
    {
        Workbook workbook = new XSSFWorkbook(inputStream);
        this.categories = readCategories(workbook);
        this.paths = readPaths(workbook);
        inputStream.close();
    }
    
    public Categories getCategories() 
    {
        return categories;
    }
    
    public PathData getPaths() 
    {
        return paths;
    }
    
    //read categories
    private Categories readCategories(Workbook workbook) throws ImportException
    {
        Categories ca=new Categories();
        List<Category> po = new ArrayList() ;
        ca.setCategories(po);
        // read categories
        Sheet firstSheet = workbook.getSheetAt(0);
        Iterator<Row> iterator = firstSheet.iterator();
        iterator.next();
        while (iterator.hasNext()) {
             Row nextRow = iterator.next();
            int i=0;
            Category nodo=new Category();
            Map<String,String> mappa= new HashMap();
            Iterator<Cell> cellIterator = nextRow.cellIterator();
            boolean vuoto=true;
            Cell cell=cellIterator.next();
            while (cellIterator.hasNext())
            {
                if(vuoto==false)
                {
                    cell = cellIterator.next();
                }        
                        switch(i)
                        {
                            case 0:
                              if(cell.getColumnIndex()==0)
                                {
                                    nodo.setId(cell.getStringCellValue());
                                    vuoto=false;
                                }
                               else
                                {
                                    vuoto=true;
                                }
                                i++;
                                break;
                                
                            case 1:
                                if(cell.getColumnIndex()==1)
                                { 
                                     mappa.put("it", cell.getStringCellValue());
                                     cell = cellIterator.next();
                                }
                                if(cell.getColumnIndex()==2)
                                {
                                     mappa.put("en",cell.getStringCellValue());
                                     cell = cellIterator.next();
                                }
                                if(cell.getColumnIndex()==3)
                                {
                                    mappa.put("de", cell.getStringCellValue());
                                    vuoto=false;
                                }
                                else
                                {
                                    vuoto=true;
                                }
                                i++;
                                break;
                            case 2:
                                if(cell.getColumnIndex()==4)
                                {
                                    nodo.setImage(cell.getStringCellValue());
                                    vuoto=false;
                                }
                                 else
                                {
                                    vuoto=true;
                                }
                                i++;
                                break;
                        }//fine switch (i)     
            }//Fine while (cellIterator.hasNext())
            nodo.setName(mappa);
            ca.getCategories().add(nodo);
        }//Fine while(iterator.hasNext())
        return ca;//Return oggetto Categories
    }
    //read paths
    private PathData readPaths(Workbook workbook) throws ImportException {
        
        PathData percorsi=new PathData();
        List<Path> po = new ArrayList() ;
        percorsi.setData(po);
        
        Sheet currentSheet=workbook.getSheetAt(1);
        int foglio=2;
        int i=0;
      
        Iterator<Row> iterator = currentSheet.iterator();
        iterator.next();
        while (iterator.hasNext()) {
            Row nextRow = iterator.next();
            i=0;
            
            Path nodo=new Path();
            List <String> categorie=new ArrayList();
            Iterator<Cell> cellIterator = nextRow.cellIterator();
            Map <String,String>titoli=new HashMap();
            Map <String,String> descrizioni=new HashMap();
            List<Multimedia>video=new ArrayList();
            List<Multimedia>immagini=new ArrayList();
            List<Multimedia>audio=new ArrayList();
            
            
             Cell cell=cellIterator.next();
            boolean vuoto=true;
            while (cellIterator.hasNext()) {
                  if(vuoto==false)
                  {  
                      cell = cellIterator.next();
                  }
                        switch(i)
                        {
                            case 0:
                                if(cell.getColumnIndex()==0)
                                {
                                nodo.setLocalId(cell.getStringCellValue());
                                vuoto=false;
                                }
                                else
                                {
                                    vuoto=true;
                                }
                                i++;
                                break;
                            case 1:
                              
                                
                                
                                if(cell.getColumnIndex()==1)
                                {
                                    int j=0;
                                
                                 while(j<cell.getStringCellValue().length())
                                {
                                    if(cell.getStringCellValue().charAt(j)=='a'
                                    ||cell.getStringCellValue().charAt(j)=='b'
                                    ||cell.getStringCellValue().charAt(j)=='c'
                                    ||cell.getStringCellValue().charAt(j)=='d')
                                {
                                     String s = new StringBuilder().append("").append(cell.getStringCellValue().charAt(j)).toString();
                                     categorie.add(s);
                                }
                                j++;
                                }
                                 vuoto=false;
                                }
                                 else
                                 {
                                     vuoto=true;
                                 }
                                i++;
                                break;
                            case 2:
                              
                                
                                if(cell.getColumnIndex()==2)
                                {
                                titoli.put("it",cell.getStringCellValue() );
                                cell = cellIterator.next();
                                
                                }
                                if(cell.getColumnIndex()==3)
                                {
                                    
                                titoli.put("en",cell.getStringCellValue() );
                                cell = cellIterator.next();
                                
                                }
                                if(cell.getColumnIndex()==4)
                                {
                                titoli.put("de",cell.getStringCellValue() );
                                
                                vuoto=false;
                                }
                                else{vuoto=true;}
                                i++;
                                
                                break;
                            case 3:
                                
                                
                                if(cell.getColumnIndex()==5)
                                {
                                descrizioni.put("it",cell.getStringCellValue());
                                cell = cellIterator.next();
                                
                                }
                                if(cell.getColumnIndex()==6)
                                {
                                descrizioni.put("en",cell.getStringCellValue());                              
                                cell = cellIterator.next();
                                
                                }
                                if(cell.getColumnIndex()==7)
                                {
                                descrizioni.put("de",cell.getStringCellValue());
                                
                                vuoto=false;
                                }
                                else{
                                    vuoto=true;
                                }
                                i++;
                                
                                break;
                                case 4:
                                if(cell.getColumnIndex()==8)
                                {
                                nodo.setLength((int)cell.getNumericCellValue());
                                vuoto=false;
                                }
                                else
                                {
                                    vuoto=true;
                                }
                                i++;
                                
                                break;
                            case 5:
                                if(cell.getColumnIndex()==9)
                                {
                                nodo.setTime((int)cell.getNumericCellValue());
                                vuoto=false;
                                }
                                else
                                {
                                    vuoto=true;
                                }
                                i++;
                                
                                break;
                                
                            case 6:
                                if(cell.getColumnIndex()==10)
                                {
                                    
                                nodo.setDifficulty((int)cell.getNumericCellValue());
                                vuoto=false;
                                }
                                else
                                {
                                    vuoto=true;
                                }
                                
                                i++;
                                
                                break;
                            case 7:
                                if(cell.getColumnIndex()==11)
                                {
                                    //****mancano le strutture dati
                                    vuoto=false;
                                }
                                else
                                {
                                    vuoto=true;
                                }
                                i++;
                                break;
                            case 8:
                                if(cell.getColumnIndex()==12)
                                {
                                    //****mancano le strutture dati
                                    vuoto=false;
                                }
                                else
                                {
                                    vuoto=true;
                                }
                                i++;
                                break;
                            case 9:
                                if(cell.getColumnIndex()==13)
                                {
                                    //****mancano le strutture dati
                                    vuoto=false;
                                }
                                else
                                {
                                    vuoto=true;
                                }
                                i++;
                                break;
                                case 10:
                                if(cell.getColumnIndex()==14)
                                {
                                    //****mancano le strutture dati
                                    vuoto=false;
                                }
                                else
                                {
                                    vuoto=true;
                                }
                                i++;
                                break;
                           
                           case 11:
                               
                               if(cell.getColumnIndex()==15)
                               {
                                int z=0;
                                String[]url=cell.getStringCellValue().split("\n");
                                while(z<url.length)
                                {
                                    Multimedia img=new Multimedia();
                                    img.setUrl(url[z]);
                                    img.setTitle(nodo.getTitle());
                                    immagini.add(img);
                                    z++;
                                }
                                
                                vuoto=false;
                               }
                                else
                               {
                                   vuoto=true;
                               }
                                i++;
                                
                                break;
                            case 12:
                                 if(cell.getColumnIndex()==16){
                                int x=0;
                                
                                String[]urlvideo=cell.getStringCellValue().split("\n");
                                while(x<urlvideo.length)
                                {
                                     Multimedia vid=new Multimedia();
                                     vid.setTitle(nodo.getTitle());
                                     vid.setUrl(urlvideo[x]);
                                     video.add(vid);
                                     x++;
                                }
                                 
                                 vuoto=false;
                                 }
                                 else{vuoto=true;}
                                 i++;
                               
                               break;
                            case 13:
                                 if(cell.getColumnIndex()==17){
                                int c=0;
                                
                                String[]urlaudio=cell.getStringCellValue().split("\n");
                                while(c<urlaudio.length)
                                {
                                    Multimedia aud=new Multimedia();
                                    aud.setTitle(nodo.getTitle());
                                    aud.setUrl(urlaudio[c]);
                                    audio.add(aud);
                                    c++;
                                }
                                
                                vuoto=false;
                                 }
                                 else
                                 {
                                     vuoto=true;
                                 }
                                 i++;
                                
                                break;
                                //*******************
                            case 14:
                                 if(cell.getColumnIndex()==18)
                                 {
                                nodo.setShape(cell.getStringCellValue());
                                vuoto=false;
                                 }
                                 else
                                 {
                                     vuoto=true;
                                 }
                                 i++;
                                
                                break;
                            case 15:
                                if(cell.getColumnIndex()==19)
                                {
                                { readPOI(foglio, nodo, workbook);}
                                foglio++;
                                i++;
                                vuoto=false;
                                }
                                else
                                {
                                    vuoto=true;
                                }
                                i++;
                                break;  
                        }//fine switch (i)
            }//Fine while (cellIterator.hasNext())
            nodo.setCategories(categorie);
            nodo.setTitle(titoli);
            nodo.setDescription(descrizioni);
            nodo.setImages(immagini);
            nodo.setVideos(video);
            nodo.setAudios(audio);
            po.add(nodo);
    }//Fine while (iterator.hasNext())
        return percorsi;
}
    //read POI
    private void readPOI(int sheet,Path nodo,Workbook workbook)
    {
        List<POI> lista=new ArrayList();
        Sheet currentSheet = workbook.getSheetAt(sheet);
        Iterator<Row> iterator = currentSheet.iterator();
        iterator.next();
        
         while (iterator.hasNext())
         {
            POI nodopoi=new POI();
            Row nextRow = iterator.next();
            int i=0;
            Map <String,String>titoli=new HashMap();
            Map <String,String> descrizioni=new HashMap();
            List<Multimedia>immagini=new ArrayList();
            List<Multimedia>video=new ArrayList();
            List<Multimedia>audio=new ArrayList();
            Location coordinate=new Location();
            Iterator<Cell> cellIterator = nextRow.cellIterator();
            
            while (cellIterator.hasNext())
            {
                Cell cell = cellIterator.next();
                        switch(i)
                        {
                            case 0:
                                if(cell.getColumnIndex()==0)
                                {
                                   nodopoi.setLocalId(cell.getStringCellValue());
                                }
                                i++;
                                break;
                                
                            case 1:
                                if(cell.getColumnIndex()==1)
                                {
                                    titoli.put("it",cell.getStringCellValue() );
                                cell = cellIterator.next();
                                }
                                if(cell.getColumnIndex()==2)
                                {
                                    titoli.put("en",cell.getStringCellValue() );
                                cell = cellIterator.next();
                                }
                                if(cell.getColumnIndex()==3)
                                {
                                    titoli.put("de",cell.getStringCellValue() );
                                }
                                i++;
                                break;
                                
                            case 2:
                                if(cell.getColumnIndex()==4)
                                {
                                    descrizioni.put("it",cell.getStringCellValue());
                                    cell = cellIterator.next();
                                }
                                if(cell.getColumnIndex()==5)
                                {
                                    descrizioni.put("en",cell.getStringCellValue());                              
                                    cell = cellIterator.next();
                                }
                                if(cell.getColumnIndex()==6)
                                {
                                    descrizioni.put("de",cell.getStringCellValue());
                                }
                                i++;
                                break;
                                
                            case 3:
                                //cell=cell.getRow().getCell(7);
                                if(cell.getColumnIndex()==7)
                                {
                                    int z=0;
                                    String[]url=cell.getStringCellValue().split("\n");
                                 
                                    while(z<url.length)
                                    {
                                    
                                        Multimedia img=new Multimedia();
                                        img.setUrl(url[z]);
                                        img.setTitle(nodopoi.getTitle());
                                        immagini.add(img);
                                        z++;
                                    }
                                }
                                i++;
                                break;
                                
                            case 4:   
                                switch(cell.getColumnIndex())
                                        {
                                    case 8:
                                        int x=0;
                                        String[]urlvideo=cell.getStringCellValue().split("(\n)");

                                        while(x<urlvideo.length)
                                        {  
                                            Multimedia vid=new Multimedia();
                                            vid.setUrl(urlvideo[x]);
                                            vid.setTitle(nodopoi.getTitle());
                                            video.add(vid);
                                            x++;
                                        }
                                       break;
                                    
                                    case 9:
                                        int c=0;

                                        String[]urlaudio=cell.getStringCellValue().split("\n");

                                        while(c<urlaudio.length)
                                        {
                                            Multimedia aud=new Multimedia();
                                            aud.setTitle(nodopoi.getTitle());
                                            aud.setUrl(urlaudio[c]);
                                            audio.add(aud);
                                            c++;
                                        }
                                break;
                                
                                    case 10:
                                        try
                                        {                      
                                            String[] parts = cell.getStringCellValue().split(",");
                                            coordinate.setLat(Double.parseDouble(parts[0]));
                                            coordinate.setLng(Double.parseDouble(parts[1]));
                                        }
                                        catch(Exception p){}      
                                break;
                                }//Fine switch (cell.getColumnIndex());
                                 i++;
                               break;
                               
                            case 5:
                                if(cell.getColumnIndex()==9)
                                {  
                                    int c=0;
                                    String[]urlaudio=cell.getStringCellValue().split("\n");
                                
                                    while(c<urlaudio.length)
                                    {
                                        Multimedia aud=new Multimedia();
                                        aud.setTitle(nodopoi.getTitle());
                                        aud.setUrl(urlaudio[c]);
                                        audio.add(aud);
                                        c++;
                                    }
                                }
                                i++;
                                break;
                                
                            case 6: 
                                if(cell.getColumnIndex()==10)
                                {                      
                                    String[] parts = cell.getStringCellValue().split(",");
                                    coordinate.setLat(Double.parseDouble(parts[0]));
                                    coordinate.setLng(Double.parseDouble(parts[1]));
                                }
                                i++;
                                break;
                        }//fine switch(i)
            }//fine while(cellIterator.hasNext))
            nodopoi.setTitle(titoli);
            nodopoi.setDescription(descrizioni);
            nodopoi.setImages(immagini);
            nodopoi.setAudios(audio);
            nodopoi.setVideos(video);
            nodopoi.setCoordinates(coordinate);
            lista.add(nodopoi);
            nodo.setPois(lista);
         }//fine while(iterator.hasNext());
    }//Fine readPOI
}