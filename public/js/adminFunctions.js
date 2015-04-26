function doMenu() {
	
	$.contextMenu({
		
		zIndex: 999,
		selector: '.box',
		items: {
			dlImg: {
				name: "Download As Image",
				icon: "dl",
				callback: function(key, options) {
					
					var n = options.$trigger;
					
					var comicId = $('#info').attr('comicid');
					var cellId = Number($(n).attr('id').substring(5)) + 1;
					
					console.log("downloading image for comic " + comicId + ", cell " + cellId + "...");
					
					downloadURL("/images/cell/" + comicId + "/" + cellId);
					
				}
			}

		}
		
	});

	
}

var $idown;
function downloadURL(url) {
	if ($idown) {
		$idown.attr('src', url);
	} else {
		$idown = $('<iframe>', {
			id : 'idown',
			src : url
		}).hide().appendTo('body');
	}
}

$(function() {
	doMenu();
});

