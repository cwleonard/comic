
var f1 = new Image();
var f2 = new Image();
var f3 = new Image();
var f4 = new Image();
var f5 = new Image();
var f6 = new Image();

f1.src = "/images/generic_frog_face_front.svg";
f2.src = "/images/generic_frog_facing_right.svg";
f3.src = "/images/generic_frog_rear_right.svg";
f4.src = "/images/generic_frog_back.svg";
f5.src = "/images/generic_frog_rear_left.svg";
f6.src = "/images/generic_frog_facing_left.svg";

var speeds = [ 100, 150, 200 ];
var aniFrames  = [  f1,  f2,  f3,  f4,  f5,  f6 ];

function frameCycler(elem, initialFrames) {
	
	var me = elem[0];
	
	me.speed = speeds[Math.floor(Math.random() * speeds.length)];
	
	me.frameArray = initialFrames;
	me.f = 0;
	me.changeFrame = function() {
		
		$(me).attr("src", me.frameArray[me.f].src);
		me.f++;
		if (me.f === me.frameArray.length) {
			me.f = 0;
			me.speed = speeds[Math.floor(Math.random() * speeds.length)];
		}
		setTimeout(me.changeFrame, me.speed);
		
	};
	me.changeFrame();
	
}

$(function() {

	frameCycler($('#spinner-1'), aniFrames);
	frameCycler($('#spinner-2'), aniFrames);
	frameCycler($('#spinner-3'), aniFrames);
	
});