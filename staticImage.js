var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');

module.exports = function(conf) {
	
	var config = conf || {};
	
	var tempDir = config.dir || './temp';
	var magicNumber = config.magicNumber;
	
	
	return {
		
		createImage: function (id, cellOrStoreFunc, storeFuncOrCallback, callback) {

			var cellNum = (((typeof cellOrStoreFunc) !== 'function') ? cellOrStoreFunc : null);
			var storeFunc = (((typeof cellOrStoreFunc) === 'function') ? cellOrStoreFunc : storeFuncOrCallback);
			var cb = callback || storeFuncOrCallback;
			
			var cn = "";
			var fileId = id;
			var urlId = id;
			if (cellNum) {
				cn = '&c=' + cellNum;
				fileId += "-" + cellNum;
			}
			
			var fn = tempDir + path.sep + "temp-capture-" + fileId + ".js";
			var imgFileName = tempDir + path.sep + "comic_" + fileId + ".png";
			
			var cFileData = "var page = require('webpage').create();\n" +
				"page.viewportSize = { width: 1202, height: 5000 };\n" +
				"page.open('http://localhost:3000/" + urlId + "?b=1" + cn + "', function() {\n" +
				"    window.setTimeout(function() {\n" +
				"        page.clipRect = page.evaluate(function() {\n" +
				"            var rect = document.getElementById('comicArea').getBoundingClientRect();\n" +
				"            var rect2 = document.getElementById('cell-0').getBoundingClientRect();\n" +
				"            var r = JSON.parse(JSON.stringify(rect));\n" +
				"            r.height += (r.top * 2);\n" +
				"            r.top = 0;\n" +
				"            r.left = rect2.left - 102;\n" +
				"            r.right = rect2.right + 102;\n" +
				"            r.width = rect2.width + 204;\n" +
				"            return r;\n" +
				"        });\n" +
				"        page.render('" + imgFileName.replace(/\\/g, '\\\\') + "');\n" +
				"        phantom.exit();\n" +
				"    }, 500);\n" +
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