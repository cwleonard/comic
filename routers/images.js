var svgo = require('svgo');
var fs = require('fs');
var xmldom = require("xmldom");
var multiparty = require('multiparty');
var imageMaker = require('../staticImage')({
	dir: '/temp'
});

var DOMParser = xmldom.DOMParser;
var XMLSerializer = xmldom.XMLSerializer;

module.exports = function(conf) {
	
	if (conf.express) {
		
	    var pixel = fs.readFileSync("public/simg/1px.png");
	    
		var myRouter = conf.express.Router();
		
		myRouter.get('/', function(req, res, next) {
			
			conf.dataSource.listImages()
			.then(function(data) {
				res.header('Content-Type', 'application/json');
				res.send(data);
			}, function(error) {
				next(error.error);
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
				
				var optimizer = new svgo();
				optimizer.optimize(b.toString('utf8'), function(result) {
					
					var o = result.data;
					
					var svgDoc = new DOMParser().parseFromString(o);
					var root = svgDoc.documentElement;
					
					var svgWidth = root.getAttribute("width");
					var svgHeight = root.getAttribute("height");
					var svgBox = root.getAttribute("viewBox");

					if (svgBox === "") {
						root.setAttribute("viewBox", "0 0 " + svgWidth + " " + svgHeight);
						o = new XMLSerializer().serializeToString(svgDoc);
					}

					console.log('storing file %s (%d bytes)', uploadName, o.length);
					conf.dataSource.storeImage(uploadName, o, uploadType, function(err, info) {
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
					res.setHeader('Cache-Control', 'max-age=86400');
					res.send(data.buffer);
				} else {
					res.sendStatus(404); // don't use the full-page 404 for missing images
				}
			});
			
		});

	      myRouter.get('/v/:n', function(req, res, next) {
	            
	          res.setHeader('Content-Type', 'image/png');
              res.setHeader('Cache-Control', 'max-age=60');
	          res.send(pixel);
	            
	        });

		myRouter.get('/cell/:id/:cell', conf.auth, function(req, res, next) {

			var imageData = null;
			imageMaker.createImage(req.params.id, req.params.cell, function(id, data, cb) {
				imageData = data;
				cb(); // we "stored" it ok
			}, function(err) {
				res.setHeader('Content-Type', 'image/png');
				res.setHeader('Content-Disposition', 'attachment; filename="amphibian-comic-cell-' + req.params.id + '.' + req.params.cell + '.png"');
				res.send(imageData);
			});

		});

		return myRouter;
		
	} else {
		
		return null;
		
	}
	
};