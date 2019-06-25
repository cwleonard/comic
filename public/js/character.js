var f0 = new Image();
var f1 = new Image();
var f2 = new Image();
var f3 = new Image();
var f4 = new Image();

f0.src = "/images/computer_screen_character1.svg";
f1.src = "/images/computer_screen_character2.svg";
f2.src = "/images/computer_screen_character3.svg";
f3.src = "/images/computer_screen_character4.svg";
f4.src = "/images/computer_screen_character5.svg";

var characters = [ f0, f1, f2, f3, f4 ];

$(function() {
	
	$('#character_map')[0].c = 0;
	$('#character_map').unbind('click');
	$('#character_map').click(function() { 
		this.c++;
		if (this.c == characters.length) {
			this.c = 0;
		}
		$(this).attr("src", characters[this.c].src);
	});
	
});