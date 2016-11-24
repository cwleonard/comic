$(function() {
	
	$("body").css("background-color", "black");
	$("header").css("background", "black");
	$("footer").css("background", "black");
	$(".ptop").css("background", "black");
	$("div.holiday").hide();
	$("div.box").css("box-shadow", "none");
	$("div.box").css("border", "1px solid #333333");
	
	
	$(window).scroll(function() {
		
		if ($(this).scrollTop() > 600) {
			
			$("body").css("background-color", "red");
			$("header").css("background", "red");
			$("footer").css("background", "red");
			$(".ptop").css("background", "red");
			$("#cell-3").css("background", "red");
			
		} else {
			
			$("body").css("background-color", "black");
			$("header").css("background", "black");
			$("footer").css("background", "black");
			$(".ptop").css("background", "black");
			$("#cell-3").css("background", "black");
			
		}
		
	});

	
});
