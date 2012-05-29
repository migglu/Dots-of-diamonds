var db = require('../private_cov/database');
var serverCreator = require('../private_cov/server');

function createServer( onRequest )
{
	return serverCreator.createServer( onRequest );
}

var orig_db = require( 'db-mysql' );
var sockets = require( 'socket.io' );
var offset = 200;

function incrementOffset( ) {
	offset += 100;
	return offset;
}

function testUndefinedArguments( beforeExit, assert ) {
	try{
		db.initGame( undefined, undefined, undefined );
	} catch (e) {
		assert.isNotNull( e );
	}
}

function testInitGame( beforeExit, assert ) {
	var passed = false;
	var callback = function(id) {
		passed = true;
		assert.ok( true );
	}
	
	db.initGame( 50, 47, callback);
	
	setTimeout( function() {
		db.resetLoggedIn();
	}, incrementOffset() );
    
	beforeExit( function () {
		assert.ok( passed );
	});
}

function testInGame( beforeExit, assert ) {
	var passed = false;
	var fakeSocket = {};
	fakeSocket.store = {};
	fakeSocket.store.data = {};
	fakeSocket.store.data.userid = 50;
	
	var fok = function( socket ) {
		assert.ok( socket );
		passed = true;
	}
	
	setTimeout( function() {
		db.inGame( fakeSocket, fok, fok );
	}, incrementOffset() );
	
	beforeExit( function() {
		assert.ok( passed );
	});
}

function testRegisterUser( beforeExit, assert ) {
	var user = 'testuser', mail='asdasd@asdasdasd.asdasd', pass='asdasd';
		
	var onRequest = function ( req, res ) {
		db.addUser( user, mail, pass, res, req );
	};
	
	var server = createServer( onRequest );
		
	setTimeout( function() {
		assert.response(server, {
			url: '/'
		}, function( res ) {
			db.deleteUser( user );
			assert.ok( res.body.indexOf('<p>Регистрацията е успешна! Благодаря :-)</p>') >= 0 );
		});
	}, incrementOffset() );
	
}


exports.testUndefinedArguments = testUndefinedArguments;
exports.testInitGame = testInitGame;
exports.testInGame = testInGame;
exports.testRegisterUser = testRegisterUser;
