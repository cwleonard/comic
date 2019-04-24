$(function() {

    var sl = function(evt) {
        if (evt.which === 145) {
            $('#cell-2').toggle();
            $('#cell-3').toggle();
        }
    };
    
    $(window).keydown(sl);
    
    var stopStuff = function() {
        $(window).off("keydown", sl);
        $.Topic("startComicNav").unsubscribe( stopStuff );
    };
    $.Topic("startComicNav").subscribe( stopStuff );
	
});