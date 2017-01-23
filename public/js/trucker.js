
function gameState() {
	
	var sf = 1;
	
	var completed = 0;
    var player;
    var cursors;
    var frogs;
    var rect;
    var text;
    var frogSlots = [];
    var parkedTrucks;
    var cones;
    var parkSound;
    var explodeSound;
    var jumpSound;
    var soundLoop;
    var inst;
    var started = false;
	
    function preload() {
        this.load.pack("main", "other/trucker-pack.json");
    }
    
    function create() {
    	
        // default width is 450
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
        
        frogs = this.add.group();
        frogs.enableBody = true;
        frogs.physicsBodyType = Phaser.Physics.ARCADE;
        createFrogs();
        
        parkedTrucks = this.add.group();
        parkedTrucks.enableBody = true;
        parkedTrucks.physicsBodyType = Phaser.Physics.ARCADE;
        
        cones = this.add.group();
        cones.enableBody = true;
        cones.physicsBodyType = Phaser.Physics.ARCADE;
        createCones();
        
        parkSound = this.sound.add("parked");
        explodeSound = this.sound.add("explode");
        jumpSound = this.sound.add("jump");


        inst = this.add.image(game.width/2, game.height/2, 'instructions');
        inst.anchor.setTo(0.5, 0.5);
        inst.scale.setTo(sf, sf);
        
        
        text = this.add.text(this.game.world.centerX,115 * sf,' ', { font: 'bold ' + (40 * sf) + 'px sniglet', fill: '#ff0000' });
        text.anchor.setTo(0.5, 0.5);
        text.visible = false;
        
        cursors = this.input.keyboard.createCursorKeys();
        
        var startGame = function() {

            if (started) return;
            
            started = true;
            inst.visible = false;
            soundLoop = game.time.events.loop(Phaser.Timer.SECOND, function() {
                jumpSound.play();
            }, this);
            frogs.forEach(function(f) {
                f.play('hop');
            }, this);
            
            game.input.keyboard.onDownCallback = undefined;

        };
        
        this.input.keyboard.onDownCallback = startGame;

    }
    
    function createFrogs() {
    	for (var i = 0; i < 3; i++) {
    		newFrog();
        }
    }
    
    function parkIt() {
        
        completed++;
        
        parkSound.play();
        
        var t = parkedTrucks.create(player.x, player.y, 'truck');
        t.anchor.setTo(0.5, 0.5);
        t.scale.setTo(1 * sf, 1 * sf);
        
        if (completed === 3) {
            player.x = -500*sf;
            player.y = game.height / 2;
            winner();
        } else {
            player.x = -(95/3)*sf;
            player.y = game.height / 2;
        }
        
    }
    
    function randomFrogSlot() {
    	return Math.floor(Math.random() * 5) + 3;
    }
    
    function newFrog() {
    	
		var rx = randomFrogSlot();
		while (frogSlots[rx]) {
			rx = randomFrogSlot();
		}
		
		var f = frogs.create((rx-2) * (70*sf), game.height - (20 * sf), 'frog');
		frogSlots[rx] = f;
		f.slotNum = rx;
		
		f.outOfBoundsKill = true;
		f.checkWorldBounds = true;
		
		f.anchor.setTo(0.5, 0.5);
		f.animations.add('hop', [ 0, 1 ], 2, true);
		f.body.setSize(18, 20, 4, 5);
		f.scale.setTo(sf, sf);
		f.hopSpeed = -((Math.floor(Math.random() * 3) + 3) * 10);

		return f;
    	
    }
    
    function createCones() {

        // top cones
        cones.create(415*sf,  0 * sf, 'cone');
        cones.create(415*sf, 20 * sf, 'cone');
        cones.create(415*sf, 40 * sf, 'cone');
        cones.create(415*sf, 60 * sf, 'cone');
        cones.create(435*sf, 60 * sf, 'cone');
        cones.create(455*sf, 60 * sf, 'cone');

        // bottom cones
        cones.create(415*sf, 280 * sf, 'cone');
        cones.create(415*sf, 260 * sf, 'cone');
        cones.create(415*sf, 240 * sf, 'cone');
        cones.create(415*sf, 220 * sf, 'cone');
        cones.create(435*sf, 220 * sf, 'cone');
        cones.create(455*sf, 220 * sf, 'cone');

        cones.setAll("anchor.x", 0.5);
        cones.setAll("anchor.y", 0.5);
        cones.setAll("scale.x", 0.8 * sf);
        cones.setAll("scale.y", 0.8 * sf);
        
    }
    
    function update() {
        
        if (!started) return;
        
        if (player.alive) {
            
            this.physics.arcade.overlap(frogs, player, gameOver, null, this);
            this.physics.arcade.overlap(cones, player, gameOver, null, this);
            this.physics.arcade.overlap(parkedTrucks, player, gameOver, null, this);

            
            //  Reset the player, then check for movement keys
            player.body.velocity.setTo(30*sf, 0);
            

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
            	
            
            if (player.body.y < (10 * sf)) {
            	player.body.y = (10 * sf);
            }

            if (player.body.y > (this.world.height - (55 * sf))) {
            	player.body.y = (this.world.height - (55 * sf));
            }

            if (player.body.x > (this.world.width - player.body.width / 2 )) {
                parkIt();
            }
            
            frogs.forEachAlive(function(f) {
            	f.body.velocity.y = f.hopSpeed;
            }, this);

            frogs.forEachDead(function(f) {
            	
            	frogSlots[f.slotNum] = null;
            	frogs.remove(f, true);
            	var nf = newFrog();
            	nf.play('hop');
            	
            }, this);

        } else {
        	// stop game
        	frogs.forEach(function(f) {
        		f.animations.stop();
        		f.body.velocity.setTo(0, 0);
        	}, this);
        }
            
    }
    
    function render() {
//        frogs.forEach(function(f) {
//            game.debug.body(f);
//        });
    }
    
    function collisionHandler (rock, alien) {

        rock.kill();
        alien.kill();
        

    }
    
    function winner() {
        
        game.time.events.remove(soundLoop);
        
        text.text="  WINNER!!";
        text.visible = true;
        
        player.kill();
        
    }
    
    function gameOver(p, a) {
    	
        explodeSound.play();
        game.time.events.remove(soundLoop);
        
    	text.text="   GAME OVER! \nAny key to restart";
        text.visible = true;
    	
    	player.kill();
    	
    	var resetGame = function() {

    	    restart();
            game.input.keyboard.onDownCallback = undefined;

        };
        
        setTimeout(function() {
            game.input.keyboard.onDownCallback = resetGame;
        }, 500);
    	
    	
    }
    
    function restart () {
        completed = 0;
        parkedTrucks.removeAll();
        frogs.removeAll();
        frogSlots = [];
        createFrogs();
        frogs.forEach(function(f) {
            f.play('hop');
        }, this);
    	text.visible = false;
    	player.x = -(95/3)*sf;
    	player.y = game.height / 2;
    	player.revive();
    	soundLoop = game.time.events.loop(Phaser.Timer.SECOND, function() {
            jumpSound.play();
        }, this);
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
