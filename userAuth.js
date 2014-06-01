/*
 * user authenticator to be used with Passport.js
 */
var crypto = require('crypto');
var mysql = require('mysql');

module.exports = function(dbconf) {
	
	var pool = mysql.createPool(dbconf);
	
	return function(username, password, done) {

		var md5sum = crypto.createHash('md5');
		password = md5sum.update(password).digest('hex');

		pool.query('SELECT user_id FROM comic_users WHERE user_id = ? AND password_hash = ?', [username, password], function(err, rows) {
			if (err) {
				done(new Error('data access error'));
			} else {
				if (rows.length === 1) {
					done(null, { userid: username });
				} else {
					done(null, false, { message: 'Invalid credentials' });
				}
			}
		});

	};
	
};
