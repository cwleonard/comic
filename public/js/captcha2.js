
var current_question = 0;

$(function() {

	var theComidId = $("#sizer").attr("comicid");
	if (theComidId === '772') {

		$("head").append("<link rel='stylesheet' type='text/css' href='css/captcha2.css'>");
		$('p.cTitle').after('<div id="frogCaptcha"><div id="title_area"><div id="fixed_title">Select all images with</div><div id="question_title"></div></div><div id="question_wrapper"></div><div id="controls_wrapper"><button id="verify_button" onclick="check_tiles()">Verify</button></div></div>');
		
		load_question(current_question);

	}
    
});


var questions = [
	{
		title: "Delicious Food",
		right_tiles: [
			"https://amphibian.com/images/basement-bug.jpg",
            "https://amphibian.com/images/brown_bug.jpg",
            "https://amphibian.com/images/cicada.jpg",
            "https://amphibian.com/images/bed-bug.png",
            "https://amphibian.com/images/spotted-lanternfly.jpg",
            "https://amphibian.com/images/ladybug.jpg",
            "https://amphibian.com/images/waterbug.jpg"
		],
		wrong_tiles: [
            "https://amphibian.com/images/subs.jpg",
            "https://amphibian.com/images/pizza.jpg",
            "https://amphibian.com/images/burger.jpg"
		]
	}
];

function randint(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function load_question(number) {
	document.getElementById('question_title').innerHTML = questions[number].title;
	var correct_answers = 6;
	var right_shuffled = questions[number].right_tiles.sort(() => 0.5 - Math.random());
	var wrong_shuffled = questions[number].wrong_tiles.sort(() => 0.5 - Math.random());
	var tiles = [].concat(right_shuffled.slice(0,correct_answers), wrong_shuffled.slice(0,9-correct_answers))
	var tiles_shuffled = tiles.sort(() => 0.5 - Math.random());
	tiles_str = "";
	for (tile of tiles_shuffled) {
		tiles_str += `<div class='tile' onclick='select_tile(this)'><img src='${tile}'></div>`;
	}
	document.getElementById('question_wrapper').innerHTML = tiles_str;
}


function select_tile(tile) {
	tile.classList.toggle("selected");
}
function check_tiles() {
	var points = 0;
	var all_tiles = document.getElementById('question_wrapper').childNodes;
	for (tile of all_tiles) {
		if (questions[current_question].right_tiles.includes(tile.childNodes[0].src)) {
			if (tile.classList.contains("selected")) {
				points++;
			}
		}
		else {
			if (!tile.classList.contains("selected")) {
				points++;
			}
		}
	}
	if (points == 9) {

        $("#cell-0").show();
        $("#cell-1").show();
        $("#cell-2").show();
        $("#cell-3").show();

        $("#frogCaptcha").hide();

    } else {

		$("#cell-4").show();

        $("#frogCaptcha").hide();

	}
}