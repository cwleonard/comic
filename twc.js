var http = require('http');

module.exports = function() {
	
	var DEFAULT_RANKING = 'unknown';
	
	var currentRank = DEFAULT_RANKING;
	
	var twcComicId = "18931";
	
	function pullRank(cb) {

		http.get("http://topwebcomics.com/rankimages/plaintext.aspx?comicid=" + twcComicId, function(res) {
			
			var wData = '';
			res.on('data', function(chunk) {
				wData += chunk;
			});
			res.on('end', function() {
				try {
					var rank = wData;
					cb(null, rank);
				} catch (e) {
					cb(e);
				}
			});
			
		}).on('error', function(e) {
			cb(e);
		});
		
	}

	function rankTimer() {
		
		pullRank(function(err, data) {
			if (err) {
				console.log(err);
			} else {
				try {
					currentRank = data || (function() { console.log('no ranking??'); return DEFAULT_RANKING; }());
					console.log((new Date()) + ": twc ranking is " + currentRank);
				} catch (e) {
					console.error(e.stack);
					console.log((new Date()) + ": setting twc ranking to " + DEFAULT_RANKING);
				}
			}
			setTimeout(rankTimer, 3600000); // call again in 60 minutes
		});
		
	}

	rankTimer(); // run now, and then every 60 minutes

	return {
		rank: function() {
			return currentRank;
		}
	};
	
};