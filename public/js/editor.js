function doSave() {
	$.ajax({
		url: '/data',
		type: 'POST',
		data: $('#data').val(),
		contentType: 'application/json; charset=utf-8',
		dataType: 'text',
		success: function(data) {
			console.log(data);
		}
	});

}

function doSave2() {
	
	var cobj = {
		cells: []
	};
	$('#comicArea div.box').each(function(idx, elem) {
		console.log('found box element');
		cobj.cells.push({});
	});
	
	$('#data').val(JSON.stringify(cobj));

}

function addCell() {

	$('#comicArea').prepend("<div class='box'></div>");

}