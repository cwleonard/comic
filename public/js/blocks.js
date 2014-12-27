function wordWrap(text, len) {

	var lineWidth = len || 10; // if line length not specified, default is 10
	var spaceLeft = lineWidth;
	var words = text.split(/\s/);
	
	for (var w in words) {
		var word = words[w];
	    if ((word.length + 1) > spaceLeft) {
	    	words[w] = '\n' + word;
	        spaceLeft = lineWidth - word.length;
	    } else {
	        spaceLeft = spaceLeft - (word.length + 1);
	    }
	}
	
	return words.join(' ').trim();
	
}

function attachBlockClick() {
	
	$('.letter-block').click(function() {
		$('#inputModal').modal('toggle');
	});

}

function stackBlocks(msg) {
	
	var lines = wordWrap(msg).split("\n");
	
	var vpos = 52.5;
	
	var cell = $('#cell-3');
	
	cell.find(".letter-block").remove();
	
	// remove line breaks
	for (var k = 0; k < lines.length; k++) {
		lines[k] = lines[k].trim();
	}
	
	// pad lines so blocks don't float
	for (var j = 0; j < lines.length - 1; j++) {
		var diff = lines[j].length - lines[j+1].trim().length;
		if (diff > 0) {
			for (var x = 0; x < diff; x++) {
				lines[j+1] += ' ';
			}
		}
	}
	
	var z = 2;
	for (var i = lines.length - 1; i >= 0; i--) {

		var hpos = 2.11;
		
		var letters = lines[i].split('');
		
		if (i < lines.length - 1) {
			if ((lines[i].length - lines[i+1].length) < 0) {
				hpos += 4.8;
			}
		}
		
		for (var l in letters) {
			
			var skip = false;
			var letter = letters[l];
			if (letter === '.') {
				letter = "dot";
			} else if (letter === ' ' && i === 0) {
				skip = true;
			} else if (letter.match(/[^A-Za-z]/)) {
				letter = "other" + (Math.random() > 0.5 ? 1 : 2);
			}
			
			var vvariance = (Math.random() / 2) * (Math.random() > 0.5 ? 1 : -1);
			var hvariance = (Math.random() / 4) * (Math.random() > 0.5 ? 1 : -1);
			
			if (!skip) {
				var html = "<img id='block-" + i + "-" + l + "' class='letter-block' style='top: " + (vpos + vvariance) + "%; left: " + (hpos + hvariance) + "%; width: 11.11111111111111%; z-index: " + z + ";' src='/images/block_" + letter + ".svg' alt='" + letter + "'>";
				cell.append(html);
			}
			
			hpos += 9.4;
			z++;
			
		}
		
		vpos -= 13.8;
		
	}
	
	attachBlockClick();
	
}

$(function() {
	
	$('#confirmInputButton').unbind('click');
	
	$('#confirmInputButton').click(function() {
		stackBlocks($('#someText').val());
		$('#inputModal').modal('toggle');
	});
	
	stackBlocks("we have technology");
	
});