var gameName = 'http://' + window.location.host + '/game';
var gameSocket = io.connect( gameName );

var TURN_TIME = 15;
var turnClock = null;
var clock = 0;
var turn;

function startClock( time ) {
	clock = time;
	writeClock();
	turnClock = setTimeout( tick, 1000 ); 
}

function writeClock() {
	document.getElementById('timer').innerHTML = clock;
}

function tick() {
	clock--;
	if( clock > 0 )
	{
		writeClock();
		turnClock = setTimeout( tick, 1000 ); 
	} else {
		stopClock();
	}
}

function stopClock() {
	clearTimeout( turnClock );
	document.getElementById('timer').innerHTML = '';
}

function writeTurn( player ) {
	if( player == 1 ) {
		document.getElementById('turn').innerHTML = decodeURIComponent("Твой ход е");
	} else if( player == 2 ) {
		document.getElementById('turn').innerHTML = "Противников ход е";
	}
}

gameSocket.on('connect', function () {
	var token = getCookie("Dots-of-Diamonds");
	if(token != undefined)
	{
		gameSocket.emit('auth', {'token': token});
		gameSocket.on('ok', function (data) {
			if( data != undefined && data.error != undefined && data.error == 0) {
				addGameListeners();
			}
		});
	}
});

function sendMove( move ) {
	gameSocket.emit( 'move', move );
}

var gameListenersAdded = false;
function addGameListeners() {
	if( gameListenersAdded )
	{
		return;
	}
	
	gameSocket.on( 'queueing', function () {
		document.getElementById('message').innerHTML = 'Waiting for your opponent to connect';
	});
	
	gameSocket.on( 'move', function ( data ) {
		if( data != undefined ) {
			if( data.x != undefined && data.y != undefined && data.line != undefined && data.player != undefined )
			{
				takeAndLine( data.x, data.y, data.line, data.player );
			}
		}		
	});
	
	gameSocket.on( 'gameStart', function () {
		fieldArray( 6 );
		field( 2 );
		document.getElementById('message').innerHTML = '';
	});
	
	gameSocket.on( 'turnAck', function () {
		writeTurn( 1 );
		turn = 1;
		startClock( TURN_TIME );
	});
	gameSocket.on( 'wait', function () {
		writeTurn( 2 );
		turn = 2;
	});
	gameSocket.on( 'gameEnd', function (data) {
		if( data != undefined )
		{
			if( data.winner != undefined )
			{
				//TODO displayWinner();
				//TODO display back to chat button
			}
		}
	});
	gameSocket.on( 'back', function () {
		window.location = '/chat';
	});
	
	gameListenersAdded = true;
}

function getAndSendMove(e) {
	console.log( e );
	if( e != undefined && e.button != undefined && e.button == 0 ) 
	{
		getMouseXY(e);
		dotxy();
		var move = whereInHex( ratx, raty );
		if( move.line != -1 && move.x != -1 && move.y != -1 && turn == 1)
		{
			sendMove( move );
			stopClock();
		}
	}
}


var draw_x,draw_y,hex_counter,hex_length,i,j,hex_height,hex_width,player,switching,d,a,b,c,ratx,raty,dotx,doty,k,t,in_side_of_hex,line,hexarray,
	p1,p2,hotseat=false;

function clearField() {
	var canvas = document.getElementById("dots_game");
	canvas.width = canvas.width;
	draw_x=0,draw_y=0,hex_counter=0,hex_length=0,i=0,j=0,hex_height=0,hex_width=0,player=1,player1_points=0,player2_points=0,switching=0,
	d=0,a=0,b=0,c=0,ratx=0,raty=0,dotx=0,doty=0,k=0,t=0,in_side_of_hex=0,line=0;
}

function Player(color){
	this.color=color;
	this.points=0;
}

