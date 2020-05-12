var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 8080);
app.use('/game', express.static(__dirname + '/game'));

app.get('/', function(request, response) {
  	response.sendFile(path.join(__dirname, '/game/index.html'));
});

server.listen(8080, function() {
  	console.log('Starting server on port 8080');
});

var players = {};
var fruits = [];
io.on('connection', function(socket) {
	socket.on('new player', function() {
		players[socket.id] = {
			position: [ {x: 300, y: 300},{x: 300, y: 300} ],
			direction: [1, 0],
			length: 10,
			color: Math.floor(Math.random() * 16777215).toString(16),
		};
		fruits.push({ x: Math.round(Math.random() * 47) * 20 , y: Math.round(Math.random() * 28) * 20})
	});
	socket.on('movement', function(data) {
		var player = players[socket.id] || {};
		player.direction = data;
	});
	socket.on('cheat', function() {
		var player = players[socket.id] || {};
		player.position.push({ ...player.position[0] });
	});
	socket.on('disconnect', function() {
		delete players[socket.id];
		fruits.pop();
	})
});

setInterval(function() {
	for ( const id in players ) {
		players[id].position[0].x += players[id].direction[0] * 20;
		players[id].position[0].y += players[id].direction[1] * 20;


		fruits.forEach((fruit, i) => {
			if ( players[id].position[0].x === fruit.x && players[id].position[0].y === fruit.y ) {
				 players[id].position.push({ ...players[id].position[0] });
				 fruits.splice(i, 1);
			 	fruits.push({ x: Math.round(Math.random() * 48) * 20 , y: Math.round(Math.random() * 29) * 20})
			}
		});

		if ( players[id].position[0].x >= 960 ) {
			players[id].position[0].x = 0;
		} else if ( players[id].position[0].x < 0 ) {
			players[id].position[0].x = 940;
		} else if ( players[id].position[0].y >= 580 ) {
			players[id].position[0].y = 0;
		} else if ( players[id].position[0].y < 0 ) {
			players[id].position[0].y = 560;
		}

		for ( let i = players[id].position.length - 1; i > 0 ; i-- ) {
			players[id].position[i].x = players[id].position[i - 1].x;
			players[id].position[i].y = players[id].position[i - 1].y;
		}
	}
	io.sockets.emit('update', players, fruits);
}, 100);
