var g = -.7;
var objects = [];

var baseObject = {
	name: "DEBUG",
	mass: 10,
	x: 0,
	y: 0,
	xVel: 0,
	yVel: 0,
	width: 20,
	height: 20,
	fric: .5,
	rest: .5,
	collided: false,
	fixed: false,
	shape: "rect",
	color: "Blue",
	calcMomentum: function(){
		console.log(this.mass + " " + this.xVel + " "+ this.yVel);
		return this.mass*this.calcVel();
	},
	calcKinEn(){
		return 0.5*this.mass*Math.pow(this.calcVel(),2);
	},
	calcVel(){
		return Math.sqrt(Math.pow(this.xVel,2)+Math.pow(this.yVel,2));
	}
}
function tick(){
	for(var i = 0; i < objects.length; i++){
		if(!objects[i].fixed){
			for(var xInc = 0; xInc < Math.abs(Math.floor(objects[i].xVel));xInc++){
				if(checkCollisions(i))
					break;
				objects[i].x+=objects[i].xVel/Math.abs(objects[i].xVel);
			}
			for(var yInc = 0; yInc < Math.abs(Math.floor(objects[i].yVel));yInc++){
				if(checkCollisions(i))
					break;
				objects[i].y+=objects[i].yVel/Math.abs(objects[i].yVel);
			}
			objects[i].yVel+=g;
		}
	}
}
function checkCollisions(i){
	console.log(objects[i].xVel);
	if(objects[i].fixed)
		return;
	for(var j=0;j<objects.length;j++){
		if(i!=j&&(objects[i].x <= objects[j].x + objects[j].width && objects[i].x + objects[i].width >= objects[j].x && objects[i].y <= objects[j].y + objects[j].height &&  objects[i].height + objects[i].y >= objects[j].y)){
			//X Collisions
			if(objects[i].x>=objects[j].x+objects[j].width){
				if(objects[j].fixed){
					objects[i].xVel=objects[i].xVel*objects[i].rest*-1;
					objects[i].x+=Math.floor(objects[i].xVel);
					return true;
				}
			}else if(objects[i].x<=objects[j].x){
				if(objects[j].fixed){
					objects[i].xVel=objects[i].xVel*objects[i].rest*-1;
					objects[i].x+=Math.floor(objects[i].xVel);
					objects[i].xVel-=objects[i].xVel*objects[i].fric/100;
					return true;
				}
			//Y Collisions
			}else if(objects[i].y<=objects[j].y+objects[j].height){
				if(objects[j].fixed){
					objects[i].yVel=objects[i].yVel*objects[i].rest*-1;
					objects[i].y+=Math.floor(objects[i].yVel);
					return true;
				}
			}else if(objects[i].y<=objects[j].y){
				console.log("Top");
				if(objects[j].fixed){
					objects[i].yVel=objects[i].yVel*objects[i].rest*-1;
					objects[i].y+=Math.floor(objects[i].yVel);
					return true;
				}
			}
		}
	}
	return false;
}
var circ = Object.create(baseObject);
circ.shape = "circ";
circ.name = "Circle";
circ.x = 30;
circ.y = 800;
circ.xVel = 10;
circ.rest = .4;
objects.push(circ);

// var rect = Object.create(baseObject);
// rect.shape = "rect";
// rect.color = "Red";
// rect.x = 80;
// rect.y = 800;
// objects.push(rect);

var ground = Object.create(baseObject);
ground.name = "Ground";
ground.shape = "rect";
ground.color = "Brown";
ground.width = 10000;
ground.height = 20;
ground.fixed = true;
objects.push(ground)

var wall = Object.create(baseObject);
wall.name = "Wall";
wall.shape = "rect";
wall.color = "Brown";
wall.width = 20;
wall.height = 400;
wall.fixed = true;
wall.x = 800;
objects.push(wall)