var paymentAddress = null;

function getBitcoinAddress() {
	
	if (!paymentAddress) {
		
		$.get("/coin/address", function(data) {
			
			paymentAddress = data;
			
			var btcQR = "bitcoin:" + paymentAddress + "?amount=0.001";
			
			$('#inputModal .modal-body').html("<p style='text-align: center'><img src='/qrc?text=" + btcQR + "'><br>" + paymentAddress + "</p>");

			$('#inputModal').modal('toggle');

		}, "text");
		
		
	} else {
		$('#inputModal').modal('toggle');
	}
	
}

$(function() {
	
	$('#confirmInputButton').unbind('click');
	
	$('#confirmInputButton').click(function() {
		$('#inputModal').modal('toggle');
	});
	
	
});