var draw_x=0,draw_y=0,hex_counter=0,hex_length=0,i=0,j=0,hex_height=0,hex_width=0,
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
	whl(width,height);
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
	
	return hex_counter;
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

function whereInHex(){
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
	}
}

function mouseLine(ratx,raty){
	s=Math.floor(ratx/hex_width);
	dotxy();
	whereInHex();		
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
	whl(width,height);
	mouseLine(ratx,raty,bo);
	bo.moveTo(dotx,doty);
	
	switch(line){
	case 1:{
		if(hexarray[i][j].line1!=true){
			hexarray[i][j].line1=true;	
			bo.lineTo(dotx,doty-hex_height-hex_length/2);
		}
		break;
	}
	case 2:{
		if(hexarray[i][j].line2!=true){
			hexarray[i][j].line2=true;	
			bo.lineTo(dotx-hex_width,doty-hex_length/2);
		}
		break;
	}	
	case 3:{
		if(hexarray[i][j].line3!=true){
			hexarray[i][j].line3=true;	
			bo.lineTo(dotx-hex_width,doty+hex_length/2);
		}
		break;
	}
	case 4:{
		if(hexarray[i][j].line4!=true){
			hexarray[i][j].line4=true;	
			bo.lineTo(dotx,doty+hex_height+hex_length/2);
		}
		break;
	}	
	case 5:{
		if(hexarray[i][j].line5!=true){
			hexarray[i][j].line5=true;	
			bo.lineTo(dotx+hex_width,doty+hex_length/2);
		}
		break;
	}
	case 6:{
		if(hexarray[i][j].line6!=true){
			hexarray[i][j].line6=true;	
			bo.lineTo(dotx+hex_width,doty-hex_length/2);
		}
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

function whl(width,height){
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
