var canvas;
var ctx;
var cvW = 400;
var cvH = 400;
function prepCanv(){
	canvas = document.getElementById("canv");
	$("#canv").attr("width",cvW);
	$("#canv").attr("height",cvH);
	ctx = canvas.getContext("2d");
}
function drawNode(x,y){
	ctx.fillStyle = "Black";
	ctx.fillRect(x-10,y-10,20,20);
}
function clear(){
	ctx.fillStyle = "White";
	ctx.fillRect(0,0,cvW,cvH);
}
prepCanv();
clear();