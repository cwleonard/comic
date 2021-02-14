/*
 * This ensures that we will always have a requestAnimationFrame function,
 * even in old browsers (iOS < 6 is one example).
 */
if ( !window.requestAnimationFrame ) {
 
	window.requestAnimationFrame = ( function() {
 
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( callback, element ) {
 			window.setTimeout( function() { callback((new Date()).getTime()); }, 1000 / 60 );
 		};
 
	} )();
 
}

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

function replaceComic(id, push) {
	
	if (push === undefined) {
		push = true;
	}
	
	$('body,html').animate({scrollTop: 0}, 200);

	$('#comicArea').hide();
	$('#loading').show();
	
	$.Topic( "startComicNav" ).publish( id );
	
	$.get('/chtml/' + id, function(data) {
		
		$("#comicArea").html(data);
		
		if (push) {
			var cid = $('#sizer').attr('comicId');
			var stateObj = { comicId: cid };
			if (history.pushState) {
				history.pushState(stateObj, "comic " + cid, cid);
			}
		}
		
		// may want to adjust page title
		var tElem = $('.cTitle');
		if (tElem.length != 0) {
			document.title = 'Amphibian.com - ' + tElem.text();
		} else {
			document.title = 'Amphibian.com';
		}
		
		try {
		    doEmoji();
		} catch (e) {
		    console.log("emoji error! " + e);
		}
		
		$('#comicArea').show();
		$('#loading').hide();

		setupAnimation();
		
	    // get current TWC ranking
		$.get('/twc', function(data) {
			$("#twc-rank-num").html(data);
		}, 'text');
		
		$.Topic( "endComicNav" ).publish( id );
		
		try {
		    // build a new Pinterest button
		    build_pinterest_button($('#pin')[0]);
		} catch (e) {
		    console.log("pinterest error! " + e);
		}

		try {
			if ( (typeof DISQUS !== 'undefined') && $('#disqus_thread').length) {
				DISQUS.reset(
					{
						reload: true,
						config: function () {
							this.page.identifier = $('#sizer').attr('comicId');
							this.page.url = "http://amphibian.com/" + $('#sizer').attr('comicId');
						}
					});
			}
		} catch (e) {
			console.log("disqus error!", e);
		}

	}, 'html');
	
}

function showTipModal() {
	$('#tipModal').modal('show');
}

$(function() {

	// set the mailto address in this way so it's not easy for robots to find
    var e = 'c' + 'a' + 's' + 'e' + 'y' + '@' + 'amphibian.com';
    var s = $("#mailme");
    s.attr('href','mailto:' + e);
    
    // listen for history changes
    $(window).bind('popstate', function(event) {
    	var s = event.originalEvent.state;
    	if (s && s.comicId) {
    		replaceComic(s.comicId, false);
    	}
    });
    
    // replace current URL with the current id, so back button behavior is consistent
    var currentId = $('#info').attr('comicId');
    if (history.replaceState && window.location.href.indexOf("toads.co") === -1) {
        if (!window.location.href.endsWith("/latest")) {
            history.replaceState({
                comicId: currentId
            }, 'comic ' + currentId, currentId);
        } else {
            history.replaceState({
                comicId: currentId
            }, 'comic ' + currentId, "latest");
        }
    } else {
    	// don't know
    }
    
    // get current TWC ranking
	$.get('/twc', function(data) {
		$("#twc-rank-num").html(data);
	}, 'text');

});

function moveLeftRight(e) {
	
	var m = this.pps * (e / 1000);

	// calculate new position
	var np = this.pos + (m * this.direction);
	
	while (this.leftBound > np || this.rightBound < np) {
		
		// reverse direction
		this.direction *= -1;
		$(this).trigger("reverse");
		
		if (this.leftBound > np) {
			np = this.leftBound + (this.leftBound - np);
		} else if (this.rightBound < np) {
			np = this.rightBound - (np - this.rightBound);
		}
		
	}
	
	$(this).css('left', np + 'px');
	this.pos = np;
	
}

