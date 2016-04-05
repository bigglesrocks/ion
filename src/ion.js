var drawCircle = function(p) {
    var ctx = p.ion.context;
    var size = p.ion.randomNumber(p.minSize, p.maxSize);
       ctx.translate(p.x, p.y);
       // ctx.fillStyle = p.color;
       ctx.moveTo(p.x,p.y);
       ctx.beginPath();
       ctx.arc(30, 30, p.size, 0, Math.PI*2, true);
       ctx.fill();
       if(p.borderWidth) {
        ctx.stroke();
       }
       ctx.closePath();
}

var drawSquare = function(p) {
    var ctx = p.ion.context;
       ctx.translate(p.x, p.y);
       // context.fillStyle = color;
       if(p.rotation) {
          ctx.rotate(p.orient + p.rotationVelocity);
          p.orient++;
       }
       ctx.moveTo(p.x,p.y);
       ctx.beginPath();
       ctx.rect(0, 0, p.size, p.size);
       ctx.fill();
       if(p.borderWidth) {
        ctx.stroke();
       }
       ctx.closePath();
}

//Particle function
var Particle = function(particleOptions, ion) {

  var o = particleOptions;

  var particle = this;

  particle.ion = ion;

  // Establish starting positions and velocities
  particle.opacity = 1;
  particle.shape = o.shape;
  particle.color = o.color;

  particle.borderColor = o.borderColor;
  particle.borderWidth = o.borderWidth;

  particle.minSize = o.minSize;
  particle.maxSize = o.maxSize;
  particle.rotationDirection = o.rotationDirection;
  particle.rotationVelocity = o.rotationVelocity;
  particle.gravity = o.gravity;
  particle.grow = o.grow;
  particle.composite = o.composite;
  particle.fadeSpeed = o.fadeSpeed;
  particle.fade = o.fade;

  particle.spawnRate = o.spawnRate;

  particle.orient = o.orient;

  particle.colorArray = particle.color.match(/(\d{1,4})/g);

  if(particle.fade == 'in-out') {
    particle.fade = 'in';
    particle.fadeStop = false;
  }

  if(particle.shape == 'flux') {
    particle.order = 1;
  } else {
    particle.order = 0;
  }


  particle.x = Math.floor(particle.ion.randomNumber(-100, particle.ion.canvas.width+100));
  particle.y = Math.floor(particle.ion.randomNumber(-100, particle.ion.canvas.height+100));

  particle.size = Math.floor(particle.ion.randomNumber(particle.minSize, particle.maxSize));

  switch(particle.rotationDirection) {
    case 'clockwise':
      particle.rotation = particle.rotationVelocity*0.01
    break;
    case 'counter-clockwise':
      particle.rotation = - particle.rotationVelocity*0.01
    break;
    case 'random':
      var chance = ion.randomNumber(0,100);
      if(chance > 50) {
        particle.rotation = particle.rotationVelocity*0.01;
      } else {
        particle.rotation = particle.roationVelocity*0.01
      }
  }

  // Add new particle to the index
  // Object used as it's simpler to manage that an array
  particle.life = 0;
  particle.maxLife = o.maxLife;
  
  particle.draw();

}

Particle.prototype.render = function(shape) {

      var particle = this,
          context = particle.ion.context;

      context.fillStyle = particle.color;
      context.strokeStyle = particle.borderColor;
      context.lineWidth = particle.borderWidth;

     // first save the untranslated/unrotated context
     context.save();

     particle.ion.shapes[shape](particle);
    
    // restore the context to its untranslated/unrotated state
    context.restore();
}

Particle.prototype.draw = function() {
  var particle = this,
      ion = particle.ion,
      canvas = ion.canvas,
      context = ion.context;

  particle.y +=  particle.gravity * Math.floor(particle.ion.randomNumber(1, 2));
  // particle.x += particle.wind * Math.floor(particle.ion.randomNumber(1,2));


  // Age the particle
  particle.life++;
  
  if(particle.rotationDirection == 'clockwise') {
    particle.rotation += particle.rotationVelocity;
  } else {
     particle.rotation -= particle.rotationVelocity;
  }
  
  if(particle.grow) {
    particle.size = particle.size*particle.grow;
  }
  
  if(particle.fade) {
    if(particle.fadeStop === false) {
      if(particle.opacity >= 1) {
         particle.fade = 'out';
      }
    }
    switch(particle.fade) {
        case 'in':
          particle.opacity = particle.opacity + particle.fadeSpeed;
        break;
        case 'out':
          particle.opacity = particle.opacity - particle.fadeSpeed;
        break;
    }
    particle.color = 'rgba('+particle.colorArray[0]+','+particle.colorArray[1]+','+particle.colorArray[2]+','+particle.opacity+')'; 
  }
 
 // Create the shapes
  context.clearRect(canvas.width, canvas.height, canvas.width, canvas.height);
  context.fillStyle = particle.color;
  // context.globalCompositeOperation = this.composite;
  particle.render(particle.shape, particle.x, particle.y, particle.size, particle.size, particle.rotation, particle.color, particle.rotationDirection);
  // context.globalCompositeOpteration = 'destination-out';

  if(particle.life > particle.maxLife) {
    delete ion.particleTracker[particle.id];
  }
}

