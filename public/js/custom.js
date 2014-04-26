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
				
			var pps = Number($(elem).attr('speed'));
			var m = pps * (elapsed / 1000);

			var trvl = Number($(elem).attr('travel'));
			
			var l = elem.left || Number($(elem).css('left').replace('px', ''));
			
			if (!elem.moved) {
				elem.moved = m;
			} else {
				elem.moved += m;
			}
			
			if (!elem.direction) {
				elem.direction = 1;
			}
			
			if (elem.moved >= trvl) {
				elem.direction *= -1;
				elem.moved = 0;
			}
			
			var l3 = l - (m * elem.direction);
			$(elem).css('left', l3 + 'px');
			elem.left = l3;
			
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
