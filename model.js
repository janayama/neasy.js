
	
	var Class 	= require('./class.js');
	var db 		= require('./lib/db.js')


	// Instance methods
	var Model = Class.extend({

		init: function(data) {
			this.data = {};
			if (data) this.data = data;
		}
	});


	// Class methods
	Model.findById = function(id, cb) {
		var self = this, collection = this.class;

		db.findById(collection, id, function(err, dbData) {
			if (err) return cb(err);
			if (dbData===null) return cb(new Error(collection +' with id '+ id + ' not found!'));

			var instance = new self(dbData);
			cb(null, instance);
		});
	};

	Model.class = 'model';

	module.exports = Model;
