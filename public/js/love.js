$(function() {

    var thisComic = $("#info").attr("comicid");
    $.get("/fb/shares/" + thisComic, function(data) {
				
        if (data.shares >= 50) {

            $("#cell-4").show();
            $("#cell-5").show();
		
        }
				
    }, "json");
			
});