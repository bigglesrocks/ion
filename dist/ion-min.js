function randomNumber(t,e,r){var o=Math.random()*(e-t)+t;if(!r)var o=Math.floor(o);return o}function randomRGBA(){return"rgba("+randomNumber(0,255)+","+randomNumber(0,255)+","+randomNumber(.255)+","+randomNumber(0,1,!0)+")"}function convertHex(t,e){return t=t.replace("#",""),r=parseInt(t.substring(0,2),16),g=parseInt(t.substring(2,4),16),b=parseInt(t.substring(4,6),16),e||(e=1),result="rgba("+r+","+g+","+b+","+e/100+")",result}function colorArray(t){return t.match(/(\d{1,4})/g)}function rgbaString(t){return"rgba("+t[0]+","+t[1]+","+t[2]+","+t[3]+")"}function isColor(t){return t.match(/(#(\d|[a-f]|[A-F]){6})|(rgba\((\d{1,3},\s?){3}\d?\.?\d{1}\))/g).length>0}function getAbsValue(t){var e=Math.abs(parseFloat(t));return t.match("-")&&(e=-e),e}function decimalPlaces(t){var e=(""+t).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);return e?Math.max(0,(e[1]?e[1].length:0)-(e[2]?+e[2]:0)):0}function defaultOptions(t,e){if("object"==typeof e)for(var r in t)void 0!=e[r]&&(t[r]=e[r]);return t}var Particle=function(t,e){var r=this;r.ion=e,r.init(t),r.draw()};Particle.prototype.setProperty=function(t){var e=this,r=t.value,o=t.property;"random"==r?t.acceptedValues?e[o]=t.acceptedValues[randomNumber(0,t.acceptedValues.length)]:"color"==t.randomize?e[o]=randomRGBA():e[o]=randomNumber(randomize[0],randomize[1],!0):isArray(r)?r.length>2?e[o]=r[randomNumber(0,r.length)]:e[o]=randomNumber(r[0],r[1],!0):r?e[o]=r:e[o]=!1},Particle.prototype.colorFormat=function(){var t=this,e=100*t.colorOpacity||100,r=100*t.strokeOpacity||100;t.color.indexOf(!1)&&(t.color=convertHex(t.color,e)),t.colorArray=colorArray(t.color),t.colorOpacity&&(t.colorArray[3]=t.colorOpacity),t.strokeColor.indexOf("#")>=0&&(t.strokeColor=convertHex(t.strokeColor,r)),t.strokeColorArray=colorArray(t.strokeColor),t.strokeOpacity&&(t.strokeColorArray[3]=t.strokeOpacity)},Particle.prototype.init=function(t){var e=this;t.opacity||1;switch(e.setProperty({property:"death",value:t.death,randomize:[500,3e3]}),e.life=0,e.setProperty({property:"color",value:t.color,randomize:"color"}),e.setProperty({property:"colorOpacity",value:t.colorOpacity,randomize:[0,1]}),e.setProperty({property:"strokeColor",value:t.strokeColor,randomize:"color"}),e.setProperty({property:"strokeWidth",value:t.strokeWidth,randomize:[0,10]}),e.setProperty({property:"strokeOpacity",value:t.strokeOpacity,randomize:[0,1]}),e.colorFormat(),e.setProperty({property:"size",value:t.size,randomize:[1,.5*e.ion.canvas.width]}),e.setProperty({property:"shape",value:t.shape,acceptedValues:Object.keys(e.ion.shapes)}),e.setProperty({property:"orient",value:t.orient,randomize:[0,360]}),e.setProperty({property:"gravity",value:t.gravity,randomize:[-5,5]}),e.setProperty({property:"wind",value:t.wind,randomize:[-5,5]}),e.setProperty({property:"fade",value:t.fade,acceptedValues:["in","out","in-out"]}),e.setProperty({property:"fadeRate",value:t.fadeRate,randomize:[5,20]}),e.fade?(e.fadeStop=!1,e.colorOpacityFadeIncrement=e.colorArray[3]/(100/e.fadeRate),e.strokeOpacityFadeIncrement=e.strokeColorArray[3]/(100/e.fadeRate),e.fade.indexOf("in")>=0?(e.opacity=0,e.colorArray[3]=0,e.strokeColorArray[3]=0):e.opacity=100):e.opacity=100,t.origin[0]){case"left":e.x=2*-e.size;break;case"right":e.x=ion.canvas.width+2*e.size;break;case"center":e.x=.5*ion.canvas.width;break;case"random":e.x=Math.floor(randomNumber(2*-e.size,e.ion.canvas.width+2*e.size));break;default:e.x=t.origin[0]}switch(t.origin[1]){case"top":e.y=2*-e.size;break;case"bottom":e.y=ion.canvas.height+2*e.size;break;case"center":e.y=.5*ion.canvas.height;break;case"random":var r=2*-e.size,o=e.ion.canvas.height+2*e.size;e.y=Math.floor(randomNumber(r,o));break;default:e.y=t.origin[1]}e.setProperty({property:"rotationDirection",value:t.rotationDirection,acceptedValues:["clockwise","counter-clockwise"]}),e.setProperty({property:"rotationVelocity",value:t.rotationVelocity,randomize:[0,10]}),e.setProperty({property:"scale",value:t.scale,acceptedValues:["grow","shrink"]}),e.setProperty({property:"scaleRate",value:t.scaleRate,randomize:[.1,3]});var a=0,i=e.ion.canvas.width;"grow"==e.scale?a=e.size:i=e.size,e.setProperty({property:"scaleLimit",value:t.scaleLimit,randomize:[a,i]}),e.ion.shapes[e.shape].init!==!1&&e.ion.shapes[e.shape].init(e,t.shapeProperties)},Particle.prototype.render=function(){var t=this,e=t.ion.context;e.fillStyle=t.color,e.strokeStyle=t.strokeColor,e.lineWidth=t.strokeWidth,e.save(),t.ion.shapes[t.shape].draw(t),e.restore()},Particle.prototype.draw=function(){var t=this,e=t.ion,r=e.canvas,o=e.context;if(t.y+=t.gravity,t.x+=t.wind,t.life++,t.rotationVelocity>0&&("clockwise"==t.rotationDirection?t.orient+=t.rotationVelocity:t.orient-=t.rotationVelocity),"grow"==t.scale&&t.size<t.scaleLimit?t.size+=t.scaleRate:"shrink"==t.scale&&t.size>t.scaleLimit&&(t.size-=t.scaleRate),t.fade){switch(t.fade){case"in":t.opacity<100?(t.colorArray[3]+=t.colorOpacityFadeIncrement,t.strokeColorArray[3]+=t.strokeOpacityFadeIncrement,t.opacity+=t.fadeRate):t.fade=!1;break;case"out":t.opacity>0?(t.colorArray[3]=t.colorArray[3]-t.colorOpacityFadeIncrement,t.strokeColorArray[3]=t.strokeColorArray[3]-t.strokeOpacityFadeIncrement,t.opacity=t.opacity-t.fadeRate):t.fade=!1;break;case"in-out":t.opacity>=100?(t.fadeStop=!0,t.opacity=100-t.fadeRate):0==t.fadeStop&&t.opacity<100?(t.colorArray[3]+=t.colorOpacityFadeIncrement,t.strokeColorArray[3]+=t.strokeOpacityFadeIncrement,t.opacity+=t.fadeRate):1==t.fadeStop&&t.opacity>0?(t.colorArray[3]=t.colorArray[3]-t.colorOpacityFadeIncrement,t.strokeColorArray[3]=t.stokrColorArray[3]-t.strokeOpacityFadeIncrement,t.opacity-=t.colorArray[3]-t.fadeRate):t.fade=!1}t.color=rgbaString(t.colorArray),t.strokeColor=rgbaString(t.strokeColorArray)}o.clearRect(r.width,r.height,r.width,r.height),t.render(),(t.life>t.death&&0!=t.death||t.gravity>0&&t.y>r.height+2*t.size||t.gravity<0&&t.y<2*-t.size||t.wind<0&&t.x<2*-t.size||t.wind>0&&t.x>r.width+2*t.size||t.size<=0||("out"==t.fade||"in-out"==t.fade)&&t.opacity<=0||0==t.fade&&0==t.opacity)&&delete e.particleTracker[t.id]};var Ion=function(t,e,r){var o=this;o.setOptions(r),o.particleTracker={},o.particleIndex=0,o.canvas=document.getElementById(t),o.context=o.canvas.getContext("2d"),o.sizeCanvas(),window.onresize=function(){o.sizeCanvas()},o.init(),e&&(o.setParticles(e),o.start())};Ion.prototype.sizeCanvas=function(){var t=this,e=t.canvas.getAttribute("width"),r=t.canvas.getAttribute("height");e||(e=window.getComputedStyle(t.canvas.parentElement,null).width),r||(r=window.getComputedStyle(t.canvas.parentElement,null).height),t.canvas.setAttribute("width",e),t.canvas.setAttribute("height",r)},Ion.prototype.stop=function(){clearInterval(this.animate)},Ion.prototype.setParticles=function(t){var e=this;if(!t.length){var r=t;t=new Array,t.push(r)}for(var o=0;o<t.length;o++)t[o]=defaultOptions({shape:"circle",color:"rgba(0,0,0,1)",colorOpacity:1,strokeColor:"rbga(0,0,0,0)",strokeWidth:0,strokeOpacity:1,size:[10,90],rotationDirection:"clockwise",rotationVelocity:0,orient:0,death:!1,fade:!1,fadeRate:20,scale:!1,scaleRate:.2,scaleLimit:500,gravity:1,wind:1,density:20,spawnOrigin:["random","top"],origin:["random","random"],spawnRate:2,shapeProperties:!1},t[o]);e.particles=t},Ion.prototype.setOptions=function(t){var e=this;options=defaultOptions({frameRate:30,canvasBackground:"rgba(255,255,255,1)"},t),e.frameRate=options.frameRate,e.canvasBackground=options.canvasBackground},Ion.prototype.createParticle=function(t){var e=new Particle(t,this);this.particleTracker[this.particleIndex]=e,e.id=this.particleIndex,this.particleIndex++},Ion.prototype.addShape=function(t){this.shapes[t.name].draw=t.drawingInstructions,this.shapes[t.name].init=t.init},Ion.prototype.init=function(){this.shapes={circle:{draw:drawCircle,init:!1},square:{draw:drawSquare,init:!1},triangle:{draw:drawTriangle,init:!1},star:{draw:drawStar,init:initStar}}},Ion.prototype.start=function(){for(var t=this,e=0;e<t.particles.length;e++)for(var r=t.particles[e],o=0;o<r.density;o++)t.createParticle(r);t.animate=setInterval(function(){t.context.fillStyle=t.canvasBackground,t.context.fillRect(0,0,t.canvas.width,t.canvas.height);for(var e=0;e<t.particles.length;e++){var r=t.particles[e];r.origin=r.spawnOrigin,r.spawnRate>0&&randomNumber(0,25*r.density)<r.spawnRate&&t.createParticle(r)}for(var o in t.particleTracker)t.particleTracker[o].draw()},t.frameRate)};var drawCircle=function(t){var e=t.ion.context;e.translate(t.x,t.y),e.moveTo(t.x,t.y),e.beginPath(),e.arc(0,0,.5*t.size,0,2*Math.PI,!0),e.fill(),t.strokeWidth&&e.stroke(),e.closePath()},initPolygon=function(t,e){polygonPoints=e.polygonPoints||5,t.setProperty({property:"polygonPoints",value:polygonPoints,acceptedValues:[3,4,5,6,7,8,9,10,11,12]}),t.polygonAngle=2*Math.PI/t.polygonPoints},drawPolygon=function(t){var e=t.ion.context,r=new Array;for(i=1;i<=t.polygonPoints;i++){var o=[t.size*Math.cos(t.polygonAngle*i-2*Math.PI*.2),t.size*Math.sin(t.polygonAngle*i-2*Math.PI*.2)];r.push(o)}e.translate(t.x,t.y),e.moveTo(0,0),t.orient&&e.rotate(t.orient*Math.PI/180),e.moveTo(r[0][0],r[0][1]),e.beginPath();for(var a=1;a<r.length;a++)e.lineTo(r[a][0],r[a][1]);e.lineTo(r[0][0],r[0][1]),e.closePath(),t.strokeWidth&&e.stroke(),e.fill()},drawSquare=function(t){var e=t.ion.context;e.translate(t.x,t.y),e.moveTo(0,0),t.orient&&e.rotate(t.orient*Math.PI/180),e.moveTo(t.x-.5*t.size,t.y-.5*t.size),e.beginPath(),e.rect(.5*-t.size,.5*-t.size,t.size,t.size),e.fill(),t.strokeWidth&&e.stroke(),e.closePath()},initStar=function(t,e){polygonPoints=e.polygonPoints||5,starGirth=e.starGirth||.5,t.setProperty({property:"polygonPoints",value:polygonPoints,acceptedValues:[3,4,5,6,7,8,9,10,11,12]}),t.setProperty({property:"starGirth",value:starGirth,randomize:[.05,1]}),t.starAngle=2*Math.PI/t.polygonPoints},drawStar=function(t){var e=t.ion.context,r=new Array;for(i=1;i<=t.polygonPoints;i++){var o=[0+t.size*Math.cos(t.starAngle*i-2*Math.PI*.2),0+t.size*Math.sin(t.starAngle*i-2*Math.PI*.2)],a=[0+t.size*t.starGirth*Math.cos(t.starAngle*(i-1)+.5*t.starAngle-2*Math.PI*.2),0+t.size*t.starGirth*Math.sin(t.starAngle*(i-1)+.5*t.starAngle-2*Math.PI*.2)];r.push(a),r.push(o)}e.translate(t.x,t.y),e.moveTo(0,0),t.orient&&e.rotate(t.orient*Math.PI/180),e.moveTo(r[0][0],r[0][1]),e.beginPath();for(var n=1;n<r.length;n++)e.lineTo(r[n][0],r[n][1]);e.lineTo(r[0][0],r[0][1]),e.closePath(),t.strokeWidth&&e.stroke(),e.fill()},drawTriangle=function(t){var e=t.ion.context;e.translate(t.x,t.y),e.moveTo(t.x,t.y),t.orient&&e.rotate(t.orient*Math.PI/180),e.moveTo(t.x,t.y),e.beginPath(),e.lineTo(.5*t.size,.5*t.size),e.lineTo(.5*-t.size,.5*t.size),e.lineTo(0,.4*-t.size),e.closePath(),e.fill(),t.strokeWidth&&e.stroke()};isArray=function(t){return"[object Array]"==Object.prototype.toString.call(t)};