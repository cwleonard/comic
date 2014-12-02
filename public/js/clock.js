$(function() {

	var hourHand = $('#hourHand');
	var minuteHand = $('#minuteHand');
	
	var setWatch = function() {
		
		var now = new Date();
		
		var currentHour = now.getHours();
		var currentMin = now.getMinutes();
		
		var hdeg = currentHour * 30;
		var mdeg = currentMin * 6;
		
		hourHand.css('transform', 'rotate(' + hdeg + 'deg');
		hourHand.css('-webkit-transform', 'rotate(' + hdeg + 'deg');
		hourHand.css('-ms-transform', 'rotate(' + hdeg + 'deg');

		minuteHand.css('transform', 'rotate(' + mdeg + 'deg');
		minuteHand.css('-webkit-transform', 'rotate(' + mdeg + 'deg');
		minuteHand.css('-ms-transform', 'rotate(' + mdeg + 'deg');

		setTimeout(setWatch, 30000);
		
	};
	
	setWatch();
	
});