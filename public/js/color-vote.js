$(function() {

	var GREEN = 'green';
	var ORANGE = 'orange';
	var TARTAN = 'tartan';
	
	var frogImg = $('#color-test-frog');
	var dispColor = ( Math.random() < 0.5 ? GREEN : ORANGE );
	frogImg.attr('src', '/images/generic_frog_right_' + dispColor + '_color.svg');
	recordDisplay(dispColor);
	
	$('#text-vote-green').css('cursor', 'pointer');
	$('#text-vote-orange').css('cursor', 'pointer');
	$('#text-vote-tartan').css('cursor', 'pointer');
	
	$('#text-vote-green').click(function() {
		recordVote(GREEN);
		disableVoting();
	});
	
	$('#text-vote-orange').click(function() {
		recordVote(ORANGE);
		disableVoting();
	});
	
	$('#text-vote-tartan').click(function() {
		recordVote(TARTAN);
		disableVoting();
	});

	$('#text-vote-results').hide();
	
	getActuals(function(data) {

		$('#extraText').append("<br/><br/>Here are the actual frog color display stats. It's random, but over time both colors should end up around 50% each. The green frog has been shown " + data.green + " of the time. The orange frog has been shown " + data.orange + " of the time. To be clear, there is no tartan frog.");
		
	});

});

function disableVoting() {
	
	$('#text-vote-green').unbind('click');
	$('#text-vote-orange').unbind('click');
	$('#text-vote-tartan').unbind('click');
	
	$('#text-vote-green').hide();
	$('#text-vote-orange').hide();
	$('#text-vote-tartan').hide();
	
	getVotes(function(data) {
		
		$('#text-vote-results').html(data.orange + " said Orange<br/>" + data.green + " said Green<br/>" + data.tartan + " said Tartan.");
		$('#text-vote-results').show();		
		
	});
	
}

function getVotes(cb) {
	$.get('/colorVotes', function(data) {
		cb(data);
	}, 'json');
}

function getActuals(cb) {
	$.get('/colorActuals', function(data) {
		cb(data);
	}, 'json');
}

function recordVote(color) {
	$.ajax({
		url: '/vote/' + color,
		type: 'POST',
		success: function(data) {
			console.log('voted for ' + color);
		}
	});
}

function recordDisplay(color) {
	$.ajax({
		url: '/colorShown/' + color,
		type: 'POST',
		success: function(data) {
			console.log('displayed ' + color);
		}
	});
}