//iz4ertavane ne igralnoto pole
function field(size){
	clearField();
	
	var c=document.getElementById("dots_game");
	var width=document.getElementById("dots_game").width;
	var height=document.getElementById("dots_game").height;
	var bo=c.getContext("2d");
	bo.lineWidth=3;
	bo.lineCap = 'round';
	bo.strokeStyle="#c0c0c0";
	hex_counter=size*2 + 2;
	hexParameters(width,height);
	draw_y=hex_height;
	for(i=0;i<(hex_counter/2);i++){
		drawRow(bo);
		draw_y+=hex_height;
	}
	for(i=0;i<(hex_counter/2-1);i++){
		j=(1+i)*(2*hex_length+2*hex_height);
		d=2*hex_counter*hex_width+hex_width;
		bo.moveTo(d,j);
		bo.lineTo(d-hex_width,j+hex_height)
	}
	draw_x=hex_width;
	draw_y=(hex_counter/2)*(2*hex_length+2*hex_height);
	bo.moveTo(draw_x,draw_y);
	draw_W(bo);
	bo.moveTo(0,hex_height);
	bo.stroke();
	bo.closePath();
	
	p1=new Player('#00FF00');
	p2=new Player('#FF0000');
	bo.lineWidth=3;
	return hex_counter,p1,p2;
}

function drawRow(bo){
	draw_x=0;
	bo.moveTo(draw_x,draw_y);
	draw_M(bo);
	draw_y+=hex_length;
	draw_II(bo);
	draw_x=0;
	bo.moveTo(draw_x,draw_y);
	draw_x+=hex_width;draw_y+=hex_height;
	bo.lineTo(draw_x,draw_y);
	draw_M(bo);
	draw_y+=hex_length;
	draw_II(bo);
	bo.moveTo(hex_width,draw_y);
}

function draw_M(bo){
	for(j=0;j<hex_counter;j+=1){
		draw_x+=hex_width;draw_y-=hex_height;
		bo.lineTo(draw_x,draw_y);
		draw_x+=hex_width;draw_y+=hex_height;
		bo.lineTo(draw_x,draw_y);
	}
	draw_x-=(2*hex_width*hex_counter);
}
function draw_II(bo){
	for(j=0;j<(hex_counter+1);j+=1){
		draw_y-=hex_length;
		bo.moveTo(draw_x,draw_y);
		draw_y+=hex_length;
		bo.lineTo(draw_x,draw_y);
		draw_x+=2*hex_width;
	}
	draw_x-=(2*hex_width*hex_counter);
}
function draw_W(bo){
	for(j=0;j<hex_counter;j+=1){
		draw_x+=hex_width;draw_y+=hex_height;
		bo.lineTo(draw_x,draw_y);
		draw_x+=hex_width;draw_y-=hex_height;
		bo.lineTo(draw_x,draw_y);
	}
}
//krai na izchertavaneto na igralnoto pole

function hex(){
	this.line1=false;
	this.line2=false;
	this.line3=false;
	this.line4=false;
	this.line5=false;
	this.line6=false;
	this.side1=false;
	this.side2=false;
	this.side3=false;
	this.side4=false;
	this.side5=false;
	this.side6=false;
}

var IE = document.all?true:false;
if (!IE) document.captureEvents(Event.MOUSEMOVE);

function dotxy(){
	dotx=k*hex_width*2+hex_width;
	if(t%2!=0){
		dotx+=hex_width;
	}
	doty=t*(hex_height+hex_length)+hex_height+hex_length/2;
}

function fieldArray(hex_counter){
	hexarray=new Array(hex_counter);
	for(i=0;i<hex_counter;i++){
		hexarray[i]=new Array(hex_counter);
		for(j=0;j<hex_counter;j++){
				hexarray[i][j]=new hex();
		}
	}
}

function mouseInHex(ratx,raty){
	t=raty/(hex_height+hex_length);
	t=Math.floor(t);
	if(t%2==1){
		k=(ratx+hex_width)/(2*hex_width);
		k--;
	}else{
	k=ratx/(2*hex_width);
	}
	k=Math.floor(k);
}

