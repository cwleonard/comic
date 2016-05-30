$(function() {

	$('head').append('<link rel="stylesheet" href="css/rain2.css" type="text/css" />');
	
	// number of drops created.
	var nbDrop = 25; 

	// function to generate a random number range.
	function randRange( minNum, maxNum) {
	  return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
	}

	var stuff = [ "fa fa-music", "fa fa-file-text-o", 
	              "fa fa-image", "fa fa-folder-open",
	              "fa fa-line-chart" ];
	
	// function to generate drops
	function createRain(c) {

		for (var j = 0; j < 6; j++) {

			for( var i = 1; i < nbDrop; i++) {
				
				var dropLeft = randRange(0,500);
				var dropTop = randRange(-1000 - (j*180),0);

				var thing = randRange(0, 5);

				$('#cell-' + c).append('<div class="drop" id="drop-'+c+'-'+i+'"><p class="free-text standard-text"><i class="' + stuff[thing] + '"></i></p></div>');
				$('#drop-'+c+'-'+i).css('left',dropLeft);
				$('#drop-'+c+'-'+i).css('top',dropTop);
			}

		}

	}
	// Make it rain
	createRain("0");
	createRain("1");
	
});
