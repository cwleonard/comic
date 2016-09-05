function gameState() {
    
    var sf = 1;
    var deviceOrientation;
    var text;
    var lastHeading = null;
    
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


        var i1 = this.add.image(this.game.world.centerX + (300 * sf), 150 * sf, 'pizza');
        i1.scale.setTo(1 * sf, 1 * sf);
        
        var i2 = this.add.image(this.game.world.centerX - (300 * sf), 150 * sf, 'burger');
        i2.scale.setTo(1 * sf, 1 * sf);
        
        var i3 = this.add.image(this.game.world.centerX + (600 * sf), 150 * sf, 'skull');
        i3.scale.setTo(1 * sf, 1 * sf);
        
        
        
        var frog = this.add.sprite(120 * sf, 150 * sf, 'frog');
        frog.scale.setTo(1 * sf, 1 * sf);
        frog.fixedToCamera = true;


        text = this.add.text(this.game.world.centerX,70 * sf,' ', { font: 'bold ' + (40 * sf) + 'px sniglet', fill: '#ff0000' });
        text.anchor.setTo(0.5, 0.5);

    }
    
    function update() {

        

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
                
                text.text = Math.round(360 - euler.alpha);
                
            }

        }
        
        
        
    }
    
    function render() {
        // nothing right now
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
    
    
//    var $txt = $("#output");
    
//    var promise = new FULLTILT.getDeviceOrientation({ 'type': 'world' });
//    var deviceOrientation;
//
//    promise
//      .then(function(controller) {
//        deviceOrientation = controller;
//      })
//      .catch(function(message) {
//        console.log(message);
//      });
//
    
    
//    (function draw() {
//
//        if (deviceOrientation) {
//
//            var orientationMatrix = deviceOrientation.getScreenAdjustedMatrix();
//            
//            var rawOrientationData = deviceOrientation.getLastRawEventData();
//            if (rawOrientationData.alpha !== undefined && rawOrientationData.alpha !== null) {
//                // calculate compass heading pointing out of the back of the screen
//                var euler = new FULLTILT.Euler();
//                euler.setFromRotationMatrix(orientationMatrix);
//                $txt.html( Math.round(360 - euler.alpha) );
//            }
//
//        }
//
//        requestAnimationFrame(draw);
//
//      })();
//    
    
});