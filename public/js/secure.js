$(function() {

	if (window.location.protocol === "https:") {
		
		$('#gas-can').hide();
		$('#bear-trap').hide();
		$('#radioactive-sign').hide();
		
		$('#pirate').attr('src', '/images/pirate_arm_left.svg');
		
		$('#milk').show();
		$('#plate').show();
		$('#plate2').show();
		$('#pear').show();
		$('#flower').show();
		$('#donut').show();
		
		$('#frog-1').html("I already updated our web site.");
		$('#frog-2').html("You're right. I do feel safer.");

		$('#secure-message').html("Want to live dangerously? Click here to view the comic without encrypted communications!");
		$('#secure-message').attr('href', 'http://amphibian.com/177');
		
	}
	
});