
	var path 			= process.cwd();
	var config 			= require(process.argv[2] || path + '/config.js');
	var http 			= require('http');
	var express 		= require('express');
	var app 			= express();
	var cookieSecret 	= config.cookie.secret || 'yoursuperamazincookiesecret';
	var server 			= http.createServer(app);
	var fs 				= require("fs");
	var queryParser  	= require('./lib/queryParser.js');
	var db				= require('./lib/db');

	var dir 			= {
		routes	: path + '/routes',
		models	: path + '/models',
		views	: path + '/views'
	};


	


	// custom express settings
	app.config = config;
	app.routes = fs.readdirSync(dir.routes).sort();
	app.models = fs.readdirSync(dir.models).sort();
	app.query  = queryParser(app);

	// default express settings
	app.use(express.compress());
	app.use(express.cookieParser(cookieSecret));
	app.use(express.cookieSession({path: '/', httpOnly: true, maxAge: null, secret: cookieSecret}));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(require('get-methodoverride'));
	app.use(express.static(path + '/public'));	
	app.configure('development', function() {
		app.use(express.errorHandler({dumpExceptions:true, showStack:true}));
	});

	// view settings
	app.set('view engine', 'twig');


	app.start = function () {
		var i;

		// Automatice param/query to model conversion
		for (i in app.models) {
			if (app.models.hasOwnProperty(i)) {

				var model = require(dir.models + '/' + app.models[i]);

				(function (model) {
					var name = model.class;

					// Enable query definitions
					app.query(name, function(req, res, next, id) {
						
						model.findById(id, function(err, instance){
							if (err) return next();

							req.query[name] = instance;
							next();
						});
					});

					// Enable param definitions
					app.param(name, function(req, res, next, id) {

						model.findById(id, function(err, instance){
							if (err) return next();

							req.param[name] = instance;
							next();
						});
					});


				})(model);
			}
		}

		// Load the routes
		for (i in app.routes) {
			if (typeof app.routes[i] == 'string') {
				var filename = app.routes[i];
				if (filename.substr(filename.lastIndexOf('.')) != '.js') continue;


				console.log("Loading route: " + filename);
				require(dir.routes + '/' + filename);
			}
		};

		db.open(function(err){
			if (err) return console.log(err.toString() + ' - try this "sudo rm /var/lib/mongodb/mongod.lock && sudo -u mongodb mongod -f /etc/mongodb.conf --repair."');

			// Start the web server
			console.log('App running in port http://' + config.server.domain + ':' + config.server.port);
			server.listen(config.server.port);
		});
	};


	module.exports = app;