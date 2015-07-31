
function createMeme(txt1, txt2) {
	
	$.post("/memeGen", {
		text1: txt1,
		text2: txt2
	}, function(data) {
		
		$('#meme-image').attr("src", data.imgUrl);
		$('#meme-share-link').attr("href", data.shareUrl);
		
	}, "json");
	
}

$(function() {
	
	$('#cell-3').html("<img id='meme-image' style='width: 100%' src='/simg/frog-meme.jpg'/>");
	
	$('#confirmInputButton').unbind('click');
	
	$('#line2-text').remove();
	$('#inputModal .modal-body').append("<div id='line2-text' style='margin-top: 15px;' class='form-group'><label for='someMoreText'>Enter Some More Text</label><input id='someMoreText' type='text' placeholder='some more text' class='form-control'></div>");
	
	$('#confirmInputButton').click(function() {
		createMeme($('#someText').val(), $('#someMoreText').val());
		$('#inputModal').modal('toggle');
	});
	
	$('#meme-image').click(function() {
		$('#inputModal').modal('toggle');
	});
	
});