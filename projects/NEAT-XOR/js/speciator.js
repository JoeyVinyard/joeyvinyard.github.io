var specs = [];

var bestOrg;

var compThresh = 3;
var sizeThresh = 20;

var eCo = 1;
var dCo = 1;
var wCo = .4;

function assignMaxes(){
	var totFit = 0;
	//console.log(specs);
	specs.forEach(function(s){
		if(s.genomes.length==0||isNaN(s.fitness)){
			//console.log("Removing species: ",specs.indexOf(s));
			specs.splice(specs.indexOf(s),1);
		}else{
			totFit+=s.fitness;
		}	
	});
	specs.forEach(function(s){
		s.maxSize = Math.floor((s.fitness/totFit)*150);
		if(isNaN(s.maxSize))
			s.maxSize = 1;
		//console.log(s.maxSize,s.fitness,totFit);
	});
	var temp = 1;
	while(temp!=null){
		temp = null;
		for(var i=1;i<specs.length;i++){
			if(specs[i].fitness>specs[i-1].fitness){
				temp = specs[i];
				specs[i]=specs[i-1];
				specs[i-1]=temp;
			}
		}
	}
}
function speciate(genomes){
	//console.log(genomes);
	bestOrg = genomes[0];
	for(var i = 0;i<genomes.length;i++){
		if(genomes[i].fitness>bestOrg.fitness)
			bestOrg=genomes[i];
	}
	//console.log("Best organism: ",bestOrg.fitness);
	genomes.forEach(function(g){
		var found = false;
		if(specs.length==0){
			specs.push(Object.create(species));
			specs[specs.length-1].init();
		}
		specs.forEach(function(s){
			if(!found){
				if(s.repGenome == null){
				//	console.log("First species");
					s.genomes.push(g);
					s.repGenome=g;
					g.species = 1;
					found = true;
				}
				else if(calcCompatibility(g,s.repGenome)){
					//console.log("Adding to species");
					s.genomes.push(g);
					g.species = specs.indexOf(s)+1;
					found = true;
				}
			}
		});
		if(!found){
			//console.log("Creating new species");
			specs.push(Object.create(species));
			specs[specs.length-1].init();
			specs[specs.length-1].genomes.push(g);
			specs[specs.length-1].repGenome = g;
			g.species = specs.length;
		}
	});
	specs.forEach(function(s){
		if(s.genomes.length==0){
			specs.splice(specs.indexOf(s),1);
		}
	});
}
function calcCompatibility(g,s){
	if(g.connGenes.length==0&&s.connGenes.length==0)
		return true;
	var n = 1;
	if(g.nodeGenes.length>sizeThresh)
		n=g.nodeGenes.length;
	var ex = getNumExcess(g,s);
	var ds = getNumDisjoint(g,s);
	var w = getWeightDiff(g,s);
	var delta = (eCo*(ex/n))+(dCo*(ds/n))+(wCo*w);
	//console.log("Excess: ", ex, "Disjoint: ", ds, "Weight: ", w, "Delta: ", delta);
	return delta<compThresh;;
}
function getNumExcess(g,s){
	var larger = g.innovNums;
	var max = s.innovNums[s.innovNums.length-1]
	if(max>g.innovNums[g.innovNums.length-1]){
		larger = s.innovNums;
		max = g.innovNums[g.innovNums.length-1];
	}
	var numEx = larger.length-1-larger.findIndex(function(n){return n>=max});
	return numEx;
}
function getNumDisjoint(g,s){
	var numDis=0;
	var larger = g.innovNums;
	var smaller = s.innovNums;
	if(smaller.length>larger.length){
		larger = s.innovNums;
		smaller = g.innovNums;
	}
	var max = smaller[smaller.length-1];
	for(var i=0;larger[i]<=max;i++){
		if(!smaller.includes(larger[i]))
			numDis++;
	}
	for(var i=0;i<smaller.length;i++){
		if(!larger.includes(smaller[i]))
			numDis++;
	}
	return numDis;
}
function getWeightDiff(g,s){
	var a = g.innovNums;
	var b = s.innovNums;
	var numMatching = 0;
	var totDif = 0;
	var match = 0;
	for(var i=0;i<a.length;i++){
		match = b.findIndex(function(n){return n==a[i]});
		if(match!=-1){
			numMatching++;
			totDif+=Math.abs(Math.abs(g.connGenes[i].weight)-Math.abs(s.connGenes[match].weight));
		}
	}
	return totDif/numMatching;
}