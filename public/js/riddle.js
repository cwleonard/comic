var tmo;

$(function() {

    $("#answer-bubble").html("<input type='text' class='form-control' style='text-align: center;' id='riddle-answer' placeholder='your answer here'>");
    
    var theRealText = $("#extraText").html();
    
    var newMarkup = "<p>Comment from <span style='text-decoration: underline;'>cwleonard</span>:</p>";
    newMarkup += "<div style='border-radius: 0px 15px 15px 15px; margin-left: 15%; margin-top: 3px; padding: 10px; background-color: #ffffff; border: 1px solid #999999;'>" + theRealText + "</div>";
    newMarkup += "<hr/>";
    
    newMarkup += "<p>Comment from <span style='text-decoration: underline;'>FrogLover3434</span>:</p>";
    newMarkup += "<div style='border-radius: 0px 15px 15px 15px; margin-left: 15%; margin-top: 3px; padding: 10px; background-color: #ffffff; border: 1px solid #999999;'>this is the dumbest comic yet. you suck!!!!</div>";
    newMarkup += "<hr/>";
    
    newMarkup += "<p>Comment from <span style='text-decoration: underline;'>nanu57v</span>:</p>";
    newMarkup += "<div style='border-radius: 0px 15px 15px 15px; margin-left: 15%; margin-top: 3px; padding: 10px; background-color: #ffffff; border: 1px solid #999999;'>Earn money from home! Visit http://badid.ea/xowiug7 to learn how!</div>";
    newMarkup += "<hr/>";
    
    newMarkup += "<p>Leave a comment:</p>";
    newMarkup += "<div style='margin-left: 15%; margin-top: 3px;'>";
    newMarkup += "<input type='text' class='form-control' id='comment-name' placeholder='your name'>";
    newMarkup += "<textarea style='margin-top: 3px;' class='form-control' id='comment-text' placeholder='your comments'></textarea>";
    newMarkup += "<button style='margin-top: 3px;'>Submit</button>";
    newMarkup += "</div>";
    newMarkup += "<hr/>";
    
    
    $("#extraText").html(newMarkup);
    
    $("#riddle-answer").change(function() {
       
        var ans = $("#riddle-answer").val();
        
        if (ans.toLowerCase() === "blood") {
            
            clearTimeout(tmo);
            $("#wrong").hide();
            $("#correct").show();
            $("#riddle-answer").off();
            
            $("#answer-bubble").html("Blood.");
            
            $("#cell-4").show();
            
        } else {

            clearTimeout(tmo);

            $("#wrong").show();
            tmo = setTimeout(function() {
                $("#wrong").hide();
            }, 750);
            
        }
        
    });
    
});