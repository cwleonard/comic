var request = require('request');

module.exports = function(c) {
	
	if (c.express) {
		
		var myRouter = c.express.Router();

		myRouter.post('/verify', function(req, res, next) {

			var vresp = req.body.resp;
			if (vresp == null || vresp == "") {
			    
			    console.log("captcha response not found!");
			    res.sendStatus(500);
			    
			} else {

			    request.post({
			        
			        uri : 'https://www.google.com/recaptcha/api/siteverify',
			        form : {
			            secret : c.config.captcha.secret,
			            response : vresp
			        }
			    
			    }, function(error, response, body) {

			        if (!error && response.statusCode == 200) {

			            var data = JSON.parse(body);
			            if (data.success) {

	                         res.sendStatus(200);
			                
			            } else {
			                
			                console.log(data["error-codes"]);
			                res.sendStatus(500);
			                
			            }
			            
			        } else {
			            next(error);
			        }

			    });

			}

		});
		
		return myRouter;
		
	} else {
		
		return null;
		
	}
	
};