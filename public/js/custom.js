/* Scroll To Top Starts */

$(".totop").hide();

$(function(){
	$(window).scroll(function(){
		if ($(this).scrollTop()>300)
		{
			$('.totop').fadeIn();
		} 
		else
		{
			$('.totop').fadeOut();
		}
	});

	$('.totop a').click(function (e) {
		e.preventDefault();
		$('body,html').animate({scrollTop: 0}, 500);
	});
});

/* Scroll To Top Ends */

function replaceComic(url) {
	
	$.get(url, function(data) {
		$("#comicArea").html(data);
		setupAnimation();
	}, 'html');
	
}

$(function() {

    var e = 'c' + 'a' + 's' + 'e' + 'y' + '@' + 'amphibian.com';
    var s = $("#mailme");
    s.attr('href','mailto:' + e);

});

function moveLeftRight(e) {
	
	var m = this.pps * (e / 1000);

	// calculate new position
	var np = this.pos + (m * this.direction);
	
	while (this.leftBound > np || this.rightBound < np) {
		
		// reverse direction
		this.direction *= -1;
		
		if (this.leftBound > np) {
			np = this.leftBound + (this.leftBound - np);
		} else if (this.rightBound < np) {
			np = this.rightBound - (np - this.rightBound);
		}
		
	}
	
	$(this).css('left', np + 'px');
	this.pos = np;
	
}

function moveUpDown(e) {
	
	var m = this.pps * (e / 1000);

	// calculate new position
	var np = this.pos + (m * this.direction);
	
	while (this.upperBound > np || this.lowerBound < np) {
		
		// reverse direction
		this.direction *= -1;
		
		if (this.upperBound > np) {
			np = this.upperBound + (this.upperBound - np);
		} else if (this.lowerBound < np) {
			np = this.lowerBound - (np - this.lowerBound);
		}
		
	}
	
	$(this).css('top', np + 'px');
	this.pos = np;
	
}


var animated = [];
function setupAnimation() {
	animated = [];
	$("img[animated='true']").each(function(idx, elem) {
		
		var trvl = Number($(elem).attr('travel'));
		trvl = trvl || 0;
		
		if (trvl > 0) {

			var dir = $(elem).attr('direction');

			if (dir === 'left') {
				// when moving left, right bound is starting location, left bound is trvl less than that
				elem.pos = Number($(elem).css('left').replace('px', ''));
				elem.direction = -1;
				elem.rightBound = elem.pos;
				elem.leftBound = elem.rightBound - trvl;
				elem.moveFunction = moveLeftRight;
			} else if (dir === 'right'){
				// when moving right, left bound is starting location, right bound is trvl more than that
				elem.pos = Number($(elem).css('left').replace('px', ''));
				elem.direction = 1;
				elem.leftBound = elem.pos;
				elem.rightBound = elem.leftBound + trvl;
				elem.moveFunction = moveLeftRight;
			} else if (dir === 'up') {
				elem.pos = Number($(elem).css('top').replace('px', ''));
				elem.direction = -1;
				elem.lowerBound = elem.pos;
				elem.upperBound = elem.lowerBound - trvl;
				elem.moveFunction = moveUpDown;
			} else if (dir === 'down') {
				elem.pos = Number($(elem).css('top').replace('px', ''));
				elem.direction = 1;
				elem.upperBound = elem.pos;
				elem.lowerBound = elem.upperBound + trvl;
				elem.moveFunction = moveUpDown;
			} else {
				// unknown direction value
				elem.moveFunction = function() {
					// no op
				};
			}

			var speed = $(elem).attr('speed');
			speed = speed || '0';
			elem.pps = Number(speed);

			animated.push(elem);

		}
		
	});
}

$(function () { 
	var lastTime = null;
	
	function run(timestamp) {

		var elapsed;
		if (lastTime === null) {
			lastTime = timestamp;
		}
		elapsed = timestamp - lastTime;
		lastTime = timestamp;
		
		animated.forEach(function (elem, idx) {
			elem.moveFunction(elapsed);
		});
			
		var me = this;
		window.requestAnimationFrame(function(e) { run(e); });
		
	}
	
	var me = this;
	window.requestAnimationFrame(function(e) { run(e); });
	
});

$(function() {
	setupAnimation();
});
