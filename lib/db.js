
	var config 	= require(process.argv[2] || process.cwd() + '/config.js');
	var mongo 	= require('mongodb');
	var db 		= new mongo.Db(config.database.name, new mongo.Server('localhost', 27017, {}), {safe:true});


	var api = {

		open: function(callback) {
			return db.open(callback);
		},

		save: function(collection, item, callback) {
			callback = callback || function(){};
			if (item._id) {
				return this.update(collection, item, function(err, records) {
					if (err) return callback(err);

					callback(false, item);
				});
			};
	
			db.collection(collection, function(err, collection) {
				collection.save(item, {safe: true}, function(err, records) {
					if (err) return callback(err);

					return callback(false, records);
				});
			});
		},

		update: function(collection, item, callback) {
			callback = callback || function(){};
			

			db.collection(collection, function(err, collection) {
				var ID = item._id.toString();

				// we need an id
				if (!ID) return callback(true);

				var mongoID = mongo.ObjectID(ID);
				var filter = { _id: mongoID };

				// we never update mongoid
				delete(item._id);

				collection.update(filter, item, function(err, records) {
					// reset the _id
					item._id = ID;

					// if err
					if (err) return callback(err);

					// callback event if records = 0
					return callback(false, records);
				});
			});
		},

		find: function(collection, filter, callback, opt) {
			callback = callback || function(){};
			opt = opt || {};

			db.collection(collection, function(err, collection) {
				collection.find(filter, opt).toArray(function(err, results) {
					if (err) return callback(err);
					return callback(false, results);
				});
			});
		},

		remove: function(collection, filter, callback) {
			callback = callback || function(){};

			db.collection(collection, function(err, collection) {
				collection.remove(filter, function(err) {
					return callback(err);
				});
			});
		},

		removeById: function(collection, id, callback) {
			callback = callback || function(){};

			db.collection(collection, function(err, collection) {
				var mongoID = mongo.ObjectID(id);
				collection.remove({_id: mongoID}, function(err) {
					return callback(err);
				});
			});
		},

		findOne: function(collection, filter, callback) {
			callback = callback || function(){};

			db.collection(collection, function(err, collection) {
				if (err) return callback(err);

				collection.findOne(filter, callback);
			});
		},

		findById: function(collection, id, callback) {
			db.collection(collection, function(err, collection) {
				if (err) return callback(err);

				try {
					var mongoID = mongo.ObjectID(id);
					collection.findOne({_id: mongoID}, callback);
				} catch(err) {
					return callback(err);
				}
			});
		},

		toObjectId: function(id) {
			return mongo.ObjectID(id);
		}
	};

	module.exports = api;