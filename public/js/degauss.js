$(function() {

    $('head').append('<link rel="stylesheet" href="css/degauss.css" type="text/css" />');
    
    $("#cell-2").append("<div id='degas' class='screen'></div>");

    var varients = [ "screen",  "screen1", "screen2", "screen3", "screen4" ];
    var vi = 0;
    
    function changePicture() {

        if ($("#degas").length) {

            $("#degas").removeClass();
            $("#degas").addClass(varients[vi]);

            vi++;
            if (vi === varients.length) {
                vi = 0;
            }

            window.setTimeout(changePicture, 5000);

        }
        
    }
    
    window.setTimeout(changePicture, 5000);
    
    
});