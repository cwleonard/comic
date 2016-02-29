
function boot() {
    
    function preload() {
        this.load.pack("main", "other/frog-warrior-pack.json");
        this.load.bitmapFont("font", "other/bitmap-font.png", "other/bitmap-font.xml");
    }
    
    function create() {
        this.state.start("walking");
    }
    
    return {
        preload: preload,
        create: create
    };

}

function walkAround() {

    var fightTrigger;
    var dist;
    var frog;
    var layer;
    var cursors;
    var testKey;
    var isSetup = false;
    
    var fPos = { x: 200, y: 500 };

    function create() {

        fightTrigger = Math.floor(Math.random() * 300) + 400; 
        dist = 0;
        
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.stage.backgroundColor = "#56b24d";

        var map = this.add.tilemap("map");
        map.addTilesetImage("dw_tiles", "tiles");

        layer = map.createLayer("layer1");
        layer.resizeWorld();

        map.setLayer(layer);

        map.setCollision(17);
        map.setCollisionBetween(23, 33);

        group = this.add.group();
        frog = group.create(fPos.x, fPos.y, "frog", 0);
        this.physics.enable(frog, Phaser.Physics.ARCADE);
        frog.anchor.setTo(0.5, 0.5);
        frog.body.collideWorldBounds = true;
        frog.animations.add("walk-b", [6, 7, 8], 5, true);
        frog.animations.add("walk-f", [3, 4, 5], 5, true);
        frog.animations.add("walk-s", [0, 1, 2], 5, true);

        this.camera.follow(frog);

        cursors = this.input.keyboard.createCursorKeys();
        testKey = this.input.keyboard.addKey(Phaser.KeyCode.F);

    }
    
    function shutdown() {
        
        fPos.x = frog.position.x;
        fPos.y = frog.position.y;
        
    }

    function update() {

        this.physics.arcade.collide(frog, layer);

        if (cursors.left.isDown) {
            frog.body.velocity.x = -100;
            frog.scale.x = 1;
        } else if (cursors.right.isDown) {
            frog.body.velocity.x = 100;
            frog.scale.x = -1;
        } else {
            frog.body.velocity.x = 0;
        }

        if (cursors.up.isDown) {
            frog.body.velocity.y = -100;
        } else if (cursors.down.isDown) {
            frog.body.velocity.y = 100;
        } else {
            frog.body.velocity.y = 0;
        }

        if (frog.body.velocity.y < 0) {
            frog.animations.play("walk-b");
        } else if (frog.body.velocity.y > 0) {
            frog.animations.play("walk-f");
        } else if (frog.body.velocity.x != 0) {
            frog.animations.play("walk-s");
        } else {
            frog.animations.stop(null, true);
        }
        
        dist += Math.abs(frog.deltaX) + Math.abs(frog.deltaY);
        if (testKey.isDown || dist >= fightTrigger) {
            this.state.start("fighting");
        }

    }
    
    return {
        create: create,
        update: update,
        shutdown: shutdown
    };

}

