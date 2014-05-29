var exec = require('child_process').exec;
var fs = require('fs');

module.exports = function(conf) {
	
	var config = conf || {};
	
	var tempDir = config.dir || './temp';
	
	
	return {
		
		createImage: function (id, storeFunc, cb) {
			
			var fn = tempDir + "/temp-capture-" + id + ".js";
			var imgFileName = tempDir + "/comic_" + id + ".png";
			
			var cFileData = "var page = require('webpage').create();\n" +
				"page.open('http://localhost:3000/basic/" + id + "', function() {\n" +
				"page.render('" + imgFileName + "');\n" +
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