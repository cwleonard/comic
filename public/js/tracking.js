$(function() {
	
	var cookie = $.cookie('frog-tracking-cookie');
	if (cookie) {
		// you have the cookie! are you on the 12 Jan 2015 comic?
		if ($('#info').attr('comicid') === '112') {
			$('#milk-sign').html('You have one of our cookies, so you need some milk! Buy milk here now!');
			$('#frog-results').html('My plan was a success!<br/>Oh, I had to hire 83 cows. And 2 goats.');
		}
	} else {
		// you might need the cookie, if you are on the 24 Nov 2014 comic
		if ($('#info').attr('comicid') === '96') {
			$.cookie('frog-tracking-cookie', '2c flour, .5tsp baking soda, .5tsp salt, .75c, 1c brown sugar, .5c white sugar, 1tbl vanilla, 1 egg, 1 egg yolk, 2c choc. chips. mix together, bake at 350F for 15 min.', { expires: 90 });
		} else {
			$('#milk-sign').html('You don\'t have one of our delicious cookies! They were free on <a href="/96">November 24th!</a>');
			$('#frog-results').html('I didn\'t find anyone. And I need to refrigerate 4000 gallons of milk. Fast.');
		}
	}
	
});