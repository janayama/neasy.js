
	module.exports = function Room (roomName) {
		var io	= require('socket.io');

		this.name 		= roomName;
		this.num 		= 0;
		this.doc 		= {};
		this.destroy 	= function () {};

		this.set = function (socket, data) {
			for (var i in data) {
				this.doc[i] = data[i];
			}

			socket.broadcast.to(this.name).emit('update', this.doc);
		}

		this.add = function (socket) {
			console.log('subscribe to ' + roomName);

			socket.join(roomName); 
			socket.room = this;
			this.num++;

			// socket.broadcast.to(this.name).emit('clients', this.num);
			socket.manager.sockets.in(this.name).emit('clients',  this.num);

			console.log('Active clients: ' + this.num);
		}

		this.remove = function (socket) {
			console.log('unsubscribe from ' + roomName);
			
			socket.leave(roomName); 
			this.num--;
			delete socket.room;


			console.log('Active clients: ' + this.num);
			socket.manager.sockets.in(this.name).emit('clients',  this.num);
			// socket.broadcast.to(this.name).emit('clients', this.num);

			if (this.num == 0) this.destroy();			
		}
	};