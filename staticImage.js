var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');

module.exports = function(conf) {
	
	var config = conf || {};
	
	var tempDir = config.dir || './temp';
	
	
	return {
		
		createImage: function (id, cellOrStoreFunc, storeFuncOrCallback, callback) {

			var cellNum = (((typeof cellOrStoreFunc) !== 'function') ? cellOrStoreFunc : null);
			var storeFunc = (((typeof cellOrStoreFunc) === 'function') ? cellOrStoreFunc : storeFuncOrCallback);
			var cb = callback || storeFuncOrCallback;
			
			var fileId = id;
			var urlId = id;
			if (cellNum) {
				urlId += '/' + cellNum;
				fileId += "-" + cellNum;
			}
			
			var fn = tempDir + path.sep + "temp-capture-" + fileId + ".js";
			var imgFileName = tempDir + path.sep + "comic_" + fileId + ".png";
			
			var cFileData = "var page = require('webpage').create();\n" +
				"page.open('http://localhost:3000/basic/" + urlId + "', function() {\n" +
				"page.render('" + imgFileName.replace(/\\/g, '\\\\') + "');\n" +
				"phantom.exit();\n" +
				"});";
			
			fs.writeFile(fn, cFileData, function(err) {
				
				if (err) {
					cb(err);
				} else {
					
					// call phantomjs
					child = exec('phantomjs ' + fn, function(error, stdout, stderr) {
						if (error !== null) {
							var e = new Error('exec error: ' + error);
							cb(e);
						} else {
							
							console.log('image ' + imgFileName + ' created!');
							
							fs.unlink(fn, function(err) {
								
								if (err) {
									cb(err);
								} else {
									
									console.log('removed ' + fn);
									
									// read image
									fs.readFile(imgFileName, function(err, idata) {
										
										if (err) {
											cb(err);
										} else {
											
											console.log('read ' + imgFileName);
											storeFunc(id, idata, function(err) {
												
												if (err) {
													cb(err);
												} else {

													// everything worked, clean up image file
													fs.unlink(imgFileName, function(err) {
														
														if (err) {
															cb(err);
														} else {
															console.log('removed ' + imgFileName);
															cb();
														}
														
													});
													
												}
												
											});
											
										}
										
									});
									
								}
								
							});
							
						}
						
					});
					
				}
				
			});
			
		}
	
	};
	
};