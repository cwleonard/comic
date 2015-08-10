$(function() {

	$('#bomb').click(function() {

		var thisComic = $("#info").attr("comicid");
		var today = new Date();
		
		if (today.getDay() === 3) {
			
			$.get("/fb/shares/" + thisComic, function(data) {
				
				if (data.shares >= 100) {

					$("#science-bubble").html("Oh no! The criteria have been met! Run!");
					$("#criteria").fadeOut();
					$("#line").fadeOut();
					$("#fuse").show();
					
					setTimeout(function() {
						
						$("#logic-explode").show();
						
						setTimeout(function() {

							$("#fuse").hide();
							$("#bomb").hide();
							$("#bomb-shadow").hide();
							
							$("#ear-1").show();
							$("#ear-2").show();
							$("#ear-3").show();
							
							//$("#science-bubble").html("Pointed ear growth initiated by exposure to logic bomb detonation. Fascinating.");
							$("#science-bubble").html("I feel much more logical. Fascinating.");
							
							$("#logic-explode").hide();
							
						}, 4000);
						
						
					}, 4000);
					
					//console.log("boom!");
					
				} else {
					
					$("#science-bubble").html("There's no way this thing gets 100 shares on Facebook. We're safe.");
					//console.log("sorry, not enough shares!");
					
				}
				
			}, "json");
			
		} else {
			
			$("#science-bubble").html("It's not Wednesday. Computers start counting at zero. Day 3 is Wednesday.");
			//console.log("sorry, not wednesday!");
			
		}
	
	});

});