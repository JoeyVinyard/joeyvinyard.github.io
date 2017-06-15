var species = {
	maxSize: 0,
	repGenome: null,
	genomes: null,
	fitness: 0,
	init: function(){
		this.genomes = [];
	},
	calcTotalFitness: function(){
		var sum = 0;
		this.genomes.forEach(function(g){
			sum+=g.fitness;
		});
		this.genomes.sort(function(a,b){
			if(a.fitness<b.fitness)
				return 1;
			else
				return -1;
		});
		this.fitness = sum/this.genomes.length;
		return this.fitness;
	},
	chooseRandGenome: function(){
		this.repGenome = this.genomes[Math.floor(Math.random()*this.genomes.length)];
	}
}