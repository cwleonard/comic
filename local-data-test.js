var cdata = require('./localdata');

var conf = {
	dataDir: 'C:\\Users\\Casey\\Dropbox\\comic\\data',
	imgDir: 'C:\\comic-data\\svg',
	pinDir: 'C:\\comic-data\\pins'
};

var cfact = cdata(conf);

cfact.loadById('5', function (err, data) {
	if (err) console.log(err);
	console.log(data);
	
	cfact.storeData(data, '999', function(err, id) {
		console.log('stored data with id ' + id);
	});
	
	
});
