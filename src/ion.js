// get a random number provided min & max values
function randomNumber(min, max, frac) {
   var num = Math.random() * (max - min) + min;
   if(!frac) {
      var num = Math.floor(num);
    }
    return num;
};

// Get a random rgba value
function randomRGBA() {
  return "rgba("+randomNumber(0,255)+","+randomNumber(0,255)+","+randomNumber(0.255)+","+randomNumber(0,1,true)+")";
}

// Convert hex values to rgba values
function convertHex(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    if(!opacity) { opacity = 1; }

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

// Create an array of separate values from an rgba color string
function colorArray(rgbaString) {
  return p.color.match(/(\d{1,4})/g);
}

// Strip any trailing zeros from decimal places on numbers
function getAbsValue(val) {
  var abs = Math.abs(parseFloat(val));;
  if(val.match("-")) {
    abs = -abs;
  }
  return abs;
}

// Get the number of decimal places provided a number
function decimalPlaces(num) {
  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
       0,
       // Number of digits right of decimal point.
       (match[1] ? match[1].length : 0)
       // Adjust for scientific notation.
       - (match[2] ? +match[2] : 0));
}

//Particle function
var Particle = function(particleOptions, ion) {

  var o = particleOptions,
      particle = this;

  particle.ion = ion;

  // Setup all the particle properties
  particle.init(particleOptions);

  // Draw the particle on the first frame
  particle.draw();

}

// The set property function takes care of the different types of values
// that can be passed for the same property and the default values
Particle.prototype.setProperty = function(opts) {

  var p = this,
      val = opts.value,
      prop = opts.property;

  // Check to see if the 'random' keyword was passed as the property value
  if(val == 'random') {
    // If we have an array of accepted values, choose a random value from that array
    if(opts.acceptedValues) {
      p[prop] = opts.acceptedValues[randomNumber(0, opts.acceptedValues.length)];
    // otherwise check for the "randomize" property.
    // if randomize is set to the keyword color, use the random color function to get a random rgba value
    } else if(opts.randomize == 'color') {
      p[prop] = randomRGBA();
    // Otherwise the randomize variable should be an array with the default min & max limits for that property
    // Pick a random number from that range as the property value
    } else {
      p[prop] = randomNumber(randomize[0], randomize[1], true);
    }
  // If the property value passed was an array, then the user has set custom min & max limits
  // Choose a random number from that range between
  } else if(typeof(val) =='array') {
    p[prop] = val[randomNumber(0,val.length)];
  // Otherwise, just st the property value to what was passed
  } else {
    p[prop] = val;
  }
}

