
	var path 			= require('path').dirname(require.main.filename);
	var http 			= require('http');
	var express 		= require('express');
	var app 			= express();
	var cookieSecret 	= 'yoursuperamazincookiesecret';
	var server 			= http.createServer(app);



	// default express settings
	app.use(express.compress());
	app.use(express.cookieParser());
	app.use(express.cookieParser(cookieSecret));
	app.use(express.cookieSession({path: '/', httpOnly: true, maxAge: null, secret: cookieSecret}));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(require('get-methodoverride'));
	app.use(express.static(path + '/public'));	
	app.configure('development', function() {
		app.use(express.errorHandler({dumpExceptions:true, showStack:true}));
	});


	app.start = function () {
		console.log('App running in port http://localhost:3000');
		server.listen(3000);
	};


	module.exports = app;