

function gameState() {
	
    var player;
    var rocks;
    var rockTime = 0;
    var cursors;
    var fireButton;
    var firingTimer = 0;
    var aliens;
    var alientTween;
	
    function preload() {

        this.load.pack("main", "other/invaders-pack.json");

    }
    
    function create() {
        
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.add.image(-10, 220, 'ground');
        
        player = this.add.sprite(200, 260, 'frog');
        player.anchor.setTo(0.5, 0.5);
        this.physics.enable(player, Phaser.Physics.ARCADE);
        
        // rocks (thrown at enemies)
        rocks = this.add.group();
        rocks.enableBody = true;
        rocks.physicsBodyType = Phaser.Physics.ARCADE;
        rocks.createMultiple(30, 'rock');
        rocks.setAll('anchor.x', 0.5);
        rocks.setAll('anchor.y', 1);
        rocks.setAll('outOfBoundsKill', true);
        rocks.setAll('checkWorldBounds', true);
        
        aliens = this.add.group();
        aliens.enableBody = true;
        aliens.physicsBodyType = Phaser.Physics.ARCADE;

        createAliens();
        
        
        cursors = this.input.keyboard.createCursorKeys();
        fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
    }
    
    function createAliens(lvl) {
    	

    	
    	for (var y = 0; y < 4; y++)
        {
            for (var x = 0; x < 8; x++)
            {
                var alien = aliens.create(x * 48, y * 38, 'invader');
                alien.anchor.setTo(0.5, 0.5);
                alien.animations.add('fly', [ 0, 1 ], 2, true);
                alien.play('fly');
                alien.body.moves = false;
            }
        }

        aliens.x = 10;
        aliens.y = 5;

        alientTween = game.add.tween(aliens).to( { x: 100 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        alientTween.onLoop.add(function() {
        	aliens.y += 10;
        }, game);
    	
    }
    
    function update() {
        
        if (player.alive) {
            
            //  Reset the player, then check for movement keys
            player.body.velocity.setTo(0, 0);

            if (cursors.left.isDown) {
                player.body.velocity.x = -200;
            } else if (cursors.right.isDown) {
                player.body.velocity.x = 200;
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
            //this.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
            
        }
            
    }
    
    function throwRock (game) {

        if (game.time.now > rockTime) {
            var rock = rocks.getFirstExists(false);
            if (rock) {
                rock.reset(player.x, player.y - 8);
                rock.body.velocity.y = -400;
                rockTime = game.time.now + 200;
            }
        }

    }
    
    function render() {

    }
    
    function collisionHandler (rock, alien) {

        rock.kill();
        alien.kill();
        if (aliens.countLiving() == 0) {
            this.input.onTap.addOnce(restart,this);
        }

    }
    
    function restart () {
        aliens.removeAll();
        alientTween.stop();
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
	
	game = new Phaser.Game(width, height, Phaser.CANVAS, "cell-1",
			state);
	
});
