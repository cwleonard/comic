
var game;
var frameWidth, frameHeight;

function gameState() {
	
    var showDialog = false;
    var matchCounter = 0;
    
    var TILE_OFFSET = 10;
    
    var BOARD_WIDTH = (frameWidth < 450 ? 5 : 7);
    var BOARD_HEIGHT = (frameWidth < 450 ? 5 : 7);
    
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
    
    function spawnFrogs(num, cb) {
    	
        var waiting = function(tot, callback) {
            var t = tot;
            var c = 0;
            return {
                inc: function() {
                    c++;
                    if (c === t) {
                        callback();
                    }
                }
            };
        }(num, function() {
            cb();
        });
        
        
        for (var x = 0; x < BOARD_WIDTH; x++) {
            for (var y = 0; y < BOARD_HEIGHT; y++) {
            	if (frogs[x][y] == null) {
            		var f = Math.floor((Math.random() * 5));
            		var temp = tiles.create(x*40, y*40, "frogs", f);
            		temp.scale.x = 0.01;
            		temp.scale.y = 0.01;
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
            		var tt = temp.game.add.tween(temp.scale);
            		tt.onComplete.add(waiting.inc);
            		tt.to( { x: 1, y: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
                    var rect = new Phaser.Rectangle((x-1)*40, (y-1)*40, 120, 120);
                    temp.input.boundsRect = rect;

            	}
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
                        matchCounter++;
                        //console.log("found matches: y = " + y + ", x = " + i + " to " + (x-1));
                    }
                    i = x;
                    lastColor = p;
                } else if (x === (BOARD_WIDTH - 1)) {
                    if ((x+1) - i >= 3) {
                        markFrogs(i, (x+1)-i, y, 1);
                        matchCounter++;
                        //console.log("found matches: y = " + y + ", x = " + i + " to " + (x));
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
                        matchCounter++;
                        //console.log("found matches: x = " + x + ", y = " + i + " to " + (y-1));
                    }
                    i = y;
                    lastColor = p;
                } else if (y === (BOARD_HEIGHT - 1)) {
                    if ((y+1) - i >= 3) {
                        markFrogs(x, 1, i, (y+1)-i);
                        matchCounter++;
                        //console.log("found matches: x = " + x + ", y = " + i + " to " + (y));
                    }
                }

            }

        }

        // frogs marked, now sweep
        var howManyKilled = 0;
        for (var x = 0; x < BOARD_WIDTH; x++) {
            for (var y = 0; y < BOARD_HEIGHT; y++) {
                var tf = frogs[x][y];
                if (tf.dropOut) {
                    howManyKilled++;
                    tf.destroy();
                    frogs[x][y] = null;
                }
            }
        }

        // how many do i think should fall?
        var shouldFall = 0;
        for (var x = 0; x < BOARD_WIDTH; x++) {
            for (var y = 0; y < BOARD_HEIGHT - 1; y++) {
                if (frogs[x][y] != null) {
                    for (var z = y+1; z < BOARD_HEIGHT; z++) {
                        if (frogs[x][z] == null) {
                            shouldFall++;
                            break;
                        }
                    }
                }
            }
        }

        //console.log(shouldFall + " frogs should fall");

        var thingy = function(tot, callback) {
            var t = tot;
            var c = 0;
            return {
                inc: function() {
                    c++;
                    if (c === t) {
                        callback();
                    }
                }
            };
        }(shouldFall, function() {
            //console.log("all finished falling");
            spawnFrogs(howManyKilled, function() {
                checkForMatches();
            });
        });

        if (shouldFall > 0) {

            // make them fall
            for (var x = 0; x < BOARD_WIDTH; x++) {
                for (var y = BOARD_HEIGHT - 1; y >= 0; y--) {
                    var tf = frogs[x][y];
                    if (tf == null) {
                        var fallTo = { x: x, y: y };
                        var stop = false;
                        for (var w = y - 1; w >= 0 && !stop; w--) {
                            if (frogs[x][w] != null) {
                                //console.log("frog at " + x + ", " + w + " should fall to " + fallTo.x + ", " + fallTo.y);
                                moveFrog(frogs[x][w], fallTo, (fallTo.y - w) * 150, thingy.inc);
                                stop = true;
                            }
                        }
                    }
                }
            }

        } else if (howManyKilled > 0) {
            spawnFrogs(howManyKilled, function() {
                checkForMatches();
            });
        } else if (howManyKilled == 0) {
            tiles.setAll('inputEnabled', true);
            checkMatchCounter();
        }

    }
    
    
    function clearMatchCounter() {
        showDialog = true;
        matchCounter = 0;
    }
    
    function checkMatchCounter() {

        if (!showDialog) return;
        
        if (matchCounter > 5) {
            $('#sfe').html("This is a complete disaster!");
            $('#sfe').fadeIn(500);
            game.time.events.add(1000, function() {
                $('#sfe').fadeOut(500);
            }, this);
        } else if (matchCounter > 4) {
            $('#sfe').html("Why won't they stay? We have free coffee!");
            $('#sfe').fadeIn(500);
            game.time.events.add(1500, function() {
                $('#sfe').fadeOut(500);
            }, this);
        } else if (matchCounter > 2) {
            $('#sfe').html("Is this job really that terrible?");
            $('#sfe').fadeIn(500);
            game.time.events.add(1500, function() {
                $('#sfe').fadeOut(500);
            }, this);
        } else if (matchCounter > 0) {
            $('#sfe').html("Not again! Where are they going?");
            $('#sfe').fadeIn(500);
            game.time.events.add(1200, function() {
                $('#sfe').fadeOut(500);
            }, this);
        } else if (matchCounter === 0) {
            $('#sfe').html("Well, that did nothing.");
            $('#sfe').fadeIn(500);
            game.time.events.add(1000, function() {
                $('#sfe').fadeOut(500);
            }, this);
        }
        
    }
    
    function tilePosition(s) {
        
        //console.log(s.position.x + ", " + s.position.y);
        
        var x1 = Math.floor((s.position.x + (s.width / 2)) / 40);
        var y1 = Math.floor((s.position.y + (s.height / 2)) / 40);
        
        if (x1 < 0 || x1 >= BOARD_WIDTH || y1 < 0 || y1 >= BOARD_HEIGHT) {
            return null;
        } else {
            return {
                x: x1,
                y: y1
            };
        }
        
    }
    
    function swapFrogs(frog1, frog2, cb) {
    	
        if (frog2 != null) {
        	var t1 = frog1.game.add.tween(frog2.position);        
        	var t2 = frog1.game.add.tween(frog1.position);
        	
        	t1.to( { x: frog1.boardPosition.x * 40, y: frog1.boardPosition.y * 40 }, 200, Phaser.Easing.Linear.None, false, 0, 0, false);
        	t2.to( { x: frog2.boardPosition.x * 40, y: frog2.boardPosition.y * 40 }, 200, Phaser.Easing.Linear.None, false, 0, 0, false);
        	
        	t2.onComplete.add(function() {
        		cb();
        	}, this);
        	
        	t1.start();
        	t2.start();
        }
        
        frogs[frog1.boardPosition.x][frog1.boardPosition.y] = frog2;
        frogs[frog2.boardPosition.x][frog2.boardPosition.y] = frog1;
        
        var np = frog2.boardPosition;
        frog2.boardPosition = frog1.boardPosition;
        frog1.boardPosition = np;
        
        var r = frog2.input.boundsRect;
        frog2.input.boundsRect = frog1.input.boundsRect;
        frog1.input.boundsRect = r;

    	
    }

    function moveFrog(frog1, np, ts, cb) {
    	
        if (!ts) ts = 100;
        
    	if (frogs[np.x][np.y]) {
    		//console.log("won't move to an occupied position: " + np);
    		return;
    	}
    	
       	var tween = frog1.game.add.tween(frog1.position);
       	tween.to( { x: np.x * 40, y: np.y * 40 }, ts, Phaser.Easing.Linear.None, false, 0, 0, false);
       	if (cb) {
       	    tween.onComplete.add(cb);
       	}
       	tween.start();
        
       	frogs[frog1.boardPosition.x][frog1.boardPosition.y] = null;
        frogs[np.x][np.y] = frog1;
        frog1.boardPosition = np;
        var rect = new Phaser.Rectangle((np.x-1)*40, (np.y-1)*40, 120, 120);
        frog1.input.boundsRect = rect;

    	
    	
    }

    function releaseFrog(sprite, p) {

        clearMatchCounter();
        
        tiles.setAll('inputEnabled', false);

        this.game.add.tween(this.scale).to( { x: 1, y: 1 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);

        var np = tilePosition(sprite);
        if (np == null) {
            this.game.add.tween(this.position).to( { x: this.boardPosition.x*40, y: this.boardPosition.y*40 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
            tiles.setAll('inputEnabled', true);
            return;
        }
        var otherFrog = frogs[np.x][np.y];
        
        swapFrogs(this, otherFrog, checkForMatches);
        
    }
    
    function selectFrog() {
        tiles.bringToTop(this);
        this.game.add.tween(this.scale).to( { x: 1.2, y: 1.2 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);        
    }
    
    function create() {
        
        
        this.stage.backgroundColor = "#509d5a";
    
        tiles = this.add.group();
        
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
                
                var rec = new Phaser.Rectangle((x-1)*40, (y-1)*40, 120, 120);
                temp.input.boundsRect = rec;
                
            }
        }
        
        this.add.image((BOARD_WIDTH * 40) + 45, (BOARD_HEIGHT > 5 ? 200 : 140), "science");
        
        tiles.setAll('inputEnabled', false);
        checkForMatches();
        
        $('#sfe').fadeOut(1200);
        
    }
    
    function update() {
        
    }
    
    function render() {

    }
    
    return {
        preload: preload,
        create: create,
        update: update,
        render: render
    };
	
}

$(function() {
	
    frameWidth = $('#sizer').width();
    frameHeight = $('#cell-2').height();
    
    // 450
    // 340
    // 310
    
    //console.log("frame width = " + w + ", height = " + h);
    
	var state = gameState();
	
	game = new Phaser.Game(frameWidth, frameHeight, Phaser.CANVAS, "cell-2",
			state);
	
});
