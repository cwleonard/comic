var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var compress = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var qr = require('qr-image');

var Feed = require('feed');

var routers = ["data", "images", "memeGen", "colors", "fb", "lamp", "captcha", "faq"];

var coinRoutes = require('./coinRoutes');
var logging = require('./logger');
var adTrack = require('./sourceTracker');

var app = express();

var conf = JSON.parse(fs.readFileSync('data/config.json', { encoding: 'utf-8' }));

var sslOptions = null;
if (conf.ssl) {

    try {
        
        sslOptions = {
            key: fs.readFileSync(conf.ssl.key),
            cert: fs.readFileSync(conf.ssl.cert)
        };
    
    } catch (e) {
        console.log("unable to use SSL: " + e);
    }
    
}

// ---------------


var server = http.createServer(app).listen(conf.port, function() {
    console.log('listening on port %d', server.address().port);
});
var io = require('socket.io')(server);

if (sslOptions) {
    var secureServer = https.createServer(sslOptions, app).listen(conf.ssl.port, function() {
        console.log('listening securely on port %d', secureServer.address().port);
    });
    io.attach(secureServer);
}

// ---------------

var cfact = require('./data')(conf.database);
var authorizer = require('./userAuth')(conf.database);
var stats = require('./stats')(conf.database);
var weather = require('./weather')(conf);
var twcRank = require('./twc')();

app.locals.holiday = require('./holiday')();

