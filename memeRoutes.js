var request = require('request');

module.exports = function(conf) {
	
	if (conf.express) {
		
		var myRouter = conf.express.Router();

		myRouter.post('/', function(req, res, next) {
			
			var line1 = req.body.text1 || "";
			var line2 = req.body.text2 || "";
			
			if (line1 === '' || line2 === '') {
				line1 = "i look displeased...";
				line2 = "but i have no idea what's going on";
			}
			
			var memeData = {
					template_id: '41834675',
					username: conf.auth.username,
					password: conf.auth.password,
					text0: line1,
					text1: line2
			};
			
			request.post(
					'https://api.imgflip.com/caption_image',
					{ form: memeData },
					function (error, response, body) {

						  if (!error && response.statusCode == 200) {
							  
							    var meme = JSON.parse(body);
							    
							    res.setHeader('Content-Type', 'application/json');
								res.send({
									imgUrl: meme.data.url,
									shareUrl: meme.data.page_url
								});							    
							    
						  } else {
							  
							  next(error);
							  
						  }
					
					});
			
		});
		
		return myRouter;
		
	} else {
		
		return null;
		
	}
	
};