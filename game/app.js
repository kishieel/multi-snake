var socket = io();

document.addEventListener('keydown', function(event) {
	switch (event.keyCode) {
		case 65: // A
			socket.emit('movement', [-1, 0])
			break;
		case 87: // W
			socket.emit('movement', [0, -1])
			break;
		case 68: // D
			socket.emit('movement', [1, 0])
			break;
		case 83: // S
			socket.emit('movement', [0, 1])
			break;
		case 32: // A
			socket.emit('cheat')
			break;
	}
});

socket.emit('new player');

var canvas = document.querySelector('canvas');
canvas.width = 960;
canvas.height = 580;

var context = canvas.getContext('2d');

socket.on('update', function(players, fruits) {
	context.clearRect(0, 0, 960, 580);

	context.fillStyle = "gold";
	context.beginPath();
	for ( const pos of fruits ) {
		context.fillRect(pos.x, pos.y, 20, 20);
	}

	for (var id in players) {
		var player = players[id];
		context.beginPath();
		// context.fillStyle = "#" + player.color;
		var my_gradient = context.createLinearGradient(0, 0, 0, 200);
		my_gradient.addColorStop(0, "green");
		my_gradient.addColorStop(1, "gray");
		context.fillStyle = my_gradient;
		for ( const pos of player.position ) {
			context.fillRect(pos.x, pos.y, 20, 20);
		}
	}
});
