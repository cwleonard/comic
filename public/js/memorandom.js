var verbs = [ "add", "assist", "bake", "call", "chase", "compare", "damage",
		"drop", "end", "escape", "fasten", "fix", "gather", "grab",
		"hug", "imagine", "jog", "jump", "kick", "knit", "land",
		"lock", "march", "mix", "name", "obey", "open", "pass",
		"promise", "question", "reach", "rinse", "scatter", "stay", "talk",
		"transcribe", "turn", "unfasten", "use", "visit", "walk", "weave",
		"work", "yawn", "yell", "zip", "zoom" ];

var adjectives = [ "adorable", "beautiful", "clean", "drab", "elegant",
		"fancy", "glamorous", "handsome", "magnificent", "old-fashioned",
		"plain", "quaint", "sparkling", "unsightly", "careful", "clever",
		"famous", "gifted", "helpful", "important", "inexpensive", "mushy",
		"odd", "powerful", "rich", "shy", "tender", "vast", "wrong", "angry",
		"bewildered", "clumsy", "defeated", "embarrassed", "fierce", "grumpy",
		"helpless", "jealous", "lazy", "mysterious", "nervous", "obnoxious",
		"panicky", "repulsive", "scary", "thoughtless", "uptight", "worried",
		"ancient", "boiling", "breezy", "broken", "bumpy", "chilly", "cold",
		"cool", "creepy", "crooked", "cuddly", "curly", "damaged", "damp",
		"dirty", "dry", "dusty", "filthy", "flaky", "fluffy", "freezing",
		"warm", "wet" ];

var nouns = [ "cabbages", "cables", "cactus", "cakes", "calculators",
		"cameras", "cannons", "carts", "celery", "chickens", "clocks",
		"clouds", "crackers", "crates", "crayons", "cushions", "eggs",
		"engines", "errors", "events", "examples", "icicles", "ideas",
		"insects", "instruments", "irons", "jellyfish", "jewels", "oatmeal",
		"sacks", "sails", "scissors", "shades", "shakes", "sheep", "ships",
		"shirts", "signs", "skates", "snails", "snakes", "socks", "songs",
		"sounds", "sparks", "spiders", "sponges", "spoons", "squirrels",
		"stations", "sticks", "stones", "stores", "story", "stoves",
		"strangers", "streams", "streets", "strings", "structures",
		"substances", "supports", "surprises", "sweaters", "swings", "systems" ];


function getRandomWord(list) {
	return list[Math.floor(Math.random() * list.length)];
}

function makeMemo() {

	var memo = getRandomWord(verbs) + " " + getRandomWord(adjectives) + " " + getRandomWord(nouns);
	console.log(memo);
	return memo;

}

$(function() {

	$("#memo-text").text(makeMemo());
	$("#refresh-button").addClass("btn btn-success btn-lg");
	$("#refresh-button").click(function() {
		$("#memo-text").text(makeMemo());
	});
	
});