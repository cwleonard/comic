function postData(d) {
	$.ajax({
		url: '/data',
		type: 'POST',
		data: JSON.stringify(d),
		contentType: 'application/json; charset=utf-8',
		dataType: 'text',
		success: function(data) {
			console.log(data);
		}
	});

}

function putData(id, d) {
	$.ajax({
		url: '/data/' + id,
		type: 'PUT',
		data: JSON.stringify(d),
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

function doSave(evt) {

	var cobj = buildComicOjbect();
	postData(cobj);

}

function doUpdate(evt) {

	var cobj = buildComicOjbect();
	putData($('#hiddenId').val(), cobj);
	
}

function buildComicOjbect() {
	
	var sizerWidth = Number($('#sizer').css('width').replace(/\D/g, ''));
	
	var ct = $('#ctitle').val();
	var pd = $('#pubDate').val();
	
	var cobj = {
		pubDate: pd,
		title: ct,
		cells: []
	};
	
	$('#sizer div.box').each(function(idx, elem) {
		
		var sizerHeight = Number($(elem).css('height').replace(/\D/g, ''));
		
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
			var cssTop = $(elem).css('top');
			var cssLeft = $(elem).css('left');
			var cssWidth = $(elem).css('width');
			var sp = $(elem).hasClass('bubble25') ? 25 : ($(elem).hasClass('bubble75') ? 75 : 50);
			
			// positions need converted to %
			var t = Number(cssTop.replace('px', ''));
			var l = Number(cssLeft.replace('px', ''));
			var w = Number(cssWidth.replace('px', ''));
			t = t * (1 / sizerHeight) * 100;
			l = l * (1 / sizerWidth) * 100;
			w = w * (1 / sizerWidth) * 100;
			
			$(elem).find("span").each(function(idx, elem) {
				b.bubble = {
						top: t,
						left: l,
						width: w,
						stemPos: sp,
						text: $(elem).text()
				};
			});
		});
		
		$(elem).find(".divimg").each(function(idx, elem) {
			
			var draggableTop = Number($(elem).css('top').replace('px', ''));
			var draggableLeft = Number($(elem).css('left').replace('px', ''));
			
			$(elem).find("div.ui-wrapper").each(function(idx, elem) {

				var wrapperTop = Number($(elem).css('top').replace('px', ''));
				var wrapperLeft = Number($(elem).css('left').replace('px', ''));

				// why am I doing this? because when the image was created, it was
				// given a top and left value. making it draggable and resizable sets
				// relative positioning on the ui-draggable (divimg) div and absolute
				// positioning on the ui-wrapper div. to get the actual location of
				// the image, we have to add those 2 values together. the values on
				// the ui-wrapper div don't change, but the values on ui-draggable might.
				var t = draggableTop + wrapperTop;
				var l = draggableLeft + wrapperLeft;
				
				// positions need converted to %
				t = t * (1 / sizerHeight) * 100;
				l = l * (1 / sizerWidth) * 100;
				
				// width needs converted to %
				var cssWidth = $(elem).css('width');
				var w = Number(cssWidth.replace('px', ''));
				w = w * (1 / sizerWidth) * 100;
				
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
	
	return cobj;

}

function addImage(cell, img) {

	getImageAttributes(img.src, function(err, imgSize) {

		if (!err) {

			var sizerWidth = Number($('#sizer').css('width').replace('px', ''));
			var sizerHeight = Number($(cell).css('height').replace('px', ''));

			var d = document.createElement('div');
			var i = document.createElement('img');

			var w = (img.width / 100) * sizerWidth;
			var h = w / (imgSize.width / imgSize.height);

			var l = (img.left / 100) * sizerWidth; 
			var t = (img.top / 100) * sizerHeight;

			$(i).css('height', h + 'px');

			$(i).css('width', w + 'px');
			$(i).css('top', t + 'px');
			$(i).css('left', l + 'px');
			$(i).attr('src', '/images/' + img.src);

			$(d).addClass('divimg');
			$(d).append(i);

			// see http://stackoverflow.com/questions/4948582/jquery-draggable-and-resizable
			$(cell).append(d);

			$(d).draggable();
			$(i).resizable({aspectRatio: true});

		}

	});
	
}

function addBubble(cell, b) {

	var bub = b || {};
	var stemPos = bub.stemPos || '50';
	var txt = bub.text || 'What does the frog say?';
	var bLeft = bub.left || 5;
	var bTop = bub.top || 5;
	var bWidth = bub.width || 50;
	
	var sizerWidth = Number($('#sizer').css('width').replace(/\D/g, ''));
	var sizerHeight = Number($(cell).css('height').replace(/\D/g, ''));

	var w = (bWidth / 100) * sizerWidth;

	var l = (bLeft / 100) * sizerWidth; 
	var t = (bTop / 100) * sizerHeight;
	
	var p = document.createElement('p');
	var s = document.createElement('span');
	$(s).append(document.createTextNode(txt));
	
	$(p).css('top', t + 'px');
	$(p).css('left', l + 'px');
	$(p).css('width', w + 'px');
	$(p).css('position', 'absolute');
	
	$(p).addClass('bubble');
	$(p).addClass('bubble-text');
	$(p).addClass('bubble' + stemPos);
	$(p).append(s);
	
	$(p).dblclick(toggleStemPosition);
	
	$(cell).append(p);
	$(p).draggable().resizable();
	$(s).editable({
		type: 'text',
		mode: 'inline',
		success: function(response, newValue) {
			console.log(newValue);
		}
	});
	
}

function addCell(c) {

	var d = document.createElement('div');
	$(d).addClass('box');
	$('#sizer').append(d);
	
	if (c) {
		
		$(d).css('background-color', c.background);
		$.each(c.imgs, function(idx, obj) {
			addImage(d, obj);
		});

		//$.each(c.bubbles, function(idx, obj) {
			addBubble(d, c.bubble);
		//});

	}

}

function clear() {
	
	$('#ctitle').val('');
	$('#pubDate').val(moment().format('YYYY-MM-DD'));
	$('#sizer div.box').remove();
	
}

/**
 * Access a SVG on the server and extract the width and height from it.
 * If successful, the callback function will be invoked with one or two parameters.
 * The first parameter is the error encountered, or null if there was no error.
 * The second is an object containing width and height properties. 
 * 
 * @param image
 * @param cb function to be called when finished
 */
function getImageAttributes(image, cb) {
	
	$.ajax({
		url: '/images/' + image,
		type: 'GET',
		dataType: 'xml',
		success: function(data) {
			var w = data.rootElement.getAttribute('width');
			var h = data.rootElement.getAttribute('height');
			cb(null, {
				width: w,
				height: h
			});
		},
		error: function() {
			cb(new Error('could not get image attributes'));
		}
	});
	
	
}

function toggleStemPosition(obj) {
	
	var t = obj.target;
	if ($(t).hasClass('bubble50')) {
		$(t).removeClass('bubble50');
		$(t).addClass('bubble75');
	} else if ($(t).hasClass('bubble75')) {
		$(t).removeClass('bubble75');
		$(t).addClass('bubble25');
	} else if ($(t).hasClass('bubble25')) {
		$(t).removeClass('bubble25');
		$(t).addClass('bubble50');
	}
	
}

function setupMenu(imgSelectOptions) {
	
	$.contextMenu( 'destroy' );
	
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
					
					var $this = this;
					var o = $.contextMenu.getInputValues(options, $this.data());
					var selectedImage = o.pickImage;
					
					if (selectedImage) {
						
						addImage(options.$trigger, {
							src: selectedImage,
							width: 25,
							top: 5,
							left: 5
						});

					}

				}
			},
			sep2: "----------",
			addBubble: {
				name: "Add Bubble",
				callback: function(key, options) {

					addBubble(options.$trigger);
					
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
			moveBack: {
				name: "Move Back",
				callback: function(key, options) {
					var n = options.$trigger;
					n.insertBefore(n.prev());
				}
			},
			moveUp: {
				name: "Move Forward",
				callback: function(key, options) {
					var n = options.$trigger;
					n.insertAfter(n.next());
				}
			},
			sep3: "----------",
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

function toggleImgUpload() {
	
	$('#myModal').modal('toggle');
	
}

function showComicList() {
	
	$('#loadModal').modal('toggle');
	$.ajax({
		url: '/list',
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			$.each(data, function(idx, val) {
				var oval = val.id + " :: " + val.published + " :: " + val.title;
				$('#comicSelect').append($("<option></option>").attr("value", val.id).text(oval));
			});
		}
	});
	
}

function doLoad() {
	
	var id = $('#comicSelect').val();

	$.ajax({
		url: '/data/' + id,
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			
			clear();
			
			$('#loadModal').modal('toggle');
			
			var pd = moment(data.pubDate.substring(data.pubDate.indexOf(',') + 1), ['DD MMM YYYY' , 'D MMM YYYY']);
			
			$('#ctitle').val(data.title);
			$('#pubDate').val(pd.format('YYYY-MM-DD'));
			$('#hiddenId').val(data.id);

			$.each(data.cells, function(idx, c) {
				addCell(c);
			});
			
		}
	});
	
}

$(function() {
	
	$('#clearButton').click(clear);
	$('#addCellButton').click(addCell);
	$('#saveButton').click(doSave);
	$('#addImageButton').click(toggleImgUpload);
	$('#loadButton').click(showComicList);
	$('#confirmLoadButton').click(doLoad);
	
});

$(function() {
	
	$('#imgUpload').iframePostForm({
		json: true,
		post: function() {
			console.log('starting upload');
		},
		complete: function(resp) {
			console.log(resp);
			$('#myModal').modal('toggle');
			buildMenu();
		}
	});
	
});

$(function() {
	
	$('#datePicker').datetimepicker({
		pickTime : false
	});
	
	$('#pubDate').val(moment().format('YYYY-MM-DD'));
	
});

function buildMenu() {
	
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
	
}

$(function() {

	buildMenu();
	
});
