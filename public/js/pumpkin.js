$(function() {

	var light = function() {
		
	    $('#p-light').animate({backgroundColor: '#ffff66'}, 2000);
	    
		setTimeout(dark, 3000);
		
	};

   var dark = function() {
	        
        $('#p-light').animate({backgroundColor: '#000000'}, 2000);
	        
        setTimeout(light, 3000);
	        
    };

	light();
	
});