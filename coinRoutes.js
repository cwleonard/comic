var Client = require('coinbase').Client;

module.exports = function(stuff) {

	var addresses = {};
	var purchases = {};
	
	var datastore = stuff.db;
	
	var client = new Client({'apiKey': stuff.config.key, 'apiSecret': stuff.config.secret});
	
	var accountId = stuff.config.account;

	function makeSecretCode(len) {
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    for( var i=0; i < len; i++ ) {
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	    }
	    return text;
	}
	
	function newBitcoinAddress(productId, cb) {

		// this function will throw an error if no such product exists
		datastore.lookupPrice(productId, function(err, record) {
			
			if (err) {
				
				console.log(err);
				cb(err);
				
			} else {
				
				var price = record.cost;

				var callbackSecret = makeSecretCode(15);
				var purchaseId = makeSecretCode(10);
				
				var Account   = require('coinbase').model.Account;
				var myBtcAcct = new Account(client, {
					'id' : accountId
				});

				var args = {
						"callback_url": "http://amphibian.com/coin/callback?secret=" + callbackSecret,
						"label": "product-id: " + productId
				};
				
				myBtcAcct.createAddress(args, function(err, data) {

					if (err) {
						
						console.log("unable to create address: " + err.response.body);
						cb(err);
						
					} else {
						
						console.log(data);
						
						var a = {
							paid: false,
							code: productId,
							cost: price,
							purchaseId: purchaseId,
							address: data.address,
							secret: callbackSecret
						};
						console.log(a);

						datastore.createPurchaseRecord(a, function(err, record) {
							
							if (err) {
								
								console.log(err);
								cb(err);
								
							} else {
								
								cb(null, record);
								
							}
							
						});
					
					}

				});
				
			}
		
		});
		
	}
	
	var myRouter = null;
	
	if (stuff.express) {
		
		myRouter = stuff.express.Router();

		myRouter.post('/callback', function(req, res, next) {

			var secretCode = req.query.secret;
			var addr = req.body.address;
			if (addr) {
				
				datastore.recordPayment({
					secret: secretCode,
					address: addr,
					amount: req.body.amount
				}, function(err) {
					
					if (err) {
						console.log("error in callback: " + err);
						console.log(req.body);
					}
					
				});
				
			} else {

				console.log("something went wrong: " + req.body);
				
			}

			// always give coinbase a 200
			res.sendStatus(200);

		});

	}
	
	function paywallMiddleware(req, res, next) {

		var productCode = req.path.substring(1);

		//console.log(req.path.substring(1));
		var cookieName = "product-" + productCode + "-purchase";
		
		
		var pid = req.cookies[cookieName];
		if (pid) {
			
			// user already has a cookie, indicating that they've tried to
			// access this item before. check to see if they've paid yet.

			datastore.checkPaidStatus(pid, function(err, data) {
				
				if (err) {
					console.log(err);
					next(err);
				} else {
					
					if (data.paid) {
						next();
					} else {
						// show the payment address that already exists
						res.setHeader("X-Payment-Types-Accepted", "Bitcoin");
						res.setHeader("X-Payment-Address-Bitcoin", data.address);
						res.setHeader("X-Payment-Amount-Bitcoin", data.cost);
						res.sendStatus(402);
					}
					
				}
				
			});
			
		} else {
			
			// need to create a new payment address

			newBitcoinAddress(productCode, function(err, data) {

				if (err) {
					next(err);
				} else {

					res.cookie(cookieName, data.purchaseId, { maxAge: ((new Date()).getTime() + (365*24*60*60000*10)), httpOnly: true });
					res.setHeader("X-Payment-Types-Accepted", "Bitcoin");
					res.setHeader("X-Payment-Address-Bitcoin", data.address);
					res.setHeader("X-Payment-Amount-Bitcoin", data.cost);
					res.sendStatus(402);

				}

			});

		}

	}

	
	return {
		router: myRouter,
		middleware: paywallMiddleware
	};
	
};