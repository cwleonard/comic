var battery;
var initialComicId;
var toId;

function updateWithBatteryLevel(lvl) {

    $("#sizer .cTitle").html(lvl + "% Charged");
    
    $("#favor-pct").html(lvl);
    
    if (lvl >= 50) {
        $("#cell-3").hide();
        $("#cell-4").show();
    } else {
        $("#cell-3").show();
        $("#cell-4").hide();
    }
    
}

function getRandomCharge(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function overrideLow() {
    
    clearTimeout(toId);
    updateWithBatteryLevel(getRandomCharge(2,49));
    
}

function overrideHigh() {
    
    clearTimeout(toId);
    updateWithBatteryLevel(getRandomCharge(52, 99));
    
}

function clearAd() {
    
    clearTimeout(toId);
    updateWithBatteryLevel(getRandomCharge(51, 59));
    
}

$(function() {

    initialComicId = $("#sizer").attr("comicid");
    
    $("#learn-more").click(clearAd);
    
    var stopStuff = function() {
        console.log("clear timeout");
        clearTimeout(toId);
        $.Topic("startComicNav").unsubscribe( stopStuff );
    };
    $.Topic("startComicNav").subscribe( stopStuff );


    function readBattery(b) {

        battery = b || battery;
        
        var cid = $("#sizer").attr("comicid");
        if (cid === initialComicId) {
            // only do stuff if we're still on the same comic
            var percentage = parseFloat((battery.level * 100).toFixed(2));
            updateWithBatteryLevel(percentage);
            toId = setTimeout(readBattery, 30000);
        }

    }

    if (navigator.battery) {
        readBattery(navigator.battery);
    } else if (navigator.getBattery) {
        navigator.getBattery().then(readBattery);
    } else {
        // not supported. fake it!
        readBattery({
            level: Math.random()
        });
    }
    
});
