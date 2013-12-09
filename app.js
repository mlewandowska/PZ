/*jshint node: true */
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.static(path.join(__dirname, 'public')));
});

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("Serwer nas³uchuje na porcie " + app.get('port'));
});

var io = require('socket.io');
var socket = io.listen(server);

var boxData = require('./lib/data')();


socket.on('connection', function (client) {
    'use strict';

    var boxes = boxData.getAllBoxes();

    for(var i = 0; i < boxes.length; i++){
    	if(boxes[i]){
	    	client.emit('addNewBox', boxes[i]);
	    }
    }
    var innerBoxes = boxData.getAllInnerBoxes();
    for(var i = 0; i < innerBoxes.length; i++){
    	if(innerBoxes[i]){
	    	client.emit('addNewInnerBox', innerBoxes[i]);
	    }
    }


    client.on('addNewBox', function (data) {
    	var box = boxData.addBox(data);
    	// data.id = id;
    	client.emit('addNewBox', box);
    	client.broadcast.emit('addNewBox', box);
    });

    client.on('rmBox', function (data) {
    	console.log(data);
    	boxData.rmBox(data);
    	client.emit('rmBox', data);
    	client.broadcast.emit('rmBox', data);
    });

    client.on('addInnerBox', function (data) {
    	console.log(data);
    	var innerBox = boxData.addInnerBox(data);
    	console.log(innerBox);
    	client.emit('addNewInnerBox', innerBox);
    	client.broadcast.emit('addNewInnerBox', innerBox);
    });

    client.on('rmInnerBox', function (data){
    	boxData.rmInnerBox(data);
    	var newData = { 'id': data };
    	client.emit('rmInnerBox', newData);
    	client.broadcast.emit('rmInnerBox', newData);
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