var coin = coinRoutes({
	express: express,
	db: cfact,
	config: conf.coin
});

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

		if (req.hostname.indexOf('toads.co') !== -1 && req.originalUrl === '/') {
			req.toads = true;
			next();
		} else if (req.hostname !== b) {
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

app.use(cookieParser()); // required before session and source tracker.

app.use(adTrack());

// logging comes first
//   note: using the header "X-Real-IP" because I proxy this app throuh nginx
app.use(logging(conf));

app.use(session({ secret: conf.secret, resave: false, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compress());
app.use(passport.initialize());
app.use(passport.session());

// if nothing explicit requested, send most recent comic
app.get('/', function(req, res, next) {
	
	if (req.toads) {
		
		cfact.loadById(116, function (err, data) {
			if (err) {
				next(err);
			} else if (data) {
				if (req.isAuthenticated()) {
					data.admin = true;
				}
				data.url = conf.base;
				data.toads = true;
				res.render('comicpage', data);
			} else {
				next(); // no comic found
			}
		});
		
	} else {

		cfact.loadCurrent(function (err, data) {
			if (err) {
				next(err);
			} else if (data) {
				if (req.isAuthenticated()) {
					data.admin = true;
				}
				data.url = conf.base;
				res.render('comicpage', data);
			} else {
				next(); // no comic found
			}
		});

	}
	
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
			
		    if (req.query.b === '1' && (req.isAuthenticated() || (req.get('X-Real-IP') == null && req.ip === conf.allowBasicFrom))) {
		        
		        if (req.query.c) {
		            var cn = Number(req.query.c);
		            var singleCell = [ data.cells[cn - 1] ];
		            data.cells = singleCell;
		            data.title = null;
		        }
		        
		        data.basic = true;
	            data.pubDate = null;
	            data.prevDate = null;
	            data.nextDate = null;
	            data.url = conf.base;
	            res.render('basiccomicpage', data);
		        
		    } else {

		        if (req.isAuthenticated()) {
		            data.admin = true;
		        }

		        if (data.pubDate) {
		            var p = new Date(data.pubDate);
		            if (p > new Date()) { // future comic
						data.allowComments = false;
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
		            } else { // normal path
						data.url = conf.base;
						var cDate  = new Date("1 January 2021");
						var p = new Date(data.pubDate);
						if (p > cDate) {
							data.allowComments = true;
						}
		                res.render('comicpage', data);
		            }
		        } else { // not sure about this one
		            data.url = conf.base;
		            res.render('comicpage', data);
		        }

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
	
	cfact.listComics()
	.then(function(data) {
		res.setHeader('Content-Type', 'application/json');
		res.send(data);
	}, function(error) {
		next(error.error);
	});
	
});

app.get('/archive', function(req, res, next) {

	cfact.listComics(true, req.query.f, req.query.q) // no future comics
	.then(function(data) {
		res.render('archive', {
			title: 'Archive',
			comics: data,
			filteredBy: req.query.f,
			searchedFor: req.query.q
		});
	}, function(error) {
		next(error.error);
	});

});

//------------ other routes...

(function setupRouters() {

    var opts = {
            express: express,
            sio: io,
            auth: ensureAuthenticated,
            dataSource: cfact,
            config: conf
    };

    routers.forEach(function(val) {

        try {
            console.log("loading router [" + val + "] ...");
            var r = require("./routers/" + val);
            app.use("/" + val, r(opts));
        } catch (e) {
            console.error("error loading router [" + val + "] - " + e);
        }

    });

})();




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

app.get('/thanks', function(req, res, next) {
	
	cfact.loadPatrons()
	.then(function(data) {
		res.render('thanks', {
			title: 'Thanks',
			patrons: data
		});
	}, function(error) {
		next(error.error);
	});
	
});

app.get('/promo', function(req, res, next) {
	
	res.render('promoFeb2015', {
		title: 'Free Sticker Promotion'
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
		copyright: "All rights reserved 2015, Casey Leonard",
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
				
				res.render('atomcomicpage', comics[c], function(err, html) {
					
					feed.addItem({
						title: comics[c].title ? comics[c].title : "Untitled Comic",
								link: "http://" + conf.base + "/" + comics[c].id,
								description: "Amphibian.com comic for " + comics[c].pubDate,
								date: comics[c].pd,
								content: html
					});
					
				});
				
				
			}
			
			feed.updated = comics[0].pd;
			
			res.setHeader('Content-Type', 'application/atom+xml');
			res.send(feed.render('atom-1.0'));
			
		}
	});
	
});

//render basic (no header, footer, animation, etc) comic pages by id
app.get('/feedtest/:n', function(req, res, next) {

	cfact.loadById(req.params.n, function (err, data) {
		if (err) {
			next(err);
		} else if (data) {
			res.render('atomcomicpage', data);
		} else {
			next(); // no comic found
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
	res.render('stats', {
		title: 'Stats'
	});
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

app.get('/stats/browsers/:n', function(req, res, next) {
	
	stats.browsers(req.params.n, function(err, data) {
		res.status(200).send(data);
	});
	
});

app.get('/stats/os/:n', function(req, res, next) {
	
	stats.oses(req.params.n, function(err, data) {
		res.status(200).send(data);
	});
	
});

app.get('/stats/topSources/:n', function(req, res, next) {
	
	stats.topSources(req.params.n, function(err, data) {
		res.status(200).send(data);
	});
	
});

app.get('/stats/topComics/:n', function(req, res, next) {
	
	stats.topComics(req.params.n, function(err, data) {
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


//------------ set up routes for /coin/*

app.use('/coin', coin.router);

var paidContentRouter = express.Router();
paidContentRouter.get("/:id", coin.middleware, function(req, res, next) {
	
	cfact.loadPaidById(req.params.id, function (err, data) {
		if (err) {
			next(err);
		} else if (data) {
			data.url = conf.base;
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
app.use('/paidContent', paidContentRouter);

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

//------------ what's my TWC ranking?

app.get('/twc', function(req, res, next) {
	res.setHeader('Content-Type', 'text/plain');
	res.setHeader('Access-Control-Allow-Origin', 'http://toads.co');
	res.status(200).send(twcRank.rank());
});

//------------ QR Code generator

app.get('/qrc', function(req, res, next) {

	var text = req.query.text || '';
	if (text === '') {
		text = "https://amphibian.com";
	}
	res.setHeader('Content-Type', 'image/png');
	res.send(qr.imageSync(text, {type: 'png'}));
	
});

// ------------ test for error handling

app.get('/broken', function(req, res, next) {
	throw new Error('not a real error');
});

// ------------ static content

app.use(express.static('public', {
	'setHeaders': function(res, path, stat) {
			if (path.match(/\.(ttf|ttc|otf|eot|woff|woff2|font.css|css)$/)) {
				res.setHeader('Access-Control-Allow-Origin', 'http://toads.co');
			}
		}
	}));



// -------------- 404 soccer

var soccerRoutes = express.Router();

soccerRoutes.get('/', function(req, res, next) {

	res.render('missing', {
		title: '404'
	});

});

soccerRoutes.use(express.static('soccer'));

app.use('/404', soccerRoutes);

// --------------------------

// handle 404
app.use(function(req, res, next) {
	
    if (req.path.match(/\.js$/)) {
        res.sendStatus(404);
    } else {
        res.redirect("/404/");
    }
	
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


