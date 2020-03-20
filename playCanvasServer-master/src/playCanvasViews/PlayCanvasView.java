package playCanvasViews;

import org.json.JSONObject;

import java.util.HashMap;
import org.json.JSONArray;
import storage.DatabaseInterface;
import storage.FileStoreInterface;
import web.WebRequest;
import web.WebResponse;

public class PlayCanvasView extends DynamicWebPage {
	
	private double offset = 0;
	
    public PlayCanvasView(DatabaseInterface db, FileStoreInterface fs) {
		super(db, fs);
		// TODO Auto-generated constructor stub
	} 
    
    public boolean process(WebRequest toProcess)
    {
        if(toProcess.path.equalsIgnoreCase("playCanvas"))
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
        
        else if(toProcess.path.equalsIgnoreCase("/Start"))
        { 	  	
            JSONObject responseData = new JSONObject();
            JSONArray entities = new JSONArray();
            
           JSONObject entity1 = new JSONObject();
            entity1.put("model", "box");
            entity1.put("x", 0);
            entity1.put("y", 0);
            entity1.put("z", 0);
            entity1.put("boundingBoxX", 0.5);
            entity1.put("boundingBoxY", 0.5);
            entity1.put("boundingBoxZ", 0.5);
            
            entities.put(0, entity1);            
            
            responseData.put("entities", entities);
                    
            responseData.put("time", System.currentTimeMillis()); 
                        
            toProcess.r = new WebResponse( WebResponse.HTTP_OK, WebResponse.MIME_PLAINTEXT, responseData.toString() );
            return true;
        }
        
        else if(toProcess.path.equalsIgnoreCase("/Update"))
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