$(function() {

	var pubDate = new Date("11 May 2015");
	var nowDate = new Date();
	
	var frogsHired = Math.floor(((nowDate - pubDate) / 1000) / 5);
	
	
	// 9007199254740992
	
	var hireFrog = function() {
		
		$('#hiredSoFar').html(frogsHired);
		frogsHired++;
		setTimeout(hireFrog, 5000);
		
	};
	
	hireFrog();
	
	
});