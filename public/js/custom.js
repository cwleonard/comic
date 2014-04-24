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