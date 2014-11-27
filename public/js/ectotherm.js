$(function() {
	
	$.get("/temperature", function(data) {
		$('#temperature').html(data.f);
	}, "json");

});