function moveUpDown(e) {
	
	var m = this.pps * (e / 1000);

	// calculate new position
	var np = this.pos + (m * this.direction);
	
	while (this.upperBound > np || this.lowerBound < np) {

		if (this.noBounce) {
			
			if (this.upperBound > np) {
				np = this.lowerBound;
			} else if (this.lowerBound < np) {
				np = this.upperBound;
			}
			
		} else {

			// reverse direction
			this.direction *= -1;
			$(this).trigger("reverse");

			if (this.upperBound > np) {
				np = this.upperBound + (this.upperBound - np);
			} else if (this.lowerBound < np) {
				np = this.lowerBound - (np - this.lowerBound);
			}

		}

	}
	
	$(this).css('top', np + 'px');
	this.pos = np;
	
}

function rotate(e) {
    
    var m = this.pps * (e / 1000);
    
    // calculate new rotation
    var nr = this.rot + m;
    
    $(this).css('transform', 'rotate(' + nr + 'deg)');
    $(this).css('-webkit-transform', 'rotate(' + nr + 'deg)');
    $(this).css('-mstransform', 'rotate(' + nr + 'deg)');
    
    this.rot = nr;
    
}

function flicker(e) {

	if (typeof this.timespan === 'undefined') {
		this.timespan = -1;
	}

	if (typeof this.counter === 'undefined') {
		this.counter = 0;
	}

	if (this.timespan === -1) {
		// pick a new timespan value, based on speed
		this.timespan = this.pps * 1000 * Math.random();
	}
	
	this.counter += e;
	if (this.counter > this.timespan) {
		this.timespan = -1;
		this.counter = 0;
		$(this).toggle();
	}
	
}

function blink(e) {

	if (typeof this.timespan === 'undefined') {
		this.timespan = -1;
	}

	if (typeof this.counter === 'undefined') {
		this.counter = 0;
	}

	if (this.timespan === -1) {
		this.timespan = this.pps * 1000;
	}
	
	this.counter += e;
	if (this.counter > this.timespan) {
		this.timespan = -1;
		this.counter = 0;
		$(this).toggle();
	}
	
}

var animated = [];
function setupAnimation() {
	animated = [];
	$("img[animated='true']").each(function(idx, elem) {
		
		var trvl = Number($(elem).attr('travel'));
		trvl = trvl || 0;
		
		if (trvl > 0) {

			var sizerWidth  = Number($(elem).parent().css('width').replace(/\D/g, ''));
			var sizerHeight = Number($(elem).parent().css('height').replace(/\D/g, ''));
			
			var dir = $(elem).attr('direction');
			var nb = ($(elem).attr('nobounce') === 'true' ? true : false);

			var speed = $(elem).attr('speed');
			speed = speed || '0';
			speed = Number(speed);

			if (dir === 'left') {
				// when moving left, right bound is starting location, left bound is trvl less than that
				elem.pos = Number($(elem).css('left').replace('px', ''));
				elem.direction = -1;
				elem.rightBound = elem.pos;
				elem.leftBound = elem.rightBound - (sizerWidth * (trvl / 100));
				elem.moveFunction = moveLeftRight;
				elem.noBounce = nb;
				speed = speed * (sizerWidth / 100);
			} else if (dir === 'right') {
				// when moving right, left bound is starting location, right bound is trvl more than that
				elem.pos = Number($(elem).css('left').replace('px', ''));
				elem.direction = 1;
				elem.leftBound = elem.pos;
				elem.rightBound = elem.leftBound + (sizerWidth * (trvl / 100));
				elem.moveFunction = moveLeftRight;
				elem.noBounce = nb;
				speed = speed * (sizerWidth / 100);
			} else if (dir === 'up') {
				elem.pos = Number($(elem).css('top').replace('px', ''));
				elem.direction = -1;
				elem.lowerBound = elem.pos;
				elem.upperBound = elem.lowerBound - (sizerHeight * (trvl / 100));
				elem.moveFunction = moveUpDown;
				elem.noBounce = nb;
				speed = speed * (sizerHeight / 100);
			} else if (dir === 'down') {
				elem.pos = Number($(elem).css('top').replace('px', ''));
				elem.direction = 1;
				elem.upperBound = elem.pos;
				elem.lowerBound = elem.upperBound + (sizerHeight * (trvl / 100));
				elem.moveFunction = moveUpDown;
				elem.noBounce = nb;
				speed = speed * (sizerHeight / 100);
			} else if (dir === 'flicker') {
				elem.moveFunction = flicker;
			} else if (dir === 'blink') {
				elem.moveFunction = blink;
            } else if (dir === 'rotate') {
                elem.moveFunction = rotate;
                elem.rot = 0;
			} else {
				// unknown direction value
				elem.moveFunction = function() {
					// no op
				};
			}

			elem.pps = speed;

			animated.push(elem);

		}
		
	});
}

