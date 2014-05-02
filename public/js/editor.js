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
		var b = {
			bubble: undefined,
			imgs: []
		};
		
		$(elem).find("p.bubble").each(function(idx, elem) {
			var t = $(elem).css('top');
			var l = $(elem).css('left');
			var w = $(elem).css('width');
			$(elem).find("span").each(function(idx, elem) {
				b.bubble = {
						top: t,
						left: l,
						width: w,
						text: $(elem).text()
				};
			});
		});
		
		$(elem).find(".divimg").each(function(idx, elem) {
			console.log('found image element');
			var t = $(elem).css('top');
			var l = $(elem).css('left');
			$(elem).find("div.ui-wrapper").each(function(idx, elem) {
				var w = $(elem).css('width');
				$(elem).find("img").each(function(idx, elem) {
					var s = elem.src;
					s = s.substring(s.lastIndexOf('/')+1);
					b.imgs.push({
						top: t,
						left: l,
						width: w,
						src: s
					});
				});
			});
		});
		
		cobj.cells.push(b);
		
	});
	
	//$('#data').val(JSON.stringify(cobj));
	console.log(cobj);

}

function addCell() {

	var d = document.createElement('div');
	$(d).addClass('box');
	$('#comicArea').append(d);

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
					
					var d = document.createElement('div');
					var i = document.createElement('img');
					
					$(i).css('height','100px');
					$(i).css('width','100px');
					$(i).attr('src', '/images/frog.svg');
					
					$(d).addClass('divimg');
					$(d).append(i);
					
					// see http://stackoverflow.com/questions/4948582/jquery-draggable-and-resizable
					$(options.$trigger).append(d);
					
					$(d).draggable();
					$(i).resizable({aspectRatio: true});

				}
			},
			addBubble: {
				name: "Add Bubble",
				callback: function(key, options) {
					console.log(key);
					var p = document.createElement('p');
					var s = document.createElement('span');
					$(s).append(document.createTextNode('whatnot'));
					
					$(p).addClass('bubble');
					$(p).append(s);
					
					$(options.$trigger).append(p);
					$(p).draggable().resizable();
					$(s).editable({
						type: 'text',
						mode: 'inline',
						success: function(response, newValue) {
							console.log(newValue);
						}
					});
				}
			}

		}
		
	});
	
});
