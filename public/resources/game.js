var x=0;var y=0;var z=0;var l=0;var i=0;var j=0;var h=0;var w=0;

//funkciqta iz4ertava igralnoto pole
function field(size,type){
	var c=document.getElementById("dots_game");
	var bo=c.getContext("2d");
	bo.fillStyle="#A0A0A0";
	switch(size){
	case 1:{z=6;l=50;h=22;w=45;break;}
	case 2:{z=10;l=30;h=15;w=26;break;}
	case 3:{z=16;l=20;h=9;w=18;break;}
	}
	for(i=0;i<z/2;i+=1){
			drawRow(z,l,h,w,x,y,bo)			
	}
	bo.moveTo(0,h);
	bo.stroke();
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
	x-=(2*w*(z+1)));
}
function II(z,l,h,w,x,y,bo){
	for(j=0;j<(z+1);j+=1){
		x+=2*w;
		y-=l;
		bo.moveTo(x,y);
		y+=l;
		bo.lineTo(x,y);
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
