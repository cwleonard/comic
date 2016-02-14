$(function() {

    var cOn  = new Image();
    var cOff = new Image();
    var c2   = new Image();
    cOn.src  = "/images/computer_work.svg";
    cOff.src = "/images/computer_off.svg";
    c2.src   = "/images/computer.svg";

    var colors = ["002136", "05263b", "0b2b40", "103145", "16364b", "1b3b50", "214155", "26465b", "2c4c60", "315165", "37566a", "3d5c70", "426175", "48677a", "4d6c80", "537185", "58778a", "5e7c8f", "638295", "69879a", "6f8c9f", "7492a5", "7a97aa", "7f9daf", "85a2b4", "8aa7ba", "90adbf", "95b2c4", "9bb8ca", "a1bdcf", "a6c2d4", "acc8d9", "b1cddf", "b7d3e4", "bcd8e9", "c2ddef", "c7e3f4", "cde8f9", "d2edfe", "d3eeff"];
    var sp = ["140px", "140px", "140px", "140px", "140px", "140px", "140px", "130px", "120px", "110px", "100px", "90px", "80px", "70px", "60px", "50px", "40px", "30px", "20px", "10px"];
    
    var bChange = function() {
        
        var n = Number($('#brightnessSlider').val());
        $("#cell-2").css("background-color", "#" + colors[((colors.length/2)-1) + n]);
        $("#cell-3").css("background-color", "#" + colors[((colors.length/2)-1) - n]);
        
        $("#sunset").css("top", sp[((colors.length/2)-1) - n]);
        
        if (n < 7) {
            
            $("#computer-1").attr("src", cOn.src);
            $("#computer-2").attr("src", cOn.src);
            $("#frog-sleep-1").hide();
            $("#frog-sleep-2").hide();
            $("#frog-awake-1").show();
            $("#frog-awake-2").show();
            
            $("#bubble-1").html("This day seems to be dragging on forever.");

        } else if (n < 12) {

            $("#computer-1").attr("src", c2.src);
            $("#computer-2").attr("src", cOn.src);
            $("#frog-sleep-1").hide();
            $("#frog-sleep-2").hide();
            $("#frog-awake-1").show();
            $("#frog-awake-2").show();
            $("#bubble-1").html("Is it dinner time yet?");

        } else {
            
            $("#computer-1").attr("src", cOff.src);
            $("#computer-2").attr("src", cOff.src);
            $("#frog-awake-1").hide();
            $("#frog-awake-2").hide();
            $("#frog-sleep-1").show();
            $("#frog-sleep-2").show();

            $("#bubble-1").html("ZZZ zzz");

        }
        
    };
    
    $("head").append("<link rel='stylesheet' type='text/css' href='css/bootstrap-slider.min.css'>");
    $("head").append("<link rel='stylesheet' type='text/css' href='css/brightness.css'>");
    
	$('#cell-2').append('<div style="position: absolute; width: 60%; top: 10%; left: 40%;"><input id="brightnessSlider" data-slider-tooltip="hide" data-slider-id="bSlider" type="text" data-slider-min="0" data-slider-max="19" data-slider-step="1" data-slider-value="19"/></div>');
	
	var bslide = $('#brightnessSlider').slider().on('change', bChange);
    
	if ($('#sizer').width() < 450) {
	    $("#bSlider").css("width", "150px");
	}
	
});