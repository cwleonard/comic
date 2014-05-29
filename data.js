var mysql = require('mysql');

module.exports = function(dbconf) {
	
	var pool = mysql.createPool(dbconf);
	
	function prevComic(d, cb) {
		
		var sql = 'SELECT id, DATE_FORMAT(pub_date, \'%W, %e %M %Y\') as pd, data FROM comic_data ' +
			'WHERE pub_date = (SELECT MAX(pub_date) FROM comic_data WHERE pub_date < ?)';
		pool.query(sql, [d], function(err, rows) {
			
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
			'WHERE pub_date = (SELECT MIN(pub_date) FROM comic_data WHERE pub_date > ? AND ' +
			'DATE(pub_date) <= CURDATE())';
		pool.query(sql, [d], function(err, rows) {
			
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
			
			var sql = 'SELECT id, pub_date, DATE_FORMAT(pub_date, \'%W, %e %M %Y\') as pd, data FROM comic_data ' +
				'WHERE pub_date = (SELECT MAX(pub_date) FROM comic_data WHERE DATE(pub_date) <= CURDATE())';
			pool.query(sql, function(err, rows) {
				
				if (err) {
					cb(err);
				} else {
					
					if (rows.length > 0) {
						var obj = JSON.parse(rows[0].data);
						obj.pubDate = rows[0].pd;
						obj.id = rows[0].id;
						
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
				'FROM comic_data WHERE id = ' + pool.escape(id);
			pool.query(sql, function(err, rows) {

				if (err) {
					cb(err);
				} else {

					if (rows.length > 0) {
						var obj = JSON.parse(rows[0].data);
						obj.pubDate = rows[0].pd;
						obj.id = id;

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
		
		loadPinImage: function(id, cb) {

			pool.query('SELECT static_img FROM comic_data WHERE id = ?', [id], function(err, rows) {
				if (err) {
					cb(err);
				} else {
					if (rows.length > 0) {
						cb(null, new Buffer(rows[0].static_img));
					} else {
						cb(null, null);
					}
				}
			});

		},

		storePinImage: function(id, data, cb) {

			pool.query('UPDATE comic_data SET static_img = ? WHERE id = ?', [data, id], function(err, result) {
				if (err) {
					cb(err);
				} else {
					if (result.affectedRows === 1) {
						cb(null);
					} else {
						cb(new Error('no row updated!'));
					}
				}
			});

		},

		loadImage: function(name, cb) {

			pool.query('SELECT data, type FROM comic_img WHERE filename = ?', [name], function(err, rows) {
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
		
		storeImage: function(fn, data, type, cb) {
			
			pool.query('INSERT INTO comic_img (filename, type, data) VALUES (?, ?, ?)', [fn, type, data], function(err, result) {
				
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
		
		storeData: function(data, idOrCb, cb) {
			
			var id = typeof(idOrCb) === 'function' ? null : idOrCb;
			var callback = typeof(idOrCb) === 'function' ? idOrCb : cb;
			
			var json = JSON.stringify(data);

			var sql;
			var params;
			if (id) {
				sql = 'INSERT INTO comic_data (id, pub_date, data) VALUES (?, ?, ?) ' + 
					'ON DUPLICATE KEY UPDATE pub_date = VALUES(pub_date), data = VALUES(data)';
				params = [id, data.pubDate, json];
			} else {
				sql = 'INSERT INTO comic_data (pub_date, data) VALUES (?, ?)';
				params = [data.pubDate, json];
			}
			
			pool.query(sql, params, function(err, result) {
				
				if (err) {
					callback(err);
				} else {
					if (id) {
						callback(null, id);
					} else if (result.affectedRows === 1) {
						callback(null, result.insertId);
					} else {
						callback(new Error('no data inserted!'));
					}
				}
				
			});
			
		},
		
		listImages: function(cb) {
			
			pool.query('SELECT filename, type FROM comic_img', function(err, rows) {
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
			
		},
		
		listComics: function(cb) {
			
			pool.query('SELECT id, DATE_FORMAT(pub_date, \'%e %M %Y\') as pd, data FROM comic_data ORDER by id', function(err, rows) {
				if (err) {
					cb(err);
				} else {
					if (rows.length > 0) {
						var data = [];
						for (var i = 0; i < rows.length; i++) {
							var c = JSON.parse(rows[i].data);
							var t = (c.title ? c.title : 'no title');
							data.push({
								id: rows[i].id,
								published: rows[i].pd,
								title: t
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