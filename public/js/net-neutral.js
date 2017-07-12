
 var _bftn_options = {
    theme: 'slow', // @type {string}
    org: 'fftf', // @type {string}
    delay: 10000, // @type {number}
    always_show_widget: false // @type {Boolean}
  };

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://widget.battleforthenet.com/widget.js';
  document.body.appendChild(script);
}

$(function() {
    
    $('head').append('<link rel="stylesheet" href="css/jquery-ui-1.10.4.min.css" type="text/css" />');
    $("#cell-4").append("<div style='position: relative; top: 70%; left: 10%; width: 80%;' id='progress'></div>");

    loadScript();
    
    var counter = 0;
    
    var pctComplete = 0;
    $("#progress").progressbar();
    
    var up = function() {
        
        pctComplete++;
        $("#progress").progressbar("value", pctComplete);
        $("#loading-pct").html(pctComplete + "%");
        
        if (pctComplete === 100) {
            $("#cell-" + counter).show();
            pctComplete = 0;
            counter++;
        }
        
        if (counter <= 3 && pctComplete < 100) {
            setTimeout(up, 1000);
        } else {
            $("#cell-4").hide();
        }
        
    };
    
    setTimeout(up, 100);
    
});
