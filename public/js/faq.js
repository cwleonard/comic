
$(function() {
	
	$('#confirmInputButton').unbind('click');
	    
    $('#inputModal label').html("Ask A Question!");
	    
    $('#confirmInputButton').click(function() {
        
        var q = $('#someText').val();
        console.log(q);
        
        askQuestion(q);
        
        $('#inputModal').modal('toggle');
    });
	    
    $('#cell-3').click(function() {
        $('#inputModal').modal('toggle');
    });

	
});

function askQuestion(q) {
    $.ajax({
        url: '/faq/ask',
        type: 'POST',
        data: {question: q},
        success: function(data) {
            console.log('asked a question');
        }
    });
}
