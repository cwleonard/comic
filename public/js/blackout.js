$(function() {
	
	$("body").css("background-color", "black");
	$("header").css("background", "black");
	$("footer").css("background", "black");
	$(".ptop").css("background", "black");
	$("div.holiday").hide();
	$("div.box").css("box-shadow", "none");
	$("div.box").css("border", "1px solid #333333");
	
	var redAt = 600;
	var w = $("#sizer").width();
	if (w === 340) {
		redAt = 450;
	} else if (w === 310) {
		redAt = 350;
	}
	
	var scrollFunc = function() {
		
		if ($(this).scrollTop() > redAt) {
			
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
		
	};
	
	$(window).scroll(scrollFunc);
	
	var stopStuff = function() {
		
		$(window).off("scroll", scrollFunc);
		
		$("body").css("background-color", "");
		$("header").css("background", "");
		$("footer").css("background", "");
		$(".ptop").css("background", "");
		
	};
	
	$.Topic( "startComicNav" ).subscribe( stopStuff );
	
});
