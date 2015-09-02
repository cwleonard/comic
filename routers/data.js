var imageMaker = require('./staticImage')({
	dir: '/temp'
});

module.exports = function(conf) {
	
	// middleware for resources that should not be cached
	function noCache(req, res, next) {
		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		res.header('Expires', '-1');
		res.header('Pragma', 'no-cache');
		next();
	}

	// creates static images for pinterest and facebook
	function createStaticImages(id, imgGen, storageObj, cb) {
		
		// store the static image for Pinterest
		imgGen.createImage(id, storageObj.storePinImage, function(err) {
			if (err) {
				cb(err);
			} else {
				// now store a static image of one cell for Facebook
				imgGen.createImage(id, 1, storageObj.storeFBImage, function(err) {
					if (err) {
						cb(err);
					} else {
						cb();
					}
				});
			}
		});
		
	}

	if (conf.express) {
		
		var myRouter = conf.express.Router();

		myRouter.get('/:n', conf.auth, noCache, function(req, res, next) {

			conf.dataSource.loadById(req.params.n, function (err, data) {
				if (err) {
					next(err);
				} else if (data) {
					res.setHeader('Content-Type', 'application/json');
					res.send(data);
				} else {
					res.send(404); // don't use the full-page 404 for missing data
				}
			});
			
		});
		
		myRouter.post('/', conf.auth, function(req, res, next) {
			
			conf.dataSource.storeData(req.body, function(err, newid) {
				if (err) {
					next(err);
				} else {
					res.setHeader('Content-Type', 'application/json');
					res.send({
						id: newid
					});
					createStaticImages(newid, imageMaker, conf.dataSource, function(err) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
			
		});
		
		myRouter.put('/:n', conf.auth, function(req, res, next) {
			
			var i = isNaN(req.params.n) ? null : Number(req.params.n);
			conf.dataSource.storeData(req.body, i, function(err, newid) {
				if (err) {
					next(err);
				} else {
					res.setHeader('Content-Type', 'application/json');
					res.send({
						id: newid
					});
					createStaticImages(newid, imageMaker, conf.dataSource, function(err) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
			
		});
		
		
		return myRouter;
		
	} else {
		
		return null;
		
	}
	
};