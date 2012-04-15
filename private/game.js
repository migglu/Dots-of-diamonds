var io = require('./socket');
var db = require('./database');

function addGameListeners(socket, game) {
	socket.set('game', game);
	socket.on('move', function (data) {
		if(data.x != undefined && data.y != undefined && data.line != undefined) {
			socket.store.data.game.playTurn(socket, data.x, data.y, data.line);
		}
	});
}

function Game(socket1, socket2) {
	this.player1 = socket1;
	this.player2 = socket2;
	this.p1id = -1;
	this.p2id = -1;
	this.id = -1;
	this.turn = this.player1;
	this.waiting = this.player2;
	this.timer = null;
	this.timeDelay = 15000;
	this.end = false;
	this.winner = null;
	this.turns = [];
}

function sendMove(move) {
	this.waiting.emit('move', {'move':move});
}

function playTurn(player, x, y, line) {
	if(this.turn == player) {
		var move = {'x': x, 'y': y, 'line': line};
		this.sendMove(move);
		this.turns.push(move);
		this.nextTurn();
	}
}

function initialize() {
	this.p1id = this.player1.store.data.userid;
	this.p2id = this.player2.store.data.userid;
	
	db.initGame(this.p1id, this.p2id, this.setIdAndBeginGame);
}

function beginGame(id) {
	this.setId(id);
	this.addGameListeners(this.player1);
	this.addGameListeners(this.player2);
	this.startTimer();
}

function setId(id) {
	this.id = id;
}

function startTimer() {
	io.sendTurn(this.turn);
	io.sendWait(this.waiting);
	this.timer = setTimeout(this.timeDelay, this.nextTurn);
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
	}
}

function switchTurn() {
	var oldTurn = this.turn;
	this.turn = this.waiting;
	this.waiting = oldTurn;
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


exports.Game = Game;

