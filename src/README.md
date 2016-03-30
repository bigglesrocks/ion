#Ion
Ion is a particle generator written in javascript and powered by canvas

##Quickstart

All you need to get Ion up and running is a `canvas` element with an id, and the javascript initializer.

	```html
	<canvas id="my-canvas"></canvas>

	<script type="text/javascript">
		new IonGenerator('my-canvas');
	</script>
	```

##Options

The `IonGenerator` class take 3 arguments:

    new IonGenerator(canvasID, particleOptions, generatorOptions);

Options for `generatorOptions` object

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


##Roadmap

- Custom particle shapes
- Add 'wind' option to particleSettings to allow horizontal particle movement
- 
