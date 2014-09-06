/*
 * user authenticator to be used with Passport.js
 */

module.exports = function(dbconf) {
	
	return function(username, password, done) {

		done(null, { userid: username });

	};
	
};
