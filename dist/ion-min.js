function randomNumber(min,max,frac){var num=Math.random()*(max-min)+min;if(!frac)var num=Math.floor(num);return num}function randomRGBA(){return"rgba("+randomNumber(0,255)+","+randomNumber(0,255)+","+randomNumber(.255)+","+randomNumber(0,1,!0)+")"}function convertHex(hex,opacity){return hex=hex.replace("#",""),r=parseInt(hex.substring(0,2),16),g=parseInt(hex.substring(2,4),16),b=parseInt(hex.substring(4,6),16),opacity||(opacity=1),result="rgba("+r+","+g+","+b+","+opacity/100+")",result}function colorArray(rgbaString){return rgbaString.match(/(\d{1,4})/g)}function rgbaString(arr){return"rgba("+arr[0]+","+arr[1]+","+arr[2]+","+arr[3]+")"}function isColor(color){return color.match(/(#(\d|[a-f]|[A-F]){6})|(rgba\((\d{1,3},\s?){3}\d?\.?\d{1}\))/g).length>0}function getAbsValue(val){var abs=Math.abs(parseFloat(val));return val.match("-")&&(abs=-abs),abs}function decimalPlaces(num){var match=(""+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);return match?Math.max(0,(match[1]?match[1].length:0)-(match[2]?+match[2]:0)):0}function defaultOptions(standard,user){if("object"==typeof user)for(var key in standard)void 0!=user[key]&&(standard[key]=user[key]);return standard}var Particle=function(particleOptions,ion){var p=this;p.ion=ion,p.init(particleOptions),p.draw()};Particle.prototype.setProperty=function(opts){var p=this,val=opts.value,prop=opts.property;"random"==val?opts.acceptedValues?p[prop]=opts.acceptedValues[randomNumber(0,opts.acceptedValues.length)]:"color"==opts.randomize?p[prop]=randomRGBA():p[prop]=randomNumber(randomize[0],randomize[1],!0):isArray(val)?val.length>2?p[prop]=val[randomNumber(0,val.length)]:p[prop]=randomNumber(val[0],val[1],!0):val?p[prop]=val:p[prop]=!1},Particle.prototype.colorFormat=function(){var p=this,colorOpacity=100*p.colorOpacity||100,strokeOpacity=100*p.strokeOpacity||100;p.color.indexOf(!1)&&(p.color=convertHex(p.color,colorOpacity)),p.colorArray=colorArray(p.color),p.colorOpacity&&(p.colorArray[3]=p.colorOpacity),p.strokeColor.indexOf("#")>=0&&(p.strokeColor=convertHex(p.strokeColor,strokeOpacity)),p.strokeColorArray=colorArray(p.strokeColor),p.strokeOpacity&&(p.strokeColorArray[3]=p.strokeOpacity)},Particle.prototype.init=function(o){var p=this;o.opacity||1;switch(p.setProperty({property:"color",value:o.color,randomize:"color"}),p.setProperty({property:"colorOpacity",value:o.colorOpacity,randomize:[0,1]}),p.setProperty({property:"strokeColor",value:o.strokeColor,randomize:"color"}),p.setProperty({property:"strokeWidth",value:o.strokeWidth,randomize:[0,10]}),p.setProperty({property:"strokeOpacity",value:o.strokeOpacity,randomize:[0,1]}),p.colorFormat(),p.setProperty({property:"size",value:o.size,randomize:[1,.5*p.ion.canvas.width]}),p.setProperty({property:"shape",value:o.shape,acceptedValues:Object.keys(p.ion.shapes)}),p.setProperty({property:"orient",value:o.orient,randomize:[0,360]}),p.setProperty({property:"gravity",value:o.gravity,randomize:[-5,5]}),p.setProperty({property:"wind",value:o.wind,randomize:[-5,5]}),p.setProperty({property:"fade",value:o.fade,acceptedValues:["in","out","in-out"]}),p.setProperty({property:"fadeRate",value:o.fadeRate,randomize:[5,20]}),p.fade?(p.fadeStop=!1,p.colorOpacityFadeIncrement=p.colorArray[3]/(100/p.fadeRate),p.strokeOpacityFadeIncrement=p.strokeColorArray[3]/(100/p.fadeRate),p.fade.indexOf("in")>=0?(p.opacity=0,p.colorArray[3]=0,p.strokeColorArray[3]=0):p.opacity=100):p.opacity=100,o.origin[0]){case"left":p.x=2*-p.size;break;case"right":p.x=ion.canvas.width+2*p.size;break;case"center":p.x=.5*ion.canvas.width;break;case"random":p.x=Math.floor(randomNumber(2*-p.size,p.ion.canvas.width+2*p.size));break;default:p.x=o.origin[0]}switch(o.origin[1]){case"top":p.y=2*-p.size;break;case"bottom":p.y=ion.canvas.height+2*p.size;break;case"center":p.y=.5*ion.canvas.height;break;case"random":var min=2*-p.size,max=p.ion.canvas.height+2*p.size;p.y=Math.floor(randomNumber(min,max));break;default:p.y=o.origin[1]}p.setProperty({property:"rotationDirection",value:o.rotationDirection,acceptedValues:["clockwise","counter-clockwise"]}),p.setProperty({property:"rotationVelocity",value:o.rotationVelocity,randomize:[0,10]}),p.setProperty({property:"scale",value:o.scale,acceptedValues:["grow","shrink"]}),p.setProperty({property:"scaleRate",value:o.scaleRate,randomize:[.1,3]});var scaleLimitMin=0,scaleLimitMax=p.ion.canvas.width;"grow"==p.scale?scaleLimitMin=p.size:scaleLimitMax=p.size,p.setProperty({property:"scaleLimit",value:o.scaleLimit,randomize:[scaleLimitMin,scaleLimitMax]})},Particle.prototype.render=function(){var p=this,context=p.ion.context;context.fillStyle=p.color,context.strokeStyle=p.strokeColor,context.lineWidth=p.strokeWidth,context.save(),p.ion.shapes[p.shape](p),context.restore()},Particle.prototype.draw=function(){var p=this,ion=p.ion,canvas=ion.canvas,context=ion.context;if(p.y+=p.gravity,p.x+=p.wind,p.life++,p.rotationVelocity>0&&("clockwise"==p.rotationDirection?p.orient+=p.rotationVelocity:p.orient-=p.rotationVelocity),"grow"==p.scale&&p.size<p.scaleLimit?p.size+=p.scaleRate:"shrink"==p.scale&&p.size>p.scaleLimit&&(p.size-=p.scaleRate),p.fade){switch(p.fade){case"in":p.opacity<100?(p.colorArray[3]+=p.colorOpacityFadeIncrement,p.strokeColorArray[3]+=p.strokeOpacityFadeIncrement,p.opacity+=p.fadeRate):p.fade=!1;break;case"out":p.opacity>0?(p.colorArray[3]=p.colorArray[3]-p.colorOpacityFadeIncrement,p.strokeColorArray[3]=p.strokeColorArray[3]-p.strokeOpacityFadeIncrement,p.opacity=p.opacity-p.fadeRate):p.fade=!1;break;case"in-out":p.opacity>=100?(p.fadeStop=!0,p.opacity=100-p.fadeRate):0==p.fadeStop&&p.opacity<100?(p.colorArray[3]+=p.colorOpacityFadeIncrement,p.strokeColorArray[3]+=p.strokeOpacityFadeIncrement,p.opacity+=p.fadeRate):1==p.fadeStop&&p.opacity>0?(p.colorArray[3]=p.colorArray[3]-p.colorOpacityFadeIncrement,p.strokeColorArray[3]=p.stokrColorArray[3]-p.strokeOpacityFadeIncrement,p.opacity-=p.colorArray[3]-p.fadeRate):p.fade=!1}p.color=rgbaString(p.colorArray),p.strokeColor=rgbaString(p.strokeColorArray)}context.clearRect(canvas.width,canvas.height,canvas.width,canvas.height),p.render(),(p.life>p.death&&0!=p.death||p.gravity>0&&p.y>canvas.height+2*p.size||p.gravity<0&&p.y<2*-p.size||p.wind<0&&p.x<2*-p.size||p.wind>0&&p.x>canvas.width+2*p.size||p.size<=0||("out"==p.fade||"in-out"==p.fade)&&p.opacity<=0||0==p.fade&&0==p.opacity)&&delete ion.particleTracker[p.id]};var Ion=function(el,particles,options){var ion=this;ion.setOptions(options),ion.particleTracker={},ion.particleIndex=0,ion.canvas=document.getElementById(el),ion.context=ion.canvas.getContext("2d"),ion.sizeCanvas(),window.onresize=function(){ion.sizeCanvas()},ion.init(),particles&&(ion.setParticles(particles),ion.start())};Ion.prototype.sizeCanvas=function(){var ion=this,width=ion.canvas.getAttribute("width"),height=ion.canvas.getAttribute("height");width||(width=window.getComputedStyle(ion.canvas.parentElement,null).width),height||(height=window.getComputedStyle(ion.canvas.parentElement,null).height),ion.canvas.setAttribute("width",width),ion.canvas.setAttribute("height",height)},Ion.prototype.stop=function(){clearInterval(this.animate)},Ion.prototype.setParticles=function(particles){var ion=this;if(!particles.length){var particle=particles;particles=new Array,particles.push(particle)}for(var p=0;p<particles.length;p++)particles[p]=defaultOptions({shape:"circle",color:"rgba(0,0,0,1)",colorOpacity:1,strokeColor:"rbga(0,0,0,0)",strokeWidth:0,strokeOpacity:1,size:[10,90],rotationDirection:"clockwise",rotationVelocity:0,orient:0,death:!1,fade:!1,fadeRate:20,scale:!1,scaleRate:.2,scaleLimit:500,gravity:1,wind:1,density:20,spawnOrigin:["random","top"],origin:["random","random"],spawnRate:2},particles[p]);ion.particles=particles},Ion.prototype.setOptions=function(opts){var ion=this;options=defaultOptions({frameRate:30,canvasBackground:"rgba(255,255,255,1)"},opts),ion.frameRate=options.frameRate,ion.canvasBackground=options.canvasBackground},Ion.prototype.createParticle=function(par){var particle=new Particle(par,this);this.particleTracker[this.particleIndex]=particle,particle.id=this.particleIndex,this.particleIndex++},Ion.prototype.addShape=function(id,instructions){this.shapes[id]=instructions},Ion.prototype.init=function(){this.shapes={circle:drawCircle,square:drawSquare}},Ion.prototype.start=function(){for(var ion=this,t=0;t<ion.particles.length;t++)for(var par=ion.particles[t],d=0;d<par.density;d++)ion.createParticle(par);ion.animate=setInterval(function(){ion.context.fillStyle=ion.canvasBackground,ion.context.fillRect(0,0,ion.canvas.width,ion.canvas.height);for(var s=0;s<ion.particles.length;s++){var par=ion.particles[s];par.origin=par.spawnOrigin,par.spawnRate>0&&randomNumber(0,25*par.density)<par.spawnRate&&ion.createParticle(par)}for(var p in ion.particleTracker)ion.particleTracker[p].draw()},ion.frameRate)};var drawCircle=function(p){var ctx=p.ion.context;ctx.translate(p.x,p.y),ctx.moveTo(p.x,p.y),ctx.beginPath(),ctx.arc(30,30,p.size,0,2*Math.PI,!0),ctx.fill(),p.strokeWidth&&ctx.stroke(),ctx.closePath()},drawSquare=function(p){var ctx=p.ion.context;ctx.translate(p.x,p.y),ctx.moveTo(p.x,p.y),p.orient&&ctx.rotate(p.orient*Math.PI/180),ctx.moveTo(p.x-.5*p.size,p.y-.5*p.size),ctx.beginPath(),ctx.rect(.5*-p.size,.5*-p.size,p.size,p.size),ctx.fill(),p.strokeWidth&&ctx.stroke(),ctx.closePath()};isArray=function(val){return"[object Array]"==Object.prototype.toString.call(val)};