$(function() {

    $('#flipper').unbind('click'); // in case this gets executed more than once
    
    $('#flipper').click(function() {
        
        var r = $("body").attr("flipped");
        if (r === "yes") {
            $("body").css("transform", "rotate(0deg)");
            $("body").css("-webkit-transform", "rotate(0deg)");
            $("body").css("-ms-transform", "rotate(0deg)");
            $("body").attr("flipped", "no");
        } else {
            $("body").css("transform", "rotate(180deg)");
            $("body").css("-webkit-transform", "rotate(180deg)");
            $("body").css("-ms-transform", "rotate(180deg)");
            $("body").attr("flipped", "yes");
        }
        
    });
    
});