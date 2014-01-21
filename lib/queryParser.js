
	module.exports = function (app) {

		// Middleware to query params
		return function(varName, cb) {
			app.all('*', function(req, res, next){
				if (req.query[varName]) {
					cb(req, res, next, req.query[varName]);
				} else {
					next();
				}
			});
		};
	};