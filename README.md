#Ion
Ion is a particle generator written in javascript and powered by canvas

##Quickstart

All you need to get Ion up and running is a `canvas` element with an id, and the javascript initializer.

	```html
	<canvas id="my-canvas"></canvas>

	<script type="text/javascript">
		var g = new IonGenerator('my-canvas');
        g.start();
	</script>
	```

##Initializing Ion

The `Ion` class can take 3 arguments:

    new IonGenerator(canvasID, particles, options);

`canvasID` is a string id of the canvas element and is required.

You may pass either a Particle settings object or array of Particle settings objects for the `particles` parameter. This parameter is optional, and useful to leave of if you want to create custom particles before starting animation.

The `options` parameter is an Ion settings object. 


##Options

The options object takes 2 parameters

| Option | Description | Accepted Values | Default Value |
|:------:|:-----------:|:---------------:|:-------------:|
| frameRate | The frame rate for how often the canvas is redrawn. Smaller framerate will result in smoother animation | integer | 30 |
| canvasBackground | Solid color for the canvas background | color | rgba(255,255,255,1) |  


##Particles
Ion works by creating multiple individual shapes (particles) and animating them on the canvas. 

###Particle Options
You can specify the shape of Ion's particles by modifying the values passed in `particleOpions`:

| Option | Description | Accepted values | Default value |
|:------:|:-----------:|:---------------:|:-------------:|
| shape | A keyword for a shape preset | keyword: circle, square, iso-triangle, right-triangle, star | circle |
| color | The fill color for the shape | rgba color value | rgba(0,0,0,1) |
| border | The border style for the shape | border value | ex. 2px dotted red |
| minSize | A minimum size for the shape | integer | 15 |
| maxSize | A maximum size for the shape | integer | 30 |
| rotation | Rotation speed for the shape. Settings this to false or 0 will result in no rotation | number or false | false |
| spawnRate | How quickly new shapes are added to the canvas. Setting this to 0 or false will prevent new shapes from being created | integer or false | 8 |
| maxLife | How long shapes remain on the canvas. Setting this to false will make shapes 'immortal' | integer | 100 |
| fade | Add fade out or fade in to particles. Setting fade to false will result in no fade | keyword: fade-out, fade-in, fade-in-out | false |
| fadeSpeed | A speed for how quickly the fade animation happens on particles | number | 0.01 |
| grow | A number for how quickly a shape increases in size. Setting this to a negative number will shrink the shape. Setting this number to false will keep particles a constant size. | number | false |
| gravity | A number for the amount of vertical pull on particles. Positive numbers will pull shapes towards the bottom, negative will pull shapes towards the top | number | -0.5 |
| density | A multiplier for the amount of shapes initially drawn onto the canvas | integer | 20 |

###Mulitple particle shapes

You can draw muliple particle shapes on the canvas by passing an array of particleSettings to the the `IonGenerator`

    ```javascript
    	new IonGenerator('my-canvas', [
    		{ shape: 'circle',
    		  color: 'rgba(0,0,0,1)' },
    		{ shape: 'square',
    		   color: 'rgba(255,255,154,1)',
    		   border: '1px solid red' }
    	]);
    ```

###Particle Randomization

###Parallax/Depth

You can acheive a sense of depth by passing multiple particle settings of the same (or different) particles with different wind or gravity settings. This will create multiple "planes" of particles moving at different speeds.    

###Custom Particle shapes

You can add custom shapes to the particle generator by using the `Ion.addShape()` function. `addShape()` takes 2 arguments: a name and a function containing instructions for drawing the shape onto the canvas. The instructions function takes one argument: a particle instance.

    ```javascript
        g = new Ion('my-canvas');
        g.addShape('crescent', function(p) {
            // Get our context from the particle's generator
            var ctx = p.generator.context;
            // Move to the current coordinates for the particle
             ctx.translate(p.x, p.y);

             // Instructions ...
        });
        g.start();
    ````

You have access to all of the particle's properties and methods inside the addShape instructions function and can access them with `p.propertyName`. 

| Property | Description |
|:--------:|:-----------:|
| shape | string name for particle's shape |
| x | current x coordinate |
| y | current y coordinate |
| size | initial size |
| gravity | vertical movement modifier |
| wind | horizontal movement modifier |
| color | particle background color - string (rgba) |
| colorArray | An array of the particle's rgba color values |
| borderColor | particle stroke color - string (rgba)|
| borderWidth | particle stroke size |
| orient | initial rotation |
| rotationDirection | Direction particle is set to rotate |
| rotationVelocity | Speed particle is set to rotate |
| rotation | current rotation |
| fade | Animation for particle fade |
| fadeSpeed | How fast the particle fades |
| maxLife | Time after spawn at which the particle dies |
| life | Particle's current age |






