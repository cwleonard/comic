


function gameState() {
	
	var frog;
	var layer;
	
    function preload() {
        this.load.pack("main", "other/hedge-maze-pack.json");
    }
    
    function create() {
        
        this.physics.startSystem(Phaser.Physics.ARCADE);
    
        this.stage.backgroundColor = "#56b24d";
    
        var map = this.add.tilemap("maze");
        map.addTilesetImage("maze-tiles", "tiles");
    
        layer = map.createLayer("layer1");
        layer.resizeWorld();
    
        map.setLayer(layer);
        
        map.setCollisionBetween(1, 16);
        group = this.add.group();
    
        frog = group.create(65, 40, "frog");
        this.physics.enable(frog, Phaser.Physics.ARCADE);
        frog.anchor.setTo(0.5, 0.5);
        frog.body.setSize(32, 32, 0, 0);
        frog.scale.y = -1;
        frog.body.collideWorldBounds = true;
        frog.animations.add("jump", [0, 1], 5, true);
        
        this.camera.follow(frog);
    
        cursors = this.input.keyboard.createCursorKeys();
    
    }
    
    function update() {
        
        this.physics.arcade.collide(frog, layer);
        
		if (cursors.left.isDown) {
			frog.body.velocity.x = -100;
			frog.rotation = -1.5708;
			frog.scale.y = 1;
		} else if (cursors.right.isDown) {
			frog.body.velocity.x = 100;
			frog.rotation = 1.5708;
			frog.scale.y = 1;
		} else {
			frog.body.velocity.x = 0;
		}
		
		if (cursors.up.isDown) {
			frog.body.velocity.y = -100;
			frog.rotation = 0;
			frog.scale.y = 1;
		} else if (cursors.down.isDown) {
			frog.body.velocity.y = 100;
			frog.rotation = 0;
			frog.scale.y = -1;
		} else {
			frog.body.velocity.y = 0;
		}
		
		if (frog.body.velocity.x != 0 || frog.body.velocity.y != 0) {
			frog.animations.play("jump");
		} else {
			frog.animations.stop(null, true);
		}
        
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

width = 450;
height = 280;

$(function() {
	
	var state = gameState();
	
	var game = new Phaser.Game(width, height, Phaser.CANVAS, "cell-2",
			state);
	
});
