var x=0,y=0,hex_counter=0,hex_length=0,i=0,j=0,hex_height=0,hex_width=0,
	d=0,a=0,b=0,c=0,ratx=0,raty=0,dotx=0,doty=0,k=0,t=0,in_side_of_hex=0,line=0,hexarray;

function clearField() {
	var canvas = document.getElementById("dots_game");
	canvas.width = canvas.width;
}	

//iz4ertavane ne igralnoto pole
function field(size){
	clearField();
	
	var c=document.getElementById("dots_game");
	var width=document.getElementById("dots_game").width;
	var height=document.getElementById("dots_game").height;
	var bo=c.getContext("2d");
	bo.fillStyle="#000000";
	switch(size){
	case 1:{
		hex_counter=6;
		break;	
	}
	case 2:{
		hex_counter=10;
		break;
	}
	case 3:{hex_counter=16;
		break;
	}
	}	
	whl(hex_counter,width,height);
	y=hex_height;
	for(i=0;i<(hex_counter/2);i++){
		drawRow(hex_counter,hex_length,hex_height,hex_width,x,y,bo);
		y+=2*hex_length+2*hex_height;
	}
	for(i=0;i<(hex_counter/2-1);i++){
		j=(1+i)*(2*hex_length+2*hex_height);
		d=2*hex_counter*hex_width+hex_width;
		bo.moveTo(d,j);
		bo.lineTo(d-hex_width,j+hex_height)
	}
	x=hex_width;
	y=(hex_counter/2)*(2*hex_length+2*hex_height);
	bo.moveTo(x,y);
	III(hex_counter,hex_length,hex_height,hex_width,x,y,bo);
	bo.moveTo(0,hex_height);
	bo.stroke();
	bo.closePath();
	
	return hex_counter;
}

function drawRow(hex_counter,hex_length,hex_height,hex_width,x,y,bo){
	x=0;
	bo.moveTo(x,y);
	I(hex_counter,hex_length,hex_height,hex_width,x,y,bo);
	y+=hex_length;
	II(hex_counter,hex_length,hex_height,hex_width,x,y,bo);
	x=0;
	bo.moveTo(x,y);
	x+=hex_width;y+=hex_height;
	bo.lineTo(x,y);
	I(hex_counter,hex_length,hex_height,hex_width,x,y,bo);
	y+=hex_length;
	II(hex_counter,hex_length,hex_height,hex_width,x,y,bo);
	bo.moveTo(hex_width,y);
}

function I(hex_counter,hex_length,hex_height,hex_width,x,y,bo){
	for(j=0;j<hex_counter;j+=1){
		x+=hex_width;y-=hex_height;
		bo.lineTo(x,y);
		x+=hex_width;y+=hex_height;
		bo.lineTo(x,y);
	}
	x-=(2*hex_width*hex_counter);
}
function II(hex_counter,hex_length,hex_height,hex_width,x,y,bo){
	for(j=0;j<(hex_counter+1);j+=1){
		y-=hex_length;
		bo.moveTo(x,y);
		y+=hex_length;
		bo.lineTo(x,y);
		x+=2*hex_width;
	}
	x-=(2*hex_width*hex_counter);
}
function III(hex_counter,hex_length,hex_height,hex_width,x,y,bo){
	for(j=0;j<hex_counter;j+=1){
		x+=hex_width;y+=hex_height;
		bo.lineTo(x,y);
		x+=hex_width;y-=hex_height;
		bo.lineTo(x,y);
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
}

var IE = document.all?true:false;
if (!IE) document.captureEvents(Event.MOUSEMOVE);

function dotxy(){
	console.log('k = ' + k);
	console.log('t = ' + t);
	dotx=k*hex_width*2+hex_width;
	if(t%2!=0){
		dotx+=hex_width;
	}
	doty=t*(hex_height+hex_length)+hex_height+hex_length/2;
}

function fieldArray(hex_counter){
	hexarray=new Array(hex_counter);
	console.log(hex_counter);
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
	}else{
	k=ratx/(2*hex_width);
	}
	k=Math.floor(k);
}

function whereInHex(ratx,raty,dotx,doty){
	console.log('dotx = ' + dotx);
	console.log('doty = ' + doty);
	if(isItIn1(ratx,raty,dotx,doty)){
		line=1;i=k;j=t;
	}else
	if(isItIn2(ratx,raty,dotx,doty)){
		line=2;i=k;j=t;
	}else
	if(isItIn3(ratx,raty,dotx,doty)){
		line=3;i=k;j=t;
	}else
	if(isItIn4(ratx,raty,dotx,doty)){
		line=4;i=k;j=t;
	}else
	if(isItIn5(ratx,raty,dotx,doty)){
		line=5;i=k;j=t;
	}else
	if(isItIn6(ratx,raty,dotx,doty)){
		line=6;i=k;j=t;
	}
}

