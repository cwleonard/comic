var comicComplete = function() {
  
    $("#business-words").html("Maybe they're already chat bots.");
    $("#ceo-words").html("I'm not sure I understand you fully.");
    
};

var businessWords = function(words) {
    
    $("#business-words").html(words);
    
};

$(function() {
    
    var chatFrogName = "Chat Frog";

    $('head').append('<link rel="stylesheet" href="css/jquery.ui.chatbox.css" type="text/css" />');
  
    $("body").append("<div id='chat_div'></div>");
    
    
    $("#chat_div").chatbox({id : "chat_div",
        title : "Amphibian Chat",
        user : "frog",
        offset: 0,
        boxToggled: function(id) {
            if ($("#minIcon").hasClass("fa-minus")) {
                $("#minIcon").removeClass("fa-minus");
                $("#minIcon").addClass("fa-plus");
            } else {
                $("#minIcon").addClass("fa-minus");
                $("#minIcon").removeClass("fa-plus");
            }
        },
        messageSent: function(id, user, msg){
             //console.log("DOM " + id + " just typed in " + msg);
             $("#chat_div").chatbox("option", "boxManager").addMsg("Me", msg);
             setTimeout(function() {
                 talkToTheFrog(msg);
             }, 500);
        }});


    function talkToTheFrog(msg) {

        var reply = bot.reply("local-user", msg);
        $("#chat_div").chatbox("option", "boxManager").addMsg(chatFrogName, reply);

    }
    
    
    var bot = new RiveScript();
    
    bot.loadFile([
                  "other/brain/begin.rive",
                  "other/brain/eliza.rive",
                  "other/brain/javascript.rive",
                  "other/brain/myself.rive"
              ], loading_done, loading_error);
    
    
    function loading_done (batch_num) {
        
        //console.log("Batch #" + batch_num + " has finished loading!");

        // Now the replies must be sorted!
        bot.sortReplies();
        
        $("#chat_div").chatbox("option", "boxManager").addMsg(chatFrogName, "Hi there! You seem to be having trouble reading this comic. I'm here to help!");
        
    }
    
    function loading_error (error) {
        console.log("Error when loading files: " + error);
    }
    
});