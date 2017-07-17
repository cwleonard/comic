var fs = require('fs');

module.exports = function(c) {

	var DATA_FILE = 'data/faq.json';
	
	var faq = [];

	fs.readFile(DATA_FILE, { encoding: 'utf-8' }, function(err, fd) {
		if (err) {
			console.log(err);
		} else {
			try {
				var d = JSON.parse(fd);
				faq = d;
				console.log("faq read from file");
			} catch (e) {
				console.log(e);
			}
		}
		
	});
	
    function saveData() {
        
        fs.writeFile(DATA_FILE, JSON.stringify(faq), function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("saved faq data");
            }
            setTimeout(saveData, 1800000);
        });
        
    }

	if (c.express) {
		
		var myRouter = c.express.Router();
		
		myRouter.post('/ask', function(req, res, next) {
		    
		    console.log(req.body.question);
		    faq.push(req.body.question);

			res.sendStatus(200);
			
		});
		
		setTimeout(saveData, 1800000);
		
		return myRouter;
		
	} else {
		
		return null;
		
	}
	
};