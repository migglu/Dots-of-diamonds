var io = require('./socket');
var users = {}; // userid => socket
var db = require( './database' );
var game = require( './game' );


function sendError( sender, socket ) { //unused
	io.sendSingleMessage( sender, 'gameError', {} );
}

function inGame( sender, id ) {
	io.sendSingleMessage( sender, 'inGame', { 'id':id } );
}

function sendDenied( sender, id ) {
	io.sendSingleMessage( sender, 'gameDenied', { 'id':id } );
}

function sendToGame( reciever, id ) {
	io.sendSingleMessage( reciever, 'gameAccepted', { 'id': id} );
}

function sendGameInvite( reciever, id )
{
	io.sendSingleMessage( reciever, 'gameInvite', { 'id':id } );
}

function sendInvite( sender, reciever ) {
	var fok = function ( socket ) {
		var id = sender.store.data.userid;
		if( sender.invites == undefined ) {
			sender.invites = new Array();
		}
		if( sender.invites.indexOf( socket ) == -1 ) {
			users[id] = sender;
			sender.invites.push( socket );
			sendGameInvite( socket, id );
			addResponseListener( socket );
		}
	}
	var ffail = function () {
		var id = sender.store.data.userid;
		inGame( sender, id );
	}
	db.inGame( reciever, fok, ffail );
}

function createAndAddGame( socket1, socket2 ) {
	var currentGame = new game.Game();
	var date = new Date();
	game.addGame( socket1, currentGame, date );
	game.addGame( socket2, currentGame, date );
}

function addResponseListener( socket ) {
	socket.on( 'gameAccept', function( data ) {
		if( data.id != undefined ) {
			var player1 = users[ data.id ];
			if( player1 != undefined ) {
				if( player1.invites.indexOf( socket ) > -1) {
					for( var invalidInvited in player1.invites ) {
						if( player1.invites[ invalidInvited ] != socket ) {
							inGame( player1.invites[ invalidInvited ], socket.store.data.userid );
						}
					}
					createAndAddGame( player1, socket );
					sendToGame( player1, data.id );
					sendToGame( socket, data.id );
					delete users[ data.id ];
				}
			}
		}
	});
	
	socket.on( 'gameDenied', function( data ) {
		if( data.id != undefined ) {
			var player1 = users[ data.id ];
			if( player1 != undefined ) {
				var number = -1;
				if( ( number = player1.invites.indexOf( socket ) ) > -1) {
					sendDenied( player1, socket.store.data.userid );
					delete player1.invites[ number ];
				}
			}
		}
	});
}

exports.sendInvite = sendInvite;