function mouseLine(ratx,raty){
	s=Math.floor(ratx/hex_width);
	dotxy();
	whereInHex(ratx,raty,dotx,doty);		
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
	
	var str = 'X = ' + ratx + ' Y = ' + raty;
	document.getElementById('click_coords').innerHTML = str;		
	
	var g=document.getElementById("dots_game");
	var width=document.getElementById("dots_game").width;
	var height=document.getElementById("dots_game").height;
	var bo=g.getContext("2d");
	bo.beginPath();
	bo.fillStyle="#000000";
	whl(hex_counter,width,height);
	mouseLine(ratx,raty,bo);
	bo.moveTo(dotx,doty);
	
	switch(line){
	case 1:{
		bo.lineTo(dotx,doty-hex_height-hex_length/2);
		hexarray[i][j].line1=true;	
		break;
	}
	case 2:{
		bo.lineTo(dotx-hex_width,doty-hex_length/2);
		hexarray[i][j].line2=true;	
		break;
	}	
	case 3:{
		bo.lineTo(dotx-hex_width,doty+hex_length/2);
		hexarray[i][j].line3=true;	
		break;
	}
	case 4:{
		bo.lineTo(dotx,doty+hex_height+hex_length/2);
		hexarray[i][j].line4=true;	
		break;
	}	
	case 5:{
		bo.lineTo(dotx+hex_width,doty+hex_length/2);
		hexarray[i][j].line5=true;	
		break;
	}
	case 6:{
		bo.lineTo(dotx+hex_width,doty-hex_length/2);
		hexarray[i][j].line6=true;	
		break;
	}	
	}
	
	bo.stroke();
	bo.closePath();
}




//funkciq da zapulva rombche

//AI
//ELO




//pomoshtni funkcii nadolu

function isItIn1(ratx,raty,dotx,doty){
	if(ratx>=Math.floor(dotx-hex_width/5)
	&& ratx<=Math.floor(dotx+hex_width/5)
	&& raty>=Math.floor(doty-hex_length/2-hex_height*4/5) 
	&& raty<=Math.floor(doty-1)
	&& hexarray[k][t].line1!=true){	
		console.log("in line 1");
		return true;
	}
	return false;
}
function isItIn2(ratx,raty,dotx,doty){
	if(ratx>=(Math.floor(dotx-hex_width+1)) 
	&& ratx<=(Math.floor(dotx-hex_width/5-1)) 
	&& raty>=(Math.floor(doty-hex_length/2+1)) 
	&& raty<=(Math.floor(doty-1))
	&& hexarray[k][t].line2!=true){
		console.log("in line 2");
		return true;
	}
	return false;
}
function isItIn3(ratx,raty,dotx,doty){
	if(ratx>=Math.floor(dotx-hex_width+1) 
	&& ratx<=Math.floor(dotx-hex_width/5-1) 
	&& raty>=Math.floor(doty+1) 
	&& raty<=Math.floor(doty+hex_length/2-1)
	&& hexarray[k][t].line3!=true){
		console.log("in line 3");
		return true;
	}
	return false;
}
function isItIn4(ratx,raty,dotx,doty){
	if(ratx>=Math.floor(dotx-hex_width/5) 
	&& ratx<=Math.floor(dotx+hex_width/5) 
	&& raty>=Math.floor(doty+1) 
	&& raty<=Math.floor(doty+hex_length/2+hex_height*4/5)
	&& hexarray[k][t].line4!=true){
		console.log("in line 4");
		return true;
	}
	return false;
}
function isItIn5(ratx,raty,dotx,doty){
	if(ratx>=Math.floor(dotx+hex_width/5+1) 
	&& ratx<=Math.floor(dotx+hex_width-1) 
	&& raty>=Math.floor(doty+1) 
	&& raty<=Math.floor(doty+hex_length/2-1)
	&& hexarray[k][t].line5!=true){
		console.log("in line 5");
		return true;
	}
	return false;
}
function isItIn6(ratx,raty,dotx,doty){
	if(ratx>=Math.floor(dotx+hex_width/5+1) 
	&& ratx<=Math.floor(dotx+hex_width-1) 
	&& raty>=Math.floor(doty-hex_length/2+1) 
	&& raty<=Math.floor(doty-1)
	&& hexarray[k][t].line6!=true){
		console.log("in line 6");
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
		console.log(ratx);
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

function whl(hex_counter,width,height){
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
