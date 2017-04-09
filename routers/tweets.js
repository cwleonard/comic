var request = require('request');

module.exports = function(c) {
	
    var val = 72;
    
	if (c.sio && c.twitterStream) {

	    var io = c.sio;
	    
	    var ts = c.twitterStream;

	    ts.on('data', function(event) {
	        
	        if (event && event.text) {
	            
	            var ttxt = event.text;
	            var foundCommand = ttxt.match(/[@frogcomics].*temperature\s*(\d+)/i);
	            if (foundCommand) {
	                var t = foundCommand[1];
	                if (!isNaN(t)) {
	                    val = Number(t);
	                    console.log("found temperature control: " + val);
	                    io.emit({
	                        temp: val
	                    });
	                }
	            }
	            
	        }
	        
	    });
	    
	    io.on('connection', function (socket) {

	        console.log("connection!");

	    });
	    
		var myRouter = c.express.Router();

		myRouter.get('/temp', function(req, res, next) {

		    res.send({
		        temp: val
		    });

		});
		
		return myRouter;
		
	} else {
		
		return null;
		
	}
	
};