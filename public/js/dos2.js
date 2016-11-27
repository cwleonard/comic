$(function() {
   
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
    
    
    
});
