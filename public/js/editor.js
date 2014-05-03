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

function rgb2hex(rgb) {
	
	function hex(x) {
		return ("0" + parseInt(x).toString(16)).slice(-2);
	}
	var r = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	var h = '#' + hex(r[1]) + hex(r[2]) + hex(r[3]);
	return h.toUpperCase();

}

function doSave2() {
	
	var cobj = {
		cells: []
	};
	$('#comicArea div.box').each(function(idx, elem) {
		
		console.log('found box element');
		
		var bgc =$(elem).css('background-color');
		if (bgc.search("rgb") != -1) {
			bgc = rgb2hex(bgc);
		}
		
		var b = {
			background: bgc,
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


function setupMenu(imgSelectOptions) {
	
	
	
	$.contextMenu({
		
		zIndex: 100,
		selector: '.box',
		items: {
			bgcolor: {
				name: 'Background',
				type: 'text',
				value: '#FFFFFF'
			},
			sep1: "----------",
			pickImage: {
				name: "Select Image",
				type: 'select',
				options: imgSelectOptions
			},
			addImage: {
				name: "Add Image",
				callback: function(key, options) {
					console.log(key);
					
					var $this = this;
					var o = $.contextMenu.getInputValues(options, $this.data());
					var selectedImage = o.pickImage;
					
					if (selectedImage) {
						
						var d = document.createElement('div');
						var i = document.createElement('img');

						$(i).css('height','100px');
						$(i).css('width','100px');
						$(i).attr('src', '/images/' + selectedImage);

						$(d).addClass('divimg');
						$(d).append(i);

						// see http://stackoverflow.com/questions/4948582/jquery-draggable-and-resizable
						$(options.$trigger).append(d);

						$(d).draggable();
						$(i).resizable({aspectRatio: true});

					}

				}
			},
			sep2: "----------",
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

		},
		events: {
			show: function(opt) {
				var $this = this;
				var bgc = $this.css('background-color');
				if (bgc.search("rgb") != -1) {
					bgc = rgb2hex(bgc);
				}
				var d = {
					bgcolor: bgc
				};
				$.contextMenu.setInputValues(opt, d);
			},
			hide: function(opt) {
				var $this = this;
				var o = $.contextMenu.getInputValues(opt, $this.data());
				var c = o.bgcolor;
				if (c.search(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/) != -1) {
					console.log('good color: ' + c);
					$this.css('background-color', c.toUpperCase());
				}
			}
		}
		
	});

	
	$.contextMenu({
		
		zIndex: 100,
		selector: '.divimg',
		items: {
			width: {
				name: 'Width',
				type: 'text',
				value: ''
			},
			left: {
				name: 'Left',
				type: 'text',
				value: ''
			},
			top: {
				name: 'Top',
				type: 'text',
				value: ''
			},
			sep1: "----------",
			pickImage: {
				name: "Select Image",
				type: 'select',
				options: imgSelectOptions
			},
			addImage: {
				name: "Change Image",
				callback: function(key, options) {
					
					var $this = this;
					var o = $.contextMenu.getInputValues(options, $this.data());
					var selectedImage = o.pickImage;
					
					$(options.$trigger).find("img").each(function(idx, elem) {
						$(elem).attr('src', '/images/' + selectedImage);
					});
					
				}
			},
			sep2: "----------",
			addBubble: {
				name: "Delete",
				callback: function(key, options) {
					$(options.$trigger).detach();
				}
			}

		},
		events: {
			show: function(opt) {
				var $this = this;
				var img = $this.find('img');
				var w = img.css('width');
				var t = $this.css('top');
				var l = $this.css('left');
				var isrc = img.attr('src');
				isrc = isrc.substring(isrc.lastIndexOf('/')+1);
				var d = {
					width: w,
					top: t,
					left: l,
					pickImage: isrc
				};
				$.contextMenu.setInputValues(opt, d);
			},
			hide: function(opt) {
				var $this = this;
				var o = $.contextMenu.getInputValues(opt, $this.data());
				$this.css('top', o.top);
				$this.css('left', o.left);
				var img = $this.find('img');
				if (img.css('width') !== o.width) {
					img.resizable('destroy');
					img.css('width', o.width);
					img.css('height', o.width);
					img.resizable({aspectRatio: true});
				}
			}
		}
		
	});
	
	
}

$(function() {
	
	$.ajax({
		url: '/images',
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			var sd = {};
			for (var i = 0; i < data.length; i++) {
				sd[data[i].filename]= data[i].filename;
			}
			setupMenu(sd);
		}
	});
	
});
