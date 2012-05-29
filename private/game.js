var io = require('./socket');
var db = require('./database');

var waitingGames = {}; // token => {game, date}

function addChatListener( socket, gameObject ) {
	socket.on('message', function( data ) {
		if( data != undefined && data.msg != undefined ) {
			data.user = socket.store.data.name;
			
			io.sendSingleMessage( gameObject.player1.socket, 'message', data );
			io.sendSingleMessage( gameObject.player2.socket, 'message', data );
		}
	});
}

function addGameListeners(socket) {
	socket.on('move', function (data) {
		if(data.x != undefined && data.y != undefined && data.line != undefined) {
			socket.game.playTurn(socket, data);
		}
	});
}

var pairs = [ [3, 3 << 3], [3 << 1, 3 << 4 ], [ 3 << 2, 1 | (1 << 5) ], [ 3 << 3, 3], [3 << 4, 3 << 1 ], [ 1 | (1 << 5), 3 << 2 ] ] ;
var positionsOdd = [ [ 0, -1 ], [ -1, 0 ], [ 0, +1 ], [ +1, +1 ], [ +1, 0 ], [ +1, -1 ] ];
var positionsEven = [ [ -1, -1 ], [ -1, 0 ], [ -1, +1 ], [ 0, +1 ], [ +1, 0 ], [ 0, -1 ] ];
var everyRomboidPossible = [ [ 0, 5 ], [ 0, 1], [ 1, 2 ], [ 2, 3 ], [ 3, 4 ], [ 4, 5 ] ];

function checkIfLinesExist( move1, move2, mask1, mask2, object ) {
	var lines1 = this.getHexLines( move1.x, move1.y );
	var lines2 = this.getHexLines( move2.x, move2.y );
	if( ( (lines1 & mask1) == mask1 ) && ( (lines2 & mask2) == mask2 ) )
	{
		object.incrementScore();
	}
}

function checkIfScored( move, object ) {
	var line = move.line - 1;
	for( possible in everyRomboidPossible[ line ] )
	{
		var currentPossibleRomboid = everyRomboidPossible[ line ][ possible ];
		var move1 = {}, move2 = {};
		move1.x = move.x;
		move1.y = move.y;
		if( move1.y % 2 == 1 ) {
			move2.x = move.x + positionsOdd[ currentPossibleRomboid ][0];
			move2.y = move.y + positionsOdd[ currentPossibleRomboid ][1];
		} else {
			move2.x = move.x + positionsEven[ currentPossibleRomboid ][0];
			move2.y = move.y + positionsEven[ currentPossibleRomboid ][1];
		}
		
		if( move2.x < 0 ) { move2.x = 5; }
		if( move2.x > 5 ) { move2.x = 0; }
		if( move2.y < 0 ) { move2.y = 5; }
		if( move2.y > 5 ) { move2.y = 0; }
		
		this.checkIfLinesExist( move1, move2, pairs[ currentPossibleRomboid ][ 0 ], pairs[ currentPossibleRomboid ][ 1 ], object );
	}
}

function setLine(x, y, line) {
	this.lines[ x ][ y ] |= 1 << (line - 1);
}

function getLine(x, y, line) {
	return this.lines[ x ][ y ] & ( 1 << (line - 1) );
}

function getHexLines( x, y ) {
	return this.lines[ x ][ y ];
}

function sendGameScore() {
	var score = { 'p1': this.player1.score, 'p2': this.player2.score,
					'p1id': this.player1.id, 'p2id': this.player2.id };
	sendScore( this.player1.socket, score );
	sendScore( this.player2.socket, score );
}

function Game() {
	this.size = 6;
	this.linesLeft = this.size*this.size*6;
	this.lines = new Array();
	this.player1 = {'socket': null, 'id': 1, 'score': 0 };
	this.player2 = {'socket': null, 'id': 2, 'score': 0 };
	this.anotherTurn = false;
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
	this.connected = 0;
}

function sendIdentifiers() {
	var p1name = this.player1.socket.store.data.name;
	var p2name = this.player2.socket.store.data.name;
	var identifier = {'id':this.player1.id, 'name1': p1name,
						'name2': p2name };
	io.sendSingleMessage( this.player1.socket, 'identifier', identifier );
	identifier = {'id':this.player2.id, 'name1': p2name,
						'name2': p1name };
	io.sendSingleMessage( this.player2.socket, 'identifier', identifier );
}

