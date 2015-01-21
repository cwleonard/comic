var translationOn = false;

function translateToad() {
	
	if (translationOn) {
		
		$('#toad-bubble-1').html('Welcome, new employees! I think you\'ll enjoy working here at Toads.co.');
		$('#toad-bubble-2').html('Please take advantage of our numerous perks such as our all-you-can-eat insect buffet and unlimited vacation time.');
		$('#toad-bubble-3').html('Our business plan is to harness synergies created by customer goodwill and manifest outstanding content.');
		
	} else {
	
		$('#toad-bubble-1').html('<i>Hello, fools. I will enjoy enslaving you.</i>');
		$('#toad-bubble-2').html('<i>I will fatten you up and keep you working 24x7. You will have no life apart from this company. And you will like it.</i>');
		$('#toad-bubble-3').html('<i>We are going to trick people into giving us intimate details of their lives, which we will sell to others. I will be rich!</i>');

	}
	
	translationOn = !translationOn;
	
}