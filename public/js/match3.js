
var coinsCollected = 0;
var startTime = null;
var elapsedTime = null;

function gameState() {
	
    var BOARD_WIDTH = 11;
    var BOARD_HEIGHT = 7;
    
	var board = [];
	var frogs = [];
	var tiles;
	
    function preload() {
        this.load.pack("main", "other/match3-pack.json");
    }
    
    function populateArray() {
        
        for (var x = 0; x < BOARD_WIDTH; x++) {
            board[x] = [];
            frogs[x] = [];
            for (var y = 0; y < BOARD_HEIGHT; y++) {
                board[x][y] = Math.floor((Math.random() * 5));
                frogs[x][y] = null;
            }
        }
        
    }
    
    function tilePosition(s) {
        
        console.log(s.position.x + ", " + s.position.y);
        
        
        var x1 = Math.floor(s.position.x / 40);
        var y1 = Math.floor(s.position.y / 40);
        
        return {
            x: x1,
            y: y1
        };
        
    }
    
    function releaseFrog(sig, p) {
        
        var np = tilePosition(p);
        console.log(np);

        this.game.add.tween(this.scale).to( { x: 1, y: 1 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
        
        var otherFrog = frogs[np.x][np.y];

        this.game.add.tween(otherFrog.position).to( { x: this.boardPosition.x * 40, y: this.boardPosition.y * 40 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);        
        this.game.add.tween(this.position).to( { x: otherFrog.boardPosition.x * 40, y: otherFrog.boardPosition.y * 40}, 100, Phaser.Easing.Linear.None, true, 0, 0, false);        
        
        frogs[this.boardPosition.x][this.boardPosition.y] = otherFrog;
        frogs[np.x][np.y] = this;
        otherFrog.boardPosition = this.boardPosition;
        this.boardPosition = np;
        
        
    }
    
    function selectFrog() {
        tiles.bringToTop(this);
        this.game.add.tween(this.scale).to( { x: 1.2, y: 1.2 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);        
    }
    
    function create() {
        
        populateArray();
        
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.stage.backgroundColor = "#666666";
    
        tiles = this.add.group();
        tiles.enableBody = true;

        for (var x = 0; x < BOARD_WIDTH; x++) {
            for (var y = 0; y < BOARD_HEIGHT; y++) {
                var f = board[x][y];
                var temp = tiles.create(x*40, y*40, "frogs", f);
                frogs[x][y] = temp;
                temp.boardPosition = {
                        x: x,
                        y: y
                }
                temp.inputEnabled = true;
                temp.input.enableDrag(true);
                temp.events.onDragStart.add(selectFrog, temp);
                temp.events.onDragStop.add(releaseFrog, temp);
            }
        }
        
    }
    
    function update() {
        
        this.physics.arcade.collide(tiles);
        
    }
    
    function render() {
    	//this.game.debug.body(frog);
    }
    
    return {
        preload: preload,
        create: create,
        update: update,
        render: render
    };
	
}


$(function() {
	
    var width = $('#sizer').width();
    var height = $('#cell-2').height();
    
	var state = gameState();
	
	var game = new Phaser.Game(width, height, Phaser.CANVAS, "cell-2",
			state);
	
});
