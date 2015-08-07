var request = require('request');

module.exports = function(conf) {
	
	if (conf.express) {
		
		var myRouter = conf.express.Router();

		myRouter.get('/shares/:id', function(req, res, next) {

			var comic = req.params.id || '';

			request({
				uri : 'https://graph.facebook.com/v2.4/',
				qs : {
					access_token : conf.auth.token,
					id : 'http://amphibian.com/' + comic
				}
			}, function(error, response, body) {

				if (!error && response.statusCode == 200) {

					var data = JSON.parse(body);

					res.setHeader('Content-Type', 'application/json');
					res.send({
						id : data.id,
						shares : data.share.share_count
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