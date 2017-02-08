$(function() {

    $('head').append('<link rel="stylesheet" href="css/lift-flap.css" type="text/css" />');
    
    var $cf = $("#computer-flap");
    var $sf = $("#server-flap");
    var $tf = $("#team-flap");
    var $mf = $("#mau-flap");
    
    $(window).load(function() {
        
        makeFlap($cf, "right", $cf.width(), $cf.height());
        makeFlap($sf, "left", $sf.width(), $sf.height());
        makeFlap($tf, "right", $tf.width(), $tf.height());
        makeFlap($mf, "left", $mf.width(), $mf.height());

    });
    
    function makeFlap($elem, dir, w, h) {

        var id = $elem.attr("id");
        
        var $parent = $elem.parent();
        
        $parent.append("<div id='" + id + "-t' class='threshold' style='z-index: " + $elem.css("z-index") + "; width: " + w + "px; height: " + h + "px; top: " + $elem.position().top + "px; left: " + $elem.position().left + "px'></div>");

        $("#" + id + "-t").append("<div id='" + id + "-d' class='door-" + dir + "'></div>");

        $("#" + id + "-d").append($elem);
        
        $elem.css("top", 0);
        $elem.css("left", 0);
        $elem.css("width", "100%");
        
        $elem.click(function(e) {
            e.stopPropagation();
            $("#" + id + "-d").addClass("dooropen-" + dir);
        });
        
        $("#" + id + "-t").click(function(e) {
            e.stopPropagation();
            $("#" + id + "-d").removeClass("dooropen-" + dir);
        });
        
    }
    
});