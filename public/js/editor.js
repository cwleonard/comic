function doSave() {
	$.ajax({
		url: '/data',
		type: 'POST',
		data: $('#data').val(),
		contentType: 'application/json; charset=utf-8',
		dataType: 'text',
		success: function(data) {
			console.log(data);
		}
	});

}

function doSave2() {
	
	var cobj = {
		cells: []
	};
	$('#comicArea div.box').each(function(idx, elem) {
		console.log('found box element');
		var b = {imgs: []};
		$(elem).find(".divimg").each(function(idx, elem) {
			console.log('found image element');
			var t = $(elem).css('top');
			var l = $(elem).css('left');
			b.imgs.push({
				top: t,
				left: l
			});
		});
		cobj.cells.push(b);
	});
	
	$('#data').val(JSON.stringify(cobj));

}

function addCell() {

	$('#comicArea').append("<div class='box'></div>");

}

$(function() {
	
	$.contextMenu({
		
		selector: '.box',
		items: {
			bgcolor: {
				name: 'Background',
				type: 'text',
				value: '#FFFFFF'
			},
			sep1: "----------",
			addImage: {
				name: "Add Image",
				callback: function(key, options) {
					console.log(key);
					// see http://stackoverflow.com/questions/4948582/jquery-draggable-and-resizable
					$(options.$trigger).append("<div class='divimg'><img style='height: 100px; width: 100px;' src='/images/frog.svg'/></div>");
					$('.box > .divimg').draggable();
					$('.box > .divimg > img').resizable({aspectRatio: true});

				}
			}
		}
		
	});
	
});
