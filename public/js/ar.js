$(function() {

    var f1 = new Image();
    var f2 = new Image();
    
    f1.src = "images/generic_frog_face_front_arms_down.svg";
    f2.src = "images/generic_frog_face_front_arms_out.svg";
    
    var fframes = [ f1, f2 ];
    var frameIdx = 0;
    
    
    var h = $("#cell-2").height();
    var w = $("#cell-2").width();
    
    $("#cell-2").append("<video id='vid' width='" + w + "' height='" + h + "' autoplay></video>");
    
    var videoObj = { "video": true }; 
    var vid = $("#vid")[0];
    
    var errBack = function(error) {
        
        console.log("Video capture error: ", error.code);
        
        $("#vid").remove();
        $("#cell-2").append("<img src='other/street_photo.jpg' style='z-index: 0; height: " + h + "px;'/>");
        
    };
    
    var changeFrame = function() {
        
        $("#ar-frog").attr("src", fframes[frameIdx].src);
        if (frameIdx === 1) {
            frameIdx = 0;
        } else {
            frameIdx = 1;
        }
        window.setTimeout(changeFrame, 500);
        
    }
    
    changeFrame();

    
    if (MediaStreamTrack) {

        MediaStreamTrack.getSources(function(sourceInfos) {

            var sid = null;

            for (var i = 0; i != sourceInfos.length; ++i) {

                var sourceInfo = sourceInfos[i];
                if (sourceInfo.kind === 'video') {

                    //console.log(sourceInfo.id, sourceInfo.label || 'camera');
                    sid = sourceInfo.id;

                }

            }

            startCamera(sid);

        });

    } else {
        
        startCamera(null);
        
    }
    
    
    function startCamera(srcId) {
        
        var constraints = { video: true };
        
        if (srcId != null) {
            constraints = {
                    video: {
                        optional: [ { sourceId: srcId } ]
                    }
            };
        }
        
        if(navigator.getUserMedia) { // Standard
            navigator.getUserMedia(constraints, function(stream) {
                vid.src = stream;
                vid.play();
            }, errBack);
        } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
            navigator.webkitGetUserMedia(constraints, function(stream){
                vid.src = window.webkitURL.createObjectURL(stream);
                vid.play();
            }, errBack);
        }
        else if(navigator.mozGetUserMedia) { // Firefox-prefixed
            navigator.mozGetUserMedia(constraints, function(stream){
                vid.src = window.URL.createObjectURL(stream);
                vid.play();
            }, errBack);
        }
        else {
            // no video...must be iOS or something...
            errBack({ code: "unsupported device"});
        }
        
    }
    
});