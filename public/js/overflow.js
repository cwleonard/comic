$(function() {

    var addNumber = function() {
        
        var num = Math.floor(Math.random() * 9);
        
        var l = Math.floor(Math.random() * 100);
        var t = 60 + Math.floor(Math.random() * 40);
        var s = Math.floor(Math.random() * 10) + 15;
        var r = Math.floor(Math.random() * 20) * (Math.random() < 0.5 ? 1 : -1);
        
        $("#cell-2").append("<p style='z-index:999; transform: rotate(" + r + "deg); transform: -webkit-rotate(" + r + "deg); -ms-transform: rotate(" + r + "deg); font-weight: bold; color: #000099; font-size: " + s + "px; position: absolute; top: " + t + "%; left: " + l + "%'>" + num + "</p>");
        
    };
    
    setInterval(addNumber, 500);
    
});

