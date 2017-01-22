
function gameState() {
	
	var sf = 1;
	
    var player;
    var cursors;
    var frogs;
    var rect;
    var text;
    var frogSlots = [];
	
    function preload() {
        this.load.pack("main", "other/trucker-pack.json");
    }
    
    function create() {
    	
    	if (this.game.width === 340) {
            sf = 0.75;
        } else if (this.game.width === 310) {
            sf = 0.69;
        } else if (this.game.width === 650) {
        	sf = 1.44;
        }
        
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        var hw = this.add.image(0, 0, 'ground');
        hw.scale.setTo(1 * sf, 1 * sf);
        
        player = this.add.sprite(-(95/3)*sf, game.height / 2, 'truck');
        player.anchor.setTo(0.5, 0.5);
        this.physics.enable(player, Phaser.Physics.ARCADE);
        player.scale.setTo(1 * sf, 1 * sf);
        
//        rect = this.add.sprite(0, this.game.height - (30 * sf), null);
//        this.physics.enable(rect, Phaser.Physics.ARCADE);
//        rect.body.setSize(this.game.width, 30 * sf, 0, 0); // set the size of the rectangle
        
        frogs = this.add.group();
        frogs.enableBody = true;
        frogs.physicsBodyType = Phaser.Physics.ARCADE;

        createFrogs();
        
        text = this.add.text(this.game.world.centerX,70 * sf,' ', { font: 'bold ' + (40 * sf) + 'px sniglet', fill: '#ff0000' });
        text.anchor.setTo(0.5, 0.5);
        text.visible = false;
        
        cursors = this.input.keyboard.createCursorKeys();
        fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
    }
    
    function createFrogs() {
    	
    	for (var i = 0; i < 3; i++) {
    		
    		newFrog();
    		
        }

    }
    
    function randomFrogSlot() {
    	return Math.floor(Math.random() * 11) + 1;
    }
    
    function newFrog() {
    	
		var rx = randomFrogSlot();
		while (frogSlots[rx]) {
			rx = randomFrogSlot();
		}
		
		var f = frogs.create(rx * (35*sf), game.height - (20 * sf), 'frog');
		frogSlots[rx] = f;
		f.slotNum = rx;
		
		f.outOfBoundsKill = true;
		f.checkWorldBounds = true;
		
		f.anchor.setTo(0.5, 0.5);
		f.animations.add('hop', [ 0, 1 ], 2, true);
        f.play('hop');
		f.scale.setTo(1 * sf, 1 * sf);
		f.hopSpeed = -((Math.floor(Math.random() * 3) + 3) * 10);

		return f;
    	
    }
    
    function update() {
        
        if (player.alive) {
            
            //  Reset the player, then check for movement keys
            player.body.velocity.setTo(30*sf, 0);
            
            if (this.input.activePointer.isDown) {
            
//            	var pointerX = this.input.activePointer.x;
//            	if (pointerX > (player.body.x + player.body.width)) {
//            		player.body.velocity.x = 200 * sf;
//            	} else if (pointerX < player.body.x) {
//            		player.body.velocity.x = -200 * sf;
//            	}
            	
            
            } else {

            	if (cursors.up.isDown) {
            		player.body.velocity.y = -80 * sf;
            	} else if (cursors.down.isDown) {
            		player.body.velocity.y = 80 * sf;
            	}
            	
            	if (cursors.left.isDown) {
            		player.body.velocity.x -= (20 * sf);
            	} else if (cursors.right.isDown) {
            		player.body.velocity.x += (20 * sf);
            	}
            	

            }
            
            if (player.body.y < (10 * sf)) {
            	player.body.y = (10 * sf);
            }

            if (player.body.y > (this.world.height - (55 * sf))) {
            	player.body.y = (this.world.height - (55 * sf));
            }

            if (player.body.x > (this.world.width - player.body.width / 2 )) {
            	player.body.x = (this.world.width - player.body.width / 2);
            }
            
            frogs.forEachAlive(function(f) {
            	f.body.velocity.y = f.hopSpeed;
            }, this);

            frogs.forEachDead(function(f) {
            	
            	frogSlots[f.slotNum] = null;
            	frogs.remove(f, true);
            	newFrog();
            	
            }, this);

//            this.physics.arcade.overlap(rocks, aliens, collisionHandler, null, this);
            this.physics.arcade.overlap(frogs, player, gameOver, null, this);
//            this.physics.arcade.overlap(rect, aliens, gameOver, null, this);
            
        } else {
        	// stop game
        	frogs.forEach(function(f) {
        		f.animations.stop();
        		f.body.velocity.setTo(0, 0);
        	}, this);
        }
            
    }
    
    function render() {

    }
    
    function collisionHandler (rock, alien) {

        rock.kill();
        alien.kill();
        

    }
    
    function gameOver(p, a) {
    	
    	text.text="  GAME OVER \nClick to restart";
        text.visible = true;
    	
    	player.kill();
    	this.input.onTap.addOnce(restart,this);
    	
    }
    
    function restart () {
    	level = 0;
    	text.visible = false;
    	player.x = -(95/3)*sf;
    	player.y = game.height / 2;
    	player.revive();
        frogs.removeAll();
        frogSlots = [];
        createFrogs();
    }
    
    return {
        preload: preload,
        create: create,
        update: update,
        render: render
    };
	
}


var game;
$(function() {
	
    var width = $('#sizer').width();
    var height = $('#cell-2').height();
    
	var state = gameState();
	
	game = new Phaser.Game(width, height, Phaser.CANVAS, "cell-2",
			state);
	
});
