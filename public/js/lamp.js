$(function() {

    var urlParts = window.location.href.split("/");
    var cUrl = urlParts[0] + "//" + urlParts[2];
    if (!window.location.port) {
        if (urlParts[0] !== "https:") {
            cUrl += ':3000';
        } else {
            cUrl += ':4443';
        }
    }
    
    var socket = io(cUrl);
    
    socket.on("lamp-off", function(d) { 
        $('#glow').hide();
    });

    socket.on("lamp-on", function(d) {
        $('#glow').show();
    });
    
    $('#lamp').click(function() {
        socket.emit("lamp-toggle");
    });
    
    $.get('/lamp/state', function(data) {
        if (data.on) {
            $('#glow').show();
        } else {
            $('#glow').hide();
        }
    }, 'json');

});