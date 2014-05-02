var express = require('express');
var fs = require('fs');
var compress = require('compression')();
var cdata = require('./data');

var app = express();

var dbconf = JSON.parse(fs.readFileSync('data/dbconf.json', { encoding: 'utf-8' }));
var cfact = cdata(dbconf);

app.set('view engine', 'jade');

// logging comes first
app.use(function(req, res, next) {
	console.log('%s %s', req.method, req.url);
	next();
});

app.use(compress);

// if nothing explicit requested, send most recent comic
app.get('/', function(req, res, next) {
	
	cfact.loadCurrent(function (err, data) {
		if (err) {
			next(err);
		} else if (data) {
			res.render('comicpage', data);
		} else {
			next(); // no comic found
		}
	});
	
});

// load individual comic pages by id
app.get('/:n', function(req, res, next) {

	cfact.loadById(req.params.n, function (err, data) {
		if (err) {
			next(err);
		} else if (data) {
			res.render('comicpage', data);
		} else {
			next(); // no comic found
		}
	});
	
});

//get just the comic HTML by id
app.get('/chtml/:n', function(req, res, next) {

	cfact.loadById(req.params.n, function (err, data) {
		if (err) {
			next(err);
		} else if (data) {
			res.render('comic', data, function(err, str) {
				if (err) {
					next(err);
				} else {
					res.send(str);
				}
			});
		} else {
			next(); // no comic found
		}
	});
	
});

app.get('/data/:n', function(req, res, next) {

	cfact.loadById(req.params.n, function (err, data) {
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

app.get('/editor', function(req, res, next) {
	
	res.render('editpage', {});
	
});


app.post('/data', function(req, res, next) {

	// stream in the posted data
	var data = '';
	req.setEncoding('utf8');
	req.on('data', function(chunk) {
		data += chunk;
	});

	req.on('end', function() {
		// we have read the entire POST body
		cfact.storeData(data, function(err, newid) {
			if (err) {
				next(err);
			} else {
				res.setHeader('Content-Type', 'text/plain');
				res.send('data id: ' + newid);
			}
		});

	});

});

app.get('/images', function(req, res, next) {
	
	cfact.listImages(function (err, data) {
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

app.get('/images/:img', function(req, res, next) {
	
	cfact.loadImage(req.params.img, function (err, data) {
		if (err) {
			next(err);
		} else if (data) {
			res.setHeader('Content-Type', data.contentType);
			res.send(data.buffer);
		} else {
			res.send(404); // don't use the full-page 404 for missing images
		}
	});
	
});

app.use(express.static('public'));

// handle 404
app.use(function(req, res, next){
	fs.readFile('data/404.json', { encoding: 'utf-8' }, function(err, data) {
		if (err) {
			next(err);
		} else {
			res.render('comicpage', JSON.parse(data), function(err, str) {
				if (err) {
					next(err);
				} else {
					res.send(404, str);
				}
			});
		}
	});
});

// handle 500
app.use(function(err, req, res, next) {
	console.error(err.stack);
	fs.readFile('data/500.json', { encoding: 'utf-8' }, function(err, data) {
		if (err) {
			console.error(err.stack);
		} else {
			res.render('comicpage', JSON.parse(data), function(err, str) {
				if (err) {
					console.error(err.stack);
				} else {
					res.send(500, str);
				}
			});
		}
	});
});

var server = app.listen(3000, function() {
	console.log('listening on port %d', server.address().port);
});
