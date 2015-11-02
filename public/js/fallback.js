function showCard(n, ms) {
    
    $('#tc'+n).show();
    $('#tt'+n).show();
    
    setTimeout(function() {

        $('#tc'+n).hide();
        $('#tt'+n).hide();
        
        if (n <= 3) {
            showCard(n+1, 6000);
        } else {
            showCard(1, 6000);
        }

    }, ms);
    
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
            
            bgmusic.play();
            
        },
        ontimeout : function() {
            console.log("could not start soundmanager!");
        }
    }); 

    setTimeout(function() {
        showCard(1, 6000);
    }, 3000);

});