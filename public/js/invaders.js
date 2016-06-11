

function gameState() {
	
	var sf = 1;
	
    var player;
    var rocks;
    var rockTime = 0;
    var cursors;
    var fireButton;
    var aliens;
    var alienTween;
    var level = 0;
    var rect;
    var text;
	
    function preload() {
        this.load.pack("main", "other/invaders-pack.json");
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
        
        var moon = this.add.image(-10 * sf, 220 * sf, 'ground');
        moon.scale.setTo(1 * sf, 1 * sf);
        
        player = this.add.sprite(220 * sf, 260 * sf, 'frog');
        player.anchor.setTo(0.5, 0.5);
        this.physics.enable(player, Phaser.Physics.ARCADE);
        player.scale.setTo(1 * sf, 1 * sf);
        
        rect = this.add.sprite(0, this.game.height - (30 * sf), null);
        this.physics.enable(rect, Phaser.Physics.ARCADE);
        rect.body.setSize(this.game.width, 30 * sf, 0, 0); // set the size of the rectangle
        
        // rocks (thrown at enemies)
        rocks = this.add.group();
        rocks.enableBody = true;
        rocks.physicsBodyType = Phaser.Physics.ARCADE;
        rocks.createMultiple(30, 'rock');
        rocks.setAll('anchor.x', 0.5);
        rocks.setAll('anchor.y', 1);
        rocks.setAll('outOfBoundsKill', true);
        rocks.setAll('checkWorldBounds', true);
        rocks.setAll("scale.x", 1 * sf);
        rocks.setAll("scale.y", 1 * sf);
        
        aliens = this.add.group();
        aliens.enableBody = true;
        aliens.physicsBodyType = Phaser.Physics.ARCADE;

        createAliens();
        
        text = this.add.text(this.game.world.centerX,70 * sf,' ', { font: 'bold ' + (40 * sf) + 'px sniglet', fill: '#ff0000' });
        text.anchor.setTo(0.5, 0.5);
        text.visible = false;
        
        cursors = this.input.keyboard.createCursorKeys();
        fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
    }
    
    function createAliens() {
    	
    	for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 8; x++) {
                var alien = aliens.create(x * 48 * sf, y * 38 * sf, 'invader');
                alien.anchor.setTo(0.5, 0.5);
                alien.animations.add('fly', [ 0, 1 ], 2, true);
                alien.play('fly');
                alien.body.moves = false;
                alien.scale.setTo(1 * sf, 1 * sf);
            }
        }

        aliens.x = 10;
        aliens.y = 5;
        
        //console.log("level = " + level);
        
        var d = (level < 20 ? (2000 - (level*100)) : 100);

        alienTween = game.add.tween(aliens).to( { x: 100 * sf }, d, Phaser.Easing.Linear.None, true, 0, -1, true);
        alienTween.onLoop.add(function() {
        	aliens.y += 10;
        }, game);
    	
    }
    
    function update() {
        
        if (player.alive) {
            
            //  Reset the player, then check for movement keys
            player.body.velocity.setTo(0, 0);
            
            if (this.input.activePointer.isDown) {
            
            	throwRock(this);
            	var pointerX = this.input.activePointer.x;
            	if (pointerX > (player.body.x + player.body.width)) {
            		player.body.velocity.x = 200 * sf;
            	} else if (pointerX < player.body.x) {
            		player.body.velocity.x = -200 * sf;
            	}
            	
            
            } else {

            	if (cursors.left.isDown) {
            		player.body.velocity.x = -200 * sf;
            	} else if (cursors.right.isDown) {
            		player.body.velocity.x = 200 * sf;
            	}

            }
            
            if (player.body.x < 0) {
            	player.body.x = 0;
            }
            
            if (player.body.x > (this.world.width - player.body.width)) {
            	player.body.x = (this.world.width - player.body.width);
            }

            if (fireButton.isDown) {
                throwRock(this);
            }

            this.physics.arcade.overlap(rocks, aliens, collisionHandler, null, this);
            this.physics.arcade.overlap(aliens, player, gameOver, null, this);
            this.physics.arcade.overlap(rect, aliens, gameOver, null, this);
            
        } else {
        	alienTween.stop();
        }
            
    }
    
    function throwRock (game) {

        if (game.time.now > rockTime) {
            var rock = rocks.getFirstExists(false);
            if (rock) {
                rock.reset(player.x, player.y - 8);
                rock.body.velocity.y = -400 * sf;
                rockTime = game.time.now + 300;
            }
        }

    }
    
    function render() {

    }
    
    function collisionHandler (rock, alien) {

        rock.kill();
        alien.kill();
        if (aliens.countLiving() == 0) {
        	levelUp();
        }

    }
    
    function gameOver(p, a) {
    	
    	text.text="  GAME OVER \nClick to restart";
        text.visible = true;
    	
    	player.kill();
    	this.input.onTap.addOnce(restart,this);
    	
    }
    
    function levelUp() {
    	
    	level++;
    	aliens.removeAll();
        alienTween.stop();
        createAliens();
    	
    }
    
    function restart () {
    	level = 0;
    	text.visible = false;
    	player.revive();
        aliens.removeAll();
        alienTween.stop();
        createAliens();
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
    var height = $('#cell-1').height();
    
	var state = gameState();
	
	game = new Phaser.Game(width, height, Phaser.CANVAS, "cell-2",
			state);
	
});
