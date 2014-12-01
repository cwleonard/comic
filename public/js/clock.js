$(function() {

	var hourHand = $('#hourHand');
	var minuteHand = $('#minuteHand');
	
	var setWatch = function() {
		
		var now = new Date();
		
		var currentHour = now.getHours();
		var currentMin = now.getMinutes();
		
		var hdeg = currentHour * 30;
		var mdeg = currentMin * 6;
		
		hourHand.css('-webkit-transform', 'rotate(' + hdeg + 'deg');
		minuteHand.css('-webkit-transform', 'rotate(' + mdeg + 'deg');
		
		setTimeout(setWatch, 60000);
		
	};
	
	setWatch();
	
});