function whereInHex(ratx,raty){
	s=Math.floor(ratx/hex_width);
	mouseInHex(ratx,raty);
	dotxy();
	in_side_of_hex=Math.floor(ratx/hex_width);
	if(raty<doty-Math.floor(hex_length/2)){
		if(isItIn1()){
			line=1;i=k;j=t;
		}else
		if(in_side_of_hex%2==1){
			t--;
			dotxy();
			if(isItIn4()){
				line=4;i=k;j=t;
			}
		}else{
			if(t%2==1){
				t--;k++;
				dotxy();
				if(isItIn4()){
					line=4;i=k;j=t;
				}
			}
			if(t%2==1){
				t--;k--;
				dotxy();
				if(isItIn4()){
					line=4;i=k;j=t;
				}
			}
		}
	}	
	if(isItIn1()){
		line=1;i=k;j=t;
	}else
	if(isItIn2()){
		line=2;i=k;j=t;
	}else
	if(isItIn3()){
		line=3;i=k;j=t;
	}else
	if(isItIn4()){
		line=4;i=k;j=t;
	}else
	if(isItIn5()){
		line=5;i=k;j=t;
	}else
	if(isItIn6()){
		line=6;i=k;j=t;
	} else {
		line = -1; i = -1; j = -1;
	}
	return { 'x':i, 'y':j, 'line':line };
}

function takeAndLine(f,g,h,l){
	k=f;t=g;i=f;j=g;line=h;player=l;
	var g=document.getElementById("dots_game");
	var width=document.getElementById("dots_game").width;
	var height=document.getElementById("dots_game").height;
	var bo=g.getContext("2d");
	bo.beginPath();
	if(player==1){
		bo.strokeStyle=p1.color;
		console.log( p1 );
		bo.fillStyle=p1.color;
	}else if(player==2){
		bo.strokeStyle=p2.color;
		bo.fillStyle=p2.color;
	}
	hexParameters(width,height);
	s=Math.floor(ratx/hex_width);
	dotxy();
	
	theLine(bo);
	
	fillTaken(bo);
	if(switching){
		switchPlayer();
		if(player==1){
			p1.points+=switching;
		}else{
			p2.points+=switching;
		}
		if(p1.points+p2.points==hex_counter*hex_counter*3){
			console.log("player1: " + player1_points)
			console.log("player2: " + player2_points)
		}
		switching=0;
	}
	
	bo.stroke();
	bo.closePath();
	
	return player;
}

//funkciq da chertae cherti
function drawLine(e){
	if (hexarray == undefined){
		console.log("no hexfield");
		return;
	}
	getMouseXY(e);	
	
	mouseInHex(ratx,raty);
	dotxy();
			
	
	var g=document.getElementById("dots_game");
	var width=document.getElementById("dots_game").width;
	var height=document.getElementById("dots_game").height;
	var bo=g.getContext("2d");
	bo.beginPath();
	if(player==1){
		bo.strokeStyle=p1.color;
		bo.fillStyle=p1.color;
	}else if(player==2){
		bo.strokeStyle=p2.color;
		bo.fillStyle=p2.color;
	}
	hexParameters(width,height);
	whereInHex(ratx,raty);
	bo.moveTo(dotx,doty);
	
	theLine(bo);
	
	fillTaken(bo);
	if(switching){
		switchPlayer();
		if(player==1){
			p1.points+=switching;
		}else{
			p2.points+=switching;
		}
		if(p1.points+p2.points==hex_counter*hex_counter*3){
			console.log("player1: " + p1.points)
			console.log("player2: " + p2.points)
		}
		switching=0;
	}
	
	bo.stroke();
	bo.closePath();
	
	return player;
}

function theLine(bo){
	if(i>=0 && j>=0 && i<=hex_counter-1 && j<=hex_counter-1){
		bo.moveTo(dotx,doty);
		switch(line){
		case 1:{
			if(hexarray[i][j].line1!=true){
				hexarray[i][j].line1=true;	
				bo.lineTo(dotx,doty-hex_height-hex_length/2);
				switchPlayer();
			}
			break;
		}
		case 2:{
			if(hexarray[i][j].line2!=true){
				hexarray[i][j].line2=true;	
				bo.lineTo(dotx-hex_width,doty-hex_length/2);
				switchPlayer();
			}
			break;
		}	
		case 3:{
			if(hexarray[i][j].line3!=true){
				hexarray[i][j].line3=true;	
				bo.lineTo(dotx-hex_width,doty+hex_length/2);
				switchPlayer();
			}
			break;
		}
		case 4:{
			if(hexarray[i][j].line4!=true){
				hexarray[i][j].line4=true;	
				bo.lineTo(dotx,doty+hex_height+hex_length/2);
				switchPlayer();
			}
			break;
		}	
		case 5:{
			if(hexarray[i][j].line5!=true){
				hexarray[i][j].line5=true;	
				bo.lineTo(dotx+hex_width,doty+hex_length/2);
				switchPlayer();
			}
			break;
		}
		case 6:{
			if(hexarray[i][j].line6!=true){
				hexarray[i][j].line6=true;	
				bo.lineTo(dotx+hex_width,doty-hex_length/2);
				switchPlayer();
			}
			break;
		}	
		}
		bo.stroke();
	}	
}

