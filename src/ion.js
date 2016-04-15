//Particle function
var Particle = function(particleOptions, ion) {

  var o = particleOptions,
      p = this;

  p.ion = ion;

  // Setup all the particle properties
  p.init(particleOptions);

  // Draw the particle on the first frame
  p.draw();

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
  } else if(isArray(val)) {
    // If our array contains only 2 values, use them as min/max values
    if(val.length > 2) {
      p[prop] = val[randomNumber(0, val.length)];
    // if there's more that 2 values, use those as a list of values to select from
    } else {
       p[prop] = randomNumber(val[0],val[1],true);
    }
  // Otherwise, just st the property value to what was passed
  } else if(val) {
    p[prop] = val;
  } else {
    p[prop] = false;
  }

}

Particle.prototype.colorFormat = function() {
  var rgbaString,
      p = this,
      colorOpacity = p.colorOpacity*100 || 100,
      strokeOpacity = p.strokeOpacity*100 || 100;

  //Check if we have a hex value
  if(p.color.indexOf('#' >= 0)) {
    p.color = convertHex(p.color, colorOpacity);
  }
  p.colorArray = colorArray(p.color);

  if(p.colorOpacity) {
    p.colorArray[3] = p.colorOpacity;
  }

  if(p.strokeColor.indexOf('#') >= 0) {
    p.strokeColor = convertHex(p.strokeColor, strokeOpacity);
  }
  p.strokeColorArray = colorArray(p.strokeColor);
  if(p.strokeOpacity) {
    p.strokeColorArray[3] = p.strokeOpacity;
  }

}

Particle.prototype.init = function(o) {
  var p = this,
      opacity = o.opacity || 1;

  p.setProperty({
    property: 'death',
    value: o.death,
    randomize: [500,3000]
  });

  p.life = 0;

  // Colors
  // ========================================
  
  // Color
  p.setProperty({
    property: 'color', 
    value: o.color, 
    randomize: 'color'
  });

   // Opacity
  p.setProperty({
    property: 'colorOpacity', 
    value: o.colorOpacity, 
    randomize: [0,1]
  });

  // Stroke Color
  p.setProperty({
    property: 'strokeColor', 
    value: o.strokeColor, 
    randomize: 'color'
  });


  //Stroke Width
  p.setProperty({
    property: 'strokeWidth', 
    value: o.strokeWidth, 
    randomize: [0,10]
  });

  //Stroke Width
  p.setProperty({
    property: 'strokeOpacity', 
    value: o.strokeOpacity, 
    randomize: [0,1]
  });

  p.colorFormat();

  // Format
  // ========================================

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
    acceptedValues: Object.keys(p.ion.shapes)
  });

  // Orientation
  p.setProperty({
    property: 'orient',
    value: o.orient,
    randomize: [0,360]
  });

  // Movement
  // ========================================
  
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

  // Dynamics
  // ========================================

  p.setProperty({
    property: 'fade',
    value: o.fade,
    acceptedValues: ['in', 'out', 'in-out']
  });

  // Fade Rate
  p.setProperty({
    property: 'fadeRate',
    value: o.fadeRate,
    randomize: [5,20]
  });

  // If the fade property is set, then we need to adjust the initial opacity
  // based on the fade animation
  if(p.fade) {
    p.fadeStop = false;
    p.colorOpacityFadeIncrement = p.colorArray[3]/(100/p.fadeRate);
    p.strokeOpacityFadeIncrement = p.strokeColorArray[3]/(100/p.fadeRate);
    if(p.fade.indexOf('in') >= 0) {
      p.opacity = 0;
      p.colorArray[3] = 0;
      p.strokeColorArray[3] = 0;
    } else {
      p.opacity = 100;
    }
  } else {
    p.opacity = 100;
  }

  // Depending on what the spawn point properties are for this Particle,
  // We need to set the particle's initial x & y points
  switch(o.origin[0]) {
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
      p.x = Math.floor(randomNumber(-p.size*2, p.ion.canvas.width+p.size*2));
    break;
    default:
      p.x = o.origin[0];
    break;
  }

  switch(o.origin[1]) {
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
      p.y = Math.floor(randomNumber(min, max));
    break;
    default:
      p.y = o.origin[1];
    break;
  }

  // Rotation Direction
  p.setProperty({
    property: 'rotationDirection',
    value: o.rotationDirection,
    acceptedValues: ['clockwise', 'counter-clockwise']
  });

  // Rotation Velocity
  p.setProperty({
    property: 'rotationVelocity',
    value: o.rotationVelocity,
    randomize: [0,10]
  });

  //Scale
  p.setProperty({
    property: 'scale',
    value: o.scale,
    acceptedValues: ['grow','shrink']
  });

  //Scale Rate
  p.setProperty({
    property: 'scaleRate',
    value: o.scaleRate,
    randomize: [0.1,3]
  });

  var scaleLimitMin = 0,
      scaleLimitMax = p.ion.canvas.width;

  p.scale == "grow" ? scaleLimitMin = p.size : scaleLimitMax = p.size

  p.setProperty({
    property: 'scaleLimit',
    value: o.scaleLimit,
    randomize: [scaleLimitMin, scaleLimitMax]
  });

  // Set additional custom particle properties, if passed
  if(p.ion.shapes[p.shape].init !== false) {
    p.ion.shapes[p.shape].init(p,o.shapeProperties);
  }

}

