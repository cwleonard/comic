$(function() {

    var winnings = 0;
    
    $("#p-total").html("$" + winnings);
    
    var game = [

                {
                    answer: "14",
                    value: 100,
                    questions: [{
                        text: "How many days can frogs lack water?"
                    },
                    {
                        text: "How many spots are on CEO Frog's back?",
                        correct: true
                    },
                    {
                        text: "What is the 6th prime number?"
                    }]
                },
                
                {
                    answer: "Pennsylvania",
                    value: 200,
                    questions: [{
                        text: "Where do pencils come from?"
                    },
                    {
                        text: "Which state's state animal is a frog?"
                    },
                    {
                        text: "Where is the frogs' company located?",
                        correct: true
                    }]
                },
                
                {
                    answer: "Baby don't hurt me",
                    value: 300,
                    questions: [{
                        text: "What is love?",
                        correct: true
                    },
                    {
                        text: "Never gonna tell a lie and hurt you?"
                    },
                    {
                        text: "I got me a Chrysler, it seats about 20?"
                    }]
                },
                
                {
                    answer: "Solar panels",
                    value: 400,
                    questions: [{
                        text: "Where do the frogs get their electricity?",
                        correct: true
                    },
                    {
                        text: "What was point of the July 7th comic?"
                    },
                    {
                        text: "What happens when it rains?"
                    }]
                },
                
                {
                    answer: "1337",
                    value: 500,
                    questions: [{
                        text: "Do hackers like ponies?"
                    },
                    {
                        text: "How many frogs work at the company?",
                        correct: true
                    },
                    {
                        text: "What is your social security number?"
                    }]
                }
                
                ];
    
    $("#t-100").click(function() {
        doQuestions(0, this);
    });

    $("#t-200").click(function() {
        doQuestions(1, this);
    });

    $("#t-300").click(function() {
        doQuestions(2, this);
    });

    $("#t-400").click(function() {
        doQuestions(3, this);
    });
    
    $("#t-500").click(function() {
        doQuestions(4, this);
    });
    
    var addWinnings = function(v) {
        winnings += v;
        $("#p-total").html("$" + winnings);
        nextAnswer();
    };
    
    var nextAnswer = function() {
        
        $("#cell-3").hide();
        $("#cell-2").show();

    };
    
    var doQuestions = function(n, qEl) {
        
        $("#cell-2").hide();
        $("#cell-3").show();
        
        $(qEl).html("");
        $(qEl).unbind();
        
        var q = game[n];
        
        $("#answer").html("Answer: <i>" + q.answer + "</i>");
        
        $("#q1").html(q.questions[0].text);
        $("#q2").html(q.questions[1].text);
        $("#q3").html(q.questions[2].text);
        
        $("#q1").unbind();
        $("#q2").unbind();
        $("#q3").unbind();
        
        $("#q1").click(function() {
            if (q.questions[0].correct) {
                addWinnings(q.value);
            } else {
                nextAnswer();
            }
        });

        $("#q2").click(function() {
            if (q.questions[1].correct) {
                addWinnings(q.value);
            } else {
                nextAnswer();
            }
        });

        $("#q3").click(function() {
            if (q.questions[2].correct) {
                addWinnings(q.value);
            } else {
                nextAnswer();
            }
        });

    };

});