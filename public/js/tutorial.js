var step = 0;
var steps = [ ".cTitle", "#ceo-1", "#bubble-1", "#business-2", "#rock-2",
              "#text-1", "#bubble-4", "#ceo-4", "#tags", "#extraText"];

var advance = function() {

	if (step > 0) {
		$(steps[step-1]).popover("hide");
	}

	if (step == steps.length) {
		$(steps[step]).popover("hide");
	} else {
		
		$(steps[step]).popover("show");
		step++;

		$('html, body').animate({
			scrollTop: $(".popover").offset().top
		}, 1000);

	}

};
	

$(function() {

	var contentBuilder = function(txt, btnTxt) {
		
		var btn = "<button onclick='advance();' class='btn btn-primary'>" + btnTxt + "</button>";
		
		var str = "<p>" + txt + "</p>";
		str += "<p class='pull-right'>" + btn + "</p>";
		
		return str;
		
	};
	
	
	
	var titleContent = "Here is the title of the comic. It's usually " +
			"related to the story in some way. Often, it foreshadows " +
			"the punchline.";
	
	var ceoContent = "This frog is the CEO. He usually performs the role of " +
			"the straight man, setting up the jokes for the funny man.";
	
	var bubbleContent = "Words spoken by the frogs are displayed in these " +
			"bubbles. The bubble's stem points toward the speaker.";
	
	var businessContent = "This is Business Frog. He usually plays the role of " +
			"the funny man, with his comical misunderstanding of how to " +
			"run a technology company.";

	var rockContent = "Rocks often appear between the frogs. They use them " +
			"like desks. If you worked outside, your desk might be a rock too.";

	var frameContent = "This is the third frame of the comic. Most have " +
			"four frames. Scroll down to keep reading.";
	
	var bubbleContent2 = "This bubble contains the punchline. It should be funny.";
	
	var ceoContent2 = "The CEO frog appears upset as he hears the punchline. " +
			"At this point, however, you should be amused.";
	
	var tagsContent = "The tags here provide links to other comics about these " +
			"subjects or with these characters.";
	
	var extraContent = "The text in this area provides commentary from the " +
			"comic author. This is where he usually tries to convince " +
			"you that it was actually funny.";

	$('.cTitle').popover({
		content : contentBuilder(titleContent, "Got it!"),
		placement : "bottom",
		trigger : "manual",
		container : "#comicArea",
		html : true
	});
	
	$('#ceo-1').popover({
		html: true,
		content : contentBuilder(ceoContent, "Okay!"),
		placement : "top",
		trigger : "manual",
		container : "#comicArea"
	});

	$('#bubble-1').popover({
		html: true,
		content : contentBuilder(bubbleContent, "Next"),
		placement : "bottom",
		trigger : "manual",
		container : "#comicArea"
	});

	$('#business-2').popover({
		html: true,
		content : contentBuilder(businessContent, "Next"),
		placement : "top",
		trigger : "manual",
		container : "#comicArea"
	});
	
	$('#rock-2').popover({
		html: true,
		content : contentBuilder(rockContent, "Whatever!"),
		placement : "top",
		trigger : "manual",
		container : "#comicArea"
	});
	
	$('#text-1').popover({
		html: true,
		content : contentBuilder(frameContent, "Sure..."),
		placement : "right",
		trigger : "manual",
		container : "#comicArea"
	});
	
	$('#bubble-4').popover({
		html: true,
		content : contentBuilder(bubbleContent2, "Okay!"),
		placement : "bottom",
		trigger : "manual",
		container : "#comicArea"
	});
	
	$('#ceo-4').popover({
		html: true,
		content : contentBuilder(ceoContent2, "Fine!"),
		placement : "right",
		trigger : "manual",
		container : "#comicArea"
	});

	$('#tags').popover({
		html: true,
		content : contentBuilder(tagsContent, "Please Stop!"),
		placement : "top",
		trigger : "manual",
		container : "#comicArea"
	});
	
	$('#extraText').popover({
		html: true,
		content : contentBuilder(extraContent, "Finish"),
		placement : "top",
		trigger : "manual",
		container : "#comicArea"
	});
	
	
	
	$('#inputModalLabel').html("Learn How to Use Amphibian.com!");
	$('#inputModal .modal-body').html("Let's take a quick tutorial of how to operate this web comic!");
	
	$('#pay-button-text').addClass("btn btn-primary");
	$('#pay-button-text').on("click", function() {
		showPaymentModal();
	});
	
	$('#confirmInputButton').unbind('click');
	
	$('#confirmInputButton').click(function() {
		$('#inputModal').modal('hide');
		advance();
	});
	
	$('#inputModal').modal('show');
	
});

