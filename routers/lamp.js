var request = require('request');

module.exports = function(c) {
	
    var lampOn = true;
    
	if (c.sio) {

	    var io = c.sio;
	    
	    io.on('connection', function (socket) {

	        socket.on("lamp-toggle", function(data) {
	            
	            if (lampOn) {
	                io.emit("lamp-off");
	            } else {
	                io.emit("lamp-on");
	            }
	            
	            lampOn = !lampOn;
	            
	        });

	    });
	    
		var myRouter = c.express.Router();

		myRouter.get('/state', function(req, res, next) {

		    res.send({
		        on: lampOn
		    });

		});
		
		return myRouter;
		
	} else {
		
		return null;
		
	}
	
};