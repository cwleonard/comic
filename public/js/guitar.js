var guitarSound = null;

$(function() {

	soundManager.setup({
		url : '/swf/',
		onready : function() {
			guitarSound = soundManager.createSound({
				id : 'guitarSound',
				url : '/audio/guitar.mp3'
			});
		},
		ontimeout : function() {
			console.log("could not start soundmanager!");
		}
	});
	
	$('#play-button').click(function() {
		if (guitarSound) {
			guitarSound.play();
		}
	});

	$('#pause-button').click(function() {
		if (guitarSound) {
			guitarSound.pause();
		}
	});

	$('#stop-button').click(function() {
		if (guitarSound) {
			guitarSound.stop();
		}
	});

});