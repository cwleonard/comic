var timers = [];

function showCard(n, ms) {
    
    $('#tc'+n).show();
    $('#tt'+n).show();
    
    timers.push(setTimeout(function() {

        $('#tc'+n).hide();
        $('#tt'+n).hide();
        
        if (n <= 3) {
            showCard(n+1, 6000);
        } else {
            showCard(1, 6000);
        }

    }, ms));
    
}

function stopStuff() {
    
    bgmusic.stop();
    
    for (var t = 0; i < timers.length; t++) {
        clearTimeout(timers[t]);
    }
    
    $.Topic( "startComicNav" ).unsubscribe( stopStuff );
    
}

$(function() {

    soundManager.setup({
        url : '/swf/',
        onready : function() {
            bgmusic = soundManager.createSound({
                id : 'bgmusic',
                url : '/audio/Fun_in_a_Bottle.mp3'
            });

            bgmusic.onfinish = function() {
                this.play();
            };
        },
        ontimeout : function() {
            console.log("could not start soundmanager!");
        }
    });

    timers.push(setTimeout(function() {
        showCard(1, 6000);
    }, 3000));
    
    $.Topic( "startComicNav" ).subscribe( stopStuff );

});