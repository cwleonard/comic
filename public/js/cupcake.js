$(function() {
	
	var bait = ['Local frog saved thousands by doing this every morning...',
	            'You\'ll never believe what this frog did next...',
	            'The bit of cupcake advice that can save this frog from certain death...',
	            '5 life lessons learned from frogs and cupcakes...',
	            '10 facts about frogs with cupcakes that will change your life...',
	            'Are frogs with cupcakes making you gain weight?',
	            'Celebrities have been seen with these frogs and cupcakes...',
	            'This frog was forced to bait clicks with cupcakes. What happened next WILL SHOCK YOU!',
	            'No one wanted to click on this cupcake. Until this happened...',
	            'Are frogs with cupcakes leading us towards war?',
	            'New study disproves everything you thought you knew about cupcakes!',
	            'New study disproves everything you thought you knew about frogs!',
	            'New study disproves everything frogs thought you knew about cupcakes!',
	            'New study disproves everything cupcakes knew about frogs!',
	            'Doctors everywhere hate frogs for revealing this one simple trick...'];
	var bNum = 0;
	var clickCounter = 0;
	
	$('#cupcake').unbind('click'); // in case this gets executed more than once
	
	$('#cupcake').click(function() { 
		
		clickCounter++;
		$('#bait-text').html(bait[bNum]);
		bNum++;
		if (bNum === bait.length) {
			bNum = 0;
		}
		
		$('#frog-results').text('I caught ' + clickCounter + ' clicks today!');

		if (clickCounter === 5) {
			$('#frog-reward').text('You earned your pay.');
		}

		if (clickCounter === 15) {
			$('#frog-reward').text('You get a bonus!');
		}

		if (clickCounter === 30) {
			$('#frog-reward').text('I\'m promoting you!');
		}

		if (clickCounter === 80) {
			$('#frog-reward').text('Employee of the Year!');
		}

		if (clickCounter === 150) {
			$('#frog-reward').text('We\'re sending you on a paid vacation!');
		}

		if (clickCounter === 1000) {
			$('#frog-reward').text('Stop! Your finger is tired!');
		}

	});
	
});