Particle.prototype.init = function(o) {
  var p = this;

  // Background Color
  p.setProperty({
    property: 'color', 
    value: o.color, 
    randomize: 'color'
  });

  // Split the RGBA string in an array of values so we can fade if needed
  p.colorArray = p.color.match(/(\d{1,4})/g);

  // Border Color
  p.setProperty({
    property: 'borderColor', 
    value: o.borderColor, 
    randomize: 'color'
  });

  // Border Width
  p.setProperty({
    property: 'borderWidth', 
    value: o.borderWidth, 
    randomize: [0,10]
  });

  // Size
  p.setProperty({
    property: 'size', 
    value: o.size, 
    randomize: [1,p.ion.canvas.width*0.5]
  });

  // Shape
  p.setProperty({
    property: 'shape', 
    value: o.shape,
    acceptedValues: p.ion.shapes.keys()
  });

  // Gravity
  p.setProperty({
    property: 'gravity',
    value: o.gravity,
    randomize: [-5,5]
  });

  // Wind
  p.setProperty({
    property: 'wind',
    value: o.wind,
    randomize: [-5,5]
  });

  // Orientation
  p.setProperty({
    property: 'orient',
    value: o.orient,
    randomize: [0,360]
  });

  // Age/Death
  p.setProperty({
    property: 'death',
    value: o.death,
    randomize: [0, 3000]
  });

  // Set intial particle life to 0
  p.life = 0;

  p.setProperty({
    property: 'fade',
    value: o.fade,
    acceptedValues: ['in', 'out', 'in-out']
  });
  p.setProperty({
    property: 'fadeSpeed',
    value: o.fadeSpeed,
    randomize: [0,20]
  });


  // If the fade property is set, then we need to adjust the initial opacity
  // based on the fade animation
  if(p.fade == 'in' || p.fade == "in-out") {
    p.opacity = 0;
  } else if(p.fade == 'out') {
    p.opacity = 1
  } else {
    p.opacity = p.colorArray[3];
  }

  // Depending on what the spawn point properties are for this Particle,
  // We need to set the particle's initial x & y points
  switch(o.originX) {
    case 'left':
      p.x =  -p.size*2;
    break;
    case 'right':
      p.x = ion.canvas.width + p.size*2
    break;
    case 'center':
      p.x = ion.canvas.width*0.5
    break;
    case 'random':
      p.x = Math.floor(p.randomNumber(-p.size*2, p.ion.canvas.width+p.size*2));
    break;
    default:
      p.x = o.originX;
    break;
  }

  switch(o.originY) {
    case 'top':
      p.y =  -p.size*2;
    break;
    case 'bottom':
      p.y = ion.canvas.height + p.size*2
    break;
    case 'center':
      p.y = ion.canvas.height*0.5
    break;
    case 'random':
      var min = -p.size*2,
          max = p.ion.canvas.height+p.size*2;
      p.y = Math.floor(p.randomNumber(min, max));
    break;
    default:
      p.y = o.originY;
    break;
  }

  // Rotation Direction
  p.setProperty({
    property: 'rotationDirection',
    value: o.rotationDirection,
    acceptedValues: ['clockwise', 'counter-clockwise', 'random']
  });

  // Rotation Velocity
  p.setProperty({
    property: 'rotationVelocity',
    value: o.rotationVelocity,
    randomize: [0,10]
  });

  // Set particle's rotation
  switch(particle.rotationDirection) {
    case 'clockwise':
      particle.rotation = particle.rotationVelocity*0.01
    break;
    case 'counter-clockwise':
      particle.rotation = - particle.rotationVelocity*0.01
    break;
    case 'random':
      var chance = randomNumber(0,100);
      if(chance > 50) {
        particle.rotation = particle.rotationVelocity*0.01;
      } else {
        particle.rotation = particle.roationVelocity*0.01
      }
  }

}

// Place the drawn particle on the canvas
Particle.prototype.render = function(shape) {

      var particle = this,
          context = particle.ion.context;

      // Set the visual properties for the shape & line of the particles
      context.fillStyle = particle.color;
      context.strokeStyle = particle.borderColor;
      context.lineWidth = particle.borderWidth;

     //  save the untranslated/unrotated context
     context.save();

     // Use the drawing instructions for the particle's shape to render the particle
     particle.ion.shapes[shape](particle);
    
    // restore the context to its untranslated/unrotated state
    context.restore();
}

