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
	}, 'html');
	
}

$(function() {

    var e = 'c' + 'a' + 's' + 'e' + 'y' + '@' + 'amphibian.com';
    var s = $("#mailme");
    s.attr('href','mailto:' + e);

});

var animated = [];
function setupAnimation() {
	animated = [];
	$("img[animated='true'").each(function(idx, elem) {
		
		var trvl = Number($(elem).attr('travel'));
		
		// for now, everything starts by moving left
		elem.direction = -1;
		
		elem.pos = Number($(elem).css('left').replace('px', ''));
		
		if (elem.direction == -1) {
			// when moving left, right bound is starting location, left bound is trvl less than that
			elem.rightBound = elem.pos;
			elem.leftBound = elem.rightBound - trvl;
		} else {
			// when moving right, left bound is starting location, right bound is trvl more than that
			elem.leftBound = elem.pos;
			elem.rightBound = elem.leftBound + trvl;
		}
		
		elem.pps = Number($(elem).attr('speed'));
		
		animated.push(elem);
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
				
			var m = elem.pps * (elapsed / 1000);

			// calculate new position
			var np = elem.pos + (m * elem.direction);
			
			while (elem.leftBound > np || elem.rightBound < np) {
				
				// reverse direction
				elem.direction *= -1;
				
				if (elem.leftBound > np) {
					np = elem.leftBound + (elem.leftBound - np);
				} else if (elem.rightBound < np) {
					np = elem.rightBound - (np - elem.rightBound);
				}
				
			}
			
			$(elem).css('left', np + 'px');
			elem.pos = np;
			
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
