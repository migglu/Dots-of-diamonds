var x=0,y=0,z=0,l=0,i=0,j=0,h=0,w=0,d=0,a=0,b=0,c=0,ratx=0,raty=0,dotx=0,doty=0,k=0,t=0,s=0,line=0;

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
		z=6;
		break;	
	}
	case 2:{
		z=10;
		break;
	}
	case 3:{z=16;
		break;
	}
	}	
	whl(z,width,height);
	y=h;
	for(i=0;i<(z/2);i++){
		drawRow(z,l,h,w,x,y,bo,i);
		y+=2*l+2*h;
	}
	for(i=0;i<(z/2-1);i++){
		j=(1+i)*(2*l+2*h);
		d=2*z*w+w;
		bo.moveTo(d,j);
		bo.lineTo(d-w,j+h)
	}
	x=w;
	y=(z/2)*(2*l+2*h);
	bo.moveTo(x,y);
	III(z,l,h,w,x,y,bo);
	bo.moveTo(0,h);
	bo.stroke();
	bo.closePath();
	
	return z;
}

function drawRow(z,l,h,w,x,y,bo,i){
	x=0;
	bo.moveTo(x,y);
	I(z,l,h,w,x,y,bo);
	y+=l;
	II(z,l,h,w,x,y,bo);
	x=0;
	bo.moveTo(x,y);
	x+=w;y+=h
	bo.lineTo(x,y);
	I(z,l,h,w,x,y,bo);
	y+=l;
	II(z,l,h,w,x,y,bo);
	bo.moveTo(w,y);
}