//funkciq da zapulva rombche
function fillTaken(bo){
	switch(line){
	case 1:{
		if(doesItGet1()){
			fillRomboid1(bo);
		}
		if(doesItGet6()){
			fillRomboid6(bo);
		}
		break;
	}
	case 2:{
		if(doesItGet1()){
			fillRomboid1(bo);
		}
		if(doesItGet2()){
			fillRomboid2(bo);
		}
		break;
	}	
	case 3:{
		if(doesItGet3()){
			fillRomboid3(bo);
		}
		if(doesItGet2()){
			fillRomboid2(bo);
		}
		break;
	}
	case 4:{
		if(doesItGet3()){
			fillRomboid3(bo);
		}
		if(doesItGet4()){
			fillRomboid4(bo);
		}
		break;
	}	
	case 5:{
		if(doesItGet5()){
			fillRomboid5(bo);
		}
		if(doesItGet4()){
			fillRomboid4(bo);
		}
		break;
	}
	case 6:{
		if(doesItGet5()){
			fillRomboid5(bo);
		}
		if(doesItGet6()){
			fillRomboid6(bo);
		}
		break;
	}	
	}
	
}




//AI
//ELO




//pomoshtni funkcii nadolu
function doesItGet1(){
	if(j!=0){
		if(j%2==1){
			if(hexarray[i][j].line1==true 
			&& hexarray[i][j].line2==true 
			&& hexarray[i][j-1].line4==true 
			&& hexarray[i][j-1].line5==true 
			&& hexarray[i][j].side1==false){
				return true;
			}
		}else{
			if(i!=0 
			&& hexarray[i][j].line1==true 
			&& hexarray[i][j].line2==true 
			&& hexarray[i-1][j-1].line4==true 
			&& hexarray[i-1][j-1].line5==true 
			&& hexarray[i][j].side1==false){
				return true;
			}else
			if(i==0
			&& hexarray[i][j].line1==true 
			&& hexarray[i][j].line2==true 
			&& hexarray[hex_counter-1][j-1].line4==true 
			&& hexarray[hex_counter-1][j-1].line5==true 
			&& hexarray[i][j].side1==false){
				return true;
			}
		}
	}else{
		if(i==0 
		&& hexarray[i][j].line1==true 
		&& hexarray[i][j].line2==true 
		&& hexarray[hex_counter-1][hex_counter-1].line4==true 
		&& hexarray[hex_counter-1][hex_counter-1].line5==true 
		&& hexarray[i][j].side1==false){
			return true;
		}else{
			if(i!=0 
			&& hexarray[i][j].line1==true 
			&& hexarray[i][j].line2==true 
			&& hexarray[i-1][hex_counter-1].line4==true 
			&& hexarray[i-1][hex_counter-1].line5==true 
			&& hexarray[i][j].side1==false){
				return true;
			}
		}	
	}
	return false;
}

function doesItGet2(){
	if(i!=0){
		if(hexarray[i][j].line2==true 
		&& hexarray[i][j].line3==true 
		&& hexarray[i-1][j].line5==true 
		&& hexarray[i-1][j].line6==true 
		&& hexarray[i][j].side2==false){
			return true;
		}	
	}else{
		if(hexarray[i][j].line2==true 
		&& hexarray[i][j].line3==true 
		&& hexarray[hex_counter-1][j].line5==true 
		&& hexarray[hex_counter-1][j].line6==true 
		&& hexarray[i][j].side2==false){
			return true;
		}	
	}
	return false;	
}

