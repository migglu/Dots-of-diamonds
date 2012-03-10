var x=0;var y=0;var z=0;var l=0;var i=0;var j=0;var h=0;var w=0;var d=0;
//var width;  of canvas
//var height; of canvas

//funkciqta iz4ertava igralnoto pole
function field(size,type){
	var c=document.getElementById("dots_game");
	var bo=c.getContext("2d");
	bo.fillStyle="#000000";
	switch(size){
	case 1:{z=6;
		whl(z,width,height);
		drawRow(z,l,h,w,x,y,bo);
		drawRow(z,l,h,w,x,y,bo);
		drawRow(z,l,h,w,x,y,bo);
	break;	
	}
	case 2:{z=10;l=35;h=22;w=28;
		whl(z,width,height);
		drawRow(z,l,h,w,x,y,bo);
		drawRow(z,l,h,w,x,y,bo);
		drawRow(z,l,h,w,x,y,bo);
		drawRow(z,l,h,w,x,y,bo);
		drawRow(z,l,h,w,x,y,bo);
	break;
	}
	case 3:{z=16;
		whl(z,width,height);
		drawRow(z,l,h,w,x,y,bo);
		drawRow(z,l,h,w,x,y,bo);
		drawRow(z,l,h,w,x,y,bo);
		drawRow(z,l,h,w,x,y,bo);
		drawRow(z,l,h,w,x,y,bo);
		drawRow(z,l,h,w,x,y,bo);
		drawRow(z,l,h,w,x,y,bo);
		drawRow(z,l,h,w,x,y,bo);
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
	
	d=(2*height*(z+1))*(2*height*(z+1)) - 4*(z*z-(z+1)*(z+1))*(z*z*w*w-height*height);
	
	h=(-(2*height*(z+1))-Math.sqrt(d))/(2*(z*z-(z+1)(z+1)));
	if((-(2*height*(z+1))-Math.sqrt(d))/(2*(z*z-(z+1)(z+1)))==0){}
	else if((-(2*height*(z+1))-Math.sqrt(d))/(2*(z*z-(z+1)(z+1)))>=(2*(z*z-(z+1)(z+1)))/2){
		h=Math.round(h)-1;
	}
	else if((-(2*height*(z+1))-Math.sqrt(d))/(2*(z*z-(z+1)(z+1)))<(2*(z*z-(z+1)(z+1)))/2){
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
	y+=h;
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

//funkciq da chertae cherti
//funkciq da zapulva rombche

//AI
