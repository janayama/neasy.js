

	function RoomMananger () {
		this.rooms = {};

		this.get = function (roomName) {
			if (this.rooms[roomName] === undefined){
				console.log('creating room ' + roomName);
				this.rooms[roomName] = new Room(roomName);
			} 

			
			return this.rooms[roomName];
		}
	};
	
	function Room (roomName) {

		this.name 	= roomName;
		this.num 	= 0;


		this.add = function (socket) {
			console.log('subscribe to ' + roomName);

			socket.join(roomName); 
			socket.room = this;
			this.num++;

			console.log('Active clients: ' + this.num);
		}

		this.remove = function (socket) {
			console.log('unsubscribe from ' + roomName);
			
			socket.leave(roomName); 
			this.num--;
			delete socket.room;

			console.log('Active clients: ' + this.num);
		}
	};

	
	var manager = new RoomMananger();

	module.exports = {
		use: function (app) {

			var io = app.io;


			function connect (socket) {
				socket.on('subscribe', subscribe);
				socket.on('unsubscribe', unsubscribe);
				socket.on('disconnect', disconnect);
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


			app.io.sockets.on('connection', connect);
		}
	}