var f1 = new Image();
var f2 = new Image();
var f3 = new Image();

f1.src = "/images/generic_frog_jump_b_1.svg";
f2.src = "/images/generic_frog_jump_b_2.svg";
f3.src = "/images/generic_frog_jump_b_3.svg";

var aniFrames  = [  f1,  f2,  f3 ];

function frameCycler(elem, initialFrames, startFrame) {
    
    var me = elem[0];
    
    me.frameArray = initialFrames;
    me.f = startFrame;
    me.changeFrame = function() {
        
        $(me).attr("src", me.frameArray[me.f].src);
        me.f++;
        if (me.f === me.frameArray.length) {
            me.f = 0;
        }
        setTimeout(me.changeFrame, 200);
        
    };
    me.changeFrame();
    
}

function mover(elem) {
    
    var me = elem[0];
    var ts = new Date();
    var l = $(me).position().left;
    var w = $(me).width() + 15;
    var reset = $("#sizer").width() + 15;
    
    me.move = function() {
        
        var now = new Date();
        
        var tsDiff = now - ts;
        
        l = l - (tsDiff * 0.03);
        if (l < -w) {
            l = reset;
        }
        
        $(me).css("left", l + "px");
        
        ts = now;
        
        setTimeout(me.move, 5);
        
    };
    me.move();
    
}

$(function() {

    frameCycler($('#frog-1'), aniFrames, 0);
    frameCycler($('#frog-2'), aniFrames, 1);
    
    mover($("#tree-1"));
    mover($("#shadow-1"));
    
});