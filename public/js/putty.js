$(function() {
   
    var c1 = $("#cell-0");
    var c2 = $("#cell-1");
    var c3 = $("#cell-2");
    
    c2.detach();
    
    c2.css("background", "none");
    c2.css("border", "none");
    c2.css("box-shadow", "none");
    
    var div = document.createElement("div");
    
    var putty = document.createElement("img");
    $(putty).css("position", "absolute");
    $(putty).attr("src", "/images/silly_putty.svg");
    
    $(div).append(putty);
    $(div).append(c2);
    
    //$(putty).css("width", "120%");
    
    c3.before(div);
    
    
});