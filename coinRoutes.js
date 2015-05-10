var Client = require('coinbase').Client;
var intformat = require('biguint-format');
var FlakeId = require('flake-idgen');

module.exports = function(stuff) {

	var addresses = {};
	var purchases = {};
	
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
	
	var myRouter = null;
	
	if (stuff.express) {
		
		myRouter = stuff.express.Router();
		

		myRouter.get('/address', function(req, res, next) {

			var Account   = require('coinbase').model.Account;
			var myBtcAcct = new Account(client, {
				'id' : accountId
			});

			var args = {
					"callback_url": "http://example.com/coin/callback",
					"label": "comic paywall"
			};
			
			myBtcAcct.createAddress(args, function(err, data) {

				if (err) {
					
					console.log("unable to create address: " + err.response.body);
					res.sendStatus(500);
					
				} else {
					
					console.log(data);
					
					var purchaseId = intformat(flakeIdGen.next(), 'hex');
					
					console.log("purchase-id: " + purchaseId);
					
					var a = {
						paid: false,
						purchaseId: purchaseId
					};
					addresses[data.address] = a;
					purchases[purchaseId] = a;
					
					res.cookie('paywall-purchase', purchaseId, { maxAge: ((new Date()).getTime() + (365*24*60*60000*10)), httpOnly: true });
					res.setHeader('Content-Type', 'text/plain');
					res.send(data.address);
				
				}
			});

		});

		myRouter.post('/callback', function(req, res, next) {

			var addr = req.body.address;
			if (addr) {
				
				if (addresses[addr]) {
					
					addresses[addr].paid = true;
					
					console.log("paid to address: " + addr);
					console.log("amount: " + req.body.amount);

				} else {
					console.log("unknown address got payment: " + addr);
				}
				
			} else {

				console.log("something went wrong: " + req.body);
				
			}
			
			
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
	
	function isPaid(req) {
		
		var pid = req.cookies["paywall-purchase"];
		
		if (purchases[pid]) {
			return purchases[pid].paid;
		} else {
			return false;
		}
		
	}
	
	return {
		router: myRouter,
		paymentCheck: isPaid
	};
	
};