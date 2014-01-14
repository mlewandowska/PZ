var socketio = require('socket.io');

exports.listen = function (server, boxData) {
	'use strict';
	var io = socketio.listen(server);

	io.sockets.on('connection', function (client) {
	
	boxData.getAllBoxes(client, function(client, boxes){
		for(var i = 0; i < boxes.length; i++){
			if(!boxes[i].trash){ // spr. czy usunięty
				client.emit('addNewBox', boxes[i]);
			}
		}
	});
	boxData.getAllInnerBoxes(client, function(client, innerBoxes){
		for(var j = 0; j < innerBoxes.length; j++){
			if(!innerBoxes[j].trash){ // spr. czy usunięty
				client.emit('addNewInnerBox', innerBoxes[j]);
			}
		}
	});


	client.on('addNewBox', function (data) {
		var box = boxData.addBox(data);
		client.emit('addNewBox', box);
		client.broadcast.emit('addNewBox', box);
	});

	client.on('rmBox', function (data) {
		boxData.rmBox(data);
		client.emit('rmBox', data);
		client.broadcast.emit('rmBox', data);
	});

	client.on('addInnerBox', function (data) {
		var innerBox = boxData.addInnerBox(data);
		client.emit('addNewInnerBox', innerBox);
		client.broadcast.emit('addNewInnerBox', innerBox);
	});

	client.on('rmInnerBox', function (data){
		boxData.rmInnerBox(data);
		client.emit('rmInnerBox', data);
		client.broadcast.emit('rmInnerBox', data);
	});

	client.on('setNewBoxContent', function (data) {
		boxData.editBox(data);
		client.emit('setNewBoxContent', data);
		client.broadcast.emit('setNewBoxContent', data);
	});

	client.on('setNewInnerBoxContent', function (data) {
		boxData.editInnerBox(data);
		client.emit('setNewInnerBoxContent', data);
		client.broadcast.emit('setNewInnerBoxContent', data);
	});
});

};