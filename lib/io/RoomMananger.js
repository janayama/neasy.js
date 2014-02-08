
	var Room = require('./Room.js');

	module.exports = function RoomMananger () {
		var manager = this;

		this.rooms = {};

		this.get = function (roomName) {
			if (this.rooms[roomName] === undefined){
				console.log('creating room ' + roomName);
				this.rooms[roomName] = new Room(roomName);
			}

			this.rooms[roomName].destroy = function () {
				console.log('Remove room "'+ roomName +'" from list');
				delete manager.rooms[roomName];
			};
			
			return this.rooms[roomName];
		}
	};