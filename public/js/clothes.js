var f0 = new Image();
var f1 = new Image();
var f2 = new Image();
var f3 = new Image();
var f4 = new Image();

f0.src = "/images/generic_frog_facing_left.svg";
f1.src = "/images/generic_frog_trek.svg";
f2.src = "/images/generic_frog_overalls.svg";
f3.src = "/images/generic_frog_xwing.svg";
f4.src = "/images/generic_frog_dress.svg";

var clothes = [ f0, f1, f2, f3, f4 ];

$(function() {
	
	$('#naked-frog')[0].c = 0;
	$('#naked-frog').unbind('click');
	$('#naked-frog').click(function() { 
		this.c++;
		if (this.c == clothes.length) {
			this.c = 0;
		}
		$(this).attr("src", clothes[this.c].src);
	});
	
});