function I(z,l,h,w,x,y,bo,i){
	for(j=0;j<z;j+=1){
		x+=w;y-=h;
		bo.lineTo(x,y);
		x+=w;y+=h;
		bo.lineTo(x,y);
	}
	x-=(2*w*z);
}
function II(z,l,h,w,x,y,bo,i){
	for(j=0;j<(z+1);j+=1){
		y-=l;
		bo.moveTo(x,y);
		y+=l;
		bo.lineTo(x,y);
		x+=2*w;
	}
	x-=(2*w*z);
}
function III(z,l,h,w,x,y,bo,i){
	for(j=0;j<z;j+=1){
		x+=w;y+=h;
		bo.lineTo(x,y);
		x+=w;y-=h;
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

function fieldArray(){
	
}

var IE = document.all?true:false;
if (!IE) document.captureEvents(Event.MOUSEMOVE);

function dotxy(k,t){
	dotx=k*w*2+w;
	if(t%2!=0){
		dotx+=w;
	}
	doty=t*(h+l)+h+l/2;
}


function mouseInHex(ratx,raty){
	k=ratx/(2*w);
	k=Math.floor(k);
	t=raty/(h+l);
	t=Math.floor(t);
}

function whereInHex(ratx,raty,dotx,doty,k,t){
	if(isItIn1(ratx,raty,dotx,doty)){
		line=1;j=k;i=t;
	}else
	if(isItIn2(ratx,raty,dotx,doty)){
		line=2;j=k;i=t;
	}else
	if(isItIn3(ratx,raty,dotx,doty)){
		line=3;j=k;i=t;
	}else
	if(isItIn4(ratx,raty,dotx,doty)){
		line=4;j=k;i=t;
	}else
	if(isItIn5(ratx,raty,dotx,doty)){
		line=5;j=k;i=t;
	}else
	if(isItIn6(ratx,raty,dotx,doty)){
		line=6;j=k;i=t;
	}
}

function mouseLine(ratx,raty){
//	fieldArray();
	mouseInHex(ratx,raty);
	s=Math.floor(ratx/w);
	dotxy(k,t);
	whereInHex(ratx,raty,dotx,doty,k,t);		
}

//funkciq da chertae cherti
function drawLine(e){
	
//	fieldArray();
	
	var hexfield=new Array(z);
	console.log(z);
	for(i=0;i<z;i++){
		hexfield[i]=new Array(z);
		for(j=0;j<z;j++){
			hexfield[i][j]=new hex();
		}
	}
	
	getMouseXY(e);	
	
	var str = 'X = ' + ratx + ' Y = ' + raty;
	document.getElementById('click_coords').innerHTML = str;		
	
	var g=document.getElementById("dots_game");
	var width=document.getElementById("dots_game").width;
	var height=document.getElementById("dots_game").height;
	var bo=g.getContext("2d");
	bo.beginPath();
	bo.fillStyle="#000000";
	whl(z,width,height);
	mouseLine(ratx,raty,bo);
	bo.moveTo(dotx,doty);
	switch(line){
	case 1:{
		hexfield[i][j].line1=true;	
		bo.lineTo(dotx,doty-h-l/2);
		break;
	}
	case 2:{
		hexfield[i][j].line2=true;	
		bo.lineTo(dotx-w,doty-l/2);
		break;
	}	
	case 3:{
		hexfield[i][j].line3=true;
		bo.lineTo(dotx-w,doty+l/2);	
		break;
	}
	case 4:{
		hexfield[i][j].line4=true;	
		bo.lineTo(dotx,doty+h+l/2);
		break;
	}	
	case 5:{
		hexfield[i][j].line5=true;
		bo.lineTo(dotx+w,doty+l/2);	
		break;
	}
	case 6:{
		hexfield[i][j].line6=true;	
		bo.lineTo(dotx+w,doty-l/2);
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
	if(ratx>=Math.floor(dotx-w/5)
	&& ratx<=Math.floor(dotx+w/5)
	&& raty<=Math.floor(doty-l/2-h*4/5) 
	&& raty>=Math.floor(doty-l/16)){
		return true;
	}
}
function isItIn2(ratx,raty,dotx,doty){
	if(ratx>=(Math.floor(dotx-w+1)) 
	&& ratx<=(Math.floor(dotx-w/5-1)) 
	&& raty>=(Math.floor(doty-l/2+1)) 
	&& raty<=(Math.floor(doty-1))){
		return true;
	}
}
function isItIn3(ratx,raty,dotx,doty){
	if(ratx>=Math.floor(dotx-w+1) 
	&& ratx<=Math.floor(dotx-w/5-1) 
	&& raty>=Math.floor(doty+1) 
	&& raty<=Math.floor(doty+l/2-1)){
		return true;
	}
}
function isItIn4(ratx,raty,dotx,doty){
	if(ratx>=Math.floor(dotx-w/5) 
	&& ratx<=Math.floor(dotx+w/5) 
	&& raty>=Math.floor(doty+l/16) 
	&& raty<=Math.floor(doty+l/2+h*4/5)){
		return true;
	}
}
function isItIn5(ratx,raty,dotx,doty){
	if(ratx>=Math.floor(dotx+w/5+1) 
	&& ratx<=Math.floor(dotx+w-1) 
	&& raty>=Math.floor(doty+1) 
	&& raty<=Math.floor(doty+l/2-1)){
		return true;
	}
}
function isItIn6(ratx,raty,dotx,doty){
	if(ratx>=Math.floor(dotx+w/5+1) 
	&& ratx<=Math.floor(dotx+w-1) 
	&& raty>=Math.floor(doty-l/2+1) 
	&& raty<=Math.floor(doty-1)){
		return true;
	}
}

function getMouseXY(e) {
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

function whl(z,width,height){
	w=width/(2*z+1);
	w=Math.floor(w);
	
	a=(2*z+1);
	b=(-(2*height+2*z*height));
	c=(height*height-w*w*z*z)
	
	d=b*b - 4*a*c;
	
	h=(-b-Math.sqrt(d))/(2*a);
	h=Math.floor(h);
	
	l=(height-h-z*h)/z;
	l=Math.floor(l);		
}
