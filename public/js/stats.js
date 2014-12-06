function doDayChart() {

	$.get('/stats/viewsByDay/7', function(data) {
		
		var cdat = [];
		for (d in data) {
			cdat.push({
				"x": data[d].day,
				"y": data[d].count
			});
		}
		
		var chartData = {
			"xScale": "time",
			"yScale": "linear",
			"type": "line",
			"main": [{
				"className": ".comicsAccessed",
				"data": cdat
			}]
		};
		
		console.log(chartData);
		
		var opts = {
				  "dataFormatX": function (x) { return new Date(x); },
				  "tickFormatX": function (x) { return d3.time.format('%A')(x); }
				};

		var myChart = new xChart('line', chartData, '#chart1', opts);

	}, 'json');

}

$(function() {
	
	doDayChart();
	
});
