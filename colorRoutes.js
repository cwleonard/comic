

module.exports = function(conf) {
	
	var frogColors = {
			actual: {
				orange: 0,
				green: 0,
				total: function() {
					return this.orange + this.green;
				}
			},
			votes: {
				orange: 0,
				green: 0,
				tartan: 0,
				total: function() {
					return this.orange + this.green + this.tartan;
				}
			}
		};

	
	// middleware for resources that should not be cached
	function noCache(req, res, next) {
		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		res.header('Expires', '-1');
		res.header('Pragma', 'no-cache');
		next();
	}

	if (conf.express) {
		
		var myRouter = conf.express.Router();

		
		
		myRouter.post('/vote/:c', function(req, res, next) {

			if (req.params.c === 'green') {
				frogColors.votes.green++;
			} else if (req.params.c === 'orange') {
				frogColors.votes.orange++;
			} else if (req.params.c === 'tartan') {
				frogColors.votes.tartan++;
			}
			res.sendStatus(200);
			
		});

		myRouter.get('/shown', noCache, function(req, res, next) {

			var dispColor = ( Math.random() < 0.5 ? 'green' : 'orange' );
			
			if (dispColor === 'green') {
				frogColors.actual.green++;
			} else if (dispColor === 'orange') {
				frogColors.actual.orange++;
			}

			res.status(200).send({
				color: dispColor
			});
			
		});

		myRouter.get('/votes', function(req, res, next) {
			
			var total = frogColors.votes.total();
			res.status(200).send((function(t) {
				
				var ret = {
					orange: "0%",
					green: "0%",
					tartan: "0%"
				};
				if (t > 0) {
					ret.orange = Number((frogColors.votes.orange / t) * 100).toFixed(1) + "%";
					ret.green = Number((frogColors.votes.green / t) * 100).toFixed(1) + "%";
					ret.tartan = Number((frogColors.votes.tartan / t) * 100).toFixed(1) + "%";
				}
				return ret;
				
			}(total)));
			
		});

		myRouter.get('/actuals', function(req, res, next) {
			
			var total = frogColors.actual.total();
			res.status(200).send((function(t) {

				var ret = {
					orange: "0%",
					green: "0%"
				};
				if (t > 0) {
					ret.orange = Number((frogColors.actual.orange / t) * 100).toFixed(1) + "%";
					ret.green = Number((frogColors.actual.green / t) * 100).toFixed(1) + "%";
				}
				return ret;
				
			}(total)));
			
		});
		
		return myRouter;
		
	} else {
		
		return null;
		
	}
	
};