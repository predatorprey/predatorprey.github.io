$(document).ready(function(){

  var sim_canvas = document.getElementById("sim");
  var sim_ctx = sim_canvas.getContext('2d');
  sim_canvas.width = window.innerWidth*0.25;
  sim_canvas.height = window.innerHeight*0.75;
  var preys = [];
  var predators = [];
  var trail_len = 2;
  var timer = new Date();
  var startTime = new Date();
  var PREDATOR_REPRODUCTION_FACTOR = 10;
  var OFFSPRING_RATE = 10;
  var startDate = new Date();
  var eaten = 0;
  var preyVars = {
    spawnFactor: 2,
    clusterFactor: 0.5,
    randomSpawnFactor: 0.001
  }
  var predatorVars = {
    deathFactor: 0.9,
    clusterFactor: 0.05,
    fertility: 30,
    randomSpawnFactor: 0.05
  }
  // var sim_constants = {k: }
  function nextDataPoint(predatorCount, preyCount, time){
    return [
      {time: new Date(), y: preyCount},
      {time: new Date(), y: predatorCount}
    ];
  }
  function Prey(x, y){
    this.fertility;
    this.hunger;
    this.maxSpeed = 1.25;
    this.orientation = "right";
    this.direction = "down";
    this.age = 0;
    this.maxAge = 0.01*(75+Math.random()*50);
    this.velX = Math.random()*this.maxSpeed;
    this.velY = Math.sqrt(Math.pow(this.maxSpeed, 2)-Math.pow(this.velX, 2));
    this.color = "green";
    this.age;
    this.size = 7.5;
    if(x == null){
      this.x = (Math.random()*sim_canvas.width) | 0;
      this.y = (Math.random()*sim_canvas.height) | 0;
    }
    else{
      this.x = x;
      this.y = y;
    }
    this.trail = Array(trail_len);
    this.trail.fill([this.x, this.y]);
    this.reproduce = function(){
      if(Math.random() < preyVars.spawnFactor/preys.length){
        preys.push(new Prey((this.x+(Math.random()*10) | 0)-5, (this.y+(Math.random()*10) | 0)-5));
      }
    }
    this.move = function(){
      this.x+=(Number(["right", "left"][0]==this.orientation)*2*this.maxSpeed-this.maxSpeed);
      this.y+=(Number(["up", "down"][0]==this.direction)*2*this.maxSpeed-this.maxSpeed);
      this.trail.shift();
      this.trail.push([this.x, this.y]);
      if(Math.random()<preyVars.clusterFactor){
        if(this.orientation == "right"){
          this.orientation = "left";
        }else{
          this.orientation = "right";
        }
      }
      if(Math.random()<preyVars.clusterFactor){
        if(this.direction == "down"){
          this.direction = "up";
        }else{
          this.direction = "down";
        }
      }
    }


  }
  function Predator(x, y){
    this.hunger;
    this.fertility;
    this.maxSpeed = 1.5;
    this.orientation = "right";
    this.direction = "down";
    this.age = 0;
    this.maxAge = predatorVars.deathFactor*(250+Math.random()*500);
    this.velX = Math.random()*this.maxSpeed;
    this.velY = Math.sqrt(Math.pow(this.maxSpeed, 2)-Math.pow(this.velX, 2));
    this.color = "red";
    this.age;
    this.size = 9;
    if(x == null){
      this.x = (Math.random()*sim_canvas.width) | 0;
      this.y = (Math.random()*sim_canvas.height) | 0;
    }else{
      this.x = x;
      this.y = y;
    }
    this.trail = Array(trail_len);
    this.trail.fill([this.x, this.y]);
    this.reproduce = function(){
        predators.push(new Predator((this.x+(Math.random()*10) | 0)-5, (this.y+(Math.random()*10) | 0)-5));

    }
    this.move = function(){
      this.x+=(Number(["right", "left"][0]==this.orientation)*2*this.maxSpeed-this.maxSpeed);
      this.y+=(Number(["up", "down"][0]==this.direction)*2*this.maxSpeed-this.maxSpeed);
      this.trail.shift();
      this.trail.push([this.x, this.y]);
      if(Math.random()<predatorVars.clusterFactor){
        if(this.orientation == "right"){
          this.orientation = "left";
        }else{
          this.orientation = "right";
        }
      }
      if(Math.random()<predatorVars.clusterFactor){
        if(this.direction == "down"){
          this.direction = "up";
        }else{
          this.direction = "down";
        }
      }
    }

  }
  for(var a = 0; a < 4; a++){
    preys.push(new Prey(null, null));
  }
  for(var b = 0; b<20; b++){
    predators.push(new Predator(null, null));
  }
  // var myChart =  $('#myChart').epoch({
  //   type: 'time.line',
  //   fps: 24,
  //   data: [
  //     {
  //       label: "preys",
  //       values: [{time: 0, y: preys.length}],
  //       color: "red"
  //
  //     },
  //     {
  //       label: "predators",
  //       values: [{time: 0, y: predators.length}],
  //       color: "green"
  //     }
  //   ]
  // });
  function update(){
	sim_ctx.clearRect(0, 0, sim_canvas.width, sim_canvas.height);
  if(new Date() - timer > 1){
    // debugger;
    // myChart.push(nextDataPoint(preys.length, predators.length, (new Date()-startTime)));
    // console.log(preys.length, predators.length);
    timer = new Date();
  }

  // if(Math.random() < 0.05){
  //   predators.push(new Predator(null, null));
  // }
  if(Math.random() < preyVars.randomSpawnFactor){
    preys.push(new Prey(null, null));
  }
  if(Math.random() < predatorVars.randomSpawnFactor*(preys.length/150)){
    predators.push(new Predator(null, null));
  }
	for(var i = preys.length-1; i > 0; i--){
		cur_prey  = preys[i];
    for(var f = 0; f<predators.length; f++){
      pr = predators[f];
      if(Math.sqrt(Math.pow(pr.x-cur_prey.x, 2)+Math.pow(pr.y-cur_prey.y, 2)) < pr.size+cur_prey.size){
        preys.splice(i, 1);
        eaten+=1;
        if(eaten == predatorVars.fertility){
          pr.reproduce();
          eaten = 0;
        }
        continue;
      }
    }
		// cur_prey.x+=cur_prey.velX;
		// cur_prey.y+=cur_prey.velY;
    // cur_prey.trail.shift();
    // cur_prey.trail.push([cur_prey.x, cur_prey.y]);

    cur_prey.move();
    if(cur_prey.age >= cur_prey.maxAge){
      cur_prey.reproduce();
      cur_prey.age = 0;
    }
    cur_prey.age++;

    for(var j = 0; j < cur_prey.trail.length; j++){
      updateCircle(cur_prey, cur_prey.trail[j], j*(1/trail_len), (j/cur_prey.trail.length)*(cur_prey.size));
    }
		if(cur_prey.y+cur_prey.size > sim_canvas.height){
			cur_prey.y = sim_canvas.height-cur_prey.size;
			cur_prey.velY*=-1;
		}
		if(cur_prey.x+cur_prey.size > sim_canvas.width){
			cur_prey.x = sim_canvas.width-cur_prey.size;
			cur_prey.velX*=-1;
		}
		if(cur_prey.y-cur_prey.size < 0){
			cur_prey.y = cur_prey.size;
			cur_prey.velY*=-1;
		}
		if(cur_prey.x-cur_prey.size < 0){
			cur_prey.x = cur_prey.size;
			cur_prey.velX*=-1;
		}
	}
	for(var i = 0; i < predators.length; i++){
		cur_predator = predators[i];
		// updateCircle(cur_predator);
		// cur_predator.x+=cur_predator.velX;
		// cur_predator.y+=cur_predator.velY;
    // cur_predator.trail.shift();
    // cur_predator.trail.push([cur_predator.x, cur_predator.y]);
    cur_predator.move();
    if(cur_predator.age >= cur_predator.maxAge && predators.length > 5){
      predators.splice(i, 1);
      continue;
    }
    cur_predator.age++;
    // if(Math.random() < 0.005){
    //   cur_predator.reproduce();
    // }
    // temp_preys = preys;
    // for(var p = 0; p < preys.length; p++){
    //   debugger;
    //   prey = preys[p];
    //   if(!(Math.sqrt(Math.pow(prey.y-cur_predator.y, 2)+Math.pow(prey.x-cur_predator.x, 2)) < cur_predator.size+prey.size)){
    //     temp_preys.push(prey);
    //   }
    // }
    // preys = temp_preys;
    for(var l = 0; l < cur_predator.trail.length; l++){
      // updateCircle(cur_predator, cur_predator.trail[l], l*(1/trail_len), (cur_predator.size/2)+(j/cur_predator.trail.length)*(cur_predator.size/2));
      updateCircle(cur_predator, cur_predator.trail[l], l*(1/trail_len), (l/cur_predator.trail.length)*(cur_predator.size));
      // debugger;
    }
    if(cur_predator.y+cur_predator.size > sim_canvas.height){
			cur_predator.y = sim_canvas.height-cur_predator.size;
			cur_predator.velY*=-1;
		}
		if(cur_predator.x+cur_predator.size > sim_canvas.width){
			cur_predator.x = sim_canvas.width-cur_predator.size;
			cur_predator.velX*=-1;
		}
		if(cur_predator.y-cur_predator.size < 0){
			cur_predator.y = cur_predator.size;
			cur_predator.velY*=-1;
		}
		if(cur_predator.x-cur_predator.size < 0){
			cur_predator.x = cur_predator.size;
			cur_predator.velX*=-1;
		}
	}
	// requestAnimationFrame(update);
  }
  function updateCircle(animal, coords, opacity, size){
	sim_ctx.beginPath();
	sim_ctx.arc(coords[0], coords[1], size, 0, 2 * Math.PI, false);
  sim_ctx.globalAlpha = opacity;
	sim_ctx.fillStyle = animal.color;
	sim_ctx.fill();
	// sim_ctx.lineWidth = 0;
	// sim_ctx.stroke();
  }
  setInterval(update, 10);
  // update();
})
