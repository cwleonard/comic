$(function() {

    var round = 0;
    var doors = [ 0, 0, 0 ];
    var p = Math.random();
    if (p <= 0.3333) {
        doors[0] = 1;
    } else if (p >= 0.6666) {
        doors[2] = 1;
    } else {
        doors[1] = 1;
    }

    function doorClick(n) {
        
        if (round === 1) {
        
            if (doors[n] === 1) {
                win(n);
            } else {
                lose(n);
            }
            
            $("#final-text").html("Winning is subjective. Maybe I wanted some goats.");
            
        } else {


            if (n !== 0 && doors[0] !== 1) {
                openDoor(n, 0);
            } else if (n !== 1 && doors[1] !== 1) {
                openDoor(n, 1);
            } else {
                openDoor(n, 2);
            }
            
        }
        
    }
    
    function win(n) {
        
        $("#game-instructions").html("Congratulations! Here's your million dollar grand prize!");

        $("#door" + (n+1) + "-open").attr("src", "/images/door_open_money.svg");
        
        $("#text" + (n+1)).hide();
        $("#door" + (n+1)).hide();
        
        $("#text1,#text2,#text3").unbind();
        $("#door1,#door2,#door3").unbind();

    }
    
    function lose(n) {
        
        $("#game-instructions").html("Awww, sorry! But please accept these goats as a parting gift!");

        $("#door" + (n+1) + "-open").attr("src", "/images/door_open_goat.svg");

        $("#text" + (n+1)).hide();
        $("#door" + (n+1)).hide();

        $("#text1,#text2,#text3").unbind();
        $("#door1,#door2,#door3").unbind();

    }
    
    function openDoor(p, n) {

        // show what's behind door n (should be a goat)
        
        $("#game-instructions").html("Are you sure? If you quit now you can keep the goat behind Door " + (n+1) + "! Or continue and open one of the remaining doors?");

        $("#door" + (n+1)).unbind();
        $("#door" + (n+1) + "-open").attr("src", "/images/door_open_goat.svg");
        $("#text" + (n+1)).hide();
        $("#door" + (n+1)).hide();
        
        round++;
        
    }
    
    $("#door1,#text1").click(function() {
       doorClick(0);
    });

    $("#door2,#text2").click(function() {
        doorClick(1);
    });

    $("#door3,#text3").click(function() {
        doorClick(2);
    });


});