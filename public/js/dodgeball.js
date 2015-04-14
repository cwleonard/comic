var sound = null;

var f1 = new Image();
var f2 = new Image();
var f3 = new Image();

f1.src = "/images/generic_frog_jump_1.svg";
f2.src = "/images/generic_frog_jump_2.svg";
f3.src = "/images/generic_frog_jump_3.svg";

var aniFrames = [ f1, f2, f3 ];
var f = 0;


function cycleFrame() {
	
	$('#dodge-frog-1').attr("src", aniFrames[f].src);
	f++;
	if (f === aniFrames.length) {
		f = 0;
	}
	
	setTimeout(cycleFrame, 250);
	
}

$(function() {
	
//	soundManager.setup({
//		  url: '/swf/',
//		  onready: function() {
//		    popSound = soundManager.createSound({
//		      id: 'popSound',
//		      url: '/audio/pop.mp3'
//		    });
//		  },
//		  ontimeout: function() {
//		    // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
//			  console.log("could not start soundmanager!");
//		  }
//		});	

	$('#dodge-frog-1').on("reverse", function() {
		
		console.log("frog reversing direction");
		
	});
	
	$('#cell-2').unbind();
	$('#cell-2').click(function(e) {

		var x;
		
		if (e.target === this) {
			x = e.offsetX;
		} else {
			x = e.offsetX + $(e.target).position().left;
		}
		
		//console.log(x);
		
		var ball = $('#ball');
		var newBall = ball.clone();
		newBall.attr("id", "ball-" + (Math.random() * 1000));
		
		newBall.attr("animated", "true");
		newBall.attr("speed", "250");
		newBall.attr("travel", "80");
		newBall.attr("direction", "down");
		
		
		newBall.css("left", (x - (ball.width()/2)) + "px");
		$(this).append(newBall);

		
		// ---------------
		
		var sizerHeight = Number($(this).css('height').replace(/\D/g, ''));
		
		var trvl = 80;
		var speed = 250;
		
		newBall.pos = Number($(newBall).css('top').replace('px', ''));
		newBall.direction = 1;
		newBall.upperBound = newBall.pos;
		newBall.lowerBound = newBall.upperBound + (sizerHeight * (trvl / 100));
		newBall.moveFunction = moveUpDown;
		newBall.noBounce = false;
		newBall.pps = speed;

		animated.push(newBall);
		
		// ---------------
		
		
	});	
	
	
	setTimeout(cycleFrame, 250);
	
});