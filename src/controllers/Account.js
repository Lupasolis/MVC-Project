var _ = require('underscore');
var models = require('../models');
var controllers = require('../controllers');
var source = require('../app.js'); 

var Account = models.Account;

//renders the login page
var loginPage = function(req,res){
	res.render('login', {csrfToken: req.csrfToken() });
};

//renders the signup page
var signupPage = function(req,res){
	res.render('signup', {csrfToken: req.csrfToken() });
};

//on logout, destroys the session and redirects them to the login page
var logout = function(req,res){
	req.session.destroy();
	res.redirect('/');
};

//on login
var login = function(req,res){
	
	//if the username and passwords don't match
	if(!req.body.username || !req.body.pass){ 
		return res.status(400).json({error: "All fields are required"});
	}
	
	//checks username and password before requesting a session and redirecting to the maker page
	Account.AccountModel.authenticate(req.body.username, req.body.pass, function(err, account){
		if(err || !account){
			return res.status(3001).json({error: "Wrong username or password"});
		}
		
		req.session.account = account.toAPI();
		
		res.json({redirect: '/statCheck'});
		
	});
};

var search = function(req,res){
	
	//if the search term is blank
	if(!req.body.searchName){ 
		return res.status(400).json({error: "There are no search terms"});
	}

	Account.AccountModel.findByUsername(req.body.searchName, function(err, docs){
		if(err){
			console.log(err);
			return res.status(400).json({error: 'An error occurred'});
		}
		else{
			console.log(docs); 
			//res.render('app', {csrfToken: req.csrfToken(), username: docs});
			res.json({redirect:'/statCheck?username=' + docs.username}); 
		}
	});
};

//on signup
var signup = function(req,res){
	
	//if one of the fields is empty
	if(!req.body.username || !req.body.pass || !req.body.pass2 || !req.body.wWin || !req.body.wLoss || !req.body.vWin || !req.body.vLoss){
		return res.status(400).json({error: "All fields are required"});
	}
	////if the passwords don't match
	if(req.body.pass !== req.body.pass2){
		return res.status(400).json({error: "Passwords do not match"});
	}
	
	//creates an account using the username and password
	Account.AccountModel.generateHash(req.body.pass, function(salt,hash){
		
		var accountData = {
			username: req.body.username,
			salt: salt,
			password: hash,
			wolfWin: req.body.wWin,
			wolfLoss: req.body.wLoss,
			villWin: req.body.vWin,
			villLoss: req.body.vLoss
		};
		
		var newAccount = new Account.AccountModel(accountData);
		
		//saves the new account to the database
		newAccount.save(function(err) {
			if(err){
				console.log(err);
				return res.status(400).json({error: 'An error occurred'});
			}
			
			req.session.account = newAccount.toAPI(); //requests a session
			//createPlayer(req,res); 
			
			res.json({redirect: '/statCheck'}); //redirects the user to the maker page
		});
	});
};

var statsPage = function(req,res){
	
	Account.AccountModel.findByUsername(req.session.account.username, function(err, docs){
		//outputs a message if an error occurs
		//console.log("req is " + req.session.account.username);
		if(err){
			console.log(err);
			return res.status(400).json({error:'An error occurred'});
		}
		var search; 
		if(req.query.username){
			//console.log("req.query.username= " + req.query.username);
			Account.AccountModel.findByUsername(req.query.username, function(err, docs2){
				//console.log("docs2 = " + docs2);
				//outputs a message if an error occurs
				if(err){
					console.log(err);
					return res.status(400).json({error:'An error occurred'});
				}
				search = docs2; 
				res.render('app', {csrfToken: req.csrfToken(), player: docs, result: search});
			});			
		}
		else{
			//console.log("player is " + docs);
			res.render('app', {csrfToken: req.csrfToken(), player: docs, result: search});
		}
		//console.log(search); 
		
	});
	
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
module.exports.statsPage = statsPage; 
module.exports.search = search;