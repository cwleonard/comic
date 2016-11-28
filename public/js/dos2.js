var DOS_COMIC_ID = 73;
var dosInitialized;

$(function() {
    
    var stopStuff = function() {
        stopDos();
        $.Topic( "endComicNav" ).unsubscribe( setupStuff );
    };
    
    $.Topic("startComicNav").subscribe( stopStuff );
    
    var setupStuff = function(comicId) {
        
        console.log("endNav for " + comicId);
        
        if (comicId != DOS_COMIC_ID) return;
        
        var $cell = $("#dos-box").parent();
        var pos = $("#dos-box").position();
        var z = $("#dos-box").css("z-index");
            
        $cell.append("<div style='z-index: " + z + "; position: absolute; top: " + pos.top + "px; left: " + pos.left + "px;'><canvas id='dos-input'></canvas></div>");

        var init = function() { 
        
            if ($("#dos-box").height() === 0) {
                setTimeout(init, 20);
            } else {
                initDos("dos-input", $("#dos-box").width(), $("#dos-box").height());
            }
        
        };
        
        init();
        
    };
    
    $.Topic( "endComicNav" ).subscribe( setupStuff );
    
    if (!dosInitialized) {
        dosInitialized = true;
        setupStuff(DOS_COMIC_ID);
    }
    
});
