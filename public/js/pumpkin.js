$(function() {

	var light = function() {
		
	    $('#p-light-1').animate({backgroundColor: '#ffff66'}, 1800);
        $('#p-light-2').animate({backgroundColor: '#ffff66'}, 2000);
        $('#p-light-3').animate({backgroundColor: '#ffff66'}, 2200);
	    
		setTimeout(dark, 2400);
		
	};

   var dark = function() {
	        
        $('#p-light-1').animate({backgroundColor: '#000000'}, 1800);
        $('#p-light-2').animate({backgroundColor: '#000000'}, 2000);
        $('#p-light-3').animate({backgroundColor: '#000000'}, 2200);
	        
        setTimeout(light, 2400);
	        
    };

	light();
	
});