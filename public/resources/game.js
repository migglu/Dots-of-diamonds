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
		y=h;
		for(i=0;i<(z/2);i++){
			drawRow(z,l,h,w,x,y,bo);
			y+=2*l+2*h;
		}
	break;	
	}
	case 2:{z=10;
		whl(z,width,height);
		y=h;
		for(i=0;i<(z/2);i++){
			drawRow(z,l,h,w,x,y,bo);
			y+=2*l+2*h;
		}
	break;
	}
	case 3:{z=16;
		whl(z,width,height);
		y=h;
		for(i=0;i<(z/2);i++){
			drawRow(z,l,h,w,x,y,bo);
			y+=2*l+2*h;
		}
	break;
	}
	}			
	bo.moveTo(0,h);
	bo.stroke();
}

function whl(z,width,height){
	w=width/(2*z+1);
	if(width%(2*z+1)==0){}
	else if(width%(2*z+1)>=(2*z+1)/2){
		w=Math.round(w)-1;
	}
	else if(width%(2*z+1)<(2*z+1)/2){
		w=Math.round(w);
	}
	
	a=(2*z+1);
	b=(-(2*height+2*z*height));
	c=(height*height-w*w*z*z)
	
	d=b*b - 4*a*c;
	
	h=(-b-Math.sqrt(d))/(2*a);
	if((-b-Math.sqrt(d))/(2*a)==0){}
	else if((-b-Math.sqrt(d))/(2*a)>=(2*a)/2){
		h=Math.round(h)-1;
	}
	else if((-b-Math.sqrt(d))/(2*a)<(2*a)/2){
		h=Math.round(h);
	}
	
	l=(height-h-z*h)/z;
	if((height-h-z*h)/z==0){}
	else if((height-h-z*h)/z>=z/2){
		l=Math.round(l)-1;
	}
	else if((height-h-z*h)/z<z/2){
		l=Math.round(l);
	}	
	
}

function drawRow(z,l,h,w,x,y,bo){
	x=0;
	bo.moveTo(x,y);
	I(z,l,h,w,x,y,bo);
	y+=l;
	II(z,l,h,w,x,y,bo);
	x=0;
	bo.moveTo(x,y);
	x+=w;
	y+=h
	bo.lineTo(x,y);
	I(z,l,h,w,x,y,bo);
	y+=l;
	II(z,l,h,w,x,y,bo);
	bo.moveTo(w,y);
	III(z,l,h,w,x,y,bo);
}

function I(z,l,h,w,x,y,bo){
	for(j=0;j<z;j+=1){
		x+=w;
		y-=h;
		bo.lineTo(x,y);
		x+=w;
		y+=h;
		bo.lineTo(x,y);
	}
	x-=(2*w*z);
}
function II(z,l,h,w,x,y,bo){
	for(j=0;j<(z+1);j+=1){
		y-=l;
		bo.moveTo(x,y);
		y+=l;
		bo.lineTo(x,y);
		x+=2*w;
	}
	x-=(2*w*z);
}
function III(z,l,h,w,x,y,bo){
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
