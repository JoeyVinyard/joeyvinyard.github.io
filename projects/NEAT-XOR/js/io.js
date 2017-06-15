function throwErrorMessage(loc,mes){
	console.log("\n\nError in "+loc+" : "+mes+"\n\n\n");
}
function getRandomCase(){
	var ins = [];
	ins.push(Math.floor(Math.random()*2));
	ins.push(Math.floor(Math.random()*2));
	return ins;
}