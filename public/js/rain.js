$(function() {

	$('head').append('<link rel="stylesheet" href="css/rain.css" type="text/css" />');
	
	// number of drops created.
	var nbDrop = 300; 

	// function to generate a random number range.
	function randRange( minNum, maxNum) {
	  return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
	}

	// function to generate drops
	function createRain(c) {

		for( var i = 1; i < nbDrop; i++) {
			var dropLeft = randRange(0,1000);
			var dropTop = randRange(-1000,1000);

			$('#cell-' + c).append('<div class="drop" id="drop-'+c+'-'+i+'"></div>');
			$('#drop-'+c+'-'+i).css('left',dropLeft);
			$('#drop-'+c+'-'+i).css('top',dropTop);
		}

	}
	// Make it rain
	createRain("0");
	createRain("1");
	createRain("2");
	
});