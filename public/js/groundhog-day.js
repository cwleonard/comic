$(function(){
	
	var addPoint = 300;
	
	$(window).scroll(function(){
		
		if ($(this).scrollTop() > addPoint) {
			
			$('#info').before($('#cell-1').clone());
			$('#info').before($('#cell-2').clone());
			$('#info').before($('#cell-3').clone());
			$('#info').before($('#cell-4').clone());
			
			addPoint += 800;
			
		} 
		
	});
	
});
