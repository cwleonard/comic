
var coinsCollected = 0;
var startTime = null;
var elapsedTime = null;

function gameState() {
	
    var BOARD_WIDTH = 5;
    var BOARD_HEIGHT = 5;
    
	var frogs = [];
	var tiles; // phaser group
	
    function preload() {
        this.load.pack("main", "other/match3-pack.json");
    }
    
    function markFrogs(x, xl, y, yl) {
    	
    	for (var i = x; i < x+xl; i++) {
    		for (var j = y; j < y+yl; j++) {
    			frogs[i][j].dropOut = true;
    		}
    	}
    	
    }
    
    function checkForMatches() {
    	
    	// check sideways
    	for (var y = 0; y < BOARD_HEIGHT; y++) {

    		var i = 0;
    		var lastColor = frogs[0][y].frogType; // last color
    		
    		for (var x = 1; x < BOARD_WIDTH; x++) {
    			
    			var p = frogs[x][y].frogType;
    			if (p !== lastColor) {
    				if (x - i >= 3) {
    					markFrogs(i, x-i, y, 1);
    					console.log("found matches: y = " + y + ", x = " + i + " to " + (x-1));
    				}
    				i = x;
    				lastColor = p;
    			} else if (x === (BOARD_WIDTH - 1)) {
    				if ((x+1) - i >= 3) {
    					markFrogs(i, (x+1)-i, y, 1);
    					console.log("found matches: y = " + y + ", x = " + i + " to " + (x));
    				}
    			}
    			
    		}
    		
    	}

    	// check up/down
    	for (var x = 0; x < BOARD_WIDTH; x++) {

    		var i = 0;
    		var lastColor = frogs[x][0].frogType; // last color
    		
    		for (var y = 1; y < BOARD_HEIGHT; y++) {
    			
    			var p = frogs[x][y].frogType;
    			if (p !== lastColor) {
    				if (y - i >= 3) {
    					markFrogs(x, 1, i, y-i);
    					console.log("found matches: x = " + x + ", y = " + i + " to " + (y-1));
    				}
    				i = y;
    				lastColor = p;
    			} else if (y === (BOARD_HEIGHT - 1)) {
    				if ((y+1) - i >= 3) {
    					markFrogs(x, 1, i, (y+1)-i);
    					console.log("found matches: x = " + x + ", y = " + i + " to " + (y));
    				}
    			}
    			
    		}
    		
    	}
    	
    	// frogs marked, now sweep
        for (var x = 0; x < BOARD_WIDTH; x++) {
            for (var y = 0; y < BOARD_HEIGHT; y++) {
            	var tf = frogs[x][y];
            	if (tf.dropOut) {
            		tf.destroy();
            		frogs[x][y] = null;
            	}
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
        
        checkForMatches();
        
        
    }
    
    function selectFrog() {
        tiles.bringToTop(this);
        this.game.add.tween(this.scale).to( { x: 1.2, y: 1.2 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);        
    }
    
    function create() {
        
        
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.stage.backgroundColor = "#666666";
    
        tiles = this.add.group();
        tiles.enableBody = true;

        
        for (var x = 0; x < BOARD_WIDTH; x++) {
        	frogs[x] = [];
            for (var y = 0; y < BOARD_HEIGHT; y++) {
                var f = Math.floor((Math.random() * 5));
                var temp = tiles.create(x*40, y*40, "frogs", f);
                frogs[x][y] = temp;
                temp.boardPosition = {
                        x: x,
                        y: y
                };
                temp.frogType = f;
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
