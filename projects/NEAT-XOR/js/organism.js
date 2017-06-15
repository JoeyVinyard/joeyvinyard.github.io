var globInnovNum = 1;

var connGene = {
	innovNum: 0,
	in: null,
	out: null,
	weight: 1,
	species: 0,
	disabled: false,

	genRandWeight: function(){
		this.weight = Math.floor((Math.random()*(20)+(-10))*100)/100;
	},
	getWeightedValue: function(){
		//if(this.in==null)
			//console.log(this);
		return this.in.getSigmoid()*this.weight;
	}
}

var nodeGene = {
	type: "hidden",//input,hidden,output
	id: 0,
	x: 0,
	y: 0,
	inputs: null,
	tot: 0,
	createInputs: function(){
		this.inputs = [];
	},
	assignPos: function(x,y){
		this.x=x;
		this.y=y;
	},
	getSigmoid: function(){
		//console.log(this);
		if(this.type == "input"){
			this.tot = this.inputs[0];
		}else{
			var sum = 0;
			this.inputs.forEach(function(i){
				if(!i.disabled){
					sum+=i.getWeightedValue();
				}
			});
			this.tot = Math.floor((1/(1+Math.exp(-1*sum)))*100)/100;//Calculates Sigmoid and cuts off at 3 decimals
		}
		return this.tot;
	},
	isInf: function(ids){
		var inf = false;
		if(this.type=="input")
			return false;
		if(ids.includes(this.id)){
			//console.log("Returning true!");
			return true;
		}
		ids.push(this.id);
		this.inputs.forEach(function(i){
			//console.log(i);
			if(i.in.type=="input")
				return false;
			if(i.in.isInf(ids))
				inf = true;
		});
		return inf;
	}
}

var organism = {
	connGenes: null,
	nodeGenes: null,
	innovNums: [],
	inputs: null,
	hiddens: null,
	outputs: null,
	fitness: 0,

	init: function(){
		this.connGenes=[];
		this.nodeGenes=[];
		this.innovNums=[];
		this.inputs=[];
		this.hiddens=[];
		this.outputs=[];
	},
	createNewConn: function(i,o){
		this.createNewConn(i,o,null);
	},
	createNewConn: function(i,o,w){
		this.createNewConn(i,o,w,null,false);
	},
	createNewConn: function(i,o,w,inn,override){
		if(i==o){
			return;
		}
		var dup=false;
		if(this.nodeGenes[i-1]==undefined){
			// console.log(i,o,new Error().stack);
			// console.log("The input was not there");
			return;
			//this.createNewNode(i,"hidden");
		}
		if(this.nodeGenes[i-1].isInf([o]))
			return;
		if(this.nodeGenes[o-1]==undefined){
			if(override)
				this.createNewNode(o,"hidden");
			else
				return;
		}
		else{
			this.nodeGenes[o-1].inputs.forEach(function(n){
				if(n.in.id==i){
					dup=true;
				}
			});
		}
		if(dup)
			return;
		var c = Object.create(connGene);
		if(inn==null){
			//console.log("Not supplied with innovation number");
			c.innovNum=globInnovNum++;
		}
		else
			c.innovNum=inn;
		c.in = this.nodeGenes[i-1];
		c.out = this.nodeGenes[o-1];
		c.out.inputs.push(c);
		if(w==null)
			c.genRandWeight();
		else
			c.weight=1;
		this.innovNums.push(c.innovNum);
		this.connGenes.push(c);
	},
	createOldConn: function(c){
		if(c==undefined)
			return;
		if(c.in.id==c.out.id)
			return;
		if(this.nodeGenes[c.in.id-1]==undefined)
			return;
		if(c.in.isInf([c.out.id]))
			return;
		this.createNewConn(c.in.id,c.out.id,c.weight,c.innovNum,true);
		if(c.disabled && Math.random()<.05)
			this.connGenes[this.connGenes.length-1].disabled=false;
	},
	//@TODO: Make sure that the anti duplicate works
	createNewNodeByType: function(t){
		this.createNewNode(this.nodeGenes.length+1,t);
	},
	createNewNode: function(i,t){
		var n = Object.create(nodeGene);
		n.type = t;
		n.id = this.nodeGenes.length+1;
		n.createInputs();
		this.nodeGenes[i-1]=n;
		if(t=="input"){
			this.inputs.push(n);
		}else if(t=="hidden"){
			this.hiddens.push(n);
		}else if(t=="output"){
			this.outputs.push(n);
		}
	},
	generateNewConn: function(){
		var input;
		var output;
		var count = 0;
		do{
			if(Math.random()>=.5){
				input = this.inputs[Math.floor(Math.random()*this.inputs.length)];
			}else{
				input = this.hiddens[Math.floor(Math.random()*this.hiddens.length)];
			}
			if(Math.random()>=.5){
				output = this.outputs[Math.floor(Math.random()*this.outputs.length)];
			}else{
				output = this.hiddens[Math.floor(Math.random()*this.hiddens.length)];
			}
			if(input==undefined||output==undefined||count>10){
				return;
			}
			count++;
		}while((input.id==output.id||input==output)&&input.isInf([output.id]));
		if(input.isInf([output.id])){
			//console.log("Caught it!");
			return;
		}
		this.createNewConn(input.id,output.id);
	},
	generateNewNode: function(){
		var c = this.connGenes[Math.floor(Math.random()*this.connGenes.length)];
		if(c == undefined){
			return;
		}
		this.createNewNodeByType("hidden");
		c.disabled=true;
		this.createNewConn(c.in.id,this.hiddens[this.hiddens.length-1].id,1);
		this.createNewConn(this.hiddens[this.hiddens.length-1].id,c.out.id,c.weight);
	},
	runMutations: function(t){
		var r = Math.floor(Math.random()*100)/100;
		if(r<.8){
			if(Math.random()<.1){
				this.connGenes.forEach(function(c){
					c.genRandWeight();
				});
			}else{
				var modifier = Math.floor(((Math.random()*(.06))+.97)*100)/100
				this.connGenes.forEach(function(c){
					c.weight=Math.floor(c.weight*modifier*100)/100;
				});
			}
		}
		if(r<=.05){
			this.generateNewConn();
		}
		if(r<=.03){
			this.generateNewNode();
		}
	},
	//Needs to be rewritten for broader application
	giveInputs: function(sensors){
		for(var i=0;i<this.inputs.length;i++){
			this.inputs[i].inputs.push(sensors[i]);
		}
		var out =  this.outputs[0].getSigmoid();
		for(var i=0;i<this.inputs.length;i++){
			this.inputs[i].inputs=[];
		}
		return out;
	},
	calcFitness: function(){
		var tot = 0;
		var cases = [[0,0,1],[0,1,1],[1,0,1],[1,1,1]];
		for(var i = 0;i<4;i++){
			var expected = cases[i][0]^cases[i][1];
			//console.log(this);
			var output = this.giveInputs(cases[i]);
			tot += ((1/(1+Math.abs(expected-output)))*2-1);
		}
		this.fitness=(tot/4);
		this.fitness/=(1+(this.nodeGenes.length/50));
		return (this.fitness);
	},
	createBlank: function(numInputs, numOutputs){
		for(var i=0;i<numInputs;i++){
			this.createNewNodeByType("input");
		}
		for(var i=0;i<numOutputs;i++){
			this.createNewNodeByType("output");
		}
		this.createNewConn(1,4,1,1);
		this.createNewConn(2,4,1,2);
	}
}