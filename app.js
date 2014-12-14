var express = require('express');
var fs = require('fs');
var compress = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Feed = require('feed');

var imgRoutes = require('./imageRoutes');
var dataRoutes = require('./dataRoutes');
var logging = require('./logger');


var app = express();

var conf = JSON.parse(fs.readFileSync('data/config.json', { encoding: 'utf-8' }));

var cfact = require('./data')(conf.database);
var authorizer = require('./userAuth')(conf.database);
var stats = require('./stats')(conf.database);
var weather = require('./weather')(conf);

// --- set up login strategy
passport.use(new LocalStrategy(authorizer));

passport.serializeUser(function(user, done) {
	done(null, user.userid);
});

/*
 * this deserializer actually performs no user lookup, just
 * recreates the user object. my user object is not really
 * much of anything at this point, just the userid.
 */
passport.deserializeUser(function(id, done) {
	done(null, { userid: id });
});

// use jade for templates
app.set('view engine', 'jade');

// used on resources that you have to be authenticated to use
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.session.returnTo = req.originalUrl;
	res.redirect('/login');
}

// middleware to ensure we're on the correct URL
function correctUrl(b) {
	
	return function (req, res, next) {

		if (req.hostname !== b) {
			var port = '';
			var hostWithPort = req.get('host');
			if (hostWithPort.indexOf(':') !== -1) {
				port = hostWithPort.substring(hostWithPort.indexOf(':'));
			}
			res.redirect(req.protocol + '://' + b + port + req.originalUrl);
		} else {
			next();
		}

	};
	
}

// --------- set up routes and middleware and such

app.use(correctUrl(conf.base));

// logging comes first
//   note: using the header "X-Real-IP" because I proxy this app throuh nginx
app.use(logging(conf));

app.use(cookieParser()); // required before session.
app.use(session({ secret: conf.secret, resave: false, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compress());
app.use(passport.initialize());
app.use(passport.session());

// if nothing explicit requested, send most recent comic
app.get('/', function(req, res, next) {
	
	cfact.loadCurrent(function (err, data) {
		if (err) {
			next(err);
		} else if (data) {
			data.url = conf.base;
			res.render('comicpage', data);
		} else {
			next(); // no comic found
		}
	});
	
});

var loginRoute = app.route('/login');

loginRoute.get(function(req, res, next) {
	res.render('login', { message: req.session.messages, returnTo: req.session.returnTo });
});

loginRoute.post(function(req, res, next) {
	var rt = (req.body.returnto ? req.body.returnto : '');
	if (rt.indexOf('/login') !== -1 || rt === '') {
		rt = '/';
	}
	passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err); }
		if (!user) {
			req.session.messages =  [info.message];
			return res.redirect('/login');
		}
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			req.session.messages = null;
			return res.redirect(rt);
		});
	})(req, res, next);
});

// load individual comic pages by id
app.get('/:n', function(req, res, next) {

	cfact.loadById(req.params.n, function (err, data) {
		if (err) {
			next(err);
		} else if (data) {
			
			if (data.pubDate) {
				var p = new Date(data.pubDate);
				if (p > new Date()) {
					if (!req.isAuthenticated()) {
						// only authenticated users can see future comics
						fs.readFile('data/403.json', { encoding: 'utf-8' }, function(err, data) {
							if (err) {
								next(err);
							} else {
								res.render('comicpage', JSON.parse(data), function(err, str) {
									if (err) {
										next(err);
									} else {
										res.status(403).send(str);
									}
								});
							}
						});
					} else {
						data.url = conf.base;
						res.render('comicpage', data);
					}
				} else {
					data.url = conf.base;
					res.render('comicpage', data);
				}
			} else {
				data.url = conf.base;
				res.render('comicpage', data);
			}
			
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
			data.url = conf.base;
			res.render('basiccomicpage', data);
		} else {
			next(); // no comic found
		}
	});
	
});