function doesItGet3(){
	if(j!=hex_counter-1){
		if(j%2==1){
			if(hexarray[i][j].line3==true 
			&& hexarray[i][j].line4==true 
			&& hexarray[i][j+1].line1==true 
			&& hexarray[i][j+1].line6==true 
			&& hexarray[i][j].side3==false){
				return true;
			}
		}else{
			if(i!=0 
			&& hexarray[i][j].line3==true 
			&& hexarray[i][j].line4==true 
			&& hexarray[i-1][j+1].line1==true 
			&& hexarray[i-1][j+1].line6==true 
			&& hexarray[i][j].side3==false){
				return true;
			}else{
				if(i==0 
				&& hexarray[i][j].line3==true 
				&& hexarray[i][j].line4==true 
				&& hexarray[hex_counter-1][j+1].line1==true 
				&& hexarray[hex_counter-1][j+1].line6==true 
				&& hexarray[i][j].side3==false){
					return true;
				}
			}
		}
	}else{
		if(hexarray[i][j].line3==true 
		&& hexarray[i][j].line4==true 
		&& hexarray[i][0].line1==true 
		&& hexarray[i][0].line6==true 
		&& hexarray[i][j].side3==false){
			return true;
		}
	}
	return false;	
}

function doesItGet4(){
	if(j!=hex_counter-1){
		if(j%2==1){
			if(i!=hex_counter-1){ 
				if(hexarray[i][j].line4==true 
				&& hexarray[i][j].line5==true 
				&& hexarray[i+1][j+1].line1==true 
				&& hexarray[i+1][j+1].line2==true 
				&& hexarray[i][j].side4==false){
					return true;
				}
			}else{
				if(hexarray[i][j].line4==true 
				&& hexarray[i][j].line5==true 
				&& hexarray[0][j+1].line1==true 
				&& hexarray[0][j+1].line2==true 
				&& hexarray[i][j].side4==false){
					return true;
				}
			}
		}else{
			if(hexarray[i][j].line4==true 
			&& hexarray[i][j].line5==true 
			&& hexarray[i][j+1].line1==true 
			&& hexarray[i][j+1].line2==true 
			&& hexarray[i][j].side4==false){
				return true;
			}
		}
	}else{
		if(i!=hex_counter-1){
			if(hexarray[i][j].line4==true 
			&& hexarray[i][j].line5==true 
			&& hexarray[i+1][0].line1==true 
			&& hexarray[i+1][0].line2==true 
			&& hexarray[i][j].side4==false){
				return true;
			}
		}else{
			if(hexarray[i][j].line4==true 
			&& hexarray[i][j].line5==true 
			&& hexarray[0][0].line1==true 
			&& hexarray[0][0].line2==true 
			&& hexarray[i][j].side4==false){
				return true;
			}
		}
	}
	return false;	
}

function doesItGet5(){
	if(i!=hex_counter-1){
		if(hexarray[i][j].line5==true 
		&& hexarray[i][j].line6==true 
		&& hexarray[i+1][j].line2==true 
		&& hexarray[i+1][j].line3==true 
		&& hexarray[i][j].side5==false){
			return true;
		}	
	}else{
		if(hexarray[i][j].line5==true 
		&& hexarray[i][j].line6==true 
		&& hexarray[0][j].line2==true 
		&& hexarray[0][j].line3==true 
		&& hexarray[i][j].side5==false){
			return true;
		}
	}
	return false;		
}

function doesItGet6(){
	if(j!=0){
		if(j%2==1){
			if(i!=hex_counter-1){
				if(hexarray[i][j].line1==true 
				&& hexarray[i][j].line6==true 
				&& hexarray[i+1][j-1].line4==true 
				&& hexarray[i+1][j-1].line3==true 
				&& hexarray[i][j].side6==false){
					return true;
				}
			}else{
				if(hexarray[i][j].line1==true 
				&& hexarray[i][j].line6==true 
				&& hexarray[0][j-1].line4==true 
				&& hexarray[0][j-1].line3==true 
				&& hexarray[i][j].side6==false){
					return true;
				}
			}
		}else{
			if(hexarray[i][j].line1==true 
			&& hexarray[i][j].line6==true 
			&& hexarray[i][j-1].line3==true 
			&& hexarray[i][j-1].line4==true 
			&& hexarray[i][j].side6==false){
				return true;
			}
		}
	}else{
		if(hexarray[i][j].line1==true 
		&& hexarray[i][j].line6==true 
		&& hexarray[i][hex_counter-1].line3==true 
		&& hexarray[i][hex_counter-1].line4==true 
		&& hexarray[i][j].side6==false){
			return true;
		}
	}
	return false;	
}

