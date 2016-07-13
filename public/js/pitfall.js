

function gameState() {
	
	var sf = 1;
	
    var player;
    var vine;
    var money;
    var ground;
    var ground1;
    var ground2;
    var vineTween;
    var cursors;
    var jumpButton;
    var text;
    var jumpTimer = 0;
    var jumpFrames = 15;
	
    function preload() {
        this.load.pack("main", "other/pitfall-pack.json");
    }
    
    function create() {
    	
    	if (this.game.width === 340) {
            sf = 0.75;
        } else if (this.game.width === 310) {
            sf = 0.69;
        } else if (this.game.width === 650) {
        	sf = 1.44;
        }
        
    	
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.gravity.y = 800;
        
        var bg = this.add.image(0, 0, 'bg');
        bg.scale.setTo(1 * sf, 1 * sf);
        
        
        ground = this.add.group();
        ground.enableBody = true;
        ground.physicsBodyType = Phaser.Physics.P2JS;
        
        var vineCollisionGroup   = game.physics.p2.createCollisionGroup();
        var groundCollisionGroup = game.physics.p2.createCollisionGroup();
        var playerCollisionGroup = game.physics.p2.createCollisionGroup();
        var moneyCollisionGroup  = game.physics.p2.createCollisionGroup();
        
        player = this.add.sprite(50 * sf, 170 * sf, 'frog', 3);
        vine = this.add.sprite(220 * sf, -20, 'vine', 0);
        money = this.add.sprite(385 * sf, 170 * sf, 'money');

        ground1 = this.add.sprite(50 * sf, this.game.height - (65 * sf), null);
        ground2 = this.add.sprite(395 * sf, this.game.height - (65 * sf), null);

        game.physics.p2.enable([ player, vine, money ], false);
        game.physics.p2.enable([ ground1, ground2 ], false);


        player.animations.add("right", [0, 1, 2], 10, true);
        player.animations.add("left",  [3, 4, 5], 10, true);
        
        
        vine.anchor.setTo(0.5, 0);
        vine.body.clearShapes();
        vine.body.kinematic = true;
        vine.body.data.gravityScale = 0;
        vine.scale.setTo(1 * sf, 1 * sf);
        vine.body.setRectangle(5 * sf, 390 * sf, 0, 0);
        vine.body.updateCollisionMask();
        vine.body.angle = -35;
        
        vineTween = game.add.tween(vine.body).to( { angle: 35 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
        
        
        ground1.anchor.setTo(0, 0);
        ground1.body.clearShapes();
        ground1.body.data.gravityScale = 0;
        ground1.body.kinematic = true;
        ground1.body.setRectangle(110 * sf, 20 * sf, 0, 0);
        ground1.body.updateCollisionMask();

        ground2.anchor.setTo(0, 0);
        ground2.body.clearShapes();
        ground2.body.data.gravityScale = 0;
        ground2.body.kinematic = true;
        ground2.body.setRectangle(110 * sf, 20 * sf, 0, 0);
        ground2.body.updateCollisionMask();

        ground.add(ground1);
        ground.add(ground2);
        
        money.scale.setTo(1 * sf, 1 * sf);
        
        player.body.fixedRotation = true;
        player.scale.setTo(1 * sf, 1 * sf);

        var bg2 = this.add.image(0, 205 * sf, 'bg_lower');
        bg2.scale.setTo(1 * sf, 1 * sf);
        
        
        player.body.setCollisionGroup(playerCollisionGroup);
        money.body.setCollisionGroup(moneyCollisionGroup);
        
        vine.body.setCollisionGroup(vineCollisionGroup);
        vine.body.collides([playerCollisionGroup]);
        
        ground1.body.setCollisionGroup(groundCollisionGroup);
        ground2.body.setCollisionGroup(groundCollisionGroup);
        
        ground1.body.collides([playerCollisionGroup, moneyCollisionGroup]);
        ground2.body.collides([playerCollisionGroup, moneyCollisionGroup]);
        
        money.body.collides([groundCollisionGroup, playerCollisionGroup]);
        
        player.body.collides([ groundCollisionGroup, vineCollisionGroup, moneyCollisionGroup ]);

        player.body.onBeginContact.add(playerContactBegin, this);
        player.body.onEndContact.add(playerContactEnd, this);
        
        cursors = this.input.keyboard.createCursorKeys();
        jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
    }
    
    function grabVine() {
        
        player.onVine = true;
        player.body.data.gravityScale = 0;
        player.body.data.shapes[0].sensor = true;
        player.grabX = player.x;
        player.grabY = player.y;
        vine.frame = 1;
        player.visible = false;
        
    }
    
    function releaseVine() {
        
        player.onVine = false;
        player.body.data.gravityScale = 1;
        player.body.data.shapes[0].sensor = false;
        vine.frame = 0;
        player.visible = true;
        
    }
    
    function playerContactBegin(otherBody) {

        if (otherBody) {
            if (otherBody.sprite === ground1 || otherBody.sprite === ground2) {
                player.canJump = true;
            } else if (otherBody.sprite === vine) {
                grabVine();
            } else if (otherBody.sprite === money) {
                
                money.kill();
                
            }
        }
        
    }
    
    function playerContactEnd() {

        player.canJump = false;
        
    }
    
    function update() {
        
        if (player.alive) {
            
            //  Reset the player, then check for movement keys
            player.body.velocity.x = 0;

            if (!player.onVine && cursors.left.isDown) {
                player.body.velocity.x = -150 * sf;
            } else if (!player.onVine && cursors.right.isDown) {
                player.body.velocity.x = 150 * sf;
            }
            
            if (player.body.velocity.x < 0) {
                player.animations.play("right");
            } else if (player.body.velocity.x > 0) {
                player.animations.play("left");
            } else {
                player.animations.stop(null, true);
            }
            
            if (jumpButton.isDown) {
                
                if ((player.canJump || player.onVine) && jumpTimer === 0) {
                    // jump is allowed to start
                    jumpTimer = 1;
                    if (player.onVine) {
                        releaseVine();
                        player.body.velocity.y = -50;
                        //player.body.velocity.x = (vine.angle > 0 ? -150 : 150 );
                    } else {
                        player.body.velocity.y = -250;
                    }
                } else if (jumpTimer > 0 && jumpTimer < jumpFrames) {
                    // keep jumping higher
                    jumpTimer++;
                    player.body.velocity.y = -250 + (jumpTimer * 7);
                }
        
            } else {
                // jump button not being pressed, reset jump timer
                jumpTimer = 0;
            }
            
            
            if (player.body.x < 0) {
            	player.body.x = 0;
            }
            
            if (player.body.x > this.world.width) {
            	player.body.x = (this.world.width);
            }
            
            if (player.body.y > this.world.height) {
                player.kill();
            }
            
        } else {
            
            console.log("game over!");
            player.reset(50 * sf, 170 * sf);
            money.reset(385 * sf, 170 * sf);
            
            game.add.tween(player).to( { alpha: 0.5 }, 120, Phaser.Easing.Linear.None, true, 0, 2, true);
            
        }
            
    }
    
    function preRender() {
        
        if (this.game.paused) return;
        
        if (player.onVine) {
            
            player.body.x = (220 * sf) - (vine.angle * Math.PI);
            player.body.y = player.grabY;
            
        }

    }
    
    function render() {

    }
    
    return {
        preload: preload,
        create: create,
        update: update,
        preRender: preRender,
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
