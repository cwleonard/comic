var http = require('http');

module.exports = function(conf) {
	
	var DEFAULT_TEMP = 50; // start with some reasonable value
	
	var currentTemp = DEFAULT_TEMP;
	
	var apiKey = conf.weatherApiKey || "";
	// id 5184309 is near Reedsville, PA
	var locationId = '5184309';

	function pullWeatherData(cb) {

		http.get("http://api.openweathermap.org/data/2.5/weather?id=" + locationId + "&units=imperial&APPID=" + apiKey, function(res) {
			
			var wData = '';
			res.on('data', function(chunk) {
				wData += chunk;
			});
			res.on('end', function() {
				var data = JSON.parse(wData);
				cb(null, data);
			});
			
		}).on('error', function(e) {
			cb(e);
		});
		
	}

	function weatherTimer() {
		
		pullWeatherData(function(err, data) {
			if (err) {
				console.log(err);
			} else {
				try {
					currentTemp = data.main.temp || (function() { console.log('no data.main.temp. using default temp'); return DEFAULT_TEMP; }());
					console.log((new Date()) + ": setting current temp to " + currentTemp);
				} catch (e) {
					console.error(e.stack);
					console.log((new Date()) + ": setting current temp to " + DEFAULT_TEMP);
				}
			}
			setTimeout(weatherTimer, 1800000); // call again in 30 minutes
		});
		
	}

	weatherTimer(); // run now, and then every 30 minutes

	return {
		temperature: function() {
			return currentTemp;
		}
	};
	
};