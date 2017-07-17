var request = require('request');

module.exports = function(c) {
	
	if (c.sio) {

	    var io = c.sio;
	    
	    io.on('connection', function (socket) {

            //io.emit("musical-play");
	        console.log("someone connected to the musical");

	    });

	    var emitter = function() {
	        io.emit("musical-play");
	        setTimeout(emitter, 1 * 60 * 1000);
	    };
	    
	    setTimeout(emitter, 1 * 60 * 1000);
	    
		var myRouter = c.express.Router();

		return myRouter;
		
	} else {
		
		return null;
		
	}
	
};