$(function() {

    var socket = io('http://amphibian.com:3000');
    
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