function fill1(bo){
	dotxy();
	hexarray[k][t].side1=true;
	bo.moveTo(dotx,doty);
	bo.lineTo(dotx-hex_width,doty-hex_length/2);
	bo.lineTo(dotx,doty-hex_length/2-hex_height);
	bo.fill();
}

function fill2(bo){
	dotxy();
	hexarray[k][t].side2=true;
	bo.moveTo(dotx,doty);
	bo.lineTo(dotx-hex_width,doty-hex_length/2);
	bo.lineTo(dotx-hex_width,doty+hex_length/2);
	bo.fill();
}

function fill3(bo){
	dotxy();
	hexarray[k][t].side3=true;
	bo.moveTo(dotx,doty);
	bo.lineTo(dotx-hex_width,doty+hex_length/2);
	bo.lineTo(dotx,doty+hex_length/2+hex_height);
	bo.fill();
}

function fill4(bo){
	dotxy();
	hexarray[k][t].side4=true;
	bo.moveTo(dotx,doty);
	bo.lineTo(dotx+hex_width,doty+hex_length/2);
	bo.lineTo(dotx,doty+hex_length/2+hex_height);
	bo.fill();
}

function fill5(bo){
	dotxy();
	hexarray[k][t].side5=true;
	bo.moveTo(dotx,doty);
	bo.lineTo(dotx+hex_width,doty-hex_length/2);
	bo.lineTo(dotx+hex_width,doty+hex_length/2);
	bo.fill();
}

function fill6(bo){
	dotxy();
	hexarray[k][t].side6=true;
	bo.moveTo(dotx,doty);
	bo.lineTo(dotx+hex_width,doty-hex_length/2);
	bo.lineTo(dotx,doty-hex_length/2-hex_height);
	bo.fill();
}

function fillRomboid1(bo){
	fill1(bo);
	if(j!=0){
		if(i!=0){
			t--;
			if(j%2==1){
				fill4(bo);
			}else{
				k--;
				fill4(bo);
				k++;
			}
			t++;
			switching++;
		}else{
			t--;
			if(j%2==1){
				fill4(bo);
			}else{
				k=hex_counter-1;
				fill4(bo);
				k=0;
			}
			t++;
			switching++;
		}
	}else{
		if(i!=0){
			t=hex_counter-1;
			k--;
			fill4(bo);
			k++;
			t=0;
			switching++;
		}else{
			t=hex_counter-1;
			k=hex_counter-1;
			fill4(bo);
			k=0;
			t=0;
			switching++;
		}
	}
}

function fillRomboid2(bo){
	fill2(bo);
	if(i!=0){
		k--;
		fill5(bo);
		k++;
		switching++;
	}else{
		k=hex_counter-1;
		fill5(bo);
		k=0;
		switching++;
	}
}

function fillRomboid3(bo){
	fill3(bo);
	if(j!=hex_counter-1){
		if(i!=0){
			t++;
			if(j%2==1){
				fill6(bo);
			}else{
				k--;
				fill6(bo);
				k++;
			}
			t--;
			switching++;
		}else{
			t++;
			if(j%2==1){
				fill6(bo);
			}else{
				k=hex_counter-1;
				fill6(bo);
				k=0;
			}
			t--;
			switching++;
		}
	}else{
		t=0;
		fill6(bo);
		t=hex_counter-1;
		switching++;
	}
}

function fillRomboid4(bo){
	fill4(bo);
	if(j!=hex_counter-1){
		if(i!=hex_counter-1){
			t++;
			if(j%2==1){
				k++;
				fill1(bo);
				k--;
			}else{
				fill1(bo);
			}
			t--;
			switching++;
		}else{
			t++;
			if(j%2==1){
				k=0;
				fill1(bo);
				k=hex_counter-1;
			}else{
				fill1(bo);
			}
			t--;
			switching++;
		}
	}else{
		if(i!=hex_counter-1){
			t=0;
			k++;
			fill1(bo);
			k--;
			t=hex_counter-1;
			switching++;
		}else{
			t=0;
			k=0;
			fill1(bo);
			k=hex_counter-1;
			t=hex_counter-1;
			switching++;
		}
	}
}

