package playCanvasViews;

import org.json.JSONObject;

import java.util.HashMap;

import org.json.JSONArray;
import storage.DatabaseInterface;
import storage.FileStoreInterface;
import web.WebRequest;
import web.WebResponse;

public class virtualNI extends DynamicWebPage {
	
	private double offset = 0;
	
    public virtualNI(DatabaseInterface db, FileStoreInterface fs) {
		super(db, fs);
		// TODO Auto-generated constructor stub
	} 
    
    public boolean process(WebRequest toProcess)
    {
        if(toProcess.path.equalsIgnoreCase("virtualni"))
        {
            String stringToSendToWebBrowser = "<html>\n" + 
        			"<head>"+
        				"<script src=\"./js/playcanvas-latest.js\"></script>\n" + 
            			"<script src=\"./js/JavaEntity.js\"></script>\n" + 
            			"<script src=\"./js/FirstPersonCam.js\"></script>\n" + 
                        "<link href=\"css/stats.css\" rel=\"stylesheet\" type=\"text/css\">" +
            		"</head>"+
            		"<body>\n" + 
                    "<canvas id=\"application-canvas\"></canvas>\n" + 
            		"<script src=\"js/playCanvas.js\"></script>\n"+
            		"  </body>\n" + 
            		"</html>";

            toProcess.r = new WebResponse( WebResponse.HTTP_OK, WebResponse.MIME_HTML, stringToSendToWebBrowser );
            return true;
        }
        
        else if(toProcess.path.equalsIgnoreCase("virtualni/Start"))
        { 	  	
            JSONObject responseData = new JSONObject();
            JSONArray entities = new JSONArray();
            int i = 0;
            double spacing = 3;
            
    		JSONObject entity = new JSONObject();
    		entity.put("name", "ground");
    		entity.put("model", "plane");
        	entity.put("xScale", 200);
        	entity.put("zScale", 200);
            entity.put("boundingBoxX", 100);
            entity.put("boundingBoxY", 0.5);
            entity.put("boundingBoxZ", 100);
            entity.put("x", 0);
        	entity.put("z", -25);
        	
            entities.put(i, entity);       	
            i++;
            
            for(int x = 0;x<20;x++)
            {
            	for(int y = 0;y>-20;y--)
                {
            		double height = Math.random() * 3;
            		
            		JSONObject entity1 = new JSONObject();
                    entity1.put("model", "box");
                    entity1.put("x", x * spacing);
                    entity1.put("z", y * spacing);
                    entity1.put("y", height/2);   
                    entity1.put("yScale", height);
                    
                    entities.put(i, entity1);       	
                    i++;
                }
            }   	
                
            responseData.put("entities", entities);
                    
            responseData.put("time", System.currentTimeMillis()); 
                                    
            toProcess.r = new WebResponse( WebResponse.HTTP_OK, WebResponse.MIME_PLAINTEXT, responseData.toString() );
            return true;
        }
        
        else if(toProcess.path.equalsIgnoreCase("virtualni/Update"))
        {  	
        	JSONObject responseData = new JSONObject();
            JSONArray entities = new JSONArray();
            
            responseData.put("entities", entities);
                    
            responseData.put("time", System.currentTimeMillis()); 
                        
            toProcess.r = new WebResponse( WebResponse.HTTP_OK, WebResponse.MIME_PLAINTEXT, responseData.toString() );
            return true;
        }
         
        return false;
    }
    
}