function fight() {

    var myEXP = 44;
    var myHP = 15;
    var oHP = 15;
    
    var printer;
    var myTurn;
    var cursors;
    var hpText;
    var eText;
    var fText;
    var selector;
    var boxes;
    var commandSelectorPositions = [
            { x: 245, y: 18},
            { x: 245, y: 34},
            { x: 335, y: 18},
            { x: 335, y: 34}
        ];
    var selPos = 0;
    
    function create() {

        this.stage.backgroundColor = "#000000";

        myTurn = true;
        myHP = 15;
        oHP = 15;
        
        boxes = this.add.image(16, 0, "boxes");
        printer = this.add.image(150, 70, "printer");
        
        this.add.bitmapText(40, 0, "font", "Frog", 16);
        this.add.bitmapText(30, 18, "font", "LV   3", 16);
        hpText = this.add.bitmapText(30, 34, "font", "HP  " + myHP, 16);
        this.add.bitmapText(30, 50, "font", "G    0", 16);
        eText = this.add.bitmapText(30, 66, "font", "E   " + myEXP, 16);

        this.add.bitmapText(290, 0, "font", "COMMAND", 16);
        this.add.bitmapText(260, 18, "font", "FIGHT", 16);
        this.add.bitmapText(350, 18, "font", "SPELL", 16);
        this.add.bitmapText(260, 34, "font", "RUN", 16);
        this.add.bitmapText(350, 34, "font", "ITEM", 16);

        selector = this.add.bitmapText(commandSelectorPositions[selPos].x, commandSelectorPositions[selPos].y, "font", "*", 16);

        fText = this.add.bitmapText(30, 205, "font", "A broken printer draws near!\nCommand?", 16);

        cursors = this.input.keyboard.createCursorKeys();
        enter = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        
        cursors.right.onDown.add(function() {
            if (selPos === 0 || selPos === 1) {
                selPos += 2;
            }
        });

        cursors.left.onDown.add(function() {
            if (selPos === 2 || selPos === 3) {
                selPos -= 2;
            }
        });

        cursors.up.onDown.add(function() {
            if (selPos === 1 || selPos === 3) {
                selPos -= 1;
            }
        });

        cursors.down.onDown.add(function() {
            if (selPos === 0 || selPos === 2) {
                selPos += 1;
            }
        });

        enter.onDown.add(function() {
            doCommand(this);
        }, this);

        
    }
    
    function doCommand(game) {
        
        if (!myTurn) return;
        
        if (selPos === 0) {
            // fight
            var strike = 3 + (Math.random() > 0.5 ? 0 : (Math.random() > 0.5 ? 1 : -1));
            oHP -= strike;
            var t = "You strike the printer for " + strike + " damage!";
            if (oHP <= 0) {
                t += "\nThou hast defeated the printer!";
            }
            fText.text = t;
            
            var t = game.add.tween(printer);
            t.to( { tint: 0xff0000 }, 50, Phaser.Easing.Linear.None, true, 0, 2, true);
            t.start();
            
        } else if (selPos === 1) {
            // run
            fText.text = "Nowhere to run to, baby.\nNowhere to hide.";
        } else if (selPos === 2) {
            // spell
            fText.text = "F-E-B-U-A-R-Y\nThou art a terrible speller!";
        } else if (selPos === 3) {
            // item
            fText.text = "Thou hast a paperclip, but\nthou art no MacGyver.";
        }
        
        // reset to "fight" for next round
        selPos = 0;
        
        myTurn = false;
        game.time.events.add(3000, function() {
            if (oHP > 0) {
                printerAttack(game);
            } else {
                printer.visible = false;
                fText.text = "Thou hast gained 0 gold\nand 3 experience.";
                myEXP += 3;
                game.time.events.add(4000, function() {
                    game.state.start("walking");
                }, this);
            }
        }, this);
        
        
        
    }

    function update() {
        
        hpText.text = "HP  " + (myHP < 10 ? " " : "") + myHP;
        eText.text = "E   " + (myEXP < 10 ? " " : "") + myEXP;
        
        if (!myTurn) {
            selector.visible = false;
        } else {
            selector.visible = true;
        }
        
        selector.position.x = commandSelectorPositions[selPos].x;
        selector.position.y = commandSelectorPositions[selPos].y;

    }
    
    function printerAttack(game) {
        
        // only hurt the player if HP is greater than 3;
        // death of the player is undefined in this game.
        if (myHP > 3) {

            var t = game.add.tween(boxes.position);
            t.to( { x: boxes.position.x + 3, y: boxes.position.y - 3 }, 100, Phaser.Easing.Linear.None, true, 0, 2, true);
            t.start();

            fText.text = "The printer strikes you for 2 damage!";
            myHP -= 2;
            
        } else {
            fText.text = "The printer just beeps at you.";
        }
        
        game.time.events.add(3000, function() {
            fText.text = "Command?";
            myTurn = true;
        }, this);

        
    }
    
    return {
        create: create,
        update: update
    };

}


$(function() {
	
    var width = $('#sizer').width();
    var height = $('#cell-2').height();
    
    var b = boot();
	var s1 = walkAround();
	var s2 = fight();
	
	var game = new Phaser.Game(width, height, Phaser.CANVAS, "cell-2");
	
	game.state.add("boot", b);
	game.state.add("walking", s1);
	game.state.add("fighting", s2);
    
    game.state.start("boot");
    
});