function checkCollisions() {
	
	$("img.collision").each(function(idx, elem) {
		
		if (elem.collidesWith) {
			
			var cx1 = Number($(elem).css('left').replace('px', ''));
			var ox1 = cx1 + ($(elem).width() / 2);

			var cy1 = Number($(elem).css('top').replace('px', ''));
			var oy1 = cy1 + ($(elem).height() / 2);

			var hits = [];
			$("img." + elem.collidesWith).each(function(idx2, elem2) {
			
				var cx2 = Number($(elem2).css('left').replace('px', ''));
				var ox2 = cx2 + ($(elem2).width() / 2);
				
				var cy2 = Number($(elem2).css('top').replace('px', ''));
				var oy2 = cy2 + ($(elem2).height() / 2);

				var distX = (ox2) - (ox1);
				var distY = (oy2) - (oy1);
				var magSq = distX * distX + distY * distY;
				if (magSq < (elem.collisionRadius + elem2.collisionRadius) * (elem.collisionRadius + elem2.collisionRadius)) {
					hits.push(elem2);
				}
				
			});

			if (hits.length > 0) {
				if (elem.hit) {
					elem.hit(hits);
				}
			}
			
		}
		
	});
	
}

$(function () { 

	var lastTime = null;
	
	function run(timestamp) {

		window.requestAnimationFrame(function(e) { run(e); });

		var elapsed;
		if (lastTime === null) {
			lastTime = timestamp;
		}
		elapsed = timestamp - lastTime;
		lastTime = timestamp;
		
		animated.forEach(function (elem, idx) {
			elem.moveFunction(elapsed);
		});
		
		checkCollisions();
		
	}
	
	window.requestAnimationFrame(function(e) { run(e); });
	
});

$(function() {
	setupAnimation();
});

/**
 * function to clear filters or searches on the archive page
 */
$(function() {
	$(".clear-filter").click(function() {
		window.location.href = "/archive";
	});
});

/**
 * function to perform search on the archive page
 */
function goSearch() {
	var terms = $("#searchFor").val();
	if (terms && terms.length > 0) {
		window.location.href = "/archive?q=" + encodeURI(terms);
	}
}

/**
 * bind to the archive page search controls
 */
$(function() {
	$('#searchFor').keypress(function(event) {
        if (event.keyCode == 13) {
            goSearch();
        }
    });
	$("#doSearch").click(function() {
		goSearch();
	});
});

var topics = {};

$(function() {

    jQuery.Topic = function( id ) {
        var callbacks, method,
        topic = id && topics[ id ];

        if ( !topic ) {
            callbacks = jQuery.Callbacks();
            topic = {
                    publish: callbacks.fire,
                    subscribe: callbacks.add,
                    unsubscribe: callbacks.remove
            };
            if ( id ) {
                topics[ id ] = topic;
            }
        }
        return topic;
    };

});

function doEmoji() {
	
	$('.bubble, .free-text').each(function() {
        var origText = $(this).html();
        var eText = emojione.shortnameToImage(origText);
        if (origText != eText) {
            $(this).html(eText);
        }
    });
	
}

// Emojis! (See http://emojione.com/developers)
$(function() {
    doEmoji();
});
