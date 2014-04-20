var express = require('express');
var mysql = require('mysql');
var fs = require('fs');
var compress = require('compression')();

var app = express();

var dbconf = JSON.parse(fs.readFileSync('data/dbconf.json', { encoding: 'utf-8' }));

var conn = mysql.createConnection(dbconf);

conn.connect();

app.set('view engine', 'jade');

// logging comes first
app.use(function(req, res, next) {
	console.log('%s %s', req.method, req.url);
	next();
});

app.use(compress);

// if nothing explicit requested, send index.html
app.get('/', function(req, res) {
	res.sendfile('./public/index.html');
});

app.get('/test/:n', function(req, res) {

	conn.query('SELECT data FROM comic_data WHERE id = ?', [req.params.n], function(err, rows) {
		
		if (err) {
			
			res.send(500, 'error loading comic');
			
		} else {
			
			if (rows.length > 0) {
				
				res.render('comic', JSON.parse(rows[0].data));
				
			} else {
				
				fs.readFile('data/404.json', { encoding: 'utf-8' }, function(err, data) {
					if (err) {
						res.send(500, "error getting the error comic! we gots problems!");
					} else {
						res.render('comic', JSON.parse(data), function(err, str) {
							if (err) {
								return req.next(err);
							}
							res.send(404, str);
						});
					}
				});
				
			}
			
		}
	});
	
});

app.get('/images/:img', function(req, res) {
	
	conn.query('SELECT data, type FROM comic_img WHERE filename = ?', [req.params.img], function(err, rows) {
		if (err) {
			res.send(500);
		} else {
			if (rows.length > 0) {
				res.setHeader('Content-Type', rows[0].type);
				res.send(new Buffer(rows[0].data));
			} else {
				res.send(404);
			}
		}
	});
	
});

app.use(express.static('public'));

var server = app.listen(3000, function() {
	console.log('listening on port %d', server.address().port);
});
