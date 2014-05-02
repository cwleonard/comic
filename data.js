var mysql = require('mysql');

module.exports = function(dbconf) {
	
	var conn = mysql.createConnection(dbconf);
	conn.connect();
	
	function prevComic(d, cb) {
		
		var sql = 'SELECT id, DATE_FORMAT(pub_date, \'%W, %e %M %Y\') as pd, data FROM comic_data ' +
			'WHERE pub_date = (SELECT MAX(pub_date) FROM comic_data WHERE pub_date < ?)';
		conn.query(sql, [d], function(err, rows) {
			
			if (err) {
				cb(err);
			} else {
				if (rows.length > 0) {
					cb(null, rows[0].id);
				} else {
					cb(null, null);
				}
			}
			
		});
		
	}
	
	function nextComic(d, cb) {
		
		var sql = 'SELECT id, DATE_FORMAT(pub_date, \'%W, %e %M %Y\') as pd, data FROM comic_data ' +
			'WHERE pub_date = (SELECT MIN(pub_date) FROM comic_data WHERE pub_date > ?)';
		conn.query(sql, [d], function(err, rows) {
			
			if (err) {
				cb(err);
			} else {
			
				if (rows.length > 0) {
					cb(null, rows[0].id);
				} else {
					cb(null, null);
				}
				
			}
			
		});
		
	}
	
	return {
		
		loadCurrent: function (cb) {
			
			var sql = 'SELECT pub_date, DATE_FORMAT(pub_date, \'%W, %e %M %Y\') as pd, data FROM comic_data ' +
				'WHERE pub_date = (SELECT MAX(pub_date) FROM comic_data)';
			conn.query(sql, function(err, rows) {
				
				if (err) {
					cb(err);
				} else {
					
					if (rows.length > 0) {
						var obj = JSON.parse(rows[0].data);
						obj.pubDate = rows[0].pd;
						
						prevComic(rows[0].pub_date, function(err, p) {
							
							if (err) {
								cb(err);
							} else {
								obj.prevDate = p;
								nextComic(rows[0].pub_date, function(err, n) {
									if (err) {
										cb(err);
									} else {
										obj.nextDate = n;
										cb(null, obj);
									}
								});
								
							}
							
						});
						
					} else {
						cb(null, null);
					}
					
				}

			});
			
		},

		loadById: function (id, cb) {

			var sql = 'SELECT pub_date, DATE_FORMAT(pub_date, \'%W, %e %M %Y\') as pd, data ' +
				'FROM comic_data WHERE id = ' + conn.escape(id);
			conn.query(sql, function(err, rows) {

				if (err) {
					cb(err);
				} else {

					if (rows.length > 0) {
						var obj = JSON.parse(rows[0].data);
						obj.pubDate = rows[0].pd;

						prevComic(rows[0].pub_date, function(err, p) {

							if (err) {
								cb(err);
							} else {
								obj.prevDate = p;
								nextComic(rows[0].pub_date, function(err, n) {
									if (err) {
										cb(err);
									} else {
										obj.nextDate = n;
										cb(null, obj);
									}
								});

							}

						});

					} else {
						cb(null, null);
					}

				}

			});

		},
		
		loadImage: function(name, cb) {

			conn.query('SELECT data, type FROM comic_img WHERE filename = ?', [name], function(err, rows) {
				if (err) {
					cb(err);
				} else {
					if (rows.length > 0) {
						cb(null, {
							contentType: rows[0].type,
							buffer: new Buffer(rows[0].data)
						});
					} else {
						cb(null, null);
					}
				}
			});

		},
		
		storeData: function(data, cb) {
			
			conn.query('INSERT INTO comic_data (data) VALUES (?)', [data], function(err, result) {
				
				if (err) {
					cb(err);
				} else {
					if (result.affectedRows === 1) {
						cb(null, result.insertId);
					} else {
						cb(new Error('no data inserted!'));
					}
				}
				
			});
			
		},
		
		listImages: function(cb) {
			
			conn.query('SELECT filename, type FROM comic_img', function(err, rows) {
				if (err) {
					cb(err);
				} else {
					if (rows.length > 0) {
						var data = [];
						for (var i = 0; i < rows.length; i++) {
							data.push({
								filename: rows[i].filename,
								type: rows[i].type
							});
						}
						cb(null, data);
					} else {
						cb(null, []);
					}
				}
			});
			
		}

	};
	
};