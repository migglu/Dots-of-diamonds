var io = require('./socket');
var db = require('./database');

var waitingGames = {}; // token => {game, date}

function addGameListeners(socket, game) {
	socket.on('move', function (data) {
		if(data.x != undefined && data.y != undefined && data.line != undefined) {
			console.log( data );
			game.playTurn(socket, data);
		}
	});
}

function setLine(x, y, line) {
	this.lines[ x ][ y ] |= 1 << (line - 1);
}

function getLine(x, y, line) {
	return this.lines[ x ][ y ] & ( 1 << (line - 1) );
}

function Game() {
	this.size = 6;
	this.linesLeft = this.size*this.size*6;
	this.lines = new Array();
	this.player1 = {'socket': null, 'id': 1};
	this.player2 = {'socket': null, 'id': 2};
	this.p1UserId = -1;
	this.p2UserId = -1;
	this.id = -1;
	this.turn = null;
	this.waiting = null;
	this.timer = null;
	this.timeDelay = 15000;
	this.end = false;
	this.winner = null;
	this.turns = [];
}

function sendMove(move) {
	io.sendSingleMessage(this.waiting.socket, 'move', move);
	io.sendSingleMessage(this.turn.socket, 'move', move);
}

function playTurn(player, turn) {
	if(this.turn.socket == player) {
		console.log( turn );
		if( this.getLine( turn.x, turn.y, turn.line ) != 0 ) {
			return;
		}
		this.endTimer();
		this.setLine( turn.x, turn.y, turn.line );
		console.log( this.turn );
		var move = {'x': turn.x, 'y': turn.y, 'line': turn.line, 'player': this.turn.id};
		this.sendMove( move );
		this.turns.push(move);
		this.linesLeft--;
		if( this.linesLeft == 0 ) {
			this.end = true;
		}
		this.nextTurn();
	}
}

function setIdAndBeginGame(id) {
	this.setId(id);
	this.beginGame();
}

function initialize() {
	this.p1UserId = this.player1.socket.store.data.userid;
	this.p2UserId = this.player2.socket.store.data.userid;
	delete waitingGames[ this.player1.socket.store.data.token ];
	delete waitingGames[ this.player2.socket.store.data.token ];
	
	for(var x = 0; x < this.size; x++) {
		this.lines[x] = new Array();
		for(var y = 0; y < this.size; y++) {
			this.lines[x].push(0);
		}
	}
	var game = this;
	var a = function ( id ) {
		game.setIdAndBeginGame( id );
	}
	db.initGame(this.p1UserId, this.p2UserId, a);
}

function beginGame() {
	console.log( 'Commencing game!' );
	
	addGameListeners(this.player1.socket, this);
	addGameListeners(this.player2.socket, this);
	
	sendGameStart(this.player1.socket);
	sendGameStart(this.player2.socket);
	
	this.turn = this.player1;
	this.waiting = this.player2;
	this.startTimer();
}

function setId(id) {
	this.id = id;
}

function startTimer() {
	console.log( 'Swithing the turrrrrrrnzzzzzzzzzzzzzz' );
	sendTurn(this.turn.socket);
	sendWait(this.waiting.socket);
	var a = function (e) { e.nextTurn() };
	this.timer = setTimeout( a, this.timeDelay, this );
}

function endTimer() {
	clearTimeout(this.timer);
}

function nextTurn() {
	if(!this.end) {
		this.switchTurn();
		this.startTimer();
	} else {
		//TODO endgame
		sendGameEnd( this.player1.socket );
		sendGameEnd( this.player2.socket );
	}
}

function switchTurn() {
	var oldTurn = this.turn;
	this.turn = this.waiting;
	this.waiting = oldTurn;
}

function connectPlayer(socket, number) {
	if( number == 1) {
		this.player1.socket = socket;
	} else if( number == 2 ) {
		this.player2.socket = socket;
	} else if( number == undefined) {
		if( this.player1.socket == null ) {
			this.player1.socket = socket;
		} else if( this.player2.socket == null && this.player1.socket != socket ) {
			this.player2.socket = socket;
		} else {
			return;
		}
	}
	if( this.player1.socket != null ) {
		console.log( "this.player1.socket != null" );
	}
	if( this.player2.socket != null ) {
		console.log( "this.player2.socket != null" );
	}
	if( this.player1.socket != null && this.player2.socket != null )
	{
		this.initialize();
	} else {
		sendQueueing(socket);
	}
	
}

function sendQueueing( socket ) {
	io.sendSingleMessage( socket, 'queueing', {} );
}

function sendGameStart(socket)
{
	io.sendSingleMessage(socket, 'gameStart', {});
}

function sendTurn(socket)
{
	io.sendSingleMessage(socket, 'turnAck', {});
}

function sendWait(socket)
{
	io.sendSingleMessage(socket, 'wait', {});
}

function sendGameEnd(socket, winner)
{
	//TODO winner
	io.sendSingleMessage(socket, 'gameEnd', { 'winner': winner});
}

function sendToChat( socket )
{
	io.sendSingleMessage( socket, 'back', {} );
}



Game.prototype.initialize = initialize;
Game.prototype.beginGame = beginGame;
Game.prototype.setId = setId;
Game.prototype.switchTurn = switchTurn;
Game.prototype.startTimer = startTimer;
Game.prototype.nextTurn = nextTurn;
Game.prototype.endTimer = endTimer;
Game.prototype.playTurn = playTurn;
Game.prototype.sendMove = sendMove;
Game.prototype.setIdAndBeginGame = setIdAndBeginGame;
Game.prototype.connectPlayer = connectPlayer;
Game.prototype.setLine = setLine;
Game.prototype.getLine = getLine;

function gameAuthListener( socket ) {
	var token = socket.store.data.token;
	console.log( 'token = ' + token );
	if( token != undefined && waitingGames[ token ] != undefined ) {
		waitingGames[ token ].game.connectPlayer( socket );
	} else {
		sendToChat( socket );
	}
}

function setLoggedIn( name, id, token, socket ) {
	socket.set('token', token, function() {
		socket.set('userid', id, function() {
			console.log( 'id = ' + id );
			socket.emit('ok', {'error': 0});
			gameAuthListener( socket );
		});
	});
}

function addGame( socket, game, date ) {
	waitingGames[ socket.store.data.token ] = { 'game':game, 'date': date };
	console.log( waitingGames );
}


exports.Game = Game;
exports.setLoggedIn = setLoggedIn;
exports.addGame = addGame;

