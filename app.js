var express = require('express');
var mysql = require('mysql');
var fs = require('fs');
var compress = require('compression')();

var app = express();

var dbconf = JSON.parse(fs.readFileSync('data/dbconf.json', { encoding: 'utf-8' }));

var conn = mysql.createConnection(dbconf);

conn.connect();

function prevComic(d, cb) {
	
	var sql = 'SELECT id, DATE_FORMAT(pub_date, \'%W, %e %M %Y\') as pd, data FROM comic_data ' +
		'WHERE pub_date = (SELECT MAX(pub_date) FROM comic_data WHERE pub_date < ?)';
	conn.query(sql, [d], function(err, rows) {
		
		if (err) {
			console.log(err);
			cb(null);
		} else {
		
			if (rows.length > 0) {
				cb(rows[0].id);
			} else {
				cb(null);
			}
			
		}
		
	});
	
}

function nextComic(d, cb) {
	
	var sql = 'SELECT id, DATE_FORMAT(pub_date, \'%W, %e %M %Y\') as pd, data FROM comic_data ' +
		'WHERE pub_date = (SELECT MIN(pub_date) FROM comic_data WHERE pub_date > ?)';
	conn.query(sql, [d], function(err, rows) {
		
		if (err) {
			console.log(err);
			cb(null);
		} else {
		
			if (rows.length > 0) {
				cb(rows[0].id);
			} else {
				cb(null);
			}
			
		}
		
	});
	
}

function getComicFromDB(sql, req, res) {
	
	conn.query(sql, function(err, rows) {
		
		if (err) {
			
			res.send(500, 'error loading comic');
			
		} else {
			
			if (rows.length > 0) {
				
				var obj = JSON.parse(rows[0].data);
				obj.pubDate = rows[0].pd;
				
				prevComic(rows[0].pub_date, function(p) {
					
					obj.prevDate = p;
					
					nextComic(rows[0].pub_date, function(n) {

						obj.nextDate = n;
						res.render('comic', obj);
						
					});
					
					
				});
				
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

}


app.set('view engine', 'jade');

// logging comes first
app.use(function(req, res, next) {
	console.log('%s %s', req.method, req.url);
	next();
});

app.use(compress);

// if nothing explicit requested, send most recent comic
app.get('/', function(req, res) {
	
	var sql = 'SELECT pub_date, DATE_FORMAT(pub_date, \'%W, %e %M %Y\') as pd, data FROM comic_data ' +
		'WHERE pub_date = (SELECT MAX(pub_date) FROM comic_data)';
	getComicFromDB(sql, req, res);
	
});

app.get('/:n', function(req, res) {

	var sql = 'SELECT pub_date, DATE_FORMAT(pub_date, \'%W, %e %M %Y\') as pd, data ' +
		'FROM comic_data WHERE id = ' + conn.escape(req.params.n);
	getComicFromDB(sql, req, res);
	
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

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.send(500, 'Something broke!');
});

var server = app.listen(3000, function() {
	console.log('listening on port %d', server.address().port);
});
