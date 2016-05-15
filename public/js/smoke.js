$(function() {

	$('head').append('<link rel="stylesheet" href="css/smoke.css" type="text/css" />');
	
	function createSmoke(time, num) {

	    var st = (time / num); 
	    
		for( var i = 0; i < num; i++) {

		    var s = st * i;
		    
		    var d = "L";
		    if (((i+1) % 2) == 0) {
		        d = "R";
		    }
			
			$('#smoker').append('<span class="smokeball" style="animation: smoke' + d + ' ' + time + 's ' + s + 's infinite"></span>');
			
		}

	}

	
	
	createSmoke(5, 10);
	
});