function incrementScore() {
	this.anotherTurn = true;
	(this.turn.score)++;
}

function sendMove(move) {
	io.sendSingleMessage(this.waiting.socket, 'move', move);
	io.sendSingleMessage(this.turn.socket, 'move', move);
}

function playTurn(player, turn) {
	if(this.turn.socket == player) {
		if( turn.x > 5 || turn.x < 0 || turn.y > 5 || turn.y < 0 || turn.line < 1 || turn > 6 )
		{
			return;
		}
		if( this.getLine( turn.x, turn.y, turn.line ) != 0 ) {
			return;
		}
		this.endTimer();
		this.setLine( turn.x, turn.y, turn.line );
		var move = {'x': turn.x, 'y': turn.y, 'line': turn.line, 'player': this.turn.id};
		
		this.checkIfScored( move, this );
		
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
	var callback = function ( id ) {
		game.setIdAndBeginGame( id );
	}
	db.initGame(this.p1UserId, this.p2UserId, callback);
}

function beginGame() {
	addGameListeners(this.player1.socket);
	addGameListeners(this.player2.socket);
	
	addChatListener( this.player1.socket, this);
	addChatListener( this.player2.socket, this);
	this.sendIdentifiers();	
	
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
	sendTurn(this.turn.socket);
	sendWait(this.waiting.socket);
	var a = function (e) { e.nextTurn() };
	this.timer = setTimeout( a, this.timeDelay, this );
}

function endTimer() {
	clearTimeout(this.timer);
}

function endGame() {
	if( this.player1.socket != null) {
		sendGameEnd( this.player1.socket );
	}
	if( this.player2.socket != null) {
		sendGameEnd( this.player2.socket );
	}
	
	console.log( 'p1id = ' + this.p1UserId );
	console.log( 'p2id = ' + this.p2UserId );
	db.endGame( this.p1UserId, this.p2UserId );
}

function nextTurn() {
	this.sendGameScore();
	if(!this.end) {
		if( !this.anotherTurn ) {
			this.switchTurn();
		} else {
			this.anotherTurn = false;
		}
		this.startTimer();
	} else {
		this.endgame();
	}
}

function switchTurn() {
	var oldTurn = this.turn;
	this.turn = this.waiting;
	this.waiting = oldTurn;
}

function disconnectPlayer( socket ) {
	this.connected--;
	if( this.connected == 0 )
	{
		this.endTimer();
		this.endGame();
	}
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
	this.connected++;
	
	if( this.player1.socket != null && this.player2.socket != null )
	{
		this.initialize();
	} else {
		sendQueueing(socket);
	}
	
}

function destroy() {
	this.endTimer();
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

function sendScore( socket, score )
{
	io.sendSingleMessage( socket, 'score', score );
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
Game.prototype.getHexLines = getHexLines;
Game.prototype.checkIfScored = checkIfScored;
Game.prototype.checkIfLinesExist = checkIfLinesExist;
Game.prototype.incrementScore = incrementScore;
Game.prototype.destroy = destroy;
Game.prototype.disconnectPlayer = disconnectPlayer;
Game.prototype.endGame = endGame;
Game.prototype.sendGameScore = sendGameScore;
Game.prototype.sendIdentifiers = sendIdentifiers;

function gameAuthListener( socket ) {
	var token = socket.store.data.token;
	console.log( 'token = ' + token );
	if( token != undefined && waitingGames[ token ] != undefined ) {
		socket.game = waitingGames[ token ].game;
		waitingGames[ token ].game.connectPlayer( socket );
		socket.on('disconnect', function() {
			socket.game.disconnectPlayer();
		});
	} else {
		sendToChat( socket );
	}
}

function setLoggedIn( name, id, token, socket ) {
	socket.set('token', token, function() {
		socket.set('userid', id, function() {
			socket.set('name', name, function() {
				socket.emit('ok', {'error': 0});
				gameAuthListener( socket );
			});
		});
	});
}

function addGame( socket, game, date ) {
	waitingGames[ socket.store.data.token ] = { 'game':game, 'date': date };
}


exports.Game = Game;
exports.setLoggedIn = setLoggedIn;
exports.addGame = addGame;

