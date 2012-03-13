var x=0;var y=0;var z=0;var l=0;var i=0;var j=0;var h=0;var w=0;var d=0;var a=0;var b=0;var c=0;

//iz4ertavane ne igralnoto pole
function field(size,type){
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

//funkciq da chertae cherti
//funkciq da zapulva rombche

//AI
//ELO