// Draw the particle shape
Particle.prototype.draw = function() {
  var particle = this,
      ion = particle.ion,
      canvas = ion.canvas,
      context = ion.context;

  // Adjust particle position based on wind and gravity
  particle.y +=  particle.gravity;
  particle.x += particle.wind;

  // Age the particle
  particle.life++;
  
  // Adjust the particles orientation based on rotation settings
  if(particle.rotationDirection == 'clockwise') {
    particle.rotation += particle.rotationVelocity;
  } else {
     particle.rotation -= particle.rotationVelocity;
  }
  
  // if(particle.grow) {
  //   particle.size = particle.size*particle.grow;
  // }
  
  // Adjust the particle's opacity based on the fade settings
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
 
 // Clear the canvas
  context.clearRect(canvas.width, canvas.height, canvas.width, canvas.height);
  // context.fillStyle = particle.color;
  // context.globalCompositeOperation = this.composite;

  // Render the particle on the canvas
  particle.render(particle.shape, particle.x, particle.y, particle.size, particle.size, particle.rotation, particle.color, particle.rotationDirection);
  // context.globalCompositeOpteration = 'destination-out';


   // Kill the particle if it's reached it's death or has left the visible canvas area
   if((particle.life > particle.death && particle.death != false) || 
    (particle.gravity > 0 && particle.y > canvas.height+particle.size*2) || 
    (particle.gravity < 0 && particle.y < -particle.size*2) ||
    (particle.wind < 0 && particle.x < -particle.size*2) ||
    (particle.wind > 0 && particle.x > canvas.width+particle.size*2)) {
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

  // //Random Number generator funciton
  // randomNumber = function(min, max, frac) {
  //    var num = Math.random() * (max - min) + min;
  //    if(!frac) {
  //       var num = Math.floor(num);
  //     }
  //     return num;
  // };

  ion.setOptions(options);

  // Setup a particle tracker for rendering
  ion.particleTracker = {};
  ion.particleIndex = 0;

  // Initialize the canvas
  ion.canvas = document.getElementById(el);
  ion.context = ion.canvas.getContext("2d");

  // Responsive/relative canvas sizing
  ion.sizeCanvas();
  window.onresize = function() {
    ion.sizeCanvas();
  };

  // Initialize particle generator
  ion.init();

  // If particles were passed as initial properties, add the particles and start the animations
  if(particles) {
    ion.setParticles(particles);
    ion.start();
  }

};

// Responsive canvas sizing
Ion.prototype.sizeCanvas = function() {

  var ion = this,
      width = ion.canvas.getAttribute('width'),
      height = ion.canvas.getAttribute('height');

  // If the canvas element does not have width & height properties set, 
  // set the canvas to the size of it's immediate parent
  // Otherwise, set it to the width & height properties
  if(!width) { width = window.getComputedStyle(ion.canvas.parentElement, null).width; }
  if(!height) { height = window.getComputedStyle(ion.canvas.parentElement, null).height; }

  ion.canvas.setAttribute('width', width);
  ion.canvas.setAttribute('height', height);
}

// Stop the particle generator
Ion.prototype.stop = function() {
   clearInterval(this.animate);
}

// Set particle properties
Ion.prototype.setParticles = function(particles) {

  var ion = this;

  // Check to see if we've passed a single particle settings object, 
  // or an array of particle settings. Convert to a single-item array if the former
  if(!particles.length) {
    var particle = particles;
    particles = new Array();
    particles.push(particle);
  }


  // Iterate through each particle settings object and set any unset values to the defaults
  for(var p=0; p<particles.length; p++) {
    particles[p] = ion.setOpts({
      shape: 'circle',
      color: 'rgba(0,0,0,1)',
      opacity: 1,
      borderColor: "rbga(0,0,0,0)",
      borderWidth: 0,
      borderOpacity: 1,
      size: [10,90],
      rotationDirection: 'clockwise',
      rotationVelocity: 0.1,
      orient: 0,
      spawnRate: 2,
      death: 100,
      fade: false,
      fadeSpeed: 0.01,
      grow: false,
      gravity: 1,
      wind: 1,
      density: 20,
      originX: 'random',
      originY: 'top'
    }, particles[p]);
  }
   ion.particles = particles;
   console.log(particles);

}

// Set global properties
Ion.prototype.setOptions = function(opts) {

  var ion = this;

  options = ion.setOpts({
    frameRate: 30,
    canvasBackground: 'rgba(255,255,255,1)'
  }, opts);

  ion.frameRate = options.frameRate;
  ion.canvasBackground = options.canvasBackground;

}

// Add a new particle to the generator
Ion.prototype.createParticle = function(par) {
  // Create a new instance of Particle
  var particle = new Particle(par, this);
  // Set the particle index (id)
  this.particleTracker[this.particleIndex] = particle;
  particle.id = this.particleIndex;
  // increment the particle index tracker for the next particle
  this.particleIndex++;
}

// Add a new option for particle shape
Ion.prototype.addShape = function(id, instructions) {
  this.shapes[id] = instructions;
}

// Intialize the particle generator
Ion.prototype.init = function() {
  // Add the default shapes
  this.shapes = {
    circle: drawCircle, 
    square: drawSquare
  };

}

// Start particle animation
Ion.prototype.start = function() {

  var ion = this;

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
      par.originX = par.spawnOriginX;
      par.originY = par.spawnOriginY;
      if(par.spawnRate > 0) {
        if(randomNumber(0, 25*par.density) < par.spawnRate) {
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