module.exports = function() {
	
	return {
	    
		thanksgiving: function() {
		    
		    var d = new Date();
		    
		    d.setDate(1);
		    d.setMonth(10);
		    
		    while (d.getDay() != 4) {
		        d.setDate(d.getDate()+1);
		    }
		    
		    d.setDate(d.getDate()+21);
		    
			return d;
			
		}
	
	};
	
};