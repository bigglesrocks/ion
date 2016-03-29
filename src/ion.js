
var particleGeneratorDefaultParticleOptions = {
      shape: 'circle',
      color: 'rgba(0,0,0,1)',
      minSize: 15,
      maxSize: 30,
      rotation: false,
      rotationVelocity: 0.1,
      spawn: true,
      spawnRate: 8,
      maxLife: 100,
      fade: 'in-out',
      fadeSpeed: 0.01,
      grow: false,
      gravity: 0
    };

//Particle function
var Particle = function(particleOptions, generator) {

  // setOpts(particleGeneratorDefaultParticleOptions, particleOptions);

  var o = particleOptions;

  var particle = this;

  particle.generator = generator;

  // Establish starting positions and velocities
  particle.opacity = 1;
  particle.shape = o.shape;
  particle.colorArray = o.color;
  particle.color = 'rgba('+particle.colorArray[0]+','+particle.colorArray[1]+','+particle.colorArray[2]+','+particle.opacity+')';
  particle.minSize = o.minSize;
  particle.maxSize = o.maxSize;
  particle.rotationVelocity = o.rotationVelocity;
  particle.gravity = o.gravity;
  particle.grow = o.grow;
  particle.composite = o.composite;
  particle.fadeSpeed = o.fadeSpeed;
  particle.fade = o.fade;

  if(particle.fade == 'in-out') {
    particle.fade = 'in';
    particle.fadeStop = false;
  }

  if(particle.shape == 'flux') {
    particle.order = 1;
  } else {
    particle.order = 0;
  }


  particle.x = Math.floor(particle.generator.randomNumber(-100, particle.generator.canvas.width+100));
  particle.y = Math.floor(particle.generator.randomNumber(-100, particle.generator.canvas.height+100));

  // Determine original X-axis speed based on setting limitation
  particle.vx = Math.floor(particle.generator.randomNumber(0, 10));
  particle.vy = Math.floor(particle.generator.randomNumber(0, 10));

  particle.size = Math.floor(particle.generator.randomNumber(particle.minSize, particle.maxSize));

  particle.rotation = Math.floor(particle.generator.randomNumber(0, 180));

  if(particle.generator.randomNumber(0,100) > 50) {
    particle.rotationDirection = 'clockwise';
  } else {
    particle.rotationDirection = 'counter-clockwise';
  }

  // Add new particle to the index
  // Object used as it's simpler to manage that an array
  particle.life = 0;
  particle.maxLife = o.maxLife;

  particle.draw();

}

Particle.prototype.render = function(shape,x,y,width,height,degrees,color,direction) {

      var particle = this,
          context = particle.generator.context;

     // first save the untranslated/unrotated context
     context.save();
    
    switch(shape) {
      case 'circle':
         var size = particle.generator.randomNumber(particle.minSize, particle.maxSize);
         context.translate(x, y);
         context.fillStyle = color;
         context.moveTo(x,y);
         context.beginPath();
         context.arc(size, size, size, 0, Math.PI*2, true);
         context.fill();
         context.closePath();
         break;

      case 'flux':
        // move the rotation point to the center of the rect
        context.translate(x, y);
        // rotate the rect
        if(direction == 'clockwise' ) {
           context.rotate(degrees*Math.PI/180);
        } else if(direction == 'counter-clockwise') {
          context.rotate(-(degrees*Math.PI/180));
        }

        context.fillStyle = color;
        context.strokeStyle = color;
        context.lineWidth = 5;

        var points = [x*0.1, y*0.1];
        context.lineWidth = 1;

        // context.moveTo(-20,20);
        context.beginPath();
        context.arc(0,0, 5, 0, Math.PI*2, true); 
        context.fill();
        context.closePath();
        context.beginPath();
        context.arc(points[0],points[1], 5, 0, Math.PI*2, true);
        context.fill();
        context.closePath();

        context.moveTo(0, 0);
        context.lineTo(0,80);
        context.lineTo(points[0],points[1]);
        context.stroke();
        context.closePath();
        break;
        
      case 'blip':
        context.translate(x, y);
        context.fillStyle = color;
        context.moveTo(x,y);
        context.beginPath();
        context.arc(30, 30, width, 0, Math.PI*2, true);
        context.fill();
        context.closePath();
        break;
    }
    
    // restore the context to its untranslated/unrotated state
    context.restore();
}