//render basic single cell, given a comic id and cell number (1-based)
app.get('/basic/:n/:c', function(req, res, next) {

	cfact.loadById(req.params.n, function (err, data) {
		if (err) {
			next(err);
		} else if (data) {
			data.basic = true;
			var cn = Number(req.params.c);
			var singleCell = [ data.cells[cn - 1] ];
			data.cells = singleCell;
			data.title = null;
			data.pubDate = null;
			data.prevDate = null;
			data.nextDate = null;
			data.url = conf.base;
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
			data.url = conf.base;
			
			// when loading comics dynamically, add a 'dynScripts' variable
			// which is a copy of 'scripts'. this is because any extra scripts
			// must be loaded only after jQuery, which happens at the bottom
			// of a full page load. in the case of a partial load such as what
			// happens at this path, the JS footer (which looks at 'scripts')
			// is not used.
			data.dynScripts = data.scripts;
			
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

app.get('/list', ensureAuthenticated, function(req, res, next) {
	
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


//------------ set up routes for /data/*

app.use('/data', dataRoutes({
	express: express,
	auth: ensureAuthenticated,
	dataSource: cfact
}));

//------------ other routes...

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

app.get('/feeds/atom', function(req, res, next) {
	
	var prev = 4;
	
	var feed = new Feed({
		id: "http://amphibian.com",
		title: "Amphibian.com",
		description: "A web comic about frogs who run a technology company.",
		link: "http://" + conf.base,
		feed: "http://" + conf.base + "/feeds/atom",
		icon: "http://" + conf.base + "/simg/og_logo.png",
		copyright: "All rights reserved 2014, Casey Leonard",
		author: {
			name: "Casey Leonard",
			email: "casey@amphibian.com",
			link: "http://caseyleonard.com"
		}
	});
	
	cfact.loadRecent(prev, function(err, comics) {
		if (err) {
			next(err);
		} else {
			
			for (var c in comics) {
				
				feed.addItem({
					title: comics[c].title ? comics[c].title : "Untitled Comic",
					link: "http://" + conf.base + "/" + comics[c].id,
					description: "Amphibian.com comic for " + comics[c].pubDate,
					date: comics[c].pd,
					content: "<img src=\"http://" + conf.base + "/pins/" + comics[c].id + "\"/>"
				});
				
			}
			
			feed.updated = comics[0].pd;
			
			res.setHeader('Content-Type', 'application/atom+xml');
			res.send(feed.render('atom-1.0'));
			
		}
	});
	
});

//------------ some old links are still out there, send them to Gist now

app.get('/code/:c', function(req, res, next) {
	res.redirect('https://gist.github.com/cwleonard');
});

//------------

app.get('/stats/agents/:n', function(req, res, next) {
	
	stats.agents(req.params.n, function(err, data) {
		res.status(200).send(data);
	});
	
});

app.get('/stats/comics/:n', function(req, res, next) {
	
	stats.comicsAccessed(req.params.n, function(err, data) {
		var c = {
			access: data
		};
		res.status(200).send(c);
	});
	
});

app.get('/stats', function(req, res, next) {
	res.render('stats');
});

app.get('/stats/viewsByDay/:n', function(req, res, next) {
	
	stats.viewsByDay(req.params.n, function(err, data) {
		res.status(200).send(data);
	});
	
});

app.get('/stats/sources/:n', function(req, res, next) {
	
	stats.sources(req.params.n, function(err, data) {
		res.status(200).send(data);
	});
	
});

//------------

app.get('/pins/:n', function(req, res, next) {
	
	cfact.loadPinImage(req.params.n, function (err, data) {
		if (err) {
			next(err);
		} else if (data) {
			res.setHeader('Content-Type', 'image/png');
			res.send(data);
		} else {
			res.sendStatus(404); // don't use the full-page 404 for missing images
		}
	});
	
});

app.get('/cell/:n', function(req, res, next) {
	
	cfact.loadFBImage(req.params.n, function (err, data) {
		if (err) {
			next(err);
		} else if (data) {
			res.setHeader('Content-Type', 'image/png');
			res.send(data);
		} else {
			res.sendStatus(404); // don't use the full-page 404 for missing images
		}
	});
	
});

// ------------ set up routes for /images/*

app.use('/images', imgRoutes({
	express: express,
	auth: ensureAuthenticated,
	dataSource: cfact
}));

// ------------ teapot

app.get('/teapot', function(req, res, next) {
	res.status(418).send('your tea is ready');
});

// ------------ what's temperature here?

app.get('/temperature', function(req, res, next) {
	res.status(200).send({
		f: weather.temperature()
	});
});

// ------------ test for error handling

app.get('/broken', function(req, res, next) {
	throw new Error('not a real error');
});

// ------------ static content

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
					res.status(404).send(str);
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
					res.status(500).send(str);
				}
			});
		}
	});
});

var server = app.listen(3000, function() {
	console.log('listening on port %d', server.address().port);
});
