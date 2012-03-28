var x=0,y=0,z=0,l=0,i=0,j=0,h=0,w=0,d=0,a=0,b=0,c=0;

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
	case 1:{z=6;
		whl(z,width,height);
		
	break;	
	}
	case 2:{z=10;
		whl(z,width,height);
		
	break;
	}
	case 3:{z=16;
		whl(z,width,height);
		
	break;
	}
	}	
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

var IE = document.all?true:false
if (!IE) document.captureEvents(Event.MOUSEMOVE)

var ratx=0,raty=0;

function hex(){
	this.line1=false;
	this.line2=false;
	this.line3=false;
	this.line4=false;
	this.line5=false;
	this.line6=false;
}

function fieldArray(){
	var hexfield=new Array(z);
	for(i=0;i<z;i++){
		hexfield[i]=new Array(z);
		for(j=0;j<z;j++){
			hexfield[i][j]=new hex();
		}
	}
}

var dotx=0,doty=0;

function dotxy(k,t){
	dotx=k*w*2+w;
	if(t%2!=0){
		dotx+=w;
	}
	doty=t*(h+l)+h+l/2;
}

//funkciq da chertae cherti
function drawLine(){
	function getMouseXY() {
		if (IE) {
			ratx = event.clientX + document.body.scrollLeft
			raty = event.clientY + document.body.scrollTop
		} else {
			ratx = pageX
			raty = pageY
		}
	}
	var g=document.getElementById("dots_game");
	var width=document.getElementById("dots_game").width;
	var height=document.getElementById("dots_game").height;
	var bo=g.getContext("2d");
	bo.fillStyle="#000000";
	bo.lineTo(ratx,raty)
	bo.stroke();
}

//funkciq da zapulva rombche

//AI
//ELO
