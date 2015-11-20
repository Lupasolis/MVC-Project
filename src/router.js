var controllers = require('./controllers');
var mid = require('./middleware');

var router = function(app){
	
	app.get("/login", mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
	app.post("/login", mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
	app.get("/signup", mid.requiresSecure, mid.requiresLogout,controllers.Account.signupPage);
	app.post("/signup", mid.requiresSecure, mid.requiresLogout,controllers.Account.signup);
	app.post("/search", mid.requiresSecure, mid.requiresLogout,controllers.Account.search);
	app.get("/logout", mid.requiresLogin, controllers.Account.logout);
	app.get("/statCheck", mid.requiresLogin, controllers.Account.statsPage);
	app.post("/statCheck", mid.requiresLogin, controllers.Account.search);
	app.get("/", mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
	
};

module.exports = router;