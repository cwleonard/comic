var mysql = require('mysql');
var q = require('q');

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
	
	function loadOldest(cb) {
		
		var sql = 'SELECT id, pub_date, DATE_FORMAT(pub_date, \'%W, %e %M %Y\') as pd, data FROM comic_data ' +
			'WHERE pub_date = (SELECT MIN(pub_date) FROM comic_data)';
		pool.query(sql, function(err, rows) {
			
			if (err) {
				cb(err);
			} else {
				
				if (rows.length > 0) {
					var obj = JSON.parse(rows[0].data);
					obj.pubDate = rows[0].pd;
					obj.id = rows[0].id;
					obj.pd = rows[0].pub_date;
					obj.prevDate = null; // this is the oldest, can't have previous!
					nextComic(rows[0].pub_date, function(err, n) {
						if (err) {
							cb(err);
						} else {
							obj.nextDate = n;
							cb(null, obj);
						}
					});
					
				} else {
					cb(null, null);
				}
				
			}

		});
		
	}
	
	function loadNewest(cb) {

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
					obj.pd = rows[0].pub_date;

					prevComic(rows[0].pub_date, function(err, p) {

						if (err) {
							cb(err);
						} else {
							obj.prevDate = p;
							obj.nextDate = null; // can't have next, this is the newest
							cb(null, obj);
						}

					});

				} else {
					cb(null, null);
				}

			}

		});

	}
	
	function loadRecentSet(num, cb) {
		
		var sql = 'SELECT id, pub_date, DATE_FORMAT(pub_date, \'%W, %e %M %Y\') as pd, data FROM comic_data ' +
		'WHERE pub_date <= (SELECT MAX(pub_date) FROM comic_data WHERE DATE(pub_date) <= CURDATE()) ' +
		'ORDER BY pub_date DESC LIMIT ' + pool.escape(num);
		pool.query(sql, function(err, rows) {

			if (err) {
				cb(err);
			} else {

				if (rows.length > 0) {
					
					var comics = [];
					
					for(var r = 0; r < rows.length; r++) {
						
						var obj = JSON.parse(rows[r].data);
						obj.pubDate = rows[r].pd;
						obj.id = rows[r].id;
						obj.pd = rows[r].pub_date;

						if (r === 0) { // this is the newest							
							obj.nextDate = null; // can't have next
						} else {
							comics[r-1].prevDate = obj.id;
							obj.nextDate = comics[r-1].id;
						}
						
						comics.push(obj);
						
					}
					
					comics[comics.length-1].prevDate = null;
					
					cb(null, comics);

				} else {
					cb(null, null);
				}

			}

		});
		
	}
	
	return {
		
		loadCurrent: function (cb) {
			
			loadNewest(cb);
			
		},

		loadRecent: function (num, cb) {

			loadRecentSet(num, cb);
			
		},
		
		loadById: function (id, cb) {

			var idn = Number(id);
			if (idn == -1) {
				
				loadNewest(cb);
				
			} else if (idn < 1) {
				
				loadOldest(cb);
				
			} else {

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
							obj.pd = rows[0].pub_date;

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

			}

		},
		
		loadPinImage: function(id, cb) {

			pool.query('SELECT static_img FROM comic_data WHERE id = ?', [id], function(err, rows) {
				if (err) {
					cb(err);
				} else {
					if (rows.length > 0) {
						if (rows[0].static_img) {
							cb(null, new Buffer(rows[0].static_img));
						} else {
							cb(null, null);
						}
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

		loadFBImage: function(id, cb) {

			pool.query('SELECT cell_img FROM comic_data WHERE id = ?', [id], function(err, rows) {
				if (err) {
					cb(err);
				} else {
					if (rows.length > 0) {
						if (rows[0].cell_img) {
							cb(null, new Buffer(rows[0].cell_img));
						} else {
							cb(null, null);
						}
					} else {
						cb(null, null);
					}
				}
			});

		},

		storeFBImage: function(id, data, cb) {

			pool.query('UPDATE comic_data SET cell_img = ? WHERE id = ?', [data, id], function(err, result) {
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
			
			pool.query('INSERT INTO comic_img (filename, type, data) VALUES (?, ?, ?) ' +
					'ON DUPLICATE KEY UPDATE type = VALUES(type), data = VALUES(data)',
					[fn, type, data], function(err, result) {
				
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
		
		listImages: function() {
			
			var deferred = q.defer();
			
			pool.query('SELECT filename, type FROM comic_img', function(err, rows) {
				
				if (err) {
					
					deferred.reject({
						message: 'database query failed',
						error: err
					});
					
				} else {
					
					var data = [];
					if (rows.length > 0) {
						for (var i = 0; i < rows.length; i++) {
							data.push({
								filename: rows[i].filename,
								type: rows[i].type
							});
						}
					}
					
					deferred.resolve(data);
					
				}
			});
			
			return deferred.promise;
			
		},

		listComics: function(noFuture) {

			var deferred = q.defer();

			var sql;
			if (noFuture) {
				sql = 'SELECT id, pub_date, DATE_FORMAT(pub_date, \'%e %M %Y\') as pd, data FROM comic_data WHERE DATE(pub_date) <= CURDATE() ORDER by pub_date';
			} else {
				sql = 'SELECT id, pub_date, DATE_FORMAT(pub_date, \'%e %M %Y\') as pd, data FROM comic_data ORDER by pub_date';
			}
			
			pool.query(sql, function(err, rows) {

				if (err) {
					
					deferred.reject({
						message: 'database query failed',
						error: err
					});
					
				} else {
					
					var data = [];
					if (rows.length > 0) {
						for (var i = 0; i < rows.length; i++) {
							var c = JSON.parse(rows[i].data);
							var t = (c.title ? c.title : 'no title');
							data.push({
								id: rows[i].id,
								pdate: rows[i].pub_date,
								published: rows[i].pd,
								title: t
							});
						}
					}
					
					deferred.resolve(data);
					
				}
			});

			return deferred.promise;

		},
		
		// ------------------------ paid content stuff -----------------

		lookupPrice: function(productId, callback) {
			
			var sql = 'SELECT cost FROM products WHERE id = ?';
			var params = [productId];
			
			pool.query(sql, params, function(err, rows) {
				
				if (err) {
					callback(err);
				} else {
					if (rows.length > 0) {
						callback(null, {
							cost: rows[0].cost
						});
					} else {
						callback(new Error('no product found with id ' + productId + '!'));
					}

				}
				
			});
			
		},

		createPurchaseRecord: function(record, callback) {
			
//			record = {
//					paid: false,
//					code: pCode,
//					cost: cost,
//					purchaseId: purchaseId,
//					address: data.address,
//					secret: callbackSecret
//				};
			
			var sql = 'INSERT INTO purchases (purchaseId, bitcoinAddress, secret, productCode, cost) VALUES (?, ?, ?, ?, ?)';
			var params = [record.purchaseId, record.address, record.secret, record.code, record.cost];

			pool.query(sql, params, function(err, result) {

				if (err) {
					callback(err);
				} else {
					callback(null, record);
				}

			});
			
		},

		recordPayment: function(data, callback) {
			
//			{
//				secret: secretCode,
//				address: addr,
//				amount: req.body.amount
//			}			
			
			var sql = 'UPDATE purchases SET amount = ? WHERE bitcoinAddress = ? AND secret = ?';
			var params = [data.amount, data.address, data.secret];
			
			pool.query(sql, params, function(err, result) {
				
				if (err) {
					callback(err);
				} else {
					if (result.affectedRows === 0) {
						console.log("no record found to update: " + JSON.stringify(data));
					} else if (result.affectedRows > 1) {
						console.log("updated too many records: " + JSON.stringify(data));
					}
					callback(null);
				}
				
			});
			
		},
		
		checkPaidStatus: function(purchaseId, callback) {
			
			var sql = 'SELECT cost, amount, bitcoinaddress, amount FROM purchases WHERE purchaseId = ?';
			var params = [purchaseId];
			
			pool.query(sql, params, function(err, rows) {
				
				if (err) {
					callback(err);
				} else {
					if (rows.length > 0) {
						callback(null, {
							paid: (rows[0].amount >= rows[0].cost),
							address: rows[0].bitcoinaddress,
							cost: (rows[0].cost - rows[0].amount)
						});
					} else {
						callback(null, {
							paid: false
						});
					}

				}
				
			});
			
		},
		
		loadPaidById: function (id, cb) {

			var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			
			var sql = 'SELECT data FROM products WHERE id = ' + pool.escape(id);
			pool.query(sql, function(err, rows) {

				if (err) {
					cb(err);
				} else {

					if (rows.length > 0) {
						
						var obj = JSON.parse(rows[0].data);
						
						var objDate = new Date(obj.pubDate);
												
						obj.pubDate = days[objDate.getUTCDay()] + ", " + objDate.getUTCDate() + " " + months[objDate.getUTCMonth()] + ", " + objDate.getUTCFullYear();
						obj.pd = null;

						obj.prevDate = null;
						obj.nextDate = null;

						cb(null, obj);

					} else {
						cb(null, null);
					}

				}

			});


		}
		

	};
	
};