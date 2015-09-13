
function scratched(evt) {
    
    if (evt.which) {
        evt.stopPropagation();
        $(this).remove();
    }
    
}

function clear(cell) {
    
    function wipe() {
    
        var l = cell.find(".scratch-off");
        if (l.length > 0) {
            l.each(function(i, e) {
                if (Math.random() > 0.5) {
                    $(e).remove();
                }
            });
            setTimeout(wipe, 300);
        }
        
    }
    
    wipe();
    
}

$(function() {
	
    
    $("<style type='text/css'> div.scratch-off { position: absolute; z-index: 9999; width: 6%; height: 10%; background-color: silver; border-radius: 50%; } </style>").appendTo("head");

    $("#cell-3").addClass("cover");
    $("#cell-4").addClass("cover");
    $("#cell-5").addClass("cover");
    
    for (var h = -5; h < 100; h = h + 5) {
        for (var i = -3; i < 100; i = i + 3) {
            $('.cover').append("<div style='top: " + h + "%; left: " + i + "%;' class='scratch-off'/>");
        }
    }
    
    $('.cover').addClass("noselect");
    $('.cover').css("cursor", "url(/simg/coin.png) 2 27, auto");
    $('.cover img').on("dragstart", function() { return false; });
    
    $('.scratch-off').mousedown(scratched);
    $('.scratch-off').mouseenter(scratched);
    
    $('.cover').on("touchmove", function(evt) {
        clear($(this));
    });

});