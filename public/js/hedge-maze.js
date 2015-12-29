
var coinsCollected = 0;
var startTime = null;
var elapsedTime = null;

function gameState() {
	
	var frog;
	var layer;
	var coins, g;
	var coinCount, timerText;
	
	function collectCoin(f, c) {
	    coinsCollected++;
	    c.exists = false;
	    coinCount.text = "$ " + coinsCollected;
	}
	
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
        
        coins = this.add.group();
        coins.enableBody = true;
        map.createFromObjects('coins', 17, 'coin', 0, true, false, coins);
        
        coins.callAll('animations.add', 'animations', 'shine', [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6], 8, true);
        coins.callAll('animations.play', 'animations', 'shine');
        
        g = this.add.group();
        g.enableBody = true;
        map.createFromObjects('coins', 'finish', null, 0, true, false, g);
        
        
        group = this.add.group();
        frog = group.create(65, 40, "frog");
        this.physics.enable(frog, Phaser.Physics.ARCADE);
        frog.anchor.setTo(0.5, 0.5);
        frog.body.setSize(32, 32, 0, 0);
        frog.scale.y = -1;
        frog.body.collideWorldBounds = true;
        frog.animations.add("jump", [0, 1], 5, true);
        
        this.camera.follow(frog);
        
        coinCount = this.add.text(5, 5, "$ " + coinsCollected);
        coinCount.fontSize = 20;
        coinCount.fixedToCamera = true;
        coinCount.fill = "#FFFFFF";
        coinCount.stroke = '#000000';
        coinCount.strokeThickness = 3;


        timerText = this.add.text(this.camera.width - 70, 5, "0.0");
        timerText.fontSize = 20;
        timerText.fixedToCamera = true;
        timerText.fill = "#FFFFFF";
        timerText.stroke = '#000000';
        timerText.strokeThickness = 3;

        cursors = this.input.keyboard.createCursorKeys();
    
    }
    
    function update() {
        
        if (elapsedTime !== null) {
            return;
        } else if (startTime !== null) {
            timerText.text = (((new Date()) - startTime) / 1000);
        }
        
        this.physics.arcade.collide(frog, layer);
        this.physics.arcade.overlap(frog, coins, collectCoin, null, this);
        this.physics.arcade.overlap(frog, g, function(f, g) {
            frog.animations.stop(null, true);
            elapsedTime = (new Date()) - startTime;
            console.log("finished in " + (elapsedTime / 1000) + " seconds!");
        }, null, this);
        
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
		    if (startTime === null) {
		        startTime = new Date();
		    }
			frog.animations.play("jump");
		} else {
			frog.animations.stop(null, true);
		}
		
		if (elapsedTime !== null) {
            frog.body.velocity.x = 0;
            frog.body.velocity.y = 0;
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


$(function() {
	
    var width = $('#sizer').width();
    var height = $('#cell-2').height();
    
	var state = gameState();
	
	var game = new Phaser.Game(width, height, Phaser.CANVAS, "cell-2",
			state);
	
});
