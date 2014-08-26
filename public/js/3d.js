function toggle3D() {
	
	if ($('#cell-3d').length === 1) {
		
		// 3d cell has already been created, just toggle things.
		
		$('#cell-3d').toggle();
		$('#cell-2').toggle();
		
	} else {
	
		// 3d cell has not been created yet. create it and toggle the original.
		
		var d = document.createElement('div');
		$(d).attr('id', 'cell-3d');
		$(d).addClass('box');
		
		$('#cell-2').after(d);
		
		$('#cell-2').toggle();
		
		$(d).css('background-position', '-3px -3px');
		$(d).css('background-repeat', 'no-repeat');

		var f = function() {
			var sw = $('#sizer').css('width');
			if (sw === '310px') {
				$(d).css('background-image', 'url(/images/3d_smallest.png)');
			} else if (sw === '340px') {
				$(d).css('background-image', 'url(/images/3d_small.png)');
			} else {
				$(d).css('background-image', 'url(/images/3d_large.png)');
			}
		};
		
		f();
		
		$(window).resize(f);
	
	}
	
}