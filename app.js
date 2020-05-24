const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const path = require('path')

const app = express()
const server = http.Server( app )
const io = socketIO( server )

const port = 3000

app.set('port', port)
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function( req, res ) {
	res.sendFile( path.join( __dirname, '/public/index.html' ) )
})

server.listen( port, function() {
	console.log(`Server starting on port ${port}`)
})

const randomPosition = ( ) => {
	return { x: Math.round( Math.random() * 46 ) * 20, y: Math.round( Math.random() * 27 ) * 20 }
}

const randomDirection = () => {
	const dir = [ [-1, 0], [1,0], [0,-1], [0,1] ]
	return dir[ Math.floor(Math.random() * ( dir.length )) ]
}

const state = {
	players: {},
	fruits: []
}
io.on('connection', function( socket ) {
	state.players[ socket.id ] = {
		positions: [ randomPosition(), { x: -100, y: -100 }, { x: -100, y: -100 }, ],
		direction: randomDirection(),
		color: Math.floor( Math.random() * 0xffffff ).toString(16)
	}
	state.fruits.push( randomPosition() )

	socket.on('move', ( dir ) => {
		state.players[ socket.id ].direction = dir
	})

	socket.on('eat', ( index ) => {
		state.fruits.splice( index, 1 )
		state.players[ socket.id ].positions.push( { ...state.players[ socket.id ].positions[0] } )

		if ( state.fruits.length < Object.keys( state.players ).length || state.fruits.length === 0 ) {
			state.fruits.push( randomPosition() )
		}
	})

	socket.on('death', ( ) => {
		const snake = state.players[ socket.id ]
		for ( let i = 1; i < snake.positions.length; i += 2 ) {
	  		const  fruit = { ...snake.positions[ i ] }
	  		if ( fruit.x >= 0 && fruit.x < 960 && fruit.y >=0 && fruit.y< 580 ) {
	    		state.fruits.push( fruit )
	  		}
		}
		state.players[ socket.id ].positions.splice( 1 )
	})

	socket.on('disconnect', ( ) => {
		delete state.players[ socket.id ]
	})
})

setInterval( () => {
	for ( const id in state.players ) {
		const snake = state.players[ id ]

		for ( let i = snake.positions.length - 1; i > 0; i-- ) {
	  		snake.positions[i].x = snake.positions[i - 1].x
	  		snake.positions[i].y = snake.positions[i - 1].y
		}

		snake.positions[0].x += snake.direction[0] * 20
		snake.positions[0].y += snake.direction[1] * 20

		if ( snake.positions[0].x >= 960 ) {
		  	snake.positions[0].x = 0
		} else if ( snake.positions[0].x < 0 ) {
		  	snake.positions[0].x = 960
		} else if ( snake.positions[0].y >= 580 ) {
			snake.positions[0].y = 0
		} else if ( snake.positions[0].y < 0 ) {
		  	snake.positions[0].y = 580
		}
	}
	io.sockets.emit('update', state)
}, 100 )
