
var lyrics = [
    "3",
    "2",
    "1",
    "Life is more fun as a musical,",
    "Life is more fun with a song!",
    "No matter how you're feeling",
    "Whether happy or depressed",
    "Everybody should sing along!",
    "And everybody sing!",
    "La La, La La",
    "La La La Laaa",
    "La La, La La Laaa",
    "And everybody sing!",
    "La La, La La",
    "La La La Laaa",
    "La La La, La La Laaa",
    "La La Laaaaaa",
    ""
];

var played = false;
var counter = 0;

var playAt = 400;
var w = $("#sizer").width();
if (w === 340) {
    playAt = 250;
} else if (w === 310) {
    playAt = 150;
}

function playIt() {
    
    if (bgmusic.playState === 1) return;
    
    $("#mobile-notice").hide();
    
    counter = 0;
    bgmusic.play();
    played = true;
    
}

var scrollFunc = function() {
    
    if ($(this).scrollTop() > playAt && !played) {
        playIt();
    }
    
};




var showLyrics = function(pos) {
    
    var $lyricsDiv = $("#lyrics");
    if ($lyricsDiv.length == 0) {
        // create
        $("body").append("<div id='lyrics' style='width: 100%; text-align: center; position: fixed; bottom: 20%; font-size: 36px; font-weight: bold; z-index: 99999; text-shadow: rgb(255, 157, 43) 3px 0px 0px, rgb(255, 157, 43) 2.83487px 0.981584px 0px, rgb(255, 157, 43) 2.35766px 1.85511px 0px, rgb(255, 157, 43) 1.62091px 2.52441px 0px, rgb(255, 157, 43) 0.705713px 2.91581px 0px, rgb(255, 157, 43) -0.287171px 2.98622px 0px, rgb(255, 157, 43) -1.24844px 2.72789px 0px, rgb(255, 157, 43) -2.07227px 2.16926px 0px, rgb(255, 157, 43) -2.66798px 1.37182px 0px, rgb(255, 157, 43) -2.96998px 0.42336px 0px, rgb(255, 157, 43) -2.94502px -0.571704px 0px, rgb(255, 157, 43) -2.59586px -1.50383px 0px, rgb(255, 157, 43) -1.96093px -2.27041px 0px, rgb(255, 157, 43) -1.11013px -2.78704px 0px, rgb(255, 157, 43) -0.137119px -2.99686px 0px, rgb(255, 157, 43) 0.850987px -2.87677px 0px, rgb(255, 157, 43) 1.74541px -2.43999px 0px, rgb(255, 157, 43) 2.44769px -1.73459px 0px, rgb(255, 157, 43) 2.88051px -0.838247px 0px;'></div>");
        $lyricsDiv = $("#lyrics");
    }
    $lyricsDiv.html(lyrics[counter++]);
    
    if (counter == lyrics.length) {
        setTimeout(function() {
            $("#cell-3").hide();
            $("#cell-4").show();
            played = false;
        }, 3000);
    }
    
};



function stopStuff() {
    bgmusic.stop();
    $.Topic( "startComicNav" ).unsubscribe( stopStuff );
}

$(function() {

    soundManager.setup({
        url : '/swf/',
        onready : function() {

            bgmusic = soundManager.createSound({
                id : 'musical',
                url : '/audio/Amphibian.mp3'
            });

            bgmusic.onPosition(2300, showLyrics);    // "3"
            bgmusic.onPosition(3300, showLyrics);    // "2"
            bgmusic.onPosition(4300, showLyrics);    // "1"
            bgmusic.onPosition(5300, showLyrics);    // "Life is more fun as a musical,"
            bgmusic.onPosition(8100, showLyrics);    // "Life is more fun with a song!"
            bgmusic.onPosition(10800, showLyrics);   // "No matter how you're feeling"
            bgmusic.onPosition(12000, showLyrics);   // "Whether happy or depressed"
            bgmusic.onPosition(13600, showLyrics);   // "Everybody should sing along!"
            bgmusic.onPosition(15600, showLyrics);   // "And everybody sing!"
            bgmusic.onPosition(16800, showLyrics);   // "La La, La La"
            bgmusic.onPosition(18000, showLyrics);   // "La La La Laaa"
            bgmusic.onPosition(19900, showLyrics);   // "La La, La La Laaa"
            bgmusic.onPosition(21600, showLyrics);   // "And everybody sing!"
            bgmusic.onPosition(22800, showLyrics);   // "La La, La La"
            bgmusic.onPosition(24000, showLyrics);   // "La La La Laaa"
            bgmusic.onPosition(25400, showLyrics);   // "La La La, La La Laaa"
            bgmusic.onPosition(27600, showLyrics);   // "La La Laaaaaa"
            bgmusic.onPosition(29600, showLyrics);
            
            
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                $("#mobile-notice").show();
                $("#cell-3").click(playIt);
                $("#cell-4").click(playIt);
            } else {
                $(window).scroll(scrollFunc);
            }
            
        },
        ontimeout : function() {
            console.log("could not start soundmanager!");
        }
    });

    
    $.Topic( "startComicNav" ).subscribe( stopStuff );

});