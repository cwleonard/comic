$(function() {
	
	var cookie = $.cookie('frog-tracking-cookie');
	if (cookie) {
		// you have the cookie!
	} else {
		$.cookie('frog-tracking-cookie', '2c flour, .5tsp baking soda, .5tsp salt, .75c, 1c brown sugar, .5c white sugar, 1tbl vanilla, 1 egg, 1 egg yolk, 2c choc. chips. mix together, bake at 350F for 15 min.', { expires: 90 });
	}
	
});