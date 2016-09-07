function gameState() {
    
    var sf = 1;
    var deviceOrientation;
    var text;
    var text2;
    var lastHeading = null;
    var rect;
    var stuff;
    var frog;
    var cursors;
    var lastTime = null;
    var counter = 0;
    var seconds = 0;
    var eyesOnSomething = false;
    
    var itemNames = [ "pizza", "burger", "skull", "pumpkin", "treasure", "pancakes", "bananas", "bowling_ball" ];
    var itemLocs  = [ 300, 650, 425, 550, 275, 400, 525, 350, 600 ];
    var loc = Math.floor(Math.random() * itemLocs.length);
    
    function preload() {
        this.load.pack("main", "other/202020-pack.json");
    }
    
    function create() {

        var promise = new FULLTILT.getDeviceOrientation({ 'type': 'world' });
        promise
          .then(function(controller) {
            deviceOrientation = controller;
          })
          .catch(function(message) {
            console.log(message);
          });

        
        game.world.setBounds(0, 0, this.game.width * 4, this.game.height);
        
        game.camera.x = game.world.centerX - (this.game.width / 2);
        
        if (this.game.width === 340) {
            sf = 0.75;
        } else if (this.game.width === 310) {
            sf = 0.69;
        } else if (this.game.width === 650) {
            sf = 1.44;
        }

        this.physics.startSystem(Phaser.Physics.ARCADE);
    
        this.stage.backgroundColor = "#D3EEFF";
    
        var grass = this.add.image(-10 * sf, 170 * sf, 'ground');
        grass.scale.setTo(1 * sf, 1 * sf);
        grass.fixedToCamera = true;
        
        var screen = this.add.image(this.game.world.centerX - (126 * sf), 130 * sf, 'screen');
        screen.scale.setTo(1 * sf, 1 * sf);

        stuff = this.add.group();
        stuff.enableBody = true;
        stuff.physicsBodyType = Phaser.Physics.ARCADE;
        
        spawn();
        spawn();
        spawn();
        
        rect = this.add.sprite((this.game.width / 2) - (15*sf), this.game.world.centerY + (5 * sf), null);
        this.physics.enable(rect, Phaser.Physics.ARCADE);
        rect.body.setSize(30*sf, 30*sf, 0, 0); // set the size of the rectangle
        rect.fixedToCamera = true;
        
        frog = this.add.sprite(120 * sf, 150 * sf, 'frog');
        frog.scale.setTo(1 * sf, 1 * sf);
        frog.fixedToCamera = true;


        text = this.add.text(this.game.width/2,70 * sf,' ', { font: 'bold ' + (40 * sf) + 'px sniglet', fill: '#ff0000' });
        text.anchor.setTo(0.5, 0.5);
        text.fixedToCamera = true;

        text2 = this.add.text(this.game.width/2,40 * sf,' ', { font: 'bold ' + (30 * sf) + 'px sniglet', fill: '#000000' });
        text2.anchor.setTo(0.5, 0.5);
        text2.fixedToCamera = true;

        cursors = this.input.keyboard.createCursorKeys();
        
        game.onResume.add(function() {
            lastTime = new Date();
        }, this);

    }
    
    function spawn() {
        
        var type = Math.floor(Math.random() * itemNames.length);

        var side = Math.random() > 0.5 ? 1 : -1;
        loc++;
        if (loc == itemLocs.length) {
            loc = 0;
        }
        
        var i1 = stuff.create(this.game.world.centerX + (itemLocs[loc] * side * sf), 90 * sf, itemNames[type]);
        i1.scale.setTo(1 * sf, 1 * sf);
        game.physics.enable(i1, Phaser.Physics.ARCADE);
        
    }
    
    function lookingAtSomething(a, b) {
        
        eyesOnSomething = true;
        
        if (lastTime == null) {
            lastTime = new Date();
        } else {
            var now = new Date();
            var elapsed = now - lastTime;
            counter += elapsed;
            lastTime = now;
        }
        
        if (counter >= 1000) {
            seconds += 1;
            counter -= 1000;
        }
        
        if (seconds == 20) {
            b.kill();
            text2.text = "Yeah!";
            game.time.events.add(Phaser.Timer.SECOND * 2, function() { text2.text = ""; spawn(); }, this);
        } else {
            text.text = seconds;
        }
        
    }
    
    function update() {
        
        eyesOnSomething = false;
        this.physics.arcade.overlap(rect, stuff, lookingAtSomething, null, this);
        if (!eyesOnSomething) {
            frog.alpha = 1.0;
            text.text = "";
            lastTime = null;
            seconds = 0;
            counter = 0;
        } else {
            frog.alpha = 0.6;
        }
        
        if (Math.floor(Math.random() * 10) === 1) {
            game.camera.x += (5 * (Math.random() > 0.5 ? 1 : -1));
        }

        if (cursors.left.isDown) {
            game.camera.x -= 5;
        } else if (cursors.right.isDown) {
            game.camera.x += 5;
        }
        
        if (deviceOrientation) {

            var orientationMatrix = deviceOrientation.getScreenAdjustedMatrix();
            
            var rawOrientationData = deviceOrientation.getLastRawEventData();
            if (rawOrientationData.alpha !== undefined && rawOrientationData.alpha !== null) {
                // calculate compass heading pointing out of the back of the screen
                var euler = new FULLTILT.Euler();
                euler.setFromRotationMatrix(orientationMatrix);
                
                var heading = Math.round(360 - euler.alpha);
                if (lastHeading === null) {
                    lastHeading = heading;
                }
                
                if (heading > lastHeading) {
                    game.camera.x += 5;
                } else if (heading < lastHeading) {
                    game.camera.x -= 5;
                }
                
                lastHeading = heading;
                
            }

        }
        
    }
    
    function render() {
        //this.game.debug.body(rect);
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
    
    game = new Phaser.Game(width, height, Phaser.CANVAS, "cell-0",
            state);
    
});