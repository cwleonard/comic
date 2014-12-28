/*
 * This ensures that we will always have a requestAnimationFrame function,
 * even in old browsers (iOS < 6 is one example).
 */
if ( !window.requestAnimationFrame ) {
 
	window.requestAnimationFrame = ( function() {
 
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( callback, element ) {
 			window.setTimeout( function() { callback((new Date()).getTime()); }, 1000 / 60 );
 		};
 
	} )();
 
}

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

function replaceComic(id, push) {
	
	if (push === undefined) {
		push = true;
	}
	
	$('body,html').animate({scrollTop: 0}, 200);

	$('#comicArea').hide();
	$('#loading').show();
	
	$.get('/chtml/' + id, function(data) {
		
		$("#comicArea").html(data);
		
		if (push) {
			var cid = $('#sizer').attr('comicId');
			var stateObj = { comicId: cid };
			if (history.pushState) {
				history.pushState(stateObj, "comic " + cid, cid);
			}
		}
		
		// may want to adjust page title
		var tElem = $('.cTitle');
		if (tElem.length != 0) {
			document.title = 'Amphibian.com - ' + tElem.text();
		} else {
			document.title = 'Amphibian.com';
		}
		
		// build a new Pinterest button
		build_pinterest_button($('#pin')[0]);

		$('#comicArea').show();
		$('#loading').hide();

		setupAnimation();

	}, 'html');
	
}

$(function() {

	// set the mailto address in this way so it's not easy for robots to find
    var e = 'c' + 'a' + 's' + 'e' + 'y' + '@' + 'amphibian.com';
    var s = $("#mailme");
    s.attr('href','mailto:' + e);
    
    // listen for history changes
    $(window).bind('popstate', function(event) {
    	var s = event.originalEvent.state;
    	if (s && s.comicId) {
    		replaceComic(s.comicId, false);
    	}
    });
    
    // replace current URL with the current id, so back button behavior is consistent
    var currentId = $('#info').attr('comicId');
    if (history.replaceState) {
    	history.replaceState({
    		comicId: currentId
    	}, 'comic ' + currentId, currentId);
    } else {
    	// don't know
    }

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

		if (this.noBounce) {
			
			if (this.upperBound > np) {
				np = this.lowerBound;
			} else if (this.lowerBound < np) {
				np = this.upperBound;
			}
			
		} else {

			// reverse direction
			this.direction *= -1;

			if (this.upperBound > np) {
				np = this.upperBound + (this.upperBound - np);
			} else if (this.lowerBound < np) {
				np = this.lowerBound - (np - this.lowerBound);
			}

		}

	}
	
	$(this).css('top', np + 'px');
	this.pos = np;
	
}

function flicker(e) {

	if (typeof this.timespan === 'undefined') {
		this.timespan = -1;
	}

	if (typeof this.counter === 'undefined') {
		this.counter = 0;
	}

	if (this.timespan === -1) {
		// pick a new timespan value, based on speed
		this.timespan = this.pps * 1000 * Math.random();
	}
	
	this.counter += e;
	if (this.counter > this.timespan) {
		this.timespan = -1;
		this.counter = 0;
		$(this).toggle();
	}
	
}

function blink(e) {

	if (typeof this.timespan === 'undefined') {
		this.timespan = -1;
	}

	if (typeof this.counter === 'undefined') {
		this.counter = 0;
	}

	if (this.timespan === -1) {
		this.timespan = this.pps * 1000;
	}
	
	this.counter += e;
	if (this.counter > this.timespan) {
		this.timespan = -1;
		this.counter = 0;
		$(this).toggle();
	}
	
}

var animated = [];
function setupAnimation() {
	animated = [];
	$("img[animated='true']").each(function(idx, elem) {
		
		var trvl = Number($(elem).attr('travel'));
		trvl = trvl || 0;
		
		if (trvl > 0) {

			var sizerWidth  = Number($(elem).parent().css('width').replace(/\D/g, ''));
			var sizerHeight = Number($(elem).parent().css('height').replace(/\D/g, ''));
			
			var dir = $(elem).attr('direction');
			var nb = ($(elem).attr('nobounce') === 'true' ? true : false);

			if (dir === 'left') {
				// when moving left, right bound is starting location, left bound is trvl less than that
				elem.pos = Number($(elem).css('left').replace('px', ''));
				elem.direction = -1;
				elem.rightBound = elem.pos;
				elem.leftBound = elem.rightBound - (sizerWidth * (trvl / 100));
				elem.moveFunction = moveLeftRight;
				elem.noBounce = nb;
			} else if (dir === 'right') {
				// when moving right, left bound is starting location, right bound is trvl more than that
				elem.pos = Number($(elem).css('left').replace('px', ''));
				elem.direction = 1;
				elem.leftBound = elem.pos;
				elem.rightBound = elem.leftBound + (sizerWidth * (trvl / 100));
				elem.moveFunction = moveLeftRight;
				elem.noBounce = nb;
			} else if (dir === 'up') {
				elem.pos = Number($(elem).css('top').replace('px', ''));
				elem.direction = -1;
				elem.lowerBound = elem.pos;
				elem.upperBound = elem.lowerBound - (sizerHeight * (trvl / 100));
				elem.moveFunction = moveUpDown;
				elem.noBounce = nb;
			} else if (dir === 'down') {
				elem.pos = Number($(elem).css('top').replace('px', ''));
				elem.direction = 1;
				elem.upperBound = elem.pos;
				elem.lowerBound = elem.upperBound + (sizerHeight * (trvl / 100));
				elem.moveFunction = moveUpDown;
				elem.noBounce = nb;
			} else if (dir === 'flicker') {
				elem.moveFunction = flicker;
			} else if (dir === 'blink') {
				elem.moveFunction = blink;
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

		window.requestAnimationFrame(function(e) { run(e); });

		var elapsed;
		if (lastTime === null) {
			lastTime = timestamp;
		}
		elapsed = timestamp - lastTime;
		lastTime = timestamp;
		
		animated.forEach(function (elem, idx) {
			elem.moveFunction(elapsed);
		});
		
	}
	
	window.requestAnimationFrame(function(e) { run(e); });
	
});

$(function() {
	setupAnimation();
});
