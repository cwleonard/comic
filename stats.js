var mysql = require('mysql');
var UAParser = require('ua-parser-js');

module.exports = function(dbconf) {
	
	var pool = mysql.createPool(dbconf);
	
	return {
		
		comicsAccessed: function (hours, cb) {
			
			var h = isNaN(hours) ? 1 : Number(hours);
			
			var sql = 'SELECT count(*) as c FROM amphibian.comic_access where ' +
				'(tstamp > date_sub(current_timestamp, interval ' + pool.escape(h) + ' hour)) ' +
				'and (resource = \'/\' or resource regexp \'^/(chtml/)?[0-9]+$\')';
			
			pool.query(sql, function(err, rows) {
				
				if (err) {
					cb(err);
				} else {
					if (rows.length > 0) {
						var temp = rows[0].c;
						if (isNaN(temp)) {
							cb(new Error('weird error!'));
						} else {
							var count = Number(temp);
							cb(null, count);
						}
					} else {
						cb(null, 0);
					}
				}
				
			});
			
		},
		
		sources: function(hours, cb) {
			
			var h = isNaN(hours) ? 1 : Number(hours);
			
			var sql = 'SELECT count(*) as c, referer, resource FROM amphibian.comic_access ' +
				'where (tstamp > date_sub(current_timestamp, interval ' + pool.escape(h) + ' hour)) ' +
				'and (referer not regexp \'^http://(www\.)?amphibian.com\') ' +
				'group by referer order by 1 desc;';
			
			pool.query(sql, function(err, rows) {
				
				if (err) {
					cb(err);
				} else {
					var data = new Array();
					for (var i = 0; i < rows.length; i++) {
						
						var num = rows[i].c;
						var ref = rows[i].referer;
						var res = rows[i].resource;
						
						var temp = {
							referer: ref,
							resource: res,
							count: num
						};
						
						data.push(temp);

					}
					cb(null, data);
				}
				
			});
			
		},

		agents: function (hours, cb) {

			var h = isNaN(hours) ? 1 : Number(hours);

			var stuff = {
				"firefox": 0,
				"chrome": 0,
				"ie": 0,
				"safari": 0,
				"other": 0
			};
			
			var sql = 'SELECT agent FROM amphibian.comic_access where ' +
					'(tstamp > date_sub(current_timestamp, interval ' + pool.escape(h) + ' hour))';

			pool.query(sql, function(err, rows) {
				
				if (err) {
					cb(err);
				} else {
					
					for (var i = 0; i < rows.length; i++) {
						
						var ua = rows[i].agent;
						var parser = new UAParser();
						var r = parser.setUA(ua).getResult();
						
						if (r.browser.name === 'Chrome') {
							stuff.chrome++;
						} else if (r.browser.name === 'Firefox') {
							stuff.firefox++;
						} else if (r.browser.name === 'IE') {
							stuff.ie++;
						} else if (r.browser.name === 'Safari') {
							stuff.safari++;
						} else {
							stuff.other++;
						}
						
					}
					
					cb(null, stuff);
					
				}
				
			});
			
			

		}

	};
	
};