var path = require('path');
var fs = require('fs');

module.exports = function(conf) {
	
	var imgDir = path.normalize(conf.imgDir || 'comic-data/images');
	var dataDir = path.normalize(conf.dataDir || 'comic-data/comics');
	var pinDir = path.normalize(conf.pinDir || 'comic-data/pins');
	
	var cdata = {};
	
	function prevComic(d, cb) {
		
		//TODO: given date d, load the previous comic from the dataDir
		cb(null, null);
		
	}
	
	function nextComic(d, cb) {

		//TODO: given date d, load the next comic from the dataDir
		cb(null, null);
		
	}

	// read up the data from all the files in dataDir
	var files = fs.readdirSync(dataDir);
	for (var i = 0; i < files.length; i++) {
		var fn = dataDir + path.sep + files[i];
		var data = fs.readFileSync(dataDir + path.sep + files[i]);
		var obj = JSON.parse(data);
		var id = path.basename(fn, path.extname(files[i]));
		cdata[id] = obj;
	}

	return {
		
		loadCurrent: function (cb) {
			
			//TODO: load the current comic from the dataDir
			cb(null, null);
			
		},

		loadById: function (id, cb) {

			cb(null, cdata[id]);

		},
		
		loadPinImage: function(id, cb) {

			//TODO: read data from pinDir
			cb(null, null);

		},

		storePinImage: function(id, data, cb) {

			fs.writeFile(imgDir + "/" + id + ".png", data, function(err) {
				if (err) {
					cb(err);
				} else {
					cb(null);
				}
			});

		},

		loadImage: function(name, cb) {

			//TODO: maybe figure this out from path.extname, but really I'm trying
			//      to use all SVG
			var ct = 'image/svg+xml';
			
			fs.readFile(imgDir + "/" + name, function(err, data) {
				if (err) {
					cb(err);
				} else {
					cb(null, {
						contentType: ct,
						buffer: data
					});
				}
			});

		},
		
		storeImage: function(fn, data, type, cb) {
			
			// note: ignoring type
			
			fs.writeFile(imgDir + "/" + name, data, function(err) {
				if (err) {
					cb(err);
				} else {
					// always sending 0 as the image id, because images
					// don't have ids anyway and it's not used.
					//TODO: fix that
					cb(null, 0);
				}
			});
			
		},
		
		storeData: function(data, idOrCb, cb) {
			
			var id = typeof(idOrCb) === 'function' ? null : idOrCb;
			var callback = typeof(idOrCb) === 'function' ? idOrCb : cb;
			
			var json = JSON.stringify(data);

			if (!id) {
				// new data, need to make up a new id
				var max = 0;
				for (var idx in cdata){
					if (Number(idx) > max) {
						max = Number(idx);
					}
				}
				id = max + 1;
			}
			
			id = Number(id);
			
			cdata[id] = data;
			
			var fn = dataDir + path.sep + id + '.json';
			
			fs.writeFile(fn, json, function(err) {
				if (err){
					cb(err);
				} else {
					cb(null, id);
				}
			});
			
		},
		
		listImages: function(cb) {
			
			//TODO: return a list of the imgDir contents in this format:
			//      {
			//        filename: <file name>,
			//        type: 'image/svg+xml'
			//      }
			
			cb(null, []);
			
		},
		
		listComics: function(cb) {
			
			//TODO: return something
			cb(null, []);
			
		}

	};
	
};