Particle.prototype.draw = function() {
  var particle = this,
      canvas = particle.generator.canvas,
      context = particle.generator.context;
 // this.x +=  1;
  particle.y +=  particle.gravity * Math.floor(particle.generator.randomNumber(1, 2));

  // Adjust for gravity
  particle.vy += particle.gravity * Math.floor(particle.generator.randomNumber(0.5, 8));

  // Age the particle
  particle.life++;
  
  if(particle.rotation == 'clockwise') {
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
  context.globalCompositeOpteration = 'destination-out';
  
  if(particle.life > particle.maxLife) {
    delete particle.generator.particles[particle.id];
  }
}

//Main plugin function
var ParticleGenerator = function(el, particles, options) {

  // console.log('particle generator initiated with these particles:');
  // console.log(particles);

  var generator = this;

  //Function for setting default & user settings
  generator.setOpts = function(standard, user) {
    if (typeof user === 'object') {
      for (var key in standard) {
        if(user[key]) {
            standard[key] = user[key];
        }
      }
    }
    return standard;
  };

  //Random Number generator funciton
  generator.randomNumber = function(min, max, frac) {
     if(frac == true) {
        return Math.random() * (max - min) + min;
     } else {
        return Math.floor(Math.random() * (max - min) + min);
     }
  };

  if(typeof(particles) === 'object') {
    var particle = particles;
    particles = new Array();
    particles.push(particle);
  }

  options = generator.setOpts({
    frameRate: 30
  }, options);

  generator.frameRate = options.frameRate;


  for(var p=0; p<particles.length; p++) {
    particles[p] = generator.setOpts({
      shape: 'circle',
      color: 'rgba(0,0,0,1)',
      minSize: 15,
      maxSize: 30,
      rotation: false,
      rotationVelocity: 0.1,
      spawnRate: 8,
      maxLife: 100,
      fade: 'in-out',
      fadeSpeed: 0.01,
      grow: false,
      gravity: 0,
      density: 20
    }, particles[p]);
  }

  generator.particleTracker = {};
  generator.particleIndex = 0;
  generator.particles = particles;

  generator.canvas = document.getElementById(el);

  generator.context = generator.canvas.getContext("2d");

  // Responsive/relative canvas sizing
  generator.sizeCanvas();
  window.onresize = function() {
    generator.sizeCanvas();
  };

  generator.start();

};

ParticleGenerator.prototype.sizeCanvas = function() {

  var generator = this,
      width = generator.canvas.getAttribute('width'),
      height = generator.canvas.getAttribute('height');

  if(!width) { width = window.getComputedStyle(generator.canvas.parentElement, null).width; }
  if(!height) { height = window.getComputedStyle(generator.canvas.parentElement, null).height; }

  generator.canvas.setAttribute('width', width);
  generator.canvas.setAttribute('height', height);
}

ParticleGenerator.prototype.stop = function() {
   clearInterval(this.animate);
}

ParticleGenerator.prototype.createParticle = function(par) {
  var particle = new Particle(par, this);
  this.particleTracker[this.particleIndex] = particle;
  this.particleIndex++;
}

ParticleGenerator.prototype.start = function() {
  var generator = this;

  // ========================================
  // For each particle type
  for(var t = 0; t < generator.particles.length; t++) {
    // console.log('particle:');
    var par = generator.particles[t];
    // Make a new particle for the particle's density setting
    for(var d = 0; d < par.density; d++) {
     generator.createParticle(par);
    }
  }


  // Interval to animate particles
  // ========================================
  generator.animate = setInterval(function() {
    // context.fillStyle = grd;
    // context.fillRect(0, 0, canvas.width, canvas.height);
    for(var s=0; s < generator.particles.length; s++) {
      var par = generator.particles[s];
      if(par.spawnRate) {
        if(generator.randomNumber(0,100) < par.spawnRate) {
          generator.createParticle(par);
        }
      }
    }
    // Draw the particles
    for (var p in generator.particleTracker) {
      generator.particleTracker[p].draw();
    }
   
  }, generator.frameRate);
}