
function resetScroll() {
    
    jQuery.scrollSpeed(100, 800);
    
    $.Topic( "startComicNav" ).unsubscribe( resetScroll );
    
}

$(function() {
   
    jQuery.scrollSpeed(5, 800);
    
    $.Topic( "startComicNav" ).subscribe( resetScroll );
    
});