
$(function() {

    for (var i = 0; i < 4; i++) {
        $('#cell-' + i + '-up').unbind('click');
        $('#cell-' + i + '-down').unbind('click');
    }

    // --------------------------------------

    $('#cell-0-up').click(function(i) {
        cellFeedback(0, true, false);
    });
    $('#cell-0-down').click(function() {
        cellFeedback(0, false, true);
    });

    $('#cell-1-up').click(function(i) {
        cellFeedback(1, true, false);
    });
    $('#cell-1-down').click(function() {
        cellFeedback(1, false, true);
    });

    $('#cell-2-up').click(function(i) {
        cellFeedback(2, true, false);
    });
    $('#cell-2-down').click(function() {
        cellFeedback(2, false, true);
    });

    $('#cell-3-up').click(function(i) {
        cellFeedback(3, true, false);
    });
    $('#cell-3-down').click(function() {
        cellFeedback(3, false, true);
    });

    // --------------------------------------
	
    $.ajax({
		url: "/algorithmOrder/rankings",
		dataType: "json",
		success: function(data) {

            var cellRanks = [];

            for (var i = 0; i < data.length; i++) {
                var r = data[i];
                cellRanks[r.cell] = (r.up * 2) - r.down;
            }

            console.log(cellRanks);

            sortCells(cellRanks);

		},
		error: function(xhr, respText, et) {
			
			console.log("failed");
			
		}
	});
	
});

function sortCells(ranksArray) {

    for (var i = 1; i < ranksArray.length; i++) {

        var c = $("#cell-" + i);
        if (c.length > 0) {
            
            var r = ranksArray[i];
    
            var n = i;
            while (r > ranksArray[n-1] && n >= 0) {
                c.insertBefore(c.prev());
                n--;
            }

        }

    }

}

function cellFeedback(num, up, down) {
    $.ajax({
        url: '/algorithmOrder/vote',
        type: 'POST',
        data: {
            "cell": num,
            "up": up,
            "down": down
        },
        success: function(data) {
            console.log('thanks for the feedback!');
            $('#cell-' + num + '-up').unbind('click');
	        $('#cell-' + num + '-down').unbind('click');
            $('#cell-' + num + '-up').hide();
            $('#cell-' + num + '-down').hide();
        }
    });
}
