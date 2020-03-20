package views;

import org.json.JSONObject;

import playCanvasViews.DynamicWebPage;

import org.json.JSONArray;
import storage.DatabaseInterface;
import storage.FileStoreInterface;
import web.WebRequest;
import web.WebResponse;

public class ChatBot extends DynamicWebPage {
	
	private JSONObject pageState = new JSONObject(); //everything relating to the current page state, e.g. for the avatar last line spoken 
	
    public ChatBot(DatabaseInterface db, FileStoreInterface fs) {
		super(db, fs);
		// TODO Auto-generated constructor stub
	} 
    
    public boolean process(WebRequest toProcess)
    {
        if(toProcess.path.equalsIgnoreCase("ChatBot"))
        {
            String stringToSendToWebBrowser = "<html>\n" + 
        			"<head>"+
	        			"<link href=\"css/stats.css\" rel=\"stylesheet\" type=\"text/css\">" +
            		"</head>"+
            		"<body>\n"+
            			"<script src=\"js/main.js\"></script>\n"+
        			"</body>\n" +
            		"</html>";

            toProcess.r = new WebResponse( WebResponse.HTTP_OK, WebResponse.MIME_HTML, stringToSendToWebBrowser );
            return true;
        }
        
        else if(toProcess.path.equalsIgnoreCase("ChatBot/Start"))
        { 	  	
        	JSONObject responseData = new JSONObject();
            JSONArray entities = new JSONArray();

            JSONObject entity1 = makeEntity("assest", "texture", 0, 0, 0);
            entity1.put("mmd", true);
            
            entities.put(0, entity1);       
            
            responseData.put("entities", entities);
            
            responseData.put("time", System.currentTimeMillis()); 
                        
            toProcess.r = new WebResponse( WebResponse.HTTP_OK, WebResponse.MIME_PLAINTEXT, responseData.toString() );
            return true;
        }
        
        else if(toProcess.path.equalsIgnoreCase("ChatBot/Update"))
        {  	
            JSONObject responseData = new JSONObject();
            JSONArray entities = new JSONArray();     
            
            JSONObject entity1 = makeEntity("assest", "texture", 0, 0, 0);
            
            entities.put(0, entity1);       
            
            responseData.put("entities", entities);
            
            responseData.put("time", System.currentTimeMillis());             
            toProcess.r = new WebResponse( WebResponse.HTTP_OK, WebResponse.MIME_PLAINTEXT, responseData.toString() );
            return true;
        }
        
        else if(toProcess.path.equalsIgnoreCase("ChatBot/UpdateState"))
        {  	
            //update the state of the server
        	for(String key : toProcess.params.keySet()) {
        		pageState.put(key.toString(), toProcess.params.get(key));
        	}
        	
            toProcess.r = new WebResponse( WebResponse.HTTP_OK, WebResponse.MIME_PLAINTEXT, pageState.toString() );
            return true;
        }
        
        else if(toProcess.path.equalsIgnoreCase("ChatBot/GetState"))
        {  	
            //return the state of the program for the other servers to use
            toProcess.r = new WebResponse( WebResponse.HTTP_OK, WebResponse.MIME_PLAINTEXT, pageState.toString() );
            return true;
        }
         
        return false;
    }
  
    public JSONObject makeEntity(String  model, String name, double x, double y, double z)
    {
    	 JSONObject entity = new JSONObject();
         JSONObject vertexData = new JSONObject(); 
         
         //entity.put("model", model);
         entity.put("name", name);
         entity.put("x", x);
         entity.put("y", y);
         entity.put("z", z);
         entity.put("xRotate", 0);
         entity.put("boundingBoxX", 0.5);
         entity.put("boundingBoxY", 0.5);
         entity.put("boundingBoxZ", 0.5);
         entity.put("vertexData", vertexData);
         
         return entity;
    }
}