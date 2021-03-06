var max = {
	generation: 1,
	organism: 1,
	distance: 0
}

var chromosome = {
	jumpDistance: 172.01034532220197,
	distanceRan : 0,
	realDistance: 0,
	speedJumpModifier: 2.1604888965264077,
	getFinalJumpDistance: function(speed){
		return this.jumpDistance-(this.speedJumpModifier*speed)
	}
}
var generation = 1;

var chromosomes = [];
var nextGen = [];

var count = 0;

const NUM_PER_GEN = 20;

function neuralTick(s,d){
	if(d==undefined||d==null)
		return;
	simulate(s,d.xPos);
}
function trexDied(r, ad){
	if(ad>max.distance){
		max.distance=ad;
		max.generation = generation;
		max.organism = count+1;
		//document.getElementById("high").innerHTML = "Furthest distance was " + max.distance.toFixed(0) + " achieved by Organism " + max.organism + " of Generation " + max.generation;
	}
	chromosomes[count].realDistance = ad;
	chromosomes[count].distanceRan = r;
	if(count == chromosomes.length-1){
		// killHalf();
		// count = -1;
		// chromosomes = [];
		// chromosomes = nextGen;
		// getGenAve();
		// generation++;
		// document.getElementById("gen").innerHTML = "Generation : #"+generation;
		// nextGen = [];
	}
	count++;
	//document.getElementById("org").innerHTML = "Organism: #"+(count+1);
}
function simulate(s,d){
	if(isWithinFive(d,Math.floor(chromosomes[count].getFinalJumpDistance(s))))
		simJump();
}
function isWithinFive(d,p){
	if(p>d-5&&p<d+20)
		return true;
	else
		return false;
}
function makeFirstGeneration(){
	for(var i = 0; i < NUM_PER_GEN; i++){
		var chro = Object.create(chromosome)
		//chro.jumpDistance = Math.floor(Math.random()*440),
		//chro.speedJumpModifier = Math.random()*2,
		chromosomes.push(chro);
	}
}
function sortByDistance(){
	chromosomes.sort(compareByDistance)
	console.log("Top Trex of generation " + generation + ": ");
	console.log(chromosomes[0]);
	// console.log(chromosomes);
}
function compareByDistance(a,b){
	if(a.distanceRan<b.distanceRan)
		return 1
	else if(b.distanceRan<a.distanceRan)
		return -1;
	else
		return 0;
}
function killHalf(){
	sortByDistance();
	chromosomes.splice(chromosomes.length/2,chromosomes.length/2);
	console.log(chromosomes);
	for(var i = 0; i < NUM_PER_GEN/2; i++){
		nextGen.push(chromosomes[i]);
		mate(chromosomes[i],chromosomes[chromosomes.length-(i+1)]);
	}
}
function mate(a,b){
	console.log(a);
	console.log(b);
	console.log("Mate");
	var newChro = Object.create(chromosome);
	newChro.jumpDistance = (a.jumpDistance+b.jumpDistance)/(2*Math.random()*(1.05 - 0.95) + 0.95);
	newChro.speedJumpModifier = (a.speedJumpModifier+b.speedJumpModifier)/(2*Math.random()*(1.05 - 0.95) + 0.95);
	if(Math.random()<=0.02){
		console.log("Mutation!");
		newChro.jumpDistance*=(Math.random()*2);
		newChro.speedJumpModifier*=(Math.random()*2);
	}
	nextGen.push(newChro);
}
function getGenAve(){
	var tot = 0;
	for(var i=0;i<chromosomes.length;i++){
		tot+=chromosomes[i].realDistance;
	}
	// tot/=chromosomes.length;
	// newAve = document.createElement("p")
	// newAve.innerHTML = "Generation " + generation + "\'s average was " + tot;
	//$("#ave").prepend(newAve);
}
function simJump(){
	var event = new Event('keydown');
	event.keyCode = 32;//keys(Runner.keycodes.JUMP)[0];
	event.which = event.keyCode;
	event.altKey = false;
	event.ctrlKey = true;
	event.shiftKey = false;
	event.metaKey = false;
	document.dispatchEvent(event);
}
//document.getElementById("org").innerHTML = "Organism: #"+(count+1);
makeFirstGeneration();