var multiparty = require('multiparty');

module.exports = function(conf) {
	
	if (conf.express) {
		
		var myRouter = conf.express.Router();
		
		myRouter.get('/', function(req, res, next) {
			
			conf.dataSource.listImages(function (err, data) {
				if (err) {
					next(err);
				} else if (data) {
					res.setHeader('Content-Type', 'application/json');
					res.send(data);
				} else {
					next(new Error('missing image data!')); // this shouldn't happen
				}
			});
			
		});
		
		myRouter.post('/', conf.auth, function(req, res, next) {
			
			var uploadName = '';
			var uploadType = '';
			var chunks = [];
			var totalLength = 0;

			var form = new multiparty.Form();
			
			form.on('error', function(err) {
				res.send(JSON.stringify({
					success: false,
					error: err
				}));
			});
			
			form.on('close', function() {
				
				var b = Buffer.concat(chunks, totalLength);
				console.log('storing file %s (%d bytes)', uploadName, b.length);
				conf.dataSource.storeImage(uploadName, b, uploadType, function(err, info) {
					if (err) {
						res.send(JSON.stringify({
							success: false,
							error: err
						}));
					} else {
						res.send(JSON.stringify({
							success: true
						}));
					}
				});

			});

			form.on('part', function(part) {

				part.on('data', function(chunk) {
					chunks.push(chunk);
					totalLength += chunk.length;
				});
				part.on('end', function() {
					uploadName = part.filename;
					uploadType = part.headers['content-type'];
				});

			});
			
			form.parse(req);

		});

		myRouter.get('/:img', function(req, res, next) {
			
			conf.dataSource.loadImage(req.params.img, function (err, data) {
				if (err) {
					next(err);
				} else if (data) {
					res.setHeader('Content-Type', data.contentType);
					res.send(data.buffer);
				} else {
					res.sendStatus(404); // don't use the full-page 404 for missing images
				}
			});
			
		});

		return myRouter;
		
	} else {
		
		return null;
		
	}
	
};