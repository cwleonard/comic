var sound1;
var sound2;
var sound3;
var sound4;

var sounds;


$(function() {
	
	$('#rubber-duck').unbind('click'); // in case this gets executed more than once
	
	$('#rubber-duck').click(function() {
	    
	    var s = Math.floor(Math.random() * sounds.length);

	    var playSound = sounds[s];
	    
	    if (playSound) {
	        playSound.play();
	    }
	    
	});

	soundManager.setup({
        url: '/swf/',
        onready: function() {

          sound1 = soundManager.createSound({
            id: 'sound1',
            url: '/audio/car_horn.mp3'
          });
          
          sound2 = soundManager.createSound({
              id: 'sound2',
              url: '/audio/drill.mp3'
            });
          
          sound3 = soundManager.createSound({
              id: 'sound3',
              url: '/audio/metal_hit.mp3'
            });

          sound4 = soundManager.createSound({
              id: 'sound4',
              url: '/audio/phone_ring.mp3'
            });

          sounds = [ sound1, sound2, sound3, sound4 ];
          
        },
        ontimeout: function() {
          // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
            console.log("could not start soundmanager!");
        }
      }); 
	   
});