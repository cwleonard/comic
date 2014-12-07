function doDayChart(numDays) {

	var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	$.get('/stats/viewsByDay/' + numDays, function(data) {
		
		var labels = [];
		var values = [];
		for (d in data) {
			
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
		

		var chartData = [ {
			value : data.firefox,
			color : "#F7464A",
			highlight : "#FF5A5E",
			label : "Firefox"
		}, {
			value : data.chrome,
			color : "#46BFBD",
			highlight : "#5AD3D1",
			label : "Chrome"
		}, {
			value : data.ie,
			color : "#FDB45C",
			highlight : "#FFC870",
			label : "IE"
		}, {
			value : data.safari,
			color : "#FDB45C",
			highlight : "#FFC870",
			label : "Safari"
		}, {
			value : data.other,
			color : "#FD045C",
			highlight : "#FF9870",
			label : "Other"
		} ];
		
		console.log(chartData);
		
		var opts = {
			"responsive": true
		};
		
		var ctx = document.getElementById("agentsChart").getContext("2d");
		var myChart = new Chart(ctx).Pie(chartData, opts);

	}, 'json');

}


$(function() {
	
	doDayChart(7);
	doAgentChart(7);
	
});
