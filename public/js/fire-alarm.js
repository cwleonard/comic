var alarmSound = null;

var alarmOn = false;

var f1 = new Image();
var f2 = new Image();
var f3 = new Image();

var f1r = new Image();
var f2r = new Image();
var f3r = new Image();

var alarmUpImg = new Image();
var alarmDownImg = new Image();

f1.src = "/images/generic_frog_jump_1.svg";
f2.src = "/images/generic_frog_jump_2.svg";
f3.src = "/images/generic_frog_jump_3.svg";

f1r.src = "/images/generic_frog_jump_1r.svg";
f2r.src = "/images/generic_frog_jump_2r.svg";
f3r.src = "/images/generic_frog_jump_3r.svg";

alarmUpImg.src = "/images/fire_alarm.svg";
alarmDownImg.src = "/images/fire_alarm_down.svg";

var aniFrames  = [  f1,  f2,  f3 ];
var aniFramesR = [ f1r, f2r, f3r ];

function frameCycler(elem, initialFrames) {
	
	var me = elem[0];
	
	me.frameArray = initialFrames;
	me.f = 0;
	me.changeFrame = function() {
		
		$(me).attr("src", me.frameArray[me.f].src);
		me.f++;
		if (me.f === me.frameArray.length) {
			me.f = 0;
		}
		setTimeout(me.changeFrame, 250);
		
	};
	me.changeFrame();
	
	elem.on("reverse", function() {
		if (me.frameArray === aniFrames) {
			me.frameArray = aniFramesR;
		} else {
			me.frameArray = aniFrames;
		}
	});
	
}

function startAnimation(elem) {
	
	var sizerWidth  = Number($(elem).parent().css('width').replace(/\D/g, ''));
	
	var trvl = 50 + (Math.floor(Math.random() * 60));
	var speed = 30  + (Math.floor(Math.random() * 20));;

	elem.pos = Number($(elem).css('left').replace('px', ''));
	elem.moveFunction = moveLeftRight;
	elem.noBounce = false;
	elem.pps = speed * (sizerWidth / 100);
	if (elem.frameArray === aniFramesR) {
		// did we already animate once and end up pointing left?
		elem.direction = -1;
		elem.rightBound = elem.pos;
		elem.leftBound = elem.rightBound - (sizerWidth * (trvl / 100));
	} else {
		// either first time or facing right
		elem.direction = 1;
		elem.leftBound = elem.pos;
		elem.rightBound = elem.leftBound + (sizerWidth * (trvl / 100));
	}

	animated.push(elem);
	
	frameCycler($(elem), (elem.frameArray ? elem.frameArray : aniFrames));
	
}

function stopAnimation(elem) {
	
	elem.changeFrame = function() { /* noop */ };
	elem.f = 0;
	$(elem).off("reverse");
	
	for (var i = 0; i < animated.length; i++) {
		if (animated[i] === elem) {
			animated.splice(i, 1);
		}
	}
	
}

function loopSound(sound) {
	
	sound.play({
		onfinish: function() {
			if (alarmOn) {
				loopSound(sound);
			}
		}
	});
	
}

function toggleAlarm() {

	if (alarmOn) {
		
		alarmOn = false;
		
		stopAnimation($('#frog1')[0]);
		stopAnimation($('#frog2')[0]);
		stopAnimation($('#frog3')[0]);
		stopAnimation($('#frog4')[0]);
		stopAnimation($('#frog5')[0]);
		stopAnimation($('#frog6')[0]);
		
		$('#alarm').attr("src", alarmUpImg.src);
		
	} else {
		
		alarmOn = true;
		
		loopSound(alarmSound);
		
		startAnimation($('#frog1')[0]);
		startAnimation($('#frog2')[0]);
		startAnimation($('#frog3')[0]);
		startAnimation($('#frog4')[0]);
		startAnimation($('#frog5')[0]);
		startAnimation($('#frog6')[0]);

		$('#alarm').attr("src", alarmDownImg.src);

	}

}

$(function() {

	soundManager.setup({
		url : '/swf/',
		onready : function() {
			alarmSound = soundManager.createSound({
				id : 'hitSound',
				url : '/audio/alarm.mp3'
			});
		},
		ontimeout : function() {
			console.log("could not start soundmanager!");
		}
	});	

	$('#alarm').click(function() {
		toggleAlarm();
	});
	
});