var c1 = new Image();
var c2 = new Image();
var c3 = new Image();
var f1 = new Image();

var glassSound;

c1.src = "/images/glass_cracked_1.svg";
c2.src = "/images/glass_cracked_2.svg";
c3.src = "/images/glass_cracked_3.svg";

f1.src = "/images/upset_frog_face_right.svg";

var brokens = [ false, false, false, false ];

$(function() {
	
	$('#glass-1').unbind('click'); // in case this gets executed more than once
    $('#glass-2').unbind('click');
    $('#glass-3').unbind('click');
    $('#glass-4').unbind('click');
	
	$('#glass-1').click(function() {
	    
	    if (this.touchCounter === undefined) {
	        this.touchCounter = 1;
	    } else {
	        this.touchCounter++;
	    }
	    
	    if (this.touchCounter === 1) {
	        this.src = c1.src;
	    } else if (this.touchCounter === 2) {
	        this.src = c2.src;
        } else if (this.touchCounter === 3) {
            this.src = c3.src;
            $("#ceo-1").attr("src", f1.src);
            $("#bubble-1").html("This was going to be a demonstration of our new unbreakable glass.");
            if (glassSound && !brokens[0]) {
                glassSound.play();
            }
            brokens[0] = true;
            brokens[1] = true;
            brokens[2] = true;
            brokens[3] = true;
	    }
	    
	    $('#glass-2').click();

	});

	$('#glass-2').click(function() {

	    if (this.touchCounter === undefined) {
	        this.touchCounter = 1;
	    } else {
	        this.touchCounter++;
	    }

	    if (this.touchCounter === 1) {
	        this.src = c1.src;
	    } else if (this.touchCounter === 2) {
	        this.src = c2.src;
	    } else if (this.touchCounter === 3) {
	        this.src = c3.src;
	        $("#ceo-2").attr("src", f1.src);
	        $("#bubble-2").html("Unbreakable? It just broke!");
            if (glassSound && !brokens[1]) {
                glassSound.play();
            }
            brokens[1] = true;
            brokens[2] = true;
            brokens[3] = true;
	    }

	    $('#glass-3').click();

	});

	$('#glass-3').click(function() {

	    if (this.touchCounter === undefined) {
	        this.touchCounter = 1;
	    } else {
	        this.touchCounter++;
	    }

	    if (this.touchCounter === 1) {
	        this.src = c1.src;
	    } else if (this.touchCounter === 2) {
	        this.src = c2.src;
	    } else if (this.touchCounter === 3) {
	        this.src = c3.src;
            $("#ceo-3").attr("src", f1.src);
            $("#bubble-3").html("Who touched the glass? It's only unbreakable as long as nobody touches it!");
            if (glassSound && !brokens[2]) {
                glassSound.play();
            }
            brokens[2] = true;
            brokens[3] = true;
	    }

	    $('#glass-4').click();

	});

	$('#glass-4').click(function() {

	    if (this.touchCounter === undefined) {
	        this.touchCounter = 1;
	    } else {
	        this.touchCounter++;
	    }

	    if (this.touchCounter === 1) {
	        this.src = c1.src;
	    } else if (this.touchCounter === 2) {
	        this.src = c2.src;
	    } else if (this.touchCounter === 3) {
	        this.src = c3.src;
            $("#ceo-4").attr("src", f1.src);
            $("#bubble-4").html("You've shattered my expectations.");
            if (glassSound && !brokens[3]) {
                glassSound.play();
            }
            brokens[3] = true;
	    }

	});

	soundManager.setup({
        url: '/swf/',
        onready: function() {
          glassSound = soundManager.createSound({
            id: 'glassSound',
            url: '/audio/glass_breaking.mp3'
          });
        },
        ontimeout: function() {
          // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
            console.log("could not start soundmanager!");
        }
      }); 
	   
});