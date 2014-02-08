
	var RoomMananger 	= require('./RoomMananger.js')
	var Room 			= require('./Room.js');
	

	
	var manager = new RoomMananger();

	module.exports = {
		use: function (server) {
			var io	= require('socket.io').listen(server);

			function connect (socket) {
				socket.on('subscribe', subscribe);
				socket.on('unsubscribe', unsubscribe);
				socket.on('set', set);
				socket.on('disconnect', disconnect);
			}

			function set (data) {
				if (this.room) this.room.set(this, data);
			}

			function unsubscribe (data) { 
				manager.get(data.room).remove(this);
			}

			function subscribe (data) { 
				manager.get(data.room).add(this);
			}

			function disconnect () {
				this.room.remove(this);
				console.log('disconnected!');
			}


			io.sockets.on('connection', connect);
		}
	}