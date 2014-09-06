var path = require('path');
var fs = require('fs');

module.exports = function(conf) {
	
	var imgDir = path.normalize(conf.imgDir || 'comic-data/images');
	var dataDir = path.normalize(conf.dataDir || 'comic-data/comics');
	var pinDir = path.normalize(conf.pinDir || 'comic-data/pins');
	
	var dateMap = [];
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
		obj.id = id;
		cdata[id] = obj;
		dateMap.push({
			d: obj.pubDate,
			id: id
		});
	}
	
	// sort by publish date
	dateMap.sort(function(a, b) {
		var da = new Date(a.d);
		var db = new Date(b.d);
		return (da < db ? -1 : (da === db ? 0 : 1));
	});
	
	console.log(dateMap);
	

	return {
		
		loadCurrent: function (cb) {
			
			//TODO: load the current comic from the dataDir
			var c = cdata[dateMap[dateMap.length-1].id];
			c.prevDate = 21;
			cb(null, c);
			
		},

		loadById: function (id, cb) {

			cb(null, cdata[id]);

		},
		
		loadPinImage: function(id, cb) {

			var fn = pinDir + path.sep + id + ".png";
			fs.readFile(fn, function(err, data) {
				if (err) {
					cb(err);
				} else {
					cb(null, data);
				}
			});

		},

		storePinImage: function(id, data, cb) {

			var fn = pinDir + path.sep + id + ".png";
			fs.writeFile(fn, data, function(err) {
				if (err) {
					cb(err);
				} else {
					cb(null);
				}
			});

		},
		
		storeFBImage: function(id, data, cb) {
			cb(null);
		},

		loadImage: function(name, cb) {

			//TODO: maybe figure this out from path.extname, but really I'm trying
			//      to use all SVG
			var ct = 'image/svg+xml';
			
			fs.readFile(imgDir + path.sep + name, function(err, data) {
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
			
			fs.writeFile(imgDir + path.sep + name, data, function(err) {
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
					callback(err);
				} else {
					callback(null, id);
				}
			});
			
		},
		
		listImages: function(cb) {
			
			fs.readdir(dataDir, function(err, files) {
				if (err) {
					cb(err);
				} else {
					var imgs = [];
					for (var i = 0; i < files.length; i++) {
						imgs.push({
							filename: files[i],
							type: 'image/svg+xml'
						});
					}
					cb(null, imgs);
				}
			});
			
		},
		
		listComics: function(cb) {
			
			var data = new Array();
			for (var x in cdata) {
				var c = cdata[x];
				var t = (c.title ? c.title : 'no title');
				data.push({
					id: x,
					published: c.pubDate,
					title: t
				});
			}
			cb(null, data);
			
		}

	};
	
};