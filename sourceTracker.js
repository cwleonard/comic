
module.exports = function(conf) {
	
	var tracker = function(req, res, next) {
			
	    var src = null;
	    
	    if (req.query.s) {
	        
	        src = req.query.s;
	        res.cookie("s", src, { maxAge: 2629746000 });
	        
	    } else if (req.cookies.s) {
	        
	        src = req.cookies.s;
	        
	    }
	    
	    if (src !== null) {
	        req["click-source"] = src;
	    }

	    next();
			
	};
	
	return function(req, res, next) {
		tracker(req, res, next);
	};
	
};