// Place the drawn particle on the canvas
Particle.prototype.render = function() {

      var p = this,
          context = p.ion.context;

      // Set the visual properties for the shape & line of the particles
      context.fillStyle = p.color;
      context.strokeStyle = p.strokeColor;
      context.lineWidth = p.strokeWidth;

     //  save the untranslated/unrotated context
     context.save();

     // Use the drawing instructions for the particle's shape to render the particle
     p.ion.shapes[p.shape].draw(p);
    
    // restore the context to its untranslated/unrotated state
    context.restore();

}

// Draw the particle shape
Particle.prototype.draw = function() {
  var p = this,
      ion = p.ion,
      canvas = ion.canvas,
      context = ion.context;

  // Adjust particle position based on wind and gravity
  p.y +=  p.gravity;
  p.x += p.wind;

  // Age the particle
  p.life++;
  
  // Adjust the particles orientation based on rotation settings
  if(p.rotationVelocity > 0) {

    if(p.rotationDirection == 'clockwise') {
      p.orient += p.rotationVelocity;
    } else {
       p.orient -= p.rotationVelocity;
    }
  }

  // Adjust particle size based on scaling options
  if(p.scale == 'grow' && p.size < p.scaleLimit) {
     p.size += p.scaleRate;
  } else if(p.scale == 'shrink' && p.size > p.scaleLimit) {
     p.size -= p.scaleRate;
  }
  
  if(p.fade) {
    switch(p.fade) {
        case 'in':
          if(p.opacity < 100) {
             p.colorArray[3] += p.colorOpacityFadeIncrement;
             p.strokeColorArray[3] += p.strokeOpacityFadeIncrement;
             p.opacity += p.fadeRate;
          } else {
            p.fade = false;
          }
        break;
        case 'out':
          if(p.opacity > 0) {
             p.colorArray[3] = p.colorArray[3] - p.colorOpacityFadeIncrement;
             p.strokeColorArray[3] = p.strokeColorArray[3] - p.strokeOpacityFadeIncrement;
             p.opacity = p.opacity - p.fadeRate;
          } else {
            p.fade = false;
          }
        break;
        case 'in-out':
          if(p.opacity >= 100) {
            p.fadeStop = true;
            p.opacity = 100 - p.fadeRate;
          } else if(p.fadeStop == false && p.opacity < 100) {
             p.colorArray[3] += p.colorOpacityFadeIncrement;
             p.strokeColorArray[3] += p.strokeOpacityFadeIncrement;
             p.opacity += p.fadeRate;
          } else if(p.fadeStop == true && p.opacity > 0) {
            p.colorArray[3] =  p.colorArray[3] - p.colorOpacityFadeIncrement;
            p.strokeColorArray[3] = p.stokrColorArray[3] - p.strokeOpacityFadeIncrement;
            p.opacity -= p.colorArray[3] - p.fadeRate;
          } else {
            p.fade = false;
          }
        break;
    }
    p.color = rgbaString(p.colorArray); 
    p.strokeColor = rgbaString(p.strokeColorArray);

  }

 // Clear the canvas
  context.clearRect(canvas.width, canvas.height, canvas.width, canvas.height);

  // context.globalCompositeOperation = this.composite;

  // Render the particle on the canvas
  p.render();

  // context.globalCompositeOpteration = 'destination-out';


   // Kill the particle if it has:
   // 1.) Reached it's death age
   // 2.) Moved beyond the visible boundries of the canvas
   // 3.) Shrunk down to nothing
   // 4.) Faded out to zero opacity
 if(
  (p.life > p.death && p.death != false) || 
  (p.gravity > 0 && p.y > canvas.height+p.size*2) || 
  (p.gravity < 0 && p.y < -p.size*2) ||
  (p.wind < 0 && p.x < -p.size*2) ||
  (p.wind > 0 && p.x > canvas.width+p.size*2) ||
  (p.size <= 0) ||
  ((p.fade == 'out' || p.fade == "in-out") && p.opacity <= 0) ||
  (p.fade == false && p.opacity == 0)
  ) {
    delete ion.particleTracker[p.id];
  }


}

//Main plugin function
var Ion = function(el, particles, options) {

  var ion = this;

  //Function for setting default & user settings

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
    particles[p] = defaultOptions({
      shape: 'circle',
      color: 'rgba(0,0,0,1)',
      colorOpacity: 1,
      strokeColor: "rbga(0,0,0,0)",
      strokeWidth: 0,
      strokeOpacity: 1,
      size: [10,90],
      rotationDirection: 'clockwise',
      rotationVelocity: 0,
      orient: 0,
      death: false,
      fade: false,
      fadeRate: 20,
      scale: false,
      scaleRate: 0.2,
      scaleLimit: 500,
      gravity: 1,
      wind: 1,
      density: 20,
      spawnOrigin: ['random', 'top'],
      origin: ['random', 'random'],
      spawnRate: 2,
      shapeProperties: false
    }, particles[p]);
  }
   ion.particles = particles;

}

// Set global properties
Ion.prototype.setOptions = function(opts) {

  var ion = this;

  options = defaultOptions({
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
Ion.prototype.addShape = function(opts) {
  this.shapes[opts.name].draw = opts.drawingInstructions;
  this.shapes[opts.name].init = opts.init;
}

// Intialize the particle generator
Ion.prototype.init = function() {
  // Add the default shapes
  this.shapes = {
    circle: { draw: drawCircle, init: false },
    square: { draw: drawSquare, init: false },
    triangle: { draw: drawTriangle, init: false },
    star: { draw: drawStar, init: initStar }
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
      par.origin = par.spawnOrigin;
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