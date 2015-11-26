module.exports = function() {
	
	return {
	    
		/*
		 * Returns a Date object that represents Thanksgiving (US)
		 * for this year. The fourth Thursday in November.
		 */
		thanksgiving: function() {
		    
		    var d = new Date();
		    
		    d.setDate(1);
		    d.setMonth(10);
		    
		    while (d.getDay() != 4) {
		        d.setDate(d.getDate()+1);
		    }
		    
		    d.setDate(d.getDate()+21);
		    
			return d;
			
		},
		
		/*
		 * This function return true during the Christmas season.
		 * I define that as Thanksgiving through the end of December.
		 */
		isChristmasSeason: function() {
			
			var monthToday = (new Date()).getMonth();
			var dateToday = (new Date()).getDate();
			
			return (monthToday == 11 || (monthToday == 10 && dateToday >= this.thanksgiving().getDate()));
			
		}
	
	};
	
};