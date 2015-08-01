function postData(d) {
	$.ajax({
		url: '/data',
		type: 'POST',
		data: JSON.stringify(d),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function(data) {
			$('#cid').val(data.id);
			$('#saveResults').text('Successfully saved as new id ' + data.id);
			$('#saveModal').modal('toggle');
		}
	});

}

function putData(id, d) {
	$.ajax({
		url: '/data/' + id,
		type: 'PUT',
		data: JSON.stringify(d),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function(data) {
			$('#cid').val(data.id);
			$('#saveResults').text('Successfully saved as existing id ' + data.id);
			$('#saveModal').modal('toggle');
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

/**
 * Saves the current comic. If this is a comic that has been loaded (i.e. one that
 * is already in the database) the existing comic is updated. If this is
 * a new comic, it is added to the database.
 * 
 * @param evt
 */
function doSave(evt) {

	var asNew = false;
	var existingId = $('#cid').val();
	if (existingId === '') {
		asNew = true;
	}
	
	var cobj = buildComicOjbect();
	if (asNew) {
		postData(cobj);
	} else {
		putData(existingId, cobj);
	}

}

/**
 * Ignores the fact that this could be an existing comic and adds it to
 * the database with a new id.
 * 
 * @param evt
 */
function doSaveAsNew(evt) {

	var cobj = buildComicOjbect();
	postData(cobj);

}

function makeId(pfx) {
	var n = null;
	while (n === null || $('#' + n).length > 0) {
		n = pfx + '-' + Math.floor(((Math.random() * 100000) + 1));
	}
	return n;
}

function makeOid() {
	return makeId('object');
}

function makeBid() {
	return makeId('bubble');
}

function makeTid() {
	return makeId('text');
}

/**
 * Given a jQuery element for a div with class "divimg" this function will return
 * an object that represents that image suitable for saving as part of the comic data.
 * 
 * Values for top, left, and width are returned as Numbers and are in pixels. Some uses
 * require them converted to % of the cell, but that will have to be done after getting
 * the object.
 * 
 * @param iEl
 * @returns object representing the image
 */
function imageToObject(iEl) {
	
	// sometimes, the style for 'top' and 'left' comes back as 'auto'...
	// in these cases, we should treat these values as 0
	var draggableTop  = isNaN(iEl.css('top').replace('px', '')) ? 0 : Number(iEl.css('top').replace('px', ''));
	var draggableLeft = isNaN(iEl.css('left').replace('px', '')) ? 0 : Number(iEl.css('left').replace('px', ''));

	var wrapper = iEl.find("div.ui-wrapper");
	var wrapperTop = Number(wrapper.css('top').replace('px', ''));
	var wrapperLeft = Number(wrapper.css('left').replace('px', ''));

	// why am I doing this? because when the image was created, it was
	// given a top and left value. making it draggable and resizable sets
	// relative positioning on the ui-draggable (divimg) div and absolute
	// positioning on the ui-wrapper div. to get the actual location of
	// the image, we have to add those 2 values together. the values on
	// the ui-wrapper div don't change, but the values on ui-draggable might.
	var t = draggableTop + wrapperTop;
	var l = draggableLeft + wrapperLeft;

	var img = wrapper.find('img');
	var a = img.attr('alt') || '';
	var w = Number(img.css('width').replace('px', ''));
	var isrc = img.attr('src');
	isrc = isrc.substring(isrc.lastIndexOf('/')+1);
	var rot = img.attr('rot');
	var oid = img.attr('id') || makeOid();
	
	var d = {
		objId: oid,
		top: t,
		left: l,
		width: w,
		altText: a,
		r: rot,
		src: isrc
	};

	// is it hidden?
	var h = img.attr('hide') || '';
	if (h === 'true') {
		d.hide = true;
	}
	
	// is it animated?
	var spd = isNaN(iEl.attr("speed")) ? 0 : Number(iEl.attr("speed"));
	var trvl = isNaN(iEl.attr("travel")) ? 0 : Number(iEl.attr("travel"));
	if (spd > 0 && trvl !== 0) {
		var dir = iEl.attr("direction");
		var nb = iEl.attr("nobounce");
		d.move = true;
		d.speed = spd;
		d.travel = trvl;
		d.direction = dir;
		if (nb) {
			d.noBounce = nb;
		}
	}
	
	return d;
	
}


/**
 * Constructs a cell object from a given DOM element
 * 
 * @param elem
 */
function buildCellObject(elem) {
	
	var sizerWidth = Number($('#sizer').css('width').replace(/\D/g, ''));
	var sizerHeight = Number($(elem).css('height').replace(/\D/g, ''));
	
	var bgc = $(elem).css('background-color');
	if (bgc.search("rgb") != -1) {
		bgc = rgb2hex(bgc);
	}
	
	var b = {
			background: bgc,
			bubbles: [],
			text: [],
			imgs: []
	};

	var es = $(elem).attr("extraStyle") || '';
	if (es != '') {
		b.extraStyle = es;
	}
	
	var zi = 1;
	
	$(elem).find("div.divimg, p.bubble, p.free-text").each(function(idx, elem) {
		
		// ====================================== SPEECH BUBBLES ===============
		if ($(elem).hasClass("bubble")) {

			var bid = $(elem).attr('id') || makeBid();

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
			
			var rot = $(elem).attr('rot');

			$(elem).find("> span").each(function(idx, elem) {
				b.bubbles.push({
					objId: bid, 
					top: t,
					left: l,
					width: w,
					z: zi++,
					r: rot,
					stemPos: sp,
					text: $(elem).html()
				});
			});

		// ====================================== FREE TEXT ====================
		} else if ($(elem).hasClass("free-text")) {

			var tid = $(elem).attr('id') || makeTid();

			var cssTop = $(elem).css('top');
			var cssLeft = $(elem).css('left');
			var cssWidth = $(elem).css('width');
			var stdText = $(elem).hasClass('standard-text');

			// positions need converted to %
			var t = Number(cssTop.replace('px', ''));
			var l = Number(cssLeft.replace('px', ''));
			var w = Number(cssWidth.replace('px', ''));
			t = t * (1 / sizerHeight) * 100;
			l = l * (1 / sizerWidth) * 100;
			w = w * (1 / sizerWidth) * 100;
			
			var fs = (stdText ? 'standard-text' : 'olde-text');
			
			var rot = $(elem).attr('rot');
			
			$(elem).find("> span").each(function(idx, elem) {
				var tempObj = {
						objId: tid,
						top: t,
						left: l,
						width: w,
						z: zi++,
						r: rot,
						words: $(elem).html()
					};
				if (!stdText) tempObj.fstyle = "olde-text";
				b.text.push(tempObj);
			});
			
		// ====================================== IMAGES =======================
		} else if ($(elem).hasClass("divimg")) {
			
			var iObj = imageToObject($(elem));
			
			// positions need converted to %
			iObj.top = iObj.top * (1 / sizerHeight) * 100;
			iObj.left = iObj.left * (1 / sizerWidth) * 100;

			// width needs converted to %
			iObj.width = iObj.width * (1 / sizerWidth) * 100;

			// add z-index
			iObj.z = zi++;

			b.imgs.push(iObj);
			
		}
		
	});
	
	return b;
	
}

function buildComicOjbect() {
	
	var ct = $('#ctitle').val();
	var pd = $('#pubDate').val();
	var et = $('#extraText').val();
	var js = $('#extraJs').val();
	
	var cobj = {
		pubDate: pd,
		title: ct,
		extraText: et,
		cells: []
	};
	
	if (js !== '') {
		cobj.scripts = js.split(/\s*,\s*/);
	}
	
	$('#cellArea div.box').each(function(idx, elem) {
		
		var b = buildCellObject(elem);
		cobj.cells.push(b);
		
	});
	
	return cobj;

}

function addImage(cell, img) {

	var d = document.createElement('div');

	// see http://stackoverflow.com/questions/4948582/jquery-draggable-and-resizable
	$(cell).append(d);

	getImageAttributes(img.src, function(err, imgSize) {

		if (!err) {

			var sizerWidth = Number($('#sizer').css('width').replace('px', ''));
			var sizerHeight = Number($(cell).css('height').replace('px', ''));

			var i = document.createElement('img');
			
			var aspectRatio = imgSize.width / imgSize.height;

			var w = (img.width / 100) * sizerWidth;
			var h = w / aspectRatio;

			var l = (img.left / 100) * sizerWidth;
			var t = (img.top / 100) * sizerHeight;
			
			var rot = ( img.r ? 'rotate(' + img.r + 'deg)' : null);
 
			$(i).css('height', h + 'px');
			$(i).css('width', w + 'px');
			$(i).css('top', t + 'px');
			$(i).css('left', l + 'px');
			$(i).attr('src', '/images/' + img.src);
			$(i).attr('aspectRatio', aspectRatio);
			$(i).attr('alt', img.altText || '');
			$(i).attr('id', img.objId || makeOid());
			if (rot) {
				$(i).css('-webkit-transform', rot);
				$(i).css('-moz-transform', rot);
				$(i).attr('rot', img.r);
			}
			if (img.hide) {
				$(i).attr('hide', 'true');
				$(i).css('opacity', 0.5);
			}
			if (img.move) {
				$(d).attr('speed', img.speed);
				$(d).attr('travel', img.travel);
				$(d).attr('direction', img.direction);
			}

			$(d).addClass('divimg');
			$(d).append(i);


			$(d).draggable();
			$(i).resizable({aspectRatio: true});

			if (rot) {
				$(i).css('-webkit-transform', rot);
				// to prevent anything outside the div's square from being clipped
				// when rotated, set the overflow to 'visible' on the ui-wrapper div
				var wrapper = $(d).find("div.ui-wrapper");
				$(wrapper).css('overflow', 'visible');
			}
			
		}

	});
	
}

function createEditableParagraph(parent, contents) {
	
	var pText = contents.text || contents.words || 'What does the frog say?';
	var pLeft = contents.left || 5;
	var pTop = contents.top || 5;
	var pWidth = contents.width || 50;

	var sizerWidth = Number($('#sizer').css('width').replace(/\D/g, ''));
	var sizerHeight = Number($(parent).css('height').replace(/\D/g, ''));

	var w = (pWidth / 100) * sizerWidth;

	var l = (pLeft / 100) * sizerWidth;
	var t = (pTop / 100) * sizerHeight;
	
	var p = document.createElement('p');
	var s = document.createElement('span');
	$(s).html(pText);
	
	$(p).css('top', t + 'px');
	$(p).css('left', l + 'px');
	$(p).css('width', w + 'px');
	$(p).css('position', 'absolute');

	$(p).append(s);

	$(parent).append(p);

	$(p).draggable().resizable();
	$(s).editable({
		type: 'text',
		mode: 'inline',
		escape: false,
		value: pText
	});
	
	return p;

}

/**
 * Adds a speech bubble to the specified cell. The parameters
 * of the bubble can be specified via the optional parameter "b".
 * 
 * If specified, the "b" object can contain the following fields:
 *   - text - the words to appear in the bubble
 *   - left - left position, in %
 *   - top - top position, in %
 *   - width - bubble width, in %
 *   - stemPos - position of the stem. valid values are 25, 50, and 75
 * 
 * @param cell
 * @param b
 */
function addBubble(cell, b) {

	var bub = b || {};
	var stemPos = bub.stemPos || '50';
	
	var p = createEditableParagraph(cell, bub);

	var rot = ( bub.r ? 'rotate(' + bub.r + 'deg)' : null);

	$(p).attr('id', bub.objId || makeBid());
	$(p).addClass('bubble');
	$(p).addClass('bubble-text');
	$(p).addClass('bubble' + stemPos);

	if (rot) {
		$(p).css('-webkit-transform', rot);
		$(p).css('-moz-transform', rot);
		$(p).attr('rot', bub.r);
	}

	$(p).dblclick(toggleStemPosition);
	
}

/**
 * Adds a plain text area to the specified cell. The parameters
 * of the area can be specified via the optional parameter "t".
 * 
 * If specified, the "t" object can contain the following fields:
 *   - words - the words to appear in the area
 *   - left - left position, in %
 *   - top - top position, in %
 *   - width - area width, in %
 *   - fstyle - text style (defaults to "standard-text")
 * 
 * @param cell
 * @param t
 */
function addText(cell, t) {

	var txt = t || {};
	
	var p = createEditableParagraph(cell, txt);

	var rot = ( txt.r ? 'rotate(' + txt.r + 'deg)' : null);

	$(p).attr('id', txt.objId || makeTid());
	$(p).addClass('free-text');
	if (txt.fstyle) {
		$(p).addClass(txt.fstyle);
	} else {
		$(p).addClass('standard-text');
	}
	$(p).addClass('free-text-outline');

	if (rot) {
		$(p).css('-webkit-transform', rot);
		$(p).css('-moz-transform', rot);
		$(p).attr('rot', txt.r);
	}
	
	
	
	$(p).dblclick(toggleFontStyle);

	
}


function addCell(c) {

	var d = document.createElement('div');
	$(d).addClass('box');
	$('#cellArea').append(d);

	if (c) {
		
		var stuff = [];
		
		$(d).css('background-color', c.background);
		$.each(c.imgs || [], function(idx, obj) {
			stuff.push({
				'type': 'image',
				'object': obj
			});
		});
		
		if (c.extraStyle) {
			$(d).attr("extraStyle", c.extraStyle);
		}

		$.each(c.text || [], function(idx, obj) {
			stuff.push({
				'type': 'text',
				'object': obj
			});
		});

		if (c.bubble) {
			stuff.push({
				'type': 'bubble',
				'object': c.bubble
			});
		} else if (c.bubbles) {
			$.each(c.bubbles, function(idx, bub) {
				stuff.push({
					'type': 'bubble',
					'object': bub
				});
			});
		}
		
		// sort stuff by z-index
		stuff.sort(function(a, b) {
			var za = a.object.z || 0;
			var zb = b.object.z || 0;
			return za - zb;
		});
		
		// now add to cell
		$.each(stuff, function(idx, s) {
			
			if (s.type === 'image') {
				addImage(d, s.object);
			} else if (s.type === 'text') {
				addText(d, s.object);
			} else if (s.type === 'bubble') {
				addBubble(d, s.object);
			}
			
		});

	}

}

function clear() {
	
	$('#cid').val('');
	$('#ctitle').val('');
	$('#extraJs').val('');
	$('#pubDate').val(moment().format('YYYY-MM-DD'));
	$('#cellArea div.box').remove();
	
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
			var w = data.documentElement.getAttribute('width');
			var h = data.documentElement.getAttribute('height');
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

function toggleFontStyle(obj) {
	
	var t = obj.target;
	if ($(t).hasClass('standard-text')) {
		$(t).removeClass('standard-text');
		$(t).addClass('olde-text');
	} else if ($(t).hasClass('olde-text')) {
		$(t).removeClass('olde-text');
		$(t).addClass('standard-text');
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
				value: '#D3EEFF'
			},
			sep1: "----------",
			dupCell: {
				name: "Duplicate Cell",
				callback: function(key, options) {
					
					var copy = buildCellObject(options.$trigger);
					addCell(copy);
					
				}
			},
			remCell: {
				name: "Remove Cell",
				callback: function(key, options) {
					
					$(options.$trigger).detach();
					
				}
			},
			moveCellUp: {
				name: "Move Cell Up",
				callback: function(key, options) {
					
					var n = options.$trigger;
					n.insertBefore(n.prev());
					
				}
			},
			moveCellDown: {
				name: "Move Cell Down",
				callback: function(key, options) {
					
					var n = options.$trigger;
					n.insertAfter(n.next());
					
				}
			},
			sep2: "----------",
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
			sep3: "----------",
			addBubble: {
				name: "Add Bubble",
				callback: function(key, options) {

					addBubble(options.$trigger);
					
				}
			},
			addText: {
				name: "Add Text",
				callback: function(key, options) {

					addText(options.$trigger);
					
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
				name: 'Width (px)',
				type: 'text',
				value: ''
			},
			left: {
				name: 'Left (px)',
				type: 'text',
				value: ''
			},
			top: {
				name: 'Top (px)',
				type: 'text',
				value: ''
			},
			rotation: {
				name: 'Rotation (deg)',
				type: 'text',
				value: ''
			},
			sep1: "----------",
			altText: {
				name: 'Alt Text',
				type: 'text',
				value: ''
			},
			objId: {
				name: 'Object ID',
				type: 'text',
				value: ''
			},
			hideThis: {
				name: "Hidden",
				type: "checkbox",
				selected: false
			},
			pickImage: {
				name: "Select Image",
				type: 'select',
				options: imgSelectOptions
			},
			changeImage: {
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
			animation: {
				name: "Animation...",
				callback: function(key, options) {
					
					editAnimation(this);
					
				}
			},
			sep4: "----------",
			dupImage: {
				name: "Duplicate",
				callback: function(key, options) {
					
					var c = options.$trigger.parent();
					var d = imageToObject(this);					
					
					// for calling addImage(), width should be %, not pix
					var sizerWidth = Number($('#sizer').css('width').replace('px', ''));
					d.width = ( d.width / sizerWidth ) * 100;

					// put the duplicate in the default location to start with...
					d.top = 5;
					d.left = 5;
					
					addImage(c, d);
					
				}
			},
			delImage: {
				name: "Delete",
				callback: function(key, options) {
					$(options.$trigger).detach();
				}
			}

		},
		events: {
			show: function(opt) {
				
				var $this = this;
				
				var d = imageToObject($this);
				d.pickImage = d.src;
				d.rotation = d.r;
				d.hideThis = d.hide ? true : false;
				$.contextMenu.setInputValues(opt, d);
				
			},
			hide: function(opt) {
				
				var $this = this;
				var o = $.contextMenu.getInputValues(opt, $this.data());

				var newTop = isNaN(o.top.replace('px', '')) ? 0 : Number(o.top.replace('px', ''));
				var newLeft = isNaN(o.left.replace('px', '')) ? 0 : Number(o.left.replace('px', ''));

				var wrapper = $this.find("div.ui-wrapper");
				var wrapperTop = Number(wrapper.css('top').replace('px', ''));
				var wrapperLeft = Number(wrapper.css('left').replace('px', ''));

				$this.css('top', (newTop - wrapperTop) + "px");
				$this.css('left', (newLeft - wrapperLeft) + "px");

				var img = $this.find('img');
				img.attr('alt', o.altText);
				img.attr('id', o.objId);
				
				var rot = '';
				if (o.rotation !== '') {
					rot = 'rotate(' + o.rotation + 'deg)';
					wrapper.css('overflow', 'visible');
				}
				img.css('-webkit-transform', rot);
				img.attr('rot', o.rotation);

				if (o.hideThis) {
					img.attr('hide', 'true');
					img.css('opacity', 0.5);
				} else {
					img.removeAttr('hide');
					img.css('opacity', '');
				}
				
				var currentWidth = img.css('width').replace('px', '');
				if (currentWidth !== o.width) {
					// only do this if the width was changed, because it is a more
					// expensive operation
					img.resizable('destroy');
					var aspectRatio = Number(img.attr('aspectRatio'));
					var w = Number(o.width.replace('px', ''));
					img.css('width', w + "px");
					img.css('height', (w / aspectRatio) + "px");
					img.resizable({aspectRatio: true});
					img.parent().css('overflow', 'visible');
				}

			}
		}
		
	});

	$.contextMenu({
		
		zIndex: 100,
		selector: 'p.bubble, p.free-text',
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
			rotation: {
				name: 'Rotation (deg)',
				type: 'text',
				value: ''
			},
			sep1: "----------",
			objId: {
				name: 'Object ID',
				type: 'text',
				value: ''
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
				var i = $this.attr('id');
				var r = $this.attr("rot");
				var w = $this.css('width');
				var t = $this.css('top');
				var l = $this.css('left');
				var d = {
					objId: i,
					width: w,
					top: t,
					left: l,
					rotation: r
				};
				$.contextMenu.setInputValues(opt, d);
			},
			hide: function(opt) {
				var $this = this;
				var o = $.contextMenu.getInputValues(opt, $this.data());
				$this.attr('id', o.objId);
				$this.css('top', o.top);
				$this.css('left', o.left);
				if ($this.css('width') !== o.width) {
					$this.resizable('destroy');
					$this.css('width', o.width);
					$this.resizable();
				}
				var rot = '';
				if (o.rotation !== '') {
					rot = 'rotate(' + o.rotation + 'deg)';
				}
				$this.css('-webkit-transform', rot);
				$this.attr('rot', o.rotation);
			}
		}
		
	});

}

function toggleImgUpload() {
	
	$('#myModal').modal('toggle');
	
}

/**
 * Display a modal dialog with a list of the existing comics from which to select
 * a comic for editing.
 */
function showComicList() {
	
	$('#comicSelect').empty();
	$('#loadModal').modal('toggle');
	$.ajax({
		url: '/list',
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			$.each(data, function(idx, val) {
				var oval = val.published + " - " + val.title + " - id " + val.id;
				$('#comicSelect').append($("<option></option>").attr("value", val.id).text(oval));
			});
		}
	});
	
}

function editAnimation(elem) {
	
	$('#confirmAnimateButton').unbind('click');

	$('#speed').val($(elem).attr('speed'));
	$('#travel').val($(elem).attr('travel'));
	$('#direction').val($(elem).attr('direction'));
	
	$('#animateModal').modal('toggle');
	
	$('#confirmAnimateButton').click(function() {
		
		var speed = $('#speed').val();
		var travel = $('#travel').val();
		var direction = $('#direction').val();
		
		$(elem).attr('speed', speed);
		$(elem).attr('travel', travel);
		$(elem).attr('direction', direction);
		
		$('#animateModal').modal('toggle');
		
	});

}

function dataToComic(data) {
	
	clear();
	
	var pd = moment(data.pubDate.substring(data.pubDate.indexOf(',') + 1), ['DD MMM YYYY' , 'D MMM YYYY']);
	
	if (data.id) {
		$('#cid').val(data.id);
	}
	$('#ctitle').val(data.title);
	$('#extraText').val(data.extraText);
	if (data.scripts && data.scripts.length > 0) {
		$('#extraJs').val(data.scripts.join());
	}
	$('#pubDate').val(pd.format('YYYY-MM-DD'));

	$.each(data.cells, function(idx, c) {
		addCell(c);
	});
	
}

function doLoad() {
	
	var id = $('#comicSelect').val();

	$.ajax({
		url: '/data/' + id,
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			
			dataToComic(data);
			$('#loadModal').modal('toggle');
			
		}
	});
	
}

function showImport() {
	
	$('#importModal').modal('show');
	
}

function doImport() {
	
	var data = JSON.parse($('#jsonData').val());
	data.id = null; // clear id if it was supplied
	dataToComic(data);
	$('#importModal').modal('hide');
	
}


$(function() {
	
	$('#clearButton').click(clear);
	$('#addCellButton').click(addCell);
	$('#saveButton').click(doSave);
	$('#saveAsNewButton').click(doSaveAsNew);
	$('#addImageButton').click(toggleImgUpload);
	$('#loadButton').click(showComicList);
	$('#importButton').click(showImport);
	$('#confirmImportButton').click(doImport);
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

$(function() {
	
	// set up the data import to allow drag-n-drop of a file
	
	$(window).on(
			"dragenter",
			function(e) {
				$("#jsonData").addClass("droptarget");
				e.preventDefault();
				e.stopPropagation();
			}
	);

	$("#jsonData").on("drop", function (evt) {

		$(this).removeClass("droptarget");
		
		if (evt.originalEvent.dataTransfer) {

			if (evt.originalEvent.dataTransfer.files.length) {

				evt.preventDefault();
				evt.stopPropagation();

				var file = evt.originalEvent.dataTransfer.files[0];

				if (file.type !== "text/plain") {
					console.log("wrong file type");
				} else {

					var reader = new FileReader();
					reader.onload = function(fevent) {
						var txt = fevent.target.result;
						$("#jsonData").val(txt);
					};
					reader.readAsText(file);

				}

			}

		}

	});
	
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
