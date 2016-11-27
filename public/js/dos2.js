$(function() {
   
    var $cell = $("#dos-box").parent();
    var pos = $("#dos-box").position();
    
    $cell.append("<div style='z-index: 999; position: absolute; top: " + pos.top + "px; left: " + pos.left + "px;'><canvas id='dos-input'></canvas></div>");
    
    initDos("dos-input", $("#dos-box").width(), $("#dos-box").height());
    
    
});
