var stagNum = 0;
function runBreeding(species){
	if(stagNum>=100){
		species.splice(2);
		assignMaxes();
		console.log("Fixing Stagnation",species);
		stagNum=0;
	}
	species.forEach(function(s){
		if(s.genomes.length==0){
			species.splice(species.indexOf(s),1);
		}
	});
	var newGenomes = [];
	species.forEach(function(s){
		s.repGenome = s.genomes[Math.floor(Math.random()*s.genomes.length)];
		s.genomes.splice(s.genomes.length/2+1);
		for(var i=0;i<s.maxSize;i++){
			var m=s.genomes[Math.floor(Math.random()*s.genomes.length)];
			var f=s.genomes[Math.floor(Math.random()*s.genomes.length)];
			if(m==undefined||f==undefined)
				break;
			newGenomes.push(breed(m,f));
		}
		s.genomes = [];
	});
	//console.log("New Genomes " ,newGenomes);
	speciate(newGenomes);
}
function breed(m,f){
	var child = Object.create(organism);
	child.init();
	child.createBlank(3,1);
	var fit = f;
	var lfit = m;
	//console.log(m,f);
	if(m.fitness<f.fitness){
		fit=f;
		lfit=m;
	}
	var matching = [];
	fit.innovNums.forEach(function(n,i){
		if(lfit.innovNums.includes(n)){
			matching.push(fit.connGenes[i]);
		}
	});
	fit.connGenes.forEach(function(c,i){
		if(matching.includes(c)){
			if(Math.random()<.5)
				child.createOldConn(c);
			else{
				//console.log("Input num is:",i,fit);
				child.createOldConn(lfit.connGenes.find(function(c){return c.innovNum == fit.innovNums[i]}));
			}
		}else{
			child.createOldConn(c);
		}
	});
	child.runMutations();
	child.calcFitness();
	return child;
}