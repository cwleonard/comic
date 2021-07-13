var fs = require('fs');

module.exports = function(c) {

	var DATA_FILE = 'data/sort_algorithm.json';
	
	var sortData = [
		{
			"cell": 0,
			"up": 1,
			"down": 1
		}, {
			"cell": 1,
			"up": 2,
			"down": 1
		}, {
			"cell": 2,
			"up": 3,
			"down": 1
		}, {
			"cell": 3,
			"up": 4,
			"down": 1
		}
	];

	fs.readFile(DATA_FILE, { encoding: 'utf-8' }, function(err, fd) {
		if (err) {
			if (err.code == 'ENOENT') {
				console.log("no sorting data file found");
			} else {
				console.log(err);
			}
		} else {
			try {
				var d = JSON.parse(fd);
				sortData = d;
				console.log("sorting data read from file");
			} catch (e) {
				console.log(e);
			}
		}
		
	});
	
    function saveData() {
        
        fs.writeFile(DATA_FILE, JSON.stringify(sortData), function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("saved sorting data");
            }
            setTimeout(saveData, 1800000);
        });
        
    }

	if (c.express) {
		
		var myRouter = c.express.Router();
		
		myRouter.post('/vote', function(req, res, next) {

			var c = req.body.cell;
			var u = 0;
			var d = 0;
			if (req.body.up === "true") {
				u = 1;
			} else if (req.body.down === "true") {
				d = 1;
			}

			console.log("cell " + c + " " + ( u == 1 ? "up" : "down"));

			for (var i = 0; i < sortData.length; i++) {
				var x = sortData[i];
				if (x.cell == c) {
					x.up += u;
					x.down += d;
				}
			}

			res.sendStatus(200);
			
		});

		myRouter.get('/rankings', function(req, res, next) {
			res.send(sortData);
		});

		setTimeout(saveData, 1800000);
		
		return myRouter;
		
	} else {
		
		return null;
		
	}
	
};