function fillRomboid5(bo){
	fill5(bo);
	if(i!=hex_counter-1){
		k++;
		fill2(bo);
		k--;
		switching++;
	}else{
		k=0;
		fill2(bo);
		k=hex_counter-1;
		switching++;
	}
}

function fillRomboid6(bo){
	fill6(bo);
	if(j!=0){
		if(i!=hex_counter-1){
			t--;
			if(j%2==1){
				k++;
				fill3(bo);
				k--;
			}else{
				fill3(bo);
			}
			t++;
			switching++;
		}else{
			t--;
			if(j%2==1){
				k=0;
				fill3(bo);
				k=hex_counter-1;
			}else{
				fill3(bo);
			}
			t++;
			switching++;
		}
	}else{
		t=hex_counter-1;
		fill3(bo);
		t=0;
		switching++;
	}
}

function switchPlayer(){
	if(hotseat){
		if(player==1){
			player=2;
		}else if(player==2){
			player=1;
		}
	}
}

function isItIn1(){
	if(ratx>=Math.floor(dotx-hex_width/5)
	&& ratx<=Math.floor(dotx+hex_width/5)
	&& raty>=Math.floor(doty-hex_length/2-hex_height*4/5) 
	&& raty<=Math.floor(doty-1)){		
		return true;
	}
	return false;
}
function isItIn2(){
	if(ratx>=(Math.floor(dotx-hex_width+1)) 
	&& ratx<=(Math.floor(dotx-hex_width/5-1)) 
	&& raty>=(Math.floor(doty-hex_length/2+1)) 
	&& raty<=(Math.floor(doty-1))){
		return true;
	}
	return false;
}
function isItIn3(){
	if(ratx>=Math.floor(dotx-hex_width+1) 
	&& ratx<=Math.floor(dotx-hex_width/5-1) 
	&& raty>=Math.floor(doty+1) 
	&& raty<=Math.floor(doty+hex_length/2-1)){
		return true;
	}
	return false;
}
function isItIn4(){
	if(ratx>=Math.floor(dotx-hex_width/5) 
	&& ratx<=Math.floor(dotx+hex_width/5) 
	&& raty>=Math.floor(doty+1) 
	&& raty<=Math.floor(doty+hex_length/2+hex_height*4/5)){
		return true;
	}
	return false;
}
function isItIn5(){
	if(ratx>=Math.floor(dotx+hex_width/5+1) 
	&& ratx<=Math.floor(dotx+hex_width-1) 
	&& raty>=Math.floor(doty+1) 
	&& raty<=Math.floor(doty+hex_length/2-1)){
		return true;
	}
	return false;
}
function isItIn6(){
	if(ratx>=Math.floor(dotx+hex_width/5+1) 
	&& ratx<=Math.floor(dotx+hex_width-1) 
	&& raty>=Math.floor(doty-hex_length/2+1) 
	&& raty<=Math.floor(doty-1)){
		return true;
	}
	return false;
}

function getMouseXY(e) {
	if (hexarray == undefined){
		return;
	}
	var ev = e || window.event || window.Event;
	if (IE) {
		ratx = ev.clientX + document.body.scrollLeft;
		raty = ev.clientY + document.body.scrollTop;
	} else {
		ratx = ev.pageX;
		raty = ev.pageY;
	}
	
	var canvas = document.getElementById('dots_game');
	
	ratx -= canvas.offsetLeft;
	raty -= canvas.offsetTop;
	var str = 'X = ' + ratx + ' Y = ' + raty;
	
	document.getElementById('coords').innerHTML = str;
}

function hexParameters(width,height) {
	hex_width=width/(2*hex_counter+1);
	hex_width=Math.floor(hex_width);
	
	a=(2*hex_counter+1);
	b=(-(2*height+2*hex_counter*height));
	c=(height*height-hex_width*hex_width*hex_counter*hex_counter)
	
	d=b*b - 4*a*c;
	
	hex_height=(-b-Math.sqrt(d))/(2*a);
	hex_height=Math.floor(hex_height);
	
	hex_length=(height-hex_height-hex_counter*hex_height)/hex_counter;
	hex_length=Math.floor(hex_length);		
}
