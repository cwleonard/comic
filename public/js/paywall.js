
function showPaymentModal() {
	
	$('#inputModal').modal('show');
	
}

function checkForPayment() {
	
	$.ajax({
		url: "/paidContent/paywall-comic",
		dataType: "html",
		success: function(data) {
			
			var saveNav = $('#comicNav').html();
			$('#comicArea').html(data);
			$('#comicNav').html(saveNav);
			
			$('#inputModal').modal('hide');
			
		},
		error: function(xhr, respText, et) {
			
			if (xhr.status === 402) {

				var addr = xhr.getResponseHeader("X-Payment-Address-Bitcoin");
				var cost = xhr.getResponseHeader("X-Payment-Amount-Bitcoin");

				var bcqr = encodeURIComponent("bitcoin:" + addr + "?amount=" + cost);
				
				$('#inputModal .modal-body').html("<p style='text-align: center'>Pay with Bitcoin!<br><img src='/qrc?text=" + bcqr + "'><br>Send " + cost + " BTC to<br>" + addr + "</p><p style='margin-top: 10px; font-weight: bold; text-align: center'>Waiting for payment...<br><img src=\"/simg/wait-for-payment.gif\"></p>");
				
				console.log($('#inputModal').css("display"));
				if ($('#inputModal').css("display") == "block") {
					setTimeout(checkForPayment, 2000);
				}
				
			} else {
				console.log("failed");
			}
			
		}
	});
	
}

$(function() {
	
	$('#inputModalLabel').html("Payment Required");
	$('#inputModal .modal-body').html("");
	
	$('#inputModal').on("shown.bs.modal", function() {
		checkForPayment();
	});
	
	$('#pay-button-text').addClass("btn btn-primary");
	$('#pay-button-text').on("click", function() {
		showPaymentModal();
	});
	
	checkForPayment();

	$('#confirmInputButton').unbind('click');
	
	$('#confirmInputButton').click(function() {
		$('#inputModal').modal('hide');
	});
	
	
});