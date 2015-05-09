var Client = require('coinbase').Client;

module.exports = function(stuff) {

	var client = new Client({'apiKey': stuff.config.key, 'apiSecret': stuff.config.secret});
	
	var accountId = stuff.config.account;

//	client.getAccounts(function(err, accounts) {
//
//		if (err) {
//			console.log("unable to get primary account id: " + err.response.body);
//		} else {
//
//			for (var i = 0; i < accounts.length && primaryAccountId == null; i++) {
//				  if (accounts[i].primary) {
//					  primaryAccountId = accounts[i].id;
//				  }
//			}
//			console.log("set primary account id");
//				  
//		}
//		  
//	});
	
	
	if (stuff.express) {
		
		var myRouter = stuff.express.Router();
		

		myRouter.get('/address', function(req, res, next) {

			var Account   = require('coinbase').model.Account;
			var myBtcAcct = new Account(client, {
				'id' : accountId
			});

			var args = {
					"callback_url": "http://www.example.com/callback",
					"label": "paywall test"
			};
			
			myBtcAcct.createAddress(args, function(err, data) {

				if (err) {
					
					console.log("unable to create address: " + err.response.body);
					res.sendStatus(500);
					
				} else {
					
					console.log(data);
					res.setHeader('Content-Type', 'text/plain');
					res.send(data.address);
				
				}
			});

		});

		myRouter.post('/callback', function(req, res, next) {

			console.log("paid to address: " + req.body.address);
			console.log("amount: " + req.body.amount);
			
			res.sendStatus(200);

		});

//		myRouter.get('/account', function(req, res, next) {
//
//			client.getAccounts(function(err, accounts) {
//
//				if (err) {
//					console.log(err.response.body);
//					next(err);
//				} else {
//
//					var pAccount = null;
//					for (var i = 0; i < accounts.length && pAccount == null; i++) {
//						  if (accounts[i].primary) {
//							  pAccount = accounts[i].id;
//						  }
//					}
//					
//					res.setHeader('Content-Type', 'text/plain');
//					res.send(pAccount);
//						  
//				}
//				  
//			});
//
//		
//		});

		return myRouter;
		
	} else {
		
		return null;
		
	}
	
};