function toggleNav() {

	$('#info').css('width', $('#sizer').css('width'));
	$('#info').toggle();

}

$(function() {
	
	var addPoint = 300;

	var newDiv = document.createElement("div");
	
	$(newDiv).css("position", "fixed");
	$(newDiv).css("bottom", "0");
	$(newDiv).css("left", "0");
	$(newDiv).css("z-index", "400");
	$(newDiv).css("background-color", "#ABCCAB");
	$(newDiv).css("width", "100%");
	$(newDiv).css("padding-top", "10px");
	$(newDiv).css("padding-bottom", "10px");
	$(newDiv).css("border-top", "black 1px solid");
	
	$(newDiv).html("<p style='text-align: center;'><a style='color: #000000; text-decoration: underline;' id='navControl' href='javascript:toggleNav();'>Navigation Control Toggle</a></p>");

	$('#info').before(newDiv);
	$('#info').hide();
	
	$(newDiv).append($('#info'));
	
	$(window).scroll(function(){
		
		if ($(this).scrollTop() > addPoint) {
			
			$('#sizer').append($('#cell-1').clone());
			$('#sizer').append($('#cell-2').clone());
			$('#sizer').append($('#cell-3').clone());
			$('#sizer').append($('#cell-4').clone());
			
			addPoint += 800;
			
		} 
		
	});
	
});
