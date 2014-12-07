function doDayChart(numDays) {

	var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	$.get('/stats/viewsByDay/' + numDays, function(data) {
		
		var labels = [];
		var values = [];
		for (var d in data) {
			
			var l = "";
			if (numDays > 7) {
				var theDate = new Date(data[d].day);
				l = monthNames[theDate.getMonth()] + " " + theDate.getDate();
			} else {
				l = dayNames[(new Date(data[d].day)).getDay()];
			}
			
			labels.push(l);
			values.push(data[d].count);
		}
		
		var chartData = {
			    "labels": labels,
			    datasets: [
			        {
			            label: "Comic Views",
			            fillColor: "rgba(151,187,205,0.2)",
			            strokeColor: "rgba(0,51,102,1)",
			            pointColor: "rgba(151,187,205,1)",
			            pointStrokeColor: "#fff",
			            pointHighlightFill: "#fff",
			            pointHighlightStroke: "rgba(220,220,220,1)",
			            data: values
			        }
			    ]
			};		
		
		console.log(chartData);
		
		var opts = {
			"scaleGridLineColor": "rgba(0,0,0,.08)",
			"datasetStrokeWidth": 3,
			"responsive": true
		};
		
		var ctx = document.getElementById("viewsChart").getContext("2d");
		var myChart = new Chart(ctx).Line(chartData, opts);

	}, 'json');

}

function doAgentChart(numDays) {

	var hours = numDays * 24;
	
	$.get('/stats/agents/' + hours, function(data) {
		

		var browserChartData = [ {
			value : data.browser.firefox,
			color : "#F7464A",
			highlight : "#FF5A5E",
			label : "Firefox"
		}, {
			value : data.browser.chrome,
			color : "#46BFBD",
			highlight : "#5AD3D1",
			label : "Chrome"
		}, {
			value : data.browser.ie,
			color : "#0000FF",
			highlight : "#6666FF",
			label : "IE"
		}, {
			value : data.browser.safari,
			color : "#FDB45C",
			highlight : "#FFC870",
			label : "Safari"
		}, {
			value : data.browser.other,
			color : "#FD045C",
			highlight : "#FF9870",
			label : "Other"
		} ];

		var osChartData = [ {
			value : data.os.windows,
			color : "#F7464A",
			highlight : "#FF5A5E",
			label : "Windows"
		}, {
			value : data.os.mac,
			color : "#46BFBD",
			highlight : "#5AD3D1",
			label : "Mac"
		}, {
			value : data.os.ios,
			color : "#FDB45C",
			highlight : "#FFC870",
			label : "iOS"
		}, {
			value : data.os.android,
			color : "#FDB45C",
			highlight : "#FFC870",
			label : "Android"
		}, {
			value : data.os.linux,
			color : "#3D048C",
			highlight : "#3F9870",
			label : "Linux"
		}, {
			value : data.os.other,
			color : "#34045C",
			highlight : "#339870",
			label : "Other"
		} ];

		var engineChartData = [ {
			value : data.engine.gecko,
			color : "#F7464A",
			highlight : "#FF5A5E",
			label : "Gecko"
		}, {
			value : data.engine.khtml,
			color : "#46BFBD",
			highlight : "#5AD3D1",
			label : "KHTML"
		}, {
			value : data.engine.trident,
			color : "#0000FF",
			highlight : "#6666FF",
			label : "Trident"
		}, {
			value : data.engine.webkit,
			color : "#FDB45C",
			highlight : "#FFC870",
			label : "Webkit"
		}, {
			value : data.engine.other,
			color : "#3D048C",
			highlight : "#3F9870",
			label : "Other"
		} ];

		console.log(browserChartData);
		console.log(osChartData);
		console.log(engineChartData);
		
		var opts = {
			"responsive": true
		};
		
		var ctx1 = document.getElementById("browsersChart").getContext("2d");
		var bChart = new Chart(ctx1).Pie(browserChartData, opts);

		var ctx2 = document.getElementById("osChart").getContext("2d");
		var oChart = new Chart(ctx2).Pie(osChartData, opts);

		var ctx3 = document.getElementById("enginesChart").getContext("2d");
		var eChart = new Chart(ctx3).Pie(engineChartData, opts);

	}, 'json');

}

$(function() {
	
	doDayChart(7);
	doAgentChart(7);
	
});
