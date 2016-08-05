$(function() {

	$('head').append('<link rel="stylesheet" href="css/clippy.css" type="text/css" />');
	
	var $cell = $("#cell-0");
	var pos = $cell.position();
	var x = pos.left + $cell.width() - 80;
	var y = pos.top + $cell.height() - 25;
	
	if (window.agentClippy === undefined) {
	    
	    clippy.load("Clippy", function(agent) {
	        
	        window.agentClippy = agent;
	        agent.moveTo(x, y);
	        agent.show();
	        
	        window.setTimeout(function() {
	            doSomething();
	        }, 5000);
	        
	    });
	    
	}

	
	var sayings = [ "Hey there! It looks like you're trying to read a web comic!",
	                "I like the taste of fresh newspaper.",
	                "Have you read Nameless PCs? It's much better than this. http://www.namelesspcs.com",
	                "I'm coming back in Windows 11. Just wait.",
	                "Do you know how fast you were scrolling just now?",
	                "Have you seen my friend Bob?",
	                "I dated a stapler once back in collage." ];
	
    function doSomething() {
        
        var r = Math.floor(Math.random() * 10);
        agentClippy.stop();
        
        if (r <= 4) {
            
            agentClippy.speak(sayings[Math.floor(Math.random() * sayings.length)]);
            
        } else if (r === 5) {
            
            agentClippy.play("GetAttention");
            
        } else if (r === 6) {

            agentClippy.play("LookLeft");
            agentClippy.moveTo(x, y);

            
        } else if (r === 7) {
            
            agentClippy.play("LookRight");
            agentClippy.moveTo(pos.left-40, y);
            
        } else if (r === 8) {
            
            agentClippy.play("GestureDown");
            
        } else if (r === 9) {
            
            agentClippy.play("Writing");
            
        }
        
        window.setTimeout(function() {
            doSomething();
        }, 9000);
        
    }
	
});