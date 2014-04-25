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

$(function() {
	
	var lastTime = null;
	var counter1 = 0;
	var counter2 = 0;
	var direction = 1;
	
	function run(timestamp) {

		var elapsed;
		if (lastTime === null) {
			lastTime = timestamp;
		}
		elapsed = timestamp - lastTime;
		lastTime = timestamp;
		
		move = false;
		counter1 += elapsed;
		counter2 += elapsed;
		if (counter1 >= 100) {
			counter = 0;
			move = true;
		}
		if (counter2 >= 1500) {
			counter2 = 0;
			direction *= -1;
		}
		
		if (move) {
			$("img[move='true'").each(function(idx, elem) {
				var l = $(elem).css('left');
				var l2 = Number(l.replace('px', ''));
				$(elem).css('left', (l2-direction) + 'px');
			});
		}
		
		var me = this;
		window.requestAnimationFrame(function(e) { run(e); });
		
	}
	
	var me = this;
	window.requestAnimationFrame(function(e) { run(e); });
	
});
