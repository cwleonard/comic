

function gameState() {
	
    var player;
    var rocks;
    var rockTime = 0;
    var cursors;
    var fireButton;
    var firingTimer = 0;
	
    function preload() {

        this.load.pack("main", "other/invaders-pack.json");

    }
    
    function create() {
        
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        player = this.add.sprite(200, 250, 'frog');
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
        
        
        cursors = this.input.keyboard.createCursorKeys();
        fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
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

            if (fireButton.isDown) {
                throwRock(this);
            }

            if (this.time.now > firingTimer)
            {
                //enemyFires();
            }

            //  Run collision
            //this.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
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
    
    return {
        preload: preload,
        create: create,
        update: update,
        render: render
    };
	
}


$(function() {
	
    var width = $('#sizer').width();
    var height = $('#cell-1').height();
    
	var state = gameState();
	
	var game = new Phaser.Game(width, height, Phaser.CANVAS, "cell-1",
			state);
	
});
