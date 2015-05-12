var Client = require('coinbase').Client;
var intformat = require('biguint-format');
var FlakeId = require('flake-idgen');

module.exports = function(stuff) {

	var addresses = {};
	var purchases = {};
	
	var datastore = stuff.db;
	
	var client = new Client({'apiKey': stuff.config.key, 'apiSecret': stuff.config.secret});
	var flakeIdGen = new FlakeId();
	
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
	
	function makeSecretCode() {
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    for( var i=0; i < 15; i++ ) {
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	    }
	    return text;
	}
	
	var myRouter = null;
	
	if (stuff.express) {
		
		myRouter = stuff.express.Router();

		myRouter.get('/address/:code', function(req, res, next) {

			var pCode = req.params.code;

			var callbackSecret = makeSecretCode();
			var purchaseId = intformat(flakeIdGen.next(), 'hex');
			
			var Account   = require('coinbase').model.Account;
			var myBtcAcct = new Account(client, {
				'id' : accountId
			});

			var args = {
					"callback_url": "http://amphibian.com/coin/callback?secret=" + callbackSecret,
					"label": "comic " + pCode
			};
			
			myBtcAcct.createAddress(args, function(err, data) {

				if (err) {
					
					console.log("unable to create address: " + err.response.body);
					res.sendStatus(500);
					
				} else {
					
					console.log(data);
					
					var a = {
						paid: false,
						code: pCode,
						purchaseId: purchaseId,
						address: data.address,
						secret: callbackSecret
					};
					console.log(a);

					datastore.createPurchaseRecord(a, function(err) {
						
						if (err) {
							
							console.log(err);
							res.sendStatus(500);
							
						} else {
							res.cookie(pCode + "-purchase", purchaseId, { maxAge: ((new Date()).getTime() + (365*24*60*60000*10)), httpOnly: true });
							res.setHeader('Content-Type', 'text/plain');
							res.send(data.address);
						}
						
					});
				
				}

			});

		});

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
				
//				if (addresses[addr]) {
//					
//					addresses[addr].paid = true;
//					
//					console.log("paid to address: " + addr);
//					console.log("amount: " + req.body.amount);
//
//				} else {
//					console.log("unknown address got payment: " + addr);
//				}
				
			} else {

				console.log("something went wrong: " + req.body);
				
			}

			// always give coinbase a 200
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

	}
	
	function checkPaid(code, req, cb) {
		
		var pid = req.cookies[code + "-purchase"];
		datastore.checkPaidStatus(pid, function(err, p) {
			
			if (err) {
				console.log(err);
				cb(false);
			} else {
				cb(p);
			}
			
		});
		
//		if (purchases[pid]) {
//			return purchases[pid].paid;
//		} else {
//			return false;
//		}
		
	}
	
	return {
		router: myRouter,
		paymentCheck: checkPaid
	};
	
};