var timeline = new Array();
var highestStep = -1;

$(function() {

    $('head').append('<link rel="stylesheet" href="css/smoke.css" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="css/rocket.css" type="text/css" />');
    
    var launchAt = new Date(2016, 4, 16, 18, 0, 0);
    
    function showTimer() {
        
        var now = new Date();
        
        var diff = launchAt - now;
        
        var secs = Math.floor(Math.abs(diff) / 1000);
        var mins = Math.floor(secs / 60);
        var hours = Math.floor(mins / 60);

        secs = secs % 60;
        mins = mins % 60;
        
        var s = (secs < 10 ? "0" + secs : secs);
        var m = (mins < 10 ? "0" + mins : mins);
        var h = (hours < 10 ? "0" + hours : hours);

        var sign = "-";
        
        // see if we're past the launch time
        if (diff < 0) {
            sign = "+";
        }

        $("#countdown").html(sign + h + ":" + m + ":" + s);

        return diff;
        
    }
    
    var doCountdown = function() {
        
        
        var nextCheck = 1000;

        var diff = showTimer();

        if (timeline.length > highestStep + 1) {
            if (diff <= timeline[highestStep+1].startAt) {
                highestStep++;
                advance(highestStep);
            }
        }
        
        window.setTimeout(doCountdown, nextCheck);
        
    };
    
    
    function createSmoke(time, num) {

        var st = (time / num); 
        
        for( var i = 0; i < num; i++) {

            var s = st * i;
            
            var d = "L";
            if (((i+1) % 2) == 0) {
                d = "R";
            }
            
            $('#smoker').append('<span class="smokeball" style="animation: smoke' + d + ' ' + time + 's ' + s + 's infinite"></span>');
            
        }

    }
    
    function stopSmoke() {
        
        $(".smokeball").remove();
        
    }
    
    function liftoff() {
        
        $('#rocket').css("animation-name", "launch");
        $('#rocket').css("animation-duration", "6s");
        $('#rocket').css("animation-iteration-count", "1");
        $('#rocket').css("animation-timing-function", "ease-in");
        $('#rocket').css("animation-fill-mode", "forwards");

        $('#closed_door').css("animation-name", "launch");
        $('#closed_door').css("animation-duration", "6s");
        $('#closed_door').css("animation-iteration-count", "1");
        $('#closed_door').css("animation-timing-function", "ease-in");
        $('#closed_door').css("animation-fill-mode", "forwards");

        $('#blast').css("animation-name", "launch");
        $('#blast').css("animation-duration", "6s");
        $('#blast').css("animation-iteration-count", "1");
        $('#blast').css("animation-timing-function", "ease-in");
        $('#blast').css("animation-fill-mode", "forwards");

        $('#shadow').css("animation-name", "shrink");
        $('#shadow').css("animation-duration", "6s");
        $('#shadow').css("animation-iteration-count", "1");
        $('#shadow').css("animation-timing-function", "ease-in");
        $('#shadow').css("animation-fill-mode", "forwards");

    }
    
    var boarding = ["#frog1", "#frog2", "#frog3", "#ramp", "#open_door", "#bubble1"];
    var onBoard = ["#closed_door", "#bubble2"];
    var enginesOn = ["#closed_door", "#bubble3"];
    var firedUp = ["#closed_door", "#blast"];

    var step0 = {
            startAt: Number.MAX_VALUE,
            show: boarding,
            exec: [stopSmoke]
    };
    
    var step1 = {
            startAt: 120 * 60 * 1000,
            show: onBoard,
            exec: [stopSmoke]
    };
    
    var step2 = {
            startAt: 10 * 60 * 1000,
            show: enginesOn,
            exec: [function() {
                createSmoke(5, 10);
            }]
    };
    
    var step3 = {
            startAt: 0,
            show: firedUp,
            exec: [stopSmoke, liftoff]
    };
    
    var step4 = {
            startAt: -10000,
            show: ["#gone"],
            exec: [stopSmoke]
    }
    
    timeline = [ step0, step1, step2, step3, step4 ];
    
    // what if you come to the comic after the launch?
    // change the start times so you can review the steps...
    if (launchAt - (new Date()) < 0) {
        launchAt = new Date((Date.now() + 30000));
        timeline[1].startAt = 20000;
        timeline[2].startAt = 10000;
    }
    
    doCountdown();
    
});

function advance(i) {
    
    //console.log("going to step " + i);
    
    for (var p = 0; p < timeline.length; p++) {
        if (p != i) {
            var n = timeline[p];
            for (var h = 0; h < n.show.length; h++) {
                $(n.show[h]).hide();
            }
        }
    }

    var o = timeline[i];

    if (o.show && o.show.length > 0) {
        for (var s = 0; s < o.show.length; s++) {
            $(o.show[s]).show();
        }
    }
    
    if (o.exec && o.exec.length > 0) {
        for (var e = 0; e < o.exec.length; e++) {
            o.exec[e]();
        }
    }

}
