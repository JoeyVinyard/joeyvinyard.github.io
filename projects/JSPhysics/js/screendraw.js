var canvas;
var ctx;
function prepCanv(){
	canvas = document.getElementById("canv");
	$("#canv").attr("width",$(window).width()*.8);
	$("#canv").attr("height",$(window).height()*.8);
	ctx = canvas.getContext("2d");
	ctx.transform(1, 0, 0, -1, 0, canvas.height);
}
function drawObject(x,y,width,height,shape,color){
	ctx.fillStyle = color;
	switch(shape){
		case "rect":
			ctx.fillRect(x,y,width,height);
		break;
		case "circ":
			ctx.beginPath();
			ctx.arc(x+width/2,y+height/2,width/2,0,Math.PI*2);
			ctx.fill();
			ctx.closePath();
		break;
		default:
			ctx.fillRect(x,y,width,height);
	}
}