//Main plugin function
var Ion = function(el, particles, options) {

  var ion = this;

  //Function for setting default & user settings
  ion.setOpts = function(standard, user) {
    if (typeof user === 'object') {
      for (var key in standard) {
        if(user[key] != null) {
            standard[key] = user[key];
        }
      }
    }
    return standard;
  };

  //Random Number generator funciton
  ion.randomNumber = function(min, max, frac) {
     var num = Math.random() * (max - min) + min;
     if(!frac) {
        var num = Math.floor(num);
      }
      return num;
  };

  ion.setOptions(options);

  ion.particleTracker = {};
  ion.particleIndex = 0;

  ion.canvas = document.getElementById(el);

  ion.context = ion.canvas.getContext("2d");

  // Responsive/relative canvas sizing
  ion.sizeCanvas();
  window.onresize = function() {
    ion.sizeCanvas();
  };

  // Add base shapes
  ion.init();

  if(particles) {
    ion.setParticles(particles);
    ion.start();
  }

};

Ion.prototype.sizeCanvas = function() {

  var ion = this,
      width = ion.canvas.getAttribute('width'),
      height = ion.canvas.getAttribute('height');

  if(!width) { width = window.getComputedStyle(ion.canvas.parentElement, null).width; }
  if(!height) { height = window.getComputedStyle(ion.canvas.parentElement, null).height; }

  ion.canvas.setAttribute('width', width);
  ion.canvas.setAttribute('height', height);
}

Ion.prototype.stop = function() {
   clearInterval(this.animate);
}

Ion.prototype.setParticles = function(particles) {

  var ion = this;

  if(typeof(particles) === 'object') {
    var particle = particles;
    particles = new Array();
    particles.push(particle);
  }


  for(var p=0; p<particles.length; p++) {
    particles[p] = ion.setOpts({
      shape: 'circle',
      color: 'rgba(0,0,0,1)',
      borderColor: "rbga(0,0,0,0)",
      borderWidth: 0,
      minSize: 15,
      maxSize: 30,
      rotationDirection: 'clockwise',
      rotationVelocity: 0.1,
      orient: 0,
      spawnRate: 8,
      maxLife: 100,
      fade: false,
      fadeSpeed: 0.01,
      grow: false,
      gravity: 1,
      wind: 1,
      density: 20
    }, particles[p]);
  }
   ion.particles = particles;



}





Ion.prototype.setOptions = function(opts) {

  var ion = this;

  options = ion.setOpts({
    frameRate: 30,
    canvasBackground: 'rgba(255,255,255,1)'
  }, opts);

  ion.frameRate = options.frameRate;
  ion.canvasBackground = options.canvasBackground;

}

Ion.prototype.createParticle = function(par) {
  var particle = new Particle(par, this);
  this.particleTracker[this.particleIndex] = particle;
  particle.id = this.particleIndex;
  this.particleIndex++;
}

Ion.prototype.addShape = function(id, instructions) {
  this.shapes[id] = instructions;
}

Ion.prototype.init = function() {
  this.shapes = {
    circle: drawCircle, 
    square: drawSquare
  };

}

Ion.prototype.start = function() {
  var ion = this;

  // ========================================
  // For each particle type
  for(var t = 0; t < ion.particles.length; t++) {
    var par = ion.particles[t];
    // Make a new particle for the particle's density setting
    for(var d = 0; d < par.density; d++) {
     ion.createParticle(par);
    }
  }


  // Interval to animate particles
  // ========================================
  ion.animate = setInterval(function() {
    ion.context.fillStyle = ion.canvasBackground;
    ion.context.fillRect(0, 0, ion.canvas.width, ion.canvas.height);
    for(var s=0; s < ion.particles.length; s++) {
      var par = ion.particles[s];
      if(par.spawnRate > 0) {
        if(ion.randomNumber(0,100) < par.spawnRate) {
          ion.createParticle(par);
        }
      }
    }
    // Draw the particles
    for (var p in ion.particleTracker) {
      ion.particleTracker[p].draw();
    }
   
  }, ion.frameRate);
}