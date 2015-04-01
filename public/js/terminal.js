$(function() {

	
	var cid = $('#sizer').attr('comicId');
	var stateObj = { comicId: cid };
	if (history.pushState) {
		history.pushState(stateObj, "comic " + cid, cid);
	}

	
	var ctitle = $('.cTitle').text();
	
	var extraText = $('#extraText').html();
	
	var cells = $('#sizer > div.box');
	
	var links = $('#hiddenLinks > a');
	
	var prevLink = null,
	    nextLink = null;
	if (links.size() > 1) {
		prevLink = links.eq(0).attr("href");
		nextLink = links.eq(1).attr("href");
	} else {
		prevLink = links.attr("href");
	}
	
	
	var str = "Welcome to Amphibian.com!^2000<br><br>";
	str += "Based on user feedback, this site is now compatible with Internet Explorer 5.^1000<br>";
	str += "That means we're totally text-based. Enjoy the comics!^1000<br><br>";
	str += "Today's comic is entitled \"" + ctitle + ".\"^2000<br>";

	cells.each(function(idx) {
		
		str += "<br>";
		
		var character = $(this).find('img').attr("alt");
		var bubble = $(this).find('p.bubble').text();
		
		str += character + " says, \"" + bubble + "\"^1000";
		
	});
	
	str += "<br><br>-------------<br><br>";
	str += extraText;
	str += "<br><br>-------------<br><br>";
	if (prevLink) {
		str += "<a href='" + prevLink + "'>&lt;--- Previous Comic</a>";
	}
	if (nextLink) {
		str += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='" + nextLink + "'>Next Comic ---&gt;</a>";
	}
	
	$("body > div").remove();
	$("body > footer").remove();
	
	$("body").css("background-color", "#000000");
	
	var tdiv = document.createElement("div");
	$(tdiv).css("font-family", "monospace");
	$(tdiv).css("font-size", "16pt");
	$(tdiv).css("margin", "20px");
	$(tdiv).css("color", "#009900");
	//$(tdiv).css("white-space", "pre");

	$("body").append(tdiv);
	
	$(tdiv).typed({
		strings: [ str ],
		typeSpeed: 30
	});
	
	
	
});