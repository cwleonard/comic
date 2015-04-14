var popSound = null;

function fallDown(elapsed) {
	
	if (this.pos > this.stopAt) {
		this.allDone = true;
		$(this).attr("src", "/images/generic_frog_bubble_popped2.svg");
	}
	
	if (this.allDone) return;
	
	var m = 150 * (elapsed / 1000);
	var np = this.pos + m;

	$(this).css('top', np + 'px');
	this.pos = np;
	
}

function popBubble(e) {
	
	if (popSound) {
		popSound.play();
	}

	var bub = e.target;

	if ($(bub).attr("id") === "bubble3") {
		$("#shadow3")[0].moveFunction = function() {};
	}
	
	var sizerHeight = Number($(bub).parent().css('height').replace(/\D/g, ''));
	
	bub.pos = Number($(bub).css('top').replace('px', ''));
	bub.moveFunction = fallDown;
	
	var sp = 0.425;
	if ($(bub).attr("id") === "bubble2") {
		sp = 0.37;
	} else if ($(bub).attr("id") === "bubble3") {
		sp = 0.515;
	}
	bub.stopAt = sizerHeight - (sizerHeight * sp);
	
	$(bub).attr("src", "/images/generic_frog_bubble_popped.svg");
	
	$(bub).unbind("click");
	
}

$(function() {
	
	soundManager.setup({
		  url: '/swf/',
		  onready: function() {
		    popSound = soundManager.createSound({
		      id: 'popSound',
		      url: '/audio/pop.mp3'
		    });
		  },
		  ontimeout: function() {
		    // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
			  console.log("could not start soundmanager!");
		  }
		});	
	
	$('#bubble1').click(popBubble);
	$('#bubble2').click(popBubble);
	$('#bubble3').click(popBubble);
	
});