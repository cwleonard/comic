var express = require('express');
var fs = require('fs');
var compress = require('compression');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var cdata = require('./data');
var staticImage = require('./staticImage');
var userAuth = require('./userAuth');

var app = express();

var dbconf = JSON.parse(fs.readFileSync('data/dbconf.json', { encoding: 'utf-8' }));
var cfact = cdata(dbconf);
var authorizer = userAuth(dbconf);
var imageMaker = staticImage({
	dir: '/temp'
});

// --- set up login strategy
passport.use(new LocalStrategy(authorizer));

passport.serializeUser(function(user, done) {
	done(null, user.userid);
});

passport.deserializeUser(function(id, done) {
	console.log('deserializer looking for ' + id);
	done(null, {});
});

// use jade for templates
app.set('view engine', 'jade');

// used on resources that you have to be authenticated to use
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

// --------- set up routes and middleware and such

// logging comes first
//   note: using the header "X-Real-IP" because I proxy this app throuh nginx
app.use(morgan(':req[X-Real-IP] - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));

app.use(cookieParser()); // required before session.
app.use(session({ secret: 'keyboard cat'}));
app.use(bodyParser());
app.use(compress());
app.use(passport.initialize());
app.use(passport.session());

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

app.get('/login', function(req, res, next) {
	res.render('login', { message: req.session.messages });
});

app.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err); }
		if (!user) {
			req.session.messages =  [info.message];
			return res.redirect('/login');
		}
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			req.session.messages = null;
			return res.redirect('/');
		});
	})(req, res, next);
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

// render basic (no header, footer, animation, etc) comic pages by id
app.get('/basic/:n', function(req, res, next) {

	cfact.loadById(req.params.n, function (err, data) {
		if (err) {
			next(err);
		} else if (data) {
			data.basic = true;
			data.pubDate = null;
			data.prevDate = null;
			data.nextDate = null;
			res.render('basiccomicpage', data);
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

app.get('/list', function(req, res, next) {
	
	cfact.listComics(function (err, data) {
		if (err) {
			next(err);
		} else if (data) {
			res.setHeader('Content-Type', 'application/json');
			res.send(data);
		} else {
			next(new Error('missing comic data!')); // this shouldn't happen
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

app.post('/data', ensureAuthenticated, function(req, res, next) {
	
	cfact.storeData(req.body, function(err, newid) {
		if (err) {
			next(err);
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send({
				id: newid
			});
			imageMaker.createImage(newid, cfact.storePinImage, function(err) {
				if (err) {
					console.log(err);
				}
			});
		}
	});
	
});

app.put('/data/:n', ensureAuthenticated, function(req, res, next) {
	
	var i = isNaN(req.params.n) ? null : Number(req.params.n);
	cfact.storeData(req.body, i, function(err, newid) {
		if (err) {
			next(err);
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send({
				id: newid
			});
			imageMaker.createImage(newid, cfact.storePinImage, function(err) {
				if (err) {
					console.log(err);
				}
			});
		}
	});
	
});

app.get('/editor', ensureAuthenticated, function(req, res, next) {
	res.render('editpage', {
		title: 'Editor'
	});
});

app.get('/about', function(req, res, next) {
	
	res.render('about', {
		title: 'About'
	});
	
});

app.get('/merch', function(req, res, next) {
	
	res.render('merch', {
		title: 'Merchandise'
	});
	
});

app.get('/games', function(req, res, next) {
	
	res.render('games', {
		title: 'Games'
	});
	
});

app.get('/pins/:n', function(req, res, next) {
	
	cfact.loadPinImage(req.params.n, function (err, data) {
		if (err) {
			next(err);
		} else if (data) {
			res.setHeader('Content-Type', 'image/png');
			res.send(data);
		} else {
			res.send(404); // don't use the full-page 404 for missing images
		}
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

app.post('/images', function(req, res, next) {
	
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
		cfact.storeImage(uploadName, b, uploadType